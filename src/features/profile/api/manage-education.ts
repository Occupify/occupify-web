import type { EducationFormData } from '../types'
import { apiClient } from '@/lib/api-client'
import { formatDateForBackend } from '../utils'

/**
 * Education CRUD APIs (POST/PUT/DELETE /users/me/educations)
 * Connects to occupify-identity UserProfileController (Multipart Form)
 */
export async function addEducationApi(edu: EducationFormData): Promise<void> {
  const formData = new FormData()
  formData.append('institutionId', edu.institutionId)
  formData.append('fieldOfStudy', edu.fieldOfStudy)
  formData.append('startDate', formatDateForBackend(edu.startDate))

  if (edu.degree) formData.append('degree', edu.degree)
  if (edu.grade) formData.append('grade', edu.grade)
  if (edu.description) formData.append('description', edu.description)
  if (edu.endDate && !edu.isCurrent) {
    formData.append('endDate', formatDateForBackend(edu.endDate))
  }
  if (edu.document) {
    formData.append('document', edu.document)
  }

  await apiClient.post('/users/me/educations', formData)
}

export async function updateEducationApi(
  id: number | string,
  edu: EducationFormData,
): Promise<void> {
  const formData = new FormData()
  formData.append('institutionId', edu.institutionId)
  formData.append('fieldOfStudy', edu.fieldOfStudy)
  formData.append('startDate', formatDateForBackend(edu.startDate))

  if (edu.degree) formData.append('degree', edu.degree)
  if (edu.grade) formData.append('grade', edu.grade)
  if (edu.description) formData.append('description', edu.description)
  if (edu.endDate && !edu.isCurrent) {
    formData.append('endDate', formatDateForBackend(edu.endDate))
  }
  if (edu.document) {
    formData.append('document', edu.document)
  }
  if (edu.removedDocument) {
    formData.append('removeDocument', 'true')
    formData.append('removedDocument', 'true')
  }

  await apiClient.put(`/users/me/educations/${id}`, formData)
}

export async function deleteEducationApi(id: number | string): Promise<void> {
  await apiClient.delete(`/users/me/educations/${id}`)
}
