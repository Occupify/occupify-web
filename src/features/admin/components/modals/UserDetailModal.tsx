import {
  UserCircleIcon,
  XIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  BriefcaseMetalIcon,
} from '@phosphor-icons/react'
import type { AdminUser } from '../../types'
import { AdminStatusBadge } from '../shared'

interface UserDetailModalProps {
  user: AdminUser | null
  onClose: () => void
  onToggleLock: (id: number) => void
  onDeleteClick: (user: AdminUser) => void
}

export function UserDetailModal({
  user,
  onClose,
  onToggleLock,
  onDeleteClick,
}: UserDetailModalProps) {
  if (!user) return null

  const isLocked = user.status === 'Bị khóa'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[900px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <UserCircleIcon size={22} className="text-[#0A66C2]" weight="bold" />
            <h2 className="text-lg font-bold text-black/90">Thông tin tài khoản</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black/80"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-[1.05fr_1fr]">
          {/* Cột trái: Thông tin cá nhân & Hoạt động */}
          <div className="flex flex-col gap-4">
            {/* User Banner */}
            <div className="flex items-start gap-3.5">
              <div
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-lg font-extrabold text-white"
                style={{ backgroundColor: user.color }}
              >
                {user.initials}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[17px] font-bold text-black/90">{user.name}</h3>
                  <AdminStatusBadge status={user.status} />
                </div>
                <div className="mt-1 flex flex-col gap-1 text-xs text-black/60">
                  <div className="flex items-center gap-1.5">
                    <EnvelopeIcon size={14} className="shrink-0 text-black/45" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PhoneIcon size={14} className="shrink-0 text-black/45" />
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Joined & Last login Box */}
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#FAFAF8] p-3 text-xs">
              <div>
                <span className="text-black/45 font-medium">Ngày tham gia:</span>
                <div className="font-bold text-black/80">{user.joined}</div>
              </div>
              <div>
                <span className="text-black/45 font-medium">Đăng nhập gần nhất:</span>
                <div className="font-bold text-black/80">{user.lastLogin}</div>
              </div>
            </div>

            {/* Stats 3 columns */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="rounded-lg bg-[#FAFAF8] p-2.5">
                <div className="text-[11px] font-medium text-black/50">Dự án tham gia</div>
                <div className="mt-0.5 text-base font-extrabold text-black/90">
                  {user.joinedProjects}
                </div>
              </div>
              <div className="rounded-lg bg-[#FAFAF8] p-2.5">
                <div className="text-[11px] font-medium text-black/50">Dự án đã tạo</div>
                <div className="mt-0.5 text-base font-extrabold text-[#0A66C2]">
                  {user.createdProjects}
                </div>
              </div>
              <div className="rounded-lg bg-[#FAFAF8] p-2.5">
                <div className="text-[11px] font-medium text-black/50">Tỷ lệ hoàn thành</div>
                <div className="mt-0.5 text-base font-extrabold text-[#057642]">
                  {user.completionRate}
                </div>
              </div>
            </div>

            {/* Cash flow: Tiền vào & Tiền ra */}
            <div className="grid grid-cols-2 gap-2.5 text-center">
              <div className="rounded-lg border border-[#DCFCE7] bg-[#F0FDF4] p-2.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#166534]">
                  Tiền vào
                </div>
                <div className="mt-0.5 text-sm font-extrabold text-[#15803D]">
                  {user.moneyIn}
                </div>
              </div>
              <div className="rounded-lg border border-[#FEE2E2] bg-[#FEF2F2] p-2.5">
                <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#991B1B]">
                  Tiền ra
                </div>
                <div className="mt-0.5 text-sm font-extrabold text-[#B91C1C]">
                  {user.moneyOut}
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-between border-t border-black/8 pt-3 text-xs">
              <span className="font-semibold text-black/60">Đánh giá uy tín:</span>
              <div className="flex items-center gap-1.5">
                <StarIcon size={16} weight="fill" className="text-[#EAB308]" />
                <span className="text-sm font-extrabold text-black/90">{user.rating}</span>
                <span className="text-black/45">({user.ratingCount} lượt đánh giá)</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Lịch sử dự án tham gia */}
          <div className="flex flex-col rounded-xl border border-black/8 bg-[#FAFAF8] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-black/85">
                <BriefcaseMetalIcon size={16} className="text-[#0A66C2]" weight="fill" />
                <span>Lịch sử dự án tham gia</span>
              </div>
              <span className="rounded-full bg-[#EAF1FA] px-2 py-0.5 text-[11px] font-bold text-[#0A66C2]">
                {user.projectHistory.length} dự án
              </span>
            </div>

            <div className="flex max-h-[360px] flex-col gap-2.5 overflow-y-auto pr-1">
              {user.projectHistory.length === 0 ? (
                <div className="py-8 text-center text-xs italic text-black/45">
                  Chưa có lịch sử dự án tham gia nào.
                </div>
              ) : (
                user.projectHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-1.5 rounded-lg border border-black/6 bg-white p-3 shadow-xs"
                  >
                    <div className="text-xs font-bold text-black/90 line-clamp-2">
                      {item.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-black/45">{item.date}</span>
                      <span
                        className={`font-bold ${
                          item.amount.startsWith('+') ? 'text-[#057642]' : 'text-[#C03A2B]'
                        }`}
                      >
                        {item.amount}
                      </span>
                    </div>
                    <div className="mt-0.5">
                      <AdminStatusBadge status={item.status} className="text-[10px] py-0 px-2" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between border-t border-black/8 bg-white px-6 py-4">
          <button
            type="button"
            onClick={() => onDeleteClick(user)}
            className="rounded-full border border-[#FCE8E6] bg-[#FCE8E6] px-4 py-2 text-xs font-bold text-[#C03A2B] transition-colors hover:bg-[#fad2cf]"
          >
            Xóa tài khoản
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleLock(user.id)}
              className={`rounded-full px-5 py-2 text-xs font-bold text-white transition-colors ${
                isLocked
                  ? 'bg-[#057642] hover:bg-[#046237]'
                  : 'bg-[#B06000] hover:bg-[#965200]'
              }`}
            >
              {isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
