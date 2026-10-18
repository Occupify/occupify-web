import type { ApplyJobInput, ApplyJobResponse } from '../types'

/**
 * Submits an application for a specific role in a job project.
 *
 * Simulates network transmission with standard client-side response.
 */
export async function applyToJob(input: ApplyJobInput): Promise<ApplyJobResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Nộp hồ sơ ứng tuyển thành công',
        applicationId: `app-${Date.now()}`,
        roleId: input.roleId,
        submittedAt: new Date().toISOString(),
      })
    }, 120)
  })
}
