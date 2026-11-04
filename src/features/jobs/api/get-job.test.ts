import test from 'node:test'
import assert from 'node:assert/strict'
import { applyToJob } from './apply-job.ts'
import { reportJob } from './report-job.ts'

test('applyToJob successfully processes application', async () => {
  const result = await applyToJob({
    jobId: 'test-proj-uuid',
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
    jobId: 'test-proj-uuid',
    clientName: 'Trần Thị Mai Phương',
    jobTitle: 'Senior UI/UX Designer – Fintech App Redesign',
    reason: 'Nội dung vi phạm / Lừa đảo',
    detail: 'Yêu cầu đặt cọc tiền trước khi làm việc',
  })
  assert.equal(result.success, true)
  assert.ok(result.reportId.includes('rep-'))
})
