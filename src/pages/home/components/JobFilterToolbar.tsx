import {
  BriefcaseMetalIcon,
  ClockIcon,
  CalendarBlankIcon,
  WalletIcon,
  XIcon,
  GraduationCapIcon,
  ArrowsDownUpIcon,
  CheckCircleIcon,
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

  const sortOptions = filterMeta?.sortOptions || [
    { value: 'latest' as const, label: 'Mới nhất' },
    { value: 'budget-desc' as const, label: 'Ngân sách cao nhất' },
    { value: 'most-viewed' as const, label: 'Xem nhiều nhất (Hot)' },
    { value: 'least-proposals' as const, label: 'Ít cạnh tranh (<5 ứng tuyển)' },
  ]

  const hoursOptions = filterMeta?.hoursPerDay || [
    { value: 'all' as const, label: 'Tất cả thời lượng' },
    { value: 'under-4h' as const, label: 'Dưới 4h / ngày (Part-time)' },
    { value: '4h-8h' as const, label: '4h – 8h / ngày (Bán toàn thời gian)' },
    { value: 'above-8h' as const, label: 'Trên 8h / ngày (Toàn thời gian)' },
  ]

  const budgetOptions = filterMeta?.budgetRanges || [
    { value: 'all' as const, label: 'Tất cả mức ngân sách' },
    { value: 'under-5m' as const, label: 'Dưới 5 triệu ₫' },
    { value: '5m-20m' as const, label: '5 – 20 triệu ₫' },
    { value: '20m-50m' as const, label: '20 – 50 triệu ₫' },
    { value: 'above-50m' as const, label: 'Trên 50 triệu ₫' },
  ]

  const salaryTypeOptions = filterMeta?.salaryTypes || [
    { value: 'all' as const, label: 'Tất cả hình thức' },
    { value: 'fixed' as const, label: 'Cố định / Dự án' },
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

  const isOpenOnly = statusFilter === 'OPEN'

  return (
    <div
      className="pro-card"
      style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        padding: '16px 20px',
        marginBottom: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: '#fff',
      }}
    >
      {/* ─── Row 1: Header + Sắp xếp (Sort) + Reset ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          borderBottom: '1px solid var(--border-default)',
          paddingBottom: 14,
        }}
      >
        {/* Title & Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BriefcaseMetalIcon size={18} weight="fill" color="#0A66C2" />
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            Việc làm & Dự án Tuyển dụng
          </span>
          <span
            style={{
              background: '#EFF6FF',
              color: '#0A66C2',
              fontSize: 12,
              fontWeight: 700,
              padding: '2px 10px',
              borderRadius: 6,
              border: '1px solid #DBEAFE',
            }}
          >
            {totalJobs} dự án
          </span>
        </div>

        {/* Right actions: Sắp xếp dropdown & Đặt lại */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Sắp xếp duy nhất */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowsDownUpIcon size={15} color="#0A66C2" weight="bold" />
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as JobSortBy)}
              className="pro-select"
              aria-label="Sắp xếp kết quả"
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: '1px solid var(--border-default)',
                fontSize: 13,
                fontFamily: 'inherit',
                background: '#F8FAFC',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              style={{
                background: '#FEF2F2',
                border: '1px solid #FECDD3',
                color: '#DC2626',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 10px',
                borderRadius: 7,
                transition: 'all 120ms ease',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#FEE2E2')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#FEF2F2')}
            >
              <XIcon size={13} weight="bold" />
              <span>Đặt lại bộ lọc</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── Row 2: Bộ lọc trực quan (Không trùng lặp, hướng tới Freelancer) ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 10,
          alignItems: 'center',
        }}
      >
        {/* 1. Số giờ làm / ngày (Mới) */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 5,
            }}
          >
            <ClockIcon size={13} color="#0A66C2" weight="bold" />
            <span>Giờ làm / ngày</span>
          </label>
          <select
            value={hoursPerDay}
            onChange={(e) => onHoursPerDayChange(e.target.value as JobHoursPerDay)}
            className="pro-select"
            aria-label="Lọc theo số giờ làm việc trên ngày"
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              border: `1px solid ${hoursPerDay !== 'all' ? '#0A66C2' : 'var(--border-default)'}`,
              background: hoursPerDay !== 'all' ? '#EFF6FF' : '#fff',
              fontSize: 12.5,
              fontWeight: hoursPerDay !== 'all' ? 700 : 500,
              color: hoursPerDay !== 'all' ? '#0A66C2' : '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {hoursOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Khoảng ngân sách */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 5,
            }}
          >
            <WalletIcon size={13} color="#0A66C2" weight="bold" />
            <span>Khoảng ngân sách</span>
          </label>
          <select
            value={budgetRange}
            onChange={(e) => onBudgetRangeChange(e.target.value as JobBudgetRange)}
            className="pro-select"
            aria-label="Lọc theo khoảng ngân sách"
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              border: `1px solid ${budgetRange !== 'all' ? '#0A66C2' : 'var(--border-default)'}`,
              background: budgetRange !== 'all' ? '#EFF6FF' : '#fff',
              fontSize: 12.5,
              fontWeight: budgetRange !== 'all' ? 700 : 500,
              color: budgetRange !== 'all' ? '#0A66C2' : '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {budgetOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Hình thức làm việc */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 5,
            }}
          >
            <BriefcaseMetalIcon size={13} color="#0A66C2" weight="bold" />
            <span>Hình thức</span>
          </label>
          <select
            value={salaryTypeFilter}
            onChange={(e) => onSalaryTypeFilterChange(e.target.value as JobSalaryTypeFilter)}
            className="pro-select"
            aria-label="Lọc theo hình thức thanh toán"
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              border: `1px solid ${salaryTypeFilter !== 'all' ? '#0A66C2' : 'var(--border-default)'}`,
              background: salaryTypeFilter !== 'all' ? '#EFF6FF' : '#fff',
              fontSize: 12.5,
              fontWeight: salaryTypeFilter !== 'all' ? 700 : 500,
              color: salaryTypeFilter !== 'all' ? '#0A66C2' : '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {salaryTypeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Cấp độ kinh nghiệm */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 5,
            }}
          >
            <GraduationCapIcon size={13} color="#0A66C2" weight="bold" />
            <span>Kinh nghiệm</span>
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => onExperienceLevelChange(e.target.value as 'all' | JobExperienceLevel)}
            className="pro-select"
            aria-label="Lọc theo cấp độ kinh nghiệm"
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              border: `1px solid ${experienceLevel !== 'all' ? '#0A66C2' : 'var(--border-default)'}`,
              background: experienceLevel !== 'all' ? '#EFF6FF' : '#fff',
              fontSize: 12.5,
              fontWeight: experienceLevel !== 'all' ? 700 : 500,
              color: experienceLevel !== 'all' ? '#0A66C2' : '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {experienceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 5. Thời gian đăng */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 5,
            }}
          >
            <CalendarBlankIcon size={13} color="#0A66C2" weight="bold" />
            <span>Thời gian đăng</span>
          </label>
          <select
            value={timeFilter}
            onChange={(e) => onTimeFilterChange(e.target.value as JobTimeFilter)}
            className="pro-select"
            aria-label="Lọc theo thời gian đăng tin"
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              border: `1px solid ${timeFilter !== 'all' ? '#0A66C2' : 'var(--border-default)'}`,
              background: timeFilter !== 'all' ? '#EFF6FF' : '#fff',
              fontSize: 12.5,
              fontWeight: timeFilter !== 'all' ? 700 : 500,
              color: timeFilter !== 'all' ? '#0A66C2' : '#0F172A',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {timeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Trạng thái tuyển dụng (Nút bấm toggle tiện lợi) */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11.5,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 5,
            }}
          >
            <CheckCircleIcon size={13} color={isOpenOnly ? '#059669' : '#64748B'} weight="bold" />
            <span>Trạng thái</span>
          </label>
          <button
            type="button"
            onClick={() => onStatusFilterChange(isOpenOnly ? 'all' : 'OPEN')}
            style={{
              width: '100%',
              padding: '7px 10px',
              borderRadius: 8,
              border: `1px solid ${isOpenOnly ? '#A7F3D0' : 'var(--border-default)'}`,
              background: isOpenOnly ? '#ECFDF5' : '#F8FAFC',
              fontSize: 12.5,
              fontWeight: 700,
              color: isOpenOnly ? '#059669' : '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 150ms ease',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isOpenOnly ? '#059669' : '#94A3B8',
              }}
            />
            <span>{isOpenOnly ? 'Đang mở tuyển' : 'Tất cả trạng thái'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
