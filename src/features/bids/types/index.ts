import type { ApplicantProposal } from '@/features/projects/types'
import { formatCurrencyVND } from '../../contracts/types/index.ts'

export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'

export interface FreelancerSummary {
  id: string
  fullName?: string
  email?: string
  avatarUrl?: string
}

export interface BidJobSummary {
  id: string
  title: string
  projectId?: string
}

export interface BidProjectSummary {
  id: string
  title: string
}

export interface BidResponse {
  id: string
  job?: BidJobSummary
  project?: BidProjectSummary
  freelancer?: FreelancerSummary
  proposedSalaryType?: string
  proposedRate?: number
  commitmentDuration?: string
  weeklyCommitmentHours?: string
  message?: string
  attachmentCvUrl?: string
  portfolioLink?: string
  status: BidStatus
  createdAt: string
  updatedAt?: string
}

export interface BidFilterParams {
  projectId?: string
  jobId?: string
  status?: BidStatus
  page?: number
  limit?: number
  sort?: string
}

/**
 * Maps a backend BidResponse into ApplicantProposal for recruiter project detail view
 */
export function toApplicantProposalFromBid(bid: BidResponse): ApplicantProposal {
  const cleanRate = bid.proposedRate ?? 0
  const formattedBid = formatCurrencyVND(cleanRate)
  const salaryType = (bid.proposedSalaryType || 'MONTHLY').toUpperCase()

  let salaryCycle = 'Theo tháng'
  let salaryCycleType: 'monthly' | 'hourly' | 'weekly' | 'fixed' = 'monthly'
  if (salaryType === 'HOURLY') {
    salaryCycle = 'Theo giờ'
    salaryCycleType = 'hourly'
  } else if (salaryType === 'FIXED') {
    salaryCycle = 'Cố định'
    salaryCycleType = 'fixed'
  } else if (salaryType === 'WEEKLY') {
    salaryCycle = 'Hàng tuần'
    salaryCycleType = 'weekly'
  }

  const commitment =
    [
      bid.commitmentDuration ? `Thời lượng: ${bid.commitmentDuration}` : null,
      bid.weeklyCommitmentHours ? `${bid.weeklyCommitmentHours}h / tuần` : null,
    ]
      .filter(Boolean)
      .join(' · ') || 'Linh hoạt · Bắt đầu ngay'

  let appStatus: 'pending' | 'accepted' | 'rejected' = 'pending'
  if (bid.status === 'ACCEPTED') appStatus = 'accepted'
  else if (bid.status === 'REJECTED' || bid.status === 'CANCELLED') appStatus = 'rejected'

  const appliedDate = bid.createdAt ? new Date(bid.createdAt).toLocaleString('vi-VN') : 'Gần đây'

  return {
    id: bid.id as unknown as number,
    name: bid.freelancer?.fullName || 'Ứng viên',
    email: bid.freelancer?.email || '',
    phone: '',
    location: 'Việt Nam',
    bid: formattedBid,
    rawBidValue: String(cleanRate),
    salaryCycle,
    salaryCycleType,
    rating: 5.0,
    ratingCount: 10,
    occupation: bid.job?.title || 'Chuyên gia Freelancer',
    roleApplied: bid.job?.title || 'Thành viên dự án',
    commitment,
    cvFileName: bid.attachmentCvUrl ? 'HoSo_UngTuyen_CV.pdf' : 'Không có đính kèm',
    cvFileSize: 'PDF',
    portfolioUrl: bid.portfolioLink || undefined,
    status: appStatus,
    comment: bid.message || 'Mong muốn được hợp tác cùng dự án của Quý khách.',
    appliedDate,
    jobId: bid.job?.id,
    cvFileUrl: bid.attachmentCvUrl,
  }
}
