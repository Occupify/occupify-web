import { TrashIcon } from '@phosphor-icons/react'
import { StarRating } from './star-rating'
import type { ProfileProject } from '../types'

export interface ProfileProjectsCardProps {
  projects: ProfileProject[]
  isOwnProfile?: boolean
  onDeleteClick?: (id: number) => void
}

export function ProfileProjectsCard({
  projects,
  isOwnProfile = true,
  onDeleteClick,
}: ProfileProjectsCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        padding: '24px',
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.01em',
            }}
          >
            Danh sách các dự án đã tham gia
          </span>
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              background: '#FEF3C7',
              color: '#B45309',
              padding: '2px 8px',
              borderRadius: 9999,
              border: '1px solid #FDE68A',
            }}
          >
            Tính năng đang phát triển
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {projects.map((proj) => {
          const ownerInitials = proj.owner
            .split(' ')
            .filter(Boolean)
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase()

          return (
            <div
              key={proj.id}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                padding: '16px 18px',
                background: '#F8FAFC',
                borderRadius: 10,
                border: '1px solid #F1F5F9',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: '#0A66C2',
                  border: '1px solid #DBEAFE',
                }}
              >
                {ownerInitials}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: '#0F172A',
                      marginBottom: 4,
                    }}
                  >
                    {proj.name}
                  </div>

                  {/* Actions for owner: Delete */}
                  {isOwnProfile && (
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>

                      <button
                        type="button"
                        onClick={() => onDeleteClick?.(proj.id)}
                        title="Xóa dự án"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#64748B',
                          padding: 6,
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 120ms ease',
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = '#FEF2F2'
                          el.style.color = '#DC2626'
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement
                          el.style.background = 'none'
                          el.style.color = '#64748B'
                        }}
                      >
                        <TrashIcon size={15} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>

                <p
                  style={{
                    fontSize: 13,
                    color: '#475569',
                    lineHeight: 1.6,
                    marginBottom: 8,
                  }}
                >
                  {proj.detail}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <StarRating rating={proj.rating} size={13} />
                  <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                    Đối tác: {proj.owner}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {projects.length === 0 && (
          <div
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              background: '#F8FAFC',
              borderRadius: 10,
              border: '1px dashed #CBD5E1',
              color: '#94A3B8',
              fontSize: 14,
              fontStyle: 'italic',
            }}
          >
            Tính năng hồ sơ dự án cá nhân đang được phát triển và sẽ sớm ra mắt.
          </div>
        )}
      </div>
    </div>
  )
}
