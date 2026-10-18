import { useState } from 'react'
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ReceiptIcon,
} from '@phosphor-icons/react'
import type { FinancialTransaction } from '../types'
import { formatVND } from '@/utils'

export interface FinancialTransactionsTableProps {
  transactions: FinancialTransaction[]
  itemsPerPage?: number
}

export function FinancialTransactionsTable({
  transactions,
  itemsPerPage = 5,
}: FinancialTransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(transactions.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = transactions.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Mã hợp đồng</th>
              <th className="px-6 py-4">Tên hợp đồng</th>
              <th className="px-6 py-4">Loại giao dịch</th>
              <th className="px-6 py-4">Số tiền</th>
              <th className="px-6 py-4">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 px-6 text-center">
                  <ReceiptIcon size={44} className="text-slate-300 mx-auto mb-3" weight="light" />
                  <p className="text-sm font-medium text-slate-500">
                    Không tìm thấy giao dịch nào phù hợp với bộ lọc.
                  </p>
                </td>
              </tr>
            ) : (
              paginatedItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group text-sm">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-sky-50 text-[#0A66C2] border border-sky-100/80 shadow-2xs">
                      {item.contractCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 group-hover:text-[#0A66C2] transition-colors">
                      {item.contractName}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{item.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.type === 'in' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                        <ArrowUpRightIcon size={12} weight="bold" />
                        <span>Tiền vào (+)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/60 shadow-2xs">
                        <ArrowDownRightIcon size={12} weight="bold" />
                        <span>Tiền ra (-)</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-sm sm:text-base tracking-tight ${
                        item.type === 'in' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.type === 'in'
                        ? `+${formatVND(item.amount)}`
                        : `-${formatVND(item.amount)}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-slate-500 font-medium">
                    {item.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div className="text-xs sm:text-sm text-slate-500 font-medium">
          {transactions.length === 0 ? (
            '0 giao dịch'
          ) : (
            <>
              Hiển thị{' '}
              <strong className="text-slate-800 font-bold">
                {startIndex + 1} - {Math.min(startIndex + itemsPerPage, transactions.length)}
              </strong>{' '}
              trên tổng số{' '}
              <strong className="text-slate-800 font-bold">{transactions.length}</strong> giao dịch
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <CaretLeftIcon size={12} weight="bold" />
            <span>Trước</span>
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1
            const isActive = pageNum === currentPage
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isActive
                    ? 'bg-[#0A66C2] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {pageNum}
              </button>
            )
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <span>Sau</span>
            <CaretRightIcon size={12} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
