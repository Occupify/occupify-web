import { XIcon } from '@phosphor-icons/react'
import type { AdminViolation } from '../../types'

interface ViolationDetailModalProps {
  violation: AdminViolation | null
  onClose: () => void
  onReject: (id: string) => void
  onResolve: (id: string) => void
}

export function ViolationDetailModal({
  violation,
  onClose,
  onReject,
  onResolve,
}: ViolationDetailModalProps) {
  if (!violation) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[560px] overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <h2 className="text-base font-bold text-black/90">Chi tiết báo cáo vi phạm</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black/80"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-6 text-xs">
          {/* Reporter info */}
          <div className="flex items-center justify-between rounded-lg bg-[#FAFAF8] p-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white"
                style={{ backgroundColor: violation.reporter.color }}
              >
                {violation.reporter.initials}
              </div>
              <div>
                <span className="text-[11px] text-black/45">Người báo cáo:</span>
                <div className="font-bold text-black/90">{violation.reporter.name}</div>
              </div>
            </div>
            <div className="text-right">
              <span className="rounded bg-black/5 px-2 py-0.5 font-mono text-[11px] font-bold text-black/70">
                {violation.id}
              </span>
              <div className="mt-1 text-[11px] text-black/45">{violation.time}</div>
            </div>
          </div>

          {/* Target */}
          <div className="rounded-lg border border-black/8 p-3">
            <span className="text-[11px] font-medium text-black/50">Đối tượng bị báo cáo:</span>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-bold text-black/90">{violation.target}</span>
              <span className="rounded-full bg-[#EAF1FA] px-2.5 py-0.5 text-[11px] font-bold text-[#0A66C2]">
                {violation.category}
              </span>
            </div>
          </div>

          {/* Reason highlight */}
          <div className="rounded-lg border border-[#F2C94C]/40 bg-[#FFF4D6] p-3.5 text-[#915907]">
            <span className="font-bold text-[11.5px] uppercase tracking-wide">
              Lý do báo cáo:
            </span>
            <p className="mt-1 leading-relaxed">{violation.reason}</p>
          </div>

          {/* Evidence box */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-3.5">
            <span className="font-bold text-[11.5px] text-black/70 uppercase tracking-wide">
              Nội dung bằng chứng đính kèm:
            </span>
            <p className="mt-1 leading-relaxed text-black/75 whitespace-pre-line">
              {violation.evidence}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/8 px-6 py-4">
          <button
            type="button"
            onClick={() => onReject(violation.id)}
            className="rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5"
          >
            Bác bỏ báo cáo
          </button>
          <button
            type="button"
            onClick={() => onResolve(violation.id)}
            className="rounded-full bg-[#C03A2B] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            Xử lý vi phạm
          </button>
        </div>
      </div>
    </div>
  )
}
