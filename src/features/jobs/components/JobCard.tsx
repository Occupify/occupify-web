import * as React from 'react'
import {
  ClockIcon,
  BookmarkIcon,
  EyeIcon,
  PaperPlaneTiltIcon,
  UsersIcon,
  StarIcon,
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
  const [hovered, setHovered] = React.useState(false)

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

  return (
    <div
      onClick={onClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
      style={{
        background: '#fff',
        borderRadius: 12,
        border: `1px solid ${hovered ? 'rgba(10, 102, 194, 0.35)' : '#E2E8F0'}`,
        boxShadow: hovered
          ? '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)'
          : '0 1px 3px 0 rgba(15, 23, 42, 0.04)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        padding: '20px 22px',
        marginBottom: 12,
        cursor: 'pointer',
        transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        opacity: isClosed ? 0.78 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header row */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        {/* User Avatar */}
        <div
          onClick={handleProfileClick}
          title={`Xem hồ sơ ${job.clientName}`}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          <Avatar name={job.clientName || job.company} size="md" />
        </div>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top Title and Status Badges */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: hovered ? '#0A66C2' : '#0F172A',
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                transition: 'color 150ms ease',
              }}
            >
              {job.title}
            </span>

            {/* Status Pill (OPEN / CLOSED) */}
            <span
              style={{
                background: isClosed ? '#F1F5F9' : '#ECFDF5',
                color: isClosed ? '#64748B' : '#059669',
                border: `1px solid ${isClosed ? '#CBD5E1' : '#A7F3D0'}`,
                padding: '2px 8px',
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 700,
                lineHeight: 1.3,
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: isClosed ? '#94A3B8' : '#10B981',
                }}
              />
              {isClosed ? 'Đã đóng tuyển' : 'Đang mở tuyển'}
            </span>

            {/* Experience Level Badge */}
            <span
              style={{
                background:
                  job.experienceLevel === 'expert'
                    ? '#FFFBEB'
                    : job.experienceLevel === 'intermediate'
                      ? '#F0F9FF'
                      : '#FAF5FF',
                color:
                  job.experienceLevel === 'expert'
                    ? '#B45309'
                    : job.experienceLevel === 'intermediate'
                      ? '#0284C7'
                      : '#7E22CE',
                border: `1px solid ${
                  job.experienceLevel === 'expert'
                    ? '#FDE68A'
                    : job.experienceLevel === 'intermediate'
                      ? '#BAE6FD'
                      : '#E9D5FF'
                }`,
                padding: '2px 8px',
                borderRadius: 6,
                fontSize: 11.5,
                fontWeight: 600,
                lineHeight: 1.3,
                flexShrink: 0,
              }}
            >
              {job.experienceLevel === 'expert'
                ? 'Chuyên gia'
                : job.experienceLevel === 'intermediate'
                  ? 'Có kinh nghiệm'
                  : 'Mới bắt đầu'}
            </span>
          </div>

          <div
            onClick={handleProfileClick}
            title={`Xem hồ sơ ${job.clientName}`}
            style={{
              fontSize: 13.5,
              color: '#334155',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0A66C2')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#334155')}
          >
            <span>{job.clientName || job.company}</span>
            <span
              style={{
                fontSize: 11,
                color: '#15803D',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                padding: '1px 7px',
                borderRadius: 4,
                fontWeight: 600,
              }}
            >
              Khách hàng
            </span>
            {job.clientRating && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: '#854D0E',
                  background: '#FEF9C3',
                  padding: '1px 6px',
                  borderRadius: 4,
                }}
              >
                <StarIcon size={11} weight="fill" color="#EAB308" />
                {job.clientRating}
              </span>
            )}
          </div>

          <div
            style={{
              fontSize: 12.5,
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 4,
            }}
          >
            <ClockIcon size={13} color="#94A3B8" />
            <span>Đăng {job.postedAgo}</span>
            {job.duration && (
              <>
                <span>•</span>
                <span>Thời hạn: {job.duration}</span>
              </>
            )}
            {job.hoursPerDay && (
              <>
                <span>•</span>
                <span style={{ color: '#0A66C2', fontWeight: 600 }}>{job.hoursPerDay}h/ngày</span>
              </>
            )}
          </div>
        </div>

        {/* Budget + save */}
        <div
          style={{
            flexShrink: 0,
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <div
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '6px 12px',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 14.5,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            {job.budget}
          </div>
          <button
            type="button"
            onClick={handleBookmarkClick}
            aria-label={saved ? 'Bỏ lưu dự án' : 'Lưu dự án'}
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              minHeight: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: saved ? '#EFF6FF' : '#fff',
              border: `1px solid ${saved ? '#BFDBFE' : '#E2E8F0'}`,
              borderRadius: 8,
              cursor: 'pointer',
              color: saved ? '#0A66C2' : '#94A3B8',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#F1F5F9'
              el.style.color = '#0A66C2'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = saved ? '#EFF6FF' : '#fff'
              el.style.color = saved ? '#0A66C2' : '#94A3B8'
            }}
            title={saved ? 'Đã lưu' : 'Lưu dự án'}
          >
            <BookmarkIcon size={16} weight={saved ? 'fill' : 'regular'} />
          </button>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: '#475569',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          margin: 0,
        }}
      >
        {job.description}
      </p>

      {/* Job Key Performance Indicators / Metrics Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 14,
          padding: '7px 12px',
          background: '#F8FAFC',
          borderRadius: 8,
          border: '1px solid #F1F5F9',
          fontSize: 12,
          color: '#475569',
        }}
      >
        {/* Positions Recruitment Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <UsersIcon size={14} color="#0A66C2" weight="bold" />
          <span>
            Tuyển:{' '}
            <strong style={{ color: '#0F172A' }}>
              {job.filledPositions}/{job.openPositions}
            </strong>{' '}
            người
          </span>
        </div>

        {/* Views Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <EyeIcon size={14} color="#64748B" />
          <span>
            <strong style={{ color: '#0F172A' }}>{job.viewsCount}</strong> lượt xem
          </span>
        </div>

        {/* Submits / Proposals Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <PaperPlaneTiltIcon size={14} color="#057642" />
          <span>
            <strong style={{ color: '#0F172A' }}>{job.submitsCount}</strong> lượt ứng tuyển
          </span>
          {job.submitsCount < 5 && (
            <span
              style={{
                background: '#DCFCE7',
                color: '#15803D',
                fontSize: 10.5,
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: 4,
              }}
            >
              Ít cạnh tranh
            </span>
          )}
        </div>

        {/* Hours / day commitment */}
        {job.hoursPerDay && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ClockIcon size={14} color="#0A66C2" />
            <span>
              <strong style={{ color: '#0F172A' }}>{job.hoursPerDay}h</strong> / ngày
            </span>
          </div>
        )}
      </div>

      {/* Skills footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          paddingTop: 2,
        }}
      >
        {job.skills.map((skill) => (
          <span
            key={skill}
            style={{
              background: '#F1F5F9',
              color: '#334155',
              padding: '3px 9px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 500,
              border: '1px solid #E2E8F0',
              transition: 'all 150ms ease',
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
