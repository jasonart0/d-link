/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Activity } from 'lucide-react'
import { formatCurrency, formatPercent } from '../utils/formatters.js'
import { StateBlock } from './StateBlock.jsx'

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '-')

export function MarketDataPanel({ candle, error, loading, symbol, timeframe }) {
  return (
    <section className="detail-panel">
      <div className="panel-head">
        <h2>Gold Candle Data</h2>
        <span>{symbol} / {timeframe}</span>
      </div>
      <StateBlock error={error} loading={loading} empty={!candle} emptyText="Latest candle data is not available." />
      {!loading && candle ? (
        <>
          <div className="signal-hero compact-hero">
            <Activity size={20} aria-hidden="true" />
            <strong>{formatCurrency(candle.close)}</strong>
            <p>{candle.trendStatus} after candle close at {formatDate(candle.closeTime)}</p>
          </div>
          <div className="detail-list compact">
            <div className="detail-row"><span>Open</span><strong>{formatCurrency(candle.open)}</strong></div>
            <div className="detail-row"><span>High</span><strong>{formatCurrency(candle.high)}</strong></div>
            <div className="detail-row"><span>Low</span><strong>{formatCurrency(candle.low)}</strong></div>
            <div className="detail-row"><span>Close</span><strong>{formatCurrency(candle.close)}</strong></div>
            <div className="detail-row"><span>Volume</span><strong>{Number(candle.volume).toLocaleString()}</strong></div>
            <div className="detail-row"><span>Volatility</span><strong>{formatPercent(candle.volatility)}</strong></div>
          </div>
        </>
      ) : null}
    </section>
  )
}
