import { UserIcon, ArrowRightIcon, CoinsIcon } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'

export interface FreelancerProfileCardProps {
  userName?: string
  onViewProfile?: () => void
}

export function FreelancerProfileCard({ userName, onViewProfile }: FreelancerProfileCardProps) {
  const completeness = 92
  const connects = 40

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
      {/* Top User Info */}
      <div className="flex items-center gap-3 mb-3.5">
        <div className="shrink-0">
          <Avatar name={userName || 'Freelancer Pro'} size="md" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-extrabold text-slate-900 truncate">
            {userName || 'Freelancer Pro'}
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <span>Nhà phát triển Phần mềm & UI/UX</span>
          </div>
        </div>
      </div>

      {/* Profile Completeness Bar */}
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-3">
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="font-semibold text-slate-600">Mức độ hoàn thiện hồ sơ</span>
          <span className="font-extrabold text-[#0A66C2]">{completeness}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0A66C2] transition-all duration-300"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* Connects / Bids Allowance (Upwork Signature) */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-sky-50/70 rounded-lg border border-sky-100 mb-3.5">
        <div className="flex items-center gap-2 text-xs text-sky-900">
          <CoinsIcon size={16} weight="bold" className="text-[#0A66C2]" />
          <span className="font-semibold">Lượt báo giá khả dụng</span>
        </div>
        <span className="text-xs font-extrabold text-sky-950">{connects} Connects</span>
      </div>

      {/* Button to Profile */}
      <button
        type="button"
        onClick={onViewProfile}
        className="w-full bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-lg py-2 px-3 text-xs sm:text-[13px] font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
      >
        <UserIcon size={14} weight="bold" />
        <span>Xem & Hoàn thiện Hồ sơ</span>
        <ArrowRightIcon size={13} weight="bold" />
      </button>
    </div>
  )
}

export default FreelancerProfileCard
