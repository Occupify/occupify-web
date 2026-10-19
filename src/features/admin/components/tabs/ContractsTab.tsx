import { MagnifyingGlassIcon } from '@phosphor-icons/react'
import type { AdminContract } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ContractsTabProps {
  contracts: AdminContract[]
  totalContractsCount: number
  inProgressCount: number
  completedCount: number
  contractSearch: string
  onSearchChange: (val: string) => void
  contractStatusFilter: string
  onStatusFilterChange: (val: string) => void
  onSelectContract: (contract: AdminContract) => void
}

export function ContractsTab({
  contracts,
  totalContractsCount,
  inProgressCount,
  completedCount,
  contractSearch,
  onSearchChange,
  contractStatusFilter,
  onStatusFilterChange,
  onSelectContract,
}: ContractsTabProps) {
  const FILTER_OPTIONS = ['Tất cả', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy / Thất bại']

  return (
    <div>
      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-black/90">
          Quản lý hợp đồng
        </h1>
        <p className="mt-1 text-sm text-black/60">
          Giám sát hợp đồng điện tử pháp lý và tiến độ bàn giao giữa các bên
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="mb-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="rounded-xl border border-black/8 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-black/55 uppercase tracking-wide">
            Tổng số hợp đồng
          </div>
          <div className="mt-1.5 text-[26px] font-extrabold text-[#0A66C2]">
            {totalContractsCount}
          </div>
        </div>

        <div className="rounded-xl border border-black/8 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-black/55 uppercase tracking-wide">
            Đang thực hiện
          </div>
          <div className="mt-1.5 text-[26px] font-extrabold text-[#057642]">
            {inProgressCount}
          </div>
        </div>

        <div className="rounded-xl border border-black/8 bg-white p-4 shadow-xs">
          <div className="text-xs font-semibold text-black/55 uppercase tracking-wide">
            Hoàn thành giải ngân
          </div>
          <div className="mt-1.5 text-[26px] font-extrabold text-[#137333]">
            {completedCount}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTER_OPTIONS.map((status) => {
          const isSelected = contractStatusFilter === status
          return (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-[#0A66C2] text-white shadow-xs'
                  : 'border border-black/10 bg-white text-black/75 hover:bg-black/5'
              }`}
            >
              {status}
            </button>
          )
        })}
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center rounded-lg bg-white p-3 shadow-xs ring-1 ring-black/8">
        <div className="relative w-full max-w-[420px]">
          <MagnifyingGlassIcon
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/40"
          />
          <input
            type="text"
            value={contractSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo mã HĐ, tên dự án, Client hoặc Freelancer..."
            className="w-full rounded-md border border-transparent bg-[#F4F2EE] py-2 pl-9 pr-3 text-xs outline-none transition-colors focus:border-[#0A66C2] focus:bg-white"
          />
        </div>
      </div>

      {/* Contracts Data Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-black/8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-black/8 bg-[#FAFAF8] text-[11px] font-bold uppercase tracking-wider text-black/50">
                <th className="px-4 py-3">Mã HĐ & Dự án</th>
                <th className="px-4 py-3">Bên thuê (Client)</th>
                <th className="px-4 py-3">Freelancer</th>
                <th className="px-4 py-3">Giá trị hợp đồng</th>
                <th className="px-4 py-3">Thời hạn</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6">
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center italic text-black/45">
                    Không tìm thấy hợp đồng nào phù hợp.
                  </td>
                </tr>
              ) : (
                contracts.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-[#FAFAF8]">
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#EAF1FA] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#0A66C2]">
                        {c.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectContract(c)}
                        className="mt-1 block max-w-[220px] text-left font-bold text-black/90 truncate hover:text-[#0A66C2] hover:underline"
                      >
                        {c.project}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: c.client.color }}
                        >
                          {c.client.initials}
                        </div>
                        <span className="font-semibold text-black/80">{c.client.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                          style={{ backgroundColor: c.freelancer.color }}
                        >
                          {c.freelancer.initials}
                        </div>
                        <span className="font-semibold text-black/80">
                          {c.freelancer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-[#057642]">{c.payment}</td>
                    <td className="px-4 py-3 text-black/60">{c.dateRange}</td>
                    <td className="px-4 py-3">
                      <AdminStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectContract(c)}
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
