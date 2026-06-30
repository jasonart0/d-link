/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Bell, BrainCircuit, Settings, UserRound } from 'lucide-react'
import { memo } from 'react'
import { appConfig } from '../config/appConfig.js'
import { ThemeSwitch } from './ThemeSwitch.jsx'

export const Header = memo(function Header() {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">
          <BrainCircuit size={20} aria-hidden="true" />
        </span>
        <div>
          <strong>{appConfig.appName}</strong>
          <span>Enterprise Edition</span>
        </div>
      </div>
      <div className="header-controls" />
      <div className="header-actions">
        <button className="icon-btn" type="button" aria-label="Notifications">
          <Bell size={18} aria-hidden="true" />
        </button>
        <ThemeSwitch />
        <button className="icon-btn" type="button" aria-label="Settings">
          <Settings size={18} aria-hidden="true" />
        </button>
        <button className="profile-btn" type="button" aria-label="User profile">
          <UserRound size={17} aria-hidden="true" />
          <span>TJ</span>
        </button>
      </div>
    </header>
  )
})
