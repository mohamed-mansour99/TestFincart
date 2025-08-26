import React, { useEffect, useRef } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@types/index'

type Props = {
  items: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function ProductList({ items, loading, error, hasMore, onLoadMore }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) onLoadMore()
    }, { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [onLoadMore])

  return (
    <>
      {error && <div className="error" role="alert">{error}</div>}
      <div className="grid">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
      <div ref={ref} className="sentinel" aria-hidden />
      {loading && <p className="muted">Loading…</p>}
      {!hasMore && !loading && <p className="muted">No more products.</p>}
    </>
  )
}
