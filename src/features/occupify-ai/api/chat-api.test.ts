import test from 'node:test'
import assert from 'node:assert/strict'
import { env } from '../../../config/env.ts'
import { getAiAuthHeaders, getChatSessions, deleteChatSession } from './chat-api.ts'

test('getChatSessions targets env.apiBaseUrl endpoint', async () => {
  const originalFetch = globalThis.fetch
  let calledUrl = ''
  globalThis.fetch = async (input) => {
    calledUrl = String(input)
    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: 'OK',
        data: [],
        paging: { page: 1, limit: 50, total: 0, totalPages: 0 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    await getChatSessions(1, 50)
    const expectedBaseUrl = env.apiBaseUrl.replace(/\/+$/, '')
    assert.ok(calledUrl.startsWith(`${expectedBaseUrl}/ai/chat/sessions`))
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('getChatSessions normalizes trailing slashes in env.apiBaseUrl without double slashes', async () => {
  const originalFetch = globalThis.fetch
  const originalBaseUrl = env.apiBaseUrl
  let calledUrl = ''

  globalThis.fetch = async (input) => {
    calledUrl = String(input)
    return new Response(
      JSON.stringify({
        statusCode: 200,
        message: 'OK',
        data: [],
        paging: { page: 1, limit: 50, total: 0, totalPages: 0 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
    Object.defineProperty(env, 'apiBaseUrl', {
      value: 'https://occupify.tienvm.dpdns.org/api///',
      configurable: true,
    })

    await getChatSessions(1, 10)

    assert.equal(
      calledUrl,
      'https://occupify.tienvm.dpdns.org/api/ai/chat/sessions?page=1&limit=10',
    )
    assert.equal(calledUrl.includes('//ai/chat'), false)
  } finally {
    Object.defineProperty(env, 'apiBaseUrl', {
      value: originalBaseUrl,
      configurable: true,
    })
    globalThis.fetch = originalFetch
  }
})

test('getAiAuthHeaders includes default dev user when not logged in', () => {
  const headers = getAiAuthHeaders()
  assert.ok(headers['X-User-Id'])
  assert.ok(headers['X-User-Role'])
  assert.ok(headers['X-User-Email'])
})

test('getChatSessions parses fetched session list', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        statusCode: 200,
        message: 'OK',
        data: [
          {
            id: 'mock-session-1',
            userId: 'user-1',
            title: 'Mock Chat Session',
            messageCount: 3,
            createdAt: '2026-10-27T10:00:00Z',
            updatedAt: '2026-10-27T10:05:00Z',
          },
        ],
        paging: { page: 1, limit: 20, total: 1, totalPages: 1 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )

  try {
    const sessions = await getChatSessions()
    assert.equal(sessions.length, 1)
    assert.equal(sessions[0].id, 'mock-session-1')
    assert.equal(sessions[0].title, 'Mock Chat Session')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('deleteChatSession returns deletion status', async () => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({
        statusCode: 200,
        message: 'OK',
        data: { deleted: true },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )

  try {
    const deleted = await deleteChatSession('mock-session-1')
    assert.equal(deleted, true)
  } finally {
    globalThis.fetch = originalFetch
  }
})
