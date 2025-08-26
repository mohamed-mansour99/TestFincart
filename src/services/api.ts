const BASE = 'https://api.escuelajs.co/api/v1';

export type FetchOpts = {
  signal?: AbortSignal;
};

export async function fetchProducts(params: { offset: number; limit: number; categoryId?: number; search?: string }, opts: FetchOpts = {}) {
  const url = new URL(BASE + '/products');
  url.searchParams.set('offset', String(params.offset));
  url.searchParams.set('limit', String(params.limit));
  if (params.categoryId != null) url.searchParams.set('categoryId', String(params.categoryId));
  if (params.search) url.searchParams.set('title', params.search); // API supports title search
  const res = await fetch(url, { signal: opts.signal });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function fetchCategories(opts: FetchOpts = {}) {
  const res = await fetch(BASE + '/categories', { signal: opts.signal });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}
