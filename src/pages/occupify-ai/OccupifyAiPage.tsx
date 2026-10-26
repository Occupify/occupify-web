import * as React from 'react'
import { ListIcon, SparkleIcon, TrashIcon } from '@phosphor-icons/react'
import { INITIAL_SESSIONS } from './occupify-ai-mock-data'
import { AiSidebar } from './components/AiSidebar'
import { AiMessageItem } from './components/AiMessageItem'
import { AiWelcomeView } from './components/AiWelcomeView'
import { AiChatInput } from './components/AiChatInput'
import type { AiChatMessage, AiChatSession } from '@/features/occupify-ai'

export function OccupifyAiPage() {
  const [sessions, setSessions] = React.useState<AiChatSession[]>(INITIAL_SESSIONS)
  const [activeSessionId, setActiveSessionId] = React.useState<string>(INITIAL_SESSIONS[0].id)
  const [isTyping, setIsTyping] = React.useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [selectedInitialPrompt, setSelectedInitialPrompt] = React.useState<string>('')

  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const activeSession = React.useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0]
  }, [sessions, activeSessionId])

  // Auto-scroll to bottom of messages
  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
  }

  React.useEffect(() => {
    scrollToBottom(false)
  }, [activeSessionId])

  React.useEffect(() => {
    if (activeSession?.messages.length) {
      scrollToBottom(true)
    }
  }, [activeSession?.messages.length, isTyping])

  // Create a new blank session
  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`
    const newSession: AiChatSession = {
      id: newSessionId,
      title: 'Cuộc trò chuyện mới',
      lastUpdated: 'Vừa xong',
      messages: [],
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(newSessionId)
    setSelectedInitialPrompt('')
    setIsMobileSidebarOpen(false)
  }

  // Delete a session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id)
      if (updated.length === 0) {
        const fresh: AiChatSession = {
          id: `session-${Date.now()}`,
          title: 'Cuộc trò chuyện mới',
          lastUpdated: 'Vừa xong',
          messages: [],
        }
        setActiveSessionId(fresh.id)
        return [fresh]
      }
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id)
      }
      return updated
    })
  }

  // Clear messages in current session
  const handleClearCurrentChat = () => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [] }
        }
        return s
      }),
    )
  }

  // Send message
  const handleSendMessage = React.useCallback(
    (content: string, attachment?: { name: string; size: string; type?: string }) => {
      if (!content.trim() && !attachment) return

      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

      const userMsg: AiChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user',
        content: content || 'Đã đính kèm tệp tài liệu.',
        timestamp: timeStr,
        attachment,
      }

      // Update session title if first user message
      const isFirstMessage = activeSession.messages.length === 0
      const updatedTitle = isFirstMessage
        ? content.slice(0, 34) + (content.length > 34 ? '...' : '')
        : activeSession.title

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              title: updatedTitle,
              lastUpdated: 'Vừa xong',
              messages: [...s.messages, userMsg],
            }
          }
          return s
        }),
      )

      // Clear initial prompt if used
      setSelectedInitialPrompt('')

      // Simulate AI response
      setIsTyping(true)
      setTimeout(() => {
        let aiReply = ''
        if (attachment) {
          aiReply = `Tôi đã nhận và phân tích tệp tài liệu **${attachment.name}** (${attachment.size}).

* **Điểm nổi bật:** Hồ sơ có cấu trúc rõ ràng, định vị tốt chuyên môn lập trình và kinh nghiệm triển khai dự án.
* **Gợi ý tối ưu:**
  1. Thêm số liệu đo lường cụ thể cho từng đầu việc (KPI / tỷ lệ % tối ưu hiệu năng).
  2. Bổ sung các từ khóa công nghệ mới nhất: **React 19, TypeScript, Clean Architecture**.
  3. Đính kèm liên kết sản phẩm hoặc hồ sơ GitHub thực tế để tăng uy tín.

Bạn muốn tôi viết lại đoạn tóm tắt chuyên môn (Summary Statement) hay lập kế hoạch tìm dự án phù hợp với hồ sơ này?`
        } else if (
          content.toLowerCase().includes('remote') ||
          content.toLowerCase().includes('việc')
        ) {
          aiReply = `Tôi đã rà soát danh sách các dự án đang tuyển dụng trên Occupify:

* **Frontend React & Next.js Engineer** · Mức ngân sách: **28.000.000 ₫** (Remote 100%)
* **Full-stack Node.js & React Developer** · Mức thù lao: **450.000 ₫ / giờ** (Linh hoạt)
* **Lead UI/UX & Design System** · Mức ngân sách: **32.000.000 ₫** (Hợp đồng trọn gói)

Bạn có thể vào tab **Quản lý dự án** để xem chi tiết hoặc yêu cầu tôi hỗ trợ soạn thảo thư chào thầu (Proposal) nhé!`
        } else {
          aiReply = `Cảm ơn câu hỏi của bạn! Dưới đây là phản hồi tư vấn từ Occupify AI:

* **Phân tích yêu cầu:** Đối với mục tiêu bạn vừa đề cập, việc chuẩn bị một kế hoạch chi tiết theo từng mốc (Milestones) là yếu tố quyết định để bảo chứng rủi ro thanh toán.
* **Đề xuất hành động:**
  1. Định nghĩa rõ phạm vi công việc (Scope of Work) và tiêu chí nghiệm thu rõ ràng.
  2. Áp dụng hợp đồng thanh toán ký quỹ Escrow bảo đảm tiền thù lao luôn sẵn sàng trước khi bắt đầu code.
  3. Cập nhật tiến độ định kỳ hàng tuần cho đối tác.

Nếu bạn cần hỗ trợ soạn thảo văn bản hoặc phân tích bảng giá chi tiết, hãy cho tôi biết thêm thông tin cụ thể nhé!`
        }

        const aiMsg: AiChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          content: aiReply,
          timestamp: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
        }

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id === activeSessionId) {
              return {
                ...s,
                messages: [...s.messages, aiMsg],
              }
            }
            return s
          }),
        )
        setIsTyping(false)
      }, 900)
    },
    [activeSession.messages.length, activeSession.title, activeSessionId],
  )

  return (
    <div className="h-[calc(100dvh-3.5rem)] flex bg-[#F8FAFC] overflow-hidden">
      {/* ─── Sidebar ─── */}
      <AiSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
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
                {activeSession.title}
              </h2>
            </div>
          </div>

          {/* Model Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Clear conversation button */}
            {activeSession.messages.length > 0 && (
              <button
                type="button"
                onClick={handleClearCurrentChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Làm mới cuộc trò chuyện này"
              >
                <TrashIcon size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col">
          {activeSession.messages.length === 0 ? (
            <AiWelcomeView />
          ) : (
            <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
              {activeSession.messages.map((msg) => (
                <AiMessageItem
                  key={msg.id}
                  message={msg}
                  onRegenerate={
                    msg.sender === 'ai'
                      ? () => {
                          const lastUser = [...activeSession.messages]
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

              {/* Typing indicator bubble */}
              {isTyping && (
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
                      Occupify AI đang suy nghĩ...
                    </span>
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
            disabled={isTyping}
            initialPrompt={selectedInitialPrompt}
          />
        </footer>
      </div>
    </div>
  )
}

export default OccupifyAiPage
