/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export const appConfig = Object.freeze({
  appName: 'D-Link',
  owner: 'Tariq Mehmood (Tariq Jarral)',
  defaultMarket: 'BTCUSDT',
  defaultTimeframe: '1H',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
})
