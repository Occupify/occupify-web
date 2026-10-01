import { ArrowRightIcon } from '@phosphor-icons/react'
import type { MyProject } from '../types'

interface ProjectListCardProps {
  title: string
  projects: MyProject[]
  emptyText: string
  onSelect: (project: MyProject) => void
  hidePeriod?: boolean
}

export function ProjectListCard({
  title,
  projects,
  emptyText,
  onSelect,
  hidePeriod = false,
}: ProjectListCardProps) {
  return (
    <div className="mb-2 overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2.5 sm:px-5">
        <span className="text-[15px] font-bold !text-[var(--text-primary)]">{title}</span>
        <span className="text-xs font-semibold !text-[var(--text-tertiary)]">
          {projects.length}
        </span>
      </div>

      {projects.length === 0 ? (
        <div className="p-4 pt-2.5 pb-4 text-xs !text-[var(--text-tertiary)] sm:px-5">
          {emptyText}
        </div>
      ) : (
        <div className="divide-y !divide-[var(--border-subtle)]">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onSelect(proj)}
              className="flex cursor-pointer items-center justify-between gap-3 p-3.5 px-4 sm:px-5 transition-colors hover:!bg-[#EAF1FA]"
            >
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14.5px] font-bold !text-[var(--text-primary)]">
                  {proj.name}
                </div>
                <div className="mt-0.5 text-xs !text-[var(--text-secondary)]">
                  {proj.members.length} thành viên
                  {!hidePeriod && proj.period ? ` · ${proj.period}` : ''}
                </div>
              </div>
              <ArrowRightIcon size={15} className="shrink-0 text-black/30" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
