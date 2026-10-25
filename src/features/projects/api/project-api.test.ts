import test from 'node:test'
import assert from 'node:assert/strict'
import {
  toBackendPeriod,
  toBackendExperienceLevel,
  fromBackendPeriod,
  toMyProject,
} from '../types/index.ts'
import type {
  MyProject,
  ProjectDetail,
  ProjectSummary,
  UpdateProjectPayload,
} from '../types/index.ts'

test('toBackendPeriod maps Vietnamese period labels correctly', () => {
  assert.equal(toBackendPeriod('Theo giờ'), 'HOURLY')
  assert.equal(toBackendPeriod('Cố định'), 'FIXED')
  assert.equal(toBackendPeriod('Hàng tháng'), 'MONTHLY')
  assert.equal(toBackendPeriod('Hàng tuần'), 'WEEKLY')
  assert.equal(toBackendPeriod(''), 'MONTHLY')
})

test('toBackendExperienceLevel maps experience level options correctly', () => {
  assert.equal(toBackendExperienceLevel('entry'), 'ENTRY')
  assert.equal(toBackendExperienceLevel('intermediate'), 'INTERMEDIATE')
  assert.equal(toBackendExperienceLevel('expert'), 'EXPERT')
  assert.equal(toBackendExperienceLevel(''), 'INTERMEDIATE')
})

test('fromBackendPeriod formats backend enum for display', () => {
  assert.equal(fromBackendPeriod('HOURLY'), 'Theo giờ')
  assert.equal(fromBackendPeriod('FIXED'), 'Cố định')
  assert.equal(fromBackendPeriod('MONTHLY'), 'Hàng tháng')
})

test('toMyProject converts backend ProjectDetail payload properly', () => {
  const detail: ProjectDetail = {
    id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Xây dựng Notification Microservice',
    description: 'Thiết kế hệ thống thông báo realtime',
    startPrice: 25000000,
    period: 'MONTHLY',
    dueDate: '2026-12-31',
    experienceLevel: 'EXPERT',
    status: 'OPEN',
    closedAt: null,
    employer: {
      id: 'e0000000-0000-0000-0000-000000000001',
      email: 'employer@occupify.work',
      fullName: 'Occupify Enterprise',
    },
    jobs: [
      {
        id: 'j0000000-0000-0000-0000-000000000001',
        title: 'Spring Boot Specialist',
        description: 'Triển khai RabbitMQ và WebSockets',
        budget: 25000000,
        headcount: 1,
        skills: [
          { id: 's1', name: 'Java' },
          { id: 's2', name: 'RabbitMQ' },
        ],
      },
    ],
    createdAt: '2026-10-24T12:00:00Z',
    updatedAt: '2026-10-24T12:00:00Z',
  }

  const converted = toMyProject(detail)
  assert.equal(converted.id, 'a0000000-0000-0000-0000-000000000001')
  assert.equal(converted.name, 'Xây dựng Notification Microservice')
  assert.equal(converted.status, 'OPEN')
  assert.equal(converted.owner, 'Occupify Enterprise')
  assert.equal(converted.period, 'Hàng tháng')
  assert.ok(converted.recruitingRoles && converted.recruitingRoles.length === 1)
  assert.equal(converted.recruitingRoles[0].title, 'Spring Boot Specialist')
  assert.deepEqual(converted.recruitingRoles[0].skills, ['Java', 'RabbitMQ'])
})

test('toMyProject converts real backend ProjectDetailResponse with string skills and budget range', () => {
  const detail: ProjectDetail = {
    id: 'a0000000-0000-0000-0000-000000000001',
    title: 'Redesign Mobile App',
    description: 'Tái thiết kế ứng dụng mobile',
    startPrice: 25000000,
    period: 'MONTHLY',
    dueDate: '2026-12-31',
    experienceLevel: 'EXPERT',
    status: 'OPEN',
    closedAt: null,
    employer: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'dev-employer@occupify.local',
      fullName: 'Tôi (Chủ dự án)',
    },
    jobs: [
      {
        id: 'b0000000-0000-0000-0000-000000000001',
        title: 'Backend Developer',
        description: 'Module thanh toán lõi',
        quantity: 1,
        salaryType: 'MONTHLY',
        budgetMin: 18000000,
        budgetMax: 25000000,
        status: 'RECRUITING',
        skills: ['PostgreSQL', 'Redis', 'Node.js', 'NestJS'],
      },
      {
        id: 'b0000000-0000-0000-0000-000000000002',
        title: 'Frontend Developer',
        description: 'React Native mobile app',
        quantity: 2,
        salaryType: 'MONTHLY',
        budgetMin: 15000000,
        budgetMax: 22000000,
        status: 'FILLED',
        skills: ['TypeScript', 'Tailwind CSS', 'React Native'],
      },
    ],
    createdAt: '2026-10-24T11:07:17Z',
    updatedAt: '2026-10-24T11:07:17Z',
  }

  const converted = toMyProject(detail)
  assert.equal(converted.id, 'a0000000-0000-0000-0000-000000000001')
  assert.equal(converted.recruitingRoles?.length, 2)

  // First role: recruiting
  const r1 = converted.recruitingRoles![0]
  assert.equal(r1.title, 'Backend Developer')
  assert.equal(r1.status, 'recruiting')
  assert.deepEqual(r1.skills, ['PostgreSQL', 'Redis', 'Node.js', 'NestJS'])
  assert.equal(r1.salaryRange, '18.000.000 - 25.000.000 ₫')
  assert.equal(r1.slotsTotal, 1)
  assert.equal(r1.slotsFilled, 0)

  // Second role: filled
  const r2 = converted.recruitingRoles![1]
  assert.equal(r2.title, 'Frontend Developer')
  assert.equal(r2.status, 'filled')
  assert.deepEqual(r2.skills, ['TypeScript', 'Tailwind CSS', 'React Native'])
  assert.equal(r2.slotsTotal, 2)
  assert.equal(r2.slotsFilled, 2)

  // Flattened tags
  assert.ok(converted.tags?.includes('PostgreSQL'))
  assert.ok(converted.tags?.includes('TypeScript'))
})

test('toMyProject converts backend ProjectSummary properly for list view', () => {
  const summary: ProjectSummary = {
    id: 'b0000000-0000-0000-0000-000000000002',
    title: 'Phát triển Mobile App Flutter',
    description: 'Ứng dụng tìm việc làm sinh viên',
    startPrice: 18000000,
    period: 'FIXED',
    dueDate: '2026-11-30',
    experienceLevel: 'INTERMEDIATE',
    status: 'OPEN',
    employer: {
      id: 'e0000000-0000-0000-0000-000000000002',
      email: 'techlead@startup.vn',
      fullName: 'Startup Studio',
    },
    createdAt: '2026-10-24T10:00:00Z',
  }

  const converted = toMyProject(summary)
  assert.equal(converted.id, 'b0000000-0000-0000-0000-000000000002')
  assert.equal(converted.name, 'Phát triển Mobile App Flutter')
  assert.equal(converted.period, 'Cố định')
  assert.equal(converted.startPrice, 18000000)
})

test('MyProject and UpdateProjectPayload support bidCloseDate and dueDate', () => {
  const project: MyProject = {
    id: 'test-1',
    name: 'Dự án Mobile App',
    period: 'Hàng tháng',
    dueDate: '2026-12-31',
    bidCloseDate: '2026-11-30',
    members: [],
  }

  assert.equal(project.dueDate, '2026-12-31')
  assert.equal(project.bidCloseDate, '2026-11-30')

  const updatePayload: UpdateProjectPayload = {
    title: 'Dự án Mobile App v2',
    dueDate: '2027-01-15',
    bidCloseDate: '2026-12-15',
  }

  assert.equal(updatePayload.title, 'Dự án Mobile App v2')
  assert.equal(updatePayload.dueDate, '2027-01-15')
  assert.equal(updatePayload.bidCloseDate, '2026-12-15')
})
