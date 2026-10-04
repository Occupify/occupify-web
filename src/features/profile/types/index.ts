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

export interface ProfileEducation {
  school: string
  period: string
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
  category: string
  isTopSkill?: boolean
}

export interface ProfileData {
  name: string
  headline: string
  location: string
  connections: number
  intro: string
  onTimeRate: number
  successRate: number
  creditScore: number
  cvUrl?: string
  cvFileName?: string
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
  location?: string
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
  school: string
  period: string
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
  category: string
  isTopSkill?: boolean
}
