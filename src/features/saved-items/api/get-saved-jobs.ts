import type { JobListing } from '../types'
import { JOB_LISTINGS } from '@/features/mock-data'

// In-memory dumb data store simulating backend persistence
let savedJobIdsStore: number[] = [1, 3]

export async function getSavedJobIds(): Promise<number[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return [...savedJobIdsStore]
}

export async function getSavedJobs(): Promise<JobListing[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return JOB_LISTINGS.filter((job) => savedJobIdsStore.includes(job.id))
}

export async function getAllJobs(): Promise<JobListing[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...JOB_LISTINGS]
}

export async function toggleSaveJob(jobId: number): Promise<{ jobId: number; isSaved: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  const exists = savedJobIdsStore.includes(jobId)
  if (exists) {
    savedJobIdsStore = savedJobIdsStore.filter((id) => id !== jobId)
    return { jobId, isSaved: false }
  } else {
    savedJobIdsStore = [...savedJobIdsStore, jobId]
    return { jobId, isSaved: true }
  }
}
