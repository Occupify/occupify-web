
interface AdminStatusBadgeProps {
  status: string
  className?: string
}

const STATUS_CONFIG: Record<string, { bg: string; fg: string }> = {
  'Hoạt động': { bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  'Đang tuyển': { bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  'Đang thực hiện': { bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  'Hoàn thành': { bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  'Đã giải quyết': { bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  'Bị gắn cờ': { bg: 'bg-[#FEF7E0]', fg: 'text-[#B06000]' },
  'Chờ xử lý': { bg: 'bg-[#FEF7E0]', fg: 'text-[#B06000]' },
  'Bị khóa': { bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },
  'Đã hủy / Thất bại': { bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },
  'Đã bác bỏ': { bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },
  'Đã đóng': { bg: 'bg-[#F4F2EE]', fg: 'text-black/50' },
}

export function AdminStatusBadge({ status, className = '' }: AdminStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { bg: 'bg-[#F4F2EE]', fg: 'text-black/65' }

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold leading-normal transition-colors ${config.bg} ${config.fg} ${className}`}
    >
      {status}
    </span>
  )
}
