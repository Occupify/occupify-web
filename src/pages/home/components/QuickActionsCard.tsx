import { SparkleIcon, FolderPlusIcon, FileTextIcon, ArrowRightIcon } from '@phosphor-icons/react'

export interface QuickActionsCardProps {
  onCreateProject: () => void
  onCreateContract: () => void
}

export function QuickActionsCard({ onCreateProject, onCreateContract }: QuickActionsCardProps) {
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
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          letterSpacing: '-0.01em',
        }}
      >
        <SparkleIcon size={16} color="#0A66C2" weight="fill" />
        <span>Hành động nhanh</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Create Project Button */}
        <button
          type="button"
          onClick={onCreateProject}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid var(--border-default)',
            background: '#fff',
            color: '#0F172A',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 150ms ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#0A66C2'
            el.style.background = '#F8FAFC'
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border-default)'
            el.style.background = '#fff'
            el.style.transform = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#EFF6FF',
                color: '#0A66C2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FolderPlusIcon size={19} weight="bold" />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                + Đăng tin tuyển dụng / Dự án
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 1 }}>
                Tìm nhân sự hoặc quản trị team
              </div>
            </div>
          </div>
          <ArrowRightIcon size={14} color="#94A3B8" />
        </button>

        {/* Create Contract Button */}
        <button
          type="button"
          onClick={onCreateContract}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            width: '100%',
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid var(--border-default)',
            background: '#fff',
            color: '#0F172A',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 150ms ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = '#059669'
            el.style.background = '#F8FAFC'
            el.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.borderColor = 'var(--border-default)'
            el.style.background = '#fff'
            el.style.transform = 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileTextIcon size={19} weight="bold" />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>
                + Soạn thảo hợp đồng
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 1 }}>
                Mời freelancer & thiết lập điều khoản giao việc
              </div>
            </div>
          </div>
          <ArrowRightIcon size={14} color="#94A3B8" />
        </button>
      </div>
    </div>
  )
}
