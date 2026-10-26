import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { AdminUser } from '../../types'
import { AdminStatusBadge, AdminPagination } from '../shared'

interface UsersTabProps {
  users: AdminUser[]
  totalUsersCount: number
  activeCount: number
  flaggedCount: number
  lockedCount: number
  userSearch: string
  onSearchChange: (val: string) => void
  userStatusFilter: string
  onStatusFilterChange: (val: string) => void
  currentPage: number
  totalPages: number
  filteredCount: number
  onPageChange: (page: number) => void
  onSelectUser: (user: AdminUser) => void
}

export function UsersTab({
  users,
  totalUsersCount,
  activeCount,
  flaggedCount,
  lockedCount,
  userSearch,
  onSearchChange,
  userStatusFilter,
  onStatusFilterChange,
  currentPage,
  totalPages,
  filteredCount,
  onPageChange,
  onSelectUser,
}: UsersTabProps) {
  const PILL_OPTIONS = [
    { label: 'Tất cả', count: totalUsersCount },
    { label: 'Hoạt động', count: activeCount },
    {
      label: 'Bị gắn cờ',
      count: flaggedCount,
      alert: flaggedCount > 0,
    },
    { label: 'Bị khóa', count: lockedCount },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-black/90">
          Quản lý tài khoản
        </h1>
        <p className="mt-1 text-sm text-black/60">
          Kiểm soát người dùng, phân loại đối tượng, xử lý vi phạm và bảo vệ an toàn nền tảng
        </p>
      </div>

      {/* Status Filter Tabs (Pills) */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {PILL_OPTIONS.map(({ label, count, alert }) => {
          const isSelected = userStatusFilter === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => onStatusFilterChange(label)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#0A66C2] text-white shadow-xs'
                  : alert
                    ? 'border border-[#B06000]/30 bg-[#FEF7E0] text-[#B06000] hover:bg-[#faebd7]'
                    : 'border border-black/10 bg-white text-black/75 hover:bg-black/5'
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : alert
                      ? 'bg-[#B06000]/15 text-[#B06000]'
                      : 'bg-black/5 text-black/60'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center rounded-lg bg-white p-3 shadow-xs ring-1 ring-black/8">
        <div className="relative w-full max-w-[360px]">
          <MagnifyingGlassIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
          />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo họ tên hoặc email..."
            className="w-full rounded-md border border-transparent bg-[#F4F2EE] py-2 pl-9 pr-3 text-xs outline-none transition-colors focus:border-[#0A66C2] focus:bg-white"
          />
        </div>
      </div>

      {/* Users Data Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-black/8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-black/8 bg-[#FAFAF8] text-[11px] font-bold uppercase tracking-wider text-black/50">
                <th className="px-4 py-3">Người dùng</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày tham gia</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center italic text-black/45">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold text-white"
                          style={{ backgroundColor: u.color }}
                        >
                          {u.initials}
                        </div>
                        <button
                          type="button"
                          onClick={() => onSelectUser(u)}
                          className="font-bold text-black/90 hover:text-[#0A66C2] hover:underline"
                        >
                          {u.name}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-black/70">{u.email}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={u.status} />
                    </td>
                    <td className="px-4 py-3 text-black/60">{u.joined}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectUser(u)}
                        className="font-bold text-[#0A66C2] hover:underline"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={filteredCount}
          itemLabel="tài khoản"
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}
