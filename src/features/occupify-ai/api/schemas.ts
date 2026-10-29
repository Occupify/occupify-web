import { z } from 'zod'

export const attachmentInfoSchema = z
  .object({
    fileName: z.string().default(''),
    pages: z.number().optional().default(1),
    removed: z.record(z.string(), z.number()).optional().default({}),
  })
  .loose()

export const tokenUsageSchema = z.object({
  tokensIn: z.number().default(0),
  tokensOut: z.number().default(0),
})

export const chatSessionItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  messageCount: z.number().default(0),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const chatSessionsPageEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: z.array(chatSessionItemSchema).default([]),
  paging: z
    .object({
      page: z.number().default(1),
      limit: z.number().default(20),
      total: z.number().default(0),
      totalPages: z.number().default(1),
    })
    .optional(),
})

export const chatMessageItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  seq: z.number().default(1),
  role: z.enum(['user', 'assistant']).catch('user'),
  displayText: z.string().default(''),
  attachments: z.array(attachmentInfoSchema).optional().default([]),
  createdAt: z.string(),
})

export const chatMessagesPageEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: z.array(chatMessageItemSchema).default([]),
  paging: z
    .object({
      page: z.number().default(1),
      limit: z.number().default(50),
      total: z.number().default(0),
      totalPages: z.number().default(1),
    })
    .optional(),
})

export const chatReplyDataSchema = z.object({
  sessionId: z.string(),
  newSession: z.boolean().default(false),
  messageId: z.string(),
  reply: z.string(),
  attachments: z.array(attachmentInfoSchema).optional().default([]),
  model: z.string().default(''),
  usage: tokenUsageSchema.default({ tokensIn: 0, tokensOut: 0 }),
})

export const chatReplyResponseEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: chatReplyDataSchema,
})

export const deleteChatSessionResponseSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: z
    .object({
      deleted: z.boolean().default(true),
    })
    .default({ deleted: true }),
})

export const streamMetaPayloadSchema = z.object({
  sessionId: z.string(),
  newSession: z.boolean().default(false),
  messageId: z.string(),
  attachments: z.array(attachmentInfoSchema).optional().default([]),
})

export const streamDeltaPayloadSchema = z.object({
  text: z.string(),
})

export const streamDonePayloadSchema = z.object({
  model: z.string().default(''),
  usage: tokenUsageSchema.default({ tokensIn: 0, tokensOut: 0 }),
})

export const streamErrorPayloadSchema = z.object({
  errorCode: z.string().optional(),
  message: z.string(),
})
