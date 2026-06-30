/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { ShieldAlert, Sparkles, Target } from 'lucide-react'
import { formatCurrency } from '../utils/formatters.js'

export function SignalPanel({ analysis }) {
  return (
    <section className="signal-panel">
      <div className="panel-head">
        <h2>AI Recommendation</h2>
        <span>{analysis.marketStatus}</span>
      </div>
      <div className="signal-hero">
        <Sparkles size={22} aria-hidden="true" />
        <strong>{analysis.signal}</strong>
        <p>{analysis.recommendation}</p>
      </div>
      <div className="trade-levels">
        <span>
          <Target size={16} aria-hidden="true" />
          Entry {formatCurrency(analysis.entryPrice)}
        </span>
        <span>
          <ShieldAlert size={16} aria-hidden="true" />
          Stop {formatCurrency(analysis.stopLoss)}
        </span>
        <span>
          <Target size={16} aria-hidden="true" />
          Target {formatCurrency(analysis.takeProfit)}
        </span>
      </div>
      <div className="progress-row">
        <span>Confidence</span>
        <div className="progress-track">
          <i style={{ width: `${analysis.confidenceScore}%` }} />
        </div>
        <strong>{analysis.confidenceScore}%</strong>
      </div>
      <div className="progress-row risk">
        <span>Risk</span>
        <div className="progress-track">
          <i style={{ width: `${analysis.riskScore}%` }} />
        </div>
        <strong>{analysis.riskScore}%</strong>
      </div>
    </section>
  )
}
