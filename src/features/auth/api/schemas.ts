import { z } from 'zod'

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string(),
  status: z.string(),
  createdAt: z.string().optional(),
})

export const authResponseDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: authUserSchema.optional(),
})

export const verifyOtpDataSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  user: authUserSchema.optional(),
  resetToken: z.string().optional(),
})

export const authResponseEnvelopeSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: authResponseDataSchema,
})

export const userResponseEnvelopeSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: authUserSchema,
})

export const successResponseEnvelopeSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

export const verifyOtpEnvelopeSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: z.union([authResponseDataSchema, z.object({ resetToken: z.string() }), z.any()]),
})
