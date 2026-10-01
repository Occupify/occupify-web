import { useState } from 'react'

export interface GoogleButtonProps {
  onClick?: () => void
  label?: string
}

export function GoogleButton({ onClick, label = 'Tiếp tục với Google' }: GoogleButtonProps) {
  const [hov, setHov] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '10px 20px',
        borderRadius: 8,
        border: '1px solid',
        borderColor: hov ? '#94A3B8' : '#CBD5E1',
        background: hov ? '#F8FAFC' : '#fff',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 600,
        color: '#0F172A',
        transition: 'all 150ms ease',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Google "G" SVG */}
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      <span>{label}</span>
    </button>
  )
}
