'use server'

import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../auth/get-current-customer'
import { clearGuestCartId, getGuestCartId, getOrCreateGuestCartId } from './guest-session'
import { priceForVariant } from './price-for-variant'
import type { Cart, Customer } from '../../payload-types'

export type CartActionResult = { success: true } | { success: false; error: string }

function ownedCartWhere(customer: Customer | null, sessionId: string | null): Where | null {
  if (customer) return { customer: { equals: customer.id } }
  if (sessionId) return { session_id: { equals: sessionId } }
  return null
}

// Looks up the caller's cart by identity-scoped query only — the client never supplies a
// cart id, so there's no separate "verify ownership" step needed: a doc can only come back
// if it matches the caller's own customer id or guest session id.
async function getOwnedCart(
  depth = 0,
): Promise<{ cart: Cart | null; customer: Customer | null; sessionId: string | null }> {
  const payload = await getPayload({ config })
  const customer = await getCurrentCustomer()
  const sessionId = customer ? null : await getGuestCartId()
  const where = ownedCartWhere(customer, sessionId)
  if (!where) return { cart: null, customer, sessionId }

  const result = await payload.find({ collection: 'cart', where, limit: 1, depth, overrideAccess: true })
  return { cart: result.docs[0] ?? null, customer, sessionId }
}

// depth 0 (default): items[].product stays a bare id — enough for a quantity sum.
// depth 3: /cart page needs items[].product.images[].image resolved all the way to a
// real Media doc (cart -> product -> images.image -> media = 3 relationship hops).
export async function getCart(depth = 0): Promise<Cart | null> {
  const { cart } = await getOwnedCart(depth)
  return cart
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart()
  return (cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
}

export async function addToCartAction(
  productId: number,
  variantSku: string,
  size: string,
  quantity: number,
): Promise<CartActionResult> {
  if (quantity < 1) return { success: false, error: 'Quantity must be at least 1.' }

  const payload = await getPayload({ config })

  // Re-fetch server-side — never trust client-supplied price/stock.
  const product = await payload.findByID({ collection: 'products', id: productId, overrideAccess: true })
  if (!product || product.status !== 'published') {
    return { success: false, error: 'Product not available.' }
  }

  const variant = (product.variants ?? []).find((v) => v.sku === variantSku && v.size === size)
  if (!variant) return { success: false, error: 'Selected size is not available.' }

  const { customer, sessionId: existingSessionId } = await getOwnedCart()
  const sessionId = customer ? null : (existingSessionId ?? (await getOrCreateGuestCartId()))
  const where = ownedCartWhere(customer, sessionId)
  const existing = where
    ? await payload.find({ collection: 'cart', where, limit: 1, overrideAccess: true })
    : null
  const cart = existing?.docs[0]

  const priceSnapshot = priceForVariant(product, variant)
  const addedAt = new Date().toISOString()

  if (!cart) {
    if (variant.stock < quantity) return { success: false, error: 'Not enough stock available.' }
    await payload.create({
      collection: 'cart',
      data: {
        customer: customer?.id,
        session_id: sessionId ?? undefined,
        items: [
          { product: productId, variant_sku: variantSku, size, quantity, price_snapshot: priceSnapshot, added_at: addedAt },
        ],
      },
      overrideAccess: true,
    })
    return { success: true }
  }

  const items = [...(cart.items ?? [])]
  const idx = items.findIndex((i) => i.variant_sku === variantSku)
  const newQuantity = idx >= 0 ? items[idx].quantity + quantity : quantity
  if (variant.stock < newQuantity) return { success: false, error: 'Not enough stock available.' }

  if (idx >= 0) {
    items[idx] = { ...items[idx], quantity: newQuantity, price_snapshot: priceSnapshot }
  } else {
    items.push({ product: productId, variant_sku: variantSku, size, quantity, price_snapshot: priceSnapshot, added_at: addedAt })
  }

  await payload.update({ collection: 'cart', id: cart.id, data: { items }, overrideAccess: true })
  return { success: true }
}

export async function updateCartItemQuantityAction(
  variantSku: string,
  quantity: number,
): Promise<CartActionResult> {
  const payload = await getPayload({ config })
  const { cart } = await getOwnedCart()
  if (!cart) return { success: false, error: 'Cart not found.' }

  const items = cart.items ?? []
  const idx = items.findIndex((i) => i.variant_sku === variantSku)
  if (idx === -1) return { success: false, error: 'Item not found in cart.' }

  if (quantity <= 0) {
    const newItems = items.filter((_, i) => i !== idx)
    await payload.update({ collection: 'cart', id: cart.id, data: { items: newItems }, overrideAccess: true })
    return { success: true }
  }

  const productId = typeof items[idx].product === 'object' ? items[idx].product.id : items[idx].product
  const product = await payload.findByID({ collection: 'products', id: productId, overrideAccess: true })
  const variant = (product.variants ?? []).find((v) => v.sku === variantSku)
  if (!variant || variant.stock < quantity) return { success: false, error: 'Not enough stock available.' }

  const newItems = [...items]
  newItems[idx] = { ...newItems[idx], quantity, price_snapshot: priceForVariant(product, variant) }
  await payload.update({ collection: 'cart', id: cart.id, data: { items: newItems }, overrideAccess: true })
  return { success: true }
}

export async function removeCartItemAction(variantSku: string): Promise<CartActionResult> {
  return updateCartItemQuantityAction(variantSku, 0)
}

// Called right after an order is created from the cart's contents — empties the line items
// rather than deleting the cart doc itself (keeps the same doc/session_id around for the
// customer's next shopping trip instead of minting a new one).
export async function clearCart(): Promise<void> {
  const payload = await getPayload({ config })
  const { cart } = await getOwnedCart()
  if (!cart) return
  await payload.update({ collection: 'cart', id: cart.id, data: { items: [] }, overrideAccess: true })
}

// Exposed for the price-staleness check (src/lib/cart/price-staleness.ts) and checkout's order
// creation — both need the caller's cart with product/variant data resolved.
export async function getOwnedCartWithProducts(): Promise<{ cart: Cart | null; customer: Customer | null }> {
  const { cart, customer } = await getOwnedCart(1) // depth 1: items[].product resolves to a full Product
  return { cart, customer }
}

// Called right after a guest logs in or registers. Folds an existing guest cart (identified
// by the httpOnly cookie, not anything client-supplied) into the customer's cart — matching
// SKUs sum quantities, everything else is appended. Stock isn't re-validated here; that
// happens at checkout's price/availability staleness check, not on every login.
export async function mergeGuestCartIntoCustomer(customerId: number): Promise<void> {
  const sessionId = await getGuestCartId()
  if (!sessionId) return

  const payload = await getPayload({ config })
  const guestResult = await payload.find({
    collection: 'cart',
    where: { session_id: { equals: sessionId } },
    limit: 1,
    overrideAccess: true,
  })
  const guestCart = guestResult.docs[0]
  if (!guestCart) {
    await clearGuestCartId()
    return
  }

  const customerResult = await payload.find({
    collection: 'cart',
    where: { customer: { equals: customerId } },
    limit: 1,
    overrideAccess: true,
  })
  const customerCart = customerResult.docs[0]

  if (!customerCart) {
    await payload.update({
      collection: 'cart',
      id: guestCart.id,
      data: { customer: customerId, session_id: null },
      overrideAccess: true,
    })
  } else {
    const merged = [...(customerCart.items ?? [])]
    for (const guestItem of guestCart.items ?? []) {
      const idx = merged.findIndex((i) => i.variant_sku === guestItem.variant_sku)
      if (idx >= 0) {
        merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + guestItem.quantity }
      } else {
        merged.push(guestItem)
      }
    }
    await payload.update({ collection: 'cart', id: customerCart.id, data: { items: merged }, overrideAccess: true })
    await payload.delete({ collection: 'cart', id: guestCart.id, overrideAccess: true })
  }

  await clearGuestCartId()
}
