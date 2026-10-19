import { XIcon } from '@phosphor-icons/react'
import type { AdminContract } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ContractDetailModalProps {
  contract: AdminContract | null
  onClose: () => void
}

export function ContractDetailModal({
  contract,
  onClose,
}: ContractDetailModalProps) {
  if (!contract) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-[580px] overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#EAF1FA] px-2 py-0.5 font-mono text-xs font-bold text-[#0A66C2]">
              {contract.id}
            </span>
            <h2 className="text-base font-bold text-black/90 truncate max-w-[380px]">
              {contract.project}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black/80"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* 2x2 Grid + Additional details */}
        <div className="p-6 text-xs">
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#FAFAF8] p-4">
            <div>
              <span className="text-[11px] font-medium text-black/50">Bên thuê (Client)</span>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: contract.client.color }}
                >
                  {contract.client.initials}
                </div>
                <span className="font-bold text-black/85">{contract.client.name}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-black/50">Freelancer</span>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: contract.freelancer.color }}
                >
                  {contract.freelancer.initials}
                </div>
                <span className="font-bold text-black/85">{contract.freelancer.name}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-black/50">Mức phí hợp đồng</span>
              <div className="mt-1 font-extrabold text-[#057642]">{contract.payment}</div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-black/50">Trạng thái</span>
              <div className="mt-1">
                <AdminStatusBadge status={contract.status} />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between px-1 text-black/60">
            <span className="font-medium">Thời hạn hợp đồng:</span>
            <span className="font-bold text-black/80">{contract.dateRange}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-black/8 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/15 bg-white px-5 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
