import { useState } from 'react'
import { BellIcon, DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import { toast } from '@/components/feedback'
import { NotifBadge } from './notif-badge'
import { MOCK_NOTIFICATIONS } from '@/features/mock-data'
import type { Notif, NotifTab } from '../types'

const NOTIF_TABS = [
  { id: 'all' as NotifTab, label: 'Tất cả' },
  { id: 'unread' as NotifTab, label: 'Chưa đọc' },
]

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notif[]>(MOCK_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<NotifTab>('all')

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc')
  }

  const visibleList = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead
    return true
  })

  return (
    <div className="min-h-full px-4 py-6 pb-12 !bg-[var(--bg-base)]">
      <div className="mx-auto grid max-w-[1128px] grid-cols-1 items-start gap-5 md:grid-cols-[280px_1fr]">
        {/* Left Tabs */}
        <div className="overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-xs">
          <div className="border-b p-3.5 px-4 text-base font-bold !text-[var(--text-primary)] !border-[var(--border-default)]">
            Quản lý thông báo
          </div>
          {NOTIF_TABS.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full cursor-pointer items-center justify-between border-b border-l-4 px-4 py-3 text-left text-sm font-semibold transition-all !border-b-[var(--border-subtle)] ${
                  isActive
                    ? 'border-l-[var(--color-primary-500)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]'
                    : 'border-l-transparent !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'unread' && unreadCount > 0 && (
                  <span className="min-w-[18px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-bold !text-white !bg-[var(--color-primary-500)]">
                    {unreadCount}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right Feed */}
        <div>
          <div className="mb-2.5 flex items-center justify-end">
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold !text-[var(--text-secondary)] transition-colors hover:!bg-[var(--color-primary-50)] hover:!text-[var(--color-primary-500)]"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-xs">
            {visibleList.length === 0 ? (
              <div className="p-12 text-center text-sm !text-[var(--text-tertiary)]">
                Không có thông báo nào.
              </div>
            ) : (
              <div className="divide-y !divide-[var(--border-subtle)]">
                {visibleList.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`flex cursor-pointer items-start gap-3.5 p-3.5 px-4.5 transition-colors ${
                      notif.isRead
                        ? '!bg-[var(--bg-elevated)] hover:!bg-[var(--bg-subtle)]'
                        : '!bg-[#EAF1FA] hover:!bg-[#DCEEFF]'
                    }`}
                  >
                    {/* Avatar with badge */}
                    <div className="relative shrink-0">
                      {notif.actorName === 'Occupify' || notif.actorName === 'Occupify Team' ? (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full !text-white !bg-[var(--color-primary-500)]">
                          <BellIcon size={22} weight="fill" />
                        </div>
                      ) : (
                        <Avatar name={notif.actorName || notif.title} size="md" />
                      )}
                      <div className="absolute -bottom-1 -right-1">
                        <NotifBadge type={notif.badgeType} />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="m-0 text-sm leading-relaxed !text-[var(--text-primary)]">
                        <strong>{notif.actorName ?? notif.title}</strong> {notif.content}
                      </p>
                      <div
                        className={`mt-1 text-xs ${
                          notif.isRead
                            ? 'font-normal !text-[var(--text-tertiary)]'
                            : 'font-semibold !text-[var(--color-primary-500)]'
                        }`}
                      >
                        {notif.time}
                      </div>
                    </div>

                    {/* Meta indicator & actions */}
                    <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                      {!notif.isRead && (
                        <div className="h-2 w-2 rounded-full !bg-[var(--color-primary-500)]" />
                      )}
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer rounded-full p-1 !text-[var(--text-tertiary)] hover:!bg-[var(--color-primary-50)] hover:!text-[var(--text-primary)]"
                      >
                        <DotsThreeVerticalIcon size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
