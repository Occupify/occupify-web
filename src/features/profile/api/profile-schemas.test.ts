import test from 'node:test'
import assert from 'node:assert/strict'
import {
  accountProfileSchema,
  singleAccountResponseEnvelopeSchema,
  updateAccountRequestSchema,
  avatarResponseEnvelopeSchema,
  successResponseEnvelopeSchema,
  userDetailResponseSchema,
  userDetailResponseEnvelopeSchema,
  experienceItemResponseSchema,
  educationItemResponseSchema,
  qualificationItemResponseSchema,
  userSkillItemResponseSchema,
} from './schemas.ts'

test('accountProfileSchema parses a valid backend user profile response', () => {
  const backendProfile = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    email: 'developer@occupify.work',
    fullName: 'Nguyen Minh Khoa',
    headline: 'Senior Product Designer',
    avatarUrl: 'https://storage.occupify.work/avatars/user-1.png',
    bio: 'Product Designer & Architect',
    phoneNumber: '+84988888888',
    role: 'USER',
    status: 'ACTIVE',
    institutionId: 'a12bc34d-58cc-4372-a567-0e02b2c3d479',
    institutionName: 'Đại học Bách Khoa Hà Nội',
    createdAt: '2026-10-28T08:00:00Z',
    updatedAt: '2026-10-28T12:00:00Z',
  }

  const parsed = accountProfileSchema.parse(backendProfile)
  assert.equal(parsed.id, 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
  assert.equal(parsed.email, 'developer@occupify.work')
  assert.equal(parsed.fullName, 'Nguyen Minh Khoa')
  assert.equal(parsed.role, 'USER')
  assert.equal(parsed.status, 'ACTIVE')
})

test('singleAccountResponseEnvelopeSchema parses GET /users/me response envelope', () => {
  const backendEnvelope = {
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      email: 'developer@occupify.work',
      fullName: 'Nguyen Minh Khoa',
      role: 'USER',
      status: 'ACTIVE',
    },
  }

  const parsed = singleAccountResponseEnvelopeSchema.parse(backendEnvelope)
  assert.equal(parsed.statusCode, 200)
  assert.equal(parsed.data.id, 'f47ac10b-58cc-4372-a567-0e02b2c3d479')
})

test('updateAccountRequestSchema validates required and optional fields', () => {
  const validPayload = {
    fullName: 'Nguyen Minh Khoa',
    headline: 'Lead Architect',
    bio: 'Passionate software craftsman',
    phoneNumber: '+84912345678',
  }

  const parsed = updateAccountRequestSchema.parse(validPayload)
  assert.equal(parsed.fullName, 'Nguyen Minh Khoa')
  assert.equal(parsed.phoneNumber, '+84912345678')

  // Fails on empty full name
  assert.throws(() => {
    updateAccountRequestSchema.parse({
      fullName: '',
    })
  })

  // Fails on invalid phone format
  assert.throws(() => {
    updateAccountRequestSchema.parse({
      fullName: 'Nguyen Minh Khoa',
      phoneNumber: 'abc-invalid-phone',
    })
  })
})

test('avatarResponseEnvelopeSchema parses avatar upload response', () => {
  const backendResponse = {
    statusCode: 200,
    message: 'Avatar uploaded successfully',
    data: {
      avatarUrl: 'https://storage.occupify.work/avatars/new-avatar.webp',
    },
  }

  const parsed = avatarResponseEnvelopeSchema.parse(backendResponse)
  assert.equal(parsed.statusCode, 200)
  assert.equal(parsed.data.avatarUrl, 'https://storage.occupify.work/avatars/new-avatar.webp')
})

test('successResponseEnvelopeSchema parses DELETE /users/me response', () => {
  const backendDeleteResponse = {
    statusCode: 200,
    message: 'User account deleted successfully',
  }

  const parsed = successResponseEnvelopeSchema.parse(backendDeleteResponse)
  assert.equal(parsed.statusCode, 200)
  assert.equal(parsed.message, 'User account deleted successfully')
})

test('experienceItemResponseSchema parses valid experience record', () => {
  const item = {
    id: 'e1234567-e89b-12d3-a456-426614174000',
    title: 'Lead Architect',
    organization: 'Fintech Solutions',
    employmentType: 'FULL_TIME',
    location: 'Hà Nội',
    startDate: '2022-03-01',
    endDate: null,
    isCurrent: true,
    description: 'Design system lead',
  }

  const parsed = experienceItemResponseSchema.parse(item)
  assert.equal(parsed.id, 'e1234567-e89b-12d3-a456-426614174000')
  assert.equal(parsed.title, 'Lead Architect')
  assert.equal(parsed.isCurrent, true)
})

test('educationItemResponseSchema parses education record with institution info', () => {
  const item = {
    id: 'ed123456-e89b-12d3-a456-426614174000',
    institutionId: 'inst-1',
    institutionName: 'Đại học Bách Khoa',
    fieldOfStudy: 'Khoa học máy tính',
    degree: 'Kỹ sư',
    startDate: '2016-09-01',
    endDate: '2021-06-30',
  }

  const parsed = educationItemResponseSchema.parse(item)
  assert.equal(parsed.institutionName, 'Đại học Bách Khoa')
  assert.equal(parsed.fieldOfStudy, 'Khoa học máy tính')
})

test('qualificationItemResponseSchema and userSkillItemResponseSchema parse correctly', () => {
  const qual = {
    id: 'q1234567-e89b-12d3-a456-426614174000',
    title: 'AWS Certified Solutions Architect',
    organization: 'Amazon Web Services',
    issueDate: '2024-05-15',
  }
  const parsedQual = qualificationItemResponseSchema.parse(qual)
  assert.equal(parsedQual.title, 'AWS Certified Solutions Architect')

  const skill = {
    skillId: 'sk-1',
    skillName: 'React',
    category: 'Frontend',
    isTopSkill: true,
  }
  const parsedSkill = userSkillItemResponseSchema.parse(skill)
  assert.equal(parsedSkill.skillName, 'React')
  assert.equal(parsedSkill.isTopSkill, true)
})

test('userDetailResponseEnvelopeSchema parses comprehensive 360-degree profile response', () => {
  const backendData = {
    user: {
      id: 'u1234567-e89b-12d3-a456-426614174000',
      email: 'developer@occupify.work',
      fullName: 'Nguyễn Văn Dev',
      headline: 'Senior Fullstack Engineer',
      role: 'USER',
      status: 'ACTIVE',
    },
    experiences: [
      {
        id: 'exp-1',
        title: 'Software Engineer',
        organization: 'Tech Corp',
        startDate: '2023-01-01',
        isCurrent: true,
      },
    ],
    educations: [
      {
        id: 'edu-1',
        fieldOfStudy: 'Software Engineering',
        startDate: '2018-09-01',
      },
    ],
    qualifications: [
      {
        id: 'qual-1',
        title: 'AWS Certified Solutions Architect',
        organization: 'Amazon Web Services',
        issueDate: '2024-05-15',
      },
    ],
    skills: [
      {
        skillId: 'sk-1',
        skillName: 'React',
        category: 'Frontend',
        isTopSkill: true,
      },
    ],
  }

  const directParsed = userDetailResponseSchema.parse(backendData)
  assert.equal(directParsed.user.email, 'developer@occupify.work')

  const backendEnvelope = {
    statusCode: 200,
    message: 'User full profile detail retrieved successfully',
    data: backendData,
  }

  const parsed = userDetailResponseEnvelopeSchema.parse(backendEnvelope)
  assert.equal(parsed.statusCode, 200)
  assert.equal(parsed.data.user.fullName, 'Nguyễn Văn Dev')
  assert.equal(parsed.data.experiences.length, 1)
  assert.equal(parsed.data.educations.length, 1)
  assert.equal(parsed.data.qualifications.length, 1)
  assert.equal(parsed.data.skills.length, 1)
})
