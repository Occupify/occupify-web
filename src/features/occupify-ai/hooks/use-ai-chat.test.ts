import test from 'node:test'
import assert from 'node:assert/strict'
import { formatRelativeTime, formatMessageTime, toUiSession, toUiMessage } from './use-ai-chat.ts'
import type { ChatSessionItem, ChatMessageItem } from '../types'

test('formatRelativeTime returns expected strings', () => {
  assert.equal(formatRelativeTime(''), 'Vừa xong')

  const now = new Date()
  assert.equal(formatRelativeTime(now.toISOString()), 'Vừa xong')

  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  assert.equal(formatRelativeTime(fiveMinutesAgo.toISOString()), '5 phút trước')

  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)
  assert.equal(formatRelativeTime(twoHoursAgo.toISOString()), '2 giờ trước')
})

test('formatMessageTime returns HH:mm format', () => {
  const dateStr = '2026-10-27T14:35:00Z'
  const formatted = formatMessageTime(dateStr)
  assert.match(formatted, /^\d{2}:\d{2}$/)
})

test('toUiSession converts backend session item properly', () => {
  const item: ChatSessionItem = {
    id: 's-123',
    userId: 'u-1',
    title: 'Phân tích dự án',
    messageCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const ui = toUiSession(item)
  assert.equal(ui.id, 's-123')
  assert.equal(ui.title, 'Phân tích dự án')
  assert.equal(ui.messageCount, 5)
  assert.equal(ui.messages.length, 0)
})

test('toUiMessage converts backend message item properly', () => {
  const userItem: ChatMessageItem = {
    id: 'm-1',
    sessionId: 's-1',
    seq: 1,
    role: 'user',
    displayText: 'Xin chào',
    createdAt: '2026-10-27T10:00:00Z',
  }
  const userUi = toUiMessage(userItem)
  assert.equal(userUi.sender, 'user')
  assert.equal(userUi.content, 'Xin chào')
  assert.equal(userUi.attachment, undefined)

  const asstItem: ChatMessageItem = {
    id: 'm-2',
    sessionId: 's-1',
    seq: 2,
    role: 'assistant',
    displayText: 'Chào bạn!',
    attachments: [{ fileName: 'CV_React.pdf', pages: 2, removed: {} }],
    createdAt: '2026-10-27T10:00:05Z',
  }
  const asstUi = toUiMessage(asstItem)
  assert.equal(asstUi.sender, 'ai')
  assert.equal(asstUi.content, 'Chào bạn!')
  assert.equal(asstUi.attachment?.name, 'CV_React.pdf')
  assert.equal(asstUi.attachment?.size, '2 trang')
})
