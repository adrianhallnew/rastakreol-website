import type { Metadata } from 'next'
import { CartContents } from '../../../components/cart/CartContents'
import { getCart } from '../../../lib/cart/actions'
import type { CartLineItemData } from '../../../components/cart/CartLineItem'
import type { Product } from '../../../payload-types'

export const metadata: Metadata = { title: 'Your cart' }

export default async function CartPage() {
  const cart = await getCart(3) // depth 3: items[].product.images[].image resolved to Media

  const items: CartLineItemData[] = (cart?.items ?? [])
    .filter((item): item is typeof item & { product: Product } => typeof item.product === 'object')
    .map((item) => {
      const product = item.product
      const image = product.images?.[0]?.image
      const imageUrl = (typeof image === 'object' ? image.sizes?.thumbnail?.url || image.url : undefined) ?? undefined
      const imageAlt = typeof image === 'object' ? image.alt : product.name
      const variant = (product.variants ?? []).find((v) => v.sku === item.variant_sku)

      return {
        variantSku: item.variant_sku,
        productSlug: product.slug,
        productName: product.name,
        size: item.size,
        quantity: item.quantity,
        priceSnapshot: item.price_snapshot,
        imageUrl,
        imageAlt: imageAlt ?? undefined,
        maxStock: variant?.stock ?? item.quantity,
      }
    })

  return (
    <div>
      <div className="px-4 pt-6 text-center">
        <h1 className="font-display text-2xl font-bold text-brand-ink">Your cart</h1>
      </div>
      <CartContents initialItems={items} />
    </div>
  )
}
