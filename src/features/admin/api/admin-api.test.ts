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

test('mapUserStatusToLabel handles active, flagged and suspended users', () => {
  assert.strictEqual(mapUserStatusToLabel('ACTIVE', false), 'Hoạt động')
  assert.strictEqual(mapUserStatusToLabel('ACTIVE', true), 'Bị gắn cờ')
  assert.strictEqual(mapUserStatusToLabel('SUSPENDED', false), 'Bị khóa')
  assert.strictEqual(mapUserStatusToLabel('BANNED', false), 'Bị khóa')
})

test('mapUserRoleToLabel maps user roles correctly', () => {
  assert.strictEqual(mapUserRoleToLabel('FREELANCER'), 'Freelancer')
  assert.strictEqual(mapUserRoleToLabel('CLIENT'), 'Client')
  assert.strictEqual(mapUserRoleToLabel('ADMIN'), 'Admin')
  assert.strictEqual(mapUserRoleToLabel('OTHER'), 'Người dùng')
})

test('toAdminUser maps backend user correctly', () => {
  const backendUser = {
    id: 'user-123',
    email: 'dev@occupify.app',
    fullName: 'Lê Văn Dev',
    role: 'FREELANCER',
    status: 'ACTIVE',
    createdAt: '2026-11-01T00:00:00Z',
    isFlagged: false,
  }

  const result = toAdminUser(backendUser)
  assert.strictEqual(result.id, 'user-123')
  assert.strictEqual(result.name, 'Lê Văn Dev')
  assert.strictEqual(result.email, 'dev@occupify.app')
  assert.strictEqual(result.role, 'Freelancer')
  assert.strictEqual(result.status, 'Hoạt động')
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

test('toAdminViolation maps backend report correctly', () => {
  const backendReport = {
    id: 'rep-789',
    reporterId: 'rep-user',
    reporterEmail: 'victim@occupify.local',
    targetType: 'PROJECT' as const,
    targetProjectId: 'proj-456-uuid',
    reasonCategory: 'FRAUD' as const,
    description: 'Dự án yêu cầu cọc tiền',
    status: 'PENDING' as const,
    createdAt: '2026-11-15T00:00:00Z',
    updatedAt: '2026-11-15T00:00:00Z',
  }

  const result = toAdminViolation(backendReport)
  assert.strictEqual(result.id, 'rep-789')
  assert.strictEqual(result.reporter.name, 'victim')
  assert.strictEqual(result.category, 'Dự án')
  assert.strictEqual(result.reason, 'Nội dung vi phạm / Lừa đảo')
  assert.strictEqual(result.status, 'Chờ xử lý')
  assert.ok(result.target.includes('Dự án'))
})
