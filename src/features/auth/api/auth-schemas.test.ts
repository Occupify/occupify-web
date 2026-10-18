import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createdResponseEnvelopeSchema,
  registerResponseEnvelopeSchema,
  userResponseEnvelopeSchema,
  authResponseEnvelopeSchema,
  verifyOtpEnvelopeSchema,
} from './schemas.ts'
import { getAuthErrorMessage } from '../utils/auth-error-mapper.ts'

test('createdResponseEnvelopeSchema successfully parses register response with omitted data', () => {
  const backendRegisterResponse = {
    statusCode: 201,
    message: 'Account registered successfully. Verification OTP has been sent to your email.',
  }

  const parsed = createdResponseEnvelopeSchema.parse(backendRegisterResponse)
  assert.equal(parsed.statusCode, 201)
  assert.equal(
    parsed.message,
    'Account registered successfully. Verification OTP has been sent to your email.',
  )
  assert.equal(parsed.data, undefined)
})

test('createdResponseEnvelopeSchema successfully parses response with null data', () => {
  const backendResponse = {
    statusCode: 201,
    message: 'Created',
    data: null,
  }

  const parsed = createdResponseEnvelopeSchema.parse(backendResponse)
  assert.equal(parsed.statusCode, 201)
  assert.equal(parsed.data, null)
})

test('registerResponseEnvelopeSchema and userResponseEnvelopeSchema tolerate omitted data', () => {
  const backendRegisterResponse = {
    statusCode: 201,
    message: 'Account registered successfully.',
  }

  const registerParsed = registerResponseEnvelopeSchema.parse(backendRegisterResponse)
  assert.equal(registerParsed.statusCode, 201)
  assert.equal(registerParsed.data, undefined)

  const userParsed = userResponseEnvelopeSchema.parse(backendRegisterResponse)
  assert.equal(userParsed.statusCode, 201)
  assert.equal(userParsed.data, undefined)
})

test('authResponseEnvelopeSchema parses valid login response', () => {
  const loginResponse = {
    statusCode: 200,
    message: 'Login successful',
    data: {
      accessToken: 'jwt-access-token',
      refreshToken: 'jwt-refresh-token',
      user: {
        id: 'usr_123',
        email: 'user@occupify.com',
        role: 'USER',
        status: 'ACTIVE',
      },
    },
  }

  const parsed = authResponseEnvelopeSchema.parse(loginResponse)
  assert.equal(parsed.statusCode, 200)
  assert.equal(parsed.data.accessToken, 'jwt-access-token')
  assert.equal(parsed.data.user?.email, 'user@occupify.com')
})

test('verifyOtpEnvelopeSchema parses both REGISTER and FORGOT_PASSWORD payloads', () => {
  const registerOtpResponse = {
    statusCode: 200,
    message: 'OTP verified successfully',
    data: {
      accessToken: 'jwt-access-token',
      refreshToken: 'jwt-refresh-token',
      user: {
        id: 'usr_123',
        email: 'user@occupify.com',
        role: 'USER',
        status: 'ACTIVE',
      },
    },
  }

  const forgotOtpResponse = {
    statusCode: 200,
    message: 'OTP verified successfully',
    data: {
      resetToken: 'reset-token-xyz',
    },
  }

  const registerParsed = verifyOtpEnvelopeSchema.parse(registerOtpResponse)
  assert.equal(registerParsed.statusCode, 200)

  const forgotParsed = verifyOtpEnvelopeSchema.parse(forgotOtpResponse)
  assert.equal(forgotParsed.statusCode, 200)
})

test('getAuthErrorMessage masks raw Zod schema error arrays', () => {
  const zodRawError = new Error(
    JSON.stringify([
      {
        expected: 'object',
        code: 'invalid_type',
        path: ['data'],
        message: 'Invalid input: expected object, received undefined',
      },
    ]),
  )

  const message = getAuthErrorMessage(zodRawError, 'Đăng ký không thành công.')
  assert.equal(message, 'Đăng ký không thành công.')
})
