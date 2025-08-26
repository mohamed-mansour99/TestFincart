import React from 'react'

type Props = { value: string; onChange: (v: string) => void }

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      className="input"
      type="search"
      placeholder="Search products..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search products"
    />
  )
}
