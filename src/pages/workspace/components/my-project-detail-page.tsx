import { useMemo, useState } from 'react'
import {
  BriefcaseIcon,
  DownloadSimpleIcon,
  FilePdfIcon,
  FileTextIcon,
  HandshakeIcon,
  LockIcon,
  PaperclipIcon,
  PencilSimpleIcon,
  SealCheckIcon,
  StarIcon,
  TrashIcon,
  UserPlusIcon,
  XIcon,
} from '@phosphor-icons/react'
import { Avatar } from '@/components/ui'
import { toast } from '@/components/feedback'
import { CancelModal, EditProjectModal } from '@/features/projects'
import type {
  ApplicantProposal,
  MyProject,
  ProjectMember,
  ProjectRole,
  UpdateProjectPayload,
} from '@/features/projects'
import { useProjectBids, toApplicantProposalFromBid } from '@/features/bids'
import {
  useContracts,
  toProjectMemberFromContract,
  useCompleteContract,
  useCancelContract,
  useUpdateContract,
} from '@/features/contracts'
import {
  useCloseJob,
  useDeleteJob,
  useUpdateJob,
} from '@/features/jobs'

interface MyProjectDetailPageProps {
  project: MyProject
  onBack: () => void
  onCreateContract?: (
    roleTitle?: string,
    candidateName?: string,
    bidValue?: string,
    candidateEmail?: string,
    jobDescription?: string,
    mode?: 'create' | 'invite',
    jobId?: string,
  ) => void
  onCancelProject?: (projectId: number | string, reason?: string) => void
  onUpdateProject?: (
    projectId: number | string,
    payload: UpdateProjectPayload,
  ) => Promise<void> | void
  onUpdateMembers?: (projectId: number | string, members: ProjectMember[]) => void
}

export function MyProjectDetailPage({
  project,
  onBack,
  onCreateContract,
  onCancelProject,
  onUpdateProject,
  onUpdateMembers,
}: MyProjectDetailPageProps) {
  const isRealBackendProject = typeof project.id === 'string' && !project.id.startsWith('local-')

  const { data: bidsData } = useProjectBids(isRealBackendProject ? String(project.id) : undefined)
  const { data: contractsData } = useContracts(
    isRealBackendProject ? { projectId: String(project.id) } : undefined,
  )
  const completeContractMutation = useCompleteContract()
  const cancelContractMutation = useCancelContract()
  const updateContractMutation = useUpdateContract()
  const closeJobMutation = useCloseJob()
  const deleteJobMutation = useDeleteJob()
  const updateJobMutation = useUpdateJob()

  const effectiveMembers = useMemo(() => {
    if (contractsData?.data && Array.isArray(contractsData.data) && contractsData.data.length > 0) {
      return contractsData.data.map(toProjectMemberFromContract)
    }
    return project.members || []
  }, [contractsData, project.members])

  const [membersOverride, setMembersOverride] = useState<ProjectMember[] | null>(null)
  const members = membersOverride ?? effectiveMembers

  const setMembers = (
    newMembers: ProjectMember[] | ((prev: ProjectMember[]) => ProjectMember[]),
  ) => {
    if (typeof newMembers === 'function') {
      setMembersOverride((prev) => newMembers(prev ?? effectiveMembers))
    } else {
      setMembersOverride(newMembers)
    }
  }

  const [cancelTarget, setCancelTarget] = useState<string | null>(null)
  const [closeRecruitConfirm, setCloseRecruitConfirm] = useState(false)
  const [recruitmentClosed, setRecruitmentClosed] = useState(false)
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [contractDetailMember, setContractDetailMember] = useState<ProjectMember | null>(null)
  const [isEditingContract, setIsEditingContract] = useState(false)

  // Edit / Delete role states
  const [editingJobRole, setEditingJobRole] = useState<ProjectRole | null>(null)
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null)
  const [roleTitleInput, setRoleTitleInput] = useState('')
  const [roleBudgetInput, setRoleBudgetInput] = useState('')
  const [roleDescInput, setRoleDescInput] = useState('')

  // Edit contract states
  const [editContractMsg, setEditContractMsg] = useState('')
  const [editContractTermsFile, setEditContractTermsFile] = useState<File | null>(null)

  // Rating modal state
  const [ratingTarget, setRatingTarget] = useState<string | null>(null)
  const [ratingStars, setRatingStars] = useState(5)
  const [ratingOnTime, setRatingOnTime] = useState(true)
  const [ratingComment, setRatingComment] = useState('')

  const effectiveApplicants: ApplicantProposal[] = useMemo(() => {
    if (bidsData?.data && Array.isArray(bidsData.data) && bidsData.data.length > 0) {
      return bidsData.data.map(toApplicantProposalFromBid)
    }
    return []
  }, [bidsData])

  const [applicantOverrides, setApplicantOverrides] = useState<
    Record<string | number, 'accepted' | 'rejected'>
  >({})

  const applicants: ApplicantProposal[] = useMemo(() => {
    return effectiveApplicants.map((a: ApplicantProposal) => {
      const override = applicantOverrides[a.id]
      return override ? { ...a, status: override } : a
    })
  }, [effectiveApplicants, applicantOverrides])

  const setApplicants = (updater: (prev: ApplicantProposal[]) => ApplicantProposal[]) => {
    const updated = updater(applicants)
    const newOverrides: Record<string | number, 'accepted' | 'rejected'> = { ...applicantOverrides }
    updated.forEach((a: ApplicantProposal) => {
      if (a.status !== 'pending') {
        newOverrides[a.id] = a.status
      }
    })
    setApplicantOverrides(newOverrides)
  }

  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantProposal | null>(null)
  const [applicantRoleFilter, setApplicantRoleFilter] = useState('all')

  const availableRoles = Array.from(
    new Set([
      ...(project.recruitingRoles?.map((r) => r.title) || []),
      ...applicants.map((a: ApplicantProposal) => a.roleApplied),
    ]),
  )

  const filteredApplicants = applicants.filter((a: ApplicantProposal) => {
    if (applicantRoleFilter === 'all') return true
    return a.roleApplied === applicantRoleFilter
  })

  const handleRejectApplicant = (applicantId: number | string) => {
    setApplicants((prev: ApplicantProposal[]) =>
      prev.map((a: ApplicantProposal) =>
        a.id === applicantId ? { ...a, status: 'rejected' as const } : a,
      ),
    )
    if (selectedApplicant?.id === applicantId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: 'rejected' } : null))
    }
    const target = applicants.find((a: ApplicantProposal) => a.id === applicantId)
    toast.info(`Đã từ chối đơn ứng tuyển của ${target?.name || 'ứng viên'}.`)
  }

  const handleAcceptApplicant = (applicant: ApplicantProposal) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === applicant.id ? { ...a, status: 'accepted' as const } : a)),
    )
    setSelectedApplicant(null)
    toast.success(`Đã chấp nhận ${applicant.name}! Đang chuyển sang soạn thảo hợp đồng...`)
    if (onCreateContract) {
      onCreateContract(
        applicant.roleApplied,
        applicant.name,
        applicant.rawBidValue,
        applicant.email,
        `Đảm nhiệm vị trí ${applicant.roleApplied} cho dự án ${project.name}. Cam kết thực hiện công việc theo thoả thuận ứng tuyển và bàn giao chất lượng.`,
        'invite',
        applicant.jobId,
      )
    }
  }

  const handleConfirmCancel = async (reason?: string) => {
    if (cancelTarget === 'project') {
      if (onCancelProject) {
        onCancelProject(project.id, reason)
      } else {
        toast.info('Đã hủy dự án.')
        onBack()
      }
      return
    }
    if (cancelTarget) {
      const targetContract = contractsData?.data?.find(
        (c) =>
          c.freelancerEmail?.toLowerCase() === cancelTarget.toLowerCase() ||
          String(c.id) === String(cancelTarget),
      )
      if (targetContract) {
        try {
          await cancelContractMutation.mutateAsync({
            contractId: targetContract.id,
            reason: reason || 'Chủ dự án hủy hợp đồng',
          })
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Có lỗi khi hủy hợp đồng'
          toast.error(msg)
          return
        }
      }
      const updatedMembers = members.filter(
        (m) =>
          m.email?.toLowerCase() !== cancelTarget.toLowerCase() &&
          m.contractId !== cancelTarget &&
          m.id !== cancelTarget,
      )
      setMembers(updatedMembers)
      onUpdateMembers?.(project.id, updatedMembers)
      toast.info('Đã hủy hợp đồng với thành viên.')
      setCancelTarget(null)
    }
  }

  const handleCloseRoleRecruiting = async (roleId: string) => {
    try {
      await closeJobMutation.mutateAsync(roleId)
      toast.info('Đã đóng tuyển dụng cho vị trí này.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi đóng tuyển dụng'
      toast.error(msg)
    }
  }

  const handleCloseAllRecruitment = async () => {
    try {
      if (project.recruitingRoles && project.recruitingRoles.length > 0) {
        await Promise.all(
          project.recruitingRoles
            .filter((r) => r.status === 'recruiting')
            .map((r) => closeJobMutation.mutateAsync(r.id)),
        )
      }
      setRecruitmentClosed(true)
      setCloseRecruitConfirm(false)
      toast.info('Đã đóng tuyển dụng cho toàn bộ dự án.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi đóng tuyển dụng'
      toast.error(msg)
    }
  }

  const handleSaveRole = async () => {
    if (!editingJobRole) return
    try {
      await updateJobMutation.mutateAsync({
        jobId: editingJobRole.id,
        payload: {
          title: roleTitleInput,
          role: roleTitleInput,
          description: roleDescInput,
          budget: Number(roleBudgetInput.replace(/[^0-9]/g, '')) || undefined,
        },
      })
      toast.success('Đã cập nhật vị trí tuyển dụng!')
      setEditingJobRole(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi cập nhật vị trí'
      toast.error(msg)
    }
  }

  const handleConfirmDeleteJob = async () => {
    if (!deletingJobId) return
    try {
      await deleteJobMutation.mutateAsync(deletingJobId)
      toast.success('Đã xóa vị trí tuyển dụng!')
      setDeletingJobId(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi khi xóa vị trí'
      toast.error(msg)
    }
  }

  const handleSaveContract = async () => {
    if (!contractDetailMember) return
    const targetContract = contractsData?.data?.find(
      (c) =>
        c.freelancerEmail?.toLowerCase() === contractDetailMember.email?.toLowerCase() ||
        c.id === contractDetailMember.contractId ||
        c.id === contractDetailMember.id,
    )
    if (targetContract) {
      try {
        await updateContractMutation.mutateAsync({
          contractId: targetContract.id,
          payload: {
            jobId: targetContract.jobId,
            message: editContractMsg || undefined,
            freelancerEmail: contractDetailMember.email,
            file: editContractTermsFile,
          },
        })
        toast.success('Đã cập nhật hợp đồng thành công!')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Có lỗi khi cập nhật hợp đồng'
        toast.error(msg)
      }
    } else {
      toast.info('Đã cập nhật hợp đồng.')
    }
    setIsEditingContract(false)
  }

  const cancelMember = members.find((m) => m.email === cancelTarget)

  return (
    <div className="min-h-full px-4 py-7 pb-12 !bg-[var(--bg-base)]">
      <div className="mx-auto max-w-[1128px]">
        {/* Main Card */}
        <div className="overflow-hidden rounded-lg border shadow-xs !border-[var(--border-default)] !bg-[var(--bg-elevated)]">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b p-6 sm:px-7 !border-[var(--border-default)]">
            <div>
              <h1 className="text-[22px] font-bold leading-tight !text-[var(--text-primary)]">
                {project.name}
              </h1>
              <p className="mt-1.5 text-sm !text-[var(--text-secondary)]">
                {members.length} thành viên · Thời gian hoàn thành dự án:{' '}
                {project.dueDate || 'Linh hoạt'}
                {project.bidCloseDate ? ` · Hạn chót ứng tuyển: ${project.bidCloseDate}` : ''}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2.5">
              {project.status === 'CLOSED' ? (
                <span className="rounded-full border border-gray-300 bg-gray-100 px-4 py-1.5 text-xs font-bold text-gray-600">
                  Dự án đã đóng
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingProject(true)}
                    className="cursor-pointer rounded-full border border-[var(--border-default)] px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--bg-subtle)] !text-[var(--text-primary)]"
                  >
                    Chỉnh sửa
                  </button>

                  <button
                    type="button"
                    onClick={() => setCloseRecruitConfirm(true)}
                    className="cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition-colors !border-[#C03A2B] !text-[#C03A2B] hover:!bg-[#FBE2E2]"
                  >
                    {recruitmentClosed ? 'Đã đóng tuyển dụng' : 'Đóng tuyển dụng'}
                  </button>

                  {members.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => setCancelTarget('project')}
                      className="cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold transition-colors !border-[#C03A2B] !text-[#C03A2B] hover:!bg-[#FBE2E2]"
                    >
                      Hủy dự án
                    </button>
                  ) : (
                    <div
                      title="Cần hủy tất cả hợp đồng với nhân sự trong dự án trước khi có thể hủy dự án này"
                      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-tertiary)]"
                    >
                      <LockIcon size={14} />
                      <span>Không thể hủy khi còn nhân sự ({members.length})</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Section: Vị trí tuyển dụng trong dự án */}
          {project.recruitingRoles && project.recruitingRoles.length > 0 && (
            <div className="border-b p-6 sm:px-7 !border-[var(--border-default)] !bg-[var(--bg-subtle)]/50">
              <div className="mb-3.5">
                <h2 className="text-[15px] font-bold !text-[var(--text-primary)]">
                  Vị trí tuyển dụng trong dự án ({project.recruitingRoles.length} vai trò)
                </h2>
                <p className="mt-0.5 text-[13px] !text-[var(--text-secondary)]">
                  Các role cần thiết lập hợp đồng và chiêu mộ nhân sự
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.recruitingRoles.map((r) => {
                  const isRecruiting = r.status === 'recruiting'
                  return (
                    <div
                      key={r.id}
                      className={`flex flex-col justify-between rounded-lg border p-3.5 shadow-xs transition-colors !bg-[var(--bg-elevated)] ${
                        isRecruiting
                          ? '!border-[var(--color-primary-500)]/30'
                          : '!border-[var(--border-default)]'
                      }`}
                    >
                      <div>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <span className="text-sm font-bold !text-[var(--text-primary)]">
                            {r.title}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                              isRecruiting
                                ? '!border !border-[#BBF7D0] !bg-[#E5F6E8] !text-[#057642]'
                                : '!border !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-secondary)]'
                            }`}
                          >
                            {isRecruiting ? 'Đang tuyển' : 'Đã có nhân sự'}
                          </span>
                        </div>

                        {!isRecruiting && (
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11.5px] font-semibold !border-[#DCFCE7] !bg-[#F0FDF4] !text-[#057642]">
                            <SealCheckIcon size={13} weight="fill" className="text-[#057642]" />
                            <span>
                              {r.assignedMemberName || members.find((m) => m.role === r.title)?.name
                                ? `Đã giao: ${
                                    r.assignedMemberName ||
                                    members.find((m) => m.role === r.title)?.name
                                  }`
                                : 'Đã có nhân sự tiếp nhận'}
                            </span>
                          </div>
                        )}

                        {r.salaryRange && (
                          <div className="mb-2 text-xs !text-[var(--text-secondary)]">
                            Ngân sách:{' '}
                            <span className="font-semibold !text-[var(--color-primary-500)]">
                              {r.salaryRange}
                            </span>
                          </div>
                        )}

                        {r.skills && r.skills.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1">
                            {r.skills.map((s) => (
                              <span
                                key={s}
                                className="rounded px-1.5 py-0.5 text-[11px] !bg-[var(--bg-subtle)] !text-[var(--text-secondary)]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {isRecruiting && (
                        <button
                          type="button"
                          onClick={() => {
                            const defaultJd =
                              r.jobDescription ||
                              `Đảm nhiệm vai trò ${r.title} cho dự án ${project.name}.${
                                r.skills && r.skills.length > 0
                                  ? ` Yêu cầu kỹ năng chuyên môn: ${r.skills.join(', ')}.`
                                  : ''
                              } Chịu trách nhiệm thực hiện các hạng mục chuyên môn, phối hợp kỹ thuật cùng đội ngũ và bàn giao sản phẩm đúng tiến độ cam kết.`
                            onCreateContract?.(
                              r.title,
                              undefined,
                              r.salaryRange ? r.salaryRange.split('-')[0].trim() : undefined,
                              undefined,
                              defaultJd,
                              'invite',
                              r.id,
                            )
                          }}
                          className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-bold transition-colors !border-[var(--color-primary-500)] !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)] hover:!bg-[var(--color-primary-500)] hover:!text-white"
                        >
                          <UserPlusIcon size={14} weight="bold" />
                          <span>Mời hợp đồng cho vai trò này</span>
                        </button>
                      )}

                      {/* Role Management Actions (PUT, DELETE, CLOSE /jobs) */}
                      <div className="mt-2.5 flex items-center justify-between border-t pt-2 !border-[var(--border-subtle)] text-[11.5px]">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingJobRole(r)
                              setRoleTitleInput(r.title)
                              setRoleBudgetInput(r.salaryRange ? r.salaryRange.replace(/[^0-9]/g, '') : '')
                              setRoleDescInput(r.jobDescription || '')
                            }}
                            className="inline-flex cursor-pointer items-center gap-1 font-semibold !text-[var(--text-secondary)] hover:!text-[var(--color-primary-500)]"
                          >
                            <PencilSimpleIcon size={13} />
                            <span>Sửa</span>
                          </button>
                          <span className="!text-[var(--border-default)]">·</span>
                          <button
                            type="button"
                            onClick={() => setDeletingJobId(r.id)}
                            className="inline-flex cursor-pointer items-center gap-1 font-semibold !text-[#C03A2B] hover:underline"
                          >
                            <TrashIcon size={13} />
                            <span>Xóa</span>
                          </button>
                        </div>

                        {isRecruiting && (
                          <button
                            type="button"
                            onClick={() => handleCloseRoleRecruiting(r.id)}
                            className="inline-flex cursor-pointer items-center gap-1 font-semibold !text-[#D97706] hover:underline"
                          >
                            <LockIcon size={13} />
                            <span>Đóng tuyển</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Section: Danh sách thành viên */}
          <div className="border-b p-6 sm:px-7 !border-[var(--border-default)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[15px] font-bold !text-[var(--text-primary)]">
                Danh sách thành viên
              </span>
              <button
                type="button"
                onClick={() => onCreateContract?.()}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors !border-[var(--color-primary-500)] !text-[var(--color-primary-500)] hover:!bg-[var(--color-primary-50)]"
              >
                <UserPlusIcon size={15} />
                <span>Mời thành viên</span>
              </button>
            </div>

            {members.length === 0 ? (
              <p className="text-[13px] !text-[var(--text-tertiary)]">Không còn thành viên nào.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {members.map((m) => (
                  <div
                    key={m.email}
                    className="rounded-lg border p-4.5 !border-[var(--border-subtle)] !bg-[var(--bg-subtle)]/40"
                  >
                    {/* Name row */}
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold !text-[var(--text-primary)]">
                        {m.name}
                      </span>
                      {m.role && (
                        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                          <BriefcaseIcon size={12} weight="bold" />
                          {m.role}
                        </span>
                      )}
                      <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                        {m.status ?? 'Đang làm'}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="mb-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <div>
                        <div className="mb-0.5 text-[11px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                          Giá trị HĐ
                        </div>
                        <div className="text-sm font-bold !text-[var(--text-primary)]">
                          {m.price}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 text-[11px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                          Chu kỳ
                        </div>
                        <div className="text-sm !text-[var(--text-secondary)]">
                          {project.period}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 text-[11px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                          Hạn hoàn thành
                        </div>
                        <div className="text-sm !text-[var(--text-secondary)]">
                          {m.dueDate ?? project.dueDate ?? '—'}
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 text-[11px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                          Hạn trả lương
                        </div>
                        <div className="text-sm font-bold !text-[var(--color-primary-500)]">
                          {m.salaryDueDate ??
                            (project.period === 'Hàng tháng'
                              ? 'Ngày 05 hàng tháng'
                              : project.period === 'Hàng tuần'
                                ? 'Thứ 6 hàng tuần'
                                : project.dueDate
                                  ? `Trước ${project.dueDate}`
                                  : 'Theo thỏa thuận')}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRatingTarget(m.email)
                          setRatingStars(5)
                          setRatingOnTime(true)
                          setRatingComment('')
                        }}
                        className="cursor-pointer rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors !border-[#44712E] !text-[#44712E] hover:!bg-[#E5F6E8]"
                      >
                        Hoàn thành dự án
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelTarget(m.email)}
                        className="cursor-pointer rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors !border-[#C03A2B] !text-[#C03A2B] hover:!bg-[#FBE2E2]"
                      >
                        Hủy hợp đồng
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setContractDetailMember(m)
                          setIsEditingContract(false)
                        }}
                        className="cursor-pointer rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-colors !border-[var(--color-primary-500)] !text-[var(--color-primary-500)] hover:!bg-[var(--color-primary-50)]"
                      >
                        Xem chi tiết hợp đồng
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Danh sách ứng viên */}
          <div className="p-6 sm:px-7">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold !text-[var(--text-primary)]">
                  Danh sách ứng viên
                </span>
                <span className="rounded-full px-2 py-0.5 text-xs font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                  {filteredApplicants.length} đơn
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium !text-[var(--text-secondary)]">
                  Lọc theo vai trò:
                </span>
                <select
                  value={applicantRoleFilter}
                  onChange={(e) => setApplicantRoleFilter(e.target.value)}
                  className="cursor-pointer rounded-md border px-3 py-1.5 text-[13px] font-semibold outline-none transition-colors !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] focus:!border-[var(--color-primary-500)]"
                >
                  <option value="all">Tất cả vai trò ({applicants.length})</option>
                  {availableRoles.map((role) => {
                    const count = applicants.filter(
                      (a: ApplicantProposal) => a.roleApplied === role,
                    ).length
                    return (
                      <option key={role} value={role}>
                        {role} ({count})
                      </option>
                    )
                  })}
                </select>
              </div>
            </div>

            <p className="mb-4 text-[13px] !text-[var(--text-secondary)]">
              Bấm vào ứng viên để xem chi tiết hồ sơ, CV và xét duyệt
            </p>

            {filteredApplicants.length === 0 ? (
              <div className="rounded-lg border border-dashed p-9 text-center text-[13.5px] !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-tertiary)]">
                Chưa có ứng viên nào nộp hồ sơ cho vai trò{' '}
                <b>&ldquo;{applicantRoleFilter}&rdquo;</b>.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredApplicants.map((proposal: ApplicantProposal) => {
                  const isSelected = selectedApplicant?.id === proposal.id
                  return (
                    <div
                      key={proposal.id}
                      onClick={() => setSelectedApplicant(proposal)}
                      className={`flex cursor-pointer items-start gap-3.5 rounded-lg border p-4 transition-all duration-150 ${
                        isSelected
                          ? '!border-[var(--color-primary-500)] !bg-[var(--color-primary-50)]/40 shadow-xs'
                          : '!border-[var(--border-default)] !bg-[var(--bg-subtle)]/30 hover:!border-[var(--color-primary-500)]/40 hover:!bg-[var(--bg-subtle)]/70'
                      }`}
                    >
                      <Avatar name={proposal.name} size="md" />

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[14.5px] font-bold !text-[var(--text-primary)]">
                              {proposal.name}
                            </span>
                            <span className="rounded-full px-2 py-0.5 text-[11.5px] font-bold !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                              {proposal.roleApplied}
                            </span>
                            {proposal.status === 'accepted' && (
                              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold !bg-[#DCFCE7] !text-[#15803D]">
                                Đã chấp nhận
                              </span>
                            )}
                            {proposal.status === 'rejected' && (
                              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold !bg-[#FEE2E2] !text-[#B91C1C]">
                                Đã từ chối
                              </span>
                            )}
                            {proposal.status === 'pending' && (
                              <span className="rounded-full px-2 py-0.5 text-[11px] font-bold !bg-[#FEF3C7] !text-[#B45309]">
                                Chờ xét duyệt
                              </span>
                            )}
                          </div>

                          <span className="shrink-0 text-[14.5px] font-extrabold !text-[#057642]">
                            {proposal.bid}{' '}
                            <span className="text-xs font-semibold !text-[var(--text-tertiary)]">
                              / {proposal.salaryCycle.toLowerCase()}
                            </span>
                          </span>
                        </div>

                        <div className="mb-1.5 text-[12.5px] !text-[var(--text-secondary)]">
                          {proposal.occupation}
                        </div>

                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs !text-[var(--text-secondary)]">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className={
                                  s <= Math.round(proposal.rating)
                                    ? 'text-[#F5A623]'
                                    : 'text-[#D1D5DB]'
                                }
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1 !text-[var(--text-secondary)]">
                              {proposal.rating} ({proposal.ratingCount})
                            </span>
                          </div>

                          <span className="!text-[var(--text-tertiary)]">•</span>

                          <span>
                            Cam kết: <strong>{proposal.commitment}</strong>
                          </span>

                          <span className="!text-[var(--text-tertiary)]">•</span>

                          <span className="inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[11.5px] font-semibold !border-[#FECACA] !bg-[#FEF2F2] !text-[#DC2626]">
                            <FilePdfIcon size={13} weight="fill" />
                            <span>
                              {proposal.cvFileName} ({proposal.cvFileSize})
                            </span>
                          </span>
                        </div>

                        <p className="line-clamp-2 text-[13px] leading-relaxed !text-[var(--text-secondary)]">
                          {proposal.comment}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedApplicant(proposal)
                            }}
                            className="cursor-pointer text-[12.5px] font-bold !text-[var(--color-primary-500)] hover:underline"
                          >
                            Xem đơn ứng tuyển & CV →
                          </button>

                          <span className="text-[11.5px] !text-[var(--text-tertiary)]">
                            Nộp: {proposal.appliedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Modal Xem Đơn Ứng Tuyển ─── */}
      {selectedApplicant && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
          onClick={() => setSelectedApplicant(null)}
        >
          <div
            className="flex max-h-[92vh] w-full max-w-[580px] flex-col overflow-y-auto rounded-xl shadow-2xl !bg-[var(--bg-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4.5 sm:px-6 !border-[var(--border-default)] !bg-[var(--bg-subtle)]/40">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
                  <FileTextIcon size={18} weight="bold" />
                </div>
                <div>
                  <h3 className="text-base font-bold !text-[var(--text-primary)]">
                    Hồ sơ ứng tuyển dự án
                  </h3>
                  <div className="text-xs !text-[var(--text-tertiary)]">
                    Dự án: <strong>{project.name}</strong> · Nộp lúc {selectedApplicant.appliedDate}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="cursor-pointer rounded-full p-1 !text-[var(--text-tertiary)] hover:!bg-[var(--bg-subtle)] hover:!text-[var(--text-primary)]"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4.5 p-5 sm:p-6">
              {/* Profile Card */}
              <div className="flex items-center justify-between gap-3.5 rounded-lg border p-3.5 !border-[var(--border-subtle)] !bg-[var(--bg-subtle)]/30">
                <div className="flex items-center gap-3">
                  <Avatar name={selectedApplicant.name} size="lg" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold !text-[var(--text-primary)]">
                        {selectedApplicant.name}
                      </span>
                      {selectedApplicant.status === 'accepted' && (
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-bold !bg-[#DCFCE7] !text-[#15803D]">
                          Đã chấp nhận
                        </span>
                      )}
                      {selectedApplicant.status === 'rejected' && (
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-bold !bg-[#FEE2E2] !text-[#B91C1C]">
                          Đã từ chối
                        </span>
                      )}
                      {selectedApplicant.status === 'pending' && (
                        <span className="rounded-full px-2 py-0.5 text-[11px] font-bold !bg-[#FEF3C7] !text-[#B45309]">
                          Chờ xét duyệt
                        </span>
                      )}
                    </div>
                    <div className="text-xs !text-[var(--text-secondary)]">
                      {selectedApplicant.occupation}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs !text-[var(--text-tertiary)]">
                      <span>
                        ★ {selectedApplicant.rating} ({selectedApplicant.ratingCount} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 !border-[var(--border-default)] !bg-[var(--bg-subtle)]/20">
                  <div className="text-[11.5px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                    Vai trò ứng tuyển
                  </div>
                  <div className="mt-1 text-sm font-bold !text-[var(--color-primary-500)]">
                    {selectedApplicant.roleApplied}
                  </div>
                </div>

                <div className="rounded-lg border p-3 !border-[var(--border-default)] !bg-[var(--bg-subtle)]/20">
                  <div className="text-[11.5px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                    Mức lương đề xuất ({selectedApplicant.salaryCycle})
                  </div>
                  <div className="mt-1 text-[15px] font-extrabold !text-[#057642]">
                    {selectedApplicant.bid}{' '}
                    <span className="text-xs font-semibold !text-[var(--text-tertiary)]">
                      / {selectedApplicant.salaryCycle.toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 rounded-lg border p-3 !border-[var(--border-default)] !bg-[var(--bg-subtle)]/20">
                  <div className="text-[11.5px] font-bold tracking-wider uppercase !text-[var(--text-tertiary)]">
                    Thời hạn cam kết hợp tác
                  </div>
                  <div className="mt-1 text-[13.5px] font-semibold !text-[var(--text-primary)]">
                    {selectedApplicant.commitment}
                  </div>
                </div>
              </div>

              {/* CV File Attachment Box */}
              <div>
                <div className="mb-2 text-[13px] font-bold !text-[var(--text-primary)]">
                  Hồ sơ CV đính kèm
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3 !border-[#BAE6FD] !bg-[#F0F9FF]">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg !bg-[#FEE2E2] !text-[#DC2626]">
                      <FilePdfIcon size={24} weight="fill" />
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold !text-[var(--text-primary)]">
                        {selectedApplicant.cvFileName}
                      </div>
                      <div className="text-xs !text-[var(--text-tertiary)]">
                        {selectedApplicant.cvFileSize} · Định dạng PDF chính thức
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedApplicant.cvFileUrl) {
                        window.open(selectedApplicant.cvFileUrl, '_blank')
                      } else {
                        toast.info(`Đang mở file "${selectedApplicant.cvFileName}"...`)
                      }
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors !border-[var(--color-primary-500)] !bg-white !text-[var(--color-primary-500)] hover:!bg-[var(--color-primary-50)]"
                  >
                    <DownloadSimpleIcon size={14} weight="bold" />
                    <span>Tải / Xem CV</span>
                  </button>
                </div>
              </div>

              {/* Candidate Comment / Bio */}
              <div>
                <div className="mb-1.5 text-[13px] font-bold !text-[var(--text-primary)]">
                  Lời nhắn & Giới thiệu giải pháp
                </div>
                <div className="rounded-lg border p-3 text-[13px] leading-relaxed !border-[var(--border-default)] !bg-[var(--bg-subtle)]/30 !text-[var(--text-secondary)]">
                  {selectedApplicant.comment}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t p-4.5 sm:px-6 !border-[var(--border-default)] !bg-[var(--bg-subtle)]/40">
              {selectedApplicant.status === 'pending' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleRejectApplicant(selectedApplicant.id)}
                    className="cursor-pointer rounded-full border px-5 py-2 text-[13.5px] font-bold transition-colors !border-[#C03A2B] !text-[#C03A2B] hover:!bg-[#FEE2E2]"
                  >
                    Từ chối
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAcceptApplicant(selectedApplicant)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-[13.5px] font-bold !text-white shadow-md transition-colors !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
                  >
                    <HandshakeIcon size={16} weight="bold" />
                    <span>Chấp nhận & Soạn hợp đồng</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedApplicant(null)}
                  className="cursor-pointer rounded-full border px-5 py-2 text-[13.5px] font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Close recruitment modal */}
      {closeRecruitConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
        >
          <div className="w-full max-w-[420px] rounded-xl p-7 shadow-2xl !bg-[var(--bg-elevated)]">
            <h3 className="mb-2 text-lg font-bold !text-[var(--text-primary)]">
              Xác nhận đóng tuyển dụng
            </h3>
            <p className="mb-6 text-sm !text-[var(--text-secondary)]">
              Sau khi đóng tuyển dụng, dự án sẽ không nhận thêm ứng viên mới.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCloseRecruitConfirm(false)}
                className="cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCloseAllRecruitment}
                className="cursor-pointer rounded-full px-5 py-2 text-sm font-bold !text-white !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
              >
                Xác nhận đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Detail Modal */}
      {contractDetailMember && (() => {
        const targetContract = contractsData?.data?.find(
          (c) =>
            c.freelancerEmail?.toLowerCase() === contractDetailMember.email?.toLowerCase() ||
            c.id === contractDetailMember.contractId ||
            c.id === contractDetailMember.id,
        )

        return (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
            onClick={() => {
              setContractDetailMember(null)
              setIsEditingContract(false)
            }}
          >
            <div
              className="max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-xl p-7 shadow-2xl !bg-[var(--bg-elevated)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-5 text-xl font-bold !text-[var(--text-primary)]">
                Chi tiết hợp đồng
              </h3>

              {isEditingContract ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                      Lời nhắn / Thỏa thuận bổ sung
                    </label>
                    <textarea
                      value={editContractMsg}
                      onChange={(e) => setEditContractMsg(e.target.value)}
                      rows={3}
                      placeholder="Nhập thông điệp trao đổi hoặc điều khoản bổ sung..."
                      className="w-full rounded border p-2 text-sm outline-none !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] focus:!border-[var(--color-primary-500)]"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold !text-[var(--text-secondary)]">
                      Tài liệu hợp đồng mới (PDF/DOCX)
                    </label>
                    <label className="flex min-h-[90px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded border border-dashed p-4 !border-[var(--border-default)] !bg-[var(--bg-subtle)] hover:!border-[var(--color-primary-500)]">
                      <PaperclipIcon size={20} className="!text-[var(--text-tertiary)]" />
                      <span className="text-xs font-semibold !text-[var(--text-secondary)]">
                        {editContractTermsFile ? editContractTermsFile.name : 'Tải lên file điều khoản mới (thay thế)'}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) setEditContractTermsFile(file)
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 text-sm !text-[var(--text-secondary)]">
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Tiêu đề hợp đồng:{' '}
                    </span>
                    <span className="!text-[var(--text-primary)]">
                      Hợp đồng {contractDetailMember.role || 'thành viên'} - {project.name}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Chủ dự án:{' '}
                    </span>
                    <span className="font-bold !text-[var(--text-primary)]">
                      {project.owner ?? 'Tôi (Chủ dự án)'}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Thông tin Freelancer:{' '}
                    </span>
                    <span className="!text-[var(--text-primary)]">
                      {contractDetailMember.name} ({contractDetailMember.email})
                    </span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Giá trị hợp đồng:{' '}
                    </span>
                    <span className="font-bold !text-[var(--text-primary)]">
                      {contractDetailMember.price}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Chu kỳ:{' '}
                    </span>
                    <span className="!text-[var(--text-primary)]">{project.period || 'Theo dự án'}</span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Hạn trả lương:{' '}
                    </span>
                    <span className="font-bold !text-[var(--color-primary-500)]">
                      {contractDetailMember.salaryDueDate ?? 'Ngày 05 hàng tháng'}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Ngày kết thúc:{' '}
                    </span>
                    <span className="!text-[var(--text-primary)]">
                      {contractDetailMember.dueDate ?? project.dueDate ?? '—'}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      File hợp đồng:{' '}
                    </span>
                    {targetContract?.termsFileUrl ? (
                      <a
                        href={targetContract.termsFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded px-2.5 py-1 text-xs font-bold no-underline transition-colors hover:opacity-80 !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]"
                      >
                        <DownloadSimpleIcon size={14} weight="bold" />
                        <span>Tải tài liệu hợp đồng</span>
                      </a>
                    ) : (
                      <span className="text-xs !text-[var(--text-tertiary)]">Chưa đính kèm file</span>
                    )}
                  </div>
                  <div>
                    <span className="inline-block w-40 font-semibold !text-[var(--text-secondary)]">
                      Trạng thái hợp đồng:{' '}
                    </span>
                    <span className="rounded px-2 py-0.5 text-xs font-bold !bg-[var(--bg-subtle)] !text-[var(--color-primary-500)]">
                      {contractDetailMember.status ?? 'Đang làm'}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setContractDetailMember(null)
                    setIsEditingContract(false)
                  }}
                  className="cursor-pointer rounded-full border px-5 py-2 text-sm font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
                >
                  Đóng
                </button>
                {isEditingContract ? (
                  <button
                    type="button"
                    onClick={handleSaveContract}
                    className="cursor-pointer rounded-full px-5 py-2 text-sm font-bold !text-white !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
                  >
                    Lưu thay đổi
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditContractMsg(targetContract?.message || '')
                      setEditContractTermsFile(null)
                      setIsEditingContract(true)
                    }}
                    className="cursor-pointer rounded-full px-5 py-2 text-sm font-bold !text-white !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Edit Job Role Modal */}
      {editingJobRole && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
          onClick={() => setEditingJobRole(null)}
        >
          <div
            className="w-full max-w-[480px] rounded-xl p-6 shadow-2xl !bg-[var(--bg-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-bold !text-[var(--text-primary)]">
              Chỉnh sửa vị trí tuyển dụng
            </h3>

            <div className="flex flex-col gap-3.5">
              <div>
                <label className="mb-1 block text-xs font-bold !text-[var(--text-secondary)]">
                  Tên vị trí tuyển dụng *
                </label>
                <input
                  type="text"
                  value={roleTitleInput}
                  onChange={(e) => setRoleTitleInput(e.target.value)}
                  className="w-full rounded border p-2 text-sm outline-none !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] focus:!border-[var(--color-primary-500)]"
                  placeholder="VD: Senior React Developer"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold !text-[var(--text-secondary)]">
                  Ngân sách (VNĐ)
                </label>
                <input
                  type="text"
                  value={roleBudgetInput}
                  onChange={(e) => setRoleBudgetInput(e.target.value)}
                  className="w-full rounded border p-2 text-sm outline-none !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] focus:!border-[var(--color-primary-500)]"
                  placeholder="VD: 30000000"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold !text-[var(--text-secondary)]">
                  Mô tả công việc & yêu cầu
                </label>
                <textarea
                  value={roleDescInput}
                  onChange={(e) => setRoleDescInput(e.target.value)}
                  rows={3}
                  className="w-full resize-y rounded border p-2 text-sm outline-none !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] focus:!border-[var(--color-primary-500)]"
                  placeholder="Mô tả trách nhiệm công việc..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingJobRole(null)}
                className="cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="cursor-pointer rounded-full px-5 py-2 text-xs font-bold !text-white !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Confirm Modal */}
      {deletingJobId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
          onClick={() => setDeletingJobId(null)}
        >
          <div
            className="w-full max-w-[420px] rounded-xl p-6 shadow-2xl !bg-[var(--bg-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold !text-[var(--text-primary)]">
              Xóa vị trí tuyển dụng
            </h3>
            <p className="mb-6 text-sm !text-[var(--text-secondary)]">
              Bạn có chắc chắn muốn xóa vị trí này khỏi dự án? Vị trí sẽ bị gỡ bỏ và các hồ sơ ứng tuyển liên quan sẽ bị hủy.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingJobId(null)}
                className="cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteJob}
                className="cursor-pointer rounded-full px-5 py-2 text-xs font-bold !text-white !bg-[#C03A2B] hover:!bg-[#A0281A]"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating & Complete Modal */}
      {ratingTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 !bg-[var(--bg-overlay)]"
          onClick={() => setRatingTarget(null)}
        >
          <div
            className="w-full max-w-[440px] rounded-xl p-6 shadow-2xl !bg-[var(--bg-elevated)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-bold !text-[var(--text-primary)]">
              Nghiệm thu & Đánh giá thành viên
            </h3>
            <p className="mb-4 text-xs !text-[var(--text-secondary)]">
              Đánh giá chất lượng làm việc của {members.find((m) => m.email === ratingTarget)?.name}
            </p>

            {/* Stars */}
            <div className="mb-4 flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingStars(star)}
                  className="cursor-pointer p-1 text-2xl transition-transform hover:scale-110"
                >
                  <StarIcon
                    size={28}
                    weight={star <= ratingStars ? 'fill' : 'regular'}
                    className={
                      star <= ratingStars ? '!text-[#F5A623]' : '!text-[var(--text-tertiary)]'
                    }
                  />
                </button>
              ))}
            </div>

            {/* On time checkbox */}
            <label className="mb-4 flex cursor-pointer items-center gap-2 text-xs font-semibold !text-[var(--text-primary)]">
              <input
                type="checkbox"
                checked={ratingOnTime}
                onChange={(e) => setRatingOnTime(e.target.checked)}
                className="h-4 w-4 rounded accent-[#0A66C2]"
              />
              <span>Hoàn thành đúng tiến độ & cam kết</span>
            </label>

            {/* Comment */}
            <textarea
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              placeholder="Nhận xét chi tiết về kỹ năng, thái độ hợp tác..."
              className="mb-5 min-h-[80px] w-full resize-y rounded border p-2.5 text-xs outline-none !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-primary)] focus:!border-[var(--color-primary-500)]"
            />

            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRatingTarget(null)}
                className="cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold !border-[var(--border-default)] !text-[var(--text-secondary)] hover:!bg-[var(--bg-subtle)]"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetMember = members.find((m) => m.email === ratingTarget)
                  const targetContract = contractsData?.data?.find(
                    (c) => c.freelancerEmail?.toLowerCase() === ratingTarget?.toLowerCase(),
                  )
                  if (targetContract) {
                    try {
                      await completeContractMutation.mutateAsync({
                        contractId: targetContract.id,
                        payload: { rating: ratingStars, comment: ratingComment },
                      })
                    } catch {
                      // Handled gracefully
                    }
                  }
                  setMembers((prev) => prev.filter((m) => m.email !== ratingTarget))
                  setRatingTarget(null)
                  toast.success(
                    `Hợp đồng với ${targetMember?.name} đã hoàn thành. Cảm ơn bạn đã đánh giá!`,
                  )
                }}
                className="cursor-pointer rounded-full px-5 py-2 text-xs font-bold !text-white !bg-[#44712E] hover:!bg-[#365A24]"
              >
                Xác nhận hoàn thành
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelTarget && (
        <CancelModal
          title={cancelTarget === 'project' ? 'Hủy dự án' : 'Hủy hợp đồng'}
          subtitle={
            cancelTarget === 'project'
              ? `Dự án: ${project.name}`
              : `Thành viên: ${cancelMember?.name ?? cancelTarget}`
          }
          onClose={() => setCancelTarget(null)}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* Edit Project Modal */}
      {isEditingProject && (
        <EditProjectModal
          open={isEditingProject}
          onClose={() => setIsEditingProject(false)}
          project={project}
          onSave={async (payload) => {
            if (onUpdateProject) {
              await onUpdateProject(project.id, payload)
            }
          }}
        />
      )}
    </div>
  )
}
