import React from 'react'

type Props = {
  categories: { id: number; name: string }[]
  value?: number
  onChange: (id?: number) => void
  loading?: boolean
}

export default function CategoryFilter({ categories, value, onChange, loading }: Props) {
  return (
    <select className="select" value={value ?? ''} onChange={(e) => {
      const v = e.target.value
      onChange(v ? Number(v) : undefined)
    }} aria-label="Filter by category" disabled={loading}>
      <option value="">All categories</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  )
}
