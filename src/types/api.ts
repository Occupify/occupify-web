/**
 * Unified Backend Response Envelopes & Error Contracts
 * Matching Spring Boot 3 ResponseFactory specifications.
 */

export interface SingleResponse<T> {
  statusCode: number
  message: string
  data: T
}

export interface CreatedResponse<T> {
  statusCode: number
  message: string
  data: T
}

export interface SuccessResponse {
  statusCode: number
  message: string
}

export interface ErrorResponse {
  statusCode: number
  message: string
  errorCode?: string
}

export type ApiResponse<T> = SingleResponse<T> | CreatedResponse<T>

export class ApiError extends Error {
  readonly statusCode: number
  readonly errorCode?: string
  readonly details?: unknown

  constructor(message: string, statusCode = 500, errorCode?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errorCode = errorCode
    this.details = details
  }

  static fromErrorResponse(err: ErrorResponse): ApiError {
    return new ApiError(
      err.message || 'An unexpected error occurred',
      err.statusCode || 500,
      err.errorCode,
    )
  }
}
