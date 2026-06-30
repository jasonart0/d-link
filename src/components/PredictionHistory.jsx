/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { Filter } from 'lucide-react'
import { timeframes } from '../constants/markets.js'
import { formatCurrency } from '../utils/formatters.js'
import { StateBlock } from './StateBlock.jsx'

const directions = ['', 'BUY', 'SELL', 'NO TRADE']
const formatDate = (value) => (value ? new Date(value).toLocaleString() : '-')
const formatPrice = (value) => (Number.isFinite(Number(value)) ? formatCurrency(value) : '-')

export function PredictionHistory({ error, filters, loading, onFilterChange, predictions }) {
  const rows = predictions || []

  return (
    <section className="detail-panel history-panel">
      <div className="panel-head">
        <h2>Prediction History</h2>
        <span>{rows.length} records</span>
      </div>
      <div className="filter-bar">
        <label className="field">
          <Filter size={15} aria-hidden="true" />
          <select value={filters.timeframe} onChange={(event) => onFilterChange({ ...filters, timeframe: event.target.value })}>
            <option value="">All timeframes</option>
            {timeframes.map((timeframe) => (
              <option key={timeframe} value={timeframe}>{timeframe}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Dir</span>
          <select value={filters.direction} onChange={(event) => onFilterChange({ ...filters, direction: event.target.value })}>
            {directions.map((direction) => (
              <option key={direction || 'all'} value={direction}>{direction || 'All directions'}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>From</span>
          <input type="date" value={filters.startDate} onChange={(event) => onFilterChange({ ...filters, startDate: event.target.value })} />
        </label>
        <label className="field">
          <span>To</span>
          <input type="date" value={filters.endDate} onChange={(event) => onFilterChange({ ...filters, endDate: event.target.value })} />
        </label>
      </div>
      <StateBlock error={error} loading={loading} empty={!rows.length} emptyText="No previous predictions match these filters." />
      {!loading && rows.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Symbol</th>
                <th>TF</th>
                <th>Direction</th>
                <th>Entry</th>
                <th>SL</th>
                <th>Targets</th>
                <th>Conf</th>
                <th>Risk</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => (
                <tr key={item.id || `${item.symbol}-${item.createdAt}`}>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>{item.symbol}</td>
                  <td>{item.timeframe}</td>
                  <td><span className={`direction-pill ${String(item.direction).toLowerCase().replace(/\s+/g, '-')}`}>{item.direction}</span></td>
                  <td>{formatPrice(item.entry)}</td>
                  <td>{formatPrice(item.stopLoss)}</td>
                  <td>{(item.targets || []).map(formatPrice).join(' / ') || '-'}</td>
                  <td>{item.confidence}%</td>
                  <td>{item.risk}%</td>
                  <td>{item.result || 'Open'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
