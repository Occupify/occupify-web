import {
  SealCheckIcon,
  EnvelopeIcon,
  WarningIcon,
  PencilSimpleIcon,
  MapPinIcon,
} from '@phosphor-icons/react'
import type { ProfileData } from '../types'
import { nameToGmail } from '../api'

export interface ProfileHeaderCardProps {
  profile: ProfileData
  isOwnProfile?: boolean
  onReportClick?: () => void
  onEditClick?: () => void
}

export function ProfileHeaderCard({
  profile,
  isOwnProfile = true,
  onReportClick,
  onEditClick,
}: ProfileHeaderCardProps) {
  const avgRating =
    profile.reviews.length > 0
      ? (profile.reviews.reduce((sum, r) => sum + r.rating, 0) / profile.reviews.length).toFixed(1)
      : '5.0'

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const gmail = nameToGmail(profile.name)

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {/* Cover Image banner with gradient backdrop fallback */}
      <div
        style={{
          height: 180,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(120deg, #04305E 0%, #0A66C2 60%, #1E88E5 100%)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=200&fit=crop&auto=format&q=80"
          alt="Profile Cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>

      <div style={{ padding: '0 24px 24px' }}>
        {/* Avatar positioned over cover boundary */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: -50, marginBottom: 14 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: '4px solid #fff',
              background: 'linear-gradient(135deg, #0A66C2 0%, #084FA0 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              fontWeight: 800,
              color: '#fff',
              userSelect: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
              position: 'relative',
            }}
          >
            {initials}
            {/* Verified badge icon on avatar */}
            <div
              style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                background: '#fff',
                borderRadius: '50%',
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              <SealCheckIcon size={20} weight="fill" color="#0A66C2" />
            </div>
          </div>
        </div>

        {/* Identity & Actions row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            {/* Name + Verified Badge */}
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>{profile.name}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#EAF1FA',
                  color: '#0A66C2',
                  padding: '3px 10px',
                  borderRadius: 9999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  border: '1px solid #DBEAFE',
                }}
              >
                <SealCheckIcon size={14} weight="fill" />
                Đã xác minh
              </span>
            </div>

            {/* Professional Headline */}
            <div
              style={{
                fontSize: 14.5,
                color: '#475569',
                marginTop: 6,
                fontWeight: 500,
              }}
            >
              {profile.headline}
            </div>

            {/* Contact Email & Location badges */}
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: '#64748B',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#F1F5F9',
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid #E2E8F0',
                }}
              >
                <EnvelopeIcon size={15} color="#0A66C2" weight="bold" />
                <span>{gmail}</span>
              </div>

              {profile.location && (
                <div
                  style={{
                    fontSize: 13,
                    color: '#64748B',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#F8FAFC',
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <MapPinIcon size={15} color="#64748B" weight="bold" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
            {isOwnProfile && (
              <button
                type="button"
                onClick={onEditClick}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--border-default)',
                  background: '#fff',
                  color: '#0F172A',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 150ms ease',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = '#0A66C2'
                  el.style.color = '#0A66C2'
                  el.style.background = '#EFF6FF'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = 'var(--border-default)'
                  el.style.color = '#0F172A'
                  el.style.background = '#fff'
                }}
              >
                <PencilSimpleIcon size={16} weight="bold" />
                <span>Chỉnh sửa thông tin</span>
              </button>
            )}

            {!isOwnProfile && (
              <button
                type="button"
                onClick={onReportClick}
                style={{
                  padding: '8px 18px',
                  borderRadius: 9999,
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  color: '#475569',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13.5,
                  fontFamily: 'inherit',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#FEF2F2'
                  el.style.borderColor = '#F87171'
                  el.style.color = '#DC2626'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#fff'
                  el.style.borderColor = '#E2E8F0'
                  el.style.color = '#475569'
                }}
              >
                <WarningIcon size={16} weight="bold" />
                <span>Báo cáo</span>
              </button>
            )}
          </div>
        </div>

        {/* Minimal Stats Strip */}
        <div
          style={{
            marginTop: 20,
            background: '#F8FAFC',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            padding: '16px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 12,
            alignItems: 'center',
          }}
        >
          {[
            {
              label: 'Đúng tiến độ',
              value: `${profile.onTimeRate}%`,
            },
            {
              label: 'Dự án thành công',
              value: `${profile.successRate}%`,
            },
            {
              label: 'Đánh giá trung bình',
              value: `${avgRating} / 5.0`,
            },
            {
              label: 'Điểm tín nhiệm',
              value: `${profile.creditScore} / 100`,
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              style={{
                padding: '0 12px',
                borderRight: idx < 3 ? '1px solid #E2E8F0' : 'none',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.15,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#64748B',
                  marginTop: 4,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
