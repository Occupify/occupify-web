import { useState } from 'react'
import { ArrowLeftIcon, BriefcaseIcon, FileTextIcon } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import type { MyProject } from '@/features/projects'
import { CancelModal } from '@/features/projects'

interface EmployeeProjectDetailPageProps {
  project: MyProject
  onBack: () => void
  onCancelContract?: (projectId: number, reason: string) => void
}

export function EmployeeProjectDetailPage({
  project,
  onBack,
  onCancelContract,
}: EmployeeProjectDetailPageProps) {
  const [showCancel, setShowCancel] = useState(false)
  const myContract = project.members[0]

  return (
    <div className="min-h-full px-4 py-7 pb-12 !bg-[var(--bg-base)]">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-5 flex cursor-pointer items-center gap-1.5 py-1 text-xs font-semibold !text-[var(--text-secondary)] transition-colors hover:!text-[var(--color-primary-500)]"
        >
          <ArrowLeftIcon size={14} weight="bold" />
          <span>Quay lại</span>
        </button>

        <div className="overflow-hidden rounded-lg border !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-sm">
          {/* Header */}
          <div className="border-b p-5 sm:px-6 !border-[var(--border-subtle)]">
            <h1 className="text-lg font-extrabold !text-[var(--text-primary)]">{project.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs !text-[var(--text-secondary)]">
              <span>{project.period}</span>
              {project.dueDate && <span>· Hạn: {project.dueDate}</span>}
              {project.owner && (
                <span>
                  · Chủ dự án:{' '}
                  <strong className="!text-[var(--text-primary)]">{project.owner}</strong>
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:px-6">
            <p className="mb-3 text-[13px] font-bold !text-[var(--text-secondary)]">
              Hợp đồng của tôi
            </p>

            {/* Contract Highlight Banner */}
            <div className="flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between !bg-[var(--bg-subtle)]">
              <div>
                <div className="mb-1 flex items-center gap-2.5">
                  <span className="text-[15px] font-bold !text-[var(--text-primary)]">
                    {myContract?.price ?? '—'}
                  </span>
                  {myContract?.role && (
                    <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                      <BriefcaseIcon size={12} weight="bold" />
                      {myContract.role}
                    </span>
                  )}
                </div>
                <p className="text-xs !text-[var(--text-secondary)]">
                  Chu kỳ: {project.period} · Hạn nhận lương:{' '}
                  {myContract?.salaryDueDate ?? 'Theo thỏa thuận'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className="cursor-pointer self-start rounded-full border px-4 py-1.5 text-xs font-bold transition-colors !border-[#C03A2B] !text-[#C03A2B] hover:!bg-[#FBE2E2] sm:self-auto"
              >
                Hủy hợp đồng
              </button>
            </div>

            {/* Chi tiết hợp đồng chi tiết */}
            <div className="mt-4 border-t pt-4 !border-[var(--border-subtle)]">
              <h3 className="mb-3 text-sm font-bold !text-[var(--text-primary)]">
                Chi tiết hợp đồng
              </h3>
              <div className="flex flex-col gap-2.5 text-sm !text-[var(--text-primary)]">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Tiêu đề hợp đồng:
                  </span>
                  <span>Hợp đồng {project.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Chủ dự án:
                  </span>
                  <div className="inline-flex items-center gap-2">
                    <Avatar name={project.owner ?? 'Trần Minh Khoa'} size="xs" />
                    <span className="font-bold !text-[var(--text-primary)]">
                      {project.owner ?? 'Trần Minh Khoa'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Giá trị hợp đồng:
                  </span>
                  <span className="font-semibold">{myContract?.price ?? '—'}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">Chu kỳ:</span>
                  <span>{project.period}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Hạn trả lương:
                  </span>
                  <span className="font-bold !text-[var(--color-primary-500)]">
                    {myContract?.salaryDueDate ??
                      (project.period === 'Hàng tháng'
                        ? 'Ngày 05 hàng tháng'
                        : project.period === 'Hàng tuần'
                          ? 'Thứ 6 hàng tuần'
                          : 'Theo thỏa thuận')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Ngày bắt đầu:
                  </span>
                  <span>01/10/2026</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Ngày kết thúc:
                  </span>
                  <span>{project.dueDate ?? '—'}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    File hợp đồng:
                  </span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      alert(`Mở tài liệu: HopDong_${project.id}.pdf`)
                    }}
                    className="inline-flex items-center gap-1.5 rounded px-3 py-1 font-bold no-underline transition-colors !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)] hover:!bg-[var(--color-primary-100)]"
                  >
                    <FileTextIcon size={15} weight="bold" />
                    <span>HopDong_{project.id}.pdf</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-44 font-semibold !text-[var(--text-secondary)]">
                    Trạng thái hợp đồng:
                  </span>
                  <span className="inline-block w-fit rounded px-2 py-0.5 text-xs font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                    {myContract?.status ?? 'Đang làm'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCancel && (
        <CancelModal
          title="Hủy hợp đồng"
          subtitle={`Dự án: ${project.name}`}
          onClose={() => setShowCancel(false)}
          onConfirm={(reason) => {
            setShowCancel(false)
            if (onCancelContract) {
              onCancelContract(project.id, reason)
            } else {
              onBack()
            }
          }}
        />
      )}
    </div>
  )
}
