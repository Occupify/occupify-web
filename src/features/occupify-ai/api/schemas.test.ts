import test from 'node:test'
import assert from 'node:assert/strict'
import {
  chatSessionsPageEnvelopeSchema,
  chatMessagesPageEnvelopeSchema,
  chatReplyResponseEnvelopeSchema,
  deleteChatSessionResponseSchema,
  streamMetaPayloadSchema,
  streamDeltaPayloadSchema,
  streamDonePayloadSchema,
  streamErrorPayloadSchema,
} from './schemas.ts'

test('chatSessionsPageEnvelopeSchema parses valid session list', () => {
  const payload = {
    statusCode: 200,
    message: 'OK',
    data: [
      {
        id: 'sess-123',
        userId: 'user-456',
        title: 'Tư vấn CV React',
        messageCount: 4,
        createdAt: '2026-10-27T10:00:00Z',
        updatedAt: '2026-10-27T10:05:00Z',
      },
    ],
    paging: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    },
  }

  const parsed = chatSessionsPageEnvelopeSchema.parse(payload)
  assert.equal(parsed.statusCode, 200)
  assert.equal(parsed.data.length, 1)
  assert.equal(parsed.data[0].id, 'sess-123')
  assert.equal(parsed.data[0].title, 'Tư vấn CV React')
  assert.equal(parsed.data[0].messageCount, 4)
})

test('chatSessionsPageEnvelopeSchema handles empty list', () => {
  const payload = {
    statusCode: 200,
    message: 'OK',
    data: [],
  }

  const parsed = chatSessionsPageEnvelopeSchema.parse(payload)
  assert.equal(parsed.data.length, 0)
})

test('chatMessagesPageEnvelopeSchema parses session messages', () => {
  const payload = {
    statusCode: 200,
    message: 'OK',
    data: [
      {
        id: 'msg-1',
        sessionId: 'sess-123',
        seq: 1,
        role: 'user',
        displayText: 'Xin chào AI',
        attachments: [],
        createdAt: '2026-10-27T10:00:00Z',
      },
      {
        id: 'msg-2',
        sessionId: 'sess-123',
        seq: 2,
        role: 'assistant',
        displayText: 'Chào bạn! Tôi có thể giúp gì?',
        attachments: [{ fileName: 'cv.pdf', pages: 2, removed: {} }],
        createdAt: '2026-10-27T10:00:02Z',
      },
    ],
    paging: { page: 1, limit: 50, total: 2, totalPages: 1 },
  }

  const parsed = chatMessagesPageEnvelopeSchema.parse(payload)
  assert.equal(parsed.data.length, 2)
  assert.equal(parsed.data[0].role, 'user')
  assert.equal(parsed.data[1].role, 'assistant')
  assert.equal(parsed.data[1].attachments?.length, 1)
  assert.equal(parsed.data[1].attachments?.[0].fileName, 'cv.pdf')
})

test('chatReplyResponseEnvelopeSchema parses non-streaming reply', () => {
  const payload = {
    statusCode: 200,
    message: 'OK',
    data: {
      sessionId: 'sess-999',
      newSession: true,
      messageId: 'asst-msg-1',
      reply: 'Dưới đây là gợi ý tối ưu CV của bạn...',
      attachments: [],
      model: 'glm-5.3-flashx',
      usage: {
        tokensIn: 500,
        tokensOut: 120,
      },
    },
  }

  const parsed = chatReplyResponseEnvelopeSchema.parse(payload)
  assert.equal(parsed.data.sessionId, 'sess-999')
  assert.equal(parsed.data.newSession, true)
  assert.equal(parsed.data.model, 'glm-5.3-flashx')
  assert.equal(parsed.data.usage.tokensIn, 500)
})

test('deleteChatSessionResponseSchema parses deletion confirmation', () => {
  const payload = {
    statusCode: 200,
    message: 'OK',
    data: { deleted: true },
  }

  const parsed = deleteChatSessionResponseSchema.parse(payload)
  assert.equal(parsed.data.deleted, true)
})

test('stream event schemas parse SSE payloads', () => {
  const meta = streamMetaPayloadSchema.parse({
    sessionId: 's-1',
    newSession: true,
    messageId: 'm-1',
    attachments: [],
  })
  assert.equal(meta.sessionId, 's-1')
  assert.equal(meta.newSession, true)

  const delta = streamDeltaPayloadSchema.parse({ text: 'Xin chào' })
  assert.equal(delta.text, 'Xin chào')

  const done = streamDonePayloadSchema.parse({
    model: 'glm-4.5',
    usage: { tokensIn: 10, tokensOut: 20 },
  })
  assert.equal(done.model, 'glm-4.5')
  assert.equal(done.usage.tokensOut, 20)

  const err = streamErrorPayloadSchema.parse({
    errorCode: 'CHAT_BUSY',
    message: 'Session is currently busy',
  })
  assert.equal(err.errorCode, 'CHAT_BUSY')
  assert.equal(err.message, 'Session is currently busy')
})
