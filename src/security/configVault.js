/**
 * Copyright (c) 2026 Tariq Mehmood (Tariq Jarral). All Rights Reserved.
 */
export const configVault = Object.freeze({
  getPublicRuntimeConfig() {
    return {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
      authIssuer: import.meta.env.VITE_AUTH_ISSUER || '',
      licenseEndpoint: import.meta.env.VITE_LICENSE_ENDPOINT || '',
    }
  },
})
