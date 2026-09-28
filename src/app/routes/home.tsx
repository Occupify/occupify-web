import { env } from '@/config/env'

export default function HomePage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
        {env.appName} Workspace
      </h1>
      <p style={{ color: '#64748B', marginBottom: '24px' }}>
        Môi trường hiện tại: <code>{env.appEnv}</code> | API Base: <code>{env.apiBaseUrl}</code>
      </p>

      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', background: '#F8FAFC' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
          Workspace scaffolded successfully
        </h2>
        <p style={{ fontSize: '14px', color: '#334155', margin: 0 }}>
          Sẵn sàng để phát triển các feature modules theo cấu trúc Bulletproof React.
        </p>
      </div>
    </div>
  )
}
