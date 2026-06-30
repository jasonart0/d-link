/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  BarChart4,
  Brain,
  Gauge,
  HandCoins,
  LineChart,
  LockKeyhole,
  Radar,
  ShieldAlert,
  Signal,
  Sparkles,
  Target,
  TrendingUp,
  Waves,
  Zap,
} from 'lucide-react'
import { useMemo } from 'react'
import { ChartPanel } from '../components/ChartPanel.jsx'
import { ChatBotPanel } from '../components/ChatBotPanel.jsx'
import { DashboardCard } from '../components/DashboardCard.jsx'
import { Notification } from '../components/Notification.jsx'
import { SignalPanel } from '../components/SignalPanel.jsx'
import { Skeleton } from '../components/Skeleton.jsx'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { useMarketAnalysis } from '../hooks/useMarketAnalysis.js'
import { formatCurrency, formatPercent } from '../utils/formatters.js'

function DashboardContent({ market, timeframe }) {
  const { analysis, chartData, error, loading } = useMarketAnalysis({ market, timeframe })
  const cards = useMemo(() => {
    if (!analysis) return []

    return [
      { icon: BadgeDollarSign, label: 'Current Price', value: formatCurrency(analysis.currentPrice), description: `${market} spot reference`, tone: 'blue' },
      { icon: TrendingUp, label: 'Trend Direction', value: analysis.trend, description: analysis.marketDirection, tone: 'green' },
      { icon: Brain, label: 'Market Sentiment', value: analysis.sentiment, description: 'Trained model output', tone: 'violet' },
      { icon: ArrowUpRight, label: 'Buy Signal', value: analysis.buySignal, description: 'Model probability filter', tone: 'green' },
      { icon: ArrowDownRight, label: 'Sell Signal', value: analysis.sellSignal, description: 'Model downside probability', tone: 'red' },
      { icon: Gauge, label: 'Confidence Score', value: `${analysis.confidenceScore}%`, description: 'Training module confidence', tone: 'green' },
      { icon: ShieldAlert, label: 'Risk Score', value: `${analysis.riskScore}%`, description: 'Volatility adjusted', tone: 'red' },
      { icon: Target, label: 'Support', value: formatCurrency(analysis.support), description: 'Recent market floor', tone: 'blue' },
      { icon: Radar, label: 'Resistance', value: formatCurrency(analysis.resistance), description: 'Recent supply zone', tone: 'violet' },
      { icon: HandCoins, label: 'Entry Price', value: formatCurrency(analysis.entryPrice), description: 'Calculated entry area', tone: 'green' },
      { icon: LockKeyhole, label: 'Stop Loss', value: formatCurrency(analysis.stopLoss), description: 'Capital protection level', tone: 'red' },
      { icon: Sparkles, label: 'Take Profit', value: formatCurrency(analysis.takeProfit), description: 'Primary target level', tone: 'green' },
      { icon: Zap, label: 'Momentum', value: formatPercent(analysis.momentum), description: 'Ten-candle impulse', tone: 'blue' },
      { icon: Waves, label: 'Volatility', value: formatPercent(analysis.volatility), description: 'Range expansion index', tone: 'red' },
      { icon: Signal, label: 'Liquidity Score', value: `${analysis.liquidityScore}%`, description: 'Volume depth proxy', tone: 'blue' },
      { icon: BarChart4, label: 'Volume Strength', value: `${analysis.volumeStrength}%`, description: 'Relative participation', tone: 'violet' },
      { icon: Brain, label: 'Model Accuracy', value: `${analysis.modelAccuracy}%`, description: `${analysis.trainingSamples} trained samples`, tone: 'violet' },
      { icon: Gauge, label: 'Model Probability', value: `${analysis.modelProbability}%`, description: 'Next-candle upside probability', tone: 'blue' },
      { icon: Brain, label: 'AI Recommendation', value: analysis.signal, description: analysis.recommendation, tone: 'green' },
      { icon: Activity, label: 'Market Status', value: analysis.marketStatus, description: `${timeframe} observation window`, tone: 'blue' },
    ]
  }, [analysis, market, timeframe])

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
            <span className="eyebrow">{market} / {timeframe}</span>
            <h1>Market data is not available.</h1>
            <p>{error || 'Select another live market or check the API server connection.'}</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <section className="hero-band">
        <div>
          <span className="eyebrow">{market} / {timeframe}</span>
          <h1>Live trading intelligence.</h1>
          <p>Real API candles, trained signals, and ChatGPT context for the active setup.</p>
        </div>
        <div className="hero-stat">
          <LineChart size={28} aria-hidden="true" />
          <strong>{analysis.signal}</strong>
          <span>{analysis.confidenceScore}% confidence</span>
        </div>
      </section>

      <Notification>
        {error || 'Secure API architecture: market data and ChatGPT requests are served through the local backend proxy.'}
      </Notification>

      <section className="metrics-grid">
        {cards.map((card) => (
          <DashboardCard key={card.label} {...card} />
        ))}
      </section>

      <section className="analysis-grid">
        <ChartPanel title="Price Chart" data={chartData} dataKey="close" />
        <SignalPanel analysis={analysis} />
      </section>

      <ChatBotPanel analysis={analysis} market={market} timeframe={timeframe} />

      <section className="chart-grid">
        <ChartPanel title="Trend Chart" type="line" data={chartData} dataKey="close" secondaryKey="open" />
        <ChartPanel title="Volume Chart" type="bar" data={chartData} dataKey="volume" />
        <ChartPanel title="Confidence History" type="line" data={chartData} dataKey="confidence" />
        <ChartPanel title="Risk History" type="line" data={chartData} dataKey="risk" />
      </section>
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardLayout>{(layoutState) => <DashboardContent {...layoutState} />}</DashboardLayout>
}
