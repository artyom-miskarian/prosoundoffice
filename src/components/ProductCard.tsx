import { Link } from 'react-router-dom'
import ProductImage from './ProductImage'
import type { Product } from '../lib/types'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.categorySlug}/${product.slug}`}
      className="group flex flex-col border border-line bg-card transition-colors hover:border-faint"
    >
      <div className="relative aspect-4/3 shrink-0 bg-white">
        <ProductImage
          product={product}
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="absolute inset-0 h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="caps text-base">{product.code}</h3>
        {product.tagline && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{product.tagline}</p>
        )}
        <span className="caps mt-6 text-[11px] text-faint transition-colors group-hover:text-bright">
          Product Information
        </span>
      </div>
    </Link>
  )
}
