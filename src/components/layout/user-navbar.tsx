import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  BellIcon,
  BookmarkIcon,
  BriefcaseMetalIcon,
  CaretDownIcon,
  HouseIcon,
  SignOutIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'

export interface UserNavBarProps {
  unreadNotificationsCount?: number
}

export function UserNavBar({ unreadNotificationsCount }: UserNavBarProps = {}) {
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navItems = [
    { to: '/not-found', label: 'Trang chủ', Icon: HouseIcon, end: true },
    { to: '/workspace', label: 'Quản lý dự án', Icon: BriefcaseMetalIcon, end: false },
    { to: '/saved', label: 'Mục đã lưu', Icon: BookmarkIcon, end: false },
    {
      to: '/notifications',
      label: 'Thông báo',
      Icon: BellIcon,
      badge:
        unreadNotificationsCount && unreadNotificationsCount > 0
          ? unreadNotificationsCount
          : undefined,
      end: false,
    },
  ]

  return (
    <header className="sticky top-0 z-40 h-14 border-b px-4 backdrop-blur-md !bg-[var(--bg-elevated)]/95 !border-[var(--border-default)] shadow-xs sm:px-6">
      <div className="mx-auto flex h-full max-w-[1128px] items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex select-none items-center gap-2.5 no-underline"
          title="Occupify"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg !text-white shadow-sm !bg-[var(--color-primary-500)]">
            <BriefcaseMetalIcon size={19} color="#fff" weight="fill" />
          </div>
          <span className="text-[22px] font-extrabold leading-none tracking-tight !text-[var(--color-primary-500)]">
            Occupify
          </span>
        </NavLink>

        {/* Navigation horizontal pills */}
        <nav className="flex h-full items-center gap-1 sm:gap-2">
          {navItems.map(({ to, label, Icon, badge, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              replace
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold transition-all cursor-pointer ${
                  isActive
                    ? '!bg-[var(--color-primary-50)] !text-[var(--color-primary-500)] font-bold'
                    : '!text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)] hover:!text-[var(--text-primary)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={19} weight={isActive ? 'fill' : 'regular'} />
                  <span className="hidden sm:inline">{label}</span>
                  {badge !== undefined && (
                    <span className="min-w-[16px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold !text-white !bg-[#EF4444] shadow-xs">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          {/* User profile dropdown */}
          <div
            ref={menuRef}
            className="relative ml-2 flex items-center border-l pl-3 !border-[var(--border-default)]"
          >
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border p-1.5 px-2 transition-colors ${
                menuOpen
                  ? '!border-[var(--border-default)] !bg-[var(--bg-subtle)]'
                  : 'border-transparent hover:!bg-[var(--bg-subtle)]'
              }`}
            >
              <Avatar name="Nguyễn Minh Khoa" size="xs" />
              <span className="flex items-center gap-1 text-[13px] font-semibold !text-[var(--text-primary)]">
                Tôi
                <CaretDownIcon
                  size={11}
                  weight="bold"
                  className={`!text-[var(--text-tertiary)] transition-transform duration-150 ${
                    menuOpen ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 overflow-hidden rounded-xl border p-1 shadow-lg animate-in fade-in zoom-in-95 !border-[var(--border-default)] !bg-[var(--bg-elevated)]">
                <div className="border-b p-3 !border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Nguyễn Minh Khoa" size="sm" />
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold !text-[var(--text-primary)]">
                        Nguyễn Minh Khoa
                      </div>
                      <div className="truncate text-[11px] !text-[var(--text-tertiary)]">
                        Senior Architect
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/not-found')
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)] hover:!text-[var(--text-primary)]"
                  >
                    <UserIcon size={16} />
                    <span>Hồ sơ của tôi</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/not-found')
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)] hover:!text-[var(--text-primary)]"
                  >
                    <WalletIcon size={16} />
                    <span>Ví tài khoản</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false)
                      navigate('/not-found')
                    }}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold !text-[#C03A2B] hover:!bg-[#FBE2E2]"
                  >
                    <SignOutIcon size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export const UserNavbar = UserNavBar
