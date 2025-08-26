import React, { memo } from 'react'
import { Product } from '@types/index'
import { useCart } from '@store/cart'
import { formatPrice } from '@utils/format'

type Props = { product: Product }

const ProductCard = memo(({ product }: Props) => {
  const add = useCart((s) => s.add)
  const onAdd = () => add(product, 1)
  const img = product.images?.[0] || ''
  return (
    <div className="card">
      <img src={img} alt={product.title} loading="lazy" />
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <strong>{product.title}</strong>
          <span className="price">{formatPrice(product.price)}</span>
        </div>
        <span className="badge">{product.category?.name}</span>
        <button className="btn primary" onClick={onAdd} aria-label={`Add ${product.title} to cart`}>Add to cart</button>
      </div>
    </div>
  )
})

export default ProductCard
