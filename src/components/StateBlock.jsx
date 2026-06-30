/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react'

export function StateBlock({ error, loading, empty, emptyText = 'No data available yet.' }) {
  if (loading) {
    return (
      <div className="state-block">
        <LoaderCircle size={18} aria-hidden="true" />
        <span>Loading API data</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-block state-error">
        <AlertTriangle size={18} aria-hidden="true" />
        <span>{error}</span>
      </div>
    )
  }

  if (empty) {
    return (
      <div className="state-block">
        <Inbox size={18} aria-hidden="true" />
        <span>{emptyText}</span>
      </div>
    )
  }

  return null
}
