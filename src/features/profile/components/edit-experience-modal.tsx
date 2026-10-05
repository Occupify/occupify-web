import * as React from 'react'
import { XIcon } from '@phosphor-icons/react'
import type { ProfileExperience, ExperienceFormData } from '../types'

export interface EditExperienceModalProps {
  isOpen: boolean
  experienceToEdit?: ProfileExperience | null
  onClose: () => void
  onSubmit: (data: ExperienceFormData) => void
  isSubmitting?: boolean
}

function EditExperienceForm({
  experienceToEdit,
  onClose,
  onSubmit,
  isSubmitting = false,
}: Omit<EditExperienceModalProps, 'isOpen'>) {
  const [title, setTitle] = React.useState(experienceToEdit?.title || '')
  const [company, setCompany] = React.useState(experienceToEdit?.company || '')
  const [employmentType, setEmploymentType] = React.useState(
    experienceToEdit?.employmentType || 'Freelance / Contract',
  )
  const [location, setLocation] = React.useState(experienceToEdit?.location || '')
  const [startDate, setStartDate] = React.useState(experienceToEdit?.startDate || '')
  const [endDate, setEndDate] = React.useState(
    experienceToEdit?.endDate === 'Hiện tại' ? '' : experienceToEdit?.endDate || '',
  )
  const [isCurrent, setIsCurrent] = React.useState(
    experienceToEdit?.isCurrent ?? experienceToEdit?.endDate === 'Hiện tại',
  )
  const [description, setDescription] = React.useState(experienceToEdit?.description || '')
  const [skillsInput, setSkillsInput] = React.useState(experienceToEdit?.skills?.join(', ') || '')

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!title.trim() || !company.trim() || !startDate.trim()) return

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    onSubmit({
      title: title.trim(),
      company: company.trim(),
      employmentType,
      location: location.trim() || undefined,
      startDate: startDate.trim(),
      endDate: isCurrent ? 'Hiện tại' : endDate.trim() || 'Hiện tại',
      isCurrent,
      description: description.trim(),
      skills: skills.length > 0 ? skills : undefined,
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
          maxWidth: 560,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
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
            {experienceToEdit ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm làm việc'}
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
          {/* Job Title */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="exp-title"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Chức danh / Vị trí <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="exp-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Senior React Native Developer hoặc UI/UX Lead"
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

          {/* Company & Employment Type */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <label
                htmlFor="exp-company"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                  color: '#334155',
                }}
              >
                Công ty / Khách hàng <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="exp-company"
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="VD: Tiki Vietnam hoặc Global Software Ltd"
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

            <div>
              <label
                htmlFor="exp-type"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                  color: '#334155',
                }}
              >
                Loại hình công việc
              </label>
              <select
                id="exp-type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
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
                <option value="Freelance / Contract">Freelance / Contract</option>
                <option value="Hợp đồng dự án">Hợp đồng dự án</option>
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Tự do / Khởi nghiệp">Tự do / Khởi nghiệp</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="exp-location"
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
              id="exp-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="VD: Hà Nội · Remote hoặc TP. Hồ Chí Minh"
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

          {/* Dates & Current role checkbox */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div>
              <label
                htmlFor="exp-start"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                  color: '#334155',
                }}
              >
                Bắt đầu (MM/YYYY) <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                id="exp-start"
                type="text"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="VD: 03/2022"
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

            <div>
              <label
                htmlFor="exp-end"
                style={{
                  display: 'block',
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 6,
                  color: '#334155',
                }}
              >
                Kết thúc (MM/YYYY)
              </label>
              <input
                id="exp-end"
                type="text"
                disabled={isCurrent}
                value={isCurrent ? 'Hiện tại' : endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="VD: 12/2023"
                style={{
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  padding: '9px 12px',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                  background: isCurrent ? '#F1F5F9' : '#fff',
                }}
              />
            </div>
          </div>

          {/* Current role checkbox */}
          <div style={{ marginBottom: 16 }}>
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
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                style={{ accentColor: '#0A66C2', width: 16, height: 16 }}
              />
              <span>Tôi hiện đang làm việc ở vị trí này</span>
            </label>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="exp-desc"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Mô tả trách nhiệm & đóng góp chính
            </label>
            <textarea
              id="exp-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nêu rõ các mốc thành tích, giải pháp kỹ thuật và kết quả mang lại cho đối tác..."
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

          {/* Skills */}
          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="exp-skills"
              style={{
                display: 'block',
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 6,
                color: '#334155',
              }}
            >
              Kỹ năng sử dụng (Phân tách bằng dấu phẩy)
            </label>
            <input
              id="exp-skills"
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="VD: React, TypeScript, Figma, Design System, Node.js"
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

          {/* Action buttons */}
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
              disabled={!title.trim() || !company.trim() || !startDate.trim() || isSubmitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background:
                  title.trim() && company.trim() && startDate.trim() && !isSubmitting
                    ? '#0A66C2'
                    : '#94A3B8',
                color: '#fff',
                cursor:
                  title.trim() && company.trim() && startDate.trim() && !isSubmitting
                    ? 'pointer'
                    : 'not-allowed',
                fontWeight: 700,
                fontSize: 13.5,
                fontFamily: 'inherit',
              }}
            >
              {isSubmitting ? 'Đang lưu...' : experienceToEdit ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function EditExperienceModal({ isOpen, ...props }: EditExperienceModalProps) {
  if (!isOpen) return null
  return <EditExperienceForm key={props.experienceToEdit?.id ?? 'new'} {...props} />
}
