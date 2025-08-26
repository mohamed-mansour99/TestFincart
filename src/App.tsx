import React, { useCallback, useMemo, useState } from 'react'
import SearchBar from '@components/SearchBar'
import CategoryFilter from '@components/CategoryFilter'
import ProductList from '@components/ProductList'
import CartDrawer from '@components/CartDrawer'
import { useCategories, useInfiniteProducts } from '@hooks/useProducts'
import { useDebounce } from '@hooks/useDebounce'
import { useCartTotals } from '@store/cart'

export default function App() {
  const [rawSearch, setRawSearch] = useState('')
  const search = useDebounce(rawSearch, 400)
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)

  const { categories, loading: catLoading } = useCategories()
  const { items, loading, error, hasMore, load } = useInfiniteProducts({ categoryId, search })
  const { count } = useCartTotals()

  const handleLoadMore = useCallback(() => load(), [load])

  const [open, setOpen] = useState(false)
  const toggleCart = useCallback(() => setOpen((v) => !v), [])

  const title = useMemo(() => {
    if (categoryId) {
      const c = categories.find(c => c.id === categoryId)?.name
      return c ? `Products • ${c}` : 'Products'
    }
    return 'Products'
  }, [categoryId, categories])

  return (
    <>
      <header className="header">
        <div className="container row">
          <h2>E‑commerce</h2>
          <div className="toolbar">
            <SearchBar value={rawSearch} onChange={setRawSearch} />
            <CategoryFilter categories={categories} value={categoryId} onChange={setCategoryId} loading={catLoading} />
            <button className="btn" onClick={toggleCart}>Cart • <span className="badge">{count}</span></button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 20 }}>
        <h3 style={{ marginBottom: 12 }}>{title}</h3>
        <ProductList items={items} loading={loading} error={error} hasMore={hasMore} onLoadMore={handleLoadMore} />
      </main>

      <CartDrawer open={open} onClose={toggleCart} />
    </>
  )
}
