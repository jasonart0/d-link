/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { useEffect, useMemo, useState } from 'react'
import { analyzeMarket } from '../engine/analysisEngine.js'
import { getMarketCandles } from '../services/marketDataService.js'

export const useMarketAnalysis = ({ market, timeframe } = {}) => {
  const [candles, setCandles] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    setLoading(true)
    setError('')

    getMarketCandles({ market, timeframe })
      .then((data) => {
        if (mounted) setCandles(data)
      })
      .catch((requestError) => {
        if (mounted) {
          setError(requestError.message)
          setCandles([])
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [market, timeframe])

  const analysis = useMemo(() => (candles.length ? analyzeMarket(candles) : null), [candles])
  const chartData = useMemo(
    () =>
      candles.map((item, index) => ({
        ...item,
        confidence: 48 + Math.min(46, index * 0.7 + (item.close - candles[0].close) / 420),
        risk: 28 + ((index % 9) * 4 + Math.abs(item.close - item.open) / 140),
      })),
    [candles],
  )

  return { analysis, candles, chartData, error, loading }
}
