import type { ReportProfilePayload } from '../types'

/**
 * Report a user profile
 */
export async function reportProfileApi(
  payload: ReportProfilePayload,
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return {
    success: true,
    message: `Đã gửi báo cáo người dùng "${payload.reportedUserName}" thành công. Ban quản trị Occupify sẽ xử lý trong 24h.`,
  }
}
