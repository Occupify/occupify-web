import test from 'node:test'
import assert from 'node:assert/strict'
import { getJobById } from './get-jobs.ts'
import { applyToJob } from './apply-job.ts'
import { reportJob } from './report-job.ts'

test('getJobById returns correct job listing for valid ID', async () => {
  const job = await getJobById(1)
  assert.ok(job, 'Job with ID 1 should exist')
  if (!job) throw new Error('Unreachable: job is null')
  assert.equal(job.id, 1)
  assert.equal(job.title, 'Senior UI/UX Designer – Fintech App Redesign')
  assert.ok(Array.isArray(job.roles), 'Roles should be an array')
  assert.ok(Boolean(job.roles && job.roles.length > 0), 'Roles should have items')
})

test('getJobById returns null for nonexistent ID', async () => {
  const job = await getJobById(999999)
  assert.equal(job, null, 'Nonexistent job should return null')
})

test('applyToJob successfully processes application', async () => {
  const result = await applyToJob({
    jobId: 1,
    roleId: 'r1-1',
    salaryCycle: 'monthly',
    bidPrice: '45.000.000 ₫',
    commitment: 'Dài hạn (Trên 6 tháng) — Bắt đầu ngay',
    cvFile: { name: 'cv.pdf', size: '1.2 MB' },
  })
  assert.equal(result.success, true)
  assert.equal(result.roleId, 'r1-1')
  assert.ok(result.applicationId.startsWith('app-'))
})

test('reportJob successfully submits violation report', async () => {
  const result = await reportJob({
    jobId: 1,
    clientName: 'Trần Thị Mai Phương',
    jobTitle: 'Senior UI/UX Designer – Fintech App Redesign',
    reason: 'Nội dung vi phạm / Lừa đảo',
    detail: 'Yêu cầu đặt cọc tiền trước khi làm việc',
  })
  assert.equal(result.success, true)
  assert.ok(result.reportId.includes('rep-'))
})
