import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useJobs,
  JobCard,
  JobEmptyState,
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
import { toast } from '@/components/feedback'
import {
  HomeHeroBanner,
  JobFilterToolbar,
  JobFilterSummary,
  QuickActionsCard,
  ProjectsStatusCard,
  WalletSummaryCard,
  CreateProjectPage,
  CreateContractPage,
} from './components'

export interface HomePageProps {
  onSelectContract?: (c: Contract) => void
  onSelectJob?: (job: JobListing) => void
  onViewProfile?: (name?: string) => void
  onOpenFinancialHistory?: () => void
  onNavigateProjects?: () => void
  savedJobIds?: number[]
  onToggleSaveJob?: (id: number) => void
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
  const currentUserName = propUserName ?? currentUser?.fullName
  const walletBalance = propWalletBalance ?? currentUser?.walletBalance ?? 0
  const myProjectsCount = propMyProjectsCount ?? currentUser?.myProjectsCount ?? 0
  const employeeProjectsCount = propEmployeeProjectsCount ?? currentUser?.employeeProjectsCount ?? 0
  const pendingProjectsCount = propPendingProjectsCount ?? currentUser?.pendingProjectsCount ?? 0

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

  // Fetch jobs from server state (TanStack Query) with filter & sort params
  const { data: displayJobs = [], isLoading } = useJobs(jobParams)

  // Page / SubPage routing state
  const [subPage, setSubPage] = React.useState<'create-project' | 'create-contract' | null>(null)

  // Local saved jobs fallback if not controlled by parent
  const [localSavedJobIds, setLocalSavedJobIds] = React.useState<number[]>([])
  const activeSavedJobIds = savedJobIds ?? localSavedJobIds

  const handleToggleSave = (id: number) => {
    if (onToggleSaveJob) {
      onToggleSaveJob(id)
    } else {
      setLocalSavedJobIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      )
    }
    const isNowSaved = !activeSavedJobIds.includes(id)
    toast.info(isNowSaved ? 'Đã lưu công việc vào danh sách yêu thích' : 'Đã bỏ lưu công việc')
  }

  const { createProject } = useProjects()

  const handleCreateProject = async (formData: CreateProjectFormData) => {
    try {
      await createProject(formData)
      setSubPage(null)
      toast.success(`Dự án "${formData.name}" đã được đăng tải thành công!`)
    } catch {
      toast.error('Có lỗi xảy ra khi tạo dự án.')
    }
  }

  // Render SubPages if active
  if (subPage === 'create-project') {
    return <CreateProjectPage onBack={() => setSubPage(null)} onSubmit={handleCreateProject} />
  }

  if (subPage === 'create-contract') {
    return (
      <CreateContractPage
        onBack={() => setSubPage(null)}
        onSubmit={() => {
          setSubPage(null)
          toast.success('Hợp đồng đã được tạo và gửi lời mời!')
        }}
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
    <div style={{ maxWidth: 1128, margin: '0 auto', padding: '24px 16px' }}>
      {/* ─── Hero Banner ─── */}
      <HomeHeroBanner
        userName={currentUserName}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
      />

      {/* ─── Main 2-Column Marketplace Layout ─── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5 items-start"
        style={{
          display: 'grid',
        }}
      >
        {/* Left Column: Job & Contract Feed */}
        <div>
          {/* Filter Toolbar */}
          <JobFilterToolbar
            totalJobs={displayJobs.length}
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
            totalJobs={displayJobs.length}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1, 2, 3].map((key) => (
                  <div
                    key={key}
                    className="pro-card"
                    style={{
                      borderRadius: 12,
                      padding: '24px',
                      background: '#fff',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    <div
                      style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: '50%',
                          background: '#F1F5F9',
                        }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div
                          style={{
                            height: 16,
                            width: '60%',
                            background: '#F1F5F9',
                            borderRadius: 4,
                          }}
                        />
                        <div
                          style={{
                            height: 12,
                            width: '35%',
                            background: '#F1F5F9',
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        height: 12,
                        width: '100%',
                        background: '#F8FAFC',
                        borderRadius: 4,
                        marginBottom: 8,
                      }}
                    />
                    <div
                      style={{
                        height: 12,
                        width: '80%',
                        background: '#F8FAFC',
                        borderRadius: 4,
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {!isLoading &&
              displayJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={activeSavedJobIds.includes(job.id)}
                  onToggleSave={() => handleToggleSave(job.id)}
                  onClick={() => onSelectJob?.(job)}
                  onViewProfile={handleViewProfile}
                />
              ))}

            {!isLoading && displayJobs.length === 0 && (
              <JobEmptyState onResetFilters={handleResetFilters} />
            )}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Quick Actions Card */}
          <QuickActionsCard
            onCreateProject={() => setSubPage('create-project')}
            onCreateContract={() => setSubPage('create-contract')}
          />

          {/* Projects Management Status Widget */}
          <ProjectsStatusCard
            myProjectsCount={myProjectsCount}
            employeeProjectsCount={employeeProjectsCount}
            pendingProjectsCount={pendingProjectsCount}
            onNavigateProjects={handleNavigateProjects}
          />

          {/* Occupify Wallet Widget */}
          <WalletSummaryCard
            walletBalance={walletBalance}
            onOpenWallet={onOpenWallet}
            onOpenFinancialHistory={onOpenFinancialHistory}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
