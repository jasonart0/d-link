/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { apiRequest } from './apiClient.js'

export const getLatestCandle = ({ signal, symbol, timeframe } = {}) =>
  apiRequest('/market/latest-candle', { params: { symbol, timeframe }, signal })
