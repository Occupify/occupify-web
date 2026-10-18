import {
  TrendDownIcon,
  TrendUpIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from '@phosphor-icons/react'
import { formatVND } from '@/utils'

export interface FinancialSummaryCardsProps {
  totalIn: number
  totalOut: number
}

export function FinancialSummaryCards({ totalIn, totalOut }: FinancialSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
      {/* Card 1: Tổng tiền vào */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Tổng tiền vào
            </span>
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              +{formatVND(totalIn || 45200000)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 mt-3">
              <TrendUpIcon size={14} weight="bold" />
              <span>+18.5% so với tháng trước</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <ArrowUpRightIcon size={28} weight="bold" />
          </div>
        </div>
      </div>

      {/* Card 2: Tổng tiền ra */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-rose-200 hover:shadow-md transition-all relative overflow-hidden group">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Tổng tiền ra
            </span>
            <div className="font-heading text-2xl sm:text-3xl font-extrabold text-rose-600 tracking-tight">
              -{formatVND(totalOut || 18500000)}
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200/60 mt-3">
              <TrendDownIcon size={14} weight="bold" />
              <span>-6.2% so với tháng trước</span>
            </div>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
            <ArrowDownRightIcon size={28} weight="bold" />
          </div>
        </div>
      </div>
    </div>
  )
}
