import { Link } from 'react-router-dom'
import { partner } from '../config'
import type { Category } from '../lib/types'

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/products/${category.slug}`}
      className="group flex flex-col border border-line bg-card transition-colors hover:border-faint"
    >
      <div className="relative aspect-16/9 shrink-0 overflow-hidden bg-ink">
        <img
          src={category.image}
          alt={`${partner.name} ${category.title} series loudspeakers`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-7">
        <h3 className="caps text-lg">{category.title}</h3>

        {category.description && (
          <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
            {category.description}
          </p>
        )}

        <div className="mt-7 flex items-center justify-between border-t border-line pt-5">
          <span className="caps text-xs text-bright">View Products</span>
          <span className="text-xs text-faint">
            {category.productCount}{' '}
            {category.productCount === 1 ? 'model' : 'models'}
          </span>
        </div>
      </div>
    </Link>
  )
}
