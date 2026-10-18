import {
  BriefcaseMetalIcon,
  ClockIcon,
  CalendarBlankIcon,
  WalletIcon,
  XIcon,
  GraduationCapIcon,
  FireIcon,
  PaperPlaneTiltIcon,
  CoinsIcon,
  FunnelIcon,
  ClockCountdownIcon,
} from '@phosphor-icons/react'
import {
  useJobFilters,
  type JobSortBy,
  type JobTimeFilter,
  type JobSalaryTypeFilter,
  type JobStatus,
  type JobExperienceLevel,
  type JobBudgetRange,
  type JobHoursPerDay,
} from '@/features/jobs'

export interface JobFilterToolbarProps {
  totalJobs: number
  hasActiveFilters: boolean
  onResetFilters: () => void

  sortBy: JobSortBy
  onSortByChange: (val: JobSortBy) => void

  hoursPerDay: JobHoursPerDay
  onHoursPerDayChange: (val: JobHoursPerDay) => void

  budgetRange: JobBudgetRange
  onBudgetRangeChange: (val: JobBudgetRange) => void

  salaryTypeFilter: JobSalaryTypeFilter
  onSalaryTypeFilterChange: (val: JobSalaryTypeFilter) => void

  experienceLevel: 'all' | JobExperienceLevel
  onExperienceLevelChange: (val: 'all' | JobExperienceLevel) => void

  timeFilter: JobTimeFilter
  onTimeFilterChange: (val: JobTimeFilter) => void

  statusFilter: 'all' | JobStatus
  onStatusFilterChange: (val: 'all' | JobStatus) => void
}

export function JobFilterToolbar({
  totalJobs,
  hasActiveFilters,
  onResetFilters,
  sortBy,
  onSortByChange,
  hoursPerDay,
  onHoursPerDayChange,
  budgetRange,
  onBudgetRangeChange,
  salaryTypeFilter,
  onSalaryTypeFilterChange,
  experienceLevel,
  onExperienceLevelChange,
  timeFilter,
  onTimeFilterChange,
  statusFilter,
  onStatusFilterChange,
}: JobFilterToolbarProps) {
  const { data: filterMeta } = useJobFilters()

  const hoursOptions = filterMeta?.hoursPerDay || [
    { value: 'all' as const, label: 'Tất cả thời lượng' },
    { value: 'under-4h' as const, label: 'Dưới 4h / ngày (Part-time)' },
    { value: '4h-8h' as const, label: '4h – 8h / ngày (Bán toàn thời gian)' },
    { value: 'above-8h' as const, label: 'Trên 8h / ngày (Toàn thời gian)' },
  ]

  const budgetOptions = filterMeta?.budgetRanges || [
    { value: 'all' as const, label: 'Tất cả ngân sách' },
    { value: 'under-5m' as const, label: 'Dưới 5 triệu ₫' },
    { value: '5m-20m' as const, label: '5 – 20 triệu ₫' },
    { value: '20m-50m' as const, label: '20 – 50 triệu ₫' },
    { value: 'above-50m' as const, label: 'Trên 50 triệu ₫' },
  ]

  const salaryTypeOptions = filterMeta?.salaryTypes || [
    { value: 'all' as const, label: 'Tất cả hình thức' },
    { value: 'fixed' as const, label: 'Cố định theo dự án' },
    { value: 'hourly' as const, label: 'Theo giờ' },
    { value: 'weekly' as const, label: 'Theo tuần' },
    { value: 'monthly' as const, label: 'Theo tháng' },
  ]

  const experienceOptions = filterMeta?.experienceLevels || [
    { value: 'all' as const, label: 'Tất cả cấp độ' },
    { value: 'entry' as const, label: 'Mới bắt đầu (Entry)' },
    { value: 'intermediate' as const, label: 'Có kinh nghiệm (Mid)' },
    { value: 'expert' as const, label: 'Chuyên gia (Expert)' },
  ]

  const timeOptions = filterMeta?.timeFilters || [
    { value: 'all' as const, label: 'Tất cả thời gian' },
    { value: '24h' as const, label: '24 giờ qua' },
    { value: '3d' as const, label: '3 ngày qua' },
    { value: '7d' as const, label: '7 ngày qua' },
    { value: '30d' as const, label: '30 ngày qua' },
  ]

  const statusOptions = filterMeta?.jobStatuses || [
    { value: 'all' as const, label: 'Tất cả trạng thái' },
    { value: 'OPEN' as const, label: '🟢 Đang mở nhận thầu' },
    { value: 'CLOSED' as const, label: '⚪ Đã đóng thầu' },
  ]

  const feedTabs: { id: JobSortBy; label: string; icon: typeof ClockCountdownIcon }[] = [
    { id: 'latest', label: 'Mới nhất', icon: ClockCountdownIcon },
    { id: 'budget-desc', label: 'Ngân sách cao', icon: CoinsIcon },
    { id: 'most-viewed', label: 'Xem nhiều (Hot)', icon: FireIcon },
    { id: 'least-proposals', label: 'Ít cạnh tranh (<5 Bids)', icon: PaperPlaneTiltIcon },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 mb-4 flex flex-col gap-4">
      {/* ─── Row 1: Freelance Feed Stream Tabs (Upwork / Contra Style) ─── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3.5 border-b border-slate-100">
        {/* Marketplace Stream Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl overflow-x-auto max-w-full">
          {feedTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = sortBy === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSortByChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#0A66C2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon size={14} weight={isActive ? 'fill' : 'bold'} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Total live count & Reset */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{totalJobs} dự án mở</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <XIcon size={13} weight="bold" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Row 2: Marketplace Filter Controls Strip ─── */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <FunnelIcon size={13} weight="bold" className="text-[#0A66C2]" />
          <span>Bộ lọc thị trường</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Hours per day */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <ClockIcon size={12} className="text-[#0A66C2]" weight="bold" />
              <span>Giờ làm / ngày</span>
            </label>
            <select
              value={hoursPerDay}
              onChange={(e) => onHoursPerDayChange(e.target.value as JobHoursPerDay)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition-colors ${
                hoursPerDay !== 'all'
                  ? 'bg-sky-50/70 border-sky-400 text-[#0A66C2] font-semibold'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
              aria-label="Lọc theo số giờ làm việc trên ngày"
            >
              {hoursOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Budget range */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <WalletIcon size={12} className="text-[#0A66C2]" weight="bold" />
              <span>Ngân sách</span>
            </label>
            <select
              value={budgetRange}
              onChange={(e) => onBudgetRangeChange(e.target.value as JobBudgetRange)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition-colors ${
                budgetRange !== 'all'
                  ? 'bg-sky-50/70 border-sky-400 text-[#0A66C2] font-semibold'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
              aria-label="Lọc theo khoảng ngân sách"
            >
              {budgetOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Salary type */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <BriefcaseMetalIcon size={12} className="text-[#0A66C2]" weight="bold" />
              <span>Hình thức</span>
            </label>
            <select
              value={salaryTypeFilter}
              onChange={(e) => onSalaryTypeFilterChange(e.target.value as JobSalaryTypeFilter)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition-colors ${
                salaryTypeFilter !== 'all'
                  ? 'bg-sky-50/70 border-sky-400 text-[#0A66C2] font-semibold'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
              aria-label="Lọc theo hình thức thanh toán"
            >
              {salaryTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Experience level */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <GraduationCapIcon size={12} className="text-[#0A66C2]" weight="bold" />
              <span>Cấp độ</span>
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => onExperienceLevelChange(e.target.value as 'all' | JobExperienceLevel)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition-colors ${
                experienceLevel !== 'all'
                  ? 'bg-sky-50/70 border-sky-400 text-[#0A66C2] font-semibold'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
              aria-label="Lọc theo cấp độ kinh nghiệm"
            >
              {experienceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Time Filter */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <CalendarBlankIcon size={12} className="text-[#0A66C2]" weight="bold" />
              <span>Đăng lúc</span>
            </label>
            <select
              value={timeFilter}
              onChange={(e) => onTimeFilterChange(e.target.value as JobTimeFilter)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition-colors ${
                timeFilter !== 'all'
                  ? 'bg-sky-50/70 border-sky-400 text-[#0A66C2] font-semibold'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
              aria-label="Lọc theo thời gian đăng"
            >
              {timeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* 6. Status filter */}
          <div>
            <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
              <BriefcaseMetalIcon size={12} className="text-[#0A66C2]" weight="bold" />
              <span>Trạng thái</span>
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as 'all' | JobStatus)}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-medium border outline-none cursor-pointer transition-colors ${
                statusFilter !== 'all'
                  ? 'bg-sky-50/70 border-sky-400 text-[#0A66C2] font-semibold'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
              aria-label="Lọc theo trạng thái công việc"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobFilterToolbar

