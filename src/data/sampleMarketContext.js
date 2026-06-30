/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export const sampleMarketContext = Object.freeze({
  source: 'mock-context',
  news: [
    { candleIndex: 45, headline: 'ETF desk flow remains constructive', sentiment: 0.42, impact: 0.74 },
    { candleIndex: 50, headline: 'Exchange reserves trend lower during the session', sentiment: 0.28, impact: 0.58 },
    { candleIndex: 54, headline: 'Macro traders reduce risk before policy comments', sentiment: -0.22, impact: 0.48 },
    { candleIndex: 57, headline: 'Large spot bids appear near recent support', sentiment: 0.36, impact: 0.66 },
  ],
  macro: {
    riskAppetite: 0.24,
    dollarPressure: -0.08,
    rateStress: 0.16,
  },
  derivatives: {
    fundingRate: 0.012,
    openInterestChange: 0.07,
    longShortSkew: 0.18,
    liquidationBias: -0.04,
  },
})
