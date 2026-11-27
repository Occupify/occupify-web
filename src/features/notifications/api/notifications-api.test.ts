import test, { afterEach, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { ApiError } from '../../../types/api.ts'
import { useAuthStore } from '../../../stores/auth.ts'
import {
  formatNotificationRelativeTime,
  getNotificationErrorMessage,
  mapActionTypeToBadgeType,
  toNotif,
  type NotificationResponse,
} from '../types/index.ts'
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from './get-notifications.ts'

const originalFetch = globalThis.fetch

function mockJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'test-access-token',
    refreshToken: null,
    user: {
      id: 'c1a2b3c4-d5e6-7890-abcd-ef1234567890',
      email: 'candidate@occupify.work',
      fullName: 'Alex Mercer',
      role: 'USER',
      status: 'ACTIVE',
    },
    isAuthenticated: true,
  })
})

afterEach(() => {
  globalThis.fetch = originalFetch
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  })
})

test('mapActionTypeToBadgeType maps notification templates and categories', () => {
  assert.equal(mapActionTypeToBadgeType('REVIEW_CREATED', 'CONTRACT'), 'review')
  assert.equal(mapActionTypeToBadgeType('PROPOSAL_VIEWED', 'JOB'), 'proposal')
  assert.equal(mapActionTypeToBadgeType('PROPOSAL_SUBMITTED', 'JOB'), 'proposal')
  assert.equal(mapActionTypeToBadgeType('PROPOSAL_ACCEPTED', 'CONTRACT'), 'proposal')
  assert.equal(mapActionTypeToBadgeType('PROPOSAL_CANCELLED', 'JOB'), 'proposal')
  assert.equal(mapActionTypeToBadgeType('JOB_MATCH_POSTED', 'JOB'), 'proposal')
  assert.equal(mapActionTypeToBadgeType('CONTRACT_INVITATION', 'CONTRACT'), 'contract')
  assert.equal(mapActionTypeToBadgeType('CONTRACT_ACCEPTED', 'CONTRACT'), 'contract')
  assert.equal(mapActionTypeToBadgeType('CONTRACT_COMPLETED', 'CONTRACT'), 'contract')
  assert.equal(mapActionTypeToBadgeType('PROJECT_CREATED', 'PROJECT'), 'contract')
  assert.equal(mapActionTypeToBadgeType('PROJECT_CLOSED', 'PROJECT'), 'contract')
  assert.equal(mapActionTypeToBadgeType('CONTRACT_REJECTED', 'CONTRACT'), 'alert')
  assert.equal(mapActionTypeToBadgeType('CONTRACT_COMPENSATED', 'CONTRACT'), 'alert')
  assert.equal(mapActionTypeToBadgeType('CONTRACT_CANCELLED', 'CONTRACT'), 'alert')
  assert.equal(mapActionTypeToBadgeType('POST_LIKED', 'COMMUNITY'), 'message')
  assert.equal(mapActionTypeToBadgeType('POST_COMMENTED', 'COMMUNITY'), 'message')
  assert.equal(mapActionTypeToBadgeType('POST_SHARED', 'COMMUNITY'), 'message')
  assert.equal(mapActionTypeToBadgeType(null, 'PAYMENT'), 'alert')
  assert.equal(mapActionTypeToBadgeType(null, 'SYSTEM'), 'system')
  assert.equal(mapActionTypeToBadgeType(undefined, undefined), 'system')
})

test('formatNotificationRelativeTime handles ISO strings, LocalDateTime, and invalid values', () => {
  const now = new Date(2026, 10, 26, 12, 0, 0)
  const tenSecAgo = new Date(2026, 10, 26, 11, 59, 50).toISOString()
  const fiveMinAgo = new Date(2026, 10, 26, 11, 55, 0).toISOString()
  const threeHoursAgo = new Date(2026, 10, 26, 9, 0, 0).toISOString()
  const yesterday = new Date(2026, 10, 25, 10, 0, 0).toISOString()
  const fourDaysAgo = new Date(2026, 10, 22, 10, 0, 0).toISOString()
  const older = new Date(2026, 9, 5, 10, 0, 0).toISOString()

  assert.equal(formatNotificationRelativeTime(tenSecAgo, now), 'Vừa xong')
  assert.equal(formatNotificationRelativeTime(fiveMinAgo, now), '5 phút trước')
  assert.equal(formatNotificationRelativeTime(threeHoursAgo, now), '3 giờ trước')
  assert.equal(formatNotificationRelativeTime(yesterday, now), 'Hôm qua')
  assert.equal(formatNotificationRelativeTime(fourDaysAgo, now), '4 ngày trước')
  assert.equal(formatNotificationRelativeTime(older, now), '05/10/2026')
  // LocalDateTime without timezone suffix
  assert.equal(formatNotificationRelativeTime('2026-11-26T11:50:00', now), '10 phút trước')
  assert.equal(formatNotificationRelativeTime(null, now), 'Gần đây')
  assert.equal(formatNotificationRelativeTime('not-a-date', now), 'Gần đây')
})

test('toNotif maps NotificationResponse DTO to UI Notif model', () => {
  const now = new Date('2026-10-18T20:20:00Z')
  const dto: NotificationResponse = {
    id: 'e8d1a3c5-6789-4def-0123-456789abcdef',
    userId: 'c1a2b3c4-d5e6-7890-abcd-ef1234567890',
    title: 'Đề xuất đã được xem',
    content: "Nhà tuyển dụng TechCorp Global đã xem đề xuất của bạn cho công việc 'Senior Backend'.",
    category: 'JOB',
    actionType: 'PROPOSAL_VIEWED',
    isRead: false,
    readAt: null,
    createdAt: '2026-10-18T20:15:00Z',
  }

  const mapped = toNotif(dto, now)
  assert.equal(mapped.id, 'e8d1a3c5-6789-4def-0123-456789abcdef')
  assert.equal(mapped.title, 'Đề xuất đã được xem')
  assert.equal(mapped.isRead, false)
  assert.equal(mapped.badgeType, 'proposal')
  assert.equal(mapped.time, '5 phút trước')
})

test('getNotifications fetches paginated notifications (200 OK populated and empty)', async () => {
  let capturedUrl = ''
  globalThis.fetch = async (input) => {
    capturedUrl = String(input)
    return mockJsonResponse({
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: [
        {
          id: 'e8d1a3c5-6789-4def-0123-456789abcdef',
          userId: 'c1a2b3c4-d5e6-7890-abcd-ef1234567890',
          title: 'Lời mời tham gia hợp đồng',
          content: "Bạn có lời mời cho công việc 'React Developer'.",
          category: 'CONTRACT',
          actionType: 'CONTRACT_INVITATION',
          isRead: false,
          readAt: null,
          createdAt: new Date().toISOString(),
        },
      ],
      paging: { page: 1, limit: 10, total: 11, totalPages: 2 },
    })
  }

  const result = await getNotifications({ page: 1, limit: 10 })
  assert.ok(capturedUrl.endsWith('/notifications?page=1&limit=10'))
  assert.equal(result.items.length, 1)
  assert.equal(result.items[0].id, 'e8d1a3c5-6789-4def-0123-456789abcdef')
  assert.equal(result.items[0].badgeType, 'contract')
  assert.equal(result.paging.total, 11)
  assert.equal(result.paging.totalPages, 2)

  globalThis.fetch = async () =>
    mockJsonResponse({
      statusCode: 200,
      message: 'Notifications retrieved successfully',
      data: [],
      paging: { page: 0, limit: 20, total: 0, totalPages: 0 },
    })

  const emptyResult = await getNotifications()
  assert.equal(emptyResult.items.length, 0)
  assert.equal(emptyResult.paging.total, 0)
})

test('getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification hit expected endpoints', async () => {
  const calls: Array<{ url: string; method: string }> = []
  globalThis.fetch = async (input, init) => {
    const url = String(input)
    const method = init?.method || 'GET'
    calls.push({ url, method })

    if (url.endsWith('/notifications/unread-count')) {
      return mockJsonResponse({
        statusCode: 200,
        message: 'Unread count retrieved successfully',
        data: { userId: 'u1', unreadCount: 4 },
      })
    }
    return mockJsonResponse({ statusCode: 200, message: 'OK' })
  }

  const count = await getUnreadNotificationCount()
  assert.equal(count, 4)

  await markNotificationAsRead('notif-uuid-1')
  await markAllNotificationsAsRead()
  await deleteNotification('notif-uuid-1')

  assert.deepEqual(
    calls.map((c) => `${c.method} ${new URL(c.url).pathname}`),
    [
      'GET /notifications/unread-count',
      'PUT /notifications/notif-uuid-1/read',
      'PUT /notifications/read-all',
      'DELETE /notifications/notif-uuid-1',
    ],
  )
})

test('notification API propagates documented HTTP errors and maps Vietnamese messages', async () => {
  const cases = [
    { status: 400, errorCode: 'NOTI_004', message: 'Invalid notification payload' },
    { status: 400, errorCode: 'SYS_002', message: 'Validation failed' },
    { status: 401, errorCode: 'AUTH_003', message: 'Missing or invalid Authorization header' },
    { status: 401, errorCode: 'AUTH_005', message: 'Invalid or expired JWT token' },
    { status: 403, errorCode: 'NOTI_002', message: 'Access forbidden' },
    { status: 404, errorCode: 'NOTI_001', message: 'Notification not found' },
    { status: 404, errorCode: 'NOTI_003', message: 'User not found' },
    { status: 500, errorCode: 'SYS_001', message: 'Internal server error' },
    { status: 503, errorCode: 'SYS_008', message: 'Notification service unavailable' },
    { status: 504, errorCode: 'SYS_009', message: 'Gateway timeout' },
  ]

  for (const c of cases) {
    globalThis.fetch = async () =>
      mockJsonResponse({ statusCode: c.status, errorCode: c.errorCode, message: c.message }, c.status)

    await assert.rejects(
      () => deleteNotification('notif-uuid-1'),
      (err: unknown) => {
        assert.ok(err instanceof ApiError)
        assert.equal(err.statusCode, c.status)
        if (c.status !== 401) {
          assert.equal(err.errorCode, c.errorCode)
        }
        const uiMsg = getNotificationErrorMessage(err)
        assert.ok(uiMsg.length > 0)
        return true
      },
    )
  }

  globalThis.fetch = async () => {
    throw new TypeError('fetch failed')
  }
  await assert.rejects(
    () => getNotifications(),
    (err: unknown) => {
      assert.ok(err instanceof ApiError)
      assert.equal(err.statusCode, 0)
      assert.equal(err.errorCode, 'NETWORK_ERROR')
      assert.ok(getNotificationErrorMessage(err).includes('kết nối'))
      return true
    },
  )
})
