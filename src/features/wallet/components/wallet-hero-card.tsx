import { useState } from 'react'
import { ArrowUpRightIcon, EyeIcon, EyeSlashIcon, PlusIcon } from '@phosphor-icons/react'
import { formatVND } from '@/utils'

export interface WalletHeroCardProps {
  balance: number
  onOpenDeposit: () => void
  onOpenWithdraw: () => void
}

export function WalletHeroCard({ balance, onOpenDeposit, onOpenWithdraw }: WalletHeroCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0A66C2 0%, #06407F 100%)',
        borderRadius: 12,
        padding: '28px 32px',
        marginBottom: 20,
        color: '#fff',
        boxShadow: '0 8px 24px rgba(10,102,194,0.22)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Top balance info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.80)',
              textTransform: 'uppercase',
            }}
          >
            Số dư khả dụng
          </span>
          <button
            type="button"
            onClick={() => setShowBalance((v) => !v)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: 9999,
              color: '#fff',
              padding: '3px 8px',
              fontSize: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            {showBalance ? (
              <EyeSlashIcon size={14} weight="bold" />
            ) : (
              <EyeIcon size={14} weight="bold" />
            )}
            <span>{showBalance ? 'Ẩn số dư' : 'Hiện số dư'}</span>
          </button>
        </div>

        {/* Main Balance Display */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: '#fff',
            marginBottom: 24,
          }}
        >
          {showBalance ? formatVND(balance) : '•••••••• ₫'}
        </div>

        {/* Action Buttons: Nạp tiền vào ví & Rút tiền */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onOpenDeposit}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              background: '#fff',
              color: '#0A66C2',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'transform 150ms ease',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')
            }
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'none')}
          >
            <PlusIcon size={18} weight="bold" color="#0A66C2" /> Nạp tiền vào ví
          </button>

          <button
            type="button"
            onClick={onOpenWithdraw}
            style={{
              padding: '12px 24px',
              borderRadius: 8,
              border: '1.5px solid rgba(255,255,255,0.40)',
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              backdropFilter: 'blur(6px)',
              transition: 'all 150ms ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.20)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'rgba(255,255,255,0.12)'
              el.style.transform = 'none'
            }}
          >
            <ArrowUpRightIcon size={18} weight="bold" /> Rút tiền
          </button>
        </div>
      </div>

      {/* Decorative background shape */}
      <div
        style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
