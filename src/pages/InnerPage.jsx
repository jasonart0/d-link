/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  Gauge,
  LineChart,
  Radar,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react'
import { ChartPanel } from '../components/ChartPanel.jsx'
import { DashboardCard } from '../components/DashboardCard.jsx'
import { Notification } from '../components/Notification.jsx'
import { Skeleton } from '../components/Skeleton.jsx'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { useMarketAnalysis } from '../hooks/useMarketAnalysis.js'
import { formatCurrency, formatPercent } from '../utils/formatters.js'

const pageMeta = {
  signals: {
    eyebrow: 'Signals',
    title: 'Live signal data.',
    description: 'Entry, confidence, risk, and direction from current candles.',
    icon: Activity,
  },
  strategies: {
    eyebrow: 'Strategies',
    title: 'Strategy fit.',
    description: 'Momentum, breakout, pullback, and defensive bias.',
    icon: Radar,
  },
  portfolio: {
    eyebrow: 'Portfolio',
    title: 'Position planning.',
    description: 'Allocation, exposure, and trade levels from the current signal.',
    icon: BriefcaseBusiness,
  },
  alerts: {
    eyebrow: 'Alerts',
    title: 'Market alerts.',
    description: 'Support, resistance, confidence, risk, and volatility triggers.',
    icon: BellRing,
  },
  riskGuard: {
    eyebrow: 'Risk Guard',
    title: 'Risk controls.',
    description: 'Stop distance, risk state, liquidity, and execution guardrails.',
    icon: ShieldCheck,
  },
}

const makeRows = ({ page, analysis, market, timeframe }) => {
  const riskLabel = analysis.riskScore > 62 ? 'Elevated' : analysis.riskScore > 42 ? 'Moderate' : 'Controlled'
  const positionSize = Math.max(5, Math.min(35, Math.round((100 - analysis.riskScore) * 0.32)))
  const stopDistance = Math.abs(((analysis.entryPrice - analysis.stopLoss) / analysis.entryPrice) * 100)
  const targetDistance = Math.abs(((analysis.takeProfit - analysis.entryPrice) / analysis.entryPrice) * 100)

  const rows = {
    signals: [
      { label: 'Primary Signal', value: analysis.signal, detail: analysis.recommendation, icon: TrendingUp, tone: 'green' },
      { label: 'Confidence', value: `${analysis.confidenceScore}%`, detail: `${timeframe} weighted certainty`, icon: Gauge, tone: 'blue' },
      { label: 'Risk State', value: riskLabel, detail: `${analysis.riskScore}% composite risk`, icon: AlertTriangle, tone: 'red' },
      { label: 'Momentum', value: formatPercent(analysis.momentum), detail: analysis.marketDirection, icon: LineChart, tone: 'violet' },
      { label: 'Entry Level', value: formatCurrency(analysis.entryPrice), detail: `${market} calculated entry`, icon: Target, tone: 'green' },
      { label: 'Target Level', value: formatCurrency(analysis.takeProfit), detail: `${formatPercent(targetDistance)} away from entry`, icon: BadgeDollarSign, tone: 'blue' },
    ],
    strategies: [
      { label: 'Momentum Strategy', value: analysis.trend === 'Bullish' ? 'Active' : 'Watch', detail: `${formatPercent(analysis.momentum)} momentum`, icon: Activity, tone: 'green' },
      { label: 'Breakout Strategy', value: analysis.currentPrice > analysis.resistance ? 'Triggered' : 'Pending', detail: `Resistance ${formatCurrency(analysis.resistance)}`, icon: TrendingUp, tone: 'blue' },
      { label: 'Pullback Strategy', value: analysis.signal === 'Buy' ? 'Preferred' : 'Standby', detail: `Support ${formatCurrency(analysis.support)}`, icon: Target, tone: 'violet' },
      { label: 'Defensive Strategy', value: riskLabel, detail: `${analysis.riskScore}% risk score`, icon: ShieldCheck, tone: 'red' },
    ],
    portfolio: [
      { label: 'Suggested Exposure', value: `${positionSize}%`, detail: 'Risk-adjusted max allocation', icon: BriefcaseBusiness, tone: 'green' },
      { label: 'Cash Reserve', value: `${100 - positionSize}%`, detail: 'Unallocated protection buffer', icon: BadgeDollarSign, tone: 'blue' },
      { label: 'Stop Distance', value: formatPercent(stopDistance), detail: formatCurrency(analysis.stopLoss), icon: ShieldCheck, tone: 'red' },
      { label: 'Reward Distance', value: formatPercent(targetDistance), detail: formatCurrency(analysis.takeProfit), icon: Target, tone: 'violet' },
    ],
    alerts: [
      { label: 'Support Alert', value: formatCurrency(analysis.support), detail: 'Price approaching demand zone', icon: BellRing, tone: 'blue' },
      { label: 'Resistance Alert', value: formatCurrency(analysis.resistance), detail: 'Price approaching supply zone', icon: AlertTriangle, tone: 'violet' },
      { label: 'Confidence Alert', value: `${analysis.confidenceScore}%`, detail: analysis.confidenceScore > 66 ? 'Signal quality is strong' : 'Needs confirmation', icon: CheckCircle2, tone: 'green' },
      { label: 'Risk Alert', value: `${analysis.riskScore}%`, detail: riskLabel, icon: ShieldCheck, tone: 'red' },
    ],
    riskGuard: [
      { label: 'Risk Score', value: `${analysis.riskScore}%`, detail: riskLabel, icon: ShieldCheck, tone: 'red' },
      { label: 'Volatility', value: formatPercent(analysis.volatility), detail: analysis.marketStatus, icon: Activity, tone: 'violet' },
      { label: 'Liquidity', value: `${analysis.liquidityScore}%`, detail: `${analysis.volumeStrength}% volume strength`, icon: Gauge, tone: 'blue' },
      { label: 'Stop Loss', value: formatCurrency(analysis.stopLoss), detail: `${formatPercent(stopDistance)} from entry`, icon: Target, tone: 'green' },
    ],
  }

  return rows[page] || rows.signals
}

function InnerContent({ page, market, timeframe }) {
  const { analysis, chartData, error, loading } = useMarketAnalysis({ market, timeframe })
  const meta = pageMeta[page] || pageMeta.signals
  const Icon = meta.icon

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="hero-band">
          <Skeleton />
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="dashboard-page">
        <section className="hero-band">
          <div>
            <span className="eyebrow">{meta.eyebrow}</span>
            <h1>Inner page data is not available.</h1>
            <p>{error || 'Check the API server connection or select another market.'}</p>
          </div>
        </section>
      </div>
    )
  }

  const rows = makeRows({ page, analysis, market, timeframe })

  return (
    <div className="dashboard-page">
      <section className="hero-band">
        <div>
          <span className="eyebrow">{meta.eyebrow} / {market} / {timeframe}</span>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
        <div className="hero-stat">
          <Icon size={28} aria-hidden="true" />
          <strong>{analysis.signal}</strong>
          <span>{analysis.confidenceScore}% confidence</span>
        </div>
      </section>

      <Notification>{error || 'This page is powered by the same live candle feed and analysis engine as the main dashboard.'}</Notification>

      <section className="metrics-grid inner-metrics">
        {rows.map((row) => (
          <DashboardCard key={row.label} {...row} description={row.detail} />
        ))}
      </section>

      <section className="analysis-grid">
        <ChartPanel title={`${meta.eyebrow} Price Context`} data={chartData} dataKey="close" />
        <section className="detail-panel">
          <div className="panel-head">
            <h2>Page Data</h2>
            <span>{analysis.marketStatus}</span>
          </div>
          <div className="detail-list">
            {rows.map((row) => (
              <div className="detail-row" key={row.label}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
                <small>{row.detail}</small>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  )
}

export default function InnerPage({ page }) {
  return <DashboardLayout>{(layoutState) => <InnerContent page={page} {...layoutState} />}</DashboardLayout>
}
