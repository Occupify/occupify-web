import * as React from 'react'
import {
  ArrowLeftIcon,
  BriefcaseMetalIcon,
  ClockIcon,
  BookmarkIcon,
  WalletIcon,
  FileTextIcon,
  SealCheckIcon,
  CheckCircleIcon,
  PaperPlaneTiltIcon,
  UserIcon,
  WarningIcon,
  StarIcon,
  MapPinIcon,
  ShareNetworkIcon,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import { toast } from '@/components/feedback'
import type { JobListing, JobRoleItem } from '../types'
import { JobApplyModal } from './JobApplyModal'
import { JobReportModal } from './JobReportModal'

export interface JobDetailsViewProps {
  job: JobListing
  onBack: () => void
  onViewProfile?: (name?: string) => void
  isSaved?: boolean
  onToggleSave?: () => void
  onApplySuccess?: (roleId: string, roleTitle: string) => void
}

export function JobDetailsView({
  job,
  onBack,
  onViewProfile,
  isSaved = false,
  onToggleSave,
  onApplySuccess,
}: JobDetailsViewProps) {
  const [selectedRoleForApply, setSelectedRoleForApply] = React.useState<JobRoleItem | null>(null)
  const [appliedRoleIds, setAppliedRoleIds] = React.useState<string[]>([])
  const [reportModalOpen, setReportModalOpen] = React.useState(false)

  // Fallback to synthesize at least 1 role if job has no explicit roles list
  const roles: JobRoleItem[] =
    job.roles && job.roles.length > 0
      ? job.roles
      : [
          {
            id: `def-${job.id}`,
            title: job.title,
            minBudget: job.salaryValue ? Math.round(job.salaryValue * 0.85) : 20000000,
            maxBudget: job.salaryValue ? Math.round(job.salaryValue * 1.15) : 35000000,
            budgetDisplay: job.budget,
            salaryType: job.salaryType || 'fixed',
            salaryTypeLabel:
              job.salaryType === 'hourly'
                ? '/ giờ'
                : job.salaryType === 'weekly'
                  ? '/ tuần'
                  : job.salaryType === 'monthly'
                    ? '/ tháng'
                    : '/ dự án',
            jd: job.description,
            requirements: [
              'Tối thiểu 2 năm kinh nghiệm thực chiến trong các dự án tương đương',
              'Khả năng làm việc độc lập và báo cáo tiến độ đúng hạn',
              'Cam kết chất lượng đầu ra đạt tiêu chuẩn sản phẩm',
            ],
            skills: job.skills,
            slotsTotal: job.openPositions || 1,
            slotsFilled: job.filledPositions || 0,
            status: job.status === 'CLOSED' ? 'filled' : 'recruiting',
          },
        ]

  const handleApplyRoleSuccess = (roleId: string, roleTitle: string) => {
    setAppliedRoleIds((prev) => (prev.includes(roleId) ? prev : [...prev, roleId]))
    onApplySuccess?.(roleId, roleTitle)
  }

  const handleShareProject = () => {
    const shareUrl = `${window.location.origin}/home?jobId=${job.id}`
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(shareUrl).then(
        () => toast.success('Đã sao chép liên kết dự án vào bộ nhớ tạm!'),
        () => toast.info(`Liên kết dự án: ${shareUrl}`),
      )
    } else {
      toast.info(`Liên kết dự án: ${shareUrl}`)
    }
  }

  const isClosed = job.status === 'CLOSED'

  // Card reusable styles
  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    border: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-card)',
  }

  // Domain tags fallback
  const domainTags =
    job.tags && job.tags.length > 0
      ? job.tags
      : job.skills.slice(0, 3).map((s) => (s.startsWith('#') ? s : `#${s}`))

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100%', paddingBottom: 64 }}>
      <div style={{ maxWidth: 1128, margin: '0 auto', padding: '24px 16px' }}>
        {/* ── Top Navigation & Quick Action Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#fff',
              border: '1px solid var(--border-default)',
              borderRadius: 8,
              padding: '8px 16px',
              fontSize: 13.5,
              fontWeight: 600,
              color: 'var(--color-primary-500)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-primary-50)'
              e.currentTarget.style.borderColor = 'var(--color-primary-200)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.borderColor = 'var(--border-default)'
            }}
          >
            <ArrowLeftIcon size={16} weight="bold" />
            <span>Quay lại trang chủ</span>
          </button>

          {/* Quick Share & Save Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Share Button */}
            <button
              type="button"
              onClick={handleShareProject}
              title="Sao chép liên kết chia sẻ dự án"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid var(--border-default)',
                background: '#fff',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-base)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              <ShareNetworkIcon size={16} weight="bold" />
              <span>Chia sẻ</span>
            </button>

            {/* Bookmark / Save Button */}
            <button
              type="button"
              onClick={onToggleSave}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${isSaved ? 'var(--color-primary-200)' : 'var(--border-default)'}`,
                background: isSaved ? 'var(--color-primary-50)' : '#fff',
                color: isSaved ? 'var(--color-primary-500)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (!isSaved) e.currentTarget.style.background = 'var(--bg-base)'
              }}
              onMouseLeave={(e) => {
                if (!isSaved) e.currentTarget.style.background = '#fff'
              }}
            >
              <BookmarkIcon size={16} weight={isSaved ? 'fill' : 'regular'} />
              <span>{isSaved ? 'Đã lưu dự án' : 'Lưu dự án'}</span>
            </button>
          </div>
        </div>

        {/* ── 2-Column Responsive Layout ── */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start"
          style={{ display: 'grid' }}
        >
          {/* ════════════════════════════════════════════════════════════════
              LEFT COLUMN: MAIN CONTENT & SPECIFICATIONS & ROLES
              ════════════════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* 1. Header Card with Structured Information Box */}
            <div style={{ ...cardStyle, padding: '26px 28px' }}>
              {/* Top row: Status & Tags */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {/* Status Indicator */}
                  <span
                    style={{
                      background: isClosed ? 'var(--bg-base)' : '#ECFDF5',
                      color: isClosed ? 'var(--text-secondary)' : '#059669',
                      border: `1px solid ${isClosed ? 'var(--border-strong)' : '#A7F3D0'}`,
                      padding: '3px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: isClosed ? '#94A3B8' : '#10B981',
                      }}
                    />
                    {isClosed ? 'Đã đóng tuyển' : 'Đang mở tuyển'}
                  </span>

                  {/* Domain Tags */}
                  {domainTags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--border-default)',
                      }}
                    >
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>

                {/* Sub-meta: Posted Time */}
                <span
                  style={{
                    fontSize: 12.5,
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ClockIcon size={14} />
                  Đăng {job.postedAgo}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.35,
                  margin: '0 0 10px 0',
                  letterSpacing: '-0.02em',
                }}
              >
                {job.title}
              </h1>

              {/* Client & Location line */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  flexWrap: 'wrap',
                  fontSize: 13.5,
                  color: 'var(--text-secondary)',
                  marginBottom: 20,
                }}
              >
                <span>
                  Đăng bởi:{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>
                    {job.clientName || job.company}
                  </strong>
                </span>
                {job.location && (
                  <>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPinIcon size={14} color="var(--text-tertiary)" />
                      {job.location}
                    </span>
                  </>
                )}
              </div>

              {/* Structured Project Information Panel (Bảng thông số dự án) */}
              <div
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  padding: '16px 20px',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                    gap: '14px 20px',
                  }}
                >
                  {/* Field 1: Kinh nghiệm */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Cấp độ kinh nghiệm
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginTop: 3,
                      }}
                    >
                      {job.experienceLevel === 'expert'
                        ? 'Chuyên gia (Expert)'
                        : job.experienceLevel === 'intermediate'
                          ? 'Có kinh nghiệm (Intermediate)'
                          : 'Mới bắt đầu (Entry level)'}
                    </div>
                  </div>

                  {/* Field 2: Quy mô tuyển dụng */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Vị trí tuyển dụng
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginTop: 3,
                      }}
                    >
                      {roles.length} vai trò ({job.openPositions} chỉ tiêu)
                    </div>
                  </div>

                  {/* Field 3: Ứng tuyển & Cạnh tranh */}
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Tình trạng ứng tuyển
                    </div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginTop: 3,
                      }}
                    >
                      {job.submitsCount} hồ sơ {job.submitsCount < 5 ? '• Ít cạnh tranh' : ''}
                    </div>
                  </div>

                  {/* Field 4: Thời gian làm việc */}
                  {job.hoursPerDay && (
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Thời gian làm việc
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginTop: 3,
                        }}
                      >
                        {job.hoursPerDay}h / ngày{' '}
                        {job.hoursPerDay >= 8 ? '(Toàn thời gian)' : '(Bán thời gian)'}
                      </div>
                    </div>
                  )}

                  {/* Field 5: Thời hạn dự án */}
                  {job.duration && (
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Thời hạn dự án
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginTop: 3,
                        }}
                      >
                        {job.duration}
                      </div>
                    </div>
                  )}

                  {/* Field 6: Hạn hoàn thành / Due date */}
                  {job.dueDate && (
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        Hạn hoàn thành dự kiến
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: 'var(--color-primary-500)',
                          marginTop: 3,
                        }}
                      >
                        {job.dueDate}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Project Description & Context Card */}
            <div style={{ ...cardStyle, padding: '24px 28px' }}>
              <h2
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: 12,
                  letterSpacing: '-0.01em',
                }}
              >
                Tổng quan dự án & Bối cảnh
              </h2>
              <p
                style={{
                  fontSize: 14.5,
                  color: 'var(--text-primary)',
                  lineHeight: 1.75,
                  marginBottom: 18,
                  whiteSpace: 'pre-line',
                }}
              >
                {job.description}
              </p>

              {/* Skills Tags */}
              <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    marginBottom: 10,
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                  }}
                >
                  Kỹ năng công nghệ tổng quan của dự án
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: 'var(--bg-base)',
                        color: 'var(--text-primary)',
                        padding: '4px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--border-strong)',
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Role-Based Multi-Hiring Section (Các vai trò tuyển dụng) */}
            <div style={{ ...cardStyle, padding: '24px 28px' }}>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BriefcaseMetalIcon size={20} color="var(--color-primary-500)" weight="fill" />
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Các vai trò tuyển dụng trong dự án
                  </h2>
                  <span
                    style={{
                      background: 'var(--color-primary-50)',
                      color: 'var(--color-primary-500)',
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '2px 10px',
                      borderRadius: 6,
                      border: '1px solid var(--color-primary-100)',
                    }}
                  >
                    {roles.length} vai trò
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13.5,
                    color: 'var(--text-secondary)',
                    marginTop: 6,
                    lineHeight: 1.5,
                    margin: '6px 0 0',
                  }}
                >
                  Mỗi vai trò có bản mô tả công việc (JD), tiêu chí năng lực và khoảng ngân sách min
                  – max riêng biệt. Hãy lựa chọn vai trò phù hợp nhất với chuyên môn của bạn để nộp
                  hồ sơ.
                </p>
              </div>

              {/* Roles Card List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {roles.map((role) => {
                  const isApplied = appliedRoleIds.includes(role.id)
                  const isRoleFilled = role.status === 'filled'

                  return (
                    <div
                      key={role.id}
                      style={{
                        background: '#fff',
                        borderRadius: 12,
                        border: isApplied
                          ? '1.5px solid var(--color-success-border)'
                          : '1px solid var(--border-default)',
                        boxShadow: isApplied
                          ? '0 2px 12px rgba(5,118,66,0.08)'
                          : 'var(--shadow-card)',
                        padding: '22px 24px',
                        transition: 'all 150ms ease',
                      }}
                    >
                      {/* Top row: Title + Slots status + Budget range */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: 12,
                          paddingBottom: 14,
                          borderBottom: '1px solid var(--border-default)',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              flexWrap: 'wrap',
                            }}
                          >
                            <span
                              style={{
                                fontSize: 17,
                                fontWeight: 800,
                                color: 'var(--color-primary-500)',
                              }}
                            >
                              {role.title}
                            </span>
                            <span
                              style={{
                                background:
                                  role.status === 'recruiting'
                                    ? 'var(--color-primary-50)'
                                    : 'var(--bg-base)',
                                color:
                                  role.status === 'recruiting'
                                    ? 'var(--color-primary-500)'
                                    : 'var(--text-secondary)',
                                fontSize: 11.5,
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 6,
                                border:
                                  role.status === 'recruiting'
                                    ? '1px solid var(--color-primary-100)'
                                    : '1px solid var(--border-default)',
                              }}
                            >
                              {role.status === 'recruiting' ? 'Đang tuyển' : 'Đã có nhân sự'}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: 'var(--text-tertiary)',
                                fontWeight: 600,
                              }}
                            >
                              (Tuyển: {role.slotsFilled}/{role.slotsTotal} người)
                            </span>
                          </div>
                        </div>

                        {/* Min - Max Budget Tag */}
                        <div
                          style={{
                            background: 'var(--color-success-bg)',
                            border: '1px solid var(--color-success-border)',
                            borderRadius: 8,
                            padding: '6px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <WalletIcon size={18} color="var(--color-success-fg)" weight="bold" />
                          <div>
                            <div
                              style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: 'var(--color-success-fg)',
                                textTransform: 'uppercase',
                              }}
                            >
                              Ngân sách đề xuất:
                            </div>
                            <div
                              style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: 'var(--color-success-fg)',
                              }}
                            >
                              {role.budgetDisplay}{' '}
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                {role.salaryTypeLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role JD (Job Description) */}
                      {role.jd && (
                        <div style={{ marginTop: 14 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              color: 'var(--text-secondary)',
                              marginBottom: 6,
                              textTransform: 'uppercase',
                              letterSpacing: '0.02em',
                            }}
                          >
                            <FileTextIcon
                              size={15}
                              color="var(--color-primary-500)"
                              weight="bold"
                            />
                            <span>Mô tả công việc (JD)</span>
                          </div>
                          <p
                            style={{
                              fontSize: 14,
                              color: 'var(--text-primary)',
                              lineHeight: 1.65,
                              margin: 0,
                            }}
                          >
                            {role.jd}
                          </p>
                        </div>
                      )}

                      {/* Requirements */}
                      {role.requirements && role.requirements.length > 0 && (
                        <div style={{ marginTop: 14 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 700,
                              color: 'var(--text-secondary)',
                              marginBottom: 8,
                              textTransform: 'uppercase',
                              letterSpacing: '0.02em',
                            }}
                          >
                            <SealCheckIcon
                              size={16}
                              color="var(--color-success-fg)"
                              weight="fill"
                            />
                            <span>Yêu cầu năng lực & kinh nghiệm</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {role.requirements.map((req, i) => (
                              <div
                                key={i}
                                style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: 8,
                                  fontSize: 13.5,
                                  color: 'var(--text-primary)',
                                }}
                              >
                                <CheckCircleIcon
                                  size={15}
                                  color="var(--color-success-fg)"
                                  weight="fill"
                                  style={{ flexShrink: 0, marginTop: 3 }}
                                />
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Skills Tags */}
                      {role.skills && role.skills.length > 0 && (
                        <div
                          style={{
                            marginTop: 14,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: 'var(--text-tertiary)',
                            }}
                          >
                            Kỹ năng yêu cầu:
                          </span>
                          {role.skills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                background: 'var(--bg-base)',
                                color: 'var(--text-primary)',
                                fontSize: 12,
                                fontWeight: 600,
                                padding: '3px 8px',
                                borderRadius: 6,
                                border: '1px solid var(--border-default)',
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Action Row */}
                      <div
                        style={{
                          marginTop: 16,
                          paddingTop: 14,
                          borderTop: '1px solid var(--border-default)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                        }}
                      >
                        {isRoleFilled ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '8px 16px',
                              borderRadius: 8,
                              background: 'var(--bg-base)',
                              border: '1px solid var(--border-default)',
                              color: 'var(--text-tertiary)',
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            <SealCheckIcon size={16} weight="fill" />
                            <span>Vị trí này đã có nhân sự tiếp nhận</span>
                          </div>
                        ) : isApplied ? (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '7px 16px',
                              borderRadius: 8,
                              background: 'var(--color-success-bg)',
                              border: '1px solid var(--color-success-border)',
                              color: 'var(--color-success-fg)',
                              fontSize: 13,
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircleIcon size={16} weight="fill" />
                            <span>Đã nộp hồ sơ cho vai trò này</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedRoleForApply(role)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '9px 20px',
                              borderRadius: 8,
                              border: 'none',
                              background: 'var(--color-primary-500)',
                              color: '#fff',
                              fontSize: 13.5,
                              fontWeight: 700,
                              cursor: 'pointer',
                              boxShadow: 'var(--shadow-md)',
                              transition: 'background 150ms ease',
                              fontFamily: 'inherit',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = 'var(--color-primary-600)')
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = 'var(--color-primary-500)')
                            }
                          >
                            <PaperPlaneTiltIcon size={14} weight="bold" />
                            <span>Ứng tuyển vai trò này</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              RIGHT COLUMN: POSTER PROFILE
              ════════════════════════════════════════════════════════════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Poster Info Card */}
            <div style={{ ...cardStyle, padding: 22 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 14,
                  letterSpacing: '0.02em',
                }}
              >
                Thông tin người đăng dự án
              </div>

              {/* Avatar & Name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar name={job.clientName || job.company} size="lg" />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {job.clientName || job.company}
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      color: 'var(--color-success-fg)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    <SealCheckIcon size={14} weight="fill" />
                    Khách hàng xác thực
                  </div>
                </div>
              </div>

              {/* Poster Reputation Attributes */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  padding: '12px 14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  marginBottom: 16,
                }}
              >
                {/* Rating */}
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Điểm uy tín:</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontWeight: 800,
                      color: '#B45309',
                    }}
                  >
                    <StarIcon size={14} weight="fill" color="#EAB308" />
                    {job.clientRating ? `${job.clientRating.toFixed(1)} / 5.0` : '5.0 / 5.0'}
                  </span>
                </div>

                {/* Completed Projects */}
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Dự án đã giao:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {job.completedProjectsCount || 24} dự án
                  </span>
                </div>

                {/* Location */}
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Trụ sở / Địa bàn:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {job.location || 'Việt Nam'}
                  </span>
                </div>

                {/* Member Since */}
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Gia nhập:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-tertiary)' }}>
                    Từ năm 2024
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  borderTop: '1px solid var(--border-default)',
                  paddingTop: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => onViewProfile?.(job.clientName)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--color-primary-200)',
                    background: 'var(--color-primary-50)',
                    color: 'var(--color-primary-500)',
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--color-primary-100)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'var(--color-primary-50)')
                  }
                >
                  <UserIcon size={15} weight="bold" />
                  <span>Xem hồ sơ người dùng</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid var(--color-error-border)',
                    background: '#fff',
                    color: 'var(--color-error-fg)',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 150ms ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-error-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <WarningIcon size={15} weight="bold" />
                  <span>Báo cáo người dùng / dự án</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Role-Specific Apply Modal ── */}
      {selectedRoleForApply && (
        <JobApplyModal
          key={selectedRoleForApply.id}
          isOpen={Boolean(selectedRoleForApply)}
          onClose={() => setSelectedRoleForApply(null)}
          job={job}
          role={selectedRoleForApply}
          onApplySuccess={handleApplyRoleSuccess}
        />
      )}

      {/* ── Report Job / User Modal ── */}
      <JobReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        job={job}
      />
    </div>
  )
}
