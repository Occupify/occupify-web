import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProfileApi,
  reportProfileApi,
  uploadCvApi,
  updateBasicInfoApi,
  addExperienceApi,
  updateExperienceApi,
  deleteExperienceApi,
  addEducationApi,
  updateEducationApi,
  deleteEducationApi,
  addCertificateApi,
  updateCertificateApi,
  deleteCertificateApi,
  addProjectApi,
  updateProjectApi,
  deleteProjectApi,
  addSkillApi,
  updateSkillApi,
  deleteSkillApi,
} from '../api'
import type {
  ReportProfilePayload,
  UpdateBasicInfoPayload,
  ExperienceFormData,
  EducationFormData,
  CertificateFormData,
  ProjectFormData,
  SkillFormData,
} from '../types'

export function useProfile(userName?: string) {
  return useQuery({
    queryKey: ['profile', userName || 'me'],
    queryFn: () => getProfileApi(userName),
  })
}

export function useUpdateBasicInfo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateBasicInfoPayload) => updateBasicInfoApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (exp: ExperienceFormData) => addExperienceApi(exp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: ExperienceFormData }) =>
      updateExperienceApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteExperienceApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (edu: EducationFormData) => addEducationApi(edu),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ index, data }: { index: number; data: EducationFormData }) =>
      updateEducationApi(index, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteEducation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (index: number) => deleteEducationApi(index),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cert: CertificateFormData) => addCertificateApi(cert),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ index, data }: { index: number; data: CertificateFormData }) =>
      updateCertificateApi(index, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (index: number) => deleteCertificateApi(index),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (proj: ProjectFormData) => addProjectApi(proj),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProjectFormData }) => updateProjectApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProjectApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useReportProfile() {
  return useMutation({
    mutationFn: (payload: ReportProfilePayload) => reportProfileApi(payload),
  })
}

export function useUploadCv() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadCvApi(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useAddSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkillFormData) => addSkillApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useUpdateSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: SkillFormData }) =>
      updateSkillApi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}

export function useDeleteSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteSkillApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
  })
}
