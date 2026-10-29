import {
  DEFAULT_EMPTY_PROFILE,
  type ProfileData,
  type ProfileExperience,
  type ProfileEducation,
  type ProfileCertificate,
  type ProfileSkill,
} from '../types'
import { apiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores'
import { userDetailResponseEnvelopeSchema } from './schemas'
import type { SingleResponse } from '@/types'
import { fromBackendEmploymentType } from '../utils'

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
    const raw = await apiClient.get<SingleResponse<unknown>>('/users/me/detail')
    const parsed = userDetailResponseEnvelopeSchema.parse(raw)
    const detail = parsed.data
    const user = detail.user

    const liveExperiences: ProfileExperience[] = detail.experiences.map((exp) => ({
      id: exp.id,
      title: exp.title,
      company: exp.organization,
      employmentType: fromBackendEmploymentType(exp.employmentType ?? undefined),
      location: exp.location ?? '',
      startDate: exp.startDate,
      endDate: exp.isCurrent ? 'Hiện tại' : (exp.endDate ?? ''),
      isCurrent: exp.isCurrent,
      description: exp.description ?? '',
      skills: [],
    }))

    const liveEducations: ProfileEducation[] = detail.educations.map((edu) => ({
      id: edu.id,
      institutionId: edu.institutionId ?? undefined,
      school: edu.institutionName || edu.fieldOfStudy || 'Chưa cập nhật',
      period: `${edu.startDate ? edu.startDate.substring(0, 4) : ''} – ${edu.endDate ? edu.endDate.substring(0, 4) : 'Hiện tại'}`,
      fieldOfStudy: edu.fieldOfStudy,
      degree: edu.degree ?? undefined,
      grade: edu.grade ?? undefined,
      startDate: edu.startDate,
      endDate: edu.endDate ?? undefined,
      isCurrent: !edu.endDate,
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

    return {
      ...DEFAULT_EMPTY_PROFILE,
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
      projects: [],
    }
  }

  // Construct partner profile dynamically without seed data
  if (userName && userName !== 'me') {
    return {
      ...DEFAULT_EMPTY_PROFILE,
      name: userName,
    }
  }

  return { ...DEFAULT_EMPTY_PROFILE }
}
