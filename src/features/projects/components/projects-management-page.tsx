import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BriefcaseMetalIcon,
  ClockIcon,
  FileTextIcon,
  FolderPlusIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react'
import { toast } from '@/components/feedback'
import type { MyProject, PendingProject, ProjectMember } from '../types'
import {
  EMPLOYEE_PROJECTS_DATA,
  MY_PROJECTS_DATA,
  PENDING_PROJECTS_DATA,
} from '@/features/mock-data'
import { ProjectListCard } from './project-list-card'
import { PendingProjectCard } from './pending-project-card'
import { ProjectInvitationModal } from './project-invitation-modal'
import { MyProjectDetailPage } from './my-project-detail-page'
import { EmployeeProjectDetailPage } from './employee-project-detail-page'
import { CreateProjectPage, type CreateProjectFormData } from './create-project-page'
import { CreateContractPage, type CreateContractFormData } from './create-contract-page'

interface ProjectsManagementPageProps {
  onSelectContract?: (c: unknown) => void
  onViewProfile?: (name?: string) => void
  onExploreJobs?: () => void
  projects?: MyProject[]
  setProjects?: React.Dispatch<React.SetStateAction<MyProject[]>>
  employeeProjects?: MyProject[]
  setEmployeeProjects?: React.Dispatch<React.SetStateAction<MyProject[]>>
  pending?: PendingProject[]
  setPending?: React.Dispatch<React.SetStateAction<PendingProject[]>>
}

export function ProjectsManagementPage({
  onViewProfile,
  onExploreJobs,
  projects: externalMyProjects,
  setProjects: externalSetMyProjects,
  employeeProjects: externalEmployeeProjects,
  setEmployeeProjects: externalSetEmployeeProjects,
  pending: externalPending,
  setPending: externalSetPending,
}: ProjectsManagementPageProps) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [localMyProjects, setLocalMyProjects] = useState<MyProject[]>(MY_PROJECTS_DATA)
  const [localEmployeeProjects, setLocalEmployeeProjects] =
    useState<MyProject[]>(EMPLOYEE_PROJECTS_DATA)
  const [localPending, setLocalPending] = useState<PendingProject[]>(PENDING_PROJECTS_DATA)

  const myProjects = externalMyProjects ?? localMyProjects
  const setMyProjects = externalSetMyProjects ?? setLocalMyProjects
  const employeeProjects = externalEmployeeProjects ?? localEmployeeProjects
  const setEmployeeProjects = externalSetEmployeeProjects ?? setLocalEmployeeProjects
  const pending = externalPending ?? localPending
  const setPending = externalSetPending ?? setLocalPending

  const [selectedInvitation, setSelectedInvitation] = useState<PendingProject | null>(null)
  const [contractContext, setContractContext] = useState<{
    mode?: 'create' | 'invite'
    initialProject?: string
    initialRole?: string
    initialCandidateName?: string
    initialCandidateEmail?: string
    initialBidValue?: string
    initialJobDescription?: string
  } | null>(null)

  const subPage = searchParams.get('sub')
  const myProjectId = searchParams.get('project')
  const empProjectId = searchParams.get('contract')

  const viewingMyProject = myProjectId
    ? (myProjects.find((p) => p.id === Number(myProjectId)) ?? null)
    : null
  const viewingEmpProject = empProjectId
    ? (employeeProjects.find((p) => p.id === Number(empProjectId)) ?? null)
    : null

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      setSearchParams({})
    }
  }

  const openCreateProject = () => {
    setSearchParams({ sub: 'create-project' })
  }

  const openCreateContract = (ctx?: typeof contractContext) => {
    if (ctx) setContractContext(ctx)
    setSearchParams({ sub: 'create-contract' })
  }

  const openMyProject = (p: MyProject) => {
    setSearchParams({ project: String(p.id) })
  }

  const openEmpProject = (p: MyProject) => {
    setSearchParams({ contract: String(p.id) })
  }

  const [activeTab, setActiveTab] = useState<'all' | 'owner' | 'participant' | 'pending'>('all')
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleAcceptInvitation = (proj: PendingProject) => {
    setPending((prev) => prev.filter((p) => p.id !== proj.id))
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
    setEmployeeProjects((prev) => [newProject, ...prev])
    setSelectedInvitation(null)
    toast.success(
      `Chúc mừng! Bạn đã tham gia dự án "${proj.name}" với vai trò ${proj.invitedRole}.`,
    )
  }

  const handleRejectInvitation = (proj: PendingProject) => {
    setPending((prev) => prev.filter((p) => p.id !== proj.id))
    setSelectedInvitation(null)
    toast.info(`Đã từ chối lời mời tham gia dự án "${proj.name}".`)
  }

  const handleCancelEmployeeProject = (projectId: number, _reason?: string) => {
    const proj = employeeProjects.find((p) => p.id === projectId)
    setEmployeeProjects((prev) => prev.filter((p) => p.id !== projectId))
    setSearchParams({}, { replace: true })
    toast.info(`Đã hủy hợp đồng tham gia dự án "${proj?.name || ''}".`)
  }

  const handleCancelMyProject = (projectId: number, _reason?: string) => {
    const proj = myProjects.find((p) => p.id === projectId)
    setMyProjects((prev) => prev.filter((p) => p.id !== projectId))
    setSearchParams({}, { replace: true })
    toast.info(`Đã hủy dự án "${proj?.name || ''}".`)
  }

  const handleUpdateMyProjectMembers = (projectId: number, updatedMembers: ProjectMember[]) => {
    setMyProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, members: updatedMembers } : p)),
    )
  }

  const filteredMyProjects = myProjects.filter((p) => {
    if (!searchKeyword.trim()) return true
    const kw = searchKeyword.toLowerCase()
    return (
      p.name.toLowerCase().includes(kw) ||
      p.members.some((m) => m.name.toLowerCase().includes(kw) || m.email.toLowerCase().includes(kw))
    )
  })

  const filteredEmpProjects = employeeProjects.filter((p) => {
    if (!searchKeyword.trim()) return true
    const kw = searchKeyword.toLowerCase()
    return (
      p.name.toLowerCase().includes(kw) ||
      (p.owner && p.owner.toLowerCase().includes(kw)) ||
      p.members.some((m) => m.name.toLowerCase().includes(kw))
    )
  })

  const filteredPending = pending.filter((p) => {
    if (!searchKeyword.trim()) return true
    const kw = searchKeyword.toLowerCase()
    return (
      p.name.toLowerCase().includes(kw) ||
      p.owner.toLowerCase().includes(kw) ||
      (p.invitedRole && p.invitedRole.toLowerCase().includes(kw))
    )
  })

  const handleCreateProject = (formData: CreateProjectFormData) => {
    const newProject: MyProject = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      owner: 'Tôi (Chủ dự án)',
      period: formData.period || 'Hàng tháng',
      dueDate: formData.dueDate || '2026-12-31',
      tags: formData.tags.length > 0 ? formData.tags : ['Dự án mới', 'Công nghệ'],
      members: [],
      recruitingRoles: formData.tags.map((tag, idx) => ({
        id: `role-${Date.now()}-${idx}`,
        title: tag.includes('Developer') || tag.includes('Design') ? tag : `${tag} Specialist`,
        skills: [tag],
        salaryRange: formData.startPrice
          ? `${Number(formData.startPrice.replace(/[^0-9]/g, '') || '0').toLocaleString('vi-VN')} ₫`
          : '15.000.000 - 25.000.000 ₫',
        slotsTotal: 1,
        slotsFilled: 0,
        status: 'recruiting' as const,
      })),
    }

    setMyProjects((prev) => [newProject, ...prev])
    setSearchParams({}, { replace: true })
    setActiveTab('owner')
    toast.success(`Dự án "${formData.name}" đã được tạo thành công!`)
  }

  const handleCreateContract = (contractData: CreateContractFormData) => {
    const candidateName =
      contractData.candidateName ||
      (contractData.freelancerEmail.includes('@')
        ? contractData.freelancerEmail
            .split('@')[0]
            .split(/[._-]/)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ')
        : contractData.freelancerEmail)

    const formattedPrice = contractData.value
      ? contractData.value.includes('₫')
        ? contractData.value
        : `${Number(contractData.value.replace(/[^0-9]/g, '') || '0').toLocaleString('vi-VN')} ₫`
      : '15.000.000 ₫'

    const newMember: ProjectMember = {
      name: candidateName,
      email: contractData.freelancerEmail,
      price: formattedPrice,
      dueDate: contractData.endDate || '2026-12-31',
      salaryDueDate:
        contractData.period === 'Hàng tháng' ? 'Ngày 05 hàng tháng' : contractData.period,
      role: contractData.role,
      status: 'Đang làm',
    }

    const targetProjectName =
      contractData.project ||
      (contractData.title.includes('—') ? contractData.title.split('—')[1].trim() : '')

    const existingProject = myProjects.find(
      (p) =>
        p.name.toLowerCase() === targetProjectName.toLowerCase() ||
        (targetProjectName && p.name.toLowerCase().includes(targetProjectName.toLowerCase())),
    )

    if (existingProject) {
      setMyProjects((prev) =>
        prev.map((p) => {
          if (p.id === existingProject.id) {
            const updatedRoles = p.recruitingRoles?.map((r) =>
              r.title.toLowerCase() === contractData.role.toLowerCase()
                ? {
                    ...r,
                    slotsFilled: (r.slotsFilled || 0) + 1,
                    status:
                      (r.slotsTotal || 1) <= (r.slotsFilled || 0) + 1
                        ? ('filled' as const)
                        : ('recruiting' as const),
                    assignedMemberName: candidateName,
                  }
                : r,
            )
            return {
              ...p,
              members: [newMember, ...p.members.filter((m) => m.email !== newMember.email)],
              recruitingRoles: updatedRoles,
            }
          }
          return p
        }),
      )
    } else {
      const newProj: MyProject = {
        id: Date.now(),
        name: targetProjectName || 'Dự án hợp đồng mới',
        description: `Dự án được khởi tạo theo hợp đồng: ${contractData.title}`,
        owner: 'Tôi (Chủ dự án)',
        period: contractData.period || 'Hàng tháng',
        dueDate: contractData.endDate || '2026-12-31',
        tags: [contractData.role, 'Hợp đồng'],
        members: [newMember],
        recruitingRoles: [
          {
            id: `role-${Date.now()}`,
            title: contractData.role,
            skills: [contractData.role],
            salaryRange: formattedPrice,
            slotsTotal: 1,
            slotsFilled: 1,
            status: 'filled' as const,
            assignedMemberName: candidateName,
          },
        ],
      }
      setMyProjects((prev) => [newProj, ...prev])
    }

    const isCurrentUser =
      contractData.freelancerEmail.toLowerCase().includes('khoa') ||
      contractData.freelancerEmail.toLowerCase().includes('toi')
    if (isCurrentUser) {
      const empProj: MyProject = {
        id: Date.now() + 1,
        name: targetProjectName || 'Dự án hợp đồng mới',
        description: contractData.title,
        owner: 'Đối tác tuyển dụng',
        period: contractData.period || 'Hàng tháng',
        dueDate: contractData.endDate || '2026-12-31',
        tags: [contractData.role],
        members: [newMember],
      }
      setEmployeeProjects((prev) => [empProj, ...prev])
    }

    setSearchParams({}, { replace: true })
    setContractContext(null)
    setActiveTab('owner')
    toast.success(`Hợp đồng "${contractData.title}" đã được tạo và gửi lời mời thành công!`)
  }

  // Subpage views
  if (subPage === 'create-project') {
    return <CreateProjectPage onBack={handleBack} onSubmit={handleCreateProject} />
  }

  if (subPage === 'create-contract') {
    return (
      <CreateContractPage
        onBack={() => {
          setContractContext(null)
          handleBack()
        }}
        mode={contractContext?.mode ?? 'create'}
        initialProject={contractContext?.initialProject}
        initialRole={contractContext?.initialRole}
        initialCandidateName={contractContext?.initialCandidateName}
        initialCandidateEmail={contractContext?.initialCandidateEmail}
        initialBidValue={contractContext?.initialBidValue}
        initialJobDescription={contractContext?.initialJobDescription}
        projects={myProjects}
        onSubmit={handleCreateContract}
      />
    )
  }

  if (viewingMyProject) {
    return (
      <MyProjectDetailPage
        project={viewingMyProject}
        onBack={handleBack}
        onCancelProject={handleCancelMyProject}
        onUpdateMembers={handleUpdateMyProjectMembers}
        onCreateContract={(
          roleTitle,
          candidateName,
          bidValue,
          candidateEmail,
          jobDescription,
          mode,
        ) => {
          openCreateContract({
            mode: mode ?? 'create',
            initialProject: viewingMyProject.name,
            initialRole: roleTitle,
            initialCandidateName: candidateName,
            initialCandidateEmail: candidateEmail,
            initialBidValue: bidValue,
            initialJobDescription: jobDescription,
          })
        }}
      />
    )
  }

  if (viewingEmpProject) {
    return (
      <EmployeeProjectDetailPage
        project={viewingEmpProject}
        onBack={handleBack}
        onCancelContract={handleCancelEmployeeProject}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-7">
      {/* Page Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight !text-[var(--text-primary)]">
            Quản lý dự án & Hợp đồng
          </h1>
          <p className="mt-1 text-xs !text-[var(--text-secondary)]">
            Theo dõi tiến độ bàn giao, kiểm soát các mốc thanh toán và điều phối nhân sự
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => openCreateContract()}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-bold transition-all !bg-[var(--bg-elevated)] !border-[#10B981] !text-[#057642] hover:!bg-[#ECFDF5]"
          >
            <FileTextIcon size={16} weight="bold" />
            <span>+ Soạn hợp đồng</span>
          </button>

          <button
            type="button"
            onClick={openCreateProject}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-5 py-2 text-xs font-bold !text-white shadow-sm transition-all !bg-[var(--color-primary-500)] hover:!bg-[var(--color-primary-600)]"
          >
            <FolderPlusIcon size={16} weight="bold" />
            <span>+ Tạo dự án mới</span>
          </button>
        </div>
      </div>

      {/* 3 Metrics Top Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Metric 1 */}
        <div
          onClick={() => setActiveTab(activeTab === 'owner' ? 'all' : 'owner')}
          className={`flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all !bg-[var(--bg-elevated)] ${
            activeTab === 'owner'
              ? 'border-2 !border-[var(--color-primary-500)] shadow-sm'
              : '!border-[var(--border-default)] hover:!bg-[var(--bg-subtle)]'
          }`}
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl !bg-[var(--color-primary-50)] !text-[var(--color-primary-500)]">
            <FolderPlusIcon size={24} weight="bold" />
          </div>
          <div>
            <div className="text-2xl font-extrabold leading-tight !text-[var(--text-primary)]">
              {myProjects.length}
            </div>
            <div className="mt-0.5 text-xs font-bold !text-[var(--text-primary)]">
              Dự án tôi quản lý
            </div>
            <div className="text-[11px] !text-[var(--text-tertiary)]">Đang làm chủ & điều phối</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => setActiveTab(activeTab === 'participant' ? 'all' : 'participant')}
          className={`flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all !bg-[var(--bg-elevated)] ${
            activeTab === 'participant'
              ? 'border-2 !border-[#059669] shadow-sm'
              : '!border-[var(--border-default)] hover:!bg-[var(--bg-subtle)]'
          }`}
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl !bg-[#ECFDF5] !text-[#059669]">
            <BriefcaseMetalIcon size={24} weight="bold" />
          </div>
          <div>
            <div className="text-2xl font-extrabold leading-tight !text-[var(--text-primary)]">
              {employeeProjects.length}
            </div>
            <div className="mt-0.5 text-xs font-bold !text-[var(--text-primary)]">
              Dự án tôi tham gia
            </div>
            <div className="text-[11px] !text-[var(--text-tertiary)]">Thực hiện theo hợp đồng</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => setActiveTab(activeTab === 'pending' ? 'all' : 'pending')}
          className={`flex cursor-pointer items-center gap-4 rounded-xl border p-5 transition-all !bg-[var(--bg-elevated)] ${
            activeTab === 'pending'
              ? 'border-2 !border-[#D97706] shadow-sm'
              : '!border-[var(--border-default)] hover:!bg-[var(--bg-subtle)]'
          }`}
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl !bg-[#FFFBEB] !text-[#D97706]">
            <ClockIcon size={24} weight="bold" />
          </div>
          <div>
            <div className="text-2xl font-extrabold leading-tight !text-[var(--text-primary)]">
              {pending.length}
            </div>
            <div className="mt-0.5 text-xs font-bold !text-[var(--text-primary)]">Chờ xác nhận</div>
            <div className="text-[11px] !text-[var(--text-tertiary)]">
              Đề xuất & lời mời cần duyệt
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-3 rounded-lg border p-2.5 sm:px-4 !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-sm">
        <MagnifyingGlassIcon
          size={18}
          weight="bold"
          className="flex-shrink-0 !text-[var(--text-tertiary)]"
        />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Tìm kiếm dự án theo tên dự án, thành viên hoặc chủ dự án..."
          className="w-full bg-transparent text-xs !text-[var(--text-primary)] outline-none"
        />
        {searchKeyword && (
          <button
            type="button"
            onClick={() => setSearchKeyword('')}
            className="cursor-pointer p-0.5 !text-[var(--text-tertiary)] hover:!text-[var(--text-primary)]"
          >
            <XIcon size={15} weight="bold" />
          </button>
        )}
      </div>

      {/* Filter Tabs Bar */}
      <div className="mb-5 inline-flex items-center gap-1 rounded-lg border p-1 !border-[var(--border-default)] !bg-[var(--bg-subtle)]">
        {[
          {
            id: 'all',
            label: `Tất cả (${
              filteredMyProjects.length + filteredEmpProjects.length + filteredPending.length
            })`,
          },
          {
            id: 'owner',
            label: `Dự án của tôi (${filteredMyProjects.length})`,
          },
          {
            id: 'participant',
            label: `Dự án tham gia (${filteredEmpProjects.length})`,
          },
          {
            id: 'pending',
            label: `Chờ xử lý (${filteredPending.length})`,
          },
        ].map(({ id, label }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isActive
                  ? '!bg-[var(--bg-elevated)] !text-[var(--color-primary-500)] shadow-sm font-bold'
                  : '!text-[var(--text-secondary)] hover:!text-[var(--text-primary)]'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Content Rendering */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_400px]">
          {/* Left Column: Projects */}
          <div className="space-y-4">
            <ProjectListCard
              title="Các dự án của tôi"
              projects={filteredMyProjects}
              emptyText={
                searchKeyword
                  ? 'Không tìm thấy dự án của tôi khớp với từ khóa.'
                  : 'Bạn chưa có dự án nào do bạn làm chủ.'
              }
              onSelect={openMyProject}
              hidePeriod={true}
            />
            <ProjectListCard
              title="Các dự án tôi đang thực hiện"
              projects={filteredEmpProjects}
              emptyText={
                searchKeyword
                  ? 'Không tìm thấy dự án tham gia khớp với từ khóa.'
                  : 'Bạn chưa tham gia dự án nào.'
              }
              onSelect={openEmpProject}
            />
          </div>

          {/* Right Column: Pending & Quick shortcuts */}
          <div className="space-y-4">
            <PendingProjectCard
              pending={filteredPending}
              onAccept={handleAcceptInvitation}
              onReject={handleRejectInvitation}
              onViewDetail={(p) => setSelectedInvitation(p)}
            />

            {/* Quick Action Shortcuts Card */}
            <div className="rounded-lg border p-4 sm:px-5 !border-[var(--border-default)] !bg-[var(--bg-elevated)] shadow-sm">
              <h4 className="mb-2 text-xs font-bold !text-[var(--text-primary)]">
                Mở rộng dự án của bạn
              </h4>
              <button
                type="button"
                onClick={() => {
                  if (onExploreJobs) {
                    onExploreJobs()
                  } else {
                    navigate('/not-found')
                  }
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border p-2.5 text-left text-xs font-semibold transition-colors !border-[var(--border-default)] !bg-[var(--bg-subtle)] !text-[var(--text-primary)] hover:!bg-[var(--bg-base)]"
              >
                <MagnifyingGlassIcon size={16} weight="bold" />
                <span>Tìm kiếm cơ hội việc làm mới</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'owner' && (
        <div className="max-w-3xl">
          <ProjectListCard
            title="Các dự án của tôi"
            projects={filteredMyProjects}
            emptyText={
              searchKeyword
                ? 'Không tìm thấy dự án khớp với từ khóa tìm kiếm.'
                : 'Bạn chưa có dự án nào.'
            }
            onSelect={openMyProject}
            hidePeriod={true}
          />
        </div>
      )}

      {activeTab === 'participant' && (
        <div className="max-w-3xl">
          <ProjectListCard
            title="Các dự án tôi đang thực hiện"
            projects={filteredEmpProjects}
            emptyText={
              searchKeyword
                ? 'Không tìm thấy dự án khớp với từ khóa tìm kiếm.'
                : 'Bạn chưa tham gia dự án nào.'
            }
            onSelect={openEmpProject}
          />
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="max-w-3xl space-y-4">
          <PendingProjectCard
            pending={filteredPending}
            onAccept={handleAcceptInvitation}
            onReject={handleRejectInvitation}
            onViewDetail={(p) => setSelectedInvitation(p)}
          />
          {filteredPending.length === 0 && (
            <div className="rounded-lg border p-8 text-center text-xs !border-[var(--border-default)] !bg-[var(--bg-elevated)] !text-[var(--text-tertiary)]">
              {searchKeyword
                ? 'Không tìm thấy lời mời hoặc đề xuất nào khớp với từ khóa.'
                : 'Hiện tại không có lời mời hoặc đề xuất nào đang chờ duyệt.'}
            </div>
          )}
        </div>
      )}

      {/* Project Invitation Details Modal */}
      {selectedInvitation && (
        <ProjectInvitationModal
          project={selectedInvitation}
          onClose={() => setSelectedInvitation(null)}
          onAccept={handleAcceptInvitation}
          onReject={handleRejectInvitation}
          onOpenChat={(owner) => toast.info(`Đang mở cửa sổ trò chuyện với ${owner}...`)}
          onViewProfile={(ownerName) => {
            setSelectedInvitation(null)
            if (onViewProfile) {
              onViewProfile(ownerName)
            } else {
              navigate('/not-found')
            }
          }}
        />
      )}
    </div>
  )
}
