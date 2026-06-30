/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
import { appConfig } from '../config/appConfig.js'

const apiBaseUrl = appConfig.apiBaseUrl.replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const buildUrl = (path, params) => {
  const origin = globalThis.location?.origin || 'http://localhost'
  const url = new URL(`${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`, origin)

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}

export const apiRequest = async (path, { body, method = 'GET', params, signal } = {}) => {
  const response = await fetch(buildUrl(path, params), {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiError(payload?.error || `API request failed with status ${response.status}.`, response.status)
  }

  return payload
}
