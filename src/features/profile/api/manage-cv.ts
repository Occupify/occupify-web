import type { UploadCvResponse } from '../types'

/**
 * Upload candidate CV file
 */
export async function uploadCvApi(file: File): Promise<UploadCvResponse> {
  return {
    fileName: file.name,
    fileUrl: URL.createObjectURL(file),
  }
}
