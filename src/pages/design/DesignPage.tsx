import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  MagnifyingGlassIcon,
  EyeIcon,
  EyeSlashIcon,
  BriefcaseIcon,
  BuildingsIcon,
  MapPinIcon,
  SparkleIcon,
  PaperPlaneTiltIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ShareNetworkIcon,
  BookmarkSimpleIcon,
} from '@phosphor-icons/react'
import {
  Button,
  Input,
  Card,
  Badge,
  Chip,
  Avatar,
  Modal,
  Alert,
  Select,
  Checkbox,
  Divider,
} from '@/components/ui'
import { toast } from '@/components/feedback'
import { env } from '@/config/env'

export function DesignPage() {
  // Interactive States for showcase
  const [btnLoading, setBtnLoading] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(true)
  const [activeChips, setActiveChips] = React.useState<string[]>([
    'React',
    'TypeScript',
    'Frontend',
  ])
  const [showAlert, setShowAlert] = React.useState(true)

  const toggleChip = (chip: string) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip],
    )
  }

  const allSkills = [
    'React',
    'TypeScript',
    'Frontend',
    'Tailwind CSS',
    'Node.js',
    'UI/UX Design',
    'Product Management',
  ]

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[rgba(0,0,0,0.90)] font-sans antialiased pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-[rgba(0,0,0,0.08)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0A66C2] rounded-[4px] flex items-center justify-center text-white font-heading font-extrabold text-[20px] shadow-xs select-none">
              in
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-[19px] text-[#0A66C2] tracking-tight">
                  Occupify
                </span>
                <Badge variant="primary">Design System v1.0</Badge>
              </div>
              <p className="text-[12px] text-[rgba(0,0,0,0.50)] m-0 hidden sm:block">
                Professional Trust &bull; Modern Minimal &bull; Warm Canvas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="success" pill>
              Env: {env.appEnv}
            </Badge>
            <Link to="/">
              <Button variant="secondary" size="sm">
                Xem Landing Page
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              leftIcon={<SparkleIcon size={14} weight="fill" />}
            >
              Xem Modal Mẫu
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 space-y-10">
        {/* Intro Hero Section */}
        <div className="bg-white rounded-[8px] p-6 sm:p-8 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="opentowork">OPEN TO WORK READY</Badge>
                <Badge variant="premium">PREMIUM GOLD</Badge>
              </div>
              <h1 className="text-display text-[28px] sm:text-[34px] font-heading font-bold text-[rgba(0,0,0,0.90)] tracking-tight">
                Bộ Component Cơ Bản & Design System Occupify
              </h1>
              <p className="text-[15px] text-[rgba(0,0,0,0.65)] leading-relaxed">
                Được chuyển giao chính xác từ bản thiết kế{' '}
                <code className="bg-[#EAF1FA] text-[#0A66C2] px-2 py-0.5 rounded text-[13px] font-semibold">
                  Occupify-website-design
                </code>
                : Canvas warm beige (<code className="text-[#0A66C2]">#F4F2EE</code>), Brand True
                Blue (<code className="text-[#0A66C2]">#0A66C2</code>), typography Source Sans 3
                &amp; Plus Jakarta Sans, cùng các component Button pill, Input, Card compound,
                Badge, Avatar, Modal và Alert.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={() => setBtnLoading(!btnLoading)}
                isLoading={btnLoading}
                leftIcon={<PaperPlaneTiltIcon size={16} weight="bold" />}
              >
                {btnLoading ? 'Đang xử lý...' : 'Test Trạng Thái Loading'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
                rightIcon={<ArrowRightIcon size={16} weight="bold" />}
              >
                Mở Modal Trải Nghiệm
              </Button>
            </div>
          </div>
        </div>

        {/* Section 1: Typography & Hierarchy */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-h2 font-heading font-semibold text-[20px]">
                1. Hệ Thống Typography &amp; Phông Chữ
              </h2>
              <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
                Phông chính: <strong>Source Sans 3</strong> (thân bài) &amp;{' '}
                <strong>Plus Jakarta Sans</strong> (tiêu đề).
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[8px] p-6 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline border-b border-[rgba(0,0,0,0.06)] pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                  Display (32px / Bold 700 / -0.02em)
                </span>
                <div className="text-display mt-1">Kết Nối Cơ Hội &amp; Sự Nghiệp Vượt Trội</div>
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.60)]">
                Dùng cho tiêu đề trang chủ, landing hero và các headline lớn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline border-b border-[rgba(0,0,0,0.06)] pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                  H1 (24px / Semibold 600 / -0.015em)
                </span>
                <div className="text-h1 mt-1">
                  Nguyễn Minh Khoa &bull; Senior Frontend Architect
                </div>
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.60)]">
                Dùng cho tên profile, tiêu đề trang quản lý và tiêu đề modal chính.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline border-b border-[rgba(0,0,0,0.06)] pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                  H2 (20px / Semibold 600 / -0.01em)
                </span>
                <div className="text-h2 mt-1">Kinh nghiệm làm việc &amp; Dự án nổi bật</div>
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.60)]">
                Dùng cho tiêu đề các thẻ mục (Card Titles), Section headers trong trang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline border-b border-[rgba(0,0,0,0.06)] pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                  H3 (14px / Semibold 600 / -0.005em)
                </span>
                <div className="text-h3 mt-1">Trưởng nhóm kỹ thuật tại FPT Software</div>
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.60)]">
                Dùng cho tên tác giả bài đăng (post author), tên item trong danh sách.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline border-b border-[rgba(0,0,0,0.06)] pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                  Body Base (14px / Regular 400 / Line Height 1.50)
                </span>
                <p className="text-body-base mt-1 text-[rgba(0,0,0,0.85)]">
                  Occupify tối ưu hóa trải nghiệm đọc bài viết dài với khoảng cách dòng vừa vặn, độ
                  tương phản đạt chuẩn WCAG AAA trên nền beige ấm áp.
                </p>
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.60)]">
                Dùng cho nội dung bài đăng trên bảng tin, mô tả dự án, thông tin ứng viên.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-baseline">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                    Body Sm (12px / 500)
                  </span>
                  <div className="text-body-sm text-[rgba(0,0,0,0.60)] mt-0.5">
                    Đã đăng 2 giờ trước &bull; Hà Nội, Việt Nam
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)]">
                    Caption (11px / 600)
                  </span>
                  <div className="text-caption text-[rgba(0,0,0,0.45)] mt-0.5">
                    KẾT NỐI BẬC 1 &bull; 1ST DEGREE
                  </div>
                </div>
              </div>
              <p className="text-[13px] text-[rgba(0,0,0,0.60)]">
                Dùng cho nhãn phụ, thời gian đăng, huy hiệu cấp độ kết nối và degree badges.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Color Palette Swatches */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              2. Bảng Màu Thương Hiệu &amp; Design Tokens (Color Palette)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Nguyên tắc thiết kế: 85% Neutrals (Beige/White/Alphas), 10-15% Brand Blue (#0A66C2),
              dưới 5% Semantic &amp; Tertiary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Primary Blue Swatches */}
            <div className="bg-white rounded-[8px] p-5 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-3">
              <h3 className="text-h3 font-heading font-semibold">Occupify True Blue Palette</h3>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between p-2 rounded bg-[#0A66C2] text-white font-medium">
                  <span>Primary 500 (Core CTA)</span>
                  <code>#0A66C2</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#084FA0] text-white font-medium">
                  <span>Primary 600 (Hover State)</span>
                  <code>#084FA0</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#46A3E8] text-white font-medium">
                  <span>Primary 400</span>
                  <code>#46A3E8</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#C7D9EE] text-[#0A66C2] font-semibold">
                  <span>Primary 100</span>
                  <code>#C7D9EE</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#EAF1FA] text-[#0A66C2] font-semibold border border-[#BFDBFE]">
                  <span>Primary 50 (Soft Tint)</span>
                  <code>#EAF1FA</code>
                </div>
              </div>
            </div>

            {/* Surfaces & Canvas */}
            <div className="bg-white rounded-[8px] p-5 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-3">
              <h3 className="text-h3 font-heading font-semibold">Surfaces &amp; Canvas</h3>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between p-2 rounded bg-[#F4F2EE] border border-[rgba(0,0,0,0.08)] font-semibold text-[rgba(0,0,0,0.90)]">
                  <span>Canvas Warm Beige</span>
                  <code>#F4F2EE</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#FAFAF8] border border-[rgba(0,0,0,0.08)] font-semibold text-[rgba(0,0,0,0.90)]">
                  <span>Subtle Surface (Sidebar)</span>
                  <code>#FAFAF8</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#FFFFFF] border border-[rgba(0,0,0,0.12)] font-semibold text-[rgba(0,0,0,0.90)] shadow-xs">
                  <span>Elevated Surface (Card)</span>
                  <code>#FFFFFF</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[rgba(15,23,42,0.60)] text-white font-medium">
                  <span>Overlay / Backdrop</span>
                  <code>rgba(0,0,0,0.55)</code>
                </div>
              </div>
            </div>

            {/* Semantic & Identity */}
            <div className="bg-white rounded-[8px] p-5 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-3">
              <h3 className="text-h3 font-heading font-semibold">Semantic &amp; Identity</h3>
              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between p-2 rounded bg-[#44712E] text-white font-semibold">
                  <span>Open To Work Green</span>
                  <code>#44712E</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#FFF4D6] text-[#B07F00] font-semibold border border-[#FDE68A]">
                  <span>Premium Gold Badge</span>
                  <code>#B07F00</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#E5F6E8] text-[#057642] font-semibold border border-[#BBF7D0]">
                  <span>Success / Hiring</span>
                  <code>#057642</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#FBE2E2] text-[#C03A2B] font-semibold border border-[#FECACA]">
                  <span>Error / Destructive</span>
                  <code>#C03A2B</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Buttons */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              3. Nút Bấm Chuẩn Pill Shape (Button Components)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Nguyên tắc cốt lõi: Tất cả nút hành động đều có dạng bo tròn tròn trịa (Pill Shape
              9999px) đặc trưng, phân biệt rõ nét với nút vuông của enterprise UI thông thường.
            </p>
          </div>

          <div className="bg-white rounded-[8px] p-6 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)] mb-3 block">
                Các Biến Thể Nút (Variants)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Nổi Bật</Button>
                <Button variant="secondary">Secondary Outline</Button>
                <Button variant="outline">Outline Viền Đen</Button>
                <Button variant="ghost">Ghost Nút Mờ</Button>
                <Button variant="connect" leftIcon={<SparkleIcon size={14} weight="bold" />}>
                  Kết Nối
                </Button>
                <Button variant="danger">Xóa Dữ Liệu</Button>
                <Button variant="primary" disabled>
                  Đã Vô Hiệu Hóa
                </Button>
              </div>
            </div>

            <Divider />

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)] mb-3 block">
                Kích Thước Nút (Sizes: Sm, Md, Lg, Icon)
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">
                  Small (H32)
                </Button>
                <Button variant="primary" size="md">
                  Medium (H36 Default)
                </Button>
                <Button variant="primary" size="lg">
                  Large (H44 Primary CTA)
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Share"
                  leftIcon={<ShareNetworkIcon size={18} />}
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Save"
                  leftIcon={<BookmarkSimpleIcon size={18} />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Form Controls & Inputs */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              4. Thành Phần Biểu Mẫu (Form Inputs &amp; Controls)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Input chuẩn 4px radius, focus border True Blue #0A66C2 với ring bóng nhẹ; Search Input
              nền mềm soft-tint #EAF1FA.
            </p>
          </div>

          <div className="bg-white rounded-[8px] p-6 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Normal Input */}
              <Input
                label="Họ và tên đầy đủ"
                required
                placeholder="Ví dụ: Nguyễn Minh Khoa"
                helperText="Tên này sẽ hiển thị công khai trên hồ sơ của bạn."
              />

              {/* Search Input with Soft Tint */}
              <Input
                variant="search"
                label="Tìm kiếm dự án & việc làm"
                placeholder="Tìm kỹ năng, tên công ty hoặc vị trí..."
                leftIcon={<MagnifyingGlassIcon size={16} weight="bold" />}
              />

              {/* Password Input with toggle */}
              <Input
                label="Mật khẩu bảo mật"
                required
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập ít nhất 8 ký tự..."
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="cursor-pointer hover:text-[rgba(0,0,0,0.90)] p-1 rounded focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeSlashIcon size={18} weight="bold" />
                    ) : (
                      <EyeIcon size={18} weight="bold" />
                    )}
                  </button>
                }
              />

              {/* Select Dropdown */}
              <Select
                label="Lĩnh vực chuyên môn"
                required
                options={[
                  { label: 'Công nghệ thông tin / Phần mềm', value: 'it' },
                  { label: 'Thiết kế UI/UX & Đồ họa', value: 'design' },
                  { label: 'Marketing & Truyền thông', value: 'marketing' },
                  { label: 'Quản trị kinh doanh & Nhân sự', value: 'hr' },
                ]}
              />

              {/* Input with Error State */}
              <Input
                label="Địa chỉ Email"
                required
                defaultValue="invalid-email-format"
                error="Email không đúng định dạng. Vui lòng kiểm tra lại."
              />

              {/* Checkbox */}
              <div className="pt-6">
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  label="Ghi nhớ đăng nhập trên thiết bị này"
                  description="Bảo mật phiên đăng nhập trong 30 ngày tới."
                />
              </div>
            </div>

            <Divider>hoặc đăng nhập với</Divider>

            <div className="max-w-xs mx-auto">
              <Button
                variant="outline"
                fullWidth
                leftIcon={
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.86c2.26-2.09 3.685-5.17 3.685-9.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                }
              >
                Tiếp tục với Google
              </Button>
            </div>
          </div>
        </section>

        {/* Section 5: Badges, Tags & Chips */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              5. Huy Hiệu &amp; Thẻ Lọc (Badges, Status Pills &amp; Chips)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Huy hiệu định danh nghề nghiệp (Open to work, Premium, Hiring) và thẻ bộ lọc sở thích
              tương tác.
            </p>
          </div>

          <div className="bg-white rounded-[8px] p-6 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)] mb-3 block">
                Huy Hiệu Trạng Thái &amp; Định Danh (Badges)
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="opentowork">#OPENTOWORK</Badge>
                <Badge variant="hiring">#HIRING</Badge>
                <Badge variant="premium">PREMIUM GOLD</Badge>
                <Badge variant="primary">ĐANG THỰC HIỆN</Badge>
                <Badge variant="success">HOÀN THÀNH</Badge>
                <Badge variant="warning">CHỜ DUYỆT</Badge>
                <Badge variant="error">ĐÃ TỪ CHỐI</Badge>
                <Badge variant="degree">&bull; 1st</Badge>
                <Badge variant="degree">&bull; 2nd</Badge>
              </div>
            </div>

            <Divider />

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)] mb-3 block">
                Thẻ Sở Thích &amp; Bộ Lọc Tương Tác (Filter Chips - Click để chọn/bỏ chọn)
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {allSkills.map((skill) => {
                  const isActive = activeChips.includes(skill)
                  return (
                    <Chip
                      key={skill}
                      active={isActive}
                      onClick={() => toggleChip(skill)}
                      onRemove={isActive ? () => toggleChip(skill) : undefined}
                    >
                      {skill}
                    </Chip>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: Avatars */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              6. Hình Đại Diện (Avatar Components)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Tự động tính toán chữ cái đầu (Initials) cho tên tiếng Việt/Anh khi chưa có ảnh, kèm
              viền Open To Work và chỉ báo trực tuyến.
            </p>
          </div>

          <div className="bg-white rounded-[8px] p-6 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
            <div className="flex flex-wrap items-end gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar size="xs" name="Nguyễn Khoa" status="online" />
                <span className="text-[11px] text-[rgba(0,0,0,0.50)]">XS (24px)</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar size="sm" name="Trần Mai" status="online" />
                <span className="text-[11px] text-[rgba(0,0,0,0.50)]">SM (32px)</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar size="md" name="Nguyễn Minh Khoa" status="online" openToWork />
                <span className="text-[11px] text-[rgba(0,0,0,0.50)]">MD (48px Post)</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar size="lg" name="Lê Hoàng Nam" status="online" openToWork />
                <span className="text-[11px] text-[rgba(0,0,0,0.50)]">LG (64px Card)</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Avatar size="xl" name="Occupify Team" status="online" />
                <span className="text-[11px] text-[rgba(0,0,0,0.50)]">XL (96px Profile)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Cards (Compound Component) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              7. Cấu Trúc Card Hợp Thành (Compound Component Card)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Tuân thủ nghiêm ngặt mô hình Compound Component: <code>&lt;Card&gt;</code>,{' '}
              <code>&lt;Card.Header&gt;</code>, <code>&lt;Card.Title&gt;</code>,{' '}
              <code>&lt;Card.Body&gt;</code>, <code>&lt;Card.Footer&gt;</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Profile Mini Card */}
            <Card hoverable noPadding>
              <div className="h-16 bg-gradient-to-r from-[#84C5F6] via-[#0A66C2] to-[#063C7A]" />
              <div className="px-5 pb-5 pt-0">
                <div className="-mt-8 mb-3 flex items-end justify-between">
                  <Avatar size="lg" name="Nguyễn Minh Khoa" status="online" openToWork />
                  <Badge variant="opentowork">OPEN TO WORK</Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-h2 font-heading font-bold text-[18px]">Nguyễn Minh Khoa</h3>
                    <CheckCircleIcon size={16} weight="fill" className="text-[#0A66C2]" />
                  </div>
                  <p className="text-[13px] text-[rgba(0,0,0,0.60)] leading-normal">
                    Senior Fullstack Engineer &bull; React, TypeScript &amp; Cloud Native
                    Architecture
                  </p>
                  <div className="flex items-center gap-1 text-[12px] text-[rgba(0,0,0,0.50)] pt-1">
                    <MapPinIcon size={14} weight="bold" />
                    <span>Hà Nội, Việt Nam &bull; 500+ kết nối</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.06)] flex items-center justify-between">
                  <Button variant="primary" size="sm">
                    Gửi Tin Nhắn
                  </Button>
                  <Button variant="secondary" size="sm">
                    Xem Hồ Sơ
                  </Button>
                </div>
              </div>
            </Card>

            {/* Card 2: Job / Project Opportunity Card */}
            <Card hoverable>
              <Card.Header
                action={
                  <Badge variant="primary" pill>
                    Dự Án Mới
                  </Badge>
                }
              >
                <Card.Title>Xây Dựng Web App Nền Tảng Việc Làm Occupify</Card.Title>
                <Card.Description>
                  Đăng bởi Công ty Cổ phần Công nghệ FPT &bull; 1 ngày trước
                </Card.Description>
              </Card.Header>

              <Card.Body>
                <div className="space-y-3">
                  <p className="text-[14px] text-[rgba(0,0,0,0.80)] leading-relaxed">
                    Tuyển 02 lập trình viên Frontend có kinh nghiệm với React 19, TypeScript,
                    Tailwind CSS v4 và kiến trúc Feature-First để phát triển các module bảng tin,
                    ứng tuyển và quản lý hợp đồng.
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default">React 19</Badge>
                    <Badge variant="default">TypeScript</Badge>
                    <Badge variant="default">Tailwind v4</Badge>
                    <Badge variant="default">Zustand</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[13px] bg-[#FAFAF8] p-3 rounded-[6px] border border-[rgba(0,0,0,0.04)]">
                    <div>
                      <span className="text-[rgba(0,0,0,0.50)] block text-[11px]">Ngân sách:</span>
                      <span className="font-semibold text-[#0A66C2]">25.000.000 ₫ / tháng</span>
                    </div>
                    <div>
                      <span className="text-[rgba(0,0,0,0.50)] block text-[11px]">Hình thức:</span>
                      <span className="font-semibold text-[rgba(0,0,0,0.85)]">Từ xa (Remote)</span>
                    </div>
                  </div>
                </div>
              </Card.Body>

              <Card.Footer bordered>
                <div className="flex items-center gap-1.5 text-[12px] text-[rgba(0,0,0,0.55)]">
                  <BuildingsIcon size={16} />
                  <span>14 ứng viên đã nộp hồ sơ</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  leftIcon={<BriefcaseIcon size={14} weight="bold" />}
                >
                  Ứng Tuyển Ngay
                </Button>
              </Card.Footer>
            </Card>
          </div>
        </section>

        {/* Section 8: Alerts & Feedback */}
        {showAlert && (
          <section className="space-y-4">
            <div>
              <h2 className="text-h2 font-heading font-semibold text-[20px]">
                8. Hộp Thông Báo Phản Hồi (Semantic Alert Boxes)
              </h2>
            </div>

            <div className="space-y-3">
              <Alert
                variant="info"
                title="Hồ sơ của bạn đã hoàn thành 85%"
                onClose={() => setShowAlert(false)}
              >
                Hãy cập nhật thêm kỹ năng chuyên môn và chứng chỉ để tăng 3.5x cơ hội kết nối với
                nhà tuyển dụng.
              </Alert>

              <Alert variant="success" title="Cập nhật thành công">
                Các thay đổi trong hồ sơ nghề nghiệp của bạn đã được lưu tự động trên hệ thống.
              </Alert>

              <Alert variant="warning" title="Hợp đồng đang chờ xác nhận">
                Bạn có 01 hợp đồng mới đang chờ đối tác hoàn tất chữ ký số trong vòng 24 giờ tới.
              </Alert>
            </div>
          </section>
        )}

        {/* Section 9: Toast Notifications */}
        <section className="space-y-4">
          <div>
            <h2 className="text-h2 font-heading font-semibold text-[20px]">
              9. Hệ Thống Thông Báo Nổi (Toast / Snackbar Notifications)
            </h2>
            <p className="text-[13px] text-[rgba(0,0,0,0.55)]">
              Thay thế hoàn toàn <code>alert()</code> mặc định thô sơ của trình duyệt bằng Toast
              Notification hiện đại: chuẩn phong cách Occupify, tự động biến mất, hoạt ảnh trượt
              mượt mà và quản lý trạng thái tập trung với Zustand.
            </p>
          </div>

          <div className="bg-white rounded-[8px] p-6 border border-[rgba(0,0,0,0.08)] shadow-[0_0_0_1px_rgba(0,0,0,0.08)] space-y-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.45)] block">
              Thử nghiệm các loại thông báo nổi (Click để xem thông báo xuất hiện ở góc dưới bên
              phải):
            </span>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  toast.success(
                    'Hồ sơ của bạn đã được nộp thành công! Nhà tuyển dụng sẽ phản hồi trong 48 giờ.',
                    { title: 'Ứng Tuyển Thành Công' },
                  )
                }
              >
                Toast Thành Công
              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  toast.info('Bạn có 3 đề xuất việc làm phù hợp mới tại khu vực Hà Nội.', {
                    title: 'Gợi Ý Mới',
                  })
                }
              >
                Toast Thông Tin
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  toast.warning(
                    'Vui lòng hoàn thiện số điện thoại và email xác thực trong hồ sơ.',
                    { title: 'Cần Bổ Sung' },
                  )
                }
              >
                Toast Cảnh Báo
              </Button>

              <Button
                variant="danger"
                onClick={() =>
                  toast.error(
                    'Không thể gửi tin nhắn. Kết nối mạng không ổn định, vui lòng thử lại.',
                    { title: 'Thao Tác Thất Bại' },
                  )
                }
              >
                Toast Báo Lỗi
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Modal Demonstration (Compound Pattern) */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Content maxWidth="lg">
          <Modal.Header>Chi Tiết Dự Án &amp; Ứng Tuyển</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="primary">#PROJECT-9812</Badge>
                <Badge variant="opentowork">ĐANG TUYỂN DỤNG</Badge>
              </div>

              <div>
                <h3 className="text-h2 font-heading font-bold text-[18px]">
                  Xây Dựng Web App Nền Tảng Việc Làm Occupify
                </h3>
                <p className="text-[13px] text-[rgba(0,0,0,0.55)] mt-0.5">
                  Đăng bởi Nguyễn Minh Khoa &bull; Ban Quản Trị Hệ Thống Occupify
                </p>
              </div>

              <div className="bg-[#FAFAF8] p-4 rounded-[8px] border border-[rgba(0,0,0,0.06)] space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[rgba(0,0,0,0.55)]">Ngân sách dự kiến:</span>
                  <span className="font-semibold text-[#0A66C2]">25.000.000 ₫ - 35.000.000 ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgba(0,0,0,0.55)]">Thời gian thực hiện:</span>
                  <span className="font-medium text-[rgba(0,0,0,0.85)]">
                    3 tháng (Toàn thời gian)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgba(0,0,0,0.55)]">Địa điểm:</span>
                  <span className="font-medium text-[rgba(0,0,0,0.85)]">
                    Hà Nội / Remote linh hoạt
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[12px] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.60)] block mb-1.5">
                  Kỹ năng bắt buộc:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="default">React 19</Badge>
                  <Badge variant="default">TypeScript</Badge>
                  <Badge variant="default">Tailwind CSS</Badge>
                  <Badge variant="default">Compound Components</Badge>
                  <Badge variant="default">Vite Tooling</Badge>
                </div>
              </div>

              <Input
                label="Lời nhắn giới thiệu bản thân / Bid Proposal"
                placeholder="Nhập kinh nghiệm nổi bật hoặc liên kết Portfolio của bạn..."
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Đóng Lại
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false)
                toast.success(
                  'Hồ sơ ứng tuyển của bạn đã được chuyển tới nhà tuyển dụng thành công!',
                  { title: 'Ứng Tuyển Thành Công' },
                )
              }}
              leftIcon={<CheckCircleIcon size={16} weight="bold" />}
            >
              Gửi Hồ Sơ Ứng Tuyển
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default DesignPage
