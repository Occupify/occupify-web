import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold' }}>404</h1>
      <p style={{ color: '#64748B', margin: '8px 0 16px' }}>Trang không tồn tại.</p>
      <Link to="/" style={{ color: '#0A66C2', textDecoration: 'underline' }}>
        Quay lại trang chủ
      </Link>
    </div>
  )
}
