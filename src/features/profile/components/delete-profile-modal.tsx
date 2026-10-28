import * as React from 'react'
import { WarningIcon, XIcon } from '@phosphor-icons/react'

export interface DeleteProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting?: boolean
}

export type DeleteAccountModalProps = DeleteProfileModalProps

export function DeleteProfileModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteProfileModalProps) {
  const [confirmationInput, setConfirmationInput] = React.useState('')

  if (!isOpen) return null

  const isConfirmed = confirmationInput.trim().toUpperCase() === 'DELETE'

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (isConfirmed && !isDeleting) {
      onConfirm()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose()
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: '28px 32px',
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid var(--border-default)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                flexShrink: 0,
              }}
            >
              <WarningIcon size={24} weight="fill" />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                Xóa tài khoản Occupify
              </h2>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: 13,
                  color: '#64748B',
                }}
              >
                Hành động này sẽ hủy kích hoạt tài khoản của bạn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              color: '#64748B',
              padding: 4,
            }}
          >
            <XIcon size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: '#FFF1F2',
              border: '1px solid #FECDD3',
              borderRadius: 8,
              padding: '12px 14px',
              fontSize: 13,
              color: '#9F1239',
              lineHeight: 1.5,
              marginBottom: 18,
            }}
          >
            <strong>Cảnh báo:</strong> Tài khoản của bạn sẽ bị đánh dấu xóa trong hệ thống. Bạn sẽ
            bị đăng xuất ngay lập tức khỏi mọi thiết bị.
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              htmlFor="delete-account-confirm-input"
              style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 600,
                color: '#334155',
                marginBottom: 6,
              }}
            >
              Nhập chữ <strong style={{ color: '#EF4444' }}>DELETE</strong> để xác nhận:
            </label>
            <input
              id="delete-account-confirm-input"
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="DELETE"
              disabled={isDeleting}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                fontSize: 14,
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              style={{
                padding: '9px 18px',
                borderRadius: 8,
                border: '1px solid #CBD5E1',
                background: '#fff',
                fontSize: 14,
                fontWeight: 600,
                color: '#475569',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isConfirmed || isDeleting}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: 'none',
                background: isConfirmed && !isDeleting ? '#EF4444' : '#FCA5A5',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: isConfirmed && !isDeleting ? 'pointer' : 'not-allowed',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa tài khoản'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const DeleteAccountModal = DeleteProfileModal
