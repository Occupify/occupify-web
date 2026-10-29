export interface AccountProfile {
  id: string
  email: string
  fullName?: string | null
  headline?: string | null
  avatarUrl?: string | null
  bio?: string | null
  phoneNumber?: string | null
  role: string
  status: string
  institutionId?: string | null
  institutionName?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface UpdateAccountPayload {
  fullName: string
  headline?: string
  bio?: string
  phoneNumber?: string
}

export interface AvatarUploadResponse {
  avatarUrl?: string | null
}

export interface ProfileReview {
  id: number
  reviewer: string
  rating: number
  comment: string
  date?: string
}

export interface ProfileProject {
  id: number
  owner: string
  name: string
  detail: string
  rating: number
}

export interface EducationalInstitution {
  id: string
  name: string
  code?: string | null
  country?: string | null
  city?: string | null
  website?: string | null
  logoUrl?: string | null
}

export interface ProfileEducation {
  id?: string | number
  institutionId?: string | null
  school: string
  period: string
  fieldOfStudy?: string
  degree?: string
  grade?: string
  description?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  documentUrl?: string
}

export interface ProfileCertificate {
  name: string
  issuer: string
  year: string
}

export interface ProfileExperience {
  id: string | number
  title: string
  company: string
  employmentType?: string
  location?: string
  startDate: string
  endDate: string
  isCurrent?: boolean
  description: string
  skills?: string[]
}

export interface ProfileSkill {
  id: string | number
  name: string
  category?: string
  isTopSkill?: boolean
}

export interface ProfileData {
  name: string
  headline?: string
  connections?: number
  intro?: string
  onTimeRate?: number
  successRate?: number
  creditScore?: number
  cvUrl?: string
  cvFileName?: string
  avatarUrl?: string | null
  email?: string
  status?: string
  education: ProfileEducation[]
  certificates: ProfileCertificate[]
  reviews: ProfileReview[]
  projects: ProfileProject[]
  experiences: ProfileExperience[]
  skills: ProfileSkill[]
}

export interface ReportProfilePayload {
  reportedUserName: string
  reason: string
  imageFileName?: string
}

export interface UploadCvResponse {
  fileName: string
  fileUrl: string
}

export interface UpdateBasicInfoPayload {
  name: string
  headline: string
  intro: string
}

export interface ExperienceFormData {
  title: string
  company: string
  employmentType?: string
  location?: string
  startDate: string
  endDate: string
  isCurrent?: boolean
  description: string
  skills?: string[]
}

export interface EducationFormData {
  id?: string | number
  institutionId: string
  school?: string
  fieldOfStudy: string
  degree?: string
  grade?: string
  description?: string
  startDate: string
  endDate?: string
  isCurrent?: boolean
  document?: File | null
  removedDocument?: boolean
}

export interface CertificateFormData {
  name: string
  issuer: string
  year: string
}

export interface ProjectFormData {
  owner: string
  name: string
  detail: string
  rating: number
}

export interface SkillFormData {
  name: string
  category?: string
  isTopSkill?: boolean
}

export const DEFAULT_EMPTY_PROFILE: ProfileData = {
  name: 'Chưa cập nhật',
  headline: '',
  connections: undefined,
  intro: '',
  onTimeRate: undefined,
  successRate: undefined,
  creditScore: undefined,
  cvFileName: undefined,
  cvUrl: undefined,
  avatarUrl: null,
  email: '',
  status: '',
  experiences: [],
  education: [],
  certificates: [],
  skills: [],
  reviews: [],
  projects: [],
}

