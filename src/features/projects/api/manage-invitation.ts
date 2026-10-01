import type { MyProject, PendingProject } from '../types'
import { getInternalStores, setInternalStores } from './get-projects'

export async function acceptInvitation(
  proj: PendingProject,
): Promise<{ acceptedProject: MyProject; pendingId: number }> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  const { employeeProjects, pending } = getInternalStores()

  const newProject: MyProject = {
    id: Date.now(),
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

  const updatedPending = pending.filter((p) => p.id !== proj.id)
  const updatedEmployeeProjects = [newProject, ...employeeProjects]

  setInternalStores({
    pending: updatedPending,
    employeeProjects: updatedEmployeeProjects,
  })

  return { acceptedProject: newProject, pendingId: proj.id }
}

export async function rejectInvitation(projId: number): Promise<{ rejectedId: number }> {
  await new Promise((resolve) => setTimeout(resolve, 60))
  const { pending } = getInternalStores()
  const updatedPending = pending.filter((p) => p.id !== projId)
  setInternalStores({ pending: updatedPending })
  return { rejectedId: projId }
}
