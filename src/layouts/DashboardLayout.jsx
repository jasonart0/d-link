/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { useCallback, useState } from 'react'
import { appConfig } from '../config/appConfig.js'
import { Header } from '../components/Header.jsx'
import { Sidebar } from '../components/Sidebar.jsx'
import { Footer } from '../components/Footer.jsx'

export function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [market, setMarket] = useState(appConfig.defaultMarket)
  const [timeframe, setTimeframe] = useState(appConfig.defaultTimeframe)
  const toggleSidebar = useCallback(() => setSidebarOpen((open) => !open), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="content-shell">
        <Header
          market={market}
          timeframe={timeframe}
          onMarketChange={setMarket}
          onTimeframeChange={setTimeframe}
          onSidebarToggle={toggleSidebar}
        />
        <main>{children({ market, timeframe })}</main>
        <Footer />
      </div>
    </div>
  )
}
