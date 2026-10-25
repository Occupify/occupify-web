import * as React from 'react'
import {
  CheckIcon,
  ClipboardTextIcon,
  FolderPlusIcon,
  XIcon,
  CalendarBlankIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { toast } from '@/components/feedback'
import type { JobExperienceLevel } from '@/features/jobs/types'
import type { CreateProjectFormData } from '../types'
import { PREDEFINED_PROJECT_FIELDS, EXPERIENCE_LEVEL_OPTIONS } from '../api/project-form-options'

export interface CreateProjectPageProps {
  onBack: () => void
  onSubmit: (data: CreateProjectFormData) => void | Promise<void>
  initialData?: Partial<CreateProjectFormData>
}

export function CreateProjectPage({ onBack, onSubmit, initialData }: CreateProjectPageProps) {
  const [name, setName] = React.useState(initialData?.name ?? '')
  const [description, setDescription] = React.useState(initialData?.description ?? '')
  const [selectedFields, setSelectedFields] = React.useState<string[]>(
    initialData?.tags ?? [PREDEFINED_PROJECT_FIELDS[0]],
  )
  const [customTagInput, setCustomTagInput] = React.useState('')
  const [experienceLevel, setExperienceLevel] = React.useState<JobExperienceLevel>(
    initialData?.experienceLevel ?? 'intermediate',
  )
  const [dueDate, setDueDate] = React.useState(initialData?.dueDate ?? '')
  const [bidCloseDate, setBidCloseDate] = React.useState(initialData?.bidCloseDate ?? '')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Vui lòng nhập tên dự án hoặc vị trí cần tuyển')
      return
    }

    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả chi tiết công việc')
      return
    }

    if (bidCloseDate && dueDate && bidCloseDate > dueDate) {
      toast.error('Hạn chót ứng tuyển không được sau ngày hoàn thành dự kiến')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        dueDate: dueDate ? dueDate : undefined,
        bidCloseDate: bidCloseDate ? bidCloseDate : undefined,
        experienceLevel,
        tags: selectedFields.length > 0 ? selectedFields : undefined,
      })
    } catch {
      // Error handled by parent handler
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ background: 'var(--bg-base, #F4F2EE)', minHeight: '100%', paddingBottom: 56 }}>
      {/* ── Top Hero Gradient Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A66C2 0%, #084FA0 100%)',
          padding: '28px 0',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px' }}>
          <h1
            style={{
              color: '#fff',
              fontWeight: 800,
              fontSize: 26,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Tạo dự án mới
          </h1>
          <p
            style={{ color: 'rgba(255,255,255,0.88)', marginTop: 6, fontSize: 14, lineHeight: 1.5 }}
          >
            Điền thông tin chi tiết để đăng tải dự án và kết nối nhanh chóng với freelancer tài
            năng.
          </p>
        </div>
      </div>

      {/* ── Main Form Container ── */}
      <div style={{ maxWidth: 880, margin: '24px auto 0', padding: '0 20px' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #E2E8F0',
            boxShadow:
              '0 4px 16px -2px rgba(15, 23, 42, 0.05), 0 2px 4px -1px rgba(15, 23, 42, 0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: '#EFF6FF',
                color: '#0A66C2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FolderPlusIcon size={24} weight="bold" />
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                Thông tin dự án tuyển dụng
              </h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>
                Các thông tin dưới đây sẽ hiển thị trực tiếp trên thẻ dự án tại Bảng tin trang chủ
              </p>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* 1. Tên dự án */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: '#1E293B',
                  marginBottom: 6,
                }}
              >
                <span>Tên dự án / Vị trí cần tuyển</span>
                <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Senior UI/UX Designer – Thiết kế lại giao diện Mobile App Fintech"
                className="pro-input"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: 14,
                  outline: 'none',
                }}
                required
              />
              <span style={{ fontSize: 12, color: '#64748B', marginTop: 4, display: 'block' }}>
                Tên ngắn gọn, rõ ràng giúp tăng 40% tỷ lệ ứng viên phù hợp click xem chi tiết
              </span>
            </div>

            {/* 2. Mô tả chi tiết */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: '#1E293B',
                  marginBottom: 6,
                }}
              >
                <span>Mô tả chi tiết công việc</span>
                <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả mục tiêu dự án, trách nhiệm chính, các kỹ năng cần thiết và sản phẩm bàn giao kỳ vọng..."
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                }}
                required
              />
            </div>

            {/* 3. Lĩnh vực dự án & Kỹ năng yêu cầu */}
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: '#1E293B',
                  }}
                >
                  <span>Lĩnh vực & Kỹ năng yêu cầu</span>
                  <span style={{ color: '#EF4444' }}>*</span>
                  {selectedFields.length > 0 && (
                    <span
                      style={{
                        background: '#EFF6FF',
                        color: '#0A66C2',
                        fontSize: 11.5,
                        fontWeight: 700,
                        padding: '1px 8px',
                        borderRadius: 9999,
                        border: '1px solid #BFDBFE',
                      }}
                    >
                      {selectedFields.length} đã chọn
                    </span>
                  )}
                </label>
              </div>
              <p style={{ fontSize: 12.5, color: '#64748B', margin: '0 0 10px' }}>
                Chọn các lĩnh vực chuyên môn phù hợp để hệ thống hiển thị tags trên trang chủ và gợi
                ý ứng viên chính xác:
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {PREDEFINED_PROJECT_FIELDS.map((field) => {
                  const isSelected = selectedFields.includes(field)
                  return (
                    <button
                      type="button"
                      key={field}
                      onClick={() => toggleField(field)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 9999,
                        border: `1.5px solid ${isSelected ? '#0A66C2' : '#CBD5E1'}`,
                        background: isSelected ? '#EFF6FF' : '#fff',
                        color: isSelected ? '#0A66C2' : '#475569',
                        fontSize: 12.5,
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 120ms ease',
                      }}
                    >
                      {isSelected && <CheckIcon size={13} weight="bold" />}
                      <span>{field}</span>
                    </button>
                  )
                })}

                {/* Custom tags */}
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
                        border: '1.5px solid #0A66C2',
                        background: '#EFF6FF',
                        color: '#0A66C2',
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <CheckIcon size={13} weight="bold" />
                      <span>{f}</span>
                      <XIcon size={12} weight="bold" />
                    </button>
                  ))}
              </div>

              {/* Add custom tag input */}
              <div style={{ display: 'flex', gap: 8, maxWidth: 380 }}>
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
                  placeholder="Thêm kỹ năng khác (VD: Figma, Next.js)..."
                  style={{
                    flex: 1,
                    padding: '7px 12px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  style={{
                    background: '#0A66C2',
                    border: 'none',
                    borderRadius: 6,
                    padding: '7px 16px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: '#fff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Thêm
                </button>
              </div>
            </div>

            {/* 4. Cấp độ kinh nghiệm yêu cầu */}
            <div
              style={{
                marginBottom: 24,
                padding: '16px',
                borderRadius: 10,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <SparkleIcon size={18} color="#0A66C2" weight="bold" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Yêu cầu cấp độ kinh nghiệm
                </span>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: 8,
                  }}
                >
                  Cấp độ kinh nghiệm phù hợp:
                </label>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 10,
                  }}
                >
                  {EXPERIENCE_LEVEL_OPTIONS.map((opt) => {
                    const isSelected = experienceLevel === opt.value
                    return (
                      <div
                        key={opt.value}
                        onClick={() => setExperienceLevel(opt.value)}
                        style={{
                          border: `1.5px solid ${isSelected ? '#0A66C2' : '#CBD5E1'}`,
                          borderRadius: 8,
                          padding: '10px 12px',
                          background: isSelected ? '#EFF6FF' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 2,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: isSelected ? '#0A66C2' : '#0F172A',
                            }}
                          >
                            {opt.label}
                          </span>
                          {isSelected && <CheckIcon size={14} weight="bold" color="#0A66C2" />}
                        </div>
                        <p style={{ fontSize: 11.5, color: '#64748B', margin: 0, lineHeight: 1.4 }}>
                          {opt.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 6. Thời gian dự án & Hạn chót ứng tuyển */}
            <div
              style={{
                marginBottom: 24,
                padding: '16px',
                borderRadius: 10,
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CalendarBlankIcon size={18} color="#0A66C2" weight="bold" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Thời gian hoàn thành dự án & Hạn chót ứng tuyển
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 16,
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: 6,
                    }}
                  >
                    Thời gian hoàn thành dự án (Tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                      background: '#fff',
                      color: '#0F172A',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: 6,
                    }}
                  >
                    Hạn chót ứng tuyển (Tùy chọn)
                  </label>
                  <input
                    type="date"
                    value={bidCloseDate}
                    onChange={(e) => setBidCloseDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                      background: '#fff',
                      color: '#0F172A',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 7. Footer Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
                paddingTop: 20,
                borderTop: '1px solid #E2E8F0',
              }}
            >
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  borderRadius: 8,
                  padding: '10px 22px',
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#475569',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#F1F5F9'
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting)
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  background: isSubmitting ? '#94A3B8' : '#0A66C2',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 28px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#fff',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 6px rgba(10, 102, 194, 0.28)',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#084FA0'
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#0A66C2'
                }}
              >
                <ClipboardTextIcon size={16} weight="fill" />
                <span>{isSubmitting ? 'Đang đăng tải...' : 'Đăng dự án ngay'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
