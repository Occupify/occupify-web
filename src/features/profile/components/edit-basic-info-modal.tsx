import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import type { UpdateBasicInfoPayload } from '../types'

export interface EditBasicInfoModalProps {
  isOpen: boolean
  initialData: {
    name: string
    headline: string
    location?: string
    intro: string
  }
  onClose: () => void
  onSubmit: (data: UpdateBasicInfoPayload) => void
  isSubmitting?: boolean
}

function EditBasicInfoForm({
  initialData,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditBasicInfoModalProps, 'isOpen'>) {
  const [name, setName] = React.useState(initialData.name)
  const [headline, setHeadline] = React.useState(initialData.headline)
  const [location, setLocation] = React.useState(initialData.location || '')
  const [intro, setIntro] = React.useState(initialData.intro)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!name.trim() || !headline.trim()) return
    onSubmit({
      name: name.trim(),
      headline: headline.trim(),
      location: location.trim() || undefined,
      intro: intro.trim(),
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
          maxWidth: 520,
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
            Chỉnh sửa thông tin cá nhân
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
              htmlFor="basic-name"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Họ và tên <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="basic-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên"
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
              htmlFor="basic-headline"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Tiêu đề chuyên môn (Headline) <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="basic-headline"
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="VD: Senior Product Designer & UX Architect"
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
              htmlFor="basic-location"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Địa điểm
            </label>
            <input
              id="basic-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="VD: Hà Nội, Việt Nam"
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
              htmlFor="basic-intro"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Giới thiệu bản thân (Bio)
            </label>
            <textarea
              id="basic-intro"
              rows={4}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="Tóm tắt về kinh nghiệm làm việc, năng lực thế mạnh và định hướng hợp tác..."
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
              disabled={!name.trim() || !headline.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: name.trim() && headline.trim() && !isSubmitting ? '#0A66C2' : '#94A3B8',
                color: '#fff',
                cursor: name.trim() && headline.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditBasicInfoModal({ isOpen, ...props }: EditBasicInfoModalProps) {
  if (!isOpen) return null
  return <EditBasicInfoForm key={props.initialData.name + props.initialData.headline} {...props} />
}
