import test from 'node:test'
import assert from 'node:assert/strict'
import { toApplicantProposalFromBid, type BidResponse } from './index.ts'

test('toApplicantProposalFromBid maps BidResponse to ApplicantProposal properly', () => {
  const bid: BidResponse = {
    id: 'bid-999',
    job: {
      id: 'job-101',
      title: 'Fullstack React/Node Engineer',
    },
    project: {
      id: 'proj-500',
      title: 'Fintech Mobile Application',
    },
    freelancer: {
      id: 'usr-444',
      fullName: 'Trần Văn Bảo',
      email: 'bao.tran@gmail.com',
      avatarUrl: 'https://cdn.occupify.com/avatar.png',
    },
    proposedSalaryType: 'MONTHLY',
    proposedRate: 35000000,
    commitmentDuration: '6 tháng',
    weeklyCommitmentHours: '40',
    message: 'Tôi có hơn 5 năm kinh nghiệm về React và Node.js, sẵn sàng onboard ngay.',
    attachmentCvUrl: 'https://storage.oraclecloud.com/presigned-cv.pdf',
    portfolioLink: 'https://github.com/baotran',
    status: 'PENDING',
    createdAt: '2026-11-02T10:15:00Z',
  }

  const proposal = toApplicantProposalFromBid(bid)

  assert.equal(proposal.id, 'bid-999')
  assert.equal(proposal.name, 'Trần Văn Bảo')
  assert.equal(proposal.email, 'bao.tran@gmail.com')
  assert.equal(proposal.bid, '35.000.000 ₫')
  assert.equal(proposal.rawBidValue, '35000000')
  assert.equal(proposal.salaryCycle, 'Theo tháng')
  assert.equal(proposal.salaryCycleType, 'monthly')
  assert.equal(proposal.occupation, 'Fullstack React/Node Engineer')
  assert.equal(proposal.roleApplied, 'Fullstack React/Node Engineer')
  assert.equal(proposal.commitment, 'Thời lượng: 6 tháng · 40h / tuần')
  assert.equal(proposal.status, 'pending')
  assert.equal(proposal.portfolioUrl, 'https://github.com/baotran')
  assert.equal(proposal.cvFileName, 'HoSo_UngTuyen_CV.pdf')
})

test('toApplicantProposalFromBid handles ACCEPTED status and HOURLY salary type', () => {
  const bid: BidResponse = {
    id: 'bid-1000',
    freelancer: {
      id: 'usr-555',
      fullName: 'Phạm Thị Lan',
      email: 'lan.pham@gmail.com',
    },
    proposedSalaryType: 'HOURLY',
    proposedRate: 300000,
    status: 'ACCEPTED',
    createdAt: '2026-11-01T08:00:00Z',
  }

  const proposal = toApplicantProposalFromBid(bid)

  assert.equal(proposal.salaryCycle, 'Theo giờ')
  assert.equal(proposal.salaryCycleType, 'hourly')
  assert.equal(proposal.status, 'accepted')
  assert.equal(proposal.bid, '300.000 ₫')
})

