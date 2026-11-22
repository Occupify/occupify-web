import { apiClient } from '@/lib/api-client'
import type { CreatedResponse } from '@/types'
import type { ReportProfilePayload } from '../types'
import { mapReportReasonToCategory } from '@/features/jobs'

/**
 * Report a user profile to the platform backend (POST /reports)
 */
export async function reportProfileApi(
  payload: ReportProfilePayload,
): Promise<{ success: boolean; message: string }> {
  const category = payload.reasonCategory || mapReportReasonToCategory(payload.reason)

  const formData = new FormData()
  const data: Record<string, string | undefined> = {
    targetType: 'USER',
    reasonCategory: category,
    description: payload.reason.trim(),
  }

  if (payload.reportedUserId) {
    data.targetUserId = payload.reportedUserId
  }

  // Spring Boot @RequestPart("data") expects application/json
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))

  if (payload.evidenceFile) {
    formData.append('files', payload.evidenceFile)
  }

  try {
    const res = await apiClient.post<CreatedResponse<{ id: string }>>('/reports', formData)
    return {
      success: true,
      message:
        res.message ||
        `Đã gửi báo cáo người dùng "${payload.reportedUserName}" thành công. Ban quản trị Occupify sẽ xử lý trong 24h.`,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi khi gửi báo cáo người dùng'
    throw new Error(message)
  }
}
