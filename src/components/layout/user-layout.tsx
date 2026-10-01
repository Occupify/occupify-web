import { Outlet } from 'react-router-dom'
import { UserNavBar } from './user-navbar'

export function UserLayout() {
  return (
    <div className="min-h-screen !bg-[var(--bg-base)] flex flex-col font-sans !text-[var(--text-primary)] antialiased">
      <UserNavBar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
