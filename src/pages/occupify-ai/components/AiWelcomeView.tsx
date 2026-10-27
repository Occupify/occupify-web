import { SparkleIcon } from '@phosphor-icons/react'

export function AiWelcomeView() {
  return (
    <div className="max-w-2xl mx-auto w-full my-auto py-12 px-4 flex flex-col items-center text-center">
      {/* ─── Hero Badge ─── */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[var(--color-primary-50)] text-[var(--color-primary-500)] border border-[var(--color-primary-200)] mb-4 shadow-2xs">
        <SparkleIcon size={14} weight="fill" />
        <span>Occuify AI</span>
      </div>

      {/* ─── Hero Heading ─── */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Xin chào! Tôi có thể hỗ trợ gì cho bạn?
      </h1>

      <p className="text-xs sm:text-sm text-slate-500 max-w-lg mt-3 leading-relaxed">
        Trợ lý Occupify AI đồng hành cùng bạn trong việc phân tích hợp đồng, tối ưu hóa hồ sơ năng
        lực, định giá thù lao và soạn thảo báo giá chuyên nghiệp.
      </p>
    </div>
  )
}
