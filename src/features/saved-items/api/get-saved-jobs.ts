import type { JobListing } from '../types/index.ts'
import { JOB_LISTINGS } from '../../mock-data.ts'

export const SAVED_PROJECT_IDS_KEY = 'occupify_saved_project_ids'

export type JobDetailResolver = (id: string | number) => Promise<JobListing | null>

let customJobResolver: JobDetailResolver | null = null

export function setCustomJobResolver(resolver: JobDetailResolver | null): void {
  customJobResolver = resolver
}

function getStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage
  }
  if (
    typeof globalThis !== 'undefined' &&
    (globalThis as unknown as { localStorage?: Storage }).localStorage
  ) {
    return (globalThis as unknown as { localStorage?: Storage }).localStorage ?? null
  }
  return null
}

export function readSavedIds(): (string | number)[] {
  const storage = getStorage()
  if (!storage) return []
  try {
    const raw = storage.getItem(SAVED_PROJECT_IDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is string | number => typeof item === 'string' || typeof item === 'number',
      )
    }
    return []
  } catch {
    return []
  }
}

export function saveSavedIds(ids: (string | number)[]): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(SAVED_PROJECT_IDS_KEY, JSON.stringify(ids))
  } catch {
    // Gracefully handle storage quota or private mode errors
  }
}

export async function getSavedJobIds(): Promise<(string | number)[]> {
  return readSavedIds()
}

export async function toggleSaveJob(
  jobId: string | number,
): Promise<{ jobId: string | number; isSaved: boolean }> {
  const currentIds = readSavedIds()
  const exists = currentIds.some((id) => String(id) === String(jobId))
  let newIds: (string | number)[]
  let isSaved: boolean

  if (exists) {
    newIds = currentIds.filter((id) => String(id) !== String(jobId))
    isSaved = false
  } else {
    newIds = [...currentIds, jobId]
    isSaved = true
  }

  saveSavedIds(newIds)
  return { jobId, isSaved }
}

async function resolveJobById(id: string | number): Promise<JobListing | null> {
  if (customJobResolver) {
    return customJobResolver(id)
  }
  try {
    const { getJobById } = await import('../../jobs/api/get-jobs.ts')
    return await getJobById(id)
  } catch {
    return null
  }
}

export async function getSavedJobs(): Promise<JobListing[]> {
  const ids = readSavedIds()
  if (ids.length === 0) return []

  const results = await Promise.allSettled(
    ids.map(async (id) => {
      // 1. Try to fetch from backend or active session cache via resolver
      const job = await resolveJobById(id)
      if (job) return job

      // 2. Fallback to mock data matching id
      const mockJob = JOB_LISTINGS.find((item) => String(item.id) === String(id))
      return mockJob ?? null
    }),
  )

  const savedJobs: JobListing[] = []
  for (const res of results) {
    if (res.status === 'fulfilled' && res.value) {
      savedJobs.push(res.value)
    }
  }

  return savedJobs
}

export async function getAllJobs(): Promise<JobListing[]> {
  return [...JOB_LISTINGS]
}
