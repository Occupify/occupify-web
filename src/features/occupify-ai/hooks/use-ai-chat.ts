import * as React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getChatSessions,
  getSessionMessages,
  deleteChatSession,
  streamChatMessage,
} from '../api/chat-api.ts'
import type {
  AiChatMessage,
  AiChatSession,
  ChatSessionItem,
  ChatMessageItem,
  SendChatMessageInput,
  StreamMetaPayload,
  StreamDonePayload,
  StreamErrorPayload,
} from '../types/index.ts'

export const AI_CHAT_QUERY_KEYS = {
  all: ['ai-chat'] as const,
  sessions: () => ['ai-chat', 'sessions'] as const,
  messages: (sessionId?: string | null) => ['ai-chat', 'messages', sessionId] as const,
}

/**
 * Format timestamp to relative display (e.g. 'Vừa xong', '5 phút trước', 'Hôm qua')
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'Vừa xong'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7) return `${diffDays} ngày trước`

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}

/**
 * Format time to HH:mm
 */
export function formatMessageTime(dateString: string): string {
  if (!dateString) {
    const d = new Date()
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
  }
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Maps backend session DTO to UI session object
 */
export function toUiSession(item: ChatSessionItem): AiChatSession {
  return {
    id: item.id,
    title: item.title || 'Cuộc trò chuyện mới',
    lastUpdated: formatRelativeTime(item.updatedAt || item.createdAt),
    messageCount: item.messageCount,
    messages: [],
  }
}

/**
 * Maps backend message DTO to UI message object
 */
export function toUiMessage(item: ChatMessageItem): AiChatMessage {
  const attachment =
    item.attachments && item.attachments.length > 0
      ? {
          name: item.attachments[0].fileName || 'Tài liệu đính kèm',
          size: item.attachments[0].pages ? `${item.attachments[0].pages} trang` : undefined,
        }
      : undefined

  return {
    id: item.id,
    sender: item.role === 'assistant' ? 'ai' : 'user',
    content: item.displayText,
    timestamp: formatMessageTime(item.createdAt),
    attachment,
  }
}

/**
 * Hook to fetch all user chat sessions
 */
export function useAiChatSessions() {
  return useQuery({
    queryKey: AI_CHAT_QUERY_KEYS.sessions(),
    queryFn: async () => {
      const items = await getChatSessions()
      return items.map(toUiSession)
    },
    staleTime: 1000 * 30, // 30s
  })
}

/**
 * Hook to fetch messages for a specific session
 */
export function useAiSessionMessages(sessionId: string | null | undefined) {
  const isRealSession = Boolean(sessionId && !sessionId.startsWith('draft-'))

  return useQuery({
    queryKey: AI_CHAT_QUERY_KEYS.messages(sessionId),
    queryFn: async () => {
      if (!sessionId || !isRealSession) return []
      const items = await getSessionMessages(sessionId)
      return items.map(toUiMessage)
    },
    enabled: isRealSession,
    staleTime: 1000 * 60, // 1 min
  })
}

/**
 * Hook to delete a chat session
 */
export function useDeleteAiSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => deleteChatSession(sessionId),
    onSuccess: (_, sessionId) => {
      queryClient.setQueryData<AiChatSession[]>(AI_CHAT_QUERY_KEYS.sessions(), (prev) =>
        prev ? prev.filter((s) => s.id !== sessionId) : [],
      )
      queryClient.removeQueries({ queryKey: AI_CHAT_QUERY_KEYS.messages(sessionId) })
      queryClient.invalidateQueries({ queryKey: AI_CHAT_QUERY_KEYS.sessions() })
    },
  })
}

/**
 * Hook to send message with streaming SSE support
 */
export function useSendAiMessage() {
  const queryClient = useQueryClient()
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [streamingMessageId, setStreamingMessageId] = React.useState<string | null>(null)
  const [streamingText, setStreamingText] = React.useState('')
  const abortControllerRef = React.useRef<AbortController | null>(null)

  const stopStreaming = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const sendMessageStream = React.useCallback(
    async (
      input: SendChatMessageInput,
      options?: {
        onNewSessionCreated?: (newSessionId: string) => void
        onComplete?: () => void
        onError?: (err: Error) => void
      },
    ) => {
      stopStreaming()

      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsStreaming(true)
      setStreamingText('')
      setStreamingMessageId(`ai-stream-${Date.now()}`)

      let createdSessionId = input.sessionId || null

      try {
        await streamChatMessage(
          input,
          {
            onMeta: (meta: StreamMetaPayload) => {
              if (meta.sessionId && meta.newSession) {
                createdSessionId = meta.sessionId
                options?.onNewSessionCreated?.(meta.sessionId)
              }
            },
            onDelta: (textChunk: string) => {
              setStreamingText((prev) => prev + textChunk)
            },
            onDone: (_done: StreamDonePayload) => {
              setIsStreaming(false)
              setStreamingMessageId(null)

              // Invalidate sessions list and messages
              queryClient.invalidateQueries({ queryKey: AI_CHAT_QUERY_KEYS.sessions() })
              if (createdSessionId) {
                queryClient.invalidateQueries({
                  queryKey: AI_CHAT_QUERY_KEYS.messages(createdSessionId),
                })
              }
              options?.onComplete?.()
            },
            onError: (err: StreamErrorPayload) => {
              setIsStreaming(false)
              setStreamingMessageId(null)
              const error = new Error(err.message || 'Lỗi khi gửi tin nhắn')
              options?.onError?.(error)
            },
          },
          controller.signal,
        )
      } catch (err: unknown) {
        setIsStreaming(false)
        setStreamingMessageId(null)
        if (!controller.signal.aborted) {
          const error = err instanceof Error ? err : new Error('Lỗi gửi tin nhắn')
          options?.onError?.(error)
          throw error
        }
      } finally {
        abortControllerRef.current = null
      }
    },
    [queryClient, stopStreaming],
  )

  return {
    isStreaming,
    streamingMessageId,
    streamingText,
    sendMessageStream,
    stopStreaming,
  }
}
