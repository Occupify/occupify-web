import * as React from 'react'
import {
  PlusIcon,
  ChatCircleDotsIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  CaretLeftIcon,
  XIcon,
} from '@phosphor-icons/react'
import type { AiChatSession } from '@/features/occupify-ai'

interface AiSidebarProps {
  sessions: AiChatSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function AiSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}: AiSidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  const filteredSessions = React.useMemo(() => {
    if (!searchQuery.trim()) return sessions
    return sessions.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  }, [sessions, searchQuery])

  const content = (
    <aside
      className={`h-full flex flex-col bg-white border-r border-[var(--border-default)] transition-all duration-300 select-none ${
        isCollapsed ? 'w-16' : 'w-72 lg:w-80'
      }`}
    >
      {/* ─── Header & New Chat Button ─── */}
      <div className="p-3.5 border-b border-[var(--border-default)] flex items-center justify-between gap-2">
        {!isCollapsed ? (
          <>
            <button
              type="button"
              onClick={onNewChat}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] active:bg-[var(--color-primary-700)] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Tạo cuộc trò chuyện mới"
            >
              <PlusIcon size={16} weight="bold" />
              <span>Cuộc trò chuyện mới</span>
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Thu nhỏ thanh bên"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Đóng thanh bên"
            >
              <XIcon size={18} weight="bold" />
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={onNewChat}
              className="w-10 h-10 rounded-xl bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-600)] text-white flex items-center justify-center transition-all shadow-2xs cursor-pointer"
              title="Cuộc trò chuyện mới"
            >
              <PlusIcon size={18} weight="bold" />
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer rotate-180"
              title="Mở rộng thanh bên"
            >
              <CaretLeftIcon size={16} weight="bold" />
            </button>
          </div>
        )}
      </div>

      {/* ─── Search Bar (when expanded) ─── */}
      {!isCollapsed && (
        <div className="px-3.5 pt-3 pb-1">
          <div className="relative">
            <MagnifyingGlassIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm hội thoại..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[var(--border-default)] bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[var(--color-primary-500)] focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      {/* ─── Session History List ─── */}
      <div className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-1">
        {!isCollapsed && (
          <div className="px-2 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Lịch sử trò chuyện
          </div>
        )}

        {filteredSessions.length === 0
          ? !isCollapsed && (
              <div className="px-3 py-6 text-center text-xs text-slate-400">
                Chưa có cuộc trò chuyện nào phù hợp.
              </div>
            )
          : filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-semibold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id)
                    onCloseMobile()
                  }}
                  title={session.title}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <ChatCircleDotsIcon
                      size={17}
                      weight={isActive ? 'fill' : 'regular'}
                      className={`shrink-0 ${
                        isActive ? 'text-[var(--color-primary-500)]' : 'text-slate-400'
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="truncate flex-1">
                        <span className="block truncate">{session.title}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {session.lastUpdated}
                        </span>
                      </div>
                    )}
                  </div>

                  {!isCollapsed && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteSession(session.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-white transition-all cursor-pointer"
                      title="Xóa đoạn chat"
                    >
                      <TrashIcon size={14} />
                    </button>
                  )}
                </div>
              )
            })}
      </div>

      {/* ─── Footer Section ─── */}
      <div className="p-3 border-t border-[var(--border-default)] bg-slate-50/70">
        {!isCollapsed ? (
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[var(--color-primary-500)] text-white flex items-center justify-center">
                <SparkleIcon size={13} weight="fill" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-800 leading-tight">
                  Occupify AI
                </div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Sẵn sàng hỗ trợ
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Occupify AI sẵn sàng">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-500)] text-white flex items-center justify-center">
              <SparkleIcon size={14} weight="fill" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block h-full shrink-0">{content}</div>

      {/* Mobile drawer with backdrop */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 h-full shadow-2xl">{content}</div>
        </div>
      )}
    </>
  )
}
