import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  HouseIcon,
  BriefcaseIcon,
  BookmarkSimpleIcon,
  BellIcon,
  CaretDownIcon,
  UserIcon,
  WalletIcon,
  ReceiptIcon,
  SignOutIcon,
} from '@phosphor-icons/react'
import { OccupifyLogo, Avatar } from '@/components/ui'
import { toast } from '@/components/feedback'
import { useCurrentUser } from '@/features/auth'
import { useAuthStore } from '@/stores'

export interface NavItemConfig {
  id: string
  path: string
  label: string
  Icon: typeof HouseIcon
  badge?: number | string
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', path: '/home', label: 'Trang chủ', Icon: HouseIcon },
  { id: 'projects', path: '/projects', label: 'Quản lý dự án', Icon: BriefcaseIcon },
  { id: 'saved', path: '/saved', label: 'Mục đã lưu', Icon: BookmarkSimpleIcon },
  { id: 'notifications', path: '/notifications', label: 'Thông báo', Icon: BellIcon, badge: 3 },
]

export interface NavbarProps {
  userName?: string
  userHeadline?: string
  onOpenProfile?: () => void
  onOpenWallet?: () => void
  onOpenFinancialHistory?: () => void
  onLogout?: () => void
}

export function Navbar({
  userName,
  userHeadline,
  onOpenProfile,
  onOpenWallet,
  onOpenFinancialHistory,
  onLogout,
}: NavbarProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Server state: User profile from TanStack Query
  const { data: currentUser } = useCurrentUser()
  const clearTokens = useAuthStore((state) => state.clearTokens)

  const displayName = userName ?? currentUser?.fullName ?? ''
  const displayHeadline =
    userHeadline ?? currentUser?.headline ?? currentUser?.email ?? ''
  const avatarUrl = currentUser?.avatarUrl

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    clearTokens()
    if (onLogout) {
      onLogout()
    } else {
      toast.info('Đã đăng xuất khỏi tài khoản Occupify')
      navigate('/')
    }
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 200,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        height: 56,
      }}
    >
      <div
        style={{
          maxWidth: 1128,
          margin: '0 auto',
          padding: '0 16px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/home')}
          style={{ flexShrink: 0, cursor: 'pointer' }}
          title="Occupify"
        >
          <OccupifyLogo size={32} />
        </div>

        {/* Center Nav Items */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            height: '100%',
          }}
        >
          {NAV_ITEMS.map(({ id, path, label, Icon, badge }) => (
            <NavLink
              key={id}
              to={path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: isActive ? '#EFF6FF' : 'transparent',
                borderRadius: 8,
                color: isActive ? '#0A66C2' : '#64748B',
                position: 'relative',
                transition: 'all 150ms ease',
                textDecoration: 'none',
                fontFamily: 'inherit',
              })}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                if (!el.classList.contains('active')) {
                  el.style.background = '#F1F5F9'
                  el.style.color = '#0F172A'
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                if (!el.classList.contains('active')) {
                  el.style.background = 'transparent'
                  el.style.color = '#64748B'
                }
              }}
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} weight={isActive ? 'fill' : 'regular'} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 600,
                      lineHeight: 1,
                    }}
                  >
                    {label}
                  </span>
                  {badge && (
                    <span
                      style={{
                        background: '#EF4444',
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: 700,
                        lineHeight: 1,
                        padding: '2px 5px',
                        borderRadius: 9999,
                        minWidth: 16,
                        textAlign: 'center',
                        border: '1.5px solid #fff',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right User Profile Dropdown Menu */}
        <div
          ref={menuRef}
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 10px',
              background: menuOpen ? '#F1F5F9' : 'transparent',
              border: '1px solid',
              borderColor: menuOpen ? '#CBD5E1' : 'transparent',
              borderRadius: 8,
              cursor: 'pointer',
              color: '#334155',
              transition: 'all 150ms ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!menuOpen) {
                ;(e.currentTarget as HTMLElement).style.background = '#F1F5F9'
              }
            }}
            onMouseLeave={(e) => {
              if (!menuOpen) {
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              }
            }}
          >
            <Avatar name={displayName} src={avatarUrl} size="xs" />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Tôi
              <CaretDownIcon
                size={11}
                weight="bold"
                style={{
                  transform: menuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 150ms',
                  color: '#64748B',
                }}
              />
            </span>
          </button>

          {/* Dropdown Menu Panel */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                boxShadow:
                  '0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04)',
                minWidth: 240,
                zIndex: 300,
                overflow: 'hidden',
                padding: '4px',
              }}
            >
              {/* Profile summary header in dropdown */}
              <div
                style={{
                  padding: '12px 14px',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: 4,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={displayName} src={avatarUrl} size="sm" />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 13.5,
                        color: '#0F172A',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayName}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: '#64748B',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.4,
                      }}
                    >
                      {displayHeadline}
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onOpenProfile?.()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    color: '#334155',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = '#F8FAFC'
                    ;(e.currentTarget as HTMLElement).style.color = '#0A66C2'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#334155'
                  }}
                >
                  <UserIcon size={16} />
                  <span>Hồ sơ của tôi</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onOpenWallet?.()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    color: '#334155',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = '#F8FAFC'
                    ;(e.currentTarget as HTMLElement).style.color = '#0A66C2'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#334155'
                  }}
                >
                  <WalletIcon size={16} />
                  <span>Ví tài khoản Occupify</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    onOpenFinancialHistory?.()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    color: '#334155',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = '#F8FAFC'
                    ;(e.currentTarget as HTMLElement).style.color = '#0A66C2'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = '#334155'
                  }}
                >
                  <ReceiptIcon size={16} />
                  <span>Lịch sử thu chi</span>
                </button>

                <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: 'transparent',
                    color: '#DC2626',
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = '#FEF2F2'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                >
                  <SignOutIcon size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
