import { WarningIcon, XIcon } from '@phosphor-icons/react'
import type { AdminViolation } from '../../types'

interface ViolationActionModalProps {
  violation: AdminViolation | null
  action: string
  onActionChange: (action: string) => void
  reason: string
  onReasonChange: (reason: string) => void
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

const ACCOUNT_ACTIONS = [
  {
    id: 'Khóa tài khoản vĩnh viễn',
    label: 'Khóa tài khoản vĩnh viễn',
    desc: 'Chuyển trạng thái tài khoản sang "Bị khóa", thu hồi quyền đăng nhập ngay lập tức.',
    recommended: true,
  },
  {
    id: 'Xóa tài khoản khỏi nền tảng',
    label: 'Xóa tài khoản khỏi nền tảng',
    desc: 'Xóa vĩnh viễn hồ sơ người dùng khỏi nền tảng Occupify.',
    recommended: false,
  },
]

const PROJECT_ACTIONS = [
  {
    id: 'Đóng dự án vi phạm',
    label: 'Đóng dự án vi phạm',
    desc: 'Chuyển trạng thái dự án sang "Đã đóng" và đóng toàn bộ vị trí tuyển dụng liên quan.',
    recommended: true,
  },
]

export function ViolationActionModal({
  violation,
  action,
  onActionChange,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ViolationActionModalProps) {
  if (!violation) return null

  const isAccount = violation.category === 'Tài khoản'
  const options = isAccount ? ACCOUNT_ACTIONS : PROJECT_ACTIONS
  const isReasonValid = reason.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCE8E6]">
              <WarningIcon size={18} className="text-[#C03A2B]" weight="fill" />
            </span>
            <div>
              <h3 className="text-base font-bold text-black/90">Xác nhận xử lý vi phạm</h3>
              <span className="font-mono text-[11px] font-bold text-black/45">{violation.id}</span>
            </div>
          </div>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black/80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 text-xs text-black/80">
          {/* Target Info Summary */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-black/50">Đối tượng bị xử lý:</span>
              <span className="rounded bg-[#EAF1FA] px-2 py-0.5 text-[10px] font-bold text-[#0A66C2]">
                {violation.category}
              </span>
            </div>
            <div className="mt-1 text-sm font-bold text-black/90">{violation.target}</div>
            <p className="mt-1 text-[11px] leading-relaxed text-black/60 italic">
              Lý do báo cáo: "{violation.reason}"
            </p>
          </div>

          {/* Sanction Options */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-black/60">
              1. Chọn biện pháp áp dụng:
            </label>
            <div className="flex flex-col gap-2">
              {options.map((opt) => {
                const isSelected = action === opt.id
                return (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                      isSelected
                        ? 'border-[#C03A2B] bg-[#FCE8E6]/25 ring-1 ring-[#C03A2B]'
                        : 'border-black/10 bg-white hover:bg-[#FAFAF8]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="violation-sanction"
                      value={opt.id}
                      checked={isSelected}
                      disabled={isSubmitting}
                      onChange={() => onActionChange(opt.id)}
                      className="mt-0.5 text-[#C03A2B] focus:ring-[#C03A2B]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-black/90">{opt.label}</span>
                        {opt.recommended && (
                          <span className="rounded bg-[#C03A2B]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#C03A2B]">
                            Khuyến nghị
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-black/60">{opt.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Reason / Note Textarea */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-black/60">
              2. Nội dung phản hồi & Căn cứ xử lý <span className="text-[#C03A2B]">*</span>:
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              maxLength={1000}
              disabled={isSubmitting}
              placeholder="Nhập lý do áp dụng chế tài, căn cứ điều khoản quy định của nền tảng..."
              rows={3}
              className="w-full resize-none rounded-lg border border-black/15 bg-white p-2.5 text-xs text-black/90 outline-none transition-colors focus:border-[#C03A2B] focus:ring-1 focus:ring-[#C03A2B] disabled:bg-black/5"
            />
            <div className="mt-1 text-right text-[10.5px] text-black/40">{reason.length}/1000</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-black/8 px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={!isReasonValid || isSubmitting}
            onClick={onConfirm}
            className="rounded-full bg-[#C03A2B] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận áp dụng chế tài'}
          </button>
        </div>
      </div>
    </div>
  )
}
