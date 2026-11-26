import { WarningIcon } from '@phosphor-icons/react'
import type { AdminProject } from '../../types'

interface ProjectDeleteModalProps {
  project: AdminProject | null
  reason: string
  onReasonChange: (reason: string) => void
  onClose: () => void
  onConfirm: () => void
  isSubmitting?: boolean
}

export function ProjectDeleteModal({
  project,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  isSubmitting = false,
}: ProjectDeleteModalProps) {
  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div className="w-full max-w-[448px] rounded-xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FCE8E6]">
            <WarningIcon size={22} className="text-[#C03A2B]" weight="fill" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-black/90">Xác nhận đóng dự án</h3>
            <p className="mt-1 text-xs leading-relaxed text-black/60">
              Bạn đang đóng dự án{' '}
              <strong className="font-bold text-black/90">"{project.title}"</strong>. Trạng thái dự
              án và các vị trí tuyển dụng liên quan sẽ chuyển sang Đã đóng.
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-xs font-semibold text-black/80">
            Lý do đóng dự án <span className="font-normal text-black/45">(không bắt buộc)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            maxLength={1000}
            disabled={isSubmitting}
            placeholder="Nhập lý do cụ thể..."
            rows={3}
            className="w-full resize-none rounded-lg border border-black/15 bg-white p-2.5 text-xs text-black/90 outline-none transition-colors focus:border-[#0A66C2] focus:ring-1 focus:ring-[#0A66C2] disabled:bg-black/5"
          />
          <div className="mt-1 text-right text-[10.5px] text-black/40">{reason.length}/1000</div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="rounded-full bg-[#C03A2B] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đóng'}
          </button>
        </div>
      </div>
    </div>
  )
}
