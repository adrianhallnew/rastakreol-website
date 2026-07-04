// Plain sync helper, not a Server Action — files with 'use server' at the top (cart/actions.ts)
// can only export async Server Actions, so this can't live there even though it's cart-related.
export function priceForVariant(
  product: { price: number; sale_price?: number | null; on_sale?: boolean | null },
  variant: { price_override?: number | null },
): number {
  if (variant.price_override != null) return variant.price_override
  if (product.on_sale && product.sale_price != null) return product.sale_price
  return product.price
}
