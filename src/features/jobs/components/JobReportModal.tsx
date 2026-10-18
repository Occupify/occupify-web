import * as React from 'react'
import { WarningIcon, XIcon, CheckCircleIcon } from '@phosphor-icons/react'
import type { JobListing } from '../types'
import { useReportJob } from '../hooks/use-report-job'
import { toast } from '@/components/feedback'

export interface JobReportModalProps {
  isOpen: boolean
  onClose: () => void
  job: JobListing
}

export function JobReportModal({ isOpen, onClose, job }: JobReportModalProps) {
  const [reportReason, setReportReason] = React.useState('Nội dung vi phạm / Lừa đảo')
  const [reportDetail, setReportDetail] = React.useState('')
  const [reportImage, setReportImage] = React.useState('')

  const { mutate: reportMutation, isPending } = useReportJob()

  if (!isOpen) return null

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!reportDetail.trim()) return

    reportMutation(
      {
        jobId: job.id,
        clientName: job.clientName,
        jobTitle: job.title,
        reason: reportReason,
        detail: reportDetail.trim(),
        evidenceImage: reportImage || undefined,
      },
      {
        onSuccess: () => {
          onClose()
          setReportDetail('')
          setReportImage('')
          toast.success(
            'Đã gửi báo cáo vi phạm thành công! Ban quản trị Occupify sẽ kiểm tra và phản hồi trong 24h.',
          )
        },
        onError: () => {
          toast.error('Có lỗi xảy ra khi gửi báo cáo, vui lòng thử lại sau.')
        },
      },
    )
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
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
          maxWidth: 480,
          padding: '24px 26px',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <WarningIcon size={20} color="var(--color-error-fg)" weight="fill" />
            <h3
              id="report-modal-title"
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: 'var(--color-error-fg)',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              Báo cáo người dùng / dự án
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
              padding: 4,
              borderRadius: 6,
              color: 'var(--text-tertiary)',
              display: 'flex',
            }}
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Target Info */}
        <div
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            marginBottom: 16,
            background: 'var(--bg-subtle)',
            padding: '10px 12px',
            borderRadius: 6,
            border: '1px solid var(--border-default)',
          }}
        >
          Đối tượng bị báo cáo:{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{job.clientName}</strong> (Dự án:{' '}
          {job.title})
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label
              htmlFor="report-reason"
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 6,
                color: 'var(--text-primary)',
              }}
            >
              Lý do báo cáo <span style={{ color: 'var(--color-error-fg)' }}>*</span>
            </label>
            <select
              id="report-reason"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
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
              <option value="Nội dung vi phạm / Lừa đảo">Nội dung vi phạm / Lừa đảo</option>
              <option value="Yêu cầu thanh toán ngoài hệ thống">
                Yêu cầu thanh toán ngoài hệ thống
              </option>
              <option value="Thông tin dự án giả mạo hoặc sai sự thật">
                Thông tin dự án giả mạo hoặc sai sự thật
              </option>
              <option value="Spam / Quấy rối / Ngôn từ không phù hợp">
                Spam / Quấy rối / Ngôn từ không phù hợp
              </option>
              <option value="Khác">Lý do khác</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="report-detail"
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 6,
                color: 'var(--text-primary)',
              }}
            >
              Mô tả chi tiết vi phạm <span style={{ color: 'var(--color-error-fg)' }}>*</span>
            </label>
            <textarea
              id="report-detail"
              value={reportDetail}
              onChange={(e) => setReportDetail(e.target.value)}
              rows={4}
              placeholder="Vui lòng cung cấp chi tiết hành vi vi phạm để ban quản trị đối soát nhanh chóng..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: 6,
                border: '1px solid var(--border-strong)',
                fontSize: 13.5,
                outline: 'none',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
              required
            />
          </div>

          <div>
            <label
              htmlFor="report-evidence"
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 700,
                marginBottom: 6,
                color: 'var(--text-primary)',
              }}
            >
              Ảnh chụp bằng chứng (tùy chọn)
            </label>
            <input
              id="report-evidence"
              type="file"
              accept="image/*"
              onChange={(e) => setReportImage(e.target.files?.[0]?.name ?? '')}
              style={{ fontSize: 13 }}
            />
            {reportImage && (
              <span
                style={{
                  fontSize: 12,
                  color: 'var(--color-success-fg)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 6,
                }}
              >
                <CheckCircleIcon size={14} weight="fill" />
                <span>Đã chọn: {reportImage}</span>
              </span>
            )}
          </div>

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
              disabled={!reportDetail.trim() || isPending}
              style={{
                padding: '9px 24px',
                borderRadius: 8,
                border: 'none',
                background:
                  reportDetail.trim() && !isPending
                    ? 'var(--color-error-fg)'
                    : 'var(--color-error-border)',
                color: '#fff',
                cursor: reportDetail.trim() && !isPending ? 'pointer' : 'not-allowed',
                fontSize: 13.5,
                fontWeight: 700,
                fontFamily: 'inherit',
                transition: 'background 150ms ease',
              }}
              onMouseEnter={(e) => {
                if (reportDetail.trim() && !isPending) {
                  e.currentTarget.style.background = '#991b1b'
                }
              }}
              onMouseLeave={(e) => {
                if (reportDetail.trim() && !isPending) {
                  e.currentTarget.style.background = 'var(--color-error-fg)'
                }
              }}
            >
              {isPending ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
