/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { BarChart4, Brain, CheckCircle2, Gauge, Target, XCircle } from 'lucide-react'
import { DashboardCard } from './DashboardCard.jsx'
import { StateBlock } from './StateBlock.jsx'

export function ModelStatsPanel({ error, loading, stats }) {
  const cards = stats
    ? [
        { icon: Brain, label: 'Accuracy', value: `${stats.accuracy}%`, description: 'Overall prediction accuracy', tone: 'violet' },
        { icon: Target, label: 'Precision', value: `${stats.precision}%`, description: 'Positive signal precision', tone: 'green' },
        { icon: Gauge, label: 'Recall', value: `${stats.recall}%`, description: 'Valid setup capture rate', tone: 'blue' },
        { icon: BarChart4, label: 'Win Rate', value: `${stats.winRate}%`, description: 'Closed trade win rate', tone: 'green' },
        { icon: Target, label: 'Avg Risk/Reward', value: stats.averageRiskReward, description: 'Average model setup', tone: 'blue' },
        { icon: Brain, label: 'Total Predictions', value: stats.totalPredictions, description: 'All generated predictions', tone: 'violet' },
        { icon: CheckCircle2, label: 'Successful Trades', value: stats.successfulTrades, description: 'Closed wins', tone: 'green' },
        { icon: XCircle, label: 'Failed Trades', value: stats.failedTrades, description: 'Closed losses', tone: 'red' },
      ]
    : []

  return (
    <section className="detail-panel stats-panel">
      <div className="panel-head">
        <h2>Model Statistics</h2>
        <span>Performance metrics</span>
      </div>
      <StateBlock error={error} loading={loading} empty={!stats} emptyText="Model statistics are not available." />
      {!loading && cards.length ? (
        <div className="mini-metrics-grid">
          {cards.map((card) => <DashboardCard key={card.label} {...card} />)}
        </div>
      ) : null}
    </section>
  )
}
