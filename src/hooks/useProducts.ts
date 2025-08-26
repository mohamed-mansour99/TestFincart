import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
 import { fetchProducts, fetchCategories } from '@services/api'
import { Product } from '@customTypes/index';
   
const LIMIT = 10;

export function useCategories() {
  const [categories, setCategories] = useState<{id:number; name:string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(null);
    fetchCategories({ signal: controller.signal }).then((data) => {
      const mapped = data.map((c: any) => ({ id: c.id, name: c.name }));
      setCategories(mapped);
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return { categories, loading, error };
}

export function useInfiniteProducts(params: { categoryId?: number; search?: string }) {
  const { categoryId, search } = params;
  const [items, setItems] = useState<Product[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const key = useMemo(() => JSON.stringify({ categoryId, search }), [categoryId, search]);

  const load = useCallback(async ({ reset = false } = {}) => {
    if (loading) return;
    if (!hasMore && !reset) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true); setError(null);
    try {
      const nextOffset = reset ? 0 : offset;
      const data: Product[] = await fetchProducts({ offset: nextOffset, limit: LIMIT, categoryId, search }, { signal: controller.signal });
      setHasMore(data.length === LIMIT);
      setOffset(nextOffset + data.length);
      setItems((prev) => reset ? data : [...prev, ...data]);
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e.message || 'Error loading products');
    } finally {
      setLoading(false);
    }
  }, [offset, categoryId, search, loading, hasMore]);

  // Reset when key changes
  useEffect(() => {
    setItems([]); setOffset(0); setHasMore(true);
    load({ reset: true }); // TS will complain if not correct literal
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // fix true -> true for TS by runtime replace in build, but keep code correct here
  return { items, loading, error, hasMore, load };
}
