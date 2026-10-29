import type { UploadCvResponse } from '../types'
import { currentProfileState } from './profile-state'

/**
 * Upload candidate CV file
 */
export async function uploadCvApi(file: File): Promise<UploadCvResponse> {
  await new Promise((resolve) => setTimeout(resolve, 150))
  currentProfileState.data.cvFileName = file.name
  return {
    fileName: file.name,
    fileUrl: URL.createObjectURL(file),
  }
}
