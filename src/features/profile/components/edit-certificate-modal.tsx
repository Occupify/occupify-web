import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import type { ProfileCertificate, CertificateFormData } from '../types'

export interface EditCertificateModalProps {
  isOpen: boolean
  certificateToEdit?: ProfileCertificate | null
  onClose: () => void
  onSubmit: (data: CertificateFormData) => void
  isSubmitting?: boolean
}

function EditCertificateForm({
  certificateToEdit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditCertificateModalProps, 'isOpen'>) {
  const [name, setName] = React.useState(certificateToEdit?.name || '')
  const [issuer, setIssuer] = React.useState(certificateToEdit?.issuer || '')
  const [year, setYear] = React.useState(certificateToEdit?.year || '')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!name.trim() || !issuer.trim() || !year.trim()) return
    onSubmit({
      name: name.trim(),
      issuer: issuer.trim(),
      year: year.trim(),
    })
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
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
            }}
          >
            {certificateToEdit ? 'Chỉnh sửa chứng chỉ' : 'Thêm chứng chỉ chuyên môn'}
          </h3>
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
              htmlFor="cert-name"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Tên chứng chỉ / Bằng cấp <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="cert-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Google UX Design Professional Certificate"
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '9px 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="cert-issuer"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Tổ chức / Đơn vị cấp <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="cert-issuer"
              type="text"
              required
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="VD: Google · Coursera hoặc Amazon Web Services"
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '9px 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="cert-year"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Năm cấp <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="cert-year"
              type="text"
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="VD: 2023"
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '9px 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
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
              disabled={!name.trim() || !issuer.trim() || !year.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background:
                  name.trim() && issuer.trim() && year.trim() && !isSubmitting
                    ? '#0A66C2'
                    : '#94A3B8',
                color: '#fff',
                cursor:
                  name.trim() && issuer.trim() && year.trim() && !isSubmitting
                    ? 'pointer'
                    : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : certificateToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditCertificateModal({ isOpen, ...props }: EditCertificateModalProps) {
  if (!isOpen) return null
  return <EditCertificateForm key={props.certificateToEdit?.name ?? 'new'} {...props} />
}
