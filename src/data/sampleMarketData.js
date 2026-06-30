/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
const baseSeries = [
  104280, 104520, 104140, 104880, 105210, 104960, 105640, 106030, 105790, 106420,
  106870, 106510, 107240, 107760, 107410, 108100, 108650, 108220, 108900, 109350,
  109050, 109820, 110260, 109940, 110540, 110980, 110710, 111360, 111820, 111430,
  112050, 112640, 112120, 112870, 113300, 112930, 113620, 114080, 113680, 114420,
  114900, 114510, 115180, 115720, 115260, 115940, 116410, 116080, 116760, 117220,
  116880, 117540, 118060, 117710, 118380, 118920, 118500, 119160, 119740, 119290,
]

export const sampleMarketData = baseSeries.map((close, index) => {
  const swing = (index % 7) * 72 + 160
  const open = index === 0 ? close - 180 : baseSeries[index - 1]
  const high = Math.max(open, close) + swing
  const low = Math.min(open, close) - swing * 0.82
  const volume = 12800 + index * 135 + (index % 6) * 580

  return {
    time: `T-${baseSeries.length - index}`,
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    close: Number(close.toFixed(2)),
    volume,
  }
})
