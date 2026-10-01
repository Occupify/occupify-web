import * as React from 'react'
import { ArrowLeftIcon, FileTextIcon } from '@phosphor-icons/react'

export interface CreateContractPageProps {
  onBack: () => void
  onSubmit: (contractData?: {
    title: string
    candidate: string
    value: string
    terms: string
  }) => void
}

export function CreateContractPage({ onBack, onSubmit }: CreateContractPageProps) {
  const [title, setTitle] = React.useState('')
  const [candidate, setCandidate] = React.useState('')
  const [value, setValue] = React.useState('')
  const [paymentType, setPaymentType] = React.useState<'milestone' | 'fixed' | 'monthly'>('fixed')
  const [message, setMessage] = React.useState('')

  const canSubmit =
    title.trim().length > 0 && candidate.trim().length > 0 && value.trim().length > 0

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      title: title.trim(),
      candidate: candidate.trim(),
      value: value.trim(),
      terms: message.trim(),
    })
  }

  return (
    <div style={{ background: '#F4F2EE', minHeight: '100%', paddingBottom: 48 }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          padding: '32px 0',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 20px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.24)',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 16,
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)')
            }
          >
            <ArrowLeftIcon size={14} weight="bold" />
            <span>Quay lại trang chủ</span>
          </button>
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 26, margin: 0 }}>
            Soạn thảo hợp đồng điện tử
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6, fontSize: 14.5 }}>
            Mời freelancer, thiết lập ngân sách và các điều khoản giao việc minh bạch.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div style={{ maxWidth: 860, margin: '24px auto 0', padding: '0 20px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
          }}
        >
          {/* Card Title */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 8,
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileTextIcon size={22} weight="bold" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Thiết lập điều khoản hợp đồng
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                Hợp đồng sẽ có hiệu lực ngay khi hai bên cùng ký xác nhận điện tử
              </p>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Tiêu đề */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: 6,
                }}
              >
                Tiêu đề hợp đồng *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Hợp đồng thiết kế hệ thống UI/UX – Dự án Fintech"
                className="pro-input"
                required
              />
            </div>

            {/* Tên hoặc email Freelancer */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: 6,
                }}
              >
                Ứng viên / Email Freelancer nhận hợp đồng *
              </label>
              <input
                type="text"
                value={candidate}
                onChange={(e) => setCandidate(e.target.value)}
                placeholder="VD: tranphuong.design@gmail.com"
                className="pro-input"
                required
              />
            </div>

            {/* Giá trị hợp đồng & Hình thức */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: 6,
                  }}
                >
                  Giá trị hợp đồng (VND) *
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="VD: 45000000"
                  className="pro-input"
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: '#334155',
                    marginBottom: 6,
                  }}
                >
                  Hình thức thanh toán
                </label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value as any)}
                  className="pro-select"
                >
                  <option value="fixed">Trọn gói khi nghiệm thu</option>
                  <option value="milestone">Theo từng cột mốc (Milestones)</option>
                  <option value="monthly">Định kỳ hàng tháng</option>
                </select>
              </div>
            </div>

            {/* Lời nhắn / Điều khoản */}
            <div style={{ marginBottom: 28 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: '#334155',
                  marginBottom: 6,
                }}
              >
                Thông điệp & Ghi chú bổ sung
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="pro-input"
                rows={4}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
              />
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
                paddingTop: 16,
                borderTop: '1px solid var(--border-default)',
              }}
            >
              <button
                type="button"
                onClick={onBack}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '9px 20px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                style={{
                  background: canSubmit ? '#059669' : '#94A3B8',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 24px',
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: '#fff',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  transition: 'background 150ms ease',
                }}
              >
                Ký & Gửi lời mời hợp đồng
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
