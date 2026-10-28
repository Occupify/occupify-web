import { useAuthStore } from '../../../stores/auth.ts'
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
import type {
  ChatSessionItem,
  ChatMessageItem,
  ChatReplyData,
  SendChatMessageInput,
  StreamCallbacks,
} from '../types/index.ts'

/**
 * AI Agentic Microservice URL (hardcoded localhost as specified by prompt, with env override)
 */
export const AI_AGENTIC_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_AGENTIC_BASE_URL) ||
  'http://localhost:8186'

/**
 * Helper to construct authentication headers from user store
 */
export function getAiAuthHeaders(): Record<string, string> {
  const { user, accessToken } = useAuthStore.getState()
  const headers: Record<string, string> = {
    'X-User-Id': user?.id || 'local-dev-user',
    'X-User-Role': user?.role || 'ROLE_USER',
    'X-User-Email': user?.email || 'dev@occupify.local',
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  return headers
}

/**
 * Fetch paginated list of chat sessions
 */
export async function getChatSessions(page = 1, limit = 50): Promise<ChatSessionItem[]> {
  const url = `${AI_AGENTIC_BASE_URL}/ai/chat/sessions?page=${page}&limit=${limit}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAiAuthHeaders(),
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to list chat sessions: ${response.status} ${response.statusText}`)
  }

  const raw = await response.json()
  const validated = chatSessionsPageEnvelopeSchema.parse(raw)
  return validated.data
}

/**
 * Fetch paginated messages for a given chat session
 */
export async function getSessionMessages(
  sessionId: string,
  page = 1,
  limit = 100,
): Promise<ChatMessageItem[]> {
  const url = `${AI_AGENTIC_BASE_URL}/ai/chat/sessions/${encodeURIComponent(sessionId)}/messages?page=${page}&limit=${limit}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...getAiAuthHeaders(),
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get session messages: ${response.status} ${response.statusText}`)
  }

  const raw = await response.json()
  const validated = chatMessagesPageEnvelopeSchema.parse(raw)
  return validated.data
}

/**
 * Delete a chat session
 */
export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const url = `${AI_AGENTIC_BASE_URL}/ai/chat/sessions/${encodeURIComponent(sessionId)}`
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...getAiAuthHeaders(),
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.status} ${response.statusText}`)
  }

  const raw = await response.json()
  const validated = deleteChatSessionResponseSchema.parse(raw)
  return validated.data.deleted
}

/**
 * Send a chat message (non-streaming)
 */
export async function sendChatMessage(input: SendChatMessageInput): Promise<ChatReplyData> {
  const formData = new FormData()
  formData.append('message', input.message)

  if (input.sessionId) {
    formData.append('sessionId', input.sessionId)
  }
  if (input.context) {
    formData.append('context', input.context)
  }
  if (input.clientMessageId) {
    formData.append('clientMessageId', input.clientMessageId)
  }
  if (input.file) {
    formData.append('files', input.file, input.file.name)
  }

  const url = `${AI_AGENTIC_BASE_URL}/ai/chat/messages?stream=false`
  const response = await fetch(url, {
    method: 'POST',
    headers: getAiAuthHeaders(),
    body: formData,
  })

  if (!response.ok) {
    let errMessage = `Request failed (${response.status})`
    try {
      const errJson = await response.json()
      if (errJson?.message) errMessage = errJson.message
    } catch {
      // ignore
    }
    throw new Error(errMessage)
  }

  const raw = await response.json()
  const validated = chatReplyResponseEnvelopeSchema.parse(raw)
  return validated.data
}

/**
 * Stream a chat turn using Server-Sent Events (SSE)
 */
export async function streamChatMessage(
  input: SendChatMessageInput,
  callbacks: StreamCallbacks,
  signal?: AbortSignal,
): Promise<void> {
  const formData = new FormData()
  formData.append('message', input.message)

  if (input.sessionId) {
    formData.append('sessionId', input.sessionId)
  }
  if (input.context) {
    formData.append('context', input.context)
  }
  if (input.clientMessageId) {
    formData.append('clientMessageId', input.clientMessageId)
  }
  if (input.file) {
    formData.append('files', input.file, input.file.name)
  }

  const url = `${AI_AGENTIC_BASE_URL}/ai/chat/messages?stream=true`
  const response = await fetch(url, {
    method: 'POST',
    headers: getAiAuthHeaders(),
    body: formData,
    signal,
  })

  if (!response.ok) {
    let errorMessage = `Lỗi kết nối AI (${response.status})`
    try {
      const errJson = await response.json()
      if (errJson?.message) errorMessage = errJson.message
    } catch {
      // ignore
    }
    callbacks.onError?.({ message: errorMessage })
    throw new Error(errorMessage)
  }

  if (!response.body) {
    throw new Error('ReadableStream not supported on this browser.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let currentEventName = 'message'

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // Keep the last incomplete fragment in buffer
      buffer = lines.pop() ?? ''

      for (const rawLine of lines) {
        const line = rawLine.trimEnd()
        if (!line) {
          // Empty line signals dispatch of previous event, reset event name
          currentEventName = 'message'
          continue
        }

        // Comment line (e.g. heartbeat ': ping')
        if (line.startsWith(':')) {
          continue
        }

        if (line.startsWith('event:')) {
          currentEventName = line.slice(6).trim()
          continue
        }

        if (line.startsWith('data:')) {
          const rawData = line.slice(5).trim()
          if (!rawData) continue

          try {
            const parsedData = JSON.parse(rawData)

            switch (currentEventName) {
              case 'meta': {
                const meta = streamMetaPayloadSchema.parse(parsedData)
                callbacks.onMeta?.(meta)
                break
              }
              case 'delta': {
                const delta = streamDeltaPayloadSchema.parse(parsedData)
                callbacks.onDelta?.(delta.text)
                break
              }
              case 'done': {
                const donePayload = streamDonePayloadSchema.parse(parsedData)
                callbacks.onDone?.(donePayload)
                break
              }
              case 'error': {
                const errPayload = streamErrorPayloadSchema.parse(parsedData)
                callbacks.onError?.(errPayload)
                break
              }
              default:
                break
            }
          } catch (jsonErr) {
            console.warn('[Occupify AI] Failed to parse SSE event data:', rawData, jsonErr)
          }
        }
      }
    }
  } catch (err: unknown) {
    if (signal?.aborted) {
      return
    }
    const msg = err instanceof Error ? err.message : 'Lỗi trong quá trình nhận phản hồi streaming'
    callbacks.onError?.({ message: msg })
    throw err
  } finally {
    reader.releaseLock()
  }
}
