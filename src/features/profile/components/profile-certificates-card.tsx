import { CertificateIcon, PlusIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { ProfileCertificate } from '../types'

export interface ProfileCertificatesCardProps {
  certificates: ProfileCertificate[]
  isOwnProfile?: boolean
  onAddClick?: () => void
  onEditClick?: (index: number, cert: ProfileCertificate) => void
  onDeleteClick?: (index: number) => void
}

export function ProfileCertificatesCard({
  certificates,
  isOwnProfile = true,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: ProfileCertificatesCardProps) {
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
          Bằng cấp & Chứng chỉ chuyên môn
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
            <span>Thêm chứng chỉ</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {certificates.map((cert, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '12px 14px',
              borderRadius: 8,
              background: '#F8FAFC',
              border: '1px solid #F1F5F9',
              gap: 12,
            }}
          >
            <div
              style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1, minWidth: 0 }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#D97706',
                }}
              >
                <CertificateIcon size={24} weight="fill" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    color: '#0F172A',
                  }}
                >
                  {cert.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: '#64748B',
                    marginTop: 3,
                  }}
                >
                  {cert.issuer} · Năm cấp: {cert.year}
                </div>
              </div>
            </div>

            {/* Actions for owner: Edit / Delete */}
            {isOwnProfile && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => onEditClick?.(idx, cert)}
                  title="Chỉnh sửa chứng chỉ"
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
                  title="Xóa chứng chỉ"
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

        {certificates.length === 0 && (
          <p
            style={{
              fontSize: 13.5,
              color: '#94A3B8',
              textAlign: 'center',
              padding: '20px 0',
              margin: 0,
            }}
          >
            Chưa có bằng cấp hoặc chứng chỉ nào được thêm.
          </p>
        )}
      </div>
    </div>
  )
}
