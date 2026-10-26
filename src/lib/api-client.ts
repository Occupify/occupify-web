import { env } from '@/config/env'
import { ApiError, type ErrorResponse } from '@/types'
import { useAuthStore } from '@/stores'

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>
  skipAuth?: boolean
}

let isRefreshing = false
let refreshSubscribers: Array<(newToken: string) => void> = []

function subscribeTokenRefresh(cb: (newToken: string) => void) {
  refreshSubscribers.push(cb)
}

function onRefreshed(newToken: string) {
  refreshSubscribers.forEach((cb) => cb(newToken))
  refreshSubscribers = []
}

function onRefreshFailed() {
  refreshSubscribers = []
}

function getDefaultStatusMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Yêu cầu không hợp lệ (400 Bad Request)'
    case 401:
      return 'Phiên xác thực không hợp lệ hoặc đã hết hạn (401 Unauthorized)'
    case 403:
      return 'Bạn không có quyền thực hiện thao tác này (403 Forbidden)'
    case 404:
      return 'Không tìm thấy tài nguyên yêu cầu (404 Not Found)'
    case 409:
      return 'Dữ liệu bị xung đột hoặc đã tồn tại (409 Conflict)'
    case 422:
      return 'Dữ liệu không thể xử lý (422 Unprocessable Entity)'
    case 429:
      return 'Thao tác quá thường xuyên. Vui lòng thử lại sau (429 Too Many Requests)'
    case 500:
      return 'Hệ thống máy chủ gặp lỗi nội bộ (500 Internal Server Error)'
    case 502:
      return 'Cổng dịch vụ downstream không phản hồi (502 Bad Gateway)'
    case 503:
      return 'Dịch vụ tạm thời không khả dụng hoặc quá tải (503 Service Unavailable)'
    case 504:
      return 'Hết thời gian phản hồi từ máy chủ (504 Gateway Timeout)'
    default:
      return `Yêu cầu thất bại với mã trạng thái ${status}`
  }
}

async function performTokenRefresh(): Promise<string> {
  const { refreshToken, clearTokens, setTokens } = useAuthStore.getState()
  if (!refreshToken) {
    clearTokens()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('occupify:session-expired'))
    }
    throw new ApiError('No refresh token available', 401, 'AUTH_004')
  }

  try {
    const cleanBaseUrl = env.apiBaseUrl.replace(/\/+$/, '')
    const refreshUrl = `${cleanBaseUrl}/auth/refresh-token`
    const response = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Refresh-Token': refreshToken,
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      let errorBody: ErrorResponse | null = null
      try {
        errorBody = await response.json()
      } catch {
        // Ignored
      }
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        clearTokens()
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('occupify:session-expired'))
        }
      }
      throw new ApiError(
        errorBody?.message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        response.status,
        errorBody?.errorCode || 'AUTH_005',
      )
    }

    const payload = await response.json()
    const newAccessToken = payload?.data?.accessToken || payload?.accessToken
    const newRefreshToken = payload?.data?.refreshToken || payload?.refreshToken || refreshToken
    const newUser = payload?.data?.user || payload?.user

    if (!newAccessToken) {
      clearTokens()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('occupify:session-expired'))
      }
      throw new ApiError('Malformed refresh response', 500, 'AUTH_005')
    }

    setTokens(newAccessToken, newRefreshToken, newUser)
    return newAccessToken
  } catch (error) {
    if (error instanceof ApiError && (error.statusCode === 400 || error.statusCode === 401 || error.statusCode === 403)) {
      clearTokens()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('occupify:session-expired'))
      }
    }
    throw error
  }
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, skipAuth = false, headers: customHeaders, ...customConfig } = options

  const cleanBase = env.apiBaseUrl.replace(/\/+$/, '')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  let url = endpoint.startsWith('http') ? endpoint : `${cleanBase}${cleanEndpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (!skipAuth) {
    const accessToken = useAuthStore.getState().accessToken
    if (accessToken) {
      defaultHeaders.Authorization = `Bearer ${accessToken}`
    }
  }

  const mergedHeaders = {
    ...defaultHeaders,
    ...((customHeaders as Record<string, string>) || {}),
  }

  const config: RequestInit = {
    ...customConfig,
    headers: mergedHeaders,
  }

  let response: Response
  try {
    response = await fetch(url, config)
  } catch (netError: unknown) {
    const msg = netError instanceof Error ? netError.message : 'Network error'
    throw new ApiError(`Không thể kết nối đến máy chủ: ${msg}`, 0, 'NETWORK_ERROR')
  }

  // Handle 401 Unauthorized with Silent Refresh Queue
  const isAuthEndpoint =
    endpoint.includes('/auth/login') ||
    endpoint.includes('/auth/register') ||
    endpoint.includes('/auth/refresh-token') ||
    endpoint.includes('/auth/verify-otp') ||
    endpoint.includes('/auth/reset-password')

  if (response.status === 401 && !skipAuth && !isAuthEndpoint) {
    const currentRefreshToken = useAuthStore.getState().refreshToken

    if (currentRefreshToken) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          const newToken = await performTokenRefresh()
          onRefreshed(newToken)
          isRefreshing = false

          // Retry current request with new token
          const retryHeaders = {
            ...mergedHeaders,
            Authorization: `Bearer ${newToken}`,
          }
          const retryResponse = await fetch(url, {
            ...customConfig,
            headers: retryHeaders,
          })
          return handleResponse<T>(retryResponse)
        } catch (refreshErr) {
          isRefreshing = false
          onRefreshFailed()
          throw refreshErr
        }
      }

      // Wait for in-flight refresh to finish, then retry
      return new Promise<T>((resolve, reject) => {
        subscribeTokenRefresh(async (newToken) => {
          try {
            const retryHeaders = {
              ...mergedHeaders,
              Authorization: `Bearer ${newToken}`,
            }
            const retryResponse = await fetch(url, {
              ...customConfig,
              headers: retryHeaders,
            })
            resolve(await handleResponse<T>(retryResponse))
          } catch (retryErr) {
            reject(retryErr)
          }
        })
      })
    } else {
      // No refresh token available, session is void
      useAuthStore.getState().clearTokens()
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('occupify:session-expired'))
      }
    }
  }

  return handleResponse<T>(response)
}

async function handleResponse<T>(response: Response): Promise<T> {
  let data: any = null
  try {
    const isJson = response.headers.get('content-type')?.includes('application/json')
    if (isJson) {
      data = await response.json()
    }
  } catch {
    // Empty or non-JSON payload from proxy or gateway
  }

  if (!response.ok) {
    const fallbackMessage = getDefaultStatusMessage(response.status)
    const message = data?.message || (response.statusText ? response.statusText : fallbackMessage)
    const errorCode = data?.errorCode
    throw new ApiError(message, response.status, errorCode, data)
  }

  return data as T
}

export async function refreshAuthToken(): Promise<string> {
  return performTokenRefresh()
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' })
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' })
  },
}
