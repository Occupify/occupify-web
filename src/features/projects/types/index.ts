export interface ProjectRole {
  id: string
  title: string
  skills?: string[]
  salaryRange?: string
  slotsTotal?: number
  slotsFilled?: number
  status?: 'recruiting' | 'filled'
  assignedMemberName?: string
  jobDescription?: string
}

export interface ProjectMember {
  name: string
  email: string
  price: string
  dueDate?: string
  salaryDueDate?: string
  role?: string
  status?: string
}

export interface PendingProject {
  id: number
  name: string
  owner: string
  ownerAvatar?: string
  ownerCompany?: string
  ownerRole?: string
  ownerRating?: number
  ownerCompletedProjects?: number
  period: string
  price: string
  dueDate?: string
  description?: string
  tags?: string[]
  invitedRole: string
  inviteMessage?: string
  recruitingRoles?: ProjectRole[]
}

export interface MyProject {
  id: number
  name: string
  owner?: string
  ownerCompany?: string
  ownerRating?: number
  period: string
  dueDate: string
  description?: string
  tags?: string[]
  members: ProjectMember[]
  recruitingRoles?: ProjectRole[]
}

export interface FreelancerReview {
  rating: number
  onTime: boolean
  comment: string
}

export interface ApplicantProposal {
  id: number
  name: string
  bid: string
  salaryCycle: string
  salaryCycleType: 'monthly' | 'hourly' | 'weekly' | 'fixed'
  rawBidValue: string
  rating: number
  ratingCount: number
  occupation: string
  roleApplied: string
  commitment: string
  cvFileName: string
  cvFileSize: string
  portfolioUrl?: string
  status: 'pending' | 'accepted' | 'rejected'
  comment: string
  email: string
  phone: string
  location: string
  appliedDate: string
}
