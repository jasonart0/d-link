/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Search } from 'lucide-react'

export function Input({ placeholder }) {
  return (
    <label className="search-field">
      <Search size={16} aria-hidden="true" />
      <input placeholder={placeholder} type="search" />
    </label>
  )
}
