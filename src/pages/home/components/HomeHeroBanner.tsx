import * as React from 'react'
import { SparkleIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'

export interface HomeHeroBannerProps {
  searchKeyword: string
  onSearchChange: (keyword: string) => void
  onSearchSubmit?: () => void
  userName?: string
}

export function HomeHeroBanner({
  searchKeyword,
  onSearchChange,
  onSearchSubmit,
  userName,
}: HomeHeroBannerProps) {
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSearchSubmit?.()
  }

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.12) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(255, 255, 255, 0.08) 0%, transparent 40%), linear-gradient(135deg, #0A66C2 0%, #084E96 55%, #053366 100%)',
        borderRadius: 14,
        padding: '36px 36px 32px',
        color: '#fff',
        marginBottom: 24,
        boxShadow: '0 8px 30px rgba(10, 102, 194, 0.20)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.20)',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 14,
            letterSpacing: '0.02em',
            color: '#E0F2FE',
          }}
        >
          <SparkleIcon size={13} weight="fill" color="#93C5FD" />
          <span>Nền tảng Việc làm & Hợp đồng Freelance Chuyên nghiệp</span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 27,
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: 8,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
          }}
        >
          {userName ? `Chào mừng trở lại, ${userName}` : 'Chào mừng bạn trở lại'}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 15,
            color: 'rgba(255, 255, 255, 0.88)',
            marginBottom: 24,
            maxWidth: 680,
            lineHeight: 1.6,
          }}
        >
          Khám phá các dự án công nghệ và thiết kế chất lượng cao, ký hợp đồng điện tử bảo chứng an
          toàn và quản lý tiến độ bàn giao minh bạch.
        </p>

        {/* Quick Search Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            borderRadius: 10,
            padding: '6px 8px 6px 16px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(5, 51, 102, 0.25)',
            maxWidth: 720,
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <MagnifyingGlassIcon size={19} color="#0A66C2" weight="bold" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm dự án, công việc theo kỹ năng, vị trí hoặc doanh nghiệp..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              padding: '9px 12px',
              fontSize: 14,
              color: '#0F172A',
              fontFamily: 'inherit',
            }}
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Xóa từ khóa tìm kiếm"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <XIcon size={16} />
            </button>
          )}
          <button
            type="submit"
            style={{
              background: '#0A66C2',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '9px 22px',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 150ms ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#084fa0')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#0A66C2')}
          >
            <span>Tìm kiếm</span>
          </button>
        </form>
      </div>
    </div>
  )
}
