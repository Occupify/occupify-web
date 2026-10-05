export const siteConfig = {
  name: 'Occupify',
  title: 'Occupify — Nền tảng Kết nối Freelancer & Doanh nghiệp Số 1',
  description:
    'Hệ sinh thái kết nối tài năng công nghệ, quản lý hợp đồng thông minh và việc làm linh hoạt tại Việt Nam.',
  url: 'https://occupify.vn',
  author: 'Occupify Team',
  supportEmail: 'support@occupify.vn',
  adminEmail: 'admin@occupify.vn',
  navLinks: [
    { label: 'Trang chủ', href: '/feed' },
    { label: 'Khám phá dự án', href: '/jobs' },
    { label: 'Mạng lưới chuyên gia', href: '/network' },
    { label: 'Dự án của tôi', href: '/projects' },
    { label: 'Tin nhắn', href: '/messages' },
    { label: 'Ví & Tài chính', href: '/wallet' },
  ],
  adminNavLinks: [
    { label: 'Tổng quan', href: '/admin' },
    { label: 'Người dùng', href: '/admin/users' },
    { label: 'Dự án', href: '/admin/projects' },
    { label: 'Hợp đồng', href: '/admin/contracts' },
    { label: 'Báo cáo vi phạm', href: '/admin/violations' },
    { label: 'Tài chính hệ thống', href: '/admin/finance' },
  ],
} as const
