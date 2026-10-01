import { Outlet } from 'react-router-dom'
import { UserNavBar } from './user-navbar'

export interface UserLayoutProps {
  unreadNotificationsCount?: number
}

export function UserLayout({ unreadNotificationsCount }: UserLayoutProps = {}) {
  return (
    <div className="min-h-screen !bg-[var(--bg-base)] flex flex-col font-sans !text-[var(--text-primary)] antialiased">
      <UserNavBar unreadNotificationsCount={unreadNotificationsCount} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
