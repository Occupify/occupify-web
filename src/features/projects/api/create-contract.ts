import type { CreateContractFormData } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'
import { createContract as apiCreateContract } from '@/features/contracts'
import { createJob as apiCreateJob } from '@/features/jobs'

export async function createContract(
  formData: CreateContractFormData,
): Promise<{ success: boolean; contractId: string }> {
  let backendContractId: string | null = null

  // 1. If jobId and freelancerEmail exist -> Invite Mode: invoke backend POST /contracts
  if (formData.jobId && formData.freelancerEmail) {
    const isMock = formData.jobId.startsWith('role-') || formData.jobId.startsWith('mock-')
    if (isMock) {
      backendContractId = `ct-${Date.now()}`
    } else {
      const created = await apiCreateContract({
        jobId: formData.jobId,
        freelancerEmail: formData.freelancerEmail,
        message: formData.invitationMessage || formData.jobDescription || formData.title,
        file: formData.file ?? null,
      })
      backendContractId = created.id
    }
  } else if (formData.projectId) {
    // 2. If NO freelancerEmail -> Recruitment Mode: invoke backend POST /jobs
    try {
      const salaryTypeMap: Record<string, 'DAY' | 'FIXED' | 'HOURLY' | 'WEEKLY' | 'MONTHLY'> = {
        'Hàng tháng': 'MONTHLY',
        'Theo giờ': 'HOURLY',
        'Hàng tuần': 'WEEKLY',
        'Cố định': 'FIXED',
      }
      const rawPrice = Number(String(formData.salary || formData.value).replace(/[^0-9]/g, '')) || 0
      const createdJob = await apiCreateJob({
        projectId: formData.projectId,
        role: formData.roleTitle || formData.role || 'Thành viên dự án',
        title: formData.title,
        description: formData.jobDescription || formData.title,
        budget: rawPrice > 0 ? rawPrice : undefined,
        salaryType: salaryTypeMap[formData.period] || 'MONTHLY',
        startedAt: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        finishedAt: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        file: formData.file ?? null,
      })
      backendContractId = createdJob.id

      // Update recruitingRoles in local store so project detail is in sync immediately
      const { myProjects } = getInternalStores()
      const updated = myProjects.map((p) => {
        if (String(p.id) === String(formData.projectId) || p.name === formData.projectName) {
          const newRole = {
            id: createdJob.id,
            title: createdJob.title || formData.title,
            skills: createdJob.skills ? Array.from(createdJob.skills) : [],
            salaryRange: rawPrice > 0 ? `${rawPrice.toLocaleString('vi-VN')} ₫` : undefined,
            slotsTotal: createdJob.quantity || 1,
            slotsFilled: 0,
            status: 'recruiting' as const,
            jobDescription: createdJob.description,
          }
          return {
            ...p,
            recruitingRoles: [...(p.recruitingRoles || []), newRole],
          }
        }
        return p
      })
      setInternalStores({ myProjects: updated })
    } catch {
      // Fallback
    }
  }

  const { myProjects } = getInternalStores()
  const contractId = backendContractId || `ct-${Date.now()}`
  const targetProject = formData.projectName || formData.project
  const roleName = formData.roleTitle || formData.role || 'Thành viên dự án'
  const rawSalary = formData.salary || formData.value || '0'
  const formattedPrice = `${Number(String(rawSalary).replace(/[^0-9]/g, '') || '0').toLocaleString('vi-VN')} ₫`

  // If contract targets a specific project, update members list locally
  if (targetProject && (formData.candidateName || formData.freelancerEmail)) {
    const candidateDisplayName = formData.candidateName || formData.freelancerEmail.split('@')[0]
    const updated = myProjects.map((p) => {
      if (p.name === targetProject || String(p.id) === String(targetProject)) {
        return {
          ...p,
          members: [
            ...p.members,
            {
              name: candidateDisplayName,
              email: formData.candidateEmail || formData.freelancerEmail,
              role: roleName,
              price: formattedPrice,
              dueDate: formData.endDate || '2026-12-31',
              salaryDueDate:
                formData.period === 'Hàng tháng'
                  ? 'Ngày 05 hàng tháng'
                  : 'Theo tiến độ mốc nghiệm thu',
              status: 'Đang làm' as const,
            },
          ],
        }
      }
      return p
    })
    setInternalStores({ myProjects: updated })
  }

  return { success: true, contractId }
}
