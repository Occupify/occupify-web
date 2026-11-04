const metaEnv =
  typeof import.meta !== 'undefined' ? (import.meta as { env?: ImportMetaEnv }).env : undefined

const getEnvVar = (key: keyof ImportMetaEnv, fallback = ''): string => {
  const value = metaEnv?.[key] ?? (typeof process !== 'undefined' ? process.env?.[key] : undefined)
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export const env = {
  appName: getEnvVar('VITE_APP_NAME', 'Occupify'),
  appEnv: (metaEnv?.VITE_APP_ENV ||
    (typeof process !== 'undefined' && process.env?.VITE_APP_ENV) ||
    'development') as 'development' | 'staging' | 'production',
  appPort: Number(getEnvVar('VITE_APP_PORT', '3000')),
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8180'),
  googleClientId: getEnvVar('VITE_GOOGLE_CLIENT_ID', ''),
} as const

export type ConfigEnv = typeof env
