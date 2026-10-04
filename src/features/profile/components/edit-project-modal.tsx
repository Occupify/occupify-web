import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import type { ProfileProject, ProjectFormData } from '../types'

export interface EditProjectModalProps {
  isOpen: boolean
  projectToEdit?: ProfileProject | null
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
  isSubmitting?: boolean
}

function EditProjectForm({
  projectToEdit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditProjectModalProps, 'isOpen'>) {
  const [name, setName] = React.useState(projectToEdit?.name || '')
  const [owner, setOwner] = React.useState(projectToEdit?.owner || '')
  const [detail, setDetail] = React.useState(projectToEdit?.detail || '')
  const [rating, setRating] = React.useState(projectToEdit?.rating ?? 5)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!name.trim() || !owner.trim() || !detail.trim()) return
    onSubmit({
      name: name.trim(),
      owner: owner.trim(),
      detail: detail.trim(),
      rating,
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
            {projectToEdit ? 'Chỉnh sửa dự án' : 'Thêm dự án đã tham gia'}
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
              htmlFor="proj-name"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Tên dự án <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="proj-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Redesign hệ thống UI cho ứng dụng Fintech"
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
              htmlFor="proj-owner"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Đối tác / Doanh nghiệp chủ quản <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="proj-owner"
              type="text"
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="VD: VNPAY Corporation hoặc Base.vn"
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
              htmlFor="proj-detail"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Mô tả đóng góp & kết quả đạt được <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <textarea
              id="proj-detail"
              rows={3}
              required
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Tóm tắt ngắn gọn phạm vi công việc và kết quả bàn giao thành công..."
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

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="proj-rating"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Đánh giá mức độ hài lòng của đối tác (1 – 5 sao)
            </label>
            <select
              id="proj-rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              style={{
                width: '100%',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                padding: '9px 12px',
                fontSize: 14,
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                outline: 'none',
                background: '#fff',
              }}
            >
              <option value={5}>5 sao ★★★★★ (Xuất sắc)</option>
              <option value={4}>4 sao ★★★★☆ (Tốt / Hài lòng)</option>
              <option value={3}>3 sao ★★★☆☆ (Đạt yêu cầu)</option>
            </select>
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
              disabled={!name.trim() || !owner.trim() || !detail.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background:
                  name.trim() && owner.trim() && detail.trim() && !isSubmitting
                    ? '#0A66C2'
                    : '#94A3B8',
                color: '#fff',
                cursor:
                  name.trim() && owner.trim() && detail.trim() && !isSubmitting
                    ? 'pointer'
                    : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : projectToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditProjectModal({ isOpen, ...props }: EditProjectModalProps) {
  if (!isOpen) return null
  return <EditProjectForm key={props.projectToEdit?.id ?? 'new'} {...props} />
}
