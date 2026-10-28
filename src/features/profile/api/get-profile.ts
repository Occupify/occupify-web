import type {
  ProfileData,
  ProfileExperience,
  ProfileEducation,
  ProfileCertificate,
  ProfileSkill,
} from '../types'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores'
import { userDetailResponseEnvelopeSchema } from './schemas'
import type { SingleResponse } from '@/types'
import { currentProfileState, DEFAULT_EMPTY_PROFILE } from './profile-state'

/**
 * Fetch profile data for current user or external partner
 * Connects to live GET /users/me/detail from occupify-identity
 */
export async function getProfileApi(userName?: string): Promise<ProfileData> {
  const { isAuthenticated, accessToken, user: authUser } = useAuthStore.getState()
  const isOwnProfile =
    !userName ||
    (authUser?.fullName && userName === authUser.fullName) ||
    (authUser?.email && userName === authUser.email) ||
    userName === 'me'

  if (isAuthenticated && accessToken && isOwnProfile) {
    try {
      const raw = await apiClient.get<SingleResponse<unknown>>('/users/me/detail')
      const parsed = userDetailResponseEnvelopeSchema.parse(raw)
      const detail = parsed.data
      const user = detail.user

      const liveExperiences: ProfileExperience[] = detail.experiences.map((exp) => ({
        id: exp.id,
        title: exp.title,
        company: exp.organization,
        employmentType: exp.employmentType ?? 'Toàn thời gian',
        location: exp.location ?? '',
        startDate: exp.startDate,
        endDate: exp.isCurrent ? 'Hiện tại' : (exp.endDate ?? ''),
        isCurrent: exp.isCurrent,
        description: exp.description ?? '',
        skills: [],
      }))

      const liveEducations: ProfileEducation[] = detail.educations.map((edu) => ({
        id: edu.id,
        school: edu.institutionName || edu.fieldOfStudy || 'Chưa cập nhật',
        period: `${edu.startDate ? edu.startDate.substring(0, 4) : ''} – ${edu.endDate ? edu.endDate.substring(0, 4) : 'Hiện tại'}`,
        fieldOfStudy: edu.fieldOfStudy,
        degree: edu.degree ?? undefined,
        description: edu.description ?? undefined,
        documentUrl: edu.documentUrl ?? undefined,
      }))

      const liveCertificates: ProfileCertificate[] = detail.qualifications.map((q) => ({
        id: q.id,
        name: q.title,
        issuer: q.organization,
        year: q.issueDate ? q.issueDate.substring(0, 4) : '',
        credentialUrl: q.credentialUrl ?? undefined,
        documentUrl: q.documentUrl ?? undefined,
      }))

      const liveSkills: ProfileSkill[] = detail.skills.map((s, idx) => ({
        id: s.skillId ?? `sk_${idx}`,
        name: s.skillName ?? 'Skill',
        category: s.category ?? 'General',
        isTopSkill: s.isTopSkill,
      }))

      const resolvedName = user.fullName || authUser?.fullName || user.email.split('@')[0]
      const resolvedHeadline = user.headline ?? ''
      const resolvedIntro = user.bio ?? ''

      currentProfileState.data = {
        ...currentProfileState.data,
        name: resolvedName,
        email: user.email,
        headline: resolvedHeadline,
        avatarUrl: user.avatarUrl ?? null,
        status: user.status,
        intro: resolvedIntro,
        experiences: liveExperiences,
        education: liveEducations,
        certificates: liveCertificates,
        skills: liveSkills,
        reviews: [],
        projects: currentProfileState.data.projects.length > 0 ? currentProfileState.data.projects : [],
      }

      return { ...currentProfileState.data }
    } catch (err) {
      console.warn('[getProfileApi] Error fetching /users/me/detail, using local/cached state:', err)
    }
  }

  // Construct partner profile dynamically without seed data
  if (userName && userName !== 'me') {
    return {
      ...DEFAULT_EMPTY_PROFILE,
      name: userName,
      headline: '',
      intro: '',
      experiences: [],
      education: [],
      certificates: [],
      skills: [],
      reviews: [],
      projects: [],
    }
  }

  return { ...currentProfileState.data }
}
