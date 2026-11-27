import { test } from 'node:test'
import assert from 'node:assert'
import {
  getInitialsFromName,
  getColorFromString,
  formatDateTime,
  mapReasonCategoryToLabel,
  mapReportStatusToLabel,
  mapUserStatusToLabel,
  mapUserRoleToLabel,
  toAdminUser,
  toAdminProject,
  toAdminViolation,
} from './admin-mappers.ts'
import {
  accountModerationRequestSchema,
  adminProjectSingleResponseSchema,
  adminReportSingleResponseSchema,
  adminUserSingleResponseSchema,
  closeProjectRequestSchema,
  normalizeModerationReason,
  successResponseSchema,
} from './admin-schemas.ts'

test('getInitialsFromName generates proper initials', () => {
  assert.strictEqual(getInitialsFromName('Nguyen Van A'), 'NA')
  assert.strictEqual(getInitialsFromName('Alice'), 'AL')
  assert.strictEqual(getInitialsFromName(''), 'OC')
  assert.strictEqual(getInitialsFromName(null), 'OC')
})

test('getColorFromString generates consistent colors', () => {
  const color1 = getColorFromString('test@example.com')
  const color2 = getColorFromString('test@example.com')
  assert.strictEqual(color1, color2)
  assert.strictEqual(typeof color1, 'string')
  assert.ok(color1.startsWith('#'))
})

test('formatDateTime formats ISO strings properly', () => {
  const formatted = formatDateTime('2026-11-22T10:30:00Z')
  assert.ok(formatted.includes('2026') || formatted.includes('22'))
  assert.strictEqual(formatDateTime(null), 'Vừa xong')
})

test('mapReasonCategoryToLabel maps backend reason categories to Vietnamese labels', () => {
  assert.strictEqual(mapReasonCategoryToLabel('FRAUD'), 'Nội dung vi phạm / Lừa đảo')
  assert.strictEqual(mapReasonCategoryToLabel('OUTSIDE_PAYMENT'), 'Giao dịch ngoài sàn trái phép')
  assert.strictEqual(
    mapReasonCategoryToLabel('FAKE_INFORMATION'),
    'Thông tin giả mạo / Không trung thực',
  )
  assert.strictEqual(mapReasonCategoryToLabel('SPAM'), 'Spam, quấy rối hoặc quảng cáo')
  assert.strictEqual(mapReasonCategoryToLabel('HARASSMENT'), 'Quấy rối / Đe dọa')
  assert.strictEqual(mapReasonCategoryToLabel('OTHER'), 'Vi phạm quy định chung')
})

test('mapReportStatusToLabel maps backend statuses', () => {
  assert.strictEqual(mapReportStatusToLabel('PENDING'), 'Chờ xử lý')
  assert.strictEqual(mapReportStatusToLabel('RESOLVED'), 'Đã giải quyết')
  assert.strictEqual(mapReportStatusToLabel('DISMISSED'), 'Đã bác bỏ')
  assert.strictEqual(mapReportStatusToLabel('INVESTIGATING'), 'Đang xác minh')
})

test('mapUserStatusToLabel handles active, flagged, banned, and deleted users', () => {
  assert.strictEqual(mapUserStatusToLabel('ACTIVE', false), 'Hoạt động')
  assert.strictEqual(mapUserStatusToLabel('ACTIVE', true), 'Bị gắn cờ')
  assert.strictEqual(mapUserStatusToLabel('SUSPENDED', false), 'Bị khóa')
  assert.strictEqual(mapUserStatusToLabel('BANNED', false), 'Bị khóa')
  assert.strictEqual(mapUserStatusToLabel('BANNED', true), 'Bị khóa')
  assert.strictEqual(mapUserStatusToLabel('DELETED', false), 'Đã xóa')
  assert.strictEqual(mapUserStatusToLabel('DELETED', true), 'Đã xóa')
})

test('mapUserRoleToLabel maps user roles correctly', () => {
  assert.strictEqual(mapUserRoleToLabel('FREELANCER'), 'Freelancer')
  assert.strictEqual(mapUserRoleToLabel('CLIENT'), 'Client')
  assert.strictEqual(mapUserRoleToLabel('ADMIN'), 'Admin')
  assert.strictEqual(mapUserRoleToLabel('OTHER'), 'Người dùng')
})

test('toAdminUser maps backend user including statusReason, rawStatus, and deletedAt', () => {
  const backendUser = {
    id: 'user-123',
    email: 'dev@occupify.app',
    fullName: 'Lê Văn Dev',
    role: 'FREELANCER',
    status: 'BANNED',
    statusReason: 'Spam tin nhắn',
    createdAt: '2026-11-01T00:00:00Z',
    deletedAt: null,
    isFlagged: false,
  }

  const result = toAdminUser(backendUser)
  assert.strictEqual(result.id, 'user-123')
  assert.strictEqual(result.name, 'Lê Văn Dev')
  assert.strictEqual(result.email, 'dev@occupify.app')
  assert.strictEqual(result.role, 'Freelancer')
  assert.strictEqual(result.status, 'Bị khóa')
  assert.strictEqual(result.rawStatus, 'BANNED')
  assert.strictEqual(result.statusReason, 'Spam tin nhắn')
  assert.strictEqual(result.initials, 'LD')
})

test('toAdminProject maps backend project correctly', () => {
  const backendProject = {
    id: 'proj-456',
    title: 'Xây dựng website thương mại',
    description: 'Dự án Next.js và Tailwind',
    status: 'OPEN',
    employer: {
      id: 'emp-1',
      email: 'employer@client.com',
      fullName: 'Trần Thị Client',
    },
    createdAt: '2026-11-10T00:00:00Z',
    reportCount: 2,
  }

  const result = toAdminProject(backendProject)
  assert.strictEqual(result.id, 'proj-456')
  assert.strictEqual(result.title, 'Xây dựng website thương mại')
  assert.strictEqual(result.status, 'Đang tuyển')
  assert.strictEqual(result.owner.name, 'Trần Thị Client')
  assert.strictEqual(result.reportCount, 2)
})

test('toAdminViolation preserves targetUserId and targetProjectId', () => {
  const projectReport = {
    id: 'rep-789',
    reporterId: 'rep-user',
    reporterEmail: 'victim@occupify.local',
    targetType: 'PROJECT' as const,
    targetUserId: null,
    targetProjectId: 'proj-456-uuid',
    reasonCategory: 'FRAUD' as const,
    description: 'Dự án yêu cầu cọc tiền',
    status: 'PENDING' as const,
    createdAt: '2026-11-15T00:00:00Z',
    updatedAt: '2026-11-15T00:00:00Z',
  }

  const mappedProject = toAdminViolation(projectReport)
  assert.strictEqual(mappedProject.id, 'rep-789')
  assert.strictEqual(mappedProject.targetProjectId, 'proj-456-uuid')
  assert.strictEqual(mappedProject.targetUserId, null)
  assert.ok(mappedProject.target.includes('Dự án'))

  const userReport = {
    ...projectReport,
    id: 'rep-790',
    targetType: 'USER' as const,
    targetUserId: 'user-999-uuid',
    targetProjectId: null,
  }
  const mappedUser = toAdminViolation(userReport)
  assert.strictEqual(mappedUser.targetUserId, 'user-999-uuid')
  assert.strictEqual(mappedUser.targetProjectId, null)
})

test('normalizeModerationReason trims or collapses blank values to null', () => {
  assert.strictEqual(normalizeModerationReason('  Vi phạm điều khoản  '), 'Vi phạm điều khoản')
  assert.strictEqual(normalizeModerationReason('   '), null)
  assert.strictEqual(normalizeModerationReason(''), null)
  assert.strictEqual(normalizeModerationReason(null), null)
  assert.strictEqual(normalizeModerationReason(undefined), null)
})

test('Zod moderation schemas validate nullable reasons and enforce max 1000 chars', () => {
  assert.deepStrictEqual(accountModerationRequestSchema.parse({ reason: null }), { reason: null })
  assert.deepStrictEqual(closeProjectRequestSchema.parse({ reason: 'Spam' }), { reason: 'Spam' })
  assert.throws(() => accountModerationRequestSchema.parse({ reason: 'a'.repeat(1001) }))
})

test('Zod response schemas validate backend envelopes for users, projects, reports, and delete', () => {
  const deleted = successResponseSchema.parse({
    statusCode: 200,
    message: 'User account deleted successfully',
  })
  assert.strictEqual(deleted.statusCode, 200)

  const lockedUser = adminUserSingleResponseSchema.parse({
    statusCode: 200,
    message: 'User account locked successfully',
    data: {
      id: 'u-1',
      email: 'u@occupify.app',
      fullName: 'User One',
      role: 'USER',
      status: 'BANNED',
      statusReason: 'Vi phạm',
      createdAt: '2026-11-01T00:00:00Z',
      isFlagged: false,
    },
  })
  assert.strictEqual(lockedUser.data.status, 'BANNED')
  assert.strictEqual(lockedUser.data.statusReason, 'Vi phạm')

  const closedProject = adminProjectSingleResponseSchema.parse({
    statusCode: 200,
    message: 'Project closed successfully',
    data: {
      id: 'p-1',
      title: 'Project One',
      status: 'CLOSED',
      employer: { id: 'e-1', email: 'e@occupify.app', fullName: 'Employer' },
      createdAt: '2026-11-01T00:00:00Z',
      closedAt: '2026-11-26T00:00:00Z',
      reportCount: 1,
    },
  })
  assert.strictEqual(closedProject.data.status, 'CLOSED')

  const dismissedReport = adminReportSingleResponseSchema.parse({
    statusCode: 200,
    message: 'Report status updated successfully',
    data: {
      id: 'r-1',
      reporterId: 'u-2',
      reporterEmail: 'rep@occupify.app',
      targetType: 'USER',
      targetUserId: 'u-1',
      targetProjectId: null,
      reasonCategory: 'SPAM',
      description: 'Spamming users',
      status: 'DISMISSED',
      createdAt: '2026-11-20T00:00:00Z',
      updatedAt: '2026-11-26T00:00:00Z',
    },
  })
  assert.strictEqual(dismissedReport.data.status, 'DISMISSED')
})
