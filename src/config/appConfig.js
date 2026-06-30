/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export const appConfig = Object.freeze({
  appName: 'D-Line Gold AI',
  owner: 'Tariq Mehmood (Tariq Jarral)',
  defaultMarket: 'XAUUSD',
  defaultTimeframe: '15M',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
})
