/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { apiRequest } from './apiClient.js'

export const getLatestPrediction = ({ signal, symbol, timeframe } = {}) =>
  apiRequest('/predictions/latest', { params: { symbol, timeframe }, signal })

export const getPredictionHistory = ({ direction, endDate, signal, startDate, symbol, timeframe } = {}) =>
  apiRequest('/predictions/history', {
    params: { direction, endDate, startDate, symbol, timeframe },
    signal,
  })

export const runPrediction = ({ signal, symbol, timeframe } = {}) =>
  apiRequest('/prediction/run', {
    body: { symbol, timeframe },
    method: 'POST',
    signal,
  })
