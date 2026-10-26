interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  itemLabel?: string
  onPageChange: (page: number) => void
  className?: string
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalCount,
  itemLabel = 'tài khoản',
  onPageChange,
  className = '',
}: AdminPaginationProps) {
  if (totalCount === 0) return null

  return (
    <div
      className={`flex items-center justify-between border-t border-black/8 px-4 py-3 text-sm text-black/60 ${className}`}
    >
      <div>
        Trang <strong className="text-black/90 font-bold">{currentPage}</strong> /{' '}
        <strong className="text-black/90 font-bold">{totalPages}</strong> ({totalCount} {itemLabel})
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Trước
        </button>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Tiếp theo
        </button>
      </div>
    </div>
  )
}
