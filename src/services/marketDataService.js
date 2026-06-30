/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { appConfig } from '../config/appConfig.js'
import { sampleMarketData } from '../data/sampleMarketData.js'

export const getMarketCandles = async ({ market = appConfig.defaultMarket, timeframe = appConfig.defaultTimeframe } = {}) => {
  if (appConfig.enableMockData || !appConfig.apiBaseUrl) {
    return sampleMarketData
  }

  const params = new URLSearchParams({ symbol: market, timeframe })
  const response = await fetch(`${appConfig.apiBaseUrl}/market/candles?${params}`)

  if (!response.ok) {
    throw new Error('Live market data is unavailable for the selected market.')
  }

  const payload = await response.json()
  return payload.candles
}
