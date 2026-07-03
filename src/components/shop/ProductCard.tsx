import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '../ui/Badge'
import { WishlistButtonToggle } from './WishlistButtonToggle'
import { formatPrice } from '../../lib/format-price'
import type { Product } from '../../payload-types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images?.[0]?.image
  const imageUrl = typeof image === 'object' ? image.sizes?.card?.url || image.url : undefined
  const imageAlt = typeof image === 'object' ? image.alt : product.name

  const category = typeof product.category === 'object' ? product.category : undefined

  const variants = product.variants ?? []
  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const isOutOfStock = variants.length > 0 && totalStock <= 0
  const isLowStock = !isOutOfStock && totalStock > 0 && totalStock <= 10

  const onSale = product.on_sale && product.sale_price != null

  return (
    <Link
      href={`/products/${product.slug}`}
      aria-label={`${product.name}, ${formatPrice(onSale ? product.sale_price! : product.price)}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-brand-paper shadow-card">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt ?? product.name}
            fill
            loading="lazy"
            // Payload's storage plugin already renders sized/compressed WebP variants
            // via Sharp at upload time — re-optimizing through Next's own pipeline is
            // redundant, and blocks local-dev media serving outright (Next's optimizer
            // refuses to fetch from private/loopback IPs, which localhost resolves to).
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-[var(--motion-state)] ease-out-quart group-hover:scale-[1.015] ${isOutOfStock ? 'opacity-40' : ''}`}
          />
        )}
        <WishlistButtonToggle productName={product.name} />
        {isOutOfStock && (
          <span className="absolute left-2 top-2">
            <Badge variant="oos">Out of stock</Badge>
          </span>
        )}
        {!isOutOfStock && onSale && (
          <span className="absolute left-2 top-2">
            <Badge variant="sale">Sale</Badge>
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        {category && <Badge variant="category">{category.name}</Badge>}
        <h3 className="line-clamp-2 font-display text-lg font-semibold text-brand-ink">{product.name}</h3>
        {onSale ? (
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-brand-ink">{formatPrice(product.sale_price!)}</span>
            <span className="text-sm text-brand-muted line-through">{formatPrice(product.price)}</span>
          </div>
        ) : (
          <p className="text-base font-medium text-brand-ink">{formatPrice(product.price)}</p>
        )}
        {isLowStock && <Badge variant="low-stock">Only {totalStock} left</Badge>}
      </div>
    </Link>
  )
}
