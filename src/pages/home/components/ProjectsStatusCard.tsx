import { ArrowRightIcon } from '@phosphor-icons/react'

export interface ProjectsStatusCardProps {
  myProjectsCount?: number
  employeeProjectsCount?: number
  pendingProjectsCount?: number
  onNavigateProjects?: () => void
}

export function ProjectsStatusCard({
  myProjectsCount = 0,
  employeeProjectsCount = 0,
  pendingProjectsCount = 0,
  onNavigateProjects,
}: ProjectsStatusCardProps) {
  return (
    <div
      className="pro-card"
      style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        background: '#fff',
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          letterSpacing: '-0.01em',
        }}
      >
        <span>Quản lý dự án</span>
        <span
          style={{
            fontSize: 11.5,
            background: '#EFF6FF',
            color: '#0A66C2',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 6,
            border: '1px solid #DBEAFE',
          }}
        >
          Active
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px solid #F1F5F9',
          }}
        >
          <span style={{ fontSize: 13, color: '#475569' }}>Dự án bạn quản lý</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#0F172A',
            }}
          >
            {myProjectsCount} dự án
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px solid #F1F5F9',
          }}
        >
          <span style={{ fontSize: 13, color: '#475569' }}>Dự án đang thực hiện</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#057642',
            }}
          >
            {employeeProjectsCount} hợp đồng
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            background: '#F8FAFC',
            borderRadius: 8,
            border: '1px solid #F1F5F9',
          }}
        >
          <span style={{ fontSize: 13, color: '#475569' }}>Đề xuất / Lời mời chờ</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#D97706',
            }}
          >
            {pendingProjectsCount} chờ duyệt
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onNavigateProjects}
        style={{
          width: '100%',
          marginTop: 14,
          background: '#fff',
          border: '1px solid var(--border-default)',
          borderRadius: 8,
          padding: '9px 16px',
          fontSize: 13,
          fontWeight: 600,
          color: '#0A66C2',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          transition: 'all 150ms ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = '#EFF6FF'
          el.style.borderColor = '#93C5FD'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.background = '#fff'
          el.style.borderColor = 'var(--border-default)'
        }}
      >
        <span>Vào trang Quản lý dự án</span>
        <ArrowRightIcon size={13} weight="bold" />
      </button>
    </div>
  )
}
