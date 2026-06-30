/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Play, RefreshCcw, ShieldAlert, Sparkles, Target } from 'lucide-react'
import { formatCurrency } from '../utils/formatters.js'
import { StateBlock } from './StateBlock.jsx'

const formatDate = (value) => (value ? new Date(value).toLocaleString() : 'Waiting for candle close')

export function SignalPanel({ error, loading, onRefresh, onRunPrediction, prediction, running }) {
  const targets = prediction?.targets || []

  return (
    <section className="signal-panel">
      <div className="panel-head">
        <h2>AI Recommendation</h2>
        <div className="panel-actions">
          <button className="icon-btn" type="button" onClick={onRefresh} disabled={loading || running} aria-label="Refresh latest prediction">
            <RefreshCcw size={16} aria-hidden="true" />
          </button>
          <button className="btn btn-primary" type="button" onClick={onRunPrediction} disabled={loading || running}>
            <Play size={15} aria-hidden="true" />
            {running ? 'Running' : 'Run Prediction'}
          </button>
        </div>
      </div>
      <StateBlock error={error} loading={loading} empty={!prediction} emptyText="No AI prediction has been created yet." />
      {!loading && prediction ? (
        <>
      <div className="signal-hero">
        <Sparkles size={22} aria-hidden="true" />
            <strong>{prediction.direction}</strong>
            <p>{prediction.reason}</p>
      </div>
      <div className="trade-levels">
        <span>
          <Target size={16} aria-hidden="true" />
              Entry {prediction.entry ? formatCurrency(prediction.entry) : 'No trade'}
        </span>
        <span>
          <ShieldAlert size={16} aria-hidden="true" />
              Stop {prediction.stopLoss ? formatCurrency(prediction.stopLoss) : 'No trade'}
        </span>
            {[0, 1, 2].map((index) => (
              <span key={`target-${index}`}>
                <Target size={16} aria-hidden="true" />
                Target {index + 1} {targets[index] ? formatCurrency(targets[index]) : 'Pending'}
              </span>
            ))}
      </div>
      <div className="model-context">
        <span>
              <strong>{prediction.marketBias}</strong>
              Bias
        </span>
        <span>
              <strong>{prediction.expectedReward}</strong>
              Expected reward
        </span>
        <span>
              <strong>{formatDate(prediction.createdAt)}</strong>
              Created
        </span>
      </div>
      <div className="progress-row">
        <span>Confidence</span>
        <div className="progress-track">
              <i style={{ width: `${prediction.confidence}%` }} />
        </div>
            <strong>{prediction.confidence}%</strong>
      </div>
      <div className="progress-row risk">
        <span>Risk</span>
        <div className="progress-track">
              <i style={{ width: `${prediction.risk}%` }} />
        </div>
            <strong>{prediction.risk}%</strong>
          </div>
          <div className="progress-row quality">
            <span>Quality</span>
            <div className="progress-track">
              <i style={{ width: `${prediction.tradeQualityScore}%` }} />
            </div>
            <strong>{prediction.tradeQualityScore}%</strong>
      </div>
        </>
      ) : null}
    </section>
  )
}
