/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'

export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const Icon = theme === 'dark' ? Moon : Sun

  return (
    <button className="icon-btn" type="button" onClick={toggleTheme} aria-label="Toggle theme">
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
