/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export function Loader({ label = 'Loading' }) {
  return (
    <div className="loader">
      <span />
      <p>{label}</p>
    </div>
  )
}
