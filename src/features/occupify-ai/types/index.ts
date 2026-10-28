export type AiMessageSender = 'user' | 'ai'

export interface AttachmentInfo {
  fileName: string
  pages?: number
  removed?: Record<string, number>
  [key: string]: unknown
}

export interface TokenUsage {
  tokensIn: number
  tokensOut: number
}

/**
 * Backend ChatSessionItem DTO
 */
export interface ChatSessionItem {
  id: string
  userId: string
  title: string
  messageCount: number
  createdAt: string
  updatedAt: string
}

/**
 * Backend ChatMessageItem DTO
 */
export interface ChatMessageItem {
  id: string
  sessionId: string
  seq: number
  role: 'user' | 'assistant'
  displayText: string
  attachments?: AttachmentInfo[]
  createdAt: string
}

/**
 * Backend Non-streaming ChatReplyData DTO
 */
export interface ChatReplyData {
  sessionId: string
  newSession: boolean
  messageId: string
  reply: string
  attachments: AttachmentInfo[]
  model: string
  usage: TokenUsage
}

/**
 * SSE Streaming Event Payloads
 */
export interface StreamMetaPayload {
  sessionId: string
  newSession: boolean
  messageId: string
  attachments: AttachmentInfo[]
}

export interface StreamDeltaPayload {
  text: string
}

export interface StreamDonePayload {
  model: string
  usage: TokenUsage
}

export interface StreamErrorPayload {
  errorCode?: string
  message: string
}

/**
 * Frontend UI Message Model
 */
export interface AiChatMessage {
  id: string
  sender: AiMessageSender
  content: string
  timestamp: string
  attachment?: {
    name: string
    size?: string
    type?: string
  }
  isStreaming?: boolean
  error?: string
  model?: string
}

/**
 * Frontend UI Session Model
 */
export interface AiChatSession {
  id: string
  title: string
  lastUpdated: string
  messageCount?: number
  messages: AiChatMessage[]
}

/**
 * Input for sending a chat message
 */
export interface SendChatMessageInput {
  message: string
  sessionId?: string | null
  context?: string | null
  clientMessageId?: string | null
  file?: File | null
  stream?: boolean
}

/**
 * Callbacks for handling SSE streaming events
 */
export interface StreamCallbacks {
  onMeta?: (meta: StreamMetaPayload) => void
  onDelta?: (text: string) => void
  onDone?: (done: StreamDonePayload) => void
  onError?: (error: StreamErrorPayload) => void
}

/**
 * Prompt Template for suggestions / quick-start
 */
export interface PromptTemplate {
  id: string
  category: 'jobs' | 'cv' | 'project' | 'career'
  badge: string
  title: string
  prompt: string
  description: string
  iconName: 'briefcase' | 'file-text' | 'folder-plus' | 'lightbulb'
}
