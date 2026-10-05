import * as React from 'react'
import {
  PaperPlaneTiltIcon,
  XIcon,
  FilePdfIcon,
  UploadSimpleIcon,
  LinkSimpleIcon,
} from '@phosphor-icons/react'
import type { JobListing, JobRoleItem, JobSalaryCycle } from '../types'
import { useApplyJob } from '../hooks/use-apply-job'
import { toast } from '@/components/feedback'

export interface JobApplyModalProps {
  isOpen: boolean
  onClose: () => void
  job: JobListing
  role: JobRoleItem
  onApplySuccess: (roleId: string, roleTitle: string) => void
}

export function JobApplyModal({ isOpen, onClose, job, role, onApplySuccess }: JobApplyModalProps) {
  const [salaryCycle, setSalaryCycle] = React.useState<JobSalaryCycle>(() => {
    return role.salaryType === 'hourly'
      ? 'hourly'
      : role.salaryType === 'weekly'
        ? 'weekly'
        : role.salaryType === 'monthly'
          ? 'monthly'
          : role.salaryType === 'fixed'
            ? 'fixed'
            : 'monthly'
  })

  const [bidPrice, setBidPrice] = React.useState<string>(() => {
    const cycle =
      role.salaryType === 'hourly'
        ? 'hourly'
        : role.salaryType === 'weekly'
          ? 'weekly'
          : role.salaryType === 'monthly'
            ? 'monthly'
            : role.salaryType === 'fixed'
              ? 'fixed'
              : 'monthly'

    if (cycle === 'hourly') {
      return role.minBudget ? `${role.minBudget.toLocaleString('vi-VN')} ₫` : '450.000 ₫'
    }
    if (cycle === 'fixed') {
      return role.minBudget
        ? `${(role.minBudget / 1_000_000).toFixed(0)}.000.000 ₫`
        : '30.000.000 ₫'
    }
    return role.minBudget ? `${(role.minBudget / 1_000_000).toFixed(0)}.000.000 ₫` : '35.000.000 ₫'
  })

  const [commitment, setCommitment] = React.useState(
    'Dài hạn (Trên 6 tháng) — Sẵn sàng bắt đầu ngay',
  )
  const [fixedDeliveryDays, setFixedDeliveryDays] = React.useState('14 ngày')
  const [weeklyHours, setWeeklyHours] = React.useState('30 - 40 giờ / tuần (Toàn thời gian)')
  const [cvFile, setCvFile] = React.useState<{ name: string; size: string } | null>({
    name: 'CV_UngVien_ChuyenNghiep.pdf',
    size: '1.8 MB',
  })
  const [portfolioLink, setPortfolioLink] = React.useState('')
  const cvFileInputRef = React.useRef<HTMLInputElement>(null)

  const { mutate: applyMutation, isPending } = useApplyJob()

  if (!isOpen) return null

  const handleCycleChange = (nextCycle: JobSalaryCycle) => {
    setSalaryCycle(nextCycle)
    if (nextCycle === 'hourly' && !bidPrice.includes('/ giờ')) {
      setBidPrice(role.minBudget ? `${role.minBudget.toLocaleString('vi-VN')} ₫` : '450.000 ₫')
    } else if (nextCycle === 'monthly' && !bidPrice.includes('.000.000')) {
      setBidPrice(
        role.minBudget ? `${(role.minBudget / 1_000_000).toFixed(0)}.000.000 ₫` : '35.000.000 ₫',
      )
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setCvFile({ name: file.name, size: `${sizeMb} MB` })
    }
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!bidPrice.trim()) {
      toast.error('Vui lòng nhập mức thù lao mong muốn')
      return
    }

    applyMutation(
      {
        jobId: job.id,
        roleId: role.id,
        salaryCycle,
        bidPrice,
        commitment: salaryCycle !== 'fixed' ? commitment : undefined,
        fixedDeliveryDays: salaryCycle === 'fixed' ? fixedDeliveryDays : undefined,
        weeklyHours: salaryCycle === 'hourly' ? weeklyHours : undefined,
        cvFile,
        portfolioLink: portfolioLink.trim() || undefined,
      },
      {
        onSuccess: () => {
          onApplySuccess(role.id, role.title)
          onClose()
          toast.success(
            `Đã nộp hồ sơ ứng tuyển vai trò "${role.title}" thành công! Khách hàng sẽ phản hồi qua tin nhắn.`,
          )
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi nộp hồ sơ, vui lòng thử lại sau.')
        },
      },
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-overlay)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          width: '100%',
          maxWidth: 580,
          padding: '24px 28px',
          boxShadow: 'var(--shadow-xl)',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'var(--color-primary-50)',
                color: 'var(--color-primary-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PaperPlaneTiltIcon size={20} weight="bold" />
            </div>
            <h3
              id="apply-modal-title"
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Ứng tuyển vai trò: {role.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-base)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Reference Banner */}
        <div
          style={{
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 18,
            fontSize: 13,
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            Dự án: <strong style={{ color: 'var(--text-primary)' }}>{job.title}</strong>
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Khoảng ngân sách tham chiếu:</span>
            <strong style={{ color: 'var(--color-success-fg)', fontWeight: 800 }}>
              {role.budgetDisplay} {role.salaryTypeLabel}
            </strong>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Row 1: Chu kỳ & Mức thù lao */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: 12,
            }}
          >
            <div>
              <label
                htmlFor="apply-salary-cycle"
                style={{
                  display: 'block',
                  fontSize: 12.5,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: 'var(--text-primary)',
                }}
              >
                Chu kỳ nhận thù lao <span style={{ color: 'var(--color-error-fg)' }}>*</span>
              </label>
              <select
                id="apply-salary-cycle"
                value={salaryCycle}
                onChange={(e) => handleCycleChange(e.target.value as JobSalaryCycle)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-strong)',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  background: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  color: 'var(--color-primary-500)',
                }}
              >
                <option value="monthly">Theo tháng (Hàng tháng · Dài hạn)</option>
                <option value="hourly">Theo giờ (Hourly)</option>
                <option value="daily">Theo ngày</option>
                <option value="weekly">Theo tuần</option>
                <option value="fixed">Trọn gói toàn bộ dự án (Cố định)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="apply-bid-price"
                style={{
                  display: 'block',
                  fontSize: 12.5,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: 'var(--text-primary)',
                }}
              >
                {salaryCycle === 'hourly'
                  ? 'Lương mong muốn (/ giờ)'
                  : salaryCycle === 'monthly'
                    ? 'Lương mong muốn (/ tháng)'
                    : salaryCycle === 'weekly'
                      ? 'Lương mong muốn (/ tuần)'
                      : salaryCycle === 'daily'
                        ? 'Lương mong muốn (/ ngày)'
                        : 'Thù lao trọn gói'}{' '}
                <span style={{ color: 'var(--color-error-fg)' }}>*</span>
              </label>
              <input
                id="apply-bid-price"
                type="text"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
                placeholder={salaryCycle === 'hourly' ? 'VD: 450.000 ₫' : 'VD: 35.000.000 ₫'}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-strong)',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          </div>

          {/* Row 2: Thời hạn cam kết hoặc Thời gian hoàn thành */}
          {salaryCycle === 'fixed' ? (
            <div>
              <label
                htmlFor="apply-fixed-delivery"
                style={{
                  display: 'block',
                  fontSize: 12.5,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: 'var(--text-primary)',
                }}
              >
                Thời gian hoàn thành dự án dự kiến{' '}
                <span style={{ color: 'var(--color-error-fg)' }}>*</span>
              </label>
              <input
                id="apply-fixed-delivery"
                type="text"
                value={fixedDeliveryDays}
                onChange={(e) => setFixedDeliveryDays(e.target.value)}
                placeholder="Ví dụ: 14 ngày hoặc 1 tháng"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border-strong)',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                required
              />
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: salaryCycle === 'hourly' ? '1.2fr 1fr' : '1fr',
                gap: 12,
              }}
            >
              <div>
                <label
                  htmlFor="apply-commitment"
                  style={{
                    display: 'block',
                    fontSize: 12.5,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: 'var(--text-primary)',
                  }}
                >
                  Thời hạn cam kết hợp tác <span style={{ color: 'var(--color-error-fg)' }}>*</span>
                </label>
                <select
                  id="apply-commitment"
                  value={commitment}
                  onChange={(e) => setCommitment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 6,
                    border: '1px solid var(--border-strong)',
                    fontSize: 13.5,
                    outline: 'none',
                    fontFamily: 'inherit',
                    background: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Dài hạn (Trên 6 tháng) — Sẵn sàng bắt đầu ngay">
                    Dài hạn (Trên 6 tháng) — Sẵn sàng bắt đầu ngay
                  </option>
                  <option value="Trung hạn (3 - 6 tháng) — Bắt đầu ngay">
                    Trung hạn (3 - 6 tháng) — Bắt đầu ngay
                  </option>
                  <option value="Ngắn hạn (1 - 3 tháng) — Bắt đầu ngay">
                    Ngắn hạn (1 - 3 tháng) — Bắt đầu ngay
                  </option>
                  <option value="Linh hoạt theo nhu cầu dự án">
                    Linh hoạt theo nhu cầu và tiến độ dự án
                  </option>
                </select>
              </div>

              {salaryCycle === 'hourly' && (
                <div>
                  <label
                    htmlFor="apply-weekly-hours"
                    style={{
                      display: 'block',
                      fontSize: 12.5,
                      fontWeight: 700,
                      marginBottom: 6,
                      color: 'var(--text-primary)',
                    }}
                  >
                    Số giờ cam kết làm việc / tuần{' '}
                    <span style={{ color: 'var(--color-error-fg)' }}>*</span>
                  </label>
                  <select
                    id="apply-weekly-hours"
                    value={weeklyHours}
                    onChange={(e) => setWeeklyHours(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border-strong)',
                      fontSize: 13.5,
                      outline: 'none',
                      fontFamily: 'inherit',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="30 - 40 giờ / tuần (Toàn thời gian)">
                      30 - 40 giờ / tuần (Toàn thời gian)
                    </option>
                    <option value="20 - 30 giờ / tuần (Bán thời gian)">
                      20 - 30 giờ / tuần (Bán thời gian)
                    </option>
                    <option value="10 - 20 giờ / tuần (Linh hoạt)">
                      10 - 20 giờ / tuần (Linh hoạt)
                    </option>
                    <option value="Linh hoạt theo thỏa thuận">Linh hoạt theo thỏa thuận</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Row 3: Đính kèm File CV */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 6,
              }}
            >
              <label
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Đính kèm File CV (Curriculum Vitae){' '}
                <span style={{ color: 'var(--color-error-fg)' }}>*</span>
              </label>
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                Hỗ trợ file .PDF, .DOCX (Tối đa 10MB)
              </span>
            </div>

            <input
              ref={cvFileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {cvFile ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1.5px solid var(--color-primary-200)',
                  background: 'var(--color-primary-50)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 6,
                      background: 'var(--color-error-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-error-fg)',
                    }}
                  >
                    <FilePdfIcon size={22} weight="fill" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {cvFile.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11.5,
                        color: 'var(--text-tertiary)',
                        marginTop: 1,
                      }}
                    >
                      {cvFile.size} · Đã đính kèm sẵn sàng gửi
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => cvFileInputRef.current?.click()}
                    style={{
                      background: '#fff',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      color: 'var(--color-primary-500)',
                    }}
                  >
                    Đổi file
                  </button>
                  <button
                    type="button"
                    onClick={() => setCvFile(null)}
                    aria-label="Xóa file đính kèm"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 4,
                      cursor: 'pointer',
                      color: 'var(--text-tertiary)',
                      display: 'flex',
                    }}
                  >
                    <XIcon size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => cvFileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    cvFileInputRef.current?.click()
                  }
                }}
                style={{
                  border: '1.5px dashed var(--border-strong)',
                  borderRadius: 8,
                  padding: '16px 14px',
                  textAlign: 'center',
                  background: 'var(--bg-subtle)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-500)'
                  e.currentTarget.style.background = 'var(--color-primary-50)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)'
                  e.currentTarget.style.background = 'var(--bg-subtle)'
                }}
              >
                <UploadSimpleIcon
                  size={26}
                  style={{
                    margin: '0 auto 6px',
                    color: 'var(--color-primary-500)',
                  }}
                />
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--color-primary-500)',
                  }}
                >
                  Bấm để chọn file CV từ máy tính hoặc kéo thả vào đây
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: 'var(--text-tertiary)',
                    marginTop: 2,
                  }}
                >
                  (Khuyên dùng file PDF để nhà tuyển dụng dễ xem trên mọi thiết bị)
                </div>
              </div>
            )}
          </div>

          {/* Row 4: Link Portfolio / GitHub */}
          <div>
            <label
              htmlFor="apply-portfolio"
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 6,
                color: 'var(--text-primary)',
              }}
            >
              Link Portfolio / GitHub / Behance (Tùy chọn)
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  pointerEvents: 'none',
                  display: 'flex',
                }}
              >
                <LinkSimpleIcon size={16} />
              </span>
              <input
                id="apply-portfolio"
                type="url"
                value={portfolioLink}
                onChange={(e) => setPortfolioLink(e.target.value)}
                placeholder="https://behance.net/your-profile hoặc https://github.com/..."
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 6,
                  border: '1px solid var(--border-strong)',
                  fontSize: 13.5,
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 8,
              paddingTop: 12,
              borderTop: '1px solid var(--border-default)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                border: '1px solid var(--border-default)',
                background: '#fff',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: 'inherit',
                transition: 'all 120ms ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-base)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '9px 24px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--color-primary-500)',
                color: '#fff',
                cursor: isPending ? 'not-allowed' : 'pointer',
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: 'inherit',
                boxShadow: 'var(--shadow-md)',
                transition: 'background 150ms ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                opacity: isPending ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isPending) e.currentTarget.style.background = 'var(--color-primary-600)'
              }}
              onMouseLeave={(e) => {
                if (!isPending) e.currentTarget.style.background = 'var(--color-primary-500)'
              }}
            >
              <PaperPlaneTiltIcon size={14} weight="bold" />
              <span>{isPending ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ ứng tuyển'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
