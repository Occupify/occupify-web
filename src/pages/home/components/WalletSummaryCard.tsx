import { WalletIcon, ArrowRightIcon } from '@phosphor-icons/react'
import { formatVND } from '@/utils'

export interface WalletSummaryCardProps {
  walletBalance?: number
  onOpenWallet?: () => void
  onOpenFinancialHistory?: () => void
}

export function WalletSummaryCard({
  walletBalance = 0,
  onOpenWallet,
  onOpenFinancialHistory,
}: WalletSummaryCardProps) {
  return (
    <div
      className="pro-card"
      style={{
        borderRadius: 12,
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        background: '#fff',
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: 14,
          letterSpacing: '-0.01em',
        }}
      >
        Ví tài khoản Occupify
      </div>

      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: 10,
          padding: '18px 20px',
          color: '#fff',
          marginBottom: 14,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: '#94A3B8',
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          Số dư khả dụng
        </div>
        <div
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
          }}
        >
          {formatVND(walletBalance)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={onOpenWallet}
          style={{
            flex: 1,
            background: '#0A66C2',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background 150ms ease',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#084fa0')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#0A66C2')}
        >
          <WalletIcon size={15} weight="bold" />
          <span>Ví của tôi</span>
        </button>

        <button
          type="button"
          onClick={onOpenFinancialHistory}
          style={{
            flex: 1,
            background: '#F8FAFC',
            color: '#0F172A',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '9px 12px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#F1F5F9'
            el.style.borderColor = '#CBD5E1'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#F8FAFC'
            el.style.borderColor = 'var(--border-default)'
          }}
        >
          <span>Thu chi</span>
          <ArrowRightIcon size={13} weight="bold" />
        </button>
      </div>
    </div>
  )
}
