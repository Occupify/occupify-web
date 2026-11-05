import test from 'node:test'
import assert from 'node:assert/strict'
import {
  toMyProjectFromContract,
  toProjectMemberFromContract,
  toPendingProjectFromContract,
  formatCurrencyVND,
  type ContractSummaryResponse,
} from './index.ts'

test('formatCurrencyVND formats amount properly', () => {
  assert.equal(formatCurrencyVND(1500000), '1.500.000 ₫')
  assert.equal(formatCurrencyVND(0), '0 ₫')
  assert.equal(formatCurrencyVND(null), '0 ₫')
})

test('toMyProjectFromContract maps ContractSummaryResponse to MyProject for employee view', () => {
  const contract: ContractSummaryResponse = {
    id: 'ct-12345',
    role: 'Backend Engineer',
    title: 'Spring Boot Notification Microservice',
    freelancerEmail: 'freelancer@gmail.com',
    message: 'Trân trọng mời bạn tham gia dự án',
    employerId: 'emp-1',
    employerName: 'TechCorp Vietnam',
    employeeId: 'usr-current',
    employeeName: 'Nguyễn Văn A',
    projectId: 'proj-999',
    projectTitle: 'E-commerce Platform Refactoring',
    jobId: 'job-111',
    jobTitle: 'Backend Specialist',
    agreedRate: 25000000,
    salaryType: 'MONTHLY',
    salaryDueDate: 'Ngày 05 hàng tháng',
    status: 'IN_PROGRESS',
    startedAt: '2026-11-01T08:00:00Z',
    finishedAt: '2026-12-31T17:00:00Z',
    createdAt: '2026-10-30T10:00:00Z',
  }

  const project = toMyProjectFromContract(contract, 'usr-current')
  assert.equal(project.id, 'ct-12345')
  assert.equal(project.name, 'E-commerce Platform Refactoring')
  assert.equal(project.owner, 'TechCorp Vietnam')
  assert.equal(project.status, 'OPEN')
  assert.equal(project.period, 'Hàng tháng')
  assert.equal(project.members.length, 1)
  assert.equal(project.members[0].name, 'Nguyễn Văn A (Tôi)')
  assert.equal(project.members[0].price, '25.000.000 ₫')
  assert.equal(project.members[0].role, 'Backend Engineer')
  assert.equal(project.members[0].status, 'Đang làm')
})

test('toProjectMemberFromContract maps ContractSummaryResponse to ProjectMember for employer view', () => {
  const contract: ContractSummaryResponse = {
    id: 'ct-789',
    role: 'UI Designer',
    freelancerEmail: 'designer@gmail.com',
    employerId: 'emp-current',
    employeeId: 'usr-designer',
    employeeName: 'Lê Thị B',
    agreedRate: 18000000,
    status: 'IN_PROGRESS',
  }

  const member = toProjectMemberFromContract(contract)
  assert.equal(member.name, 'Lê Thị B')
  assert.equal(member.email, 'designer@gmail.com')
  assert.equal(member.price, '18.000.000 ₫')
  assert.equal(member.role, 'UI Designer')
  assert.equal(member.status, 'Đang làm')
})

test('toPendingProjectFromContract maps PENDING contract to PendingProject', () => {
  const contract: ContractSummaryResponse = {
    id: 'ct-pending-1',
    role: 'DevOps Lead',
    employerName: 'Global Cloud Systems',
    projectTitle: 'Kubernetes Migration',
    agreedRate: 40000000,
    salaryType: 'MONTHLY',
    status: 'PENDING',
    message: 'Mời bạn gia nhập đội ngũ',
  }

  const pending = toPendingProjectFromContract(contract)
  assert.equal(pending.id, 'ct-pending-1')
  assert.equal(pending.name, 'Kubernetes Migration')
  assert.equal(pending.owner, 'Global Cloud Systems')
  assert.equal(pending.invitedRole, 'DevOps Lead')
  assert.equal(pending.price, '40.000.000 ₫')
})
