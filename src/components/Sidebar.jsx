/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Activity, BarChart3, BellRing, BriefcaseBusiness, LineChart, Radar, ShieldCheck, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', path: '/', icon: BarChart3 },
  { label: 'Signals', path: '/signals', icon: Activity },
  { label: 'Strategies', path: '/strategies', icon: Radar },
  { label: 'Portfolio', path: '/portfolio', icon: BriefcaseBusiness },
  { label: 'Alerts', path: '/alerts', icon: BellRing },
  { label: 'Risk Guard', path: '/risk-guard', icon: ShieldCheck },
]

export function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? 'is-open' : ''}`}>
      <div className="sidebar-head">
        <span>Command Center</span>
        <button className="icon-btn mobile-only" type="button" onClick={onClose} aria-label="Close navigation">
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <nav>
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink className={({ isActive }) => (isActive ? 'active' : '')} end={path === '/'} key={label} onClick={onClose} to={path}>
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-card">
        <LineChart size={20} aria-hidden="true" />
        <strong>Train Module</strong>
        <span>Candle features train live model predictions.</span>
      </div>
    </aside>
  )
}
