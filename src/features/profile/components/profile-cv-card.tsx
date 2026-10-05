import * as React from 'react'
import { FileTextIcon, PaperclipIcon } from '@phosphor-icons/react'

export interface ProfileCvCardProps {
  isOwnProfile?: boolean
  cvFileName?: string
  cvUrl?: string
  userName?: string
  onUploadCv?: (file: File) => void
}

export function ProfileCvCard({
  isOwnProfile = true,
  cvFileName: initialFileName,
  cvUrl,
  userName = 'Ứng viên',
  onUploadCv,
}: ProfileCvCardProps) {
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const currentFileName = uploadedFileName ?? initialFileName ?? ''

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
      onUploadCv?.(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
      onUploadCv?.(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const effectiveFileName = currentFileName || `CV_${userName.replace(/\s+/g, '_')}.pdf`

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
          fontSize: 17,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: '1px solid var(--border-subtle)',
          letterSpacing: '-0.01em',
        }}
      >
        CV & Hồ sơ năng lực
      </div>

      {isOwnProfile ? (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {currentFileName ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                background: '#EFF6FF',
                borderRadius: 10,
                border: '1px solid #BFDBFE',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: '#DBEAFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#0A66C2',
                }}
              >
                <FileTextIcon size={24} weight="fill" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 14.5,
                    color: '#0A66C2',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentFileName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#64748B',
                    marginTop: 2,
                  }}
                >
                  CV đã tải lên thành công · Định dạng PDF/DOCX
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '7px 16px',
                  borderRadius: 9999,
                  border: '1px solid #0A66C2',
                  background: '#fff',
                  color: '#0A66C2',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  flexShrink: 0,
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#0A66C2'
                  el.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = '#fff'
                  el.style.color = '#0A66C2'
                }}
              >
                Thay thế
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                padding: '32px 20px',
                border: '2px dashed #CBD5E1',
                borderRadius: 10,
                cursor: 'pointer',
                background: '#F8FAFC',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = '#0A66C2'
                el.style.background = '#EFF6FF'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = '#CBD5E1'
                el.style.background = '#F8FAFC'
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                }}
              >
                <PaperclipIcon size={24} weight="bold" />
              </div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                Tải lên CV của bạn
              </div>
              <div style={{ fontSize: 12, color: '#64748B' }}>
                Hỗ trợ định dạng PDF, DOC, DOCX (Tối đa 15MB)
              </div>
            </div>
          )}
        </>
      ) : (
        <a
          href={cvUrl || '#'}
          download={effectiveFileName}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '16px 20px',
            background: '#EFF6FF',
            borderRadius: 10,
            border: '1px solid #BFDBFE',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 150ms ease',
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
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#0A66C2',
            }}
          >
            <FileTextIcon size={24} weight="fill" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14.5, color: '#0A66C2' }}>
              {effectiveFileName}
            </div>
            <div
              style={{
                fontSize: 12,
                color: '#64748B',
                marginTop: 2,
              }}
            >
              Nhấn để tải xuống hồ sơ đính kèm
            </div>
          </div>
        </a>
      )}
    </div>
  )
}
