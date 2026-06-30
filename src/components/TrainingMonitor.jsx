/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Play } from 'lucide-react'
import { StateBlock } from './StateBlock.jsx'

const formatDate = (value) => (value ? new Date(value).toLocaleString() : '-')

export function TrainingMonitor({ error, loading, onStartTraining, starting, training }) {
  return (
    <section className="detail-panel">
      <div className="panel-head">
        <h2>Training Monitor</h2>
        <button className="btn btn-primary" type="button" onClick={onStartTraining} disabled={loading || starting}>
          <Play size={15} aria-hidden="true" />
          {starting ? 'Starting' : 'Start Training'}
        </button>
      </div>
      <StateBlock error={error} loading={loading} empty={!training} emptyText="Training status is not available." />
      {!loading && training ? (
        <>
          <div className="training-status">
            <div>
              <span>Status</span>
              <strong>{training.status}</strong>
            </div>
            <div>
              <span>Last training</span>
              <strong>{formatDate(training.lastTrainingDate)}</strong>
            </div>
          </div>
          <div className="progress-row quality">
            <span>Progress</span>
            <div className="progress-track">
              <i style={{ width: `${training.progress || 0}%` }} />
            </div>
            <strong>{training.progress || 0}%</strong>
          </div>
          <div className="detail-list compact">
            <div className="detail-row"><span>Training Loss</span><strong>{training.trainingLoss}</strong></div>
            <div className="detail-row"><span>Validation Accuracy</span><strong>{training.validationAccuracy}%</strong></div>
            <div className="detail-row"><span>Win Rate</span><strong>{training.winRate}%</strong></div>
            <div className="detail-row"><span>Profit Factor</span><strong>{training.profitFactor}</strong></div>
            <div className="detail-row"><span>Max Drawdown</span><strong>{training.maxDrawdown}%</strong></div>
            <div className="detail-row"><span>Sharpe Ratio</span><strong>{training.sharpeRatio}</strong></div>
          </div>
        </>
      ) : null}
    </section>
  )
}
