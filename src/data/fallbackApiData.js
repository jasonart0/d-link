/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
const now = '2026-06-30T10:00:00Z'

export const fallbackPrediction = Object.freeze({
  symbol: 'XAUUSD',
  timeframe: '15m',
  direction: 'BUY',
  entry: 2345.5,
  stopLoss: 2338.2,
  targets: [2352, 2358.5, 2365],
  confidence: 74,
  risk: 32,
  tradeQualityScore: 81,
  expectedReward: '1:2.8',
  marketBias: 'Bullish',
  reason: 'Trend is bullish, price respected support zone, momentum is strong and volume confirms buying pressure.',
  createdAt: now,
})

export const fallbackPredictionHistory = Object.freeze([
  { ...fallbackPrediction, id: 'pred-001', result: 'Open' },
  {
    id: 'pred-002',
    symbol: 'XAUUSD',
    timeframe: '1H',
    direction: 'SELL',
    entry: 2339.8,
    stopLoss: 2346.4,
    targets: [2332.5, 2327.2, 2320.8],
    confidence: 69,
    risk: 39,
    tradeQualityScore: 73,
    expectedReward: '1:2.1',
    marketBias: 'Bearish',
    reason: 'Model detected downside continuation after gold rejected from intraday supply.',
    createdAt: '2026-06-29T18:00:00Z',
    result: 'Win',
  },
  {
    id: 'pred-003',
    symbol: 'XAUUSD',
    timeframe: '30M',
    direction: 'NO TRADE',
    entry: null,
    stopLoss: null,
    targets: [],
    confidence: 51,
    risk: 58,
    tradeQualityScore: 42,
    expectedReward: 'N/A',
    marketBias: 'Neutral',
    reason: 'Model confidence is not strong enough after mixed volume and momentum conditions.',
    createdAt: '2026-06-28T12:00:00Z',
    result: 'Skipped',
  },
])

export const fallbackTrainingStatus = Object.freeze({
  status: 'Idle',
  progress: 0,
  lastTrainingDate: '2026-06-29T23:30:00Z',
  trainingLoss: 0.138,
  validationAccuracy: 71,
  winRate: 64,
  profitFactor: 1.84,
  maxDrawdown: 8.6,
  sharpeRatio: 1.42,
})

export const fallbackModelStats = Object.freeze({
  accuracy: 71,
  precision: 68,
  recall: 66,
  winRate: 64,
  averageRiskReward: '1:2.3',
  totalPredictions: 428,
  successfulTrades: 274,
  failedTrades: 154,
})

export const fallbackLatestCandle = Object.freeze({
  symbol: 'XAUUSD',
  timeframe: '15m',
  closeTime: now,
  open: 2341.2,
  high: 2347.8,
  low: 2339.4,
  close: 2345.5,
  volume: 18240,
  volatility: 0.86,
  trendStatus: 'Bullish continuation',
})
