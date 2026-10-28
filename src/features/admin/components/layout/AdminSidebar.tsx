import {
  BriefcaseMetalIcon,
  UsersThreeIcon,
  FileTextIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
} from '@phosphor-icons/react'
import type { AdminTabId } from '../../types'

interface AdminSidebarProps {
  activeNav: AdminTabId
  onSelectNav: (tab: AdminTabId) => void
  flaggedUsersCount: number
  pendingViolationsCount: number
  onBack: () => void
}

export function AdminSidebar({
  activeNav,
  onSelectNav,
  flaggedUsersCount,
  pendingViolationsCount,
  onBack,
}: AdminSidebarProps) {
  const NAV_ITEMS = [
    {
      id: 'users' as const,
      label: 'Quản lý tài khoản',
      Icon: UsersThreeIcon,
      badge: flaggedUsersCount > 0 ? flaggedUsersCount : null,
      badgeColor: 'text-[#B06000]',
      badgeBg: 'bg-[#FEF7E0]',
    },
    {
      id: 'projects' as const,
      label: 'Quản lý dự án',
      Icon: BriefcaseMetalIcon,
      badge: null,
      badgeColor: 'text-[#0A66C2]',
      badgeBg: 'bg-[#EAF1FA]',
    },
    {
      id: 'contracts' as const,
      label: 'Quản lý hợp đồng',
      Icon: FileTextIcon,
      badge: null,
      badgeColor: 'text-[#0A66C2]',
      badgeBg: 'bg-[#EAF1FA]',
    },
    {
      id: 'violations' as const,
      label: 'Báo cáo vi phạm',
      Icon: ShieldCheckIcon,
      badge: pendingViolationsCount > 0 ? pendingViolationsCount : null,
      badgeColor: 'text-[#C03A2B]',
      badgeBg: 'bg-[#FCE8E6]',
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col border-r border-black/8 bg-white select-none">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-black/8 px-[22px]">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
          <BriefcaseMetalIcon size={18} weight="fill" />
        </div>
        <span className="text-[17px] font-extrabold tracking-[-0.4px] text-[#0A66C2]">
          Occupify
        </span>
        <span className="shrink-0 rounded bg-[#EAF1FA] px-2 py-0.5 text-[11px] font-bold text-[#0A66C2]">
          Admin Portal
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        <div className="px-2.5 pb-2 pt-1 text-[11px] font-bold uppercase tracking-[0.8px] text-black/40">
          Bảng điều khiển cốt lõi
        </div>

        {NAV_ITEMS.map(({ id, label, Icon, badge, badgeColor, badgeBg }) => {
          const isActive = activeNav === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectNav(id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#EAF1FA] font-bold text-[#0A66C2]'
                  : 'text-black/70 hover:bg-[#FAFAF8] hover:text-black/90'
              }`}
            >
              <Icon size={18} weight={isActive ? 'fill' : 'regular'} className="shrink-0" />
              <span className="flex-1 truncate">{label}</span>
              {badge !== null && badge > 0 && (
                <span
                  className={`inline-flex h-[18px] min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${badgeBg} ${badgeColor}`}
                >
                  {badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer Profile & Back link */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-black/8 bg-[#FAFAF8] p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A66C2] text-xs font-extrabold text-white">
            AD
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-black/90">Quản trị viên</div>
            <div className="truncate text-[11px] text-black/45">admin@occupify.vn</div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-black/15 bg-white py-2 px-3.5 text-xs font-semibold text-black/75 transition-all hover:border-[#0A66C2] hover:bg-[#EAF1FA] hover:text-[#0A66C2]"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          <span>Quay lại Occupify</span>
        </button>
      </div>
    </aside>
  )
}
