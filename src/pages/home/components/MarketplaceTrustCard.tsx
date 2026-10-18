import { ShieldCheckIcon, CheckCircleIcon } from '@phosphor-icons/react'

export function MarketplaceTrustCard() {
  return (
    <div className="bg-emerald-50/50 rounded-xl border border-emerald-200/90 shadow-xs p-5">
      <div className="flex items-center gap-2.5 mb-3.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 border border-emerald-200">
          <ShieldCheckIcon size={18} weight="fill" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-emerald-950">
            Bảo Chứng Thanh Toán Escrow
          </div>
          <div className="text-[11.5px] text-emerald-700 font-medium">
            An toàn tuyệt đối 100% cho 2 bên
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 text-xs text-slate-700 leading-relaxed">
        <div className="flex items-start gap-2">
          <CheckCircleIcon size={16} weight="fill" className="text-emerald-600 mt-0.5 shrink-0" />
          <span>
            <strong className="text-slate-900 font-bold">Ký quỹ trước khi làm:</strong> Khách hàng khóa ngân sách vào Escrow trước khi bạn bắt đầu code.
          </span>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircleIcon size={16} weight="fill" className="text-emerald-600 mt-0.5 shrink-0" />
          <span>
            <strong className="text-slate-900 font-bold">Nghiệm thu theo Milestone:</strong> Bàn giao mã nguồn từng mốc, nhận thanh toán tức thì.
          </span>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircleIcon size={16} weight="fill" className="text-emerald-600 mt-0.5 shrink-0" />
          <span>
            <strong className="text-slate-900 font-bold">Trọng tài bảo vệ công bằng:</strong> Đội ngũ Occupify can thiệp giải quyết tranh chấp 24/7.
          </span>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceTrustCard

