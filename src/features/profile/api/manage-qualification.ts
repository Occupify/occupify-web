import type { ProfileCertificate, CertificateFormData } from '../types'
import { currentProfileState } from './profile-state'

/**
 * Qualification / Certificate CRUD APIs (POST/PUT/DELETE /users/me/qualifications)
 */
export async function addCertificateApi(cert: CertificateFormData): Promise<ProfileCertificate[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileState.data.certificates = [cert, ...currentProfileState.data.certificates]
  return [...currentProfileState.data.certificates]
}

export async function updateCertificateApi(
  index: number,
  cert: CertificateFormData,
): Promise<ProfileCertificate[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  currentProfileState.data.certificates = currentProfileState.data.certificates.map((item, idx) =>
    idx === index ? cert : item,
  )
  return [...currentProfileState.data.certificates]
}

export async function deleteCertificateApi(index: number): Promise<ProfileCertificate[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  currentProfileState.data.certificates = currentProfileState.data.certificates.filter(
    (_, idx) => idx !== index,
  )
  return [...currentProfileState.data.certificates]
}
