import { GraduationCapIcon, PlusIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { ProfileEducation } from '../types'

export interface ProfileEducationCardProps {
  education: ProfileEducation[]
  isOwnProfile?: boolean
  onAddClick?: () => void
  onEditClick?: (index: number, edu: ProfileEducation) => void
  onDeleteClick?: (index: number) => void
}

export function ProfileEducationCard({
  education,
  isOwnProfile = true,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: ProfileEducationCardProps) {
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
        <span
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.01em',
          }}
        >
          Học vấn
        </span>

        {isOwnProfile && (
          <button
            type="button"
            onClick={onAddClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              color: '#0A66C2',
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              padding: '5px 12px',
              borderRadius: 6,
              transition: 'all 120ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#DBEAFE'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#EFF6FF'
            }}
          >
            <PlusIcon size={14} weight="bold" />
            <span>Thêm học vấn</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {education.map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 18px',
              background: '#F8FAFC',
              borderRadius: 10,
              border: '1px solid #F1F5F9',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#0A66C2',
                }}
              >
                <GraduationCapIcon size={22} weight="fill" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: '#0F172A',
                  }}
                >
                  {item.school}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: '#64748B',
                    marginTop: 2,
                  }}
                >
                  Thời gian học: {item.period}
                </div>
              </div>
            </div>

            {/* Actions for owner: Edit / Delete */}
            {isOwnProfile && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => onEditClick?.(idx, item)}
                  title="Chỉnh sửa học vấn"
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
                    el.style.background = '#EFF6FF'
                    el.style.color = '#0A66C2'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'none'
                    el.style.color = '#64748B'
                  }}
                >
                  <PencilSimpleIcon size={15} weight="bold" />
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteClick?.(idx)}
                  title="Xóa học vấn"
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
        ))}

        {education.length === 0 && (
          <p
            style={{
              fontSize: 13.5,
              color: '#94A3B8',
              textAlign: 'center',
              padding: '20px 0',
              margin: 0,
            }}
          >
            Chưa có thông tin học vấn nào được thêm.
          </p>
        )}
      </div>
    </div>
  )
}
