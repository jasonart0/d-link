/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export const formatCurrency = (value) => {
  const number = Number(value)
  if (!Number.isFinite(number)) return '-'

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(number)
}

export const formatPercent = (value) => {
  const number = Number(value)
  return Number.isFinite(number) ? `${number.toFixed(2)}%` : '-'
}
