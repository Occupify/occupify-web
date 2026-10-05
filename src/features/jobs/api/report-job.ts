import type { ReportJobInput, ReportJobResponse } from '../types'

/**
 * Submits a report against a job or client.
 */
export async function reportJob(input: ReportJobInput): Promise<ReportJobResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Báo cáo vi phạm đã được tiếp nhận và xử lý trong 24h',
        reportId: `rep-${Date.now()}-${input.jobId}`,
        createdAt: new Date().toISOString(),
      })
    }, 120)
  })
}
