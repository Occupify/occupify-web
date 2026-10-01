import { useEffect, useRef, useState } from 'react'

interface CancelModalProps {
  title: string
  subtitle: string
  onClose: () => void
  onConfirm: (reason: string) => void
}

export function CancelModal({ title, subtitle, onClose, onConfirm }: CancelModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const [reason, setReason] = useState('')
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[480px] rounded-xl p-7 shadow-2xl !bg-[var(--bg-elevated)]">
        <h3 className="mb-1 text-lg font-extrabold !text-[var(--text-primary)]">{title}</h3>
        <p className="mb-5 text-xs !text-[var(--text-secondary)]">{subtitle}</p>

        <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
          Lý do *
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Nhập lý do chi tiết..."
          className="mb-4 min-h-[96px] w-full resize-y rounded border p-2.5 text-sm !bg-[var(--bg-elevated)] !text-[var(--text-primary)] !border-[var(--border-default)] outline-none focus:!border-[var(--color-primary-500)]"
        />

        <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
          Upload ảnh / tài liệu liên quan (tuỳ chọn)
        </label>
        <div className="mb-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
          >
            Chọn ảnh từ thiết bị
          </button>
          <span className="truncate text-xs !text-[var(--text-secondary)]">
            {fileName || 'Chưa chọn tệp'}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
          />
        </div>

        <div className="flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => {
              if (reason.trim()) onConfirm(reason.trim())
            }}
            disabled={!reason.trim()}
            className="cursor-pointer rounded-full px-6 py-2 text-sm font-bold !text-white transition-colors !bg-[#C03A2B] hover:!bg-[#A02C1F] disabled:cursor-not-allowed disabled:!bg-[rgba(0,0,0,0.12)] disabled:!text-[rgba(0,0,0,0.35)]"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  )
}
