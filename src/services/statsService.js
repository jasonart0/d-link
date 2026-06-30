/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { apiRequest } from './apiClient.js'

export const getModelStats = ({ signal, symbol, timeframe } = {}) =>
  apiRequest('/model/stats', { params: { symbol, timeframe }, signal })
