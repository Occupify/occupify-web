import * as React from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftIcon, BriefcaseMetalIcon } from '@phosphor-icons/react'
import { useJob, JobDetailsView, type JobListing } from '@/features/jobs'
import {
  SEED_CONTRACTS,
  matchedContractToJobListing,
} from '@/pages/occupify-ai/occupify-ai-mock-data'
import { toast } from '@/components/feedback'

export function JobDetailPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const roleTitleParam = searchParams.get('roleTitle') ?? undefined
  const roleIdParam = searchParams.get('roleId') ?? undefined

  const numericJobId = jobId ? Number(jobId) : null
  const validJobId = numericJobId && !Number.isNaN(numericJobId) ? numericJobId : null

  // 1. Fetch from standard jobs query
  const { data: queriedJob, isLoading } = useJob(validJobId)

  // 2. Resolve job from query or fallback to AI matched contracts
  const resolvedJob = React.useMemo<JobListing | null>(() => {
    if (queriedJob) return queriedJob

    if (validJobId) {
      const matchedSeed = SEED_CONTRACTS.find((c) => c.id === validJobId)
      if (matchedSeed) {
        return matchedContractToJobListing(matchedSeed)
      }
    }

    return null
  }, [queriedJob, validJobId])

  // Saved job state
  const [isSaved, setIsSaved] = React.useState(false)

  const handleToggleSave = React.useCallback(() => {
    setIsSaved((prev) => {
      const next = !prev
      toast.info(next ? 'Đã lưu việc làm vào danh sách yêu thích' : 'Đã bỏ lưu việc làm')
      return next
    })
  }, [])

  const handleBack = React.useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/home')
    }
  }, [navigate])

  const handleViewProfile = React.useCallback(
    (name?: string) => {
      if (name) {
        navigate(`/profile?name=${encodeURIComponent(name)}`)
      } else {
        navigate('/profile')
      }
    },
    [navigate],
  )

  // Loading state
  if (isLoading && !resolvedJob) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-slate-500">
        <div className="w-8 h-8 border-3 border-[#0A66C2] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Đang tải thông tin dự án & hợp đồng...</span>
      </div>
    )
  }

  // Not found state
  if (!resolvedJob) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
          <BriefcaseMetalIcon size={32} weight="duotone" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1.5">
          Không tìm thấy thông tin hợp đồng
        </h1>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          Hợp đồng hoặc dự án này có thể đã kết thúc tuyển dụng, đã được gỡ xuống hoặc đường dẫn
          không chính xác.
        </p>
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#084fa0] text-white text-sm font-bold transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeftIcon size={16} weight="bold" />
          <span>Về trang chủ việc làm</span>
        </button>
      </div>
    )
  }

  return (
    <JobDetailsView
      job={resolvedJob}
      onBack={handleBack}
      onViewProfile={handleViewProfile}
      isSaved={isSaved}
      onToggleSave={handleToggleSave}
      highlightRoleId={roleIdParam}
      highlightRoleTitle={roleTitleParam}
    />
  )
}

export default JobDetailPage
