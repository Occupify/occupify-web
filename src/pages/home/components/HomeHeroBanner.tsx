import * as React from 'react'
import {
  MagnifyingGlassIcon,
  XIcon,
  ShieldCheckIcon,
  FileTextIcon,
  ClockIcon,
  CoinsIcon,
  BriefcaseMetalIcon,
  TrendUpIcon,
} from '@phosphor-icons/react'

export interface HomeHeroBannerProps {
  searchKeyword: string
  onSearchChange: (keyword: string) => void
  onSearchSubmit?: () => void
  userName?: string
  onSelectTag?: (tag: string) => void
}

const POPULAR_FREELANCE_TAGS = [
  { label: 'React / Next.js', query: 'React' },
  { label: 'UI/UX Figma', query: 'UI/UX' },
  { label: 'Node.js / Backend', query: 'Node.js' },
  { label: 'Mobile App', query: 'Mobile' },
  { label: 'Full-stack', query: 'Full-stack' },
  { label: 'Theo giờ', query: 'giờ' },
]

export function HomeHeroBanner({
  searchKeyword,
  onSearchChange,
  onSearchSubmit,
  userName,
  onSelectTag,
}: HomeHeroBannerProps) {
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSearchSubmit?.()
  }

  const handleTagClick = (query: string) => {
    if (onSelectTag) {
      onSelectTag(query)
    } else {
      onSearchChange(query)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF2FA] via-[#F0F6FC] to-[#DDECF9] border border-[#BFDBFE] shadow-sm mb-6 p-6 sm:p-8 lg:p-9 transition-all">
      {/* Subtle geometric pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #0A66C2 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Atmospheric luminous glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Marketplace Verified Live Beacon Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-[#0A66C2] border border-sky-200 shadow-xs mb-3.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <BriefcaseMetalIcon size={14} weight="bold" className="text-[#0A66C2]" />
          <span className="tracking-wide">
            SÀN GIAO DỊCH VIỆC LÀM FREELANCE & DỰ ÁN HỢP ĐỒNG SỐ 1
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900 mb-2.5 leading-tight">
          {userName
            ? `Chào mừng trở lại, ${userName} 👋`
            : 'Khám phá Việc làm Freelance & Nhận thầu Dự án Uy tín'}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed mb-6 font-normal">
          Tiếp cận hàng trăm dự án công nghệ và thiết kế chất lượng cao, gửi báo giá cạnh tranh, ký
          kết hợp đồng điện tử bảo chứng an toàn và nhận thanh toán bảo đảm 100% qua Escrow.
        </p>

        {/* Quick Search Form - Pure white elevated box that pops distinctly */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-1.5 sm:p-2 pl-4 flex items-center shadow-md border border-slate-200 hover:border-slate-300 focus-within:border-[#0A66C2] focus-within:ring-2 focus-within:ring-sky-200 transition-all max-w-3xl mb-4"
        >
          <MagnifyingGlassIcon size={20} className="text-slate-400 shrink-0" weight="bold" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo kỹ năng (React, Figma, Node.js...), vị trí thầu, hoặc doanh nghiệp..."
            className="flex-1 border-none outline-none px-3 py-2 text-sm sm:text-[15px] text-slate-900 placeholder:text-slate-400 font-medium bg-transparent min-w-0"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Xóa từ khóa tìm kiếm"
              className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              <XIcon size={16} weight="bold" />
            </button>
          )}
          <button
            type="submit"
            className="bg-[#0A66C2] hover:bg-[#084fa0] active:bg-[#06407f] text-white rounded-lg px-4 sm:px-6 py-2.5 text-sm font-bold flex items-center gap-2 transition-all shrink-0 shadow-sm hover:shadow cursor-pointer"
          >
            <TrendUpIcon size={16} weight="bold" />
            <span>Tìm dự án</span>
          </button>
        </form>

        {/* Quick Skill Chips Bar */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-xs font-bold text-slate-600 mr-1">Kỹ năng đang hot:</span>
          {POPULAR_FREELANCE_TAGS.map((tag) => {
            const isActive = searchKeyword.toLowerCase().includes(tag.query.toLowerCase())
            return (
              <button
                key={tag.query}
                type="button"
                onClick={() => handleTagClick(tag.query)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0A66C2] border-[#0A66C2] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-sky-200/80 shadow-2xs hover:text-[#0A66C2]'
                }`}
              >
                {tag.label}
              </button>
            )
          })}
        </div>

        {/* Marketplace Trust Features Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5 pt-4 border-t border-[#0A66C2]/15">
          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs rounded-xl p-2.5 sm:px-3 border border-sky-200/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/70">
              <ShieldCheckIcon size={18} weight="fill" className="text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">100% Escrow Bảo chứng</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs rounded-xl p-2.5 sm:px-3 border border-sky-200/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200/70">
              <FileTextIcon size={18} weight="fill" className="text-[#0A66C2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Hợp đồng số ký kết an toàn</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs rounded-xl p-2.5 sm:px-3 border border-sky-200/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/70">
              <ClockIcon size={18} weight="fill" className="text-amber-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">Phản hồi nhanh dưới 4h</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xs rounded-xl p-2.5 sm:px-3 border border-sky-200/60 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200/70">
              <CoinsIcon size={18} weight="fill" className="text-purple-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">0% Phí ẩn cho Freelancer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeHeroBanner
