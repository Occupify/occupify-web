import type {
  JobListing,
  JobRoleItem,
  JobSalaryType,
  JobExperienceLevel,
  ProjectApiResponse,
  ProjectDetailApiResponse,
  JobSummaryResponse,
} from './index.ts'

export function formatCurrencyVND(amount?: number | null): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '0 ₫'
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫'
}

export function formatRawNumberVN(amount?: number | null): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return '0'
  return new Intl.NumberFormat('vi-VN').format(amount)
}

export function mapSalaryType(salaryType?: string | null): JobSalaryType {
  const norm = (salaryType || '').toUpperCase()
  switch (norm) {
    case 'HOURLY':
      return 'hourly'
    case 'WEEKLY':
      return 'weekly'
    case 'FIXED':
    case 'DAY':
      return 'fixed'
    case 'MONTHLY':
    default:
      return 'monthly'
  }
}

export function getSalaryTypeLabel(salaryType?: string | null): string {
  const mapped = mapSalaryType(salaryType)
  switch (mapped) {
    case 'hourly':
      return '/ giờ'
    case 'weekly':
      return '/ tuần'
    case 'fixed':
      return '/ dự án'
    case 'monthly':
    default:
      return '/ tháng'
  }
}

export function mapExperienceLevel(level?: string | null): JobExperienceLevel {
  const norm = (level || '').toUpperCase()
  switch (norm) {
    case 'EXPERT':
      return 'expert'
    case 'INTERMEDIATE':
      return 'intermediate'
    case 'ENTRY':
    default:
      return 'entry'
  }
}

export function getCompanyInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'DA'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase()
  }
  const initials = parts
    .map((w) => w[0])
    .filter(Boolean)
    .join('')
    .slice(0, 3)
    .toUpperCase()
  return initials || 'DA'
}

export function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return 'Mới đăng'
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return 'Mới đăng'
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    if (diffMs < 0) return 'Vừa xong'

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      return diffMins <= 1 ? 'Vừa xong' : `${diffMins} phút trước`
    }
    if (diffHours < 24) {
      return `${diffHours} giờ trước`
    }
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 30) {
      return `${diffDays} ngày trước`
    }
    const diffMonths = Math.floor(diffDays / 30)
    return `${diffMonths} tháng trước`
  } catch {
    return 'Mới đăng'
  }
}

export function formatDueDate(dateStr?: string | null): string {
  if (!dateStr) return 'Linh hoạt'
  try {
    const [year, month, day] = dateStr.split('T')[0].split('-')
    if (year && month && day) {
      return `${day}/${month}/${year}`
    }
    const d = new Date(dateStr)
    if (!Number.isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0')
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const yyyy = d.getFullYear()
      return `${dd}/${mm}/${yyyy}`
    }
    return dateStr
  } catch {
    return dateStr
  }
}

export function formatBudgetDisplay(
  minBudget?: number | null,
  maxBudget?: number | null,
  salaryType?: string | null,
): string {
  const min = typeof minBudget === 'number' && !Number.isNaN(minBudget) ? minBudget : 0
  const max = typeof maxBudget === 'number' && !Number.isNaN(maxBudget) ? maxBudget : 0
  const cycleLabel = getSalaryTypeLabel(salaryType)

  if (min <= 0 && max <= 0) {
    return 'Thương lượng'
  }
  if (min > 0 && max > 0) {
    if (min === max) {
      return `${formatCurrencyVND(min)} ${cycleLabel}`.trim()
    }
    return `${formatRawNumberVN(min)} – ${formatCurrencyVND(max)} ${cycleLabel}`.trim()
  }
  if (min > 0) {
    return `Từ ${formatCurrencyVND(min)} ${cycleLabel}`.trim()
  }
  return `Lên đến ${formatCurrencyVND(max)} ${cycleLabel}`.trim()
}

export function mapJobsToRoles(jobs?: JobSummaryResponse[] | null, projectId?: string): JobRoleItem[] {
  if (!jobs || jobs.length === 0) {
    return [
      {
        id: `def-${projectId || '1'}`,
        title: 'Cộng tác viên / Thành viên dự án',
        minBudget: 0,
        maxBudget: 0,
        budgetDisplay: 'Thương lượng',
        salaryType: 'monthly',
        salaryTypeLabel: '/ tháng',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting',
        jd: 'Tham gia thực hiện các hạng mục công việc theo yêu cầu của dự án.',
        requirements: ['Có kỹ năng chuyên môn phù hợp', 'Tinh thần trách nhiệm cao'],
        skills: [],
      },
    ]
  }

  return jobs.map((job) => {
    const min = Number(job.budgetMin) || 0
    const max = Number(job.budgetMax) || 0
    const stType = mapSalaryType(job.salaryType)
    const stLabel = getSalaryTypeLabel(job.salaryType)
    return {
      id: job.id,
      title: job.title,
      minBudget: min,
      maxBudget: max,
      budgetDisplay: formatBudgetDisplay(min, max, job.salaryType),
      salaryType: stType,
      salaryTypeLabel: stLabel,
      slotsTotal: job.quantity || 1,
      slotsFilled: 0,
      status: job.status === 'RECRUITING' ? 'recruiting' : 'filled',
      jd: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements : [],
      skills: Array.isArray(job.skills) ? job.skills : [],
    }
  })
}

export function toJobListingFromProject(project: ProjectApiResponse): JobListing {
  const employerName = project.employer?.fullName?.trim() || 'Nhà tuyển dụng'
  const companyName = project.employer?.fullName?.trim() || 'Dự án Doanh nghiệp'
  const companyInitials = getCompanyInitials(employerName)

  const roles = mapJobsToRoles(project.jobs, project.id)

  // Overall budget calculation across project's jobs
  let minBudget = 0
  let maxBudget = 0
  let primarySalaryType: JobSalaryType = 'monthly'

  if (project.jobs && project.jobs.length > 0) {
    const validMins = project.jobs.map((j) => Number(j.budgetMin) || 0).filter((v) => v > 0)
    const validMaxs = project.jobs.map((j) => Number(j.budgetMax) || 0).filter((v) => v > 0)
    if (validMins.length > 0) minBudget = Math.min(...validMins)
    if (validMaxs.length > 0) maxBudget = Math.max(...validMaxs)
    primarySalaryType = mapSalaryType(project.jobs[0].salaryType)
  } else if (project.period) {
    primarySalaryType = mapSalaryType(project.period)
  }

  const budgetDisplay = formatBudgetDisplay(minBudget, maxBudget, primarySalaryType)
  const salaryValue = maxBudget || minBudget || 0

  // Combine project skills and job skills without duplicates
  const allSkills = new Set<string>()
  if (Array.isArray(project.skills)) {
    project.skills.forEach((s) => s && allSkills.add(s.trim()))
  }
  if (project.jobs) {
    project.jobs.forEach((j) => {
      if (Array.isArray(j.skills)) {
        j.skills.forEach((s) => s && allSkills.add(s.trim()))
      }
    })
  }

  const totalBids = (project.jobs || []).reduce((acc, j) => acc + (j.bidCount || 0), 0)
  const openPositions = project.openJobsCount || project.jobs?.length || 1

  return {
    id: project.id,
    title: project.title,
    clientName: employerName,
    company: companyName,
    companyInitials,
    companyColor: '#0A66C2',
    location: project.location || 'Toàn quốc',
    postedAgo: formatRelativeTime(project.createdAt),
    budget: budgetDisplay,
    avgBid: totalBids > 0 ? `${totalBids} báo giá` : undefined,
    salaryType: primarySalaryType,
    salaryValue,
    description: project.description || '',
    skills: Array.from(allSkills),
    hiring: project.status === 'OPEN',
    roles,
    viewsCount: 0,
    submitsCount: totalBids,
    openPositions,
    filledPositions: 0,
    status: project.status === 'OPEN' ? 'OPEN' : 'CLOSED',
    experienceLevel: mapExperienceLevel(project.experienceLevel),
    clientRating: 5.0,
    duration: project.duration || (project.period ? getSalaryTypeLabel(project.period).replace('/', 'Theo') : 'Linh hoạt'),
    hoursPerDay: project.hoursPerDay ? Number(project.hoursPerDay) : undefined,
    dueDate: formatDueDate(project.dueDate),
    bidCloseDate: formatDueDate(project.startDate || project.dueDate),
    tags: Array.isArray(project.tags) ? project.tags : [],
    completedProjectsCount: 1,
  }
}

export function toJobListingFromProjectDetail(detail: ProjectDetailApiResponse): JobListing {
  const baseListing = toJobListingFromProject(detail as unknown as ProjectApiResponse)

  if (detail.startPrice && (!baseListing.salaryValue || baseListing.salaryValue === 0)) {
    const price = Number(detail.startPrice)
    baseListing.salaryValue = price
    baseListing.budget = `${formatCurrencyVND(price)} ${getSalaryTypeLabel(detail.period)}`.trim()
  }

  return baseListing
}
