import * as React from 'react'
import {
  ClockIcon,
  BookmarkIcon,
  EyeIcon,
  PaperPlaneTiltIcon,
  UsersIcon,
  StarIcon,
  ShieldCheckIcon,
  MapPinIcon,
  ArrowRightIcon,
  CoinsIcon,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import type { JobListing } from '../types'

export interface JobCardProps {
  job: JobListing
  onClick?: () => void
  isSaved?: boolean
  onToggleSave?: () => void
  onApply?: () => void
  onViewProfile?: (name?: string) => void
}

export function JobCard({
  job,
  onClick,
  isSaved = false,
  onToggleSave,
  onViewProfile,
}: JobCardProps) {
  const [localSaved, setLocalSaved] = React.useState(false)

  const saved = isSaved !== undefined ? isSaved : localSaved

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleSave) {
      onToggleSave()
    } else {
      setLocalSaved(!localSaved)
    }
  }

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewProfile?.(job.clientName)
  }

  const isClosed = job.status === 'CLOSED'
  const isHourly = job.salaryType === 'hourly'
  const isLessCompetitive = job.submitsCount < 5

  return (
    <article
      onClick={onClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      className={`group relative bg-white rounded-xl border border-slate-200/90 hover:border-sky-500/70 shadow-xs hover:shadow-md transition-all duration-200 p-5 sm:p-6 mb-3.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 ${
        isClosed ? 'opacity-75' : 'opacity-100'
      }`}
    >
      {/* ─── Top Row: Client Trust & Time & Save ─── */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Client identity & trust info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
          <div
            onClick={handleProfileClick}
            title={`Xem hồ sơ ${job.clientName}`}
            className="cursor-pointer shrink-0"
          >
            <Avatar name={job.clientName || job.company} size="sm" />
          </div>

          <button
            type="button"
            onClick={handleProfileClick}
            title={`Xem hồ sơ ${job.clientName}`}
            className="text-xs sm:text-[13px] font-bold text-slate-800 hover:text-[#0A66C2] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>{job.clientName || job.company}</span>
          </button>

          {/* Payment Verified Escrow Pill */}
          <span
            className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2 py-0.5 rounded text-[11px] font-bold"
            title="Khách hàng đã ký quỹ Escrow bảo chứng nguồn ngân sách thanh toán"
          >
            <ShieldCheckIcon size={12} weight="fill" className="text-emerald-600" />
            <span>Escrow Bảo chứng</span>
          </span>

          {/* Client Rating */}
          {job.clientRating && (
            <span className="inline-flex items-center gap-1 text-[11.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
              <StarIcon size={11} weight="fill" className="text-amber-500" />
              <span>{job.clientRating}</span>
            </span>
          )}

          {/* Location badge */}
          <span className="inline-flex items-center gap-1 text-[11.5px] text-slate-500">
            <MapPinIcon size={12} className="text-slate-400" />
            <span>{job.location || 'Toàn quốc (Remote)'}</span>
          </span>
        </div>

        {/* Right side: Freshness and Bookmark Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <ClockIcon size={13} className="text-slate-400" />
            <span>{job.postedAgo}</span>
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={saved ? 'Bỏ lưu dự án' : 'Lưu dự án'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
              saved
                ? 'bg-sky-50 border-sky-300 text-[#0A66C2]'
                : 'bg-slate-50 hover:bg-sky-50/70 border-slate-200 hover:border-sky-200 text-slate-400 hover:text-[#0A66C2]'
            }`}
            title={saved ? 'Đã lưu vào danh sách yêu thích' : 'Lưu dự án'}
          >
            <BookmarkIcon size={16} weight={saved ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>

      {/* ─── Title & Status Pills ─── */}
      <div className="mb-3">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 group-hover:text-[#0A66C2] transition-colors leading-snug">
            {job.title}
          </h3>

          <div className="inline-flex items-center gap-1.5 flex-wrap">
            {/* Status Pill (OPEN / CLOSED) */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                isClosed
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isClosed ? 'bg-slate-400' : 'bg-emerald-500'
                }`}
              />
              {isClosed ? 'Đã đóng thầu' : 'Đang nhận báo giá'}
            </span>

            {/* Experience Level Badge */}
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                job.experienceLevel === 'expert'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : job.experienceLevel === 'intermediate'
                    ? 'bg-sky-50 text-sky-800 border-sky-200'
                    : 'bg-purple-50 text-purple-800 border-purple-200'
              }`}
            >
              {job.experienceLevel === 'expert'
                ? '⭐ Chuyên gia (Expert)'
                : job.experienceLevel === 'intermediate'
                  ? '🎯 Có kinh nghiệm'
                  : '🌱 Mới bắt đầu'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Compensation & Scope Highlight Bar (Freelance Signature) ─── */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 sm:px-3.5 sm:py-2.5 flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-[13px] mb-3">
        {/* Budget Highlight */}
        <div className="flex items-center gap-1.5">
          <CoinsIcon size={16} weight="bold" className="text-[#0A66C2]" />
          <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
            {job.budget}
          </span>
          <span className="text-[11px] font-semibold text-[#0A66C2] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
            {isHourly ? 'Theo giờ' : 'Cố định dự án'}
          </span>
        </div>

        <span className="text-slate-300 hidden sm:inline">|</span>

        {/* Commitment Hours */}
        <div className="flex items-center gap-1.5 text-slate-600">
          <ClockIcon size={14} className="text-slate-400" />
          <span>
            Thời lượng:{' '}
            <strong className="text-slate-800 font-semibold">
              {job.hoursPerDay ? `${job.hoursPerDay}h / ngày` : 'Linh hoạt'}
            </strong>
          </span>
        </div>

        {/* Project Duration */}
        {job.duration && (
          <>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="text-slate-600">
              Thời hạn bàn giao:{' '}
              <strong className="text-slate-800 font-semibold">{job.duration}</strong>
            </div>
          </>
        )}
      </div>

      {/* ─── Description Snippet ─── */}
      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
        {job.description}
      </p>

      {/* ─── Freelance Skills Pill Tags ─── */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="bg-slate-100 hover:bg-slate-200/90 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-slate-200/60 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* ─── Freelance Velocity & Bidding Strip + Action CTA ─── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        {/* Marketplace proposal and competition stats */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Proposals Count */}
          <div className="flex items-center gap-1.5">
            <PaperPlaneTiltIcon size={14} className="text-[#0A66C2]" weight="bold" />
            <span>
              Đề xuất: <strong className="text-slate-800 font-bold">{job.submitsCount}</strong>
            </span>
            {isLessCompetitive && (
              <span className="bg-emerald-50 text-emerald-800 text-[10.5px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                🔥 Ít cạnh tranh
              </span>
            )}
          </div>

          {/* Hiring slots */}
          <div className="flex items-center gap-1.5">
            <UsersIcon size={14} className="text-slate-400" />
            <span>
              Cần tuyển:{' '}
              <strong className="text-slate-800 font-bold">
                {job.openPositions - job.filledPositions}
              </strong>{' '}
              vị trí
            </span>
          </div>

          {/* Views count */}
          <div className="flex items-center gap-1">
            <EyeIcon size={14} className="text-slate-400" />
            <span>{job.viewsCount} xem</span>
          </div>
        </div>

        {/* Direct Action Link */}
        <div className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#0A66C2] group-hover:text-[#084fa0] transition-colors">
          <span>Xem dự án & Gửi báo giá</span>
          <ArrowRightIcon
            size={14}
            weight="bold"
            className="group-hover:translate-x-1 transition-transform"
          />
        </div>
      </div>
    </article>
  )
}

export default JobCard
