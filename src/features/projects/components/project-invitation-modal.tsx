import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BriefcaseIcon,
  CalendarBlankIcon,
  CheckFatIcon,
  ClockIcon,
  SealCheckIcon,
  SparkleIcon,
  WalletIcon,
  XIcon,
} from '@phosphor-icons/react'
import type { PendingProject } from '../types'

interface ProjectInvitationModalProps {
  project: PendingProject
  onClose: () => void
  onAccept: (project: PendingProject) => void
  onReject: (project: PendingProject) => void
  onOpenChat?: (owner: string) => void
  onViewProfile?: (ownerName: string) => void
}

export function ProjectInvitationModal({
  project,
  onClose,
  onAccept,
  onReject,
  onViewProfile,
}: ProjectInvitationModalProps) {
  const navigate = useNavigate()
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  const handleProfileClick = () => {
    if (onViewProfile) {
      onViewProfile(project.owner)
    } else {
      navigate('/not-found')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-xs !bg-[rgba(15,23,42,0.65)]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-[680px] flex-col overflow-y-auto rounded-2xl border shadow-2xl !border-[var(--border-default)] !bg-[var(--bg-elevated)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative border-b p-6 pb-4 sm:px-7 !border-[var(--border-subtle)]">
          {/* Top badges (Category + Expiry timer) + Close Button */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                <SparkleIcon size={13} weight="fill" />
                <span>Lời mời tham gia dự án</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold !bg-[#FEF3C7] !text-[#92400E]">
                <ClockIcon size={13} weight="bold" />
                <span>Hết hạn sau 3 ngày</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-tertiary)] hover:!text-[var(--text-primary)]"
            >
              <XIcon size={16} weight="bold" />
            </button>
          </div>

          {/* Project Title */}
          <h2 className="mb-2.5 text-[22px] font-extrabold leading-snug tracking-tight !text-[var(--text-primary)]">
            {project.name}
          </h2>

          {/* Project Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border px-2 py-0.5 text-[11.5px] font-semibold !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-secondary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-4 p-5 sm:p-7">
          {/* Key Terms Summary Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3.5 rounded-xl border p-3.5 sm:px-4.5 !border-[var(--border-default)] !bg-[var(--bg-subtle)]">
            <div className="flex items-center gap-2">
              <BriefcaseIcon size={16} className="!text-[var(--color-primary-500)]" />
              <span className="text-[13px] !text-[var(--text-secondary)]">Vai trò:</span>
              <span className="text-[13.5px] font-bold !text-[var(--text-primary)]">
                {project.invitedRole}
              </span>
            </div>

            <div className="hidden h-4 w-px bg-slate-300 sm:block" />

            <div className="flex items-center gap-2">
              <WalletIcon size={16} className="!text-[var(--color-primary-500)]" />
              <span className="text-[13px] !text-[var(--text-secondary)]">Thù lao:</span>
              <span className="text-[13.5px] font-bold !text-[var(--color-primary-500)]">
                {project.price}{' '}
                <span className="text-xs font-medium !text-[var(--text-secondary)]">
                  / {project.period}
                </span>
              </span>
            </div>

            <div className="hidden h-4 w-px bg-slate-300 sm:block" />

            <div className="flex items-center gap-2">
              <CalendarBlankIcon size={16} className="!text-[var(--color-primary-500)]" />
              <span className="text-[13px] !text-[var(--text-secondary)]">Hạn dự kiến:</span>
              <span className="text-[13.5px] font-bold !text-[var(--text-primary)]">
                {project.dueDate ?? 'Theo thỏa thuận'}
              </span>
            </div>
          </div>

          {/* Invitation Letter Section - Cover Letter Only */}
          <div className="flex flex-col rounded-xl border p-4.5 shadow-xs !border-[var(--border-default)] !bg-[var(--bg-elevated)]">
            {/* Sender / Inviter Header */}
            <div className="flex shrink-0 items-center justify-between border-b pb-3 !border-[var(--border-subtle)]">
              <div
                onClick={handleProfileClick}
                className="inline-flex cursor-pointer items-center gap-3"
              >
                {project.ownerAvatar ? (
                  <img
                    src={project.ownerAvatar}
                    alt={project.owner}
                    className="h-10 w-10 rounded-full border-2 object-cover !border-[var(--color-primary-500)]"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-base font-extrabold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                    {project.owner.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-bold !text-[var(--text-primary)]">
                      {project.owner}
                    </span>
                    <SealCheckIcon
                      size={15}
                      weight="fill"
                      className="!text-[var(--color-primary-500)]"
                    />
                  </div>
                  <div className="text-xs font-semibold !text-[var(--color-primary-500)]">
                    Chủ dự án · Nhấn xem trang cá nhân →
                  </div>
                </div>
              </div>

              <span className="rounded-md border px-2.5 py-1 text-[11.5px] font-semibold !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-secondary)]">
                Thư mời hợp tác
              </span>
            </div>

            {/* Letter Content - Cover letter */}
            <div className="pt-3.5 text-[13.5px] leading-relaxed !text-[var(--text-primary)]">
              <div className="mb-1.5 font-bold !text-[var(--text-primary)]">Nội dung lời mời:</div>
              <p className="mb-2.5 !text-[var(--text-secondary)]">
                {project.inviteMessage ||
                  `Chào bạn! Qua hồ sơ và kinh nghiệm làm việc của bạn trên Occupify, chúng tôi nhận thấy năng lực của bạn rất phù hợp với vị trí ${project.invitedRole} trong dự án "${project.name}". Chúng tôi rất mong có cơ hội được hợp tác cùng bạn trong dự án này.`}
              </p>

              {project.description && (
                <div className="mt-2.5 border-t border-dashed pt-2.5 text-[13px] !border-[var(--border-subtle)] !text-[var(--text-secondary)]">
                  <span className="font-semibold !text-[var(--text-primary)]">Về dự án: </span>
                  {project.description}
                </div>
              )}
            </div>
          </div>

          {/* Rejection Form */}
          {showRejectForm && (
            <div className="rounded-xl border p-4 sm:p-5 !border-[#FECACA] !bg-[#FEF2F2]">
              <div className="mb-1.5 text-[13.5px] font-bold !text-[#991B1B]">
                Lý do từ chối lời mời (tuỳ chọn)
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="VD: Hiện tại tôi đang bận dự án khác, mức thù lao chưa phù hợp, hoặc định hướng công nghệ khác..."
                className="min-h-[70px] w-full rounded-lg border p-2.5 text-xs outline-none !border-[#FCA5A5] !bg-white !text-[var(--text-primary)]"
              />
              <div className="mt-2.5 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="cursor-pointer text-xs font-semibold !text-[var(--text-secondary)] hover:!text-[var(--text-primary)]"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => onReject(project)}
                  className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold !text-white shadow-xs !bg-[#DC2626] hover:!bg-[#B91C1C]"
                >
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t p-4 sm:px-7 !border-[var(--border-subtle)] !bg-[var(--bg-subtle)]/50">
          {!showRejectForm && (
            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              className="cursor-pointer rounded-full border px-5 py-2 text-[13.5px] font-semibold transition-colors !border-[var(--border-default)] !bg-white !text-[var(--text-secondary)] hover:!border-[#FECACA] hover:!bg-[#FEF2F2] hover:!text-[#DC2626]"
            >
              Từ chối lời mời
            </button>
          )}

          <button
            type="button"
            onClick={() => onAccept(project)}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-[13.5px] font-bold !text-white shadow-md transition-all !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
          >
            <CheckFatIcon size={16} weight="fill" />
            <span>Chấp nhận lời mời & Tham gia dự án</span>
          </button>
        </div>
      </div>
    </div>
  )
}
