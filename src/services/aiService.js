/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { appConfig } from '../config/appConfig.js'

export const askTradingAssistant = async ({ message, context }) => {
  const response = await fetch(`${appConfig.apiBaseUrl}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || 'AI assistant is unavailable.')
  }

  return payload
}
