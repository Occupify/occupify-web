import * as React from 'react'
import { ArrowLeftIcon, FolderPlusIcon, CheckIcon, XIcon } from '@phosphor-icons/react'

export interface CreateProjectPageProps {
  onBack: () => void
  onSubmit: (projectData?: { title: string; description: string; fields: string[] }) => void
}

const PREDEFINED_PROJECT_FIELDS = [
  'UI/UX Design',
  'Frontend Development',
  'Backend Development',
  'Mobile App (React Native/Flutter)',
  'Design System',
  'Graphic Design & Branding',
  'Content & Copywriting',
  'SEO & Digital Marketing',
]

export function CreateProjectPage({ onBack, onSubmit }: CreateProjectPageProps) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [selectedFields, setSelectedFields] = React.useState<string[]>([])
  const [customTagInput, setCustomTagInput] = React.useState('')
  const [budget, setBudget] = React.useState('')

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    )
  }

  const addCustomTag = () => {
    const trimmed = customTagInput.trim()
    if (trimmed && !selectedFields.includes(trimmed)) {
      setSelectedFields((prev) => [...prev, trimmed])
      setCustomTagInput('')
    }
  }

  const canSubmit = title.trim().length > 0 && description.trim().length > 0

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      fields: selectedFields,
    })
  }

  return (
    <div style={{ background: '#F4F2EE', minHeight: '100%', paddingBottom: 48 }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A66C2 0%, #084FA0 100%)',
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
          <h1 style={{ color: '#fff', fontWeight: 800, fontSize: 26, margin: 0 }}>Tạo dự án mới</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginTop: 6, fontSize: 14.5 }}>
            Điền thông tin để đăng tải dự án và tìm kiếm freelancer tài năng phù hợp.
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
                background: '#EFF6FF',
                color: '#0A66C2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FolderPlusIcon size={22} weight="bold" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Thông tin dự án tuyển dụng
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                Cung cấp mô tả rõ ràng để thu hút ứng viên chất lượng cao
              </p>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Tên dự án */}
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
                Tên dự án / Vị trí cần tuyển *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Senior UI/UX Designer – Thiết kế lại giao diện Mobile App"
                className="pro-input"
                required
              />
            </div>

            {/* Mô tả */}
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
                Mô tả chi tiết công việc *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nêu rõ mục tiêu dự án, trách nhiệm chính, các kỹ năng cần thiết và sản phẩm bàn giao..."
                className="pro-input"
                rows={5}
                style={{ resize: 'vertical', lineHeight: 1.6 }}
                required
              />
            </div>

            {/* Lĩnh vực dự án */}
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
                Lĩnh vực chuyên môn ({selectedFields.length} đã chọn)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {PREDEFINED_PROJECT_FIELDS.map((f) => {
                  const isSelected = selectedFields.includes(f)
                  return (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleField(f)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 9999,
                        border: `1px solid ${isSelected ? '#0A66C2' : '#CBD5E1'}`,
                        background: isSelected ? '#EFF6FF' : '#fff',
                        color: isSelected ? '#0A66C2' : '#475569',
                        fontSize: 12.5,
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        transition: 'all 120ms ease',
                      }}
                    >
                      {isSelected && <CheckIcon size={13} weight="bold" />}
                      <span>{f}</span>
                    </button>
                  )
                })}

                {selectedFields
                  .filter((f) => !PREDEFINED_PROJECT_FIELDS.includes(f))
                  .map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleField(f)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 9999,
                        border: '1px solid #0A66C2',
                        background: '#EFF6FF',
                        color: '#0A66C2',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <CheckIcon size={13} weight="bold" />
                      <span>{f}</span>
                      <XIcon size={12} />
                    </button>
                  ))}
              </div>

              {/* Add custom tag */}
              <div style={{ display: 'flex', gap: 8, maxWidth: 360 }}>
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomTag()
                    }
                  }}
                  placeholder="Thêm kỹ năng khác..."
                  className="pro-input"
                  style={{ padding: '6px 10px', fontSize: 13 }}
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  style={{
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    borderRadius: 6,
                    padding: '6px 14px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Thêm
                </button>
              </div>
            </div>

            {/* Ngân sách dự kiến */}
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
                Ngân sách dự kiến (VND)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="VD: 30000000"
                className="pro-input"
                style={{ maxWidth: 300 }}
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
                  background: canSubmit ? '#0A66C2' : '#94A3B8',
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
                Đăng dự án ngay
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
