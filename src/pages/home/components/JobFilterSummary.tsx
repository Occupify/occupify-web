import { XIcon } from '@phosphor-icons/react'
import {
  useJobFilters,
  type JobSalaryTypeFilter,
  type JobTimeFilter,
  type JobExperienceLevel,
  type JobStatus,
  type JobBudgetRange,
  type JobHoursPerDay,
} from '@/features/jobs'

export interface JobFilterSummaryProps {
  totalJobs: number
  searchKeyword: string
  onClearSearch: () => void

  hoursPerDay: JobHoursPerDay
  onClearHoursPerDay: () => void

  budgetRange: JobBudgetRange
  onClearBudgetRange: () => void

  salaryTypeFilter: JobSalaryTypeFilter
  onClearSalaryType: () => void

  experienceLevel: 'all' | JobExperienceLevel
  onClearExperienceLevel: () => void

  timeFilter: JobTimeFilter
  onClearTimeFilter: () => void

  statusFilter: 'all' | JobStatus
  onClearStatusFilter: () => void
}

export function JobFilterSummary({
  totalJobs,
  searchKeyword,
  onClearSearch,
  hoursPerDay,
  onClearHoursPerDay,
  budgetRange,
  onClearBudgetRange,
  salaryTypeFilter,
  onClearSalaryType,
  experienceLevel,
  onClearExperienceLevel,
  timeFilter,
  onClearTimeFilter,
  statusFilter,
  onClearStatusFilter,
}: JobFilterSummaryProps) {
  const { data: filterMeta } = useJobFilters()

  const getHoursPerDayLabel = () => {
    if (hoursPerDay === 'all') return ''
    const match = filterMeta?.hoursPerDay?.find((opt) => opt.value === hoursPerDay)
    return match?.label || ''
  }

  const getBudgetRangeLabel = () => {
    if (budgetRange === 'all') return ''
    const match = filterMeta?.budgetRanges.find((opt) => opt.value === budgetRange)
    return match?.label || ''
  }

  const getSalaryTypeLabel = () => {
    if (salaryTypeFilter === 'all') return ''
    const match = filterMeta?.salaryTypes.find((opt) => opt.value === salaryTypeFilter)
    return match?.label || ''
  }

  const getExperienceLevelLabel = () => {
    if (experienceLevel === 'all') return ''
    const match = filterMeta?.experienceLevels.find((opt) => opt.value === experienceLevel)
    return match?.label || ''
  }

  const getTimeFilterLabel = () => {
    if (timeFilter === 'all') return ''
    const match = filterMeta?.timeFilters.find((opt) => opt.value === timeFilter)
    return match?.label || ''
  }

  const hasAnyFilterActive =
    Boolean(searchKeyword) ||
    hoursPerDay !== 'all' ||
    budgetRange !== 'all' ||
    salaryTypeFilter !== 'all' ||
    experienceLevel !== 'all' ||
    timeFilter !== 'all' ||
    statusFilter !== 'all'

  return (
    <div className="flex items-center justify-between mb-3.5 px-1 flex-wrap gap-2 text-xs sm:text-[13px]">
      <div className="flex items-center flex-wrap gap-2 text-slate-600">
        <span>
          Tìm thấy <strong className="text-slate-900 font-bold">{totalJobs}</strong> dự án phù hợp
        </span>

        {/* Search Keyword Tag */}
        {searchKeyword && (
          <span className="inline-flex items-center gap-1.5 bg-sky-50 text-[#0A66C2] px-2.5 py-1 rounded-md border border-sky-200 text-xs font-semibold">
            "{searchKeyword}"
            <button
              type="button"
              onClick={onClearSearch}
              aria-label="Xóa từ khóa tìm kiếm"
              className="hover:text-sky-900 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}

        {/* Giờ làm / ngày Tag */}
        {hoursPerDay !== 'all' && (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 text-xs font-semibold">
            ⏱️ {getHoursPerDayLabel()}
            <button
              type="button"
              onClick={onClearHoursPerDay}
              aria-label="Bỏ lọc giờ làm"
              className="hover:text-emerald-950 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}

        {/* Ngân sách Tag */}
        {budgetRange !== 'all' && (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold">
            💰 {getBudgetRangeLabel()}
            <button
              type="button"
              onClick={onClearBudgetRange}
              aria-label="Bỏ lọc ngân sách"
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}

        {/* Hình thức làm việc Tag */}
        {salaryTypeFilter !== 'all' && (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold">
            💼 {getSalaryTypeLabel()}
            <button
              type="button"
              onClick={onClearSalaryType}
              aria-label="Bỏ lọc hình thức"
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}

        {/* Cấp độ kinh nghiệm Tag */}
        {experienceLevel !== 'all' && (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-semibold">
            🎯 {getExperienceLevelLabel()}
            <button
              type="button"
              onClick={onClearExperienceLevel}
              aria-label="Bỏ lọc cấp độ"
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}

        {/* Thời gian đăng Tag */}
        {timeFilter !== 'all' && (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md border border-amber-200 text-xs font-semibold">
            📅 {getTimeFilterLabel()}
            <button
              type="button"
              onClick={onClearTimeFilter}
              aria-label="Bỏ lọc thời gian"
              className="hover:text-amber-950 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}

        {/* Trạng thái Tag */}
        {statusFilter !== 'all' && (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
              statusFilter === 'OPEN'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {statusFilter === 'OPEN' ? '🟢 Đang mở tuyển' : '⚪ Đã đóng tuyển'}
            <button
              type="button"
              onClick={onClearStatusFilter}
              aria-label="Bỏ lọc trạng thái"
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              <XIcon size={12} weight="bold" />
            </button>
          </span>
        )}
      </div>

      {hasAnyFilterActive && (
        <span className="text-xs text-slate-400 font-medium">Đang áp dụng bộ lọc nâng cao</span>
      )}
    </div>
  )
}

export default JobFilterSummary
