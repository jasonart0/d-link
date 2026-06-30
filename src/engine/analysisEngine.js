/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { trainMarketModel } from '../ai/trainModule.js'

const round = (value, decimals = 2) => Number(value.toFixed(decimals))
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length

export const calculateSMA = (values, period) => {
  return values.length < period ? null : round(average(values.slice(-period)))
}

export const calculateEMA = (values, period) => {
  const hasPeriod = values.length >= period
  const multiplier = 2 / (period + 1)
  const seed = average(values.slice(0, period))

  return hasPeriod
    ? round(values.slice(period).reduce((ema, value) => value * multiplier + ema * (1 - multiplier), seed))
    : null
}

export const calculateRSI = (values, period = 14) => {
  const changes = values.slice(1).map((value, index) => value - values[index])
  const recent = changes.slice(-period)
  const gains = recent.filter((change) => change > 0)
  const losses = recent.filter((change) => change < 0).map(Math.abs)
  const avgGain = gains.length ? average(gains) : 0
  const avgLoss = losses.length ? average(losses) : 0

  const relativeStrength = avgGain / avgLoss

  return values.length <= period ? null : avgLoss === 0 ? 100 : round(100 - 100 / (1 + relativeStrength))
}

export const analyzeMarket = (candles) => {
  const closes = candles.map((item) => item.close)
  const highs = candles.map((item) => item.high)
  const lows = candles.map((item) => item.low)
  const volumes = candles.map((item) => item.volume)
  const currentPrice = closes.at(-1)
  const sma20 = calculateSMA(closes, 20)
  const ema12 = calculateEMA(closes, 12)
  const ema26 = calculateEMA(closes, 26)
  const rsi = calculateRSI(closes)
  const model = trainMarketModel(candles)
  const support = round(Math.min(...lows.slice(-20)))
  const resistance = round(Math.max(...highs.slice(-20)))
  const momentum = round(((currentPrice - closes.at(-10)) / closes.at(-10)) * 100)
  const volatility = round(((resistance - support) / currentPrice) * 100)
  const volumeStrength = round((volumes.at(-1) / average(volumes.slice(-20))) * 100)
  const riskScore = Math.min(100, Math.max(8, round(volatility * 8 + (rsi > 72 ? 18 : 0))))
  const signal = model.signal
  const entryMultiplier = { Buy: 0.997, Hold: 1, Sell: 1.003 }[signal]
  const stopMultiplier = { Buy: 0.982, Hold: 0.99, Sell: 1.018 }[signal]
  const targetMultiplier = { Buy: 1.036, Hold: 1.018, Sell: 0.964 }[signal]
  const entryPrice = round(currentPrice * entryMultiplier)
  const stopLoss = round(entryPrice * stopMultiplier)
  const takeProfit = round(entryPrice * targetMultiplier)

  return {
    currentPrice,
    sma20,
    ema12,
    ema26,
    rsi,
    trend: model.trend,
    momentum,
    volatility,
    confidenceScore: model.confidenceScore,
    riskScore,
    signal,
    buySignal: signal === 'Buy' ? 'Active' : 'Standby',
    sellSignal: signal === 'Sell' ? 'Active' : 'Standby',
    support,
    resistance,
    entryPrice,
    stopLoss,
    takeProfit,
    marketDirection: model.direction,
    sentiment: model.sentiment,
    liquidityScore: Math.min(100, round(volumeStrength * 0.78)),
    volumeStrength,
    modelAccuracy: model.modelAccuracy,
    modelProbability: round(model.probability * 100),
    trainingSamples: model.trainingSamples,
    marketStatus: volatility > 5 ? 'High activity' : 'Orderly',
    recommendation: model.recommendation,
  }
}
