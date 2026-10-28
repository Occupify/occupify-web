import { PencilSimpleIcon } from '@phosphor-icons/react'

export interface ProfileIntroCardProps {
  intro?: string
  isOwnProfile?: boolean
  onEditClick?: () => void
}

export function ProfileIntroCard({
  intro,
  isOwnProfile = true,
  onEditClick,
}: ProfileIntroCardProps) {
  const hasIntro = Boolean(intro && intro.trim().length > 0)

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
          marginBottom: 14,
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
          Giới thiệu
        </span>

        {isOwnProfile && (
          <button
            type="button"
            onClick={onEditClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              color: '#0A66C2',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
              transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = '#EFF6FF'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.background = 'none'
            }}
          >
            <PencilSimpleIcon size={14} weight="bold" />
            <span>Chỉnh sửa</span>
          </button>
        )}
      </div>

      {hasIntro ? (
        <p
          style={{
            fontSize: 14,
            color: '#334155',
            lineHeight: 1.75,
            margin: 0,
            whiteSpace: 'pre-line',
          }}
        >
          {intro}
        </p>
      ) : (
        <p
          style={{
            fontSize: 14,
            color: '#94A3B8',
            fontStyle: 'italic',
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          Chưa có thông tin giới thiệu.
        </p>
      )}
    </div>
  )
}
