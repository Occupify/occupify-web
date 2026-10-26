import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { AdminViolation } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ViolationsTabProps {
  violations: AdminViolation[]
  violationSearch: string
  onSearchChange: (val: string) => void
  categoryFilter: string
  onCategoryFilterChange: (val: string) => void
  statusFilter: string
  onStatusFilterChange: (val: string) => void
  onSelectViolation: (violation: AdminViolation) => void
}

export function ViolationsTab({
  violations,
  violationSearch,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  onSelectViolation,
}: ViolationsTabProps) {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-black/90">
          Báo cáo vi phạm
        </h1>
        <p className="mt-1 text-sm text-black/60">
          Kiểm duyệt báo cáo vi phạm chính sách cộng đồng và bảo đảm tính minh bạch trên nền tảng
        </p>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg bg-white p-3 shadow-xs ring-1 ring-black/8">
        <div className="relative flex-1 min-w-[260px] max-w-[360px]">
          <MagnifyingGlassIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
          />
          <input
            type="text"
            value={violationSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo người báo cáo, đối tượng..."
            className="w-full rounded-md border border-transparent bg-[#F4F2EE] py-2 pl-9 pr-3 text-xs outline-none transition-colors focus:border-[#0A66C2] focus:bg-white"
          />
        </div>

        {/* Phân loại Dropdown - Ràng buộc: Tuyệt đối không có "Bài viết" */}
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-xs font-medium text-black/80 outline-none transition-colors focus:border-[#0A66C2]"
        >
          <option value="Tất cả">Phân loại: Tất cả</option>
          <option value="Tài khoản">Tài khoản</option>
          <option value="Dự án">Dự án</option>
        </select>

        {/* Trạng thái Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="rounded-md border border-black/15 bg-white px-3 py-2 text-xs font-medium text-black/80 outline-none transition-colors focus:border-[#0A66C2]"
        >
          <option value="Tất cả">Trạng thái: Tất cả</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đã giải quyết">Đã giải quyết</option>
          <option value="Đã bác bỏ">Đã bác bỏ</option>
        </select>
      </div>

      {/* Violations Data Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-black/8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-black/8 bg-[#FAFAF8] text-[11px] font-bold uppercase tracking-wider text-black/50">
                <th className="px-4 py-3">Mã báo cáo</th>
                <th className="px-4 py-3">Người báo cáo</th>
                <th className="px-4 py-3">Đối tượng bị báo cáo</th>
                <th className="px-4 py-3">Phân loại</th>
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {violations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center italic text-black/45">
                    Không tìm thấy báo cáo vi phạm nào phù hợp.
                  </td>
                </tr>
              ) : (
                violations.map((v) => (
                  <tr key={v.id} className="transition-colors hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3">
                      <span className="rounded bg-black/5 px-2 py-0.5 font-mono text-[11px] font-bold text-black/75">
                        {v.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: v.reporter.color }}
                        >
                          {v.reporter.initials}
                        </div>
                        <span className="font-semibold text-black/80 truncate">
                          {v.reporter.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-black/90">{v.target}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#EAF1FA] px-2 py-0.5 text-[11px] font-bold text-[#0A66C2]">
                        {v.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-black/60">{v.time}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectViolation(v)}
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
