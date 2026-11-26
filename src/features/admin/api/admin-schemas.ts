import { z } from 'zod'

export const moderationReasonSchema = z
  .string()
  .max(1000, 'Lý do không được vượt quá 1000 ký tự')
  .nullable()
  .optional()

export const accountModerationRequestSchema = z.object({
  reason: moderationReasonSchema,
})

export const closeProjectRequestSchema = z.object({
  reason: moderationReasonSchema,
})

export const successResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
})

const nullableString = z
  .string()
  .nullable()
  .optional()
  .transform((v) => v ?? '')

export const adminUserBackendSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: nullableString,
  avatarUrl: z.string().nullable().optional(),
  role: z.string(),
  status: z.string(),
  statusReason: z.string().nullable().optional(),
  createdAt: z.string(),
  deletedAt: z.string().nullable().optional(),
  isFlagged: z.boolean().optional().default(false),
  totalCompletedContracts: z.number().optional(),
  disputeCount: z.number().optional(),
})

export const adminUserSingleResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: adminUserBackendSchema,
})

export const adminProjectEmployerSchema = z
  .object({
    id: z.string(),
    email: z.string(),
    fullName: nullableString,
    avatarUrl: z.string().nullable().optional(),
  })
  .nullable()
  .optional()

export const adminProjectBackendSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  employer: adminProjectEmployerSchema,
  createdAt: z.string(),
  closedAt: z.string().nullable().optional(),
  reportCount: z.number().optional().default(0),
})

export const adminProjectSingleResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: adminProjectBackendSchema,
})

export const adminReportBackendSchema = z.object({
  id: z.string(),
  reporterId: nullableString,
  reporterEmail: nullableString,
  targetType: z.enum(['USER', 'PROJECT']),
  targetUserId: z.string().nullable().optional(),
  targetProjectId: z.string().nullable().optional(),
  reasonCategory: z.enum([
    'FRAUD',
    'OUTSIDE_PAYMENT',
    'FAKE_INFORMATION',
    'SPAM',
    'HARASSMENT',
    'OTHER',
  ]),
  description: nullableString,
  status: z.enum(['PENDING', 'RESOLVED', 'DISMISSED']),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const adminReportSingleResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  data: adminReportBackendSchema,
})

export function normalizeModerationReason(reason?: string | null): string | null {
  if (typeof reason !== 'string') return null
  const trimmed = reason.trim()
  return trimmed.length > 0 ? trimmed : null
}
