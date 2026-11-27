import { Outlet } from 'react-router-dom'
import { useUnreadNotificationCount } from '@/features/notifications'
import { UserNavBar } from './user-navbar'

export interface UserLayoutProps {
  unreadNotificationsCount?: number
}

export function UserLayout({ unreadNotificationsCount }: UserLayoutProps = {}) {
  const { data: liveUnreadCount } = useUnreadNotificationCount()
  const effectiveUnreadCount = unreadNotificationsCount ?? liveUnreadCount

  return (
    <div className="min-h-screen !bg-[var(--bg-base)] flex flex-col font-sans !text-[var(--text-primary)] antialiased">
      <UserNavBar unreadNotificationsCount={effectiveUnreadCount} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
