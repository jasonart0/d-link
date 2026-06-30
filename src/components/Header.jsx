/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Bell, BrainCircuit, Menu, Settings, UserRound } from 'lucide-react'
import { memo } from 'react'
import { appConfig } from '../config/appConfig.js'
import { markets, timeframes } from '../constants/markets.js'
import { Dropdown } from './Dropdown.jsx'
import { Input } from './Input.jsx'
import { ThemeSwitch } from './ThemeSwitch.jsx'

export const Header = memo(function Header({
  market,
  timeframe,
  onMarketChange,
  onTimeframeChange,
  onSidebarToggle,
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <button className="icon-btn mobile-only" type="button" onClick={onSidebarToggle} aria-label="Open navigation">
          <Menu size={19} aria-hidden="true" />
        </button>
        <span className="brand-mark">
          <BrainCircuit size={20} aria-hidden="true" />
        </span>
        <div>
          <strong>{appConfig.appName}</strong>
          <span>Enterprise Edition</span>
        </div>
      </div>
      <div className="header-controls">
        <Dropdown label="Market" value={market} options={markets} onChange={onMarketChange} />
        <Dropdown label="Timeframe" value={timeframe} options={timeframes} onChange={onTimeframeChange} />
        <Input placeholder="Search markets" />
      </div>
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
