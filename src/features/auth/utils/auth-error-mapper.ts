import { ApiError } from '../../../types/api.ts'

/**
 * Complete mapping of backend ErrorCodes from occupify-identity & occupify-gateway
 * to localized user-friendly messages.
 */
export const AUTH_ERROR_CODE_MAP: Record<string, string> = {
  // Validation & Bad Requests (400)
  AUTH_000: 'Định dạng email không hợp lệ.',
  AUTH_002: 'Mật khẩu phải có độ dài ít nhất 8 ký tự.',
  AUTH_004: 'Yêu cầu thiếu refresh token phiên làm việc.',
  AUTH_008: 'Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng yêu cầu mã mới.',
  AUTH_009: 'Mã OTP không chính xác. Vui lòng kiểm tra lại.',
  AUTH_013: 'Mật khẩu hiện tại không chính xác.',
  AUTH_014: 'Mật khẩu mới không được trùng với mật khẩu hiện tại.',
  AUTH_015: 'Tài khoản này đã được kích hoạt trước đó. Vui lòng đăng nhập.',
  AUTH_016: 'Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
  AUTH_017: 'Xác nhận mật khẩu không trùng khớp.',

  // Authentication & Unauthorized (401)
  AUTH_003: 'Email hoặc mật khẩu không chính xác.',
  AUTH_005: 'Phiên làm việc không hợp lệ.',
  AUTH_006: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',

  // Forbidden (403)
  USER_007: 'Tài khoản chưa được kích hoạt. Vui lòng xác thực mã OTP gửi về email của bạn.',
  USER_008: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ ban quản trị để được hỗ trợ.',

  // Resource Not Found (404)
  AUTH_012: 'Không tìm thấy thông tin tài khoản người dùng.',
  USER_001: 'Không tìm thấy người dùng trên hệ thống.',

  // Conflict (409)
  AUTH_001: 'Địa chỉ email này đã được sử dụng. Vui lòng chọn đăng nhập hoặc dùng email khác.',

  // Rate Limiting & Cooldown (429)
  AUTH_007: 'Vui lòng chờ hết thời gian đếm ngược trước khi yêu cầu mã OTP mới.',
  AUTH_010: 'Đã vượt quá số lần nhập sai OTP (tối đa 3 lần). Vui lòng yêu cầu mã mới.',

  // Internal & Infrastructure Errors (500, 502, 503, 504)
  AUTH_011: 'Dịch vụ gửi email thông báo đang bận. Vui lòng thử lại sau ít phút.',
  SYS_001: 'Lỗi nội bộ hệ thống máy chủ (HTTP 500). Vui lòng thử lại sau.',
  SYS_002: 'Dữ liệu yêu cầu không hợp lệ (HTTP 400).',
  SYS_003: 'Lỗi cơ sở dữ liệu hệ thống (HTTP 500). Đội ngũ kỹ thuật đang xử lý.',
  SYS_004: 'Không tìm thấy tài nguyên yêu cầu (HTTP 404).',
  SYS_005: 'Phương thức HTTP không được hỗ trợ (HTTP 405).',
  SYS_006: 'Yêu cầu chưa được xác thực hoặc thiếu token (HTTP 401).',
  SYS_007: 'Truy cập bị từ chối do không đủ quyền hạn (HTTP 403).',
  SYS_008: 'Dịch vụ hệ thống đang tạm ngắt kết nối hoặc bảo trì (HTTP 503).',
  SYS_009: 'Hết thời gian phản hồi từ máy chủ (HTTP 504 Timeout).',

  // Network & Offline
  NETWORK_ERROR: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền Internet.',
}

/**
 * Translates any error into a high-fidelity, user-friendly message
 * covering all status codes (400, 401, 403, 404, 409, 422, 429, 500, 502, 503, 504, 0).
 */
export function getAuthErrorMessage(
  err: unknown,
  fallbackMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.',
): string {
  if (err instanceof ApiError) {
    // 1. Match specific business error code if available
    if (err.errorCode && AUTH_ERROR_CODE_MAP[err.errorCode]) {
      return AUTH_ERROR_CODE_MAP[err.errorCode]
    }

    // 2. Fall back to standard HTTP status codes
    switch (err.statusCode) {
      case 0:
        return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối Internet.'
      case 400:
        return err.message || 'Thông tin gửi lên không hợp lệ.'
      case 401:
        return 'Email hoặc mật khẩu không chính xác.'
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này hoặc tài khoản đang bị hạn chế.'
      case 404:
        return 'Không tìm thấy thông tin yêu cầu.'
      case 409:
        return 'Dữ liệu đã tồn tại trên hệ thống hoặc xảy ra xung đột.'
      case 422:
        return err.message || 'Dữ liệu không thể xử lý.'
      case 429:
        return 'Thao tác quá nhanh hoặc quá thường xuyên. Vui lòng thử lại sau ít phút.'
      case 500:
        return 'Hệ thống máy chủ gặp sự cố nội bộ (HTTP 500). Đội ngũ kỹ thuật đang xử lý.'
      case 502:
        return 'Cổng kết nối dịch vụ bị gián đoạn (HTTP 502 Bad Gateway). Vui lòng thử lại.'
      case 503:
        return 'Dịch vụ đang tạm thời quá tải hoặc bảo trì (HTTP 503). Vui lòng thử lại sau ít phút.'
      case 504:
        return 'Hết thời gian chờ phản hồi từ máy chủ (HTTP 504 Timeout).'
      default:
        return err.message || fallbackMessage
    }
  }

  if (err instanceof Error) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra đường truyền Internet.'
    }
    if (
      err.name === 'ZodError' ||
      (err.message.trim().startsWith('[') && err.message.includes('expected'))
    ) {
      return fallbackMessage
    }
    return err.message
  }

  return fallbackMessage
}
