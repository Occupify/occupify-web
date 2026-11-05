interface AdminStatusBadgeProps {
  status: string
  className?: string
}

interface StatusStyle {
  label: string
  bg: string
  fg: string
}

const STATUS_CONFIG: Record<string, StatusStyle> = {
  // Trạng thái tài khoản & hợp đồng
  ACTIVE: { label: 'Hoạt động', bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  'Hoạt động': { label: 'Hoạt động', bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  FLAGGED: { label: 'Bị gắn cờ', bg: 'bg-[#FEF7E0]', fg: 'text-[#B06000]' },
  'Bị gắn cờ': { label: 'Bị gắn cờ', bg: 'bg-[#FEF7E0]', fg: 'text-[#B06000]' },
  SUSPENDED: { label: 'Bị khóa', bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },
  BANNED: { label: 'Bị khóa', bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },
  LOCKED: { label: 'Bị khóa', bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },
  'Bị khóa': { label: 'Bị khóa', bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]' },

  // Trạng thái dự án
  OPEN: { label: 'Đang tuyển', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  HIRING: { label: 'Đang tuyển', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  'Đang tuyển': { label: 'Đang tuyển', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  IN_PROGRESS: { label: 'Đang thực hiện', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  'Đang thực hiện': { label: 'Đang thực hiện', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  COMPLETED: { label: 'Hoàn thành', bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  'Hoàn thành': { label: 'Hoàn thành', bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  CLOSED: { label: 'Đã đóng', bg: 'bg-[#F4F2EE]', fg: 'text-black/50' },
  'Đã đóng': { label: 'Đã đóng', bg: 'bg-[#F4F2EE]', fg: 'text-black/50' },

  // Trạng thái khiếu nại / Báo cáo vi phạm
  PENDING: { label: 'Chờ xử lý', bg: 'bg-[#FEF7E0]', fg: 'text-[#B06000]' },
  'Chờ xử lý': { label: 'Chờ xử lý', bg: 'bg-[#FEF7E0]', fg: 'text-[#B06000]' },
  INVESTIGATING: { label: 'Đang xác minh', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  'Đang xác minh': { label: 'Đang xác minh', bg: 'bg-[#EAF1FA]', fg: 'text-[#0A66C2]' },
  RESOLVED: { label: 'Đã giải quyết', bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  'Đã giải quyết': { label: 'Đã giải quyết', bg: 'bg-[#E6F4EA]', fg: 'text-[#137333]' },
  DISMISSED: { label: 'Đã bác bỏ', bg: 'bg-[#F4F2EE]', fg: 'text-black/50' },
  'Đã bác bỏ': { label: 'Đã bác bỏ', bg: 'bg-[#F4F2EE]', fg: 'text-black/50' },
  'Đã hủy / Thất bại': { bg: 'bg-[#FCE8E6]', fg: 'text-[#C03A2B]', label: 'Đã hủy / Thất bại' },
}

export function AdminStatusBadge({ status, className = '' }: AdminStatusBadgeProps) {
  const normalizedKey = status?.trim()
  const upperKey = normalizedKey?.toUpperCase()

  const config = STATUS_CONFIG[normalizedKey] ??
    STATUS_CONFIG[upperKey] ?? {
      label: status,
      bg: 'bg-[#F4F2EE]',
      fg: 'text-black/65',
    }

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold leading-normal transition-colors ${config.bg} ${config.fg} ${className}`}
    >
      {config.label}
    </span>
  )
}
