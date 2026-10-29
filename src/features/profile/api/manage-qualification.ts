import type { CertificateFormData } from '../types'
import { apiClient } from '@/lib/api-client'

/**
 * Qualification / Certificate CRUD APIs (POST/PUT/DELETE /users/me/qualifications)
 */
export async function addCertificateApi(cert: CertificateFormData): Promise<void> {
  await apiClient.post('/users/me/qualifications', {
    title: cert.name,
    organization: cert.issuer,
    issueDate: cert.year ? `${cert.year}-01-01` : new Date().toISOString().split('T')[0],
  })
}

export async function updateCertificateApi(
  id: number | string,
  cert: CertificateFormData,
): Promise<void> {
  await apiClient.put(`/users/me/qualifications/${id}`, {
    title: cert.name,
    organization: cert.issuer,
    issueDate: cert.year ? `${cert.year}-01-01` : new Date().toISOString().split('T')[0],
  })
}

export async function deleteCertificateApi(id: number | string): Promise<void> {
  await apiClient.delete(`/users/me/qualifications/${id}`)
}
