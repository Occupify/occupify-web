import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, BookmarkIcon, MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { toast } from '@/components/feedback'
import { JobCard, useSavedJobs } from '@/features/saved-items'

export function SavedPage() {
  const navigate = useNavigate()
  const { savedJobs, savedJobIds, isLoading, toggleSaveJob } = useSavedJobs()
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggleSave = async (jobId: number) => {
    try {
      const res = await toggleSaveJob(jobId)
      if (res.isSaved) {
        toast.success('Đã lưu việc làm thành công')
      } else {
        toast.info('Đã xóa việc làm khỏi mục đã lưu')
      }
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  }

  const displayJobs = savedJobs.filter((job) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.skills?.some((s) => s.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-full px-4 py-7 pb-12 !bg-[var(--bg-base)] sm:px-6">
      <div className="mx-auto max-w-[1128px]">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
            <BookmarkIcon size={14} weight="fill" />
            <span>Mục đã lưu của bạn</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight !text-[var(--text-primary)]">
            Việc làm đã lưu
          </h1>
          <p className="mt-1 text-sm !text-[var(--text-secondary)]">
            Danh sách các cơ hội việc làm và dự án freelance bạn đã đánh dấu để ứng tuyển sau
          </p>
        </div>

        {/* Main Content Layout Centered */}
        <div className="mx-auto max-w-[860px]">
          {/* Summary / Search Bar Inside Saved */}
          {savedJobs.length > 0 && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border p-3.5 shadow-xs !border-[var(--border-default)] !bg-[var(--bg-elevated)]">
              <div className="text-[13.5px] !text-[var(--text-secondary)]">
                Đang lưu{' '}
                <strong className="font-bold !text-[var(--text-primary)]">
                  {savedJobs.length}
                </strong>{' '}
                công việc
              </div>
              <div className="flex max-w-[280px] flex-1 items-center gap-2 rounded-full px-3.5 py-1.5 !bg-[var(--bg-base)]">
                <MagnifyingGlassIcon size={15} className="shrink-0 !text-[var(--text-tertiary)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lọc trong mục đã lưu..."
                  className="w-full bg-transparent text-xs !text-[var(--text-primary)] outline-none placeholder:!text-[var(--text-tertiary)]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="cursor-pointer !text-[var(--text-tertiary)] hover:!text-[var(--text-secondary)]"
                  >
                    <XIcon size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-12 text-center text-sm !text-[var(--text-secondary)]">
              Đang tải danh sách đã lưu...
            </div>
          )}

          {/* List of Saved Jobs */}
          {!isLoading &&
            displayJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                onToggleSave={() => handleToggleSave(job.id)}
                onClick={() => navigate(`/home?jobId=${job.id}`)}
                onViewProfile={() =>
                  navigate(
                    job.clientName
                      ? `/profile?name=${encodeURIComponent(job.clientName)}`
                      : '/profile',
                  )
                }
              />
            ))}

          {/* Empty State when no saved jobs */}
          {!isLoading && savedJobs.length === 0 && (
            <div className="rounded-xl border px-6 py-16 text-center shadow-xs !border-[var(--border-default)] !bg-[var(--bg-elevated)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                <BookmarkIcon size={30} weight="fill" />
              </div>
              <h2 className="mb-2 text-lg font-bold !text-[var(--text-primary)]">
                Bạn chưa lưu việc làm nào
              </h2>
              <p className="mx-auto mb-6 max-w-md text-sm leading-relaxed !text-[var(--text-secondary)]">
                Khi bạn bắt gặp các cơ hội việc làm hoặc dự án phù hợp, hãy bấm biểu tượng Lưu để
                gom vào danh sách này và xem lại bất cứ lúc nào.
              </p>
              <Link
                to="/not-found"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold !text-white transition-colors !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
              >
                <span>Khám phá dự án & cơ hội mới</span>
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          )}

          {/* Empty search results inside saved */}
          {!isLoading && savedJobs.length > 0 && displayJobs.length === 0 && (
            <div className="rounded-xl border px-5 py-10 text-center text-sm shadow-xs !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-secondary)]">
              Không tìm thấy việc làm đã lưu nào khớp với từ khóa &ldquo;{searchQuery}&rdquo;.
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)] hover:!bg-[var(--color-primary-100)]"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SavedPage
