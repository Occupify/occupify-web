import type { CreateContractFormData } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

export async function createContract(
  formData: CreateContractFormData,
): Promise<{ success: boolean; contractId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const { myProjects } = getInternalStores()
  const contractId = `ct-${Date.now()}`
  const targetProject = formData.projectName
  const roleName = formData.roleTitle || formData.role || 'Thành viên dự án'
  const rawSalary = formData.salary || formData.value || '0'
  const formattedPrice = `${Number(rawSalary.replace(/[^0-9]/g, '') || '0').toLocaleString('vi-VN')} ₫`

  // If contract targets a specific project, update members list
  if (targetProject && formData.candidateName) {
    const updated = myProjects.map((p) => {
      if (p.name === targetProject) {
        return {
          ...p,
          members: [
            ...p.members,
            {
              name: formData.candidateName!,
              email: formData.candidateEmail || formData.freelancerEmail || 'freelancer@gmail.com',
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
