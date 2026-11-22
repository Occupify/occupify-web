import { apiClient } from '../../../lib/api-client.ts'
import type { CreatedResponse } from '../../../types/index.ts'
import type { ReportJobInput, ReportJobResponse } from '../types/index.ts'
import { mapReportReasonToCategory } from '../types/report-mapping.ts'

export { mapReportReasonToCategory }

/**
 * Submits a violation report against a job / project (POST /reports)
 * Multipart/form-data: part 'data' (JSON), part 'files' (optional binary)
 */
export async function reportJob(input: ReportJobInput): Promise<ReportJobResponse> {
  const targetProjectId = String(input.projectId || input.jobId)
  const category = input.reasonCategory || mapReportReasonToCategory(input.reason)

  const formData = new FormData()

  const payload = {
    targetType: 'PROJECT',
    targetProjectId,
    reasonCategory: category,
    description: input.detail.trim(),
  }

  // Spring Boot @RequestPart("data") expects application/json
  formData.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }))

  if (input.evidenceFile) {
    formData.append('files', input.evidenceFile)
  }

  try {
    const res = await apiClient.post<CreatedResponse<{ id: string; createdAt: string }>>(
      '/reports',
      formData,
    )

    return {
      success: true,
      message:
        res.message ||
        'Báo cáo vi phạm đã được tiếp nhận thành công. Ban quản trị Occupify sẽ xử lý trong 24h.',
      reportId: res.data?.id || `rep-${Date.now()}-${targetProjectId}`,
      createdAt: res.data?.createdAt || new Date().toISOString(),
    }
  } catch (err: unknown) {
    // If backend reports is unavailable or network error, provide clear feedback
    const message = err instanceof Error ? err.message : 'Lỗi khi gửi báo cáo vi phạm'
    throw new Error(message)
  }
}
