import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { AdminProject } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ProjectsTabProps {
  projects: AdminProject[]
  totalProjectsCount: number
  hiringCount: number
  inProgressCount: number
  closedCount: number
  projectSearch: string
  onSearchChange: (val: string) => void
  projectStatusFilter: string
  onStatusFilterChange: (val: string) => void
  onSelectProject: (project: AdminProject) => void
}

export function ProjectsTab({
  projects,
  totalProjectsCount,
  hiringCount,
  inProgressCount,
  closedCount,
  projectSearch,
  onSearchChange,
  projectStatusFilter,
  onStatusFilterChange,
  onSelectProject,
}: ProjectsTabProps) {
  const PILL_OPTIONS = [
    { label: 'Tất cả', count: totalProjectsCount },
    { label: 'Đang tuyển', count: hiringCount },
    { label: 'Đang thực hiện', count: inProgressCount },
    { label: 'Đã đóng', count: closedCount },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-black/90">Quản lý dự án</h1>
        <p className="mt-1 text-sm text-black/60">
          Kiểm duyệt dự án đăng tuyển, kiểm tra danh sách người tham gia và loại bỏ các dự án vi
          phạm chính sách
        </p>
      </div>

      {/* Quick Status Filter Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {PILL_OPTIONS.map(({ label, count }) => {
          const isSelected = projectStatusFilter === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => onStatusFilterChange(label)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#0A66C2] text-white shadow-xs'
                  : 'border border-black/10 bg-white text-black/75 hover:bg-black/5'
              }`}
            >
              <span>{label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-black/60'
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
            value={projectSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên dự án hoặc chủ dự án..."
            className="w-full rounded-md border border-transparent bg-[#F4F2EE] py-2 pl-9 pr-3 text-xs outline-none transition-colors focus:border-[#0A66C2] focus:bg-white"
          />
        </div>
      </div>

      {/* Projects Data Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-black/8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-black/8 bg-[#FAFAF8] text-[11px] font-bold uppercase tracking-wider text-black/50">
                <th className="px-4 py-3">Tên dự án</th>
                <th className="px-4 py-3">Chủ dự án</th>
                <th className="px-4 py-3">Ngân sách</th>
                <th className="px-4 py-3">Lĩnh vực</th>
                <th className="px-4 py-3">Người tham gia</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Ngày đăng</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center italic text-black/45">
                    Không tìm thấy dự án nào phù hợp.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectProject(p)}
                        className="max-w-[280px] text-left font-bold text-black/90 truncate hover:text-[#0A66C2] hover:underline"
                      >
                        {p.title}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: p.owner.color }}
                        >
                          {p.owner.initials}
                        </div>
                        <span className="font-semibold text-black/80 truncate">{p.owner.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#057642]">{p.budget}</div>
                      <div className="text-[10px] text-black/50">{p.budgetType}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-black/5 px-2 py-0.5 text-[11px] font-medium text-black/70">
                        {p.field}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#EAF1FA] px-2.5 py-0.5 text-[11px] font-bold text-[#0A66C2]">
                        {p.applicants} người
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-black/60">{p.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectProject(p)}
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
      </div>
    </div>
  )
}
