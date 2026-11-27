import test, { afterEach, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { ApiError } from '../../../types/api.ts'
import { useAuthStore } from '../../../stores/auth.ts'
import { getWorkspaceErrorMessage } from '../types/index.ts'
import {
  getEmployeeProjects,
  getMyProjects,
  getPendingProjects,
  setInternalStores,
} from './get-projects.ts'
import { createProject } from './create-project.ts'
import { updateProject } from './update-project.ts'
import { cancelEmployeeProject, cancelMyProject } from './cancel-project.ts'
import { acceptInvitation, rejectInvitation } from './manage-invitation.ts'

const originalFetch = globalThis.fetch

function mockJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

beforeEach(() => {
  setInternalStores({ myProjects: [], employeeProjects: [], pending: [] })
  useAuthStore.setState({
    accessToken: 'test-access-token',
    refreshToken: null,
    user: {
      id: 'emp-user-1',
      email: 'freelancer@occupify.work',
      fullName: 'Nguyen Van A',
      role: 'USER',
      status: 'ACTIVE',
    },
    isAuthenticated: true,
  })
})

afterEach(() => {
  globalThis.fetch = originalFetch
  setInternalStores({ myProjects: [], employeeProjects: [], pending: [] })
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
  })
})

test('getMyProjects passes employerId and size=50 and maps ProjectSummary list', async () => {
  let capturedUrl = ''
  globalThis.fetch = async (input) => {
    capturedUrl = String(input)
    return mockJsonResponse({
      statusCode: 200,
      message: 'Projects retrieved successfully',
      data: [
        {
          id: 'proj-1',
          title: 'Xây dựng cổng thanh toán',
          description: 'Tích hợp SePay',
          startPrice: 15000000,
          period: 'FIXED',
          dueDate: '2026-12-30',
          experienceLevel: 'EXPERT',
          status: 'OPEN',
          employer: {
            id: 'owner-1',
            email: 'owner@occupify.work',
            fullName: 'Owner Corp',
          },
          createdAt: '2026-11-20T10:00:00Z',
        },
      ],
      paging: { page: 0, limit: 50, total: 1, totalPages: 1 },
    })
  }

  const emptyWithoutOwner = await getMyProjects(undefined)
  assert.deepEqual(emptyWithoutOwner, [])
  assert.equal(capturedUrl, '')

  const projects = await getMyProjects('owner-1')
  const url = new URL(capturedUrl)
  assert.equal(url.pathname, '/projects')
  assert.equal(url.searchParams.get('employerId'), 'owner-1')
  assert.equal(url.searchParams.get('size'), '50')
  assert.equal(projects.length, 1)
  assert.equal(projects[0].name, 'Xây dựng cổng thanh toán')
  assert.equal(projects[0].period, 'Cố định')
})

test('getEmployeeProjects filters strictly to employee contracts with active/completed/escrow status', async () => {
  globalThis.fetch = async () =>
    mockJsonResponse({
      statusCode: 200,
      message: 'Contracts retrieved successfully',
      data: [
        {
          id: 'ct-in-progress',
          title: 'Backend Contract',
          projectId: 'proj-1',
          projectTitle: 'Occupify Core',
          employerId: 'other-owner',
          employerName: 'TechCorp',
          employeeId: 'emp-user-1',
          employeeName: 'Nguyen Van A',
          freelancerEmail: 'freelancer@occupify.work',
          agreedRate: 20000000,
          salaryType: 'MONTHLY',
          status: 'IN_PROGRESS',
        },
        {
          id: 'ct-escrow',
          title: 'Escrow Contract',
          projectTitle: 'Occupify Escrow',
          employerId: 'other-owner',
          employeeId: 'emp-user-1',
          agreedRate: 10000000,
          salaryType: 'FIXED',
          status: 'PENDING_ESCROW',
        },
        {
          id: 'ct-employer-only',
          title: 'Employer Contract',
          projectTitle: 'My Own Project',
          employerId: 'emp-user-1',
          employeeId: 'someone-else',
          freelancerEmail: 'other@occupify.work',
          agreedRate: 12000000,
          salaryType: 'MONTHLY',
          status: 'IN_PROGRESS',
        },
        {
          id: 'ct-pending',
          title: 'Pending Contract',
          projectTitle: 'Pending Project',
          employerId: 'other-owner',
          employeeId: 'emp-user-1',
          status: 'PENDING',
        },
      ],
      paging: { page: 0, limit: 50, total: 4, totalPages: 1 },
    })

  const result = await getEmployeeProjects('emp-user-1', 'freelancer@occupify.work')
  assert.equal(result.length, 2)
  assert.deepEqual(
    result.map((p) => p.id),
    ['ct-in-progress', 'ct-escrow'],
  )
  assert.equal(result[1].members[0].status, 'Chờ ký quỹ')
})

test('getPendingProjects filters to PENDING contracts matching user id or email', async () => {
  globalThis.fetch = async () =>
    mockJsonResponse({
      statusCode: 200,
      message: 'Contracts retrieved successfully',
      data: [
        {
          id: 'ct-invite-1',
          role: 'Frontend Dev',
          projectTitle: 'Portal Redesign',
          employerId: 'other-owner',
          employerName: 'Studio A',
          employeeId: null,
          freelancerEmail: 'freelancer@occupify.work',
          agreedRate: 18000000,
          salaryType: 'MONTHLY',
          status: 'PENDING',
        },
        {
          id: 'ct-invite-other',
          role: 'QA',
          projectTitle: 'Other Project',
          employerId: 'emp-user-1',
          employeeId: 'someone-else',
          freelancerEmail: 'other@occupify.work',
          status: 'PENDING',
        },
      ],
      paging: { page: 0, limit: 50, total: 2, totalPages: 1 },
    })

  const pending = await getPendingProjects('emp-user-1', 'freelancer@occupify.work')
  assert.equal(pending.length, 1)
  assert.equal(pending[0].id, 'ct-invite-1')
  assert.equal(pending[0].invitedRole, 'Frontend Dev')
})

test('createProject sends tags and CreateProjectRequest fields and parses 201 CREATED', async () => {
  let capturedBody: Record<string, unknown> | null = null
  globalThis.fetch = async (_input, init) => {
    capturedBody = JSON.parse(String(init?.body || '{}'))
    return mockJsonResponse(
      {
        statusCode: 201,
        message: 'Project created successfully',
        data: {
          id: 'proj-new-1',
          title: 'AI Matching Engine',
          description: 'Build matching pipeline',
          startPrice: 30000000,
          period: 'FIXED',
          dueDate: '2026-12-20',
          experienceLevel: 'EXPERT',
          status: 'OPEN',
          closedAt: null,
          employer: {
            id: 'emp-user-1',
            email: 'freelancer@occupify.work',
            fullName: 'Nguyen Van A',
          },
          createdAt: '2026-11-26T10:00:00Z',
          updatedAt: '2026-11-26T10:00:00Z',
        },
      },
      201,
    )
  }

  const created = await createProject({
    name: 'AI Matching Engine',
    description: 'Build matching pipeline',
    startPrice: '30000000',
    period: 'Cố định',
    dueDate: '2026-12-20',
    bidCloseDate: '2026-12-05',
    experienceLevel: 'expert',
    tags: ['Python', 'FastAPI'],
  })

  assert.equal(created.id, 'proj-new-1')
  assert.equal(capturedBody?.['title'], 'AI Matching Engine')
  assert.equal(capturedBody?.['period'], 'FIXED')
  assert.equal(capturedBody?.['experienceLevel'], 'EXPERT')
  assert.deepEqual(capturedBody?.['tags'], ['Python', 'FastAPI'])
})

test('workspace mutations propagate ApiError instead of swallowing backend failures', async () => {
  globalThis.fetch = async () =>
    mockJsonResponse(
      {
        statusCode: 403,
        errorCode: 'PROJ_002',
        message: 'Project ownership forbidden',
      },
      403,
    )

  await assert.rejects(
    () => updateProject('proj-uuid-1', { title: 'New title' }),
    (err: unknown) => err instanceof ApiError && err.statusCode === 403 && err.errorCode === 'PROJ_002',
  )

  globalThis.fetch = async () =>
    mockJsonResponse(
      {
        statusCode: 400,
        errorCode: 'PROJ_003',
        message: 'Project already closed',
      },
      400,
    )

  await assert.rejects(
    () => cancelMyProject('proj-uuid-1'),
    (err: unknown) => err instanceof ApiError && err.statusCode === 400 && err.errorCode === 'PROJ_003',
  )

  globalThis.fetch = async () =>
    mockJsonResponse(
      {
        statusCode: 404,
        errorCode: 'PROJ_001',
        message: 'Contract not found',
      },
      404,
    )

  await assert.rejects(
    () =>
      acceptInvitation({
        id: 'ct-uuid-1',
        name: 'Test',
        owner: 'Owner',
        period: 'Hàng tháng',
        price: '10.000.000 ₫',
        invitedRole: 'Dev',
      }),
    (err: unknown) => err instanceof ApiError && err.statusCode === 404,
  )

  await assert.rejects(
    () => rejectInvitation('ct-uuid-1'),
    (err: unknown) => err instanceof ApiError && err.statusCode === 404,
  )

  await assert.rejects(
    () => cancelEmployeeProject('ct-uuid-1', 'Reason'),
    (err: unknown) => err instanceof ApiError && err.statusCode === 404,
  )
})

test('getWorkspaceErrorMessage maps all documented core and gateway error codes', () => {
  const codes = [
    ['PROJ_001', 404],
    ['PROJ_002', 403],
    ['PROJ_003', 400],
    ['PROJ_004', 404],
    ['SYS_001', 500],
    ['SYS_002', 400],
    ['SYS_003', 404],
    ['SYS_006', 400],
    ['SYS_008', 503],
    ['SYS_009', 504],
    ['AUTH_003', 401],
    ['AUTH_005', 401],
    ['NETWORK_ERROR', 0],
  ] as const

  for (const [errorCode, status] of codes) {
    const msg = getWorkspaceErrorMessage(new ApiError('raw', status, errorCode))
    assert.ok(msg.length > 0 && msg !== 'raw', `Expected mapped message for ${errorCode}`)
  }
})
