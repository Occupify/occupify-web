import type { MyProject, PendingProject } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'
import {
  acceptContract as apiAcceptContract,
  rejectContract as apiRejectContract,
} from '@/features/contracts'

export async function acceptInvitation(
  proj: PendingProject,
): Promise<{ acceptedProject: MyProject; pendingId: number | string }> {
  try {
    if (typeof proj.id === 'string' || Number.isNaN(Number(proj.id))) {
      await apiAcceptContract(String(proj.id))
    }
  } catch {
    // Fallback to local mutation
  }

  const { employeeProjects, pending } = getInternalStores()

  const newProject: MyProject = {
    id: proj.id,
    name: proj.name,
    description: proj.description,
    owner: proj.owner,
    ownerCompany: proj.ownerCompany,
    ownerRating: proj.ownerRating,
    period: proj.period,
    dueDate: proj.dueDate || '2026-12-31',
    tags: proj.tags,
    recruitingRoles: proj.recruitingRoles,
    members: [
      {
        name: 'Nguyễn Minh Khoa (Tôi)',
        email: 'khoa@gmail.com',
        price: proj.price,
        dueDate: proj.dueDate || '2026-12-31',
        salaryDueDate:
          proj.period === 'Hàng tháng' ? 'Ngày 05 hàng tháng' : 'Theo tiến độ mốc nghiệm thu',
        role: proj.invitedRole,
        status: 'Đang làm',
      },
    ],
  }

  const updatedPending = pending.filter((p) => String(p.id) !== String(proj.id))
  const updatedEmployeeProjects = [newProject, ...employeeProjects]

  setInternalStores({
    pending: updatedPending,
    employeeProjects: updatedEmployeeProjects,
  })

  return { acceptedProject: newProject, pendingId: proj.id }
}

export async function rejectInvitation(
  projId: number | string,
): Promise<{ rejectedId: number | string }> {
  try {
    if (typeof projId === 'string' || Number.isNaN(Number(projId))) {
      await apiRejectContract(String(projId))
    }
  } catch {
    // Fallback to local mutation
  }

  const { pending } = getInternalStores()
  const updatedPending = pending.filter((p) => String(p.id) !== String(projId))
  setInternalStores({ pending: updatedPending })
  return { rejectedId: projId }
}
