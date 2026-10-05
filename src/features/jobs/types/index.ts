export type JobSalaryType = 'fixed' | 'hourly' | 'weekly' | 'monthly'
export type JobSortBy = 'latest' | 'most-viewed' | 'least-proposals' | 'budget-desc'
export type JobTimeFilter = 'all' | '24h' | '3d' | '7d' | '30d'
export type JobSalaryTypeFilter = 'all' | JobSalaryType
export type JobStatus = 'OPEN' | 'CLOSED'
export type JobExperienceLevel = 'entry' | 'intermediate' | 'expert'
export type JobBudgetRange = 'all' | 'under-5m' | '5m-20m' | '20m-50m' | 'above-50m'
export type JobHoursPerDay = 'all' | 'under-4h' | '4h-8h' | 'above-8h'

export interface JobRoleItem {
  id: string
  title: string
  minBudget: number
  maxBudget: number
  budgetDisplay: string
  salaryType: JobSalaryType
  salaryTypeLabel: string
  slotsTotal: number
  slotsFilled: number
  status: 'recruiting' | 'filled'
  jd?: string
  requirements?: string[]
  skills?: string[]
}

export interface JobListing {
  id: number
  title: string
  clientName: string
  company: string
  companyInitials: string
  companyColor: string
  location?: string
  postedAgo: string
  budget: string
  avgBid?: string
  salaryType: JobSalaryType
  salaryValue: number
  description: string
  skills: string[]
  hiring: boolean
  roles?: JobRoleItem[]

  // Metric & Status fields
  viewsCount: number
  submitsCount: number
  openPositions: number
  filledPositions: number
  status: JobStatus
  experienceLevel: JobExperienceLevel
  clientRating?: number
  duration?: string
  hoursPerDay?: number // Số giờ làm việc yêu cầu mỗi ngày (VD: 2, 4, 8)
  dueDate?: string
  bidCloseDate?: string
  tags?: string[]
  completedProjectsCount?: number
  contractDuration?: string
  salaryDueDate?: string
}

export interface GetJobsParams {
  search?: string
  salaryType?: JobSalaryTypeFilter
  minSalary?: number
  time?: JobTimeFilter
  sortBy?: JobSortBy
  experienceLevel?: 'all' | JobExperienceLevel
  status?: 'all' | JobStatus
  budgetRange?: JobBudgetRange
  hoursPerDay?: JobHoursPerDay
}

export interface FilterOption<T = string> {
  value: T
  label: string
}

export interface JobFilterMetadata {
  salaryTypes: FilterOption<JobSalaryTypeFilter>[]
  timeFilters: FilterOption<JobTimeFilter>[]
  sortOptions: FilterOption<JobSortBy>[]
  experienceLevels: FilterOption<'all' | JobExperienceLevel>[]
  jobStatuses: FilterOption<'all' | JobStatus>[]
  budgetRanges: FilterOption<JobBudgetRange>[]
  hoursPerDay: FilterOption<JobHoursPerDay>[]
}

export interface Contract {
  id: number
  title: string
  client: string
  value: string
  deadline: string
  status: 'in-progress' | 'pending' | 'opening' | 'overdue'
  role?: string
}

export type JobSalaryCycle = 'monthly' | 'hourly' | 'daily' | 'weekly' | 'fixed'

export interface ApplyJobInput {
  jobId: number
  roleId: string
  salaryCycle: JobSalaryCycle
  bidPrice: string
  commitment?: string
  fixedDeliveryDays?: string
  weeklyHours?: string
  cvFile?: { name: string; size: string } | null
  portfolioLink?: string
}

export interface ApplyJobResponse {
  success: boolean
  message: string
  applicationId: string
  roleId: string
  submittedAt: string
}

export interface ReportJobInput {
  jobId: number
  clientName: string
  jobTitle: string
  reason: string
  detail: string
  evidenceImage?: string
}

export interface ReportJobResponse {
  success: boolean
  message: string
  reportId: string
  createdAt: string
}
