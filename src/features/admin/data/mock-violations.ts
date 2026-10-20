import type { AdminViolation } from '../types'

export const ADMIN_VIOLATIONS_DATA: AdminViolation[] = [
  {
    id: '#RP-1041',
    reporter: { name: 'Trần Thị Hương', initials: 'TH', color: '#057642' },
    target: 'Tài khoản: @tiendung_vn',
    category: 'Tài khoản',
    time: '14/09/2026 14:15',
    status: 'Chờ xử lý',
    reason: 'Tài khoản liên tục spam tin nhắn quảng cáo không liên quan vào các dự án và nhóm.',
    evidence:
      'Tài khoản @tiendung_vn đã gửi 150+ tin nhắn spam trong 48 giờ cho nhiều freelancer và client. Nội dung là quảng cáo dịch vụ bên ngoài platform.',
    evidenceImage:
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '#RP-1039',
    reporter: { name: 'Hoàng Minh Tuấn', initials: 'MT', color: '#D97706' },
    target: 'Dự án: #HD-8431',
    category: 'Dự án',
    time: '13/09/2026 11:00',
    status: 'Đã giải quyết',
    reason: 'Client từ chối thanh toán sau khi nhận kết quả, vi phạm điều khoản hợp đồng.',
    evidence:
      'Hợp đồng #HD-8431 đã bị hủy đơn phương bởi client sau khi freelancer giao sản phẩm hoàn chỉnh. Client không cung cấp lý do hợp lệ.',
    actionTaken: 'Đóng băng dự án và yêu cầu hoàn trả ký quỹ',
    resolveNote:
      'Đã xác minh freelancer hoàn thành 100% bàn giao. Buộc giải ngân và cảnh cáo client vi phạm hợp đồng.',
    resolvedAt: '13/09/2026 15:30',
  },
  {
    id: '#RP-1035',
    reporter: { name: 'Ngô Đức Hải', initials: 'NH', color: '#6366F1' },
    target: 'Tài khoản: @lananh_designer',
    category: 'Tài khoản',
    time: '10/09/2026 16:30',
    status: 'Chờ xử lý',
    reason: 'Tài khoản sử dụng portfolio người khác để đăng ký dự án, vi phạm bản quyền.',
    evidence:
      'Người dùng @lananh_designer đã tải lên 12 ảnh thiết kế của Dribbble user khác và tuyên bố là sản phẩm của mình khi nộp hồ sơ cho 5 dự án thiết kế khác nhau.',
    evidenceImage:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80',
  },
]
