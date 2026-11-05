import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBidFormData, toApplyJobResponse } from './apply-job-mapping.ts'
import { reportJob } from './report-job.ts'

test('buildBidFormData properly formats CreateBidRequest for backend POST /bids', () => {
  const formData = buildBidFormData({
    jobId: 'proj-123',
    roleId: '6a5f5f40-3a21-4f93-8a3d-4c330f81bb60',
    salaryCycle: 'monthly',
    bidPrice: '35.000.000 ₫',
    message: 'Tôi có kinh nghiệm chuyên sâu về React và TypeScript.',
    commitment: 'Dài hạn (Trên 6 tháng) — Bắt đầu ngay',
    portfolioLink: 'https://github.com/my-portfolio',
  })

  assert.equal(formData.get('jobId'), '6a5f5f40-3a21-4f93-8a3d-4c330f81bb60')
  assert.equal(formData.get('proposedRate'), '35000000')
  assert.equal(formData.get('proposedSalaryType'), 'MONTHLY')
  assert.equal(formData.get('message'), 'Tôi có kinh nghiệm chuyên sâu về React và TypeScript.')
  assert.equal(formData.get('commitmentDuration'), 'Dài hạn (Trên 6 tháng) — Bắt đầu ngay')
  assert.equal(formData.get('portfolioLink'), 'https://github.com/my-portfolio')
})

test('buildBidFormData handles hourly rate with weekly hours', () => {
  const formData = buildBidFormData({
    jobId: 'proj-456',
    roleId: '7b6f6f51-4b32-5a04-9b4e-5d441a92cc71',
    salaryCycle: 'hourly',
    bidPrice: '500.000 ₫',
    weeklyHours: '30 - 40 giờ / tuần (Toàn thời gian)',
  })

  assert.equal(formData.get('jobId'), '7b6f6f51-4b32-5a04-9b4e-5d441a92cc71')
  assert.equal(formData.get('proposedRate'), '500000')
  assert.equal(formData.get('proposedSalaryType'), 'HOURLY')
  assert.equal(formData.get('weeklyCommitmentHours'), '30 - 40 giờ / tuần (Toàn thời gian)')
})

test('toApplyJobResponse maps CreatedResponse to ApplyJobResponse correctly', () => {
  const mockRes = {
    statusCode: 201,
    message: 'Nộp đề xuất thành công',
    data: {
      id: 'bid-uuid-999',
      status: 'PENDING' as const,
      createdAt: '2026-11-05T08:30:00Z',
    },
  }

  const result = toApplyJobResponse(mockRes, 'role-abc')
  assert.equal(result.success, true)
  assert.equal(result.applicationId, 'bid-uuid-999')
  assert.equal(result.roleId, 'role-abc')
  assert.equal(result.submittedAt, '2026-11-05T08:30:00Z')
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
