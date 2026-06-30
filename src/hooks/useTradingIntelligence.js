/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fallbackLatestCandle,
  fallbackModelStats,
  fallbackPrediction,
  fallbackPredictionHistory,
  fallbackTrainingStatus,
} from '../data/fallbackApiData.js'
import { getLatestCandle } from '../services/marketService.js'
import { getLatestPrediction, getPredictionHistory, runPrediction } from '../services/predictionService.js'
import { getModelStats } from '../services/statsService.js'
import { getTrainingStatus, startTraining } from '../services/trainingService.js'

const createResource = (data) => ({ data, error: '', loading: true })
const errorMessage = (error) => error.message || 'API request failed.'

const filterFallbackHistory = (rows, filters) =>
  rows.filter((item) => {
    const createdAt = item.createdAt ? new Date(item.createdAt) : null
    const start = filters.startDate ? new Date(`${filters.startDate}T00:00:00`) : null
    const end = filters.endDate ? new Date(`${filters.endDate}T23:59:59`) : null

    return (
      (!filters.symbol || item.symbol === filters.symbol) &&
      (!filters.timeframe || item.timeframe === filters.timeframe) &&
      (!filters.direction || item.direction === filters.direction) &&
      (!start || (createdAt && createdAt >= start)) &&
      (!end || (createdAt && createdAt <= end))
    )
  })

export const useTradingIntelligence = ({ symbol, timeframe }) => {
  const [historyFilters, setHistoryFilters] = useState({
    direction: '',
    endDate: '',
    startDate: '',
    symbol: '',
    timeframe: '',
  })
  const [latest, setLatest] = useState(createResource(null))
  const [history, setHistory] = useState(createResource([]))
  const [market, setMarket] = useState(createResource(null))
  const [stats, setStats] = useState(createResource(null))
  const [training, setTraining] = useState(createResource(null))
  const [actions, setActions] = useState({ prediction: false, training: false })

  const baseParams = useMemo(() => ({ symbol, timeframe }), [symbol, timeframe])

  const loadLatest = useCallback(
    async (signal) => {
      setLatest((current) => ({ ...current, loading: true }))
      try {
        const data = await getLatestPrediction({ ...baseParams, signal })
        setLatest({ data, error: '', loading: false })
      } catch (error) {
        setLatest({ data: { ...fallbackPrediction, symbol, timeframe }, error: errorMessage(error), loading: false })
      }
    },
    [baseParams, symbol, timeframe],
  )

  const loadHistory = useCallback(
    async (signal) => {
      setHistory((current) => ({ ...current, loading: true }))
      try {
        const data = await getPredictionHistory({ ...historyFilters, signal })
        setHistory({ data: Array.isArray(data) ? data : data?.predictions || [], error: '', loading: false })
      } catch (error) {
        setHistory({
          data: filterFallbackHistory(fallbackPredictionHistory, historyFilters),
          error: errorMessage(error),
          loading: false,
        })
      }
    },
    [historyFilters],
  )

  const loadTraining = useCallback(
    async (signal) => {
      setTraining((current) => ({ ...current, loading: true }))
      try {
        const data = await getTrainingStatus({ ...baseParams, signal })
        setTraining({ data, error: '', loading: false })
      } catch (error) {
        setTraining({ data: fallbackTrainingStatus, error: errorMessage(error), loading: false })
      }
    },
    [baseParams],
  )

  const loadStats = useCallback(
    async (signal) => {
      setStats((current) => ({ ...current, loading: true }))
      try {
        const data = await getModelStats({ ...baseParams, signal })
        setStats({ data, error: '', loading: false })
      } catch (error) {
        setStats({ data: fallbackModelStats, error: errorMessage(error), loading: false })
      }
    },
    [baseParams],
  )

  const loadMarket = useCallback(
    async (signal) => {
      setMarket((current) => ({ ...current, loading: true }))
      try {
        const data = await getLatestCandle({ ...baseParams, signal })
        setMarket({ data, error: '', loading: false })
      } catch (error) {
        setMarket({ data: { ...fallbackLatestCandle, symbol, timeframe }, error: errorMessage(error), loading: false })
      }
    },
    [baseParams, symbol, timeframe],
  )

  const refreshAll = useCallback(
    async (signal) => {
      await Promise.all([loadLatest(signal), loadHistory(signal), loadTraining(signal), loadStats(signal), loadMarket(signal)])
    },
    [loadHistory, loadLatest, loadMarket, loadStats, loadTraining],
  )

  const handleRunPrediction = useCallback(async () => {
    setActions((current) => ({ ...current, prediction: true }))
    try {
      const data = await runPrediction(baseParams)
      setLatest({ data, error: '', loading: false })
      await Promise.all([loadHistory(), loadMarket()])
    } catch (error) {
      setLatest((current) => ({ ...current, error: errorMessage(error), loading: false }))
    } finally {
      setActions((current) => ({ ...current, prediction: false }))
    }
  }, [baseParams, loadHistory, loadMarket])

  const handleStartTraining = useCallback(async () => {
    setActions((current) => ({ ...current, training: true }))
    try {
      const data = await startTraining(baseParams)
      setTraining({ data, error: '', loading: false })
      await loadStats()
    } catch (error) {
      setTraining((current) => ({ ...current, error: errorMessage(error), loading: false }))
    } finally {
      setActions((current) => ({ ...current, training: false }))
    }
  }, [baseParams, loadStats])

  useEffect(() => {
    const controller = new AbortController()
    refreshAll(controller.signal)
    return () => controller.abort()
  }, [refreshAll])

  return {
    actions,
    history,
    historyFilters,
    latest,
    market,
    refreshAll,
    runPrediction: handleRunPrediction,
    setHistoryFilters,
    startTraining: handleStartTraining,
    stats,
    training,
  }
}
