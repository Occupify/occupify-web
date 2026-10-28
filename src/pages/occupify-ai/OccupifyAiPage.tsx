import * as React from 'react'
import {
  ListIcon,
  SparkleIcon,
  TrashIcon,
  CircleNotchIcon,
  WarningCircleIcon,
  StopIcon,
} from '@phosphor-icons/react'
import { AiSidebar } from './components/AiSidebar'
import { AiMessageItem } from './components/AiMessageItem'
import { AiWelcomeView } from './components/AiWelcomeView'
import { AiChatInput } from './components/AiChatInput'
import {
  useAiChatSessions,
  useAiSessionMessages,
  useDeleteAiSession,
  useSendAiMessage,
  formatMessageTime,
  type AiChatMessage,
} from '@/features/occupify-ai'

export function OccupifyAiPage() {
  const { data: serverSessions = [] } = useAiChatSessions()
  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null)
  const [optimisticMessages, setOptimisticMessages] = React.useState<AiChatMessage[]>([])
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [selectedInitialPrompt, setSelectedInitialPrompt] = React.useState<string>('')

  // Derive active session ID: user selection takes precedence, falls back to first server session
  const activeSessionId = selectedSessionId ?? (serverSessions[0]?.id || null)

  const { data: serverMessages = [], isLoading: isLoadingMessages } =
    useAiSessionMessages(activeSessionId)
  const deleteSessionMutation = useDeleteAiSession()
  const { isStreaming, streamingMessageId, streamingText, sendMessageStream, stopStreaming } =
    useSendAiMessage()

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of messages
  const scrollToBottom = React.useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }, [])

  React.useEffect(() => {
    scrollToBottom(false)
  }, [activeSessionId, scrollToBottom])

  // Combine server messages with optimistic messages and streaming turn
  const displayMessages = React.useMemo(() => {
    const combined: AiChatMessage[] = [...serverMessages]

    // Append optimistic user messages not yet reconciled into serverMessages
    for (const opt of optimisticMessages) {
      const alreadyInServer = combined.some(
        (m) => m.id === opt.id || (m.sender === 'user' && m.content === opt.content),
      )
      if (!alreadyInServer) {
        combined.push(opt)
      }
    }

    // Append live streaming message if active
    if (isStreaming && streamingMessageId) {
      combined.push({
        id: streamingMessageId,
        sender: 'ai',
        content: streamingText,
        timestamp: formatMessageTime(new Date().toISOString()),
        isStreaming: true,
      })
    }

    return combined
  }, [serverMessages, optimisticMessages, isStreaming, streamingMessageId, streamingText])

  React.useEffect(() => {
    if (displayMessages.length > 0) {
      scrollToBottom(true)
    }
  }, [displayMessages.length, streamingText, scrollToBottom])

  // Active session title
  const activeSession = React.useMemo(() => {
    return serverSessions.find((s) => s.id === activeSessionId) || null
  }, [serverSessions, activeSessionId])

  const activeTitle = activeSession?.title || 'Cuộc trò chuyện mới'

  // Select a session
  const handleSelectSession = (id: string) => {
    stopStreaming()
    setSelectedSessionId(id)
    setOptimisticMessages([])
    setErrorMessage(null)
  }

  // Create a new blank session
  const handleNewChat = () => {
    stopStreaming()
    const draftId = `draft-${Date.now()}`
    setSelectedSessionId(draftId)
    setOptimisticMessages([])
    setErrorMessage(null)
    setSelectedInitialPrompt('')
    setIsMobileSidebarOpen(false)
  }

  // Delete a session
  const handleDeleteSession = async (id: string) => {
    if (id.startsWith('draft-')) {
      setSelectedSessionId(serverSessions[0]?.id || null)
      setOptimisticMessages([])
      setErrorMessage(null)
      return
    }

    try {
      await deleteSessionMutation.mutateAsync(id)
      if (activeSessionId === id) {
        const remaining = serverSessions.filter((s) => s.id !== id)
        setSelectedSessionId(remaining[0]?.id || null)
        setOptimisticMessages([])
        setErrorMessage(null)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa cuộc trò chuyện'
      setErrorMessage(msg)
    }
  }

  // Clear messages in current session
  const handleClearCurrentChat = () => {
    if (activeSessionId) {
      handleDeleteSession(activeSessionId)
    }
  }

  // Send message
  const handleSendMessage = React.useCallback(
    async (
      content: string,
      file?: File | null,
      attachmentMeta?: { name: string; size: string; type?: string },
    ) => {
      if ((!content.trim() && !file) || isStreaming) return

      setErrorMessage(null)
      const nowTime = formatMessageTime(new Date().toISOString())

      const userMsg: AiChatMessage = {
        id: `user-temp-${Date.now()}`,
        sender: 'user',
        content: content || (file ? `Đã đính kèm tệp: ${file.name}` : ''),
        timestamp: nowTime,
        attachment: file
          ? {
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: file.type,
            }
          : attachmentMeta,
      }

      setOptimisticMessages((prev) => [...prev, userMsg])
      setSelectedInitialPrompt('')

      const currentSessionId =
        activeSessionId && !activeSessionId.startsWith('draft-') ? activeSessionId : undefined

      try {
        await sendMessageStream(
          {
            message: content || (file ? `Phân tích tệp ${file.name}` : ''),
            sessionId: currentSessionId,
            file: file || null,
          },
          {
            onNewSessionCreated: (newId) => {
              setSelectedSessionId(newId)
            },
            onError: (err) => {
              setErrorMessage(err.message)
            },
          },
        )
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ Occupify AI'
        setErrorMessage(msg)
      }
    },
    [activeSessionId, isStreaming, sendMessageStream],
  )

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex bg-[#F8FAFC] overflow-hidden">
      {/* ─── Sidebar ─── */}
      <AiSidebar
        sessions={serverSessions}
        activeSessionId={activeSessionId || ''}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* ─── Main Chat Panel ─── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Chat Header */}
        <header className="h-13 px-4 border-b border-[var(--border-default)] bg-white/80 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Mở danh sách trò chuyện"
            >
              <ListIcon size={18} weight="bold" />
            </button>

            {/* Session Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-[var(--color-primary-500)] shrink-0" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                {activeTitle}
              </h2>
            </div>
          </div>

          {/* Model Status & Actions */}
          <div className="flex items-center gap-2">
            {isStreaming && (
              <button
                type="button"
                onClick={stopStreaming}
                className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Dừng sinh phản hồi"
              >
                <StopIcon size={14} weight="bold" />
                <span className="hidden sm:inline">Dừng lại</span>
              </button>
            )}

            {/* Clear / Delete conversation button */}
            {activeSessionId && !activeSessionId.startsWith('draft-') && (
              <button
                type="button"
                onClick={handleClearCurrentChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Xóa cuộc trò chuyện này"
              >
                <TrashIcon size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
          {isLoadingMessages && displayMessages.length === 0 ? (
            <div className="m-auto flex flex-col items-center gap-2 text-slate-400">
              <CircleNotchIcon size={24} className="animate-spin text-[var(--color-primary-500)]" />
              <span className="text-xs font-medium">Đang tải lịch sử trò chuyện...</span>
            </div>
          ) : displayMessages.length === 0 ? (
            <AiWelcomeView />
          ) : (
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
              {displayMessages.map((msg) => (
                <AiMessageItem
                  key={msg.id}
                  message={msg}
                  onRegenerate={
                    msg.sender === 'ai' && !isStreaming
                      ? () => {
                          const lastUser = [...displayMessages]
                            .reverse()
                            .find((m) => m.sender === 'user')
                          if (lastUser) {
                            handleSendMessage(lastUser.content)
                          }
                        }
                      : undefined
                  }
                />
              ))}

              {/* Typing indicator bubble before first chunk */}
              {isStreaming && !streamingText && (
                <div className="flex items-start gap-3.5 py-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--color-primary-600)] to-[var(--color-primary-400)] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <SparkleIcon size={16} weight="fill" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-[var(--border-default)] shadow-2xs flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary-500)] animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Occupify AI đang phân tích dữ liệu...
                    </span>
                  </div>
                </div>
              )}

              {/* Error Alert Card */}
              {errorMessage && (
                <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
                  <WarningCircleIcon
                    size={18}
                    weight="fill"
                    className="shrink-0 text-rose-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <span className="font-semibold">Đã xảy ra lỗi: </span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <footer className="shrink-0 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC] to-transparent pt-2">
          <AiChatInput
            key={selectedInitialPrompt}
            onSendMessage={handleSendMessage}
            disabled={isStreaming}
            initialPrompt={selectedInitialPrompt}
          />
        </footer>
      </div>
    </div>
  )
}

export default OccupifyAiPage
