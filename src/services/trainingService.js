/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { apiRequest } from './apiClient.js'

export const getTrainingStatus = ({ signal, symbol, timeframe } = {}) =>
  apiRequest('/training/status', { params: { symbol, timeframe }, signal })

export const startTraining = ({ signal, symbol, timeframe } = {}) =>
  apiRequest('/training/start', {
    body: { symbol, timeframe },
    method: 'POST',
    signal,
  })
