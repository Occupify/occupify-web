import { useState } from 'react'
import { ArrowLeft, Check, ClipboardText, FolderPlus, X } from '@phosphor-icons/react'
import { CY_PERIODS, PREDEFINED_PROJECT_FIELDS } from '@/features/mock-data'

export interface CreateProjectFormData {
  name: string
  description: string
  tags: string[]
  startPrice: string
  period: string
  dueDate: string
  bidCloseDate: string
  isPublic: boolean
}

interface CreateProjectPageProps {
  onBack: () => void
  onSubmit: (data: CreateProjectFormData) => void
}

export function CreateProjectPage({ onBack, onSubmit }: CreateProjectPageProps) {
  const [rTitle, setRTitle] = useState('')
  const [rDesc, setRDesc] = useState('')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')
  const [rStartPrice, setRStartPrice] = useState('')
  const [rPeriod, setRPeriod] = useState(CY_PERIODS[1])
  const [rDueDate, setRDueDate] = useState('')
  const [rBidClose, setRBidClose] = useState('')
  const [rPublish, setRPublish] = useState<'co' | 'khong'>('co')

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

  const canSubmit = rTitle.trim().length > 0 && rDesc.trim().length > 0

  return (
    <div className="min-h-full pb-14 !bg-[var(--bg-base)]">
      {/* Top Banner */}
      <div className="py-8 !bg-gradient-to-r from-[var(--color-primary-500)] to-[#084FA0] !text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-3 flex cursor-pointer items-center gap-1.5 text-xs font-semibold !text-white/80 transition-colors hover:!text-white"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-2xl font-extrabold sm:text-3xl !text-white">Tạo dự án mới</h1>
          <p className="mt-1.5 text-sm !text-white/80">
            Điền thông tin để tạo dự án và tìm kiếm freelancer phù hợp
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="mx-auto max-w-3xl px-4 pt-8">
        <div className="overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-sm">
          {/* Card Header */}
          <div className="flex items-center gap-3 border-b p-5 sm:px-6 !border-[var(--border-subtle)]">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
              <FolderPlus size={22} weight="bold" />
            </div>
            <div>
              <h2 className="text-lg font-bold !text-[var(--text-primary)]">Tạo dự án mới</h2>
              <p className="text-xs !text-[var(--text-secondary)]">
                Đăng dự án để tìm freelancer phù hợp
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="divide-y !divide-[var(--border-subtle)]">
            {/* Tên dự án */}
            <div className="p-5 sm:px-6">
              <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                Tên dự án *
              </label>
              <input
                type="text"
                value={rTitle}
                onChange={(e) => setRTitle(e.target.value)}
                placeholder="VD: Xây dựng hệ thống quản lý kho hàng"
                className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none transition-colors focus:!border-[var(--color-primary-500)]"
              />
            </div>

            {/* Mô tả */}
            <div className="p-5 sm:px-6">
              <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                Mô tả *
              </label>
              <textarea
                value={rDesc}
                onChange={(e) => setRDesc(e.target.value)}
                placeholder="Mô tả chi tiết dự án, kỹ năng yêu cầu và kết quả kỳ vọng..."
                className="min-h-[120px] w-full resize-y rounded border p-2.5 text-sm leading-relaxed !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none transition-colors focus:!border-[var(--color-primary-500)]"
              />
            </div>

            {/* Lĩnh vực dự án */}
            <div className="p-5 sm:px-6">
              <div className="mb-1 flex items-center gap-1.5">
                <label className="text-xs font-bold !text-[var(--text-secondary)]">
                  Lĩnh vực dự án
                </label>
                {selectedFields.length > 0 && (
                  <span className="text-xs font-bold !text-[var(--color-primary-500)]">
                    ({selectedFields.length} đã chọn)
                  </span>
                )}
              </div>
              <p className="mb-3 text-xs !text-[var(--text-tertiary)]">
                Chọn các lĩnh vực chuyên môn phù hợp với dự án (không giới hạn):
              </p>

              <div className="mb-3 flex flex-wrap gap-2">
                {PREDEFINED_PROJECT_FIELDS.map((field) => {
                  const isSelected = selectedFields.includes(field)
                  return (
                    <button
                      type="button"
                      key={field}
                      onClick={() => toggleField(field)}
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isSelected
                          ? '!border-[var(--color-primary-500)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)] font-bold'
                          : '!border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]'
                      }`}
                    >
                      {isSelected && <Check size={13} weight="bold" />}
                      <span>{field}</span>
                    </button>
                  )
                })}

                {/* Custom tags added by user */}
                {selectedFields
                  .filter((f) => !PREDEFINED_PROJECT_FIELDS.includes(f))
                  .map((f) => (
                    <button
                      type="button"
                      key={f}
                      onClick={() => toggleField(f)}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold !border-[var(--color-primary-500)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]"
                    >
                      <Check size={13} weight="bold" />
                      <span>{f}</span>
                      <X size={12} weight="bold" />
                    </button>
                  ))}
              </div>

              {/* Add custom tag */}
              <div className="flex max-w-sm gap-2">
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
                  placeholder="Thêm lĩnh vực khác..."
                  className="w-full rounded border px-3 py-1.5 text-xs !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="cursor-pointer whitespace-nowrap rounded px-4 py-1.5 text-xs font-semibold !text-white !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
                >
                  + Thêm
                </button>
              </div>
            </div>

            {/* Budget & Period */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:px-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Giá khởi điểm (VNĐ)
                </label>
                <input
                  type="number"
                  value={rStartPrice}
                  onChange={(e) => setRStartPrice(e.target.value)}
                  placeholder="VD: 10000000"
                  className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Chu kỳ
                </label>
                <select
                  value={rPeriod}
                  onChange={(e) => setRPeriod(e.target.value)}
                  className="w-full cursor-pointer rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                >
                  {CY_PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Bid Closing */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:px-6">
              <div>
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Due date
                </label>
                <input
                  type="date"
                  value={rDueDate}
                  onChange={(e) => setRDueDate(e.target.value)}
                  className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                  Hạn đóng chào mời
                </label>
                <input
                  type="date"
                  value={rBidClose}
                  onChange={(e) => setRBidClose(e.target.value)}
                  className="w-full rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
                />
              </div>
            </div>

            {/* Publish Settings */}
            <div className="p-5 sm:px-6">
              <label className="mb-1 block text-xs font-bold !text-[var(--text-secondary)]">
                Đăng tải tuyển dụng
              </label>
              <p className="mb-2.5 text-xs !text-[var(--text-tertiary)]">
                Dự án sẽ được hiển thị công khai để freelancer có thể đề xuất hợp tác.
              </p>
              <div className="flex gap-2.5">
                {(['co', 'khong'] as const).map((v) => {
                  const active = rPublish === v
                  return (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setRPublish(v)}
                      className={`cursor-pointer rounded-full border px-6 py-1.5 text-xs font-bold transition-colors ${
                        active
                          ? '!border-[var(--color-primary-500)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]'
                          : '!border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]'
                      }`}
                    >
                      {v === 'co' ? 'Có' : 'Không'}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 p-5 sm:px-6 !bg-[var(--bg-subtle)]">
              <button
                type="button"
                onClick={onBack}
                className="cursor-pointer rounded-full border px-5 py-2 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] transition-colors hover:!bg-[var(--bg-base)]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  if (canSubmit) {
                    onSubmit({
                      name: rTitle.trim(),
                      description: rDesc.trim(),
                      tags: selectedFields,
                      startPrice: rStartPrice.trim(),
                      period: rPeriod,
                      dueDate: rDueDate || '2026-12-31',
                      bidCloseDate: rBidClose,
                      isPublic: rPublish === 'co',
                    })
                  }
                }}
                disabled={!canSubmit}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-6 py-2 text-xs font-bold !text-white transition-colors !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)] disabled:cursor-not-allowed disabled:!bg-[rgba(0,0,0,0.12)] disabled:!text-[rgba(0,0,0,0.35)]"
              >
                <ClipboardText size={15} weight="fill" />
                <span>Đăng dự án</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
