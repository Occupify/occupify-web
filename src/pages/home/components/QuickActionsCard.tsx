import {
  BriefcaseMetalIcon,
  FolderPlusIcon,
  FileTextIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'

export interface QuickActionsCardProps {
  onCreateProject: () => void
  onCreateContract: () => void
}

export function QuickActionsCard({ onCreateProject, onCreateContract }: QuickActionsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
      <div className="text-[15px] font-extrabold text-slate-900 mb-3.5 flex items-center gap-2 tracking-tight">
        <BriefcaseMetalIcon size={18} className="text-[#0A66C2]" weight="fill" />
        <span>Khởi tạo & Giao việc</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Create Project Button */}
        <button
          type="button"
          onClick={onCreateProject}
          className="group flex items-center justify-between gap-3 w-full p-3 rounded-xl border border-slate-200 hover:border-[#0A66C2] bg-white hover:bg-slate-50/80 transition-all cursor-pointer text-left shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-[#0A66C2] flex items-center justify-center shrink-0 border border-sky-100">
              <FolderPlusIcon size={18} weight="bold" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-slate-900 group-hover:text-[#0A66C2] transition-colors truncate">
                Đăng dự án tìm Freelancer
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                Nhận báo giá từ các chuyên gia hàng đầu
              </div>
            </div>
          </div>
          <ArrowRightIcon
            size={14}
            className="text-slate-400 group-hover:text-[#0A66C2] group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </button>

        {/* Create Contract Button */}
        <button
          type="button"
          onClick={onCreateContract}
          className="group flex items-center justify-between gap-3 w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-600 bg-white hover:bg-slate-50/80 transition-all cursor-pointer text-left shadow-2xs hover:shadow-xs"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileTextIcon size={18} weight="bold" />
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                Soạn hợp đồng Escrow
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                Ký kết bảo chứng & phân rã mốc bàn giao
              </div>
            </div>
          </div>
          <ArrowRightIcon
            size={14}
            className="text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </button>
      </div>
    </div>
  )
}

export default QuickActionsCard
