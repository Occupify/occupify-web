import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'

export interface ReportProfileModalProps {
  isOpen: boolean
  reportedUserName: string
  onClose: () => void
  onSubmit: (reason: string, imageFileName?: string) => void
  isSubmitting?: boolean
}

export function ReportProfileModal({
  isOpen,
  reportedUserName,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ReportProfileModalProps) {
  const [reason, setReason] = React.useState('')
  const [imageFileName, setImageFileName] = React.useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!reason.trim()) return
    onSubmit(reason.trim(), imageFileName || undefined)
    setReason('')
    setImageFileName('')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0F172A',
                margin: 0,
              }}
            >
              Báo cáo người dùng
            </h3>
            <p
              style={{
                fontSize: 13,
                color: '#64748B',
                margin: '4px 0 0 0',
              }}
            >
              Đối tượng báo cáo: <strong style={{ color: '#0F172A' }}>{reportedUserName}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 4,
              display: 'flex',
              borderRadius: 6,
            }}
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="report-reason"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Lý do báo cáo <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              id="report-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
              placeholder="Mô tả chi tiết vi phạm chính sách, hành vi gian lận hoặc chất lượng hợp tác..."
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '10px 12px',
                fontSize: 13.5,
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#0A66C2'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#CBD5E1'
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="report-image"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Hình ảnh / Bằng chứng (tùy chọn)
            </label>
            <input
              id="report-image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFileName(e.target.files?.[0]?.name ?? '')}
              style={{
                fontSize: 13,
                color: '#475569',
              }}
            />
            {imageFileName && (
              <span
                style={{
                  fontSize: 12,
                  color: '#0A66C2',
                  display: 'block',
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                Đã chọn: {imageFileName}
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#fff',
                color: '#475569',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: reason.trim() && !isSubmitting ? '#0A66C2' : '#94A3B8',
                color: '#fff',
                cursor: reason.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
                transition: 'background 150ms ease',
              }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
