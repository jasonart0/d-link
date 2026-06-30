/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { useState } from 'react'
import { appConfig } from '../config/appConfig.js'
import { Header } from '../components/Header.jsx'
import { Footer } from '../components/Footer.jsx'

export function DashboardLayout({ children }) {
  const [market] = useState(appConfig.defaultMarket)
  const [timeframe, setTimeframe] = useState(appConfig.defaultTimeframe)

  return (
    <div className="app-shell">
      <div className="content-shell">
        <Header />
        <main>{children({ market, timeframe, onTimeframeChange: setTimeframe })}</main>
        <Footer />
      </div>
    </div>
  )
}
