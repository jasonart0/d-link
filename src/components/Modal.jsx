/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { X } from 'lucide-react'

export function Modal({ open, title, children, onClose }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <button className="icon-btn" type="button" onClick={onClose} aria-label="Close modal">
          <X size={18} aria-hidden="true" />
        </button>
        <h2>{title}</h2>
        {children}
      </section>
    </div>
  )
}
