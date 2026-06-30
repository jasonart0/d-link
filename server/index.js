/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { createServer } from 'node:http'
import { URL } from 'node:url'

const port = Number(process.env.API_PORT || 8787)
const openAiModel = process.env.OPENAI_MODEL || 'gpt-4.1-mini'

const timeframeToBinanceInterval = {
  '15M': '15m',
  '1H': '1h',
  '4H': '4h',
  '1D': '1d',
  '1W': '1w',
}

const buildMarketContext = (symbol, timeframe) => ({
  source: 'server-context',
  symbol,
  timeframe,
  news: [
    { candleIndex: 72, headline: `${symbol} liquidity improves during active session`, sentiment: 0.28, impact: 0.62 },
    { candleIndex: 80, headline: 'Macro risk appetite is mixed before US data', sentiment: -0.08, impact: 0.54 },
    { candleIndex: 88, headline: 'Spot demand absorbs short-term sell pressure', sentiment: 0.24, impact: 0.58 },
    { candleIndex: 94, headline: 'Derivatives positioning remains moderately long', sentiment: 0.14, impact: 0.5 },
  ],
  macro: {
    riskAppetite: 0.18,
    dollarPressure: -0.06,
    rateStress: 0.12,
  },
  derivatives: {
    fundingRate: 0.01,
    openInterestChange: 0.05,
    longShortSkew: 0.14,
    liquidationBias: -0.03,
  },
})

const json = (response, status, payload) => {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

const readBody = async (request) =>
  new Promise((resolve, reject) => {
    let body = ''
    request.on('data', (chunk) => {
      body += chunk
      if (body.length > 1024 * 1024) {
        request.destroy()
        reject(new Error('Request body is too large.'))
      }
    })
    request.on('end', () => resolve(body ? JSON.parse(body) : {}))
    request.on('error', reject)
  })

const fetchCandles = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Market API returned ${response.status}`)
  }

  const rows = await response.json()
  return rows.map((row) => ({
    time: new Date(row[0]).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
    volume: Number(row[5]),
  }))
}

const handleMarketCandles = async (requestUrl, response) => {
  const symbol = requestUrl.searchParams.get('symbol') || 'BTCUSDT'
  const timeframe = requestUrl.searchParams.get('timeframe') || '1H'
  const interval = timeframeToBinanceInterval[timeframe] || '1h'

  if (!/^[A-Z0-9]{5,16}$/.test(symbol)) {
    json(response, 400, { error: 'Unsupported market symbol.' })
    return
  }

  const candles = await fetchCandles(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=96`,
  )
  json(response, 200, { source: 'binance', symbol, timeframe, candles })
}

const handleMarketContext = (requestUrl, response) => {
  const symbol = requestUrl.searchParams.get('symbol') || 'BTCUSDT'
  const timeframe = requestUrl.searchParams.get('timeframe') || '1H'

  if (!/^[A-Z0-9]{5,16}$/.test(symbol)) {
    json(response, 400, { error: 'Unsupported market symbol.' })
    return
  }

  json(response, 200, buildMarketContext(symbol, timeframe))
}

const handleChat = async (request, response) => {
  if (!process.env.OPENAI_API_KEY) {
    json(response, 503, {
      error: 'OPENAI_API_KEY is not configured on the API server.',
    })
    return
  }

  const { message, context } = await readBody(request)
  if (!message || typeof message !== 'string') {
    json(response, 400, { error: 'A message is required.' })
    return
  }

  const aiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: openAiModel,
      input: [
        {
          role: 'system',
          content:
            'You are a concise trading dashboard assistant. Explain signals, risk, and market context clearly. Do not provide guaranteed financial outcomes.',
        },
        {
          role: 'user',
          content: `Dashboard context: ${JSON.stringify(context || {})}\n\nUser question: ${message}`,
        },
      ],
    }),
  })

  if (!aiResponse.ok) {
    const detail = await aiResponse.text()
    throw new Error(`OpenAI API returned ${aiResponse.status}: ${detail.slice(0, 240)}`)
  }

  const payload = await aiResponse.json()
  json(response, 200, {
    answer:
      payload.output_text ||
      payload.output?.flatMap((item) => item.content || []).find((item) => item.text)?.text ||
      'The model returned an empty response.',
    model: openAiModel,
  })
}

createServer(async (request, response) => {
  const requestUrl = new URL(request.url || '/', `http://${request.headers.host}`)

  try {
    if (request.method === 'OPTIONS') {
      json(response, 204, {})
      return
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
      json(response, 200, { ok: true })
      return
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/market/candles') {
      await handleMarketCandles(requestUrl, response)
      return
    }

    if (request.method === 'GET' && requestUrl.pathname === '/api/market/context') {
      handleMarketContext(requestUrl, response)
      return
    }

    if (request.method === 'POST' && requestUrl.pathname === '/api/chat') {
      await handleChat(request, response)
      return
    }

    json(response, 404, { error: 'Endpoint not found.' })
  } catch (error) {
    json(response, 500, { error: error.message || 'Unexpected server error.' })
  }
}).listen(port, () => {
  console.log(`D-Line API server listening on http://localhost:${port}`)
})
