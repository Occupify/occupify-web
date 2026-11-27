import type { BackendReportReasonCategory } from './index.ts'

/**
 * Maps Vietnamese or custom report reasons to backend ReportReasonCategory enum
 */
export function mapReportReasonToCategory(reason: string): BackendReportReasonCategory {
  const r = (reason || '').toLowerCase().trim()
  if (r.includes('lừa đảo') || r.includes('gian lận') || r.includes('fraud')) {
    return 'FRAUD'
  }
  if (r.includes('ngoài sàn') || r.includes('outside') || r.includes('thanh toán ngoài')) {
    return 'OUTSIDE_PAYMENT'
  }
  if (r.includes('giả mạo') || r.includes('fake') || r.includes('không trung thực')) {
    return 'FAKE_INFORMATION'
  }
  if (r.includes('spam') || r.includes('quảng cáo')) {
    return 'SPAM'
  }
  if (r.includes('quấy rối') || r.includes('đe dọa') || r.includes('harass')) {
    return 'HARASSMENT'
  }
  return 'OTHER'
}
