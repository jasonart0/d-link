/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const sigmoid = (value) => 1 / (1 + Math.exp(-value))
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length
const dot = (weights, features) => weights.reduce((sum, weight, index) => sum + weight * features[index], 0)
const safeAverage = (values, fallback = 0) => (values.length ? average(values) : fallback)

const signalProfiles = [
  { signal: 'Sell', trend: 'Bearish', direction: 'Downside pressure', sentiment: 'Defensive', recommendation: 'Reduce exposure until model risk normalizes.', min: 0, max: 0.41 },
  { signal: 'Hold', trend: 'Neutral', direction: 'Range bound', sentiment: 'Balanced', recommendation: 'Wait for stronger model confirmation before entering.', min: 0.41, max: 0.59 },
  { signal: 'Buy', trend: 'Bullish', direction: 'Upside continuation', sentiment: 'Risk-on', recommendation: 'Accumulation favored only while probability, sentiment, and risk stay aligned.', min: 0.59, max: 1 },
]

const readProfile = (probability) =>
  signalProfiles.find((profile) => probability >= profile.min && probability < profile.max) || signalProfiles[1]

const contextFeatures = (marketContext = {}, index = 0) => {
  const news = Array.isArray(marketContext.news) ? marketContext.news : []
  const knownNews = news.filter((item) => Number(item.candleIndex ?? index) <= index)
  const recentNews = knownNews.slice(-6)
  const weightedNews = recentNews.map((item) => {
    const sentiment = clamp(Number(item.sentiment) || 0, -1, 1)
    const impact = clamp(Number(item.impact) || 0.5, 0, 1)
    return sentiment * impact
  })
  const macro = marketContext.macro || {}
  const derivatives = marketContext.derivatives || {}
  const riskAppetite = clamp(Number(macro.riskAppetite) || 0, -1, 1)
  const dollarPressure = clamp(Number(macro.dollarPressure) || 0, -1, 1)
  const rateStress = clamp(Number(macro.rateStress) || 0, -1, 1)
  const fundingRate = clamp((Number(derivatives.fundingRate) || 0) * 20, -1, 1)
  const openInterestChange = clamp(Number(derivatives.openInterestChange) || 0, -1, 1)
  const longShortSkew = clamp(Number(derivatives.longShortSkew) || 0, -1, 1)
  const liquidationBias = clamp(Number(derivatives.liquidationBias) || 0, -1, 1)

  return [
    safeAverage(weightedNews),
    riskAppetite - Math.max(0, rateStress) * 0.35,
    -dollarPressure,
    fundingRate,
    openInterestChange * Math.sign(longShortSkew || 1),
    liquidationBias,
  ].map((feature) => clamp(Number.isFinite(feature) ? feature : 0, -2, 2))
}

const candleFeatures = (candles, index, marketContext) => {
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
    ...contextFeatures(marketContext, index),
  ].map((feature) => clamp(Number.isFinite(feature) ? feature : 0, -2, 2))
}

const buildTrainingSamples = (candles, marketContext) =>
  candles.slice(26, -1).map((_, sampleIndex) => {
    const index = sampleIndex + 26
    const move = (candles[index + 1].close - candles[index].close) / candles[index].close
    return {
      features: candleFeatures(candles, index, marketContext),
      label: move > 0.001 ? 1 : 0,
    }
  })

const trainWeights = (samples) => {
  const learningRate = 0.06
  const epochs = 220
  const initial = Array.from({ length: samples[0]?.features.length || 14 }, () => 0)

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

const scoreContext = (marketContext, candleCount) => {
  const latest = contextFeatures(marketContext, candleCount - 1)
  const [newsScore, macroScore, dollarScore, fundingScore, interestScore, liquidationScore] = latest
  const score = clamp(
    newsScore * 0.34 + macroScore * 0.22 + dollarScore * 0.14 + fundingScore * 0.1 + interestScore * 0.1 + liquidationScore * 0.1,
    -1,
    1,
  )

  return {
    score,
    label: score > 0.12 ? 'Supportive' : score < -0.12 ? 'Cautious' : 'Mixed',
    newsImpact: Math.round(Math.abs(newsScore) * 100),
  }
}

export const trainMarketModel = (candles, marketContext = {}) => {
  const samples = buildTrainingSamples(candles, marketContext)
  const weights = trainWeights(samples)
  const latestFeatures = candleFeatures(candles, candles.length - 1, marketContext)
  const rawProbability = sigmoid(dot(weights, latestFeatures))
  const context = scoreContext(marketContext, candles.length)
  const probability = clamp(rawProbability + context.score * 0.08, 0.03, 0.97)
  const profile = readProfile(probability)
  const confidenceScore = clamp(Math.round(48 + Math.abs(probability - 0.5) * 92 + Math.abs(context.score) * 8), 20, 98)
  const validationStart = Math.max(0, Math.floor(samples.length * 0.7))
  const validationSamples = samples.slice(validationStart)
  const correct = validationSamples.filter((sample) => Math.round(sigmoid(dot(weights, sample.features))) === sample.label).length
  const accuracy = Math.round((correct / Math.max(1, validationSamples.length)) * 100)

  return {
    ...profile,
    probability,
    rawProbability,
    confidenceScore,
    modelAccuracy: accuracy,
    trainingSamples: samples.length,
    validationSamples: validationSamples.length,
    contextScore: context.score,
    contextLabel: context.label,
    newsImpact: context.newsImpact,
  }
}
