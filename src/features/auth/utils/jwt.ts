/**
 * Extract expiration timestamp in milliseconds from a JWT token.
 * Returns null if token is malformed or missing exp claim.
 */
export function getJwtExpirationMs(token: string | null): number | null {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(base64)
    const payload = JSON.parse(decoded)
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

/**
 * Checks whether the JWT token is expired or within the threshold buffer.
 * Default buffer is 60,000ms (1 minute).
 */
export function isJwtExpired(token: string | null, bufferMs = 60000): boolean {
  const exp = getJwtExpirationMs(token)
  if (!exp) return true
  return Date.now() >= exp - bufferMs
}
