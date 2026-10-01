import { Outlet } from 'react-router-dom'
import { Navbar, type NavbarProps } from './Navbar'

export interface AppLayoutProps extends NavbarProps {
  children?: React.ReactNode
}

export function AppLayout({ children, ...navbarProps }: AppLayoutProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-base, #F4F2EE)',
      }}
    >
      <Navbar {...navbarProps} />
      <main style={{ flex: 1 }}>{children ?? <Outlet />}</main>
    </div>
  )
}

export default AppLayout
