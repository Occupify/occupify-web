import { Eye, SealCheck } from '@phosphor-icons/react'
import type { PendingProject } from '../types'

interface PendingProjectCardProps {
  pending: PendingProject[]
  onAccept?: (project: PendingProject) => void
  onReject?: (project: PendingProject) => void
  onViewDetail?: (project: PendingProject) => void
}

export function PendingProjectCard({ pending, onReject, onViewDetail }: PendingProjectCardProps) {
  if (pending.length === 0) return null

  return (
    <div className="mb-2 overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2.5 sm:px-5">
        <span className="text-[15px] font-bold !text-[var(--text-primary)]">
          Lời mời & Dự án trong hàng chờ
        </span>
        <span className="rounded-full px-2 py-0.5 text-xs font-bold !bg-[#FEF3C7] !text-[#B45309]">
          {pending.length} lời mời
        </span>
      </div>

      <div className="divide-y !divide-[var(--border-subtle)]">
        {pending.map((proj) => (
          <div key={proj.id} className="p-3.5 px-4 sm:px-5">
            <div className="min-w-0 flex-1">
              {/* Project title & Role tag */}
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <div
                  onClick={() => onViewDetail?.(proj)}
                  className="cursor-pointer truncate text-[14.5px] font-bold !text-[var(--color-primary-500)] hover:underline"
                >
                  {proj.name}
                </div>
                {proj.invitedRole && (
                  <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                    <SealCheck size={12} weight="fill" />
                    <span>Vai trò: {proj.invitedRole}</span>
                  </span>
                )}
              </div>

              {/* Owner info */}
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs !text-[var(--text-secondary)]">
                <span>
                  Chủ dự án: <strong className="!text-[var(--text-primary)]">{proj.owner}</strong>
                </span>
                {proj.ownerRating && (
                  <span className="inline-flex items-center gap-0.5 font-bold !text-[#B45309]">
                    ⭐ {proj.ownerRating}
                  </span>
                )}
              </div>

              {/* Fee info */}
              <div className="mt-0.5 text-xs !text-[var(--text-secondary)]">
                Thù lao: <span className="font-bold !text-[#057642]">{proj.price}</span>
                {' · '}
                {proj.period}
                {proj.dueDate ? ` · Hạn: ${proj.dueDate}` : ''}
              </div>

              {/* Action buttons */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onViewDetail?.(proj)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold !text-white shadow-xs transition-colors !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
                >
                  <Eye size={14} weight="bold" />
                  <span>Xem chi tiết dự án</span>
                </button>

                <button
                  type="button"
                  onClick={() => onReject?.(proj)}
                  className="cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] transition-colors hover:!bg-[var(--bg-subtle)]"
                >
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
