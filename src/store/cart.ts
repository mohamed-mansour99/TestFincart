import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Product, CartItem } from '@types/index'

type State = {
  items: Record<number, CartItem>;
}
type Actions = {
  add: (product: Product, qty?: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  inc: (productId: number) => void;
  dec: (productId: number) => void;
}

export const useCart = create<State & Actions>()(
  persist(
    (set, get) => ({
      items: {},
      add: (product, qty = 1) => set((state) => {
        const existing = state.items[product.id];
        const nextQty = (existing?.qty ?? 0) + qty;
        return { items: { ...state.items, [product.id]: { product, qty: nextQty } } };
      }),
      remove: (productId) => set((state) => {
        const { [productId]: _removed, ...rest } = state.items;
        return { items: rest };
      }),
      clear: () => set({ items: {} }),
      inc: (productId) => set((state) => {
        const it = state.items[productId]; if (!it) return {};
        return { items: { ...state.items, [productId]: { ...it, qty: it.qty + 1 } } };
      }),
      dec: (productId) => set((state) => {
        const it = state.items[productId]; if (!it) return {};
        const next = Math.max(0, it.qty - 1);
        if (next === 0) {
          const { [productId]: _r, ...rest } = state.items; return { items: rest };
        }
        return { items: { ...state.items, [productId]: { ...it, qty: next } } };
      }),
    }),
    {
      name: 'cart-v1',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export const useCartTotals = () => {
  return useCart((state) => {
    const entries = Object.values(state.items);
    const count = entries.reduce((n, it) => n + it.qty, 0);
    const total = entries.reduce((sum, it) => sum + it.qty * it.product.price, 0);
    return { count, total };
  })
}
