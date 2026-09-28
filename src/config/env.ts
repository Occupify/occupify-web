const getEnvVar = (key: keyof ImportMetaEnv, fallback = ''): string => {
  const value = import.meta.env[key]
  return (typeof value === 'string' && value.length > 0) ? value : fallback
}

export const env = {
  appName: getEnvVar('VITE_APP_NAME', 'Occupify'),
  appEnv: (import.meta.env.VITE_APP_ENV || 'development') as 'development' | 'staging' | 'production',
  appPort: Number(getEnvVar('VITE_APP_PORT', '3000')),
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8080'),

  // Computed booleans
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development' || !import.meta.env.VITE_APP_ENV,
} as const

export type ConfigEnv = typeof env
