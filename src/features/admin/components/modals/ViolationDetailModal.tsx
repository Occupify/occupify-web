import { CheckCircleIcon, XIcon } from '@phosphor-icons/react'
import type { AdminViolation } from '../../types'

interface ViolationDetailModalProps {
  violation: AdminViolation | null
  onClose: () => void
  onReject: (id: string) => void
  onResolveClick: (violation: AdminViolation) => void
}

export function ViolationDetailModal({
  violation,
  onClose,
  onReject,
  onResolveClick,
}: ViolationDetailModalProps) {
  if (!violation) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex w-full max-w-[560px] max-h-[90vh] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/8 px-6 py-4">
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
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-6 text-xs">
          {/* Status banner if already processed */}
          {violation.status === 'Đã giải quyết' && (
            <div className="rounded-lg border border-[#137333]/30 bg-[#E6F4EA] p-3.5 text-[#137333]">
              <div className="flex items-center gap-2">
                <CheckCircleIcon size={16} weight="fill" />
                <span className="font-bold text-xs uppercase tracking-wide">
                  Đã giải quyết vi phạm
                </span>
              </div>
              <div className="mt-2 text-xs">
                <div>
                  <span className="font-bold">Biện pháp đã áp dụng:</span>{' '}
                  <span className="font-semibold text-black/85">
                    {violation.actionTaken ?? 'Khóa tài khoản vĩnh viễn'}
                  </span>
                </div>
                {violation.resolveNote && (
                  <div className="mt-1 text-black/75">
                    <span className="font-bold text-black/85">Căn cứ xử lý:</span>{' '}
                    {violation.resolveNote}
                  </div>
                )}
                {violation.resolvedAt && (
                  <div className="mt-1 text-[11px] text-black/50">
                    Thời điểm giải quyết: {violation.resolvedAt}
                  </div>
                )}
              </div>
            </div>
          )}

          {violation.status === 'Đã bác bỏ' && (
            <div className="rounded-lg border border-black/10 bg-[#FAFAF8] p-3.5 text-black/60">
              <span className="font-bold text-xs">
                Báo cáo đã bị bác bỏ do không đủ căn cứ vi phạm.
              </span>
            </div>
          )}

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
            <span className="font-bold text-[11.5px] uppercase tracking-wide">Lý do báo cáo:</span>
            <p className="mt-1 leading-relaxed">{violation.reason}</p>
          </div>

          {/* Content box */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-3.5">
            <span className="font-bold text-[11.5px] text-black/70 uppercase tracking-wide">
              Nội dung:
            </span>
            <p className="mt-1 leading-relaxed text-black/75 whitespace-pre-line">
              {violation.evidence}
            </p>
          </div>

          {/* Evidence Image Section */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-3.5">
            <span className="font-bold text-[11.5px] text-black/70 uppercase tracking-wide">
              Bằng chứng đính kèm:
            </span>
            {violation.evidenceImage ? (
              <div className="mt-2.5 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
                <img
                  src={violation.evidenceImage}
                  alt="Bằng chứng đính kèm"
                  className="max-h-60 w-full rounded-md bg-[#F4F4F2] object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <p className="mt-1.5 text-[11.5px] italic text-black/45">
                Không có hình ảnh đính kèm
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-black/8 px-6 py-4">
          {violation.status === 'Chờ xử lý' ? (
            <>
              <button
                type="button"
                onClick={() => onReject(violation.id)}
                className="rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5"
              >
                Bác bỏ báo cáo
              </button>
              <button
                type="button"
                onClick={() => onResolveClick(violation)}
                className="rounded-full bg-[#C03A2B] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
              >
                Xử lý vi phạm
              </button>
            </>
          ) : (
            <div className="flex w-full justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-black/15 bg-white px-6 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
