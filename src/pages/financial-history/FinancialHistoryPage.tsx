import { useEffect, useState } from 'react'
import { SparkleIcon, TrendUpIcon, ArrowLeftIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import {
  CashflowLineChart,
  FinancialFilterToolbar,
  FinancialSummaryCards,
  FinancialTransactionsTable,
  useFinancialHistory,
  type FinancialFilterState,
} from '@/features/wallet'

export interface FinancialHistoryPageProps {
  onBack?: () => void
}

export function FinancialHistoryPage({ onBack }: FinancialHistoryPageProps = {}) {
  const [appliedFilters, setAppliedFilters] = useState<FinancialFilterState>({
    filterType: 'all',
    startDate: '',
    endDate: '',
  })

  const { transactions, cashflowMonths, totalIn, totalOut } = useFinancialHistory(appliedFilters)

  useEffect(() => {
    document.title = 'Quản lý dòng tiền | Occupify'
  }, [])

  const handleApplyFilter = (filters: FinancialFilterState) => {
    setAppliedFilters(filters)
  }

  const handleResetFilter = () => {
    setAppliedFilters({
      filterType: 'all',
      startDate: '',
      endDate: '',
    })
  }

  return (
    <div className="min-h-full bg-slate-50/70 py-6 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb / Navigation back (if provided) & Page Title Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0A66C2] transition-colors mb-2 cursor-pointer"
              >
                <ArrowLeftIcon size={14} weight="bold" />
                <span>Quay lại</span>
              </button>
            )}
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Quản lý dòng tiền
            </h1>
            <p className="text-sm text-slate-600 font-normal mt-1 leading-relaxed">
              Theo dõi lịch sử thu nhập và chi phí phát sinh từ các dự án, hợp đồng
            </p>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-emerald-700 border border-emerald-200/80 shadow-xs self-start sm:self-center">
            <ShieldCheckIcon size={16} weight="fill" className="text-emerald-600" />
            <span>Escrow Đồng Bộ Thời Gian Thực</span>
          </div>
        </div>

        {/* Page Banner - Redesigned to match Home Hero Banner language */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF2FA] via-[#F0F6FC] to-[#DDECF9] border border-[#BFDBFE] shadow-sm mb-6 p-6 sm:p-8 lg:p-9 transition-all">
          {/* Subtle geometric pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #0A66C2 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Atmospheric luminous glows */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 rounded-full bg-sky-200/50 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 -mb-20 w-80 h-80 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-[#0A66C2] border border-sky-200 shadow-xs mb-3.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <SparkleIcon size={14} weight="fill" className="text-amber-500" />
                <span className="tracking-wide">Occupify Cashflow Management</span>
              </div>

              {/* Headline */}
              <h2 className="font-heading text-xl sm:text-2xl lg:text-[28px] font-extrabold tracking-tight text-slate-900 mb-2.5 leading-tight">
                Nắm bắt dòng tiền thông minh — Tối ưu hóa thu nhập từ hợp đồng freelance
              </h2>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Mọi khoản tiền vào và tiền ra đều được ghi nhận minh bạch theo thời gian thực. Giúp
                bạn kiểm soát chi phí dự án và xây dựng kế hoạch tài chính vững vàng.
              </p>
            </div>

            {/* Elevated Metric Island */}
            <div className="flex sm:justify-start lg:justify-end shrink-0">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:px-6 border border-sky-200/80 shadow-md flex flex-col justify-center min-w-[220px]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Thặng dư ròng tháng 9
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="font-heading text-2xl sm:text-[28px] font-extrabold text-emerald-600 tracking-tight">
                  +26.700.000 ₫
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 mt-2 self-start">
                  <TrendUpIcon size={14} weight="bold" />
                  <span>Dòng tiền tăng trưởng dương</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Summary Metric Cards */}
        <FinancialSummaryCards totalIn={totalIn} totalOut={totalOut} />

        {/* 3. Interactive Line Chart Section */}
        <CashflowLineChart data={cashflowMonths} />

        {/* 4. Filter & Search Toolbar */}
        <FinancialFilterToolbar
          appliedFilters={appliedFilters}
          onApplyFilter={handleApplyFilter}
          onResetFilter={handleResetFilter}
        />

        {/* 5. Transactions Data Table */}
        <FinancialTransactionsTable transactions={transactions} />
      </div>
    </div>
  )
}

export default FinancialHistoryPage
