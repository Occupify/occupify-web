import { XIcon, WarningIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import type { AdminProject } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ProjectDetailModalProps {
  project: AdminProject | null
  onClose: () => void
  onDeleteClick: (project: AdminProject) => void
}

export function ProjectDetailModal({ project, onClose, onDeleteClick }: ProjectDetailModalProps) {
  if (!project) return null

  const reports = project.reports ?? []
  const reportCount = project.reportCount ?? reports.length

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-black/90">Chi tiết dự án & Báo cáo vi phạm</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black/80"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6 text-xs">
          {/* Title & Status */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-black/90">{project.title}</h3>
              <AdminStatusBadge status={project.status} />
            </div>
            <div className="mt-1 text-black/45">Ngày đăng tuyển: {project.date}</div>
          </div>

          {/* 2-col info */}
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-[#FAFAF8] p-3.5">
            <div>
              <span className="text-[11px] font-medium text-black/50">Chủ dự án (Employer)</span>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                  style={{ backgroundColor: project.owner.color }}
                >
                  {project.owner.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-black/85 truncate">{project.owner.name}</div>
                  {project.owner.email && (
                    <div className="text-[10px] text-black/50 truncate">{project.owner.email}</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium text-black/50">Ngân sách dự kiến</span>
              <div className="mt-1 font-extrabold text-[#057642]">
                {project.budget || 'Thỏa thuận'}{' '}
                {project.budgetType && (
                  <span className="text-[11px] font-normal text-black/50">
                    ({project.budgetType})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="font-bold text-black/75">Mô tả dự án:</span>
            <p className="mt-1 leading-relaxed text-black/70 whitespace-pre-line bg-[#FAFAF8] p-3 rounded-lg border border-black/5">
              {project.description}
            </p>
          </div>

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
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
          )}

          {/* Báo cáo vi phạm chính sách (Trọng tâm nghiệp vụ Admin) */}
          <div className="flex flex-col gap-2.5 border-t border-black/8 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WarningIcon
                  size={16}
                  weight="fill"
                  className={reportCount > 0 ? 'text-[#B06000]' : 'text-black/45'}
                />
                <span className="text-sm font-bold text-black/90">
                  Báo cáo vi phạm & khiếu nại ({reportCount})
                </span>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  reportCount > 0 ? 'bg-[#FEF7E0] text-[#B06000]' : 'bg-[#E6F4EA] text-[#137333]'
                }`}
              >
                {reportCount > 0 ? `${reportCount} tố cáo cần xử lý` : 'An toàn / Chưa có vi phạm'}
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="flex items-center gap-2.5 rounded-lg border border-[#DCFCE7] bg-[#F0FDF4] p-3.5 text-xs text-[#166534]">
                <ShieldCheckIcon size={20} weight="fill" className="text-[#15803D] shrink-0" />
                <div>
                  <div className="font-bold">Dự án tuân thủ tiêu chuẩn cộng đồng</div>
                  <div className="mt-0.5 text-[11px] text-[#15803D]/80">
                    Chưa có bất kỳ tố cáo lừa đảo, đạo văn hay nội dung độc hại nào được gửi tới ban
                    quản trị.
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {reports.map((report) => (
                  <div
                    key={String(report.id)}
                    className="flex flex-col gap-2 rounded-lg border border-[#FEE2E2] bg-[#FEF2F2]/40 p-3.5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#FCA5A5]/30 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[#FEE2E2] px-2 py-0.5 text-[10.5px] font-bold text-[#B91C1C]">
                          {report.violationCategory}
                        </span>
                        <AdminStatusBadge
                          status={report.status}
                          className="text-[10px] py-0 px-2"
                        />
                      </div>
                      <span className="text-[11px] text-black/50">{report.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                        style={{ backgroundColor: report.reporterColor || '#0A66C2' }}
                      >
                        {report.reporterInitials || 'ND'}
                      </div>
                      <span className="font-semibold text-black/85">
                        Người tố cáo: {report.reporterName}
                      </span>
                      {report.reporterEmail && (
                        <span className="text-black/45">({report.reporterEmail})</span>
                      )}
                    </div>

                    <p className="text-xs text-black/80 bg-white p-2.5 rounded border border-black/5 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Người tham gia chào giá (Thông tin phụ trợ nếu có) */}
          {project.applicantList && project.applicantList.length > 0 && (
            <div className="border-t border-black/8 pt-3">
              <span className="font-bold text-black/60 text-[11px]">
                Ứng viên nộp hồ sơ ({project.applicantList.length} người tham gia)
              </span>
              <div className="mt-2 flex flex-col gap-1.5">
                {project.applicantList.map((app) => (
                  <div
                    key={app.name}
                    className="flex items-center justify-between rounded-lg bg-[#FAFAF8] px-3 py-2 text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white"
                        style={{ backgroundColor: app.color }}
                      >
                        {app.initials}
                      </div>
                      <span className="font-semibold text-black/85">{app.name}</span>
                    </div>
                    <span className="font-bold text-[#057642]">{app.bid}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black/8 px-6 py-4">
          <button
            type="button"
            onClick={() => onDeleteClick(project)}
            className="rounded-full border border-[#FCE8E6] bg-[#FCE8E6] px-4 py-2 text-xs font-bold text-[#C03A2B] transition-colors hover:bg-[#fad2cf]"
          >
            Gỡ bỏ dự án vi phạm
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
