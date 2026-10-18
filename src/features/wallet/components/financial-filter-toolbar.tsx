import { useState } from 'react'
import { FunnelIcon, CalendarBlankIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import type { FinancialFilterState } from '../types'

export interface FinancialFilterToolbarProps {
  onApplyFilter: (filters: FinancialFilterState) => void
  onResetFilter: () => void
  appliedFilters: FinancialFilterState
}

export function FinancialFilterToolbar({
  onApplyFilter,
  onResetFilter,
  appliedFilters,
}: FinancialFilterToolbarProps) {
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>(appliedFilters.filterType)
  const [startDate, setStartDate] = useState(appliedFilters.startDate)
  const [endDate, setEndDate] = useState(appliedFilters.endDate)

  const hasActiveFilters =
    appliedFilters.filterType !== 'all' ||
    Boolean(appliedFilters.startDate) ||
    Boolean(appliedFilters.endDate)

  const handleApply = () => {
    onApplyFilter({
      filterType,
      startDate,
      endDate,
    })
  }

  const handleReset = () => {
    setFilterType('all')
    setStartDate('')
    setEndDate('')
    onResetFilter()
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Transaction Type Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">
            Loại giao dịch:
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'in' | 'out')}
            className="bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-slate-300 focus:border-[#0A66C2] focus:ring-2 focus:ring-sky-100 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 font-semibold outline-none transition-all cursor-pointer shadow-2xs"
          >
            <option value="all">Tất cả giao dịch</option>
            <option value="in">Tiền vào (+)</option>
            <option value="out">Tiền ra (-)</option>
          </select>
        </div>

        {/* Date Pickers */}
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
            <CalendarBlankIcon size={14} className="text-slate-400" />
            Từ ngày:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-slate-300 focus:border-[#0A66C2] focus:ring-2 focus:ring-sky-100 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all cursor-pointer shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1">
            <CalendarBlankIcon size={14} className="text-slate-400" />
            Đến ngày:
          </span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-50 hover:bg-white focus:bg-white border border-slate-200/90 hover:border-slate-300 focus:border-[#0A66C2] focus:ring-2 focus:ring-sky-100 rounded-lg px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-800 font-medium outline-none transition-all cursor-pointer shadow-2xs"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2.5 ml-auto">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowCounterClockwiseIcon size={14} weight="bold" />
            <span>Đặt lại</span>
          </button>
        )}
        <button
          type="button"
          onClick={handleApply}
          className="bg-[#0A66C2] hover:bg-[#084fa0] active:bg-[#06407f] text-white rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-xs hover:shadow cursor-pointer"
        >
          <FunnelIcon size={14} weight="bold" />
          <span>Lọc dữ liệu</span>
        </button>
      </div>
    </div>
  )
}
