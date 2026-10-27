import test from 'node:test'
import assert from 'node:assert/strict'
import {
  AI_AGENTIC_BASE_URL,
  getAiAuthHeaders,
  getChatSessions,
  deleteChatSession,
} from './chat-api.ts'

test('AI_AGENTIC_BASE_URL points to localhost by default', () => {
  assert.ok(AI_AGENTIC_BASE_URL.includes('localhost:8186'))
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
