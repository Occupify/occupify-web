import { apiClient } from '@/lib/api-client'
import type { PageResponse, SingleResponse } from '@/types'
import type {
  JobListing,
  GetJobsParams,
  ProjectApiResponse,
  ProjectDetailApiResponse,
} from '../types/index.ts'
import {
  toJobListingFromProject,
  toJobListingFromProjectDetail,
} from '../types/projects-mapping.ts'

// Optional local store to support optimistic additions within the session
let localCustomJobs: JobListing[] = []

export function addJobListing(job: JobListing): void {
  localCustomJobs = [job, ...localCustomJobs]
}

export function getInternalJobsStore(): JobListing[] {
  return [...localCustomJobs]
}

export function resetJobsStore(): void {
  localCustomJobs = []
}

/**
 * Fetches the paginated list of projects from backend API (/projects),
 * mapped to the JobListing view model for the homepage feed.
 */
export async function getJobs(params?: GetJobsParams): Promise<JobListing[]> {
  const queryParams: Record<string, string | number | undefined> = {
    page: params?.page ?? 0,
    size: params?.size ?? 20,
    sort: 'createdAt,desc',
  }

  // 1. Keyword search (unaccented matching in backend)
  const rawKeyword = (params?.search || params?.keyword || '').trim()
  if (rawKeyword) {
    queryParams.keyword = rawKeyword
  }

  // 2. Status filter
  if (params?.status && params.status !== 'all') {
    queryParams.status = params.status
  }

  // 3. Experience Level filter
  if (params?.experienceLevel && params.experienceLevel !== 'all') {
    queryParams.experienceLevel = params.experienceLevel.toUpperCase()
  }

  // 4. Salary / Period filter
  if (params?.salaryType && params.salaryType !== 'all') {
    queryParams.period = params.salaryType.toUpperCase()
  }

  // 5. Budget Range filter
  if (params?.budgetRange && params.budgetRange !== 'all') {
    if (params.budgetRange === 'under-5m') {
      queryParams.maxPrice = 5000000
    } else if (params.budgetRange === '5m-20m') {
      queryParams.minPrice = 5000000
      queryParams.maxPrice = 20000000
    } else if (params.budgetRange === '20m-50m') {
      queryParams.minPrice = 20000000
      queryParams.maxPrice = 50000000
    } else if (params.budgetRange === 'above-50m') {
      queryParams.minPrice = 50000000
    }
  }

  try {
    const response = await apiClient.get<PageResponse<ProjectApiResponse>>('/projects', {
      params: queryParams,
    })

    const apiJobs = (response?.data || []).map(toJobListingFromProject)

    // Prepend any locally added jobs from the current session if matching
    if (localCustomJobs.length > 0) {
      return [...localCustomJobs, ...apiJobs]
    }
    return apiJobs
  } catch (error) {
    // If backend returns empty or network fails, return localCustomJobs or rethrow
    if (localCustomJobs.length > 0) {
      return localCustomJobs
    }
    throw error
  }
}

/**
 * Fetches a single project details by ID (/projects/{id}),
 * mapped to the JobListing view model for the drawer / details view.
 */
export async function getJobById(id: string | number): Promise<JobListing | null> {
  // Check local store first
  const localMatch = localCustomJobs.find((j) => String(j.id) === String(id))
  if (localMatch) return localMatch

  try {
    const response = await apiClient.get<SingleResponse<ProjectDetailApiResponse>>(
      `/projects/${id}`,
    )
    if (response?.data) {
      return toJobListingFromProjectDetail(response.data)
    }
    return null
  } catch {
    return null
  }
}
