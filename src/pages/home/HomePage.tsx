import * as React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import {
  useJobsPage,
  useJob,
  JobCard,
  JobEmptyState,
  JobDetailsView,
  type JobListing,
  type Contract,
  type JobSortBy,
  type JobTimeFilter,
  type JobSalaryTypeFilter,
  type JobStatus,
  type JobExperienceLevel,
  type JobBudgetRange,
  type JobHoursPerDay,
  type GetJobsParams,
} from '@/features/jobs'
import { useCurrentUser } from '@/features/auth'
import { useProjects, type CreateProjectFormData } from '@/features/projects'
import { useSavedJobs } from '@/features/saved-items'
import { toast } from '@/components/feedback'
import { ApiError } from '@/types'
import {
  HomeHeroBanner,
  JobFilterToolbar,
  JobFilterSummary,
  QuickActionsCard,
  ProjectsStatusCard,
  WalletSummaryCard,
  CreateProjectPage,
  MarketplaceTrustCard,
} from './components'

export interface HomePageProps {
  onSelectContract?: (c: Contract) => void
  onSelectJob?: (job: JobListing) => void
  onViewProfile?: (name?: string) => void
  onOpenFinancialHistory?: () => void
  onNavigateProjects?: () => void
  savedJobIds?: (string | number)[]
  onToggleSaveJob?: (id: string | number) => void
  onOpenWallet?: () => void
  walletBalance?: number
  myProjectsCount?: number
  employeeProjectsCount?: number
  pendingProjectsCount?: number
  currentUserName?: string
}

export function HomePage({
  onSelectContract: _onSelectContract,
  onSelectJob,
  onViewProfile,
  onOpenFinancialHistory,
  onNavigateProjects,
  savedJobIds,
  onToggleSaveJob,
  onOpenWallet,
  walletBalance: propWalletBalance,
  myProjectsCount: propMyProjectsCount,
  employeeProjectsCount: propEmployeeProjectsCount,
  pendingProjectsCount: propPendingProjectsCount,
  currentUserName: propUserName,
}: HomePageProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const handleNavigateProjects = React.useCallback(() => {
    if (onNavigateProjects) {
      onNavigateProjects()
    } else {
      navigate('/workspace')
    }
  }, [onNavigateProjects, navigate])

  const handleViewProfile = React.useCallback(
    (name?: string) => {
      if (onViewProfile) {
        onViewProfile(name)
      } else if (name) {
        navigate(`/profile?name=${encodeURIComponent(name)}`)
      } else {
        navigate('/profile')
      }
    },
    [onViewProfile, navigate],
  )

  // Server state: Current user profile from TanStack Query
  const { data: currentUser } = useCurrentUser()
  const { myProjects = [], employeeProjects = [], pending = [], createProject } = useProjects()
  const currentUserName = propUserName ?? currentUser?.fullName
  const walletBalance = propWalletBalance ?? currentUser?.walletBalance ?? 0
  const myProjectsCount = propMyProjectsCount ?? myProjects.length
  const employeeProjectsCount = propEmployeeProjectsCount ?? employeeProjects.length
  const pendingProjectsCount = propPendingProjectsCount ?? pending.length

  // Filter and Sort states
  const [searchKeyword, setSearchKeyword] = React.useState('')
  const [sortBy, setSortBy] = React.useState<JobSortBy>('latest')
  const [hoursPerDay, setHoursPerDay] = React.useState<JobHoursPerDay>('all')
  const [timeFilter, setTimeFilter] = React.useState<JobTimeFilter>('all')
  const [salaryTypeFilter, setSalaryTypeFilter] = React.useState<JobSalaryTypeFilter>('all')
  const [budgetRange, setBudgetRange] = React.useState<JobBudgetRange>('all')
  const [experienceLevel, setExperienceLevel] = React.useState<'all' | JobExperienceLevel>('all')
  const [statusFilter, setStatusFilter] = React.useState<'all' | JobStatus>('all')

  // Memoize API query params (filtering and sorting are handled in the API layer)
  const jobParams = React.useMemo<GetJobsParams>(
    () => ({
      search: searchKeyword,
      sortBy,
      hoursPerDay,
      time: timeFilter,
      salaryType: salaryTypeFilter,
      budgetRange,
      experienceLevel,
      status: statusFilter,
    }),
    [
      searchKeyword,
      sortBy,
      hoursPerDay,
      timeFilter,
      salaryTypeFilter,
      budgetRange,
      experienceLevel,
      statusFilter,
    ],
  )

  // Pagination state (10 projects per page), automatically resets to 0 when filters change
  const HOME_PAGE_SIZE = 10
  const filterKey = JSON.stringify(jobParams)
  const [pageState, setPageState] = React.useState<{ filterKey: string; page: number }>({
    filterKey,
    page: 0,
  })
  const currentPage = pageState.filterKey === filterKey ? pageState.page : 0

  // Fetch paginated jobs from server state (TanStack Query, 10 per page)
  const {
    data: jobsPageData,
    isLoading,
    isFetching,
  } = useJobsPage({ ...jobParams, page: currentPage, size: HOME_PAGE_SIZE })

  const displayJobs = React.useMemo(() => jobsPageData?.jobs ?? [], [jobsPageData])
  const totalJobsCount = jobsPageData?.total ?? displayJobs.length
  const totalPages = jobsPageData?.totalPages ?? 0

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 0 || (totalPages > 0 && nextPage >= totalPages)) return
    setPageState({ filterKey, page: nextPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Parse jobId from URL query parameters
  const jobIdParam = searchParams.get('jobId')
  const validJobId = jobIdParam && jobIdParam.trim() ? jobIdParam.trim() : null

  // Query individual job if navigated directly via URL and not in feed
  const { data: queriedJob } = useJob(validJobId)

  // Derive selectedJob reactively from URL parameter (URL is single source of truth)
  const selectedJob = React.useMemo(() => {
    if (!validJobId) return null
    return displayJobs.find((j) => String(j.id) === String(validJobId)) ?? queriedJob ?? null
  }, [validJobId, displayJobs, queriedJob])

  const handleSelectJob = React.useCallback(
    (job: JobListing) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('jobId', String(job.id))
        return next
      })
      onSelectJob?.(job)
    },
    [onSelectJob, setSearchParams],
  )

  const handleBackFromJobDetails = React.useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('jobId')
      return next
    })
  }, [setSearchParams])

  // Page / SubPage routing state
  const [subPage, setSubPage] = React.useState<'create-project' | null>(null)

  // Saved jobs persistence via hook / query cache
  const { savedJobIds: hookSavedJobIds, toggleSaveJob } = useSavedJobs()
  const activeSavedJobIds: (string | number)[] = savedJobIds ?? hookSavedJobIds

  const handleToggleSave = async (id: string | number) => {
    if (onToggleSaveJob) {
      onToggleSaveJob(id)
      const isNowSaved = !activeSavedJobIds.some((item) => String(item) === String(id))
      toast.info(isNowSaved ? 'Đã lưu công việc vào danh sách yêu thích' : 'Đã bỏ lưu công việc')
    } else {
      try {
        const res = await toggleSaveJob(id)
        toast.info(res.isSaved ? 'Đã lưu công việc vào danh sách yêu thích' : 'Đã bỏ lưu công việc')
      } catch {
        toast.error('Có lỗi xảy ra khi cập nhật mục đã lưu')
      }
    }
  }

  const handleCreateProject = async (formData: CreateProjectFormData) => {
    try {
      await createProject(formData)
      setSubPage(null)
      toast.success(`Dự án "${formData.name}" đã được đăng tải thành công!`)
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Có lỗi xảy ra khi tạo dự án.'
      toast.error(message)
    }
  }

  // Render SubPages if active
  if (subPage === 'create-project') {
    return <CreateProjectPage onBack={() => setSubPage(null)} onSubmit={handleCreateProject} />
  }

  // Render Job Details if a job is selected
  if (selectedJob) {
    return (
      <JobDetailsView
        job={selectedJob}
        onBack={handleBackFromJobDetails}
        onViewProfile={handleViewProfile}
        isSaved={activeSavedJobIds.some((item) => String(item) === String(selectedJob.id))}
        onToggleSave={() => handleToggleSave(selectedJob.id)}
      />
    )
  }

  const hasActiveFilters =
    sortBy !== 'latest' ||
    hoursPerDay !== 'all' ||
    timeFilter !== 'all' ||
    salaryTypeFilter !== 'all' ||
    budgetRange !== 'all' ||
    experienceLevel !== 'all' ||
    statusFilter !== 'all' ||
    searchKeyword !== ''

  const handleResetFilters = () => {
    setSortBy('latest')
    setHoursPerDay('all')
    setTimeFilter('all')
    setSalaryTypeFilter('all')
    setBudgetRange('all')
    setExperienceLevel('all')
    setStatusFilter('all')
    setSearchKeyword('')
  }

  return (
    <div className="min-h-full bg-slate-50/70 py-6 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* ─── Hero Banner ─── */}
        <HomeHeroBanner
          userName={currentUserName}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          onSelectTag={(tag) => setSearchKeyword(tag)}
        />

        {/* ─── Main 2-Column Marketplace Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          {/* Left Column: Job & Contract Feed */}
          <main className="min-w-0">
            {/* Filter Toolbar */}
            <JobFilterToolbar
              totalJobs={totalJobsCount}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              hoursPerDay={hoursPerDay}
              onHoursPerDayChange={setHoursPerDay}
              budgetRange={budgetRange}
              onBudgetRangeChange={setBudgetRange}
              salaryTypeFilter={salaryTypeFilter}
              onSalaryTypeFilterChange={setSalaryTypeFilter}
              experienceLevel={experienceLevel}
              onExperienceLevelChange={setExperienceLevel}
              timeFilter={timeFilter}
              onTimeFilterChange={setTimeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />

            {/* Results Summary Header */}
            <JobFilterSummary
              totalJobs={totalJobsCount}
              searchKeyword={searchKeyword}
              onClearSearch={() => setSearchKeyword('')}
              hoursPerDay={hoursPerDay}
              onClearHoursPerDay={() => setHoursPerDay('all')}
              budgetRange={budgetRange}
              onClearBudgetRange={() => setBudgetRange('all')}
              salaryTypeFilter={salaryTypeFilter}
              onClearSalaryType={() => setSalaryTypeFilter('all')}
              experienceLevel={experienceLevel}
              onClearExperienceLevel={() => setExperienceLevel('all')}
              statusFilter={statusFilter}
              onClearStatusFilter={() => setStatusFilter('all')}
              timeFilter={timeFilter}
              onClearTimeFilter={() => setTimeFilter('all')}
            />

            {/* Jobs Feed */}
            <div>
              {isLoading && (
                <div className="flex flex-col gap-3.5">
                  {[1, 2, 3].map((key) => (
                    <div
                      key={key}
                      className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs animate-pulse"
                    >
                      <div className="flex gap-3 items-center mb-4">
                        <div className="w-9 h-9 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/3 bg-slate-200 rounded" />
                          <div className="h-3 w-1/4 bg-slate-100 rounded" />
                        </div>
                      </div>
                      <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
                      <div className="h-10 w-full bg-slate-100 rounded-lg mb-3" />
                      <div className="space-y-2 mb-4">
                        <div className="h-3.5 w-full bg-slate-100 rounded" />
                        <div className="h-3.5 w-4/5 bg-slate-100 rounded" />
                      </div>
                      <div className="flex gap-2 mb-3">
                        <div className="h-6 w-16 bg-slate-200 rounded" />
                        <div className="h-6 w-20 bg-slate-200 rounded" />
                        <div className="h-6 w-14 bg-slate-200 rounded" />
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between">
                        <div className="h-4 w-32 bg-slate-100 rounded" />
                        <div className="h-4 w-28 bg-slate-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                displayJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={activeSavedJobIds.some((item) => String(item) === String(job.id))}
                    onToggleSave={() => handleToggleSave(job.id)}
                    onClick={() => handleSelectJob(job)}
                    onViewProfile={handleViewProfile}
                  />
                ))}

              {!isLoading && displayJobs.length === 0 && (
                <JobEmptyState onResetFilters={handleResetFilters} />
              )}

              {/* Pagination Controls (10 projects per page) */}
              {!isLoading && totalPages > 1 && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">
                    Trang <strong className="text-slate-800">{currentPage + 1}</strong> /{' '}
                    {totalPages} · Tổng <strong className="text-slate-800">{totalJobsCount}</strong>{' '}
                    dự án
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={currentPage <= 0 || isFetching}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CaretLeftIcon size={14} weight="bold" />
                      <span>Trước</span>
                    </button>

                    {Array.from({ length: totalPages }, (_, idx) => idx)
                      .filter(
                        (idx) =>
                          idx === 0 || idx === totalPages - 1 || Math.abs(idx - currentPage) <= 1,
                      )
                      .reduce<Array<number | 'ellipsis'>>((acc, idx, i, arr) => {
                        if (i > 0 && idx - arr[i - 1] > 1) acc.push('ellipsis')
                        acc.push(idx)
                        return acc
                      }, [])
                      .map((item, idx) =>
                        item === 'ellipsis' ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1.5 text-xs font-semibold text-slate-400"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={item}
                            type="button"
                            disabled={isFetching}
                            onClick={() => handlePageChange(item)}
                            className={`min-w-[32px] cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                              item === currentPage
                                ? 'bg-[var(--color-primary-500)] text-white shadow-xs'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {item + 1}
                          </button>
                        ),
                      )}

                    <button
                      type="button"
                      disabled={currentPage + 1 >= totalPages || isFetching}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>Sau</span>
                      <CaretRightIcon size={14} weight="bold" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Right Column: Freelance Workbench Widgets */}
          <aside className="flex flex-col gap-4 lg:sticky lg:top-20">
            {/* Quick Actions Card */}
            <QuickActionsCard
              onCreateProject={() => setSubPage('create-project')}
              onCreateContract={() => navigate('/workspace?sub=create-contract')}
            />

            {/* Occupify Escrow Wallet Widget */}
            <WalletSummaryCard
              walletBalance={walletBalance}
              onOpenWallet={onOpenWallet ?? (() => navigate('/wallet'))}
              onOpenFinancialHistory={
                onOpenFinancialHistory ?? (() => navigate('/financial-history'))
              }
            />

            {/* Projects Management Status Widget */}
            <ProjectsStatusCard
              myProjectsCount={myProjectsCount}
              employeeProjectsCount={employeeProjectsCount}
              pendingProjectsCount={pendingProjectsCount}
              onNavigateProjects={handleNavigateProjects}
            />

            {/* Escrow Trust & Safety Guarantee Card */}
            <MarketplaceTrustCard />
          </aside>
        </div>
      </div>
    </div>
  )
}

export default HomePage
