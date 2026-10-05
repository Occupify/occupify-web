export interface JobEmptyStateProps {
  onResetFilters?: () => void
}

export function JobEmptyState({ onResetFilters }: JobEmptyStateProps) {
  return (
    <div
      className="pro-card"
      style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        padding: '54px 24px',
        textAlign: 'center',
        background: '#fff',
      }}
    >
      <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#0F172A',
          marginBottom: 8,
        }}
      >
        Không tìm thấy công việc phù hợp
      </div>
      <p
        style={{
          fontSize: 14,
          color: '#64748B',
          maxWidth: 400,
          margin: '0 auto 20px',
          lineHeight: 1.6,
        }}
      >
        Hãy thử từ khóa chung hơn hoặc điều chỉnh lại các tiêu chí bộ lọc để tiếp cận nhiều cơ hội
        việc làm hơn.
      </p>
      {onResetFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          style={{
            background: '#0A66C2',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 24px',
            fontSize: 13.5,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#084fa0')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#0A66C2')}
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  )
}
