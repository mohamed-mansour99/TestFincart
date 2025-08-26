import React from 'react'
import { useCart, useCartTotals } from '@store/cart'
import { formatPrice } from '@utils/format'

type Props = { open: boolean; onClose: () => void }

export default function CartDrawer({ open, onClose }: Props) {
  const items = useCart((s) => s.items)
  const inc = useCart((s) => s.inc)
  const dec = useCart((s) => s.dec)
  const remove = useCart((s) => s.remove)
  const clear = useCart((s) => s.clear)
  const { count, total } = useCartTotals()

  return (
    <aside className={`cart-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Cart">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Cart <span className="badge">{count} items</span></h3>
        <button className="btn" onClick={onClose}>Close</button>
      </div>
      <div className="divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '70vh', overflow: 'auto' }}>
        {Object.values(items).length === 0 && <p className="muted">Your cart is empty.</p>}
        {Object.values(items).map(({ product, qty }) => (
          <div key={product.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img src={product.images?.[0]} alt={product.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{product.title}</strong>
                <span>{formatPrice(product.price * qty)}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <button className="btn" onClick={() => dec(product.id)}>-</button>
                <span>{qty}</span>
                <button className="btn" onClick={() => inc(product.id)}>+</button>
                <button className="btn" onClick={() => remove(product.id)} style={{ marginLeft: 'auto' }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="divider" />
      <div className="row">
        <strong>Total</strong>
        <strong>{formatPrice(total)}</strong>
      </div>
      <button className="btn" onClick={clear} style={{ marginTop: 12 }}>Clear cart</button>
    </aside>
  )
}
