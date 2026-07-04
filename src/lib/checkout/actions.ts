'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentCustomer } from '../auth/get-current-customer'
import { getOwnedCartWithProducts, clearCart } from '../cart/actions'
import type { Product } from '../../payload-types'

export type CreateOrderResult = { success: true; orderId: number } | { success: false; error: string }

// The address step (checkout's Step 1) already saved the customer's address back to their
// profile via updateProfileAction — this reads it from there rather than needing it passed
// through again, so the order's shipping_address always matches what was actually confirmed.
export async function createOrderAction(
  deliveryMethod: 'courier' | 'pickup',
  pickupLocationLabel: string | null,
): Promise<CreateOrderResult> {
  const customer = await getCurrentCustomer()
  if (!customer) return { success: false, error: 'Not logged in.' }

  const { cart } = await getOwnedCartWithProducts()
  if (!cart || (cart.items ?? []).length === 0) {
    return { success: false, error: 'Your cart is empty.' }
  }

  const payload = await getPayload({ config })

  // Re-validate stock and build order line items server-side — never trust client-supplied
  // price/stock, same principle as addToCartAction.
  const orderItems: {
    product: number
    variant_sku: string
    size: string
    quantity: number
    unit_price: number
  }[] = []
  let subtotal = 0

  for (const item of cart.items ?? []) {
    if (typeof item.product !== 'object') continue
    const product = item.product as Product
    const variant = (product.variants ?? []).find((v) => v.sku === item.variant_sku)
    if (!variant || variant.stock < item.quantity) {
      return {
        success: false,
        error: `${product.name} (${item.size}) is no longer available in the requested quantity.`,
      }
    }
    orderItems.push({
      product: product.id,
      variant_sku: item.variant_sku,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.price_snapshot,
    })
    subtotal += item.price_snapshot * item.quantity
  }

  if (orderItems.length === 0) return { success: false, error: 'Your cart is empty.' }

  const shippingSettings = await payload.findGlobal({ slug: 'shipping-settings', overrideAccess: true })
  let shippingCost = 0
  if (deliveryMethod === 'courier') {
    const threshold = shippingSettings.free_shipping_threshold
    shippingCost = threshold != null && subtotal >= threshold ? 0 : (shippingSettings.courier_rate ?? 0)
  }

  const total = subtotal + shippingCost

  const order = await payload.create({
    collection: 'orders',
    data: {
      customer: customer.id,
      status: 'pending',
      items: orderItems,
      subtotal,
      shipping_cost: shippingCost,
      total,
      shipping_address: {
        name: customer.name ?? null,
        phone: customer.phone ?? null,
        address_line1: customer.address_line1 ?? null,
        address_line2: customer.address_line2 ?? null,
        district: customer.district ?? null,
        island: customer.island ?? null,
      },
      delivery_method: deliveryMethod,
      pickup_location: deliveryMethod === 'pickup' ? (pickupLocationLabel ?? undefined) : undefined,
      payment_status: 'pending',
    },
    overrideAccess: true,
  })

  await clearCart()

  return { success: true, orderId: order.id }
}
