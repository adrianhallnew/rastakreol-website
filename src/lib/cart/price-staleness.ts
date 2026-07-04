'use server'

import { getOwnedCartWithProducts, updateCartItemQuantityAction } from './actions'
import { priceForVariant } from './price-for-variant'
import type { Product } from '../../payload-types'

export interface StaleCartItem {
  variantSku: string
  productName: string
  size: string
  oldPrice: number
  newPrice: number
}

// Spec 3.5: "if product price changed since add, show old vs new price — customer must
// acknowledge before proceeding." Compares each line item's price_snapshot (set at add-to-cart
// time) against the live price computed the same way addToCartAction does.
export async function checkCartPriceStaleness(): Promise<StaleCartItem[]> {
  const { cart } = await getOwnedCartWithProducts()
  if (!cart) return []

  const stale: StaleCartItem[] = []
  for (const item of cart.items ?? []) {
    if (typeof item.product !== 'object') continue
    const product = item.product as Product
    const variant = (product.variants ?? []).find((v) => v.sku === item.variant_sku)
    if (!variant) continue

    const livePrice = priceForVariant(product, variant)
    if (livePrice !== item.price_snapshot) {
      stale.push({
        variantSku: item.variant_sku,
        productName: product.name,
        size: item.size,
        oldPrice: item.price_snapshot,
        newPrice: livePrice,
      })
    }
  }
  return stale
}

// Refreshes every line item's price_snapshot to the current live price — reuses
// updateCartItemQuantityAction's own price recomputation (it always recomputes
// price_snapshot from the live product, regardless of whether quantity changed) rather than
// duplicating that logic here.
export async function acknowledgeCartPriceChanges(): Promise<void> {
  const { cart } = await getOwnedCartWithProducts()
  if (!cart) return

  for (const item of cart.items ?? []) {
    await updateCartItemQuantityAction(item.variant_sku, item.quantity)
  }
}
