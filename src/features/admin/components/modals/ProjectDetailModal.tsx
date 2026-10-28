import { XIcon } from '@phosphor-icons/react'
import type { AdminProject } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ProjectDetailModalProps {
  project: AdminProject | null
  onClose: () => void
  onDeleteClick: (project: AdminProject) => void
}

export function ProjectDetailModal({ project, onClose, onDeleteClick }: ProjectDetailModalProps) {
  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-[640px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <h2 className="text-lg font-bold text-black/90">Chi tiết dự án</h2>
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
          {/* Title & Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-black/90">{project.title}</h3>
              <AdminStatusBadge status={project.status} />
            </div>
            <div className="mt-1 text-black/45">Ngày đăng: {project.date}</div>
          </div>

          {/* 2-col info */}
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#FAFAF8] p-3.5">
            <div>
              <span className="text-[11px] font-medium text-black/50">Chủ dự án</span>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: project.owner.color }}
                >
                  {project.owner.initials}
                </div>
                <span className="font-bold text-black/85 truncate">{project.owner.name}</span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-black/50">Ngân sách</span>
              <div className="mt-1 font-extrabold text-[#057642]">
                {project.budget}{' '}
                <span className="text-[11px] font-normal text-black/50">
                  ({project.budgetType})
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="font-bold text-black/75">Mô tả dự án:</span>
            <p className="mt-1 leading-relaxed text-black/70 whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Skills */}
          <div>
            <span className="font-bold text-black/75">Kỹ năng yêu cầu:</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded bg-[#EAF1FA] px-2.5 py-1 text-[11px] font-bold text-[#0A66C2]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Applicant list */}
          <div>
            <span className="font-bold text-black/75">
              Người tham gia ({project.applicantList.length})
            </span>
            <div className="mt-2 flex flex-col gap-2">
              {project.applicantList.length === 0 ? (
                <div className="rounded-lg bg-[#FAFAF8] p-4 text-center italic text-black/40">
                  Chưa có người tham gia chào giá.
                </div>
              ) : (
                project.applicantList.map((app) => (
                  <div
                    key={app.name}
                    className="flex items-center justify-between rounded-lg bg-[#FAFAF8] px-3.5 py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10.5px] font-extrabold text-white"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.initials}
                      </div>
                      <span className="font-bold text-black/85">{app.name}</span>
                    </div>
                    <span className="font-bold text-[#057642]">{app.bid}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/8 px-6 py-4">
          <button
            type="button"
            onClick={() => onDeleteClick(project)}
            className="rounded-full border border-[#FCE8E6] bg-[#FCE8E6] px-4 py-2 text-xs font-bold text-[#C03A2B] transition-colors hover:bg-[#fad2cf]"
          >
            Gỡ bỏ dự án
          </button>
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
