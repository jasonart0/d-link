/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Loader } from './components/Loader.jsx'

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const InnerPage = lazy(() => import('./pages/InnerPage.jsx'))

function App() {
  return (
    <Suspense fallback={<Loader label="Loading trading intelligence" />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/signals" element={<InnerPage page="signals" />} />
        <Route path="/strategies" element={<InnerPage page="strategies" />} />
        <Route path="/portfolio" element={<InnerPage page="portfolio" />} />
        <Route path="/alerts" element={<InnerPage page="alerts" />} />
        <Route path="/risk-guard" element={<InnerPage page="riskGuard" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
