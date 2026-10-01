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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        <span>
          Tìm thấy <strong style={{ color: '#0F172A', fontWeight: 700 }}>{totalJobs}</strong> dự án
          phù hợp
        </span>

        {/* Search Keyword Tag */}
        {searchKeyword && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#EFF6FF',
              color: '#0A66C2',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #DBEAFE',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            "{searchKeyword}"
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearSearch}
              aria-label="Xóa từ khóa tìm kiếm"
            />
          </span>
        )}

        {/* Giờ làm / ngày Tag */}
        {hoursPerDay !== 'all' && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#F0FDF4',
              color: '#15803D',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #BBF7D0',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            ⏱️ {getHoursPerDayLabel()}
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearHoursPerDay}
              aria-label="Bỏ lọc giờ làm"
            />
          </span>
        )}

        {/* Ngân sách Tag */}
        {budgetRange !== 'all' && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#F8FAFC',
              color: '#334155',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            💰 {getBudgetRangeLabel()}
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearBudgetRange}
              aria-label="Bỏ lọc ngân sách"
            />
          </span>
        )}

        {/* Hình thức làm việc Tag */}
        {salaryTypeFilter !== 'all' && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#F8FAFC',
              color: '#334155',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            💼 {getSalaryTypeLabel()}
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearSalaryType}
              aria-label="Bỏ lọc hình thức"
            />
          </span>
        )}

        {/* Cấp độ kinh nghiệm Tag */}
        {experienceLevel !== 'all' && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#F8FAFC',
              color: '#334155',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            🎯 {getExperienceLevelLabel()}
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearExperienceLevel}
              aria-label="Bỏ lọc cấp độ"
            />
          </span>
        )}

        {/* Thời gian đăng Tag */}
        {timeFilter !== 'all' && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#FEF9C3',
              color: '#854D0E',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #FDE047',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            📅 {getTimeFilterLabel()}
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearTimeFilter}
              aria-label="Bỏ lọc thời gian"
            />
          </span>
        )}

        {/* Trạng thái Tag */}
        {statusFilter !== 'all' && (
          <span
            className="pro-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#ECFDF5',
              color: '#059669',
              padding: '3px 10px',
              borderRadius: 6,
              border: '1px solid #A7F3D0',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {statusFilter === 'OPEN' ? '🟢 Đang mở tuyển' : '⚪ Đã đóng tuyển'}
            <XIcon
              size={12}
              style={{ cursor: 'pointer' }}
              onClick={onClearStatusFilter}
              aria-label="Bỏ lọc trạng thái"
            />
          </span>
        )}
      </div>

      {hasAnyFilterActive && (
        <span style={{ fontSize: 12, color: '#94A3B8' }}>Đang áp dụng bộ lọc nâng cao</span>
      )}
    </div>
  )
}
