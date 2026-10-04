import * as React from 'react'
import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardTextIcon,
  FolderPlusIcon,
  XIcon,
  ClockIcon,
  UsersIcon,
  CalendarBlankIcon,
  CurrencyDollarIcon,
  SparkleIcon,
} from '@phosphor-icons/react'
import { toast } from '@/components/feedback'
import type { JobExperienceLevel } from '@/features/jobs/types'
import type { CreateProjectFormData } from '../types'
import {
  CY_PERIODS,
  PREDEFINED_PROJECT_FIELDS,
  EXPERIENCE_LEVEL_OPTIONS,
  HOURS_PER_DAY_OPTIONS,
  DURATION_OPTIONS,
  CONTRACT_DURATION_OPTIONS,
} from '../api/project-form-options'

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
  const [startPrice, setStartPrice] = React.useState(initialData?.startPrice ?? '')
  const [period, setPeriod] = React.useState(initialData?.period ?? CY_PERIODS[2]) // Default: Hàng tháng
  const [contractDuration, setContractDuration] = React.useState(
    initialData?.contractDuration ?? CONTRACT_DURATION_OPTIONS[2], // Default: 3 tháng
  )
  const [experienceLevel, setExperienceLevel] = React.useState<JobExperienceLevel>(
    initialData?.experienceLevel ?? 'intermediate',
  )
  const [hoursPerDay, setHoursPerDay] = React.useState<number>(initialData?.hoursPerDay ?? 4)
  const [openPositions, setOpenPositions] = React.useState<number>(initialData?.openPositions ?? 1)
  const [duration, setDuration] = React.useState(initialData?.duration ?? DURATION_OPTIONS[1]) // Default: 1 - 3 tháng
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

  const numericPrice = Number(startPrice.replace(/[^0-9]/g, ''))

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

    if (selectedFields.length === 0) {
      toast.error('Vui lòng chọn hoặc thêm ít nhất một lĩnh vực / kỹ năng')
      return
    }

    if (!startPrice || isNaN(numericPrice) || numericPrice <= 0) {
      toast.error('Vui lòng nhập mức ngân sách hợp lệ (lớn hơn 0 VNĐ)')
      return
    }

    if (bidCloseDate && dueDate && bidCloseDate > dueDate) {
      toast.error('Hạn chót ứng tuyển không được sau ngày hoàn thành dự kiến (Due date)')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        tags: selectedFields,
        startPrice: String(numericPrice),
        period,
        dueDate: dueDate ? dueDate : undefined,
        bidCloseDate: bidCloseDate || undefined,
        contractDuration: period !== 'Cố định' ? contractDuration : undefined,
        isPublic: true,
        experienceLevel,
        hoursPerDay,
        openPositions: Math.max(1, openPositions),
        duration: duration || undefined,
      })
    } catch {
      // Error handled by parent handler
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100%', paddingBottom: 56 }}>
      {/* ── Top Hero Gradient Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0A66C2 0%, #084FA0 100%)',
          padding: '28px 0',
          color: '#fff',
        }}
      >
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px' }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.28)',
              borderRadius: 8,
              padding: '6px 14px',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 14,
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.24)')
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)')
            }
          >
            <ArrowLeftIcon size={14} weight="bold" />
            <span>Quay lại</span>
          </button>
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

            {/* 4. Ngân sách, Chu kỳ & Thời hạn hợp đồng */}
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
                <CurrencyDollarIcon size={18} color="#0A66C2" weight="bold" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                  Ngân sách & Hình thức thanh toán
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
                    Mức ngân sách dự kiến (VNĐ) *
                  </label>
                  <input
                    type="number"
                    value={startPrice}
                    onChange={(e) => setStartPrice(e.target.value)}
                    placeholder="VD: 30000000"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 14,
                      background: '#fff',
                      outline: 'none',
                    }}
                    required
                  />
                  {numericPrice > 0 && (
                    <div style={{ fontSize: 12, color: '#059669', fontWeight: 600, marginTop: 4 }}>
                      ≈ {numericPrice.toLocaleString('vi-VN')} VNĐ
                    </div>
                  )}
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
                    Chu kỳ thanh toán (Hình thức trả lương) *
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 14,
                      background: '#fff',
                      color: '#0F172A',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {CY_PERIODS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thời hạn hợp đồng: Hiển thị với các hình thức trả lương theo chu kỳ (Theo giờ, Hàng tuần, Hàng tháng) */}
              {period !== 'Cố định' ? (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px dashed #CBD5E1' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#1E293B',
                      marginBottom: 4,
                    }}
                  >
                    <ClockIcon size={16} color="#0A66C2" weight="bold" />
                    <span>Thời hạn hợp đồng (Rất cần thiết cho các job freelance)</span>
                    <span style={{ color: '#0A66C2', fontSize: 12, fontWeight: 600 }}>*</span>
                  </label>
                  <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 10px' }}>
                    Xác định khoảng thời gian hợp tác dự kiến giữa doanh nghiệp và freelancer theo
                    chu kỳ đã chọn ({period.toLowerCase()}).
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {CONTRACT_DURATION_OPTIONS.map((d) => {
                      const isSelected = contractDuration === d
                      return (
                        <button
                          type="button"
                          key={d}
                          onClick={() => setContractDuration(d)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 8,
                            border: `1.5px solid ${isSelected ? '#0A66C2' : '#CBD5E1'}`,
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
                          <span>{d}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: 14,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    fontSize: 12.5,
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <SparkleIcon size={16} color="#64748B" weight="fill" />
                  <span>
                    <strong>Dự án trả lương trọn gói (Cố định):</strong> Không cần thời hạn hợp
                    đồng. Thù lao sẽ được nghiệm thu và giải ngân theo kết quả bàn giao sản phẩm.
                  </span>
                </div>
              )}
            </div>

            {/* 5. Cấp độ kinh nghiệm, Thời gian làm việc, Số lượng tuyển (Khớp 100% Home Page) */}
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
                  Yêu cầu ứng viên & Thời gian làm việc (Hiển thị trên thẻ việc Home Page)
                </span>
              </div>

              {/* Cấp độ kinh nghiệm */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#334155',
                    marginBottom: 8,
                  }}
                >
                  Cấp độ kinh nghiệm yêu cầu:
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

              {/* Thời gian làm việc mỗi ngày & Số lượng tuyển */}
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
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: 6,
                    }}
                  >
                    <ClockIcon size={15} color="#0A66C2" />
                    <span>Thời gian làm việc yêu cầu mỗi ngày</span>
                  </label>
                  <select
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                      background: '#fff',
                      color: '#0F172A',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {HOURS_PER_DAY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.badge})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#334155',
                      marginBottom: 6,
                    }}
                  >
                    <UsersIcon size={15} color="#0A66C2" />
                    <span>Số lượng nhân sự cần tuyển</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={openPositions}
                    onChange={(e) => setOpenPositions(Math.max(1, Number(e.target.value)))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                      background: '#fff',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 6. Kế hoạch thời hạn & Hạn chót ứng tuyển */}
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
                  Kế hoạch thời hạn & Hạn nộp hồ sơ
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
                    Thời hạn dự án ước tính (Tùy chọn)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid #CBD5E1',
                      fontSize: 13.5,
                      background: '#fff',
                      color: '#0F172A',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="">Linh hoạt / Chưa xác định</option>
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
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
                    Ngày hoàn thành dự kiến (Tùy chọn)
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
                    Hạn chót ứng tuyển
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
