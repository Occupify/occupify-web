import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        fontFamily:
          "'Plus Jakarta Sans', 'Inter', 'Source Sans 3', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>404</h1>
      <p style={{ color: '#64748B', margin: '8px 0 16px' }}>Trang không tồn tại.</p>
      <Link to="/" style={{ color: '#0A66C2', textDecoration: 'underline' }}>
        Quay lại trang chủ
      </Link>
    </div>
  )
}

export default NotFoundPage
