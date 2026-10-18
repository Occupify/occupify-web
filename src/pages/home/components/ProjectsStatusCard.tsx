import { ArrowRightIcon, BriefcaseMetalIcon } from '@phosphor-icons/react'

export interface ProjectsStatusCardProps {
  myProjectsCount?: number
  employeeProjectsCount?: number
  pendingProjectsCount?: number
  onNavigateProjects?: () => void
}

export function ProjectsStatusCard({
  myProjectsCount = 0,
  employeeProjectsCount = 0,
  pendingProjectsCount = 0,
  onNavigateProjects,
}: ProjectsStatusCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
      <div className="text-[15px] font-extrabold text-slate-900 mb-3.5 flex items-center justify-between tracking-tight">
        <div className="flex items-center gap-2">
          <BriefcaseMetalIcon size={18} weight="fill" className="text-[#0A66C2]" />
          <span>Bàn Làm Việc & Hợp Đồng</span>
        </div>
        <span className="text-[11px] bg-sky-50 text-[#0A66C2] font-bold px-2 py-0.5 rounded border border-sky-200">
          Active
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {/* Managed Projects */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs sm:text-[13px]">
          <span className="text-slate-600 font-medium">
            Dự án đã đăng (Khách hàng)
          </span>
          <span className="font-extrabold text-slate-900">
            {myProjectsCount} dự án
          </span>
        </div>

        {/* Ongoing Freelance Contracts */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs sm:text-[13px]">
          <span className="text-slate-600 font-medium">
            Hợp đồng đang thực hiện
          </span>
          <span className="font-extrabold text-emerald-700">
            {employeeProjectsCount} hợp đồng
          </span>
        </div>

        {/* Pending Proposals */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs sm:text-[13px]">
          <span className="text-slate-600 font-medium">
            Báo giá / Lời mời chờ duyệt
          </span>
          <span className="font-extrabold text-amber-700">
            {pendingProjectsCount} chờ phản hồi
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onNavigateProjects}
        className="w-full mt-3.5 bg-white hover:bg-sky-50/60 border border-slate-300 hover:border-sky-300 rounded-lg py-2 px-3 text-xs sm:text-[13px] font-bold text-[#0A66C2] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
      >
        <span>Vào Bàn Quản lý Hợp đồng</span>
        <ArrowRightIcon size={14} weight="bold" />
      </button>
    </div>
  )
}

export default ProjectsStatusCard

