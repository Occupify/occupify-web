import {
  XIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  FileTextIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react'
import type { AdminContract } from '../../types'
import { AdminStatusBadge } from '../shared'

interface ContractDetailModalProps {
  contract: AdminContract | null
  onClose: () => void
}

export function ContractDetailModal({ contract, onClose }: ContractDetailModalProps) {
  if (!contract) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[620px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-6 py-4">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <span className="rounded bg-[#EAF1FA] px-2 py-0.5 font-mono text-xs font-bold text-[#0A66C2] shrink-0">
              {contract.id}
            </span>
            <h2 className="text-base font-bold text-black/90 truncate" title={contract.project}>
              {contract.project}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/45 transition-colors hover:bg-black/5 hover:text-black/80"
            title="Đóng"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* Body - Vertical List (1 column, clean & simple) */}
        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-6 text-xs text-black/80">
          {/* 1. Trạng thái hợp đồng */}
          <div className="flex items-center justify-between rounded-lg border border-black/8 bg-[#FAFAF8] px-4 py-3">
            <span className="font-medium text-black/60">Trạng thái hợp đồng:</span>
            <AdminStatusBadge status={contract.status} />
          </div>

          {/* 2. Bên thuê (Client) */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-black/45">
              Bên thuê (Client)
            </div>

            <div className="mt-2.5 flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-xs"
                style={{ backgroundColor: contract.client.color }}
              >
                {contract.client.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-black/90">{contract.client.name}</span>
                  <span className="rounded bg-[#EAF1FA] px-2 py-0.5 text-[10px] font-semibold text-[#0A66C2]">
                    {contract.client.role}
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-1 text-black/65">
                  <span className="flex items-center gap-1.5">
                    <EnvelopeIcon size={14} className="text-black/40 shrink-0" />
                    <span>{contract.client.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon size={14} className="text-black/40 shrink-0" />
                    <span>{contract.client.phone}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#B45309] font-medium">
                    <StarIcon size={14} weight="fill" className="text-[#F59E0B] shrink-0" />
                    <span>
                      {contract.client.rating} / 5.0 ({contract.client.reviewCount} đánh giá)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bên nhận việc (Freelancer) */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-black/45">
              Bên nhận việc (Freelancer)
            </div>

            <div className="mt-2.5 flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-xs"
                style={{ backgroundColor: contract.freelancer.color }}
              >
                {contract.freelancer.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-black/90">
                    {contract.freelancer.name}
                  </span>
                  <span className="rounded bg-[#E6F4EA] px-2 py-0.5 text-[10px] font-semibold text-[#137333]">
                    {contract.freelancer.role}
                  </span>
                </div>

                <div className="mt-2 flex flex-col gap-1 text-black/65">
                  <span className="flex items-center gap-1.5">
                    <EnvelopeIcon size={14} className="text-black/40 shrink-0" />
                    <span>{contract.freelancer.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PhoneIcon size={14} className="text-black/40 shrink-0" />
                    <span>{contract.freelancer.phone}</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[#B45309] font-medium">
                    <StarIcon size={14} weight="fill" className="text-[#F59E0B] shrink-0" />
                    <span>
                      {contract.freelancer.rating} / 5.0 ({contract.freelancer.reviewCount} đánh
                      giá)
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Điều khoản Hợp đồng (Vertical List theo danh sách, không chia cột) */}
          <div className="divide-y divide-black/6 rounded-lg border border-black/8 bg-[#FAFAF8] px-4">
            {/* Giá trị hợp đồng */}
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-black/60">Giá trị hợp đồng:</span>
              <span className="text-sm font-extrabold text-[#057642]">{contract.value}</span>
            </div>

            {/* Chu kỳ */}
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-black/60">Chu kỳ thanh toán:</span>
              <span className="rounded-md border border-black/10 bg-white px-2.5 py-1 font-bold text-black/85">
                {contract.period}
              </span>
            </div>

            {/* Ngày bắt đầu */}
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-black/60">Ngày bắt đầu:</span>
              <span className="font-bold text-black/85">{contract.startDate}</span>
            </div>

            {/* Ngày kết thúc */}
            <div className="flex items-center justify-between py-3">
              <span className="font-medium text-black/60">Ngày kết thúc:</span>
              <span className="font-bold text-black/85">{contract.endDate}</span>
            </div>
          </div>

          {/* 5. Section Preview PDF Tài liệu hợp đồng */}
          <div className="rounded-lg border border-black/8 bg-[#FAFAF8] p-4">
            <div className="flex items-center justify-between border-b border-black/8 pb-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-black/45">
                  Tài liệu hợp đồng đính kèm
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-[#FEE2E2] text-[#DC2626]">
                    <FileTextIcon size={14} weight="bold" />
                  </span>
                  <span className="font-bold text-black/85">{contract.attachment.name}</span>
                  <span className="text-[11px] text-black/40">({contract.attachment.size})</span>
                </div>
              </div>
              <a
                href={contract.attachment.url ?? '#'}
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-1 rounded border border-black/15 bg-white px-3 py-1.5 text-[11px] font-bold text-black/75 shadow-2xs hover:bg-black/5"
              >
                <span>Tải PDF</span>
                <ArrowUpRightIcon size={12} weight="bold" />
              </a>
            </div>

            {/* Khung Preview PDF trực tiếp ngay trong popup */}
            <div className="mt-3 overflow-hidden rounded-md border border-black/10 bg-[#525659] p-3 shadow-inner">
              <div className="mx-auto max-w-[500px] rounded bg-white p-5 shadow-md">
                {/* Header văn bản PDF */}
                <div className="text-center font-serif text-[10px] text-black/80">
                  <div className="font-bold tracking-wider uppercase">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="font-semibold italic">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="mx-auto my-1.5 w-16 border-b border-black/40" />
                  <div className="mt-2 text-xs font-bold uppercase tracking-wide text-black/90">
                    HỢP ĐỒNG DỊCH VỤ ĐIỆN TỬ
                  </div>
                  <div className="text-[9px] text-black/50">
                    Mã HĐ: {contract.id} • Ngày tạo: {contract.startDate}
                  </div>
                </div>

                {/* Nội dung PDF thu nhỏ */}
                <div className="mt-4 space-y-2 font-serif text-[10px] leading-relaxed text-black/70">
                  <div>
                    <strong>BÊN A (BÊN GIAO VIỆC):</strong> {contract.client.name} —{' '}
                    {contract.client.role} (Email: {contract.client.email})
                  </div>
                  <div>
                    <strong>BÊN B (BÊN NHẬN VIỆC):</strong> {contract.freelancer.name} —{' '}
                    {contract.freelancer.role} (Email: {contract.freelancer.email})
                  </div>
                  <div className="pt-1">
                    <strong>ĐIỀU 1: PHẠM VI DỰ ÁN</strong>
                    <p className="italic text-black/60">"{contract.project}"</p>
                  </div>
                  <div>
                    <strong>ĐIỀU 2: GIÁ TRỊ & CHU KỲ THANH TOÁN</strong>
                    <p>
                      Mức thù lao thỏa thuận: <strong>{contract.value}</strong> ({contract.period}).
                      Tiến độ tính từ ngày {contract.startDate} đến ngày {contract.endDate}.
                    </p>
                  </div>
                  <div>
                    <strong>ĐIỀU 3: HIỆU LỰC & CHỮ KÝ SỐ</strong>
                    <p>
                      Hợp đồng được lập và xác thực điện tử thông qua nền tảng Occupify, có giá trị
                      pháp lý ràng buộc hai bên theo quy định hiện hành.
                    </p>
                  </div>
                </div>

                {/* Footer ký tên / dấu xác thực */}
                <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-3 text-[9px]">
                  <div className="text-center">
                    <div className="font-bold text-black/70">ĐẠI DIỆN BÊN A</div>
                    <div className="mt-1 font-mono text-[8px] text-[#057642]">✓ Đã ký số</div>
                  </div>
                  <div className="rounded border border-[#0A66C2]/30 bg-[#EAF1FA] px-2 py-1 text-center font-mono text-[8px] text-[#0A66C2]">
                    CERTIFIED ELECTRONIC CONTRACT
                    <div className="text-[7px] text-black/50">SHA-256 Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-black/70">ĐẠI DIỆN BÊN B</div>
                    <div className="mt-1 font-mono text-[8px] text-[#057642]">✓ Đã ký số</div>
                  </div>
                </div>
              </div>

              <div className="mt-2 text-center text-[10px] text-white/70">
                Xem trước trang 1 / 3 • Bản hợp đồng số lưu chiểu
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-black/8 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/15 bg-white px-6 py-2 text-xs font-semibold text-black/75 transition-colors hover:bg-black/5"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
