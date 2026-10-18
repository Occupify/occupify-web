import { WalletIcon, ArrowRightIcon, ShieldCheckIcon } from '@phosphor-icons/react'
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
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <WalletIcon size={18} weight="fill" className="text-[#0A66C2]" />
          <span className="text-[15px] font-extrabold text-slate-900 tracking-tight">
            Ví Ký Quỹ Escrow
          </span>
        </div>
        <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
          <ShieldCheckIcon size={12} weight="fill" className="text-emerald-600" />
          <span>Bảo chứng</span>
        </span>
      </div>

      {/* Balance Card with deep slate finish */}
      <div className="bg-slate-900 rounded-xl p-4 text-white mb-3.5 border border-slate-800 shadow-sm">
        <div className="text-[11px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">
          Số dư khả dụng / Sẵn sàng rút
        </div>
        <div className="font-heading text-2xl font-extrabold tracking-tight text-white">
          {formatVND(walletBalance)}
        </div>
        <div className="text-[11.5px] text-sky-300 mt-2 flex items-center gap-1.5">
          <span>🔒 Tiền ký quỹ đảm bảo nhận đủ sau nghiệm thu</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onOpenWallet}
          className="flex-1 bg-[#0A66C2] hover:bg-[#084fa0] active:bg-[#06407f] text-white rounded-lg py-2 px-3 text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
        >
          <WalletIcon size={15} weight="bold" />
          <span>Ví của tôi</span>
        </button>

        <button
          type="button"
          onClick={onOpenFinancialHistory}
          className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 rounded-lg py-2 px-3 text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
        >
          <span>Thu chi</span>
          <ArrowRightIcon size={13} weight="bold" />
        </button>
      </div>
    </div>
  )
}

export default WalletSummaryCard
