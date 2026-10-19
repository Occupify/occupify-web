import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChartLineIcon } from '@phosphor-icons/react'
import {
  DepositModal,
  SepayCheckoutSandbox,
  WalletHeroCard,
  WalletTransactionsList,
  WithdrawModal,
  useWallet,
  type SepayOrder,
  type WalletTransaction,
} from '@/features/wallet'
import { toast } from '@/components/feedback'
import { formatVND } from '@/utils'

export interface MyWalletPageProps {
  balance?: number
  transactions?: WalletTransaction[]
  onOpenDeposit?: () => void
  onOpenWithdraw?: () => void
  onBack?: () => void
  onOpenFinancialHistory?: () => void
}

export function MyWalletPage({
  balance: propBalance,
  transactions: propTransactions,
  onOpenDeposit: propOnOpenDeposit,
  onOpenWithdraw: propOnOpenWithdraw,
  onBack: _onBack,
  onOpenFinancialHistory,
}: MyWalletPageProps = {}) {
  const navigate = useNavigate()
  const walletQuery = useWallet()

  const currentBalance = propBalance ?? walletQuery.balance
  const currentTransactions = propTransactions ?? walletQuery.transactions

  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [sepaySandboxOrder, setSepaySandboxOrder] = useState<SepayOrder | null>(null)

  useEffect(() => {
    document.title = 'Ví của tôi | Occupify'
  }, [])

  const handleOpenFinancialHistory = () => {
    if (onOpenFinancialHistory) {
      onOpenFinancialHistory()
    } else {
      navigate('/financial-history', { state: { from: '/wallet' } })
    }
  }

  const handleTriggerDepositModal = () => {
    if (propOnOpenDeposit) {
      propOnOpenDeposit()
    } else {
      setDepositModalOpen(true)
    }
  }

  const handleTriggerWithdrawModal = () => {
    if (propOnOpenWithdraw) {
      propOnOpenWithdraw()
    } else {
      setWithdrawModalOpen(true)
    }
  }

  const handleProceedToSepay = (amount: number) => {
    setDepositModalOpen(false)
    const randomCode = Math.floor(10000 + Math.random() * 90000).toString()
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
    setSepaySandboxOrder({
      orderCode: randomCode,
      amount,
      date: `${dateStr} ${timeStr}`,
    })
  }

  const handleCompleteSepayPayment = async (amount: number, orderCode: string) => {
    try {
      await walletQuery.deposit({ payload: { amount }, orderCode })
      setSepaySandboxOrder(null)
      toast.success(`Nạp tiền thành công! Đã cộng +${formatVND(amount)} vào ví.`)
    } catch {
      toast.error('Có lỗi xảy ra khi xử lý nạp tiền')
    }
  }

  const handleConfirmWithdraw = async (
    bank: string,
    accountNumber: string,
    amount: number,
    accountName: string,
  ) => {
    try {
      await walletQuery.withdraw({
        bank,
        accountNumber,
        amount,
        accountName,
      })
      setWithdrawModalOpen(false)
      toast.success(`Đã tạo lệnh rút ${formatVND(amount)} về ${bank} thành công!`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi rút tiền'
      toast.error(message)
    }
  }

  if (sepaySandboxOrder) {
    return (
      <SepayCheckoutSandbox
        order={sepaySandboxOrder}
        onSuccess={handleCompleteSepayPayment}
        onCancel={() => setSepaySandboxOrder(null)}
      />
    )
  }

  return (
    <div style={{ minHeight: '100%', background: '#F4F2EE', paddingBottom: 48 }}>
      <div style={{ maxWidth: 1128, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: 'rgba(0,0,0,0.90)',
                marginBottom: 4,
                letterSpacing: '-0.015em',
              }}
            >
              Ví của tôi
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.60)' }}>
              Quản lý số dư, nạp tiền vào ví và rút tiền về tài khoản ngân hàng
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenFinancialHistory}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 9999,
              border: '1px solid rgba(0,0,0,0.15)',
              background: '#fff',
              fontSize: 13,
              fontWeight: 600,
              color: 'rgba(0,0,0,0.75)',
              cursor: 'pointer',
            }}
          >
            <ChartLineIcon size={16} color="#0A66C2" weight="bold" /> Xem lịch sử thu chi
          </button>
        </div>

        {/* Hero Balance Card */}
        <WalletHeroCard
          balance={currentBalance}
          onOpenDeposit={handleTriggerDepositModal}
          onOpenWithdraw={handleTriggerWithdrawModal}
        />

        {/* Transactions Table Section */}
        <WalletTransactionsList transactions={currentTransactions} />
      </div>

      {/* Modals */}
      {depositModalOpen && (
        <DepositModal
          balance={currentBalance}
          onClose={() => setDepositModalOpen(false)}
          onProceedToSepay={handleProceedToSepay}
        />
      )}

      {withdrawModalOpen && (
        <WithdrawModal
          balance={currentBalance}
          onClose={() => setWithdrawModalOpen(false)}
          onConfirmWithdraw={handleConfirmWithdraw}
        />
      )}
    </div>
  )
}

export default MyWalletPage
