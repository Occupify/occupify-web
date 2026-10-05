import * as React from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'

export interface AuthInputProps {
  label: string
  type?: 'text' | 'password' | 'email'
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  id?: string
  error?: string
}

export function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  id,
  error,
}: AuthInputProps) {
  const [show, setShow] = React.useState(false)
  const [focused, setFocused] = React.useState(false)
  const generatedId = React.useId()
  const inputId = id || generatedId
  const isPassword = type === 'password'

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        htmlFor={inputId}
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#334155',
          display: 'block',
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: '#EF4444', marginLeft: 3 }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={inputId}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: isPassword ? '10px 40px 10px 14px' : '10px 14px',
            border: `1px solid ${error ? '#EF4444' : focused ? '#0A66C2' : '#CBD5E1'}`,
            borderRadius: 8,
            fontSize: 14,
            fontFamily: 'inherit',
            outline: 'none',
            color: '#0F172A',
            background: '#fff',
            boxSizing: 'border-box',
            transition: 'all 150ms ease',
            boxShadow: focused ? '0 0 0 3px rgba(10, 102, 194, 0.15)' : 'none',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {show ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
          </button>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4, marginBottom: 0 }}>{error}</p>
      )}
    </div>
  )
}
