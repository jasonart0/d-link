/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { memo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../hooks/useTheme.js'

export const ChartPanel = memo(function ChartPanel({ title, type = 'area', data, dataKey, secondaryKey }) {
  const { theme } = useTheme()
  const chartColor = '#25d6a2'
  const barColor = '#4f8cff'
  const secondaryColor = '#ff6f91'
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,.08)' : 'rgba(31,41,55,.1)'
  const tooltipStyle = {
    background: theme === 'dark' ? '#111827' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#233044' : '#d8e0eb'}`,
    borderRadius: 12,
    color: theme === 'dark' ? '#edf3ff' : '#101827',
  }

  return (
    <section className="chart-panel">
      <div className="panel-head">
        <h2>{title}</h2>
        <span>Live simulation</span>
      </div>
      <div className="chart-frame">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="time" tick={false} axisLine={false} />
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey={dataKey} fill={barColor} radius={[6, 6, 0, 0]} animationDuration={900} />
            </BarChart>
          ) : type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="time" tick={false} axisLine={false} />
              <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey={dataKey} stroke={chartColor} strokeWidth={3} dot={false} animationDuration={900} />
              {secondaryKey ? <Line type="monotone" dataKey={secondaryKey} stroke={secondaryColor} strokeWidth={2} dot={false} /> : null}
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`${dataKey}-gradient`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="time" tick={false} axisLine={false} />
              <YAxis hide domain={['dataMin - 400', 'dataMax + 400']} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey={dataKey} stroke={chartColor} strokeWidth={3} fill={`url(#${dataKey}-gradient)`} animationDuration={1100} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )
})
