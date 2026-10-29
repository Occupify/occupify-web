import type { ProfileData } from '../types'

export function formatDateForBackend(dateStr?: string): string {
  if (!dateStr || dateStr.toLowerCase().includes('hiện tại')) {
    return new Date().toISOString().split('T')[0]
  }
  const clean = dateStr.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean
  if (/^\d{2}\/\d{4}$/.test(clean)) {
    const [month, year] = clean.split('/')
    return `${year}-${month.padStart(2, '0')}-01`
  }
  if (/^\d{4}$/.test(clean)) {
    return `${clean}-01-01`
  }
  return new Date().toISOString().split('T')[0]
}

export function nameToGmail(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .toLowerCase()
      .replace(/\s+/g, '') + '@gmail.com'
  )
}

export const DEFAULT_EMPTY_PROFILE: ProfileData = {
  name: 'Chưa cập nhật',
  headline: '',
  location: '',
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

export const MOCK_MY_PROFILE_DATA: ProfileData = DEFAULT_EMPTY_PROFILE

// In-memory mutable profile state for local / offline fallback
export const currentProfileState: { data: ProfileData } = {
  data: {
    ...DEFAULT_EMPTY_PROFILE,
    experiences: [],
    education: [],
    certificates: [],
    reviews: [],
    projects: [],
    skills: [],
  },
}
