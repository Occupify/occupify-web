import { useState } from 'react'
import { BookmarkIcon, ClockIcon } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import type { JobListing } from '../types'

interface JobCardProps {
  job: JobListing
  onClick?: () => void
  isSaved?: boolean
  onToggleSave?: () => void
  onViewProfile?: (name?: string) => void
}

export function JobCard({
  job,
  onClick,
  isSaved = true,
  onToggleSave,
  onViewProfile,
}: JobCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`mb-3 flex cursor-pointer flex-col gap-3 rounded-xl border p-5 transition-all duration-200 !bg-[var(--bg-elevated)] ${
        hovered
          ? '-translate-y-0.5 shadow-md !border-[var(--color-primary-500)]/40'
          : 'shadow-xs !border-[var(--border-default)]'
      }`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3.5">
        {/* User / Client Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation()
            onViewProfile?.(job.clientName)
          }}
          title={`Xem hồ sơ ${job.clientName}`}
          className="shrink-0 cursor-pointer"
        >
          <Avatar name={job.clientName || job.company} size="md" />
        </div>

        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-start gap-2">
            <span
              className={`text-base font-bold leading-snug transition-colors ${
                hovered ? '!text-[var(--color-primary-500)]' : '!text-[var(--text-primary)]'
              }`}
            >
              {job.title}
            </span>
            {job.roles && job.roles.length > 0 && (
              <span className="shrink-0 rounded-md border px-2 py-0.5 text-[11.5px] font-semibold !border-[var(--color-info-border)] !bg-[var(--color-info-bg)] !text-[var(--color-primary-500)]">
                {job.roles.length} vị trí tuyển dụng
              </span>
            )}
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation()
              onViewProfile?.(job.clientName)
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 text-[13.5px] font-semibold !text-[var(--text-secondary)] transition-colors hover:!text-[var(--color-primary-500)]"
          >
            <span>{job.clientName || job.company}</span>
            <span className="rounded border px-1.5 py-0.5 text-[11px] font-semibold !border-[var(--color-success-border)] !bg-[var(--color-success-bg)] !text-[var(--color-success-fg)]">
              Khách hàng
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1.5 text-xs !text-[var(--text-tertiary)]">
            <ClockIcon size={13} className="!text-[var(--text-tertiary)]" />
            <span>Đăng {job.postedAgo}</span>
            {job.location && (
              <>
                <span>&bull;</span>
                <span>{job.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Budget + save button */}
        <div className="flex shrink-0 flex-col items-end gap-2 text-right">
          <div className="rounded-lg border px-3 py-1.5 text-sm font-extrabold !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-primary)]">
            {job.budget}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave?.()
            }}
            aria-label={isSaved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
            title={isSaved ? 'Đã lưu' : 'Lưu việc làm'}
            className={`flex h-8 w-8 min-h-[32px] min-w-[32px] cursor-pointer items-center justify-center rounded-lg border transition-all ${
              isSaved
                ? 'border-[#BFDBFE] !bg-[#EFF6FF] !text-[var(--color-primary-500)]'
                : 'border-[#E2E8F0] !bg-[var(--bg-elevated)] !text-[#94A3B8] hover:!bg-[#F1F5F9] hover:!text-[var(--color-primary-500)]'
            }`}
          >
            <BookmarkIcon size={16} weight={isSaved ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>

      {/* Description excerpt */}
      <p className="line-clamp-2 text-sm leading-relaxed !text-[var(--text-secondary)]">
        {job.description}
      </p>

      {/* Skills chips */}
      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md border px-2.5 py-0.5 text-xs font-medium !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-secondary)]"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
