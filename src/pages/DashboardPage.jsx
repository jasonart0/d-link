/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import {
  Activity,
  BadgeDollarSign,
  BarChart4,
  Brain,
  Gauge,
  History,
  LineChart,
  LockKeyhole,
  ShieldAlert,
  Signal,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { ChartPanel } from '../components/ChartPanel.jsx'
import { ChatBotPanel } from '../components/ChatBotPanel.jsx'
import { DashboardCard } from '../components/DashboardCard.jsx'
import { MarketDataPanel } from '../components/MarketDataPanel.jsx'
import { ModelStatsPanel } from '../components/ModelStatsPanel.jsx'
import { Notification } from '../components/Notification.jsx'
import { PredictionHistory } from '../components/PredictionHistory.jsx'
import { SignalPanel } from '../components/SignalPanel.jsx'
import { TrainingMonitor } from '../components/TrainingMonitor.jsx'
import { Dropdown } from '../components/Dropdown.jsx'
import { timeframes } from '../constants/markets.js'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { useTradingIntelligence } from '../hooks/useTradingIntelligence.js'
import { formatCurrency } from '../utils/formatters.js'

const formatPrice = (value) => (Number.isFinite(Number(value)) ? formatCurrency(value) : 'No trade')

const tabs = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'history', label: 'History', icon: History },
  { id: 'training', label: 'Training', icon: Brain },
  { id: 'assistant', label: 'Assistant', icon: Sparkles },
]

function DashboardContent({ market, timeframe, onTimeframeChange }) {
  const [activeTab, setActiveTab] = useState('overview')
  const {
    actions,
    history,
    historyFilters,
    latest,
    market: marketData,
    refreshAll,
    runPrediction,
    setHistoryFilters,
    startTraining,
    stats,
    training,
  } = useTradingIntelligence({ symbol: market, timeframe })
  const prediction = latest.data
  const candle = marketData.data

  const cards = useMemo(() => {
    if (!prediction && !candle && !stats.data) return []
    const targets = prediction?.targets || []

    return [
      { icon: BadgeDollarSign, label: 'Gold Close', value: candle ? formatCurrency(candle.close) : '-', description: `${market} ${timeframe} candle`, tone: 'blue' },
      { icon: TrendingUp, label: 'AI Direction', value: prediction?.direction || '-', description: 'Backend AI recommendation', tone: 'green' },
      { icon: Target, label: 'Entry Price', value: formatPrice(prediction?.entry), description: 'API model entry level', tone: 'green' },
      { icon: LockKeyhole, label: 'Stop Loss', value: formatPrice(prediction?.stopLoss), description: 'API model invalidation', tone: 'red' },
      { icon: Target, label: 'Target 1', value: formatPrice(targets[0]), description: 'First profit objective', tone: 'green' },
      { icon: Gauge, label: 'Confidence Score', value: `${prediction?.confidence ?? '-'}%`, description: 'AI output confidence', tone: 'blue' },
      { icon: ShieldAlert, label: 'Risk Score', value: `${prediction?.risk ?? '-'}%`, description: 'AI output risk rating', tone: 'red' },
      { icon: Brain, label: 'Trade Quality', value: `${prediction?.tradeQualityScore ?? '-'}%`, description: 'Composite setup quality', tone: 'violet' },
      { icon: BarChart4, label: 'Expected Reward', value: prediction?.expectedReward || '-', description: 'Risk/reward projection', tone: 'blue' },
      { icon: Activity, label: 'Market Bias', value: prediction?.marketBias || '-', description: 'AI market regime label', tone: 'violet' },
      { icon: Signal, label: 'Win Rate', value: `${stats.data?.winRate ?? '-'}%`, description: 'Closed prediction win rate', tone: 'green' },
    ]
  }, [candle, market, prediction, stats.data, timeframe])

  const chartData = useMemo(
    () =>
      (history.data || []).map((item) => ({
        time: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : item.symbol,
        confidence: item.confidence,
        risk: item.risk,
        quality: item.tradeQualityScore,
      })),
    [history.data],
  )

  const chatAnalysis = useMemo(
    () => ({
      confidenceScore: prediction?.confidence,
      currentPrice: candle?.close,
      recommendation: prediction?.reason,
      riskScore: prediction?.risk,
      signal: prediction?.direction,
      support: prediction?.entry,
      trend: prediction?.marketBias,
    }),
    [candle, prediction],
  )

  return (
    <div className="dashboard-page">
      <section className="hero-band">
        <div>
          <div className="eyebrow hero-eyebrow">
            <span>Gold trading only /</span>
            <Dropdown label="Timeframe" value={timeframe} options={timeframes} onChange={onTimeframeChange} />
          </div>
          <h1>AI gold trading intelligence.</h1>
          <p>Focused XAUUSD predictions, risk levels, training status, and gold candle data after every close.</p>
        </div>
        <div className="hero-stat">
          <LineChart size={28} aria-hidden="true" />
          <strong>{prediction?.direction || 'WAIT'}</strong>
          <span>{prediction?.confidence ? `${prediction.confidence}% confidence` : 'API pending'}</span>
        </div>
      </section>

      <Notification>
        AI predictions are decision-support tools, not guaranteed financial advice. Always use proper risk management.
      </Notification>

      <nav className="dashboard-tabs" aria-label="Dashboard modules">
        {tabs.map(({ icon: Icon, id, label }) => (
          <button
            className={activeTab === id ? 'active' : ''}
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {activeTab === 'overview' ? (
        <>
          <section className="metrics-grid">
            {cards.map((card) => (
              <DashboardCard key={card.label} {...card} />
            ))}
          </section>

          <section className="analysis-grid">
            <MarketDataPanel
              candle={candle}
              error={marketData.error}
              loading={marketData.loading}
              symbol={market}
              timeframe={timeframe}
            />
            <SignalPanel
              error={latest.error}
              loading={latest.loading}
              onRefresh={() => refreshAll()}
              onRunPrediction={runPrediction}
              prediction={prediction}
              running={actions.prediction}
            />
          </section>

          {chartData.length ? (
            <section className="chart-grid">
              <ChartPanel title="Confidence History" type="line" data={chartData} dataKey="confidence" />
              <ChartPanel title="Risk History" type="line" data={chartData} dataKey="risk" />
              <ChartPanel title="Trade Quality History" type="line" data={chartData} dataKey="quality" />
            </section>
          ) : null}
        </>
      ) : null}

      {activeTab === 'history' ? (
        <PredictionHistory
          error={history.error}
          filters={historyFilters}
          loading={history.loading}
          onFilterChange={setHistoryFilters}
          predictions={history.data}
        />
      ) : null}

      {activeTab === 'training' ? (
        <section className="analysis-grid">
          <TrainingMonitor
            error={training.error}
            loading={training.loading}
            onStartTraining={startTraining}
            starting={actions.training}
            training={training.data}
          />
          <ModelStatsPanel error={stats.error} loading={stats.loading} stats={stats.data} />
        </section>
      ) : null}

      {activeTab === 'assistant' ? (
        <ChatBotPanel analysis={chatAnalysis} market={market} timeframe={timeframe} />
      ) : null}
    </div>
  )
}

export default function DashboardPage() {
  return <DashboardLayout>{(layoutState) => <DashboardContent {...layoutState} />}</DashboardLayout>
}
