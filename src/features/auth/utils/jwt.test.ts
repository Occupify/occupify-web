import test from 'node:test'
import assert from 'node:assert/strict'
import { getJwtExpirationMs, isJwtExpired } from './jwt.ts'

test('getJwtExpirationMs returns null for invalid or empty tokens', () => {
  assert.equal(getJwtExpirationMs(null), null)
  assert.equal(getJwtExpirationMs(''), null)
  assert.equal(getJwtExpirationMs('invalid-token'), null)
})

test('getJwtExpirationMs correctly parses exp claim from valid JWT', () => {
  const futureExpSeconds = Math.floor(Date.now() / 1000) + 3600 // 1 hour in future
  const payload = {
    sub: 'user@occupify.work',
    exp: futureExpSeconds,
  }
  const token = `header.${btoa(JSON.stringify(payload))}.signature`
  const expMs = getJwtExpirationMs(token)
  assert.equal(expMs, futureExpSeconds * 1000)
  assert.equal(isJwtExpired(token, 60000), false)
})

test('isJwtExpired identifies expired or near-expiry tokens', () => {
  const pastExpSeconds = Math.floor(Date.now() / 1000) - 100 // 100s in past
  const pastToken = `header.${btoa(JSON.stringify({ exp: pastExpSeconds }))}.sig`
  assert.equal(isJwtExpired(pastToken), true)

  const soonExpSeconds = Math.floor(Date.now() / 1000) + 30 // 30s in future (buffer is 60s)
  const soonToken = `header.${btoa(JSON.stringify({ exp: soonExpSeconds }))}.sig`
  assert.equal(isJwtExpired(soonToken, 60000), true)
})
