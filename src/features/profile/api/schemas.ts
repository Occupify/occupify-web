import { z } from 'zod'

export const accountProfileSchema = z.object({
  id: z.string(),
  email: z.string(),
  fullName: z.string().optional().nullable(),
  headline: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  role: z.string(),
  status: z.string(),
  institutionId: z.string().optional().nullable(),
  institutionName: z.string().optional().nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const updateAccountRequestSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Họ và tên không được để trống')
    .max(150, 'Họ và tên tối đa 150 ký tự'),
  headline: z.string().max(255, 'Tiêu đề nghề nghiệp tối đa 255 ký tự').optional(),
  bio: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^[+0-9\-\s()]{7,30}$/, 'Số điện thoại không đúng định dạng')
    .optional()
    .or(z.literal('')),
})

export const avatarResponseSchema = z.object({
  avatarUrl: z.string().optional().nullable(),
})

export const singleAccountResponseEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: accountProfileSchema,
})

export const avatarResponseEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: avatarResponseSchema,
})

export const successResponseEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
})

export const experienceItemResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  employmentType: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  locationType: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
})

export const educationItemResponseSchema = z.object({
  id: z.string(),
  institutionId: z.string().optional().nullable(),
  institutionName: z.string().optional().nullable(),
  institutionLogoUrl: z.string().optional().nullable(),
  fieldOfStudy: z.string(),
  degree: z.string().optional().nullable(),
  grade: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
  documentUrl: z.string().optional().nullable(),
})

export const qualificationItemResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  issueDate: z.string(),
  expirationDate: z.string().optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  documentUrl: z.string().optional().nullable(),
})

export const userSkillItemResponseSchema = z.object({
  skillId: z.string().optional().nullable(),
  skillName: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isTopSkill: z.boolean().default(false),
  proficiencyLevel: z.string().optional().nullable(),
  yearsOfExperience: z.number().optional().nullable(),
})

export const userDetailResponseSchema = z.object({
  user: accountProfileSchema,
  experiences: z.array(experienceItemResponseSchema).default([]),
  educations: z.array(educationItemResponseSchema).default([]),
  qualifications: z.array(qualificationItemResponseSchema).default([]),
  skills: z.array(userSkillItemResponseSchema).default([]),
})

export const userDetailResponseEnvelopeSchema = z.object({
  statusCode: z.number().default(200),
  message: z.string().default('OK'),
  data: userDetailResponseSchema,
})
