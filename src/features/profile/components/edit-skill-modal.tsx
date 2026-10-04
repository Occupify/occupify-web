import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import type { ProfileSkill, SkillFormData } from '../types'

export interface EditSkillModalProps {
  isOpen: boolean
  skillToEdit?: ProfileSkill | null
  onClose: () => void
  onSubmit: (data: SkillFormData) => void
  isSubmitting?: boolean
}

const DEFAULT_CATEGORIES = ['Frontend', 'Backend', 'Cloud', 'Công cụ & Khác']

function EditSkillForm({
  skillToEdit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditSkillModalProps, 'isOpen'>) {
  const [name, setName] = React.useState(skillToEdit?.name || '')
  const [category, setCategory] = React.useState(skillToEdit?.category || 'Frontend')
  const [isTopSkill, setIsTopSkill] = React.useState(skillToEdit?.isTopSkill ?? false)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!name.trim() || !category.trim()) return
    onSubmit({
      name: name.trim(),
      category: category.trim(),
      isTopSkill,
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
            {skillToEdit ? 'Chỉnh sửa kỹ năng' : 'Thêm kỹ năng chuyên môn'}
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
          {/* Tên kỹ năng */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="skill-name"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Tên kỹ năng / Công nghệ <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="skill-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Java, React, Frontend, Cloud, TypeScript, AWS..."
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

          {/* Nhóm kỹ năng */}
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="skill-cat"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Nhóm chuyên môn <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <select
              id="skill-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              {DEFAULT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Kỹ năng nổi bật checkbox */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={isTopSkill}
                onChange={(e) => setIsTopSkill(e.target.checked)}
                style={{ accentColor: '#0A66C2', width: 16, height: 16 }}
              />
              <span>Đặt làm Kỹ năng nổi bật (Top Skill)</span>
            </label>
          </div>

          {/* Actions */}
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
              disabled={!name.trim() || !category.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: name.trim() && category.trim() && !isSubmitting ? '#0A66C2' : '#94A3B8',
                color: '#fff',
                cursor: name.trim() && category.trim() && !isSubmitting ? 'pointer' : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : skillToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditSkillModal({ isOpen, ...props }: EditSkillModalProps) {
  if (!isOpen) return null
  return <EditSkillForm key={props.skillToEdit?.id ?? 'new'} {...props} />
}
