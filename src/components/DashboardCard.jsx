/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { memo } from 'react'

export const DashboardCard = memo(function DashboardCard({ icon: Icon, label, value, description, tone = 'neutral' }) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <div className="metric-icon">
        <Icon size={18} aria-hidden="true" />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{description}</small>
    </article>
  )
})
