import { ProductCard } from './ProductCard'
import type { Product } from '../../payload-types'

interface ProductGridProps {
  products: Product[]
  wishlistedProductIds?: number[]
}

export function ProductGrid({ products, wishlistedProductIds }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistedProductIds?.includes(product.id)}
        />
      ))}
    </div>
  )
}
