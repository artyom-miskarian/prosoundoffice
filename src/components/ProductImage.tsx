import { useState } from 'react'
import type { Product } from '../lib/types'

export default function ProductImage({
  product,
  className = '',
  sizes,
  loading = 'lazy',
}: {
  product: Product
  className?: string
  sizes?: string
  loading?: 'lazy' | 'eager'
}) {
  const [src, setSrc] = useState(product.image)

  return (
    <img
      src={src}
      alt={product.code}
      className={className}
      sizes={sizes}
      loading={loading}
      decoding="async"
      onError={() => {
        if (product.remoteImage && src !== product.remoteImage) setSrc(product.remoteImage)
      }}
    />
  )
}
