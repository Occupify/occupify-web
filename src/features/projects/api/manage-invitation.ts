import type { MyProject, PendingProject } from '../types/index.ts'
import { getInternalStores, setInternalStores } from './get-projects.ts'
import {
  acceptContract as apiAcceptContract,
  rejectContract as apiRejectContract,
} from '../../contracts/api/manage-contract.ts'
import { toMyProjectFromContract } from '../../contracts/types/index.ts'

export async function acceptInvitation(
  proj: PendingProject,
): Promise<{ acceptedProject: MyProject; pendingId: number | string }> {
  let acceptedProject: MyProject | null = null

  if (
    !String(proj.id).startsWith('local-') &&
    (typeof proj.id === 'string' || Number.isNaN(Number(proj.id)))
  ) {
    const contract = await apiAcceptContract(String(proj.id))
    acceptedProject = toMyProjectFromContract(
      contract,
      contract.employee?.id ?? contract.employeeId ?? undefined,
    )
  }

  const { employeeProjects, pending } = getInternalStores()

  const newProject: MyProject = acceptedProject ?? {
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
        name: 'Tôi',
        email: '',
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
  if (
    !String(projId).startsWith('local-') &&
    (typeof projId === 'string' || Number.isNaN(Number(projId)))
  ) {
    await apiRejectContract(String(projId))
  }

  const { pending } = getInternalStores()
  const updatedPending = pending.filter((p) => String(p.id) !== String(projId))
  setInternalStores({ pending: updatedPending })
  return { rejectedId: projId }
}
