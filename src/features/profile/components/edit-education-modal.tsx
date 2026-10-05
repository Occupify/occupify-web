import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import type { ProfileEducation, EducationFormData } from '../types'

export interface EditEducationModalProps {
  isOpen: boolean
  educationToEdit?: ProfileEducation | null
  onClose: () => void
  onSubmit: (data: EducationFormData) => void
  isSubmitting?: boolean
}

function EditEducationForm({
  educationToEdit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditEducationModalProps, 'isOpen'>) {
  const [school, setSchool] = React.useState(educationToEdit?.school || '')
  const [period, setPeriod] = React.useState(educationToEdit?.period || '')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!school.trim() || !period.trim()) return
    onSubmit({
      school: school.trim(),
      period: period.trim(),
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
            {educationToEdit ? 'Chỉnh sửa học vấn' : 'Thêm thông tin học vấn'}
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
              htmlFor="edu-school"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Trường học / Cơ sở đào tạo <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="edu-school"
              type="text"
              required
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="VD: Đại học Bách Khoa Hà Nội"
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
              htmlFor="edu-period"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Niên khóa / Thời gian học <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="edu-period"
              type="text"
              required
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="VD: 2016 – 2021"
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
              disabled={!school.trim() || !period.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: school.trim() && period.trim() && !isSubmitting ? '#0A66C2' : '#94A3B8',
                color: '#fff',
                cursor: school.trim() && period.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : educationToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditEducationModal({ isOpen, ...props }: EditEducationModalProps) {
  if (!isOpen) return null
  return <EditEducationForm key={props.educationToEdit?.school ?? 'new'} {...props} />
}
