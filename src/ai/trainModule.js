/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sigmoid = (value) => 1 / (1 + Math.exp(-value))
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length
const dot = (weights, features) => weights.reduce((sum, weight, index) => sum + weight * features[index], 0)

const signalProfiles = [
  { signal: 'Sell', trend: 'Bearish', direction: 'Downside pressure', sentiment: 'Defensive', recommendation: 'Reduce exposure until model risk normalizes.', min: 0, max: 0.42 },
  { signal: 'Hold', trend: 'Neutral', direction: 'Range bound', sentiment: 'Balanced', recommendation: 'Wait for stronger model confirmation before entering.', min: 0.42, max: 0.58 },
  { signal: 'Buy', trend: 'Bullish', direction: 'Upside continuation', sentiment: 'Risk-on', recommendation: 'Accumulation favored while model probability stays constructive.', min: 0.58, max: 1 },
]

const readProfile = (probability) =>
  signalProfiles.find((profile) => probability >= profile.min && probability < profile.max) || signalProfiles[1]

const candleFeatures = (candles, index) => {
  const current = candles[index]
  const close = current.close
  const open = current.open
  const high = current.high
  const low = current.low
  const volume = current.volume
  const closes = candles.slice(0, index + 1).map((item) => item.close)
  const volumes = candles.slice(Math.max(0, index - 20), index + 1).map((item) => item.volume)
  const sma8 = average(closes.slice(-8))
  const sma21 = average(closes.slice(-21))
  const recentCloses = closes.slice(-15)
  const gainLoss = recentCloses.slice(1).map((value, changeIndex) => value - recentCloses[changeIndex])
  const gains = gainLoss.filter((change) => change > 0)
  const losses = gainLoss.filter((change) => change < 0).map(Math.abs)
  const avgGain = average(gains.length ? gains : [0])
  const avgLoss = average(losses.length ? losses : [0.0001])
  const rsi = 100 - 100 / (1 + avgGain / avgLoss)

  return [
    (close - closes.at(-6)) / closes.at(-6),
    (close - closes.at(-13)) / closes.at(-13),
    (high - low) / close,
    (close - open) / close,
    volume / average(volumes) - 1,
    (close - sma8) / close,
    (sma8 - sma21) / close,
    (rsi - 50) / 50,
  ].map((feature) => clamp(Number.isFinite(feature) ? feature : 0, -2, 2))
}

const buildTrainingSamples = (candles) =>
  candles.slice(26, -1).map((_, sampleIndex) => {
    const index = sampleIndex + 26
    return {
      features: candleFeatures(candles, index),
      label: candles[index + 1].close > candles[index].close ? 1 : 0,
    }
  })

const trainWeights = (samples) => {
  const learningRate = 0.08
  const epochs = 180
  const initial = Array.from({ length: samples[0]?.features.length || 8 }, () => 0)

  return Array.from({ length: epochs }).reduce(
    (weights) =>
      samples.reduce((currentWeights, sample) => {
        const prediction = sigmoid(dot(currentWeights, sample.features))
        const error = sample.label - prediction
        return currentWeights.map((weight, index) => weight + learningRate * error * sample.features[index])
      }, weights),
    initial,
  )
}

export const trainMarketModel = (candles) => {
  const samples = buildTrainingSamples(candles)
  const weights = trainWeights(samples)
  const latestFeatures = candleFeatures(candles, candles.length - 1)
  const probability = sigmoid(dot(weights, latestFeatures))
  const profile = readProfile(probability)
  const confidenceScore = clamp(Math.round(50 + Math.abs(probability - 0.5) * 96), 20, 98)
  const correct = samples.filter((sample) => Math.round(sigmoid(dot(weights, sample.features))) === sample.label).length
  const accuracy = Math.round((correct / Math.max(1, samples.length)) * 100)

  return {
    ...profile,
    probability,
    confidenceScore,
    modelAccuracy: accuracy,
    trainingSamples: samples.length,
  }
}
