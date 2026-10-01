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
import {
  PendingProjectCard,
  ProjectInvitationModal,
  ProjectListCard,
  useProjects,
} from '@/features/projects'
import type {
  CreateContractFormData,
  CreateProjectFormData,
  MyProject,
  PendingProject,
  ProjectMember,
} from '@/features/projects'
import {
  CreateContractPage,
  CreateProjectPage,
  EmployeeProjectDetailPage,
  MyProjectDetailPage,
} from './components'

export interface WorkspacePageProps {
  onExploreJobs?: () => void
  onViewProfile?: (name: string) => void
}

export function WorkspacePage({ onExploreJobs, onViewProfile }: WorkspacePageProps = {}) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    myProjects,
    employeeProjects,
    pending,
    isLoading,
    createProject,
    createContract,
    cancelMyProject,
    cancelEmployeeProject,
    updateMyProjectMembers,
    acceptInvitation,
    rejectInvitation,
  } = useProjects()

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

  const handleAcceptInvitation = async (proj: PendingProject) => {
    try {
      await acceptInvitation(proj)
      setSelectedInvitation(null)
      toast.success(
        `Chúc mừng! Bạn đã tham gia dự án "${proj.name}" với vai trò ${proj.invitedRole}.`,
      )
    } catch {
      toast.error('Có lỗi xảy ra khi chấp nhận lời mời.')
    }
  }

  const handleRejectInvitation = async (proj: PendingProject) => {
    try {
      await rejectInvitation(proj.id)
      setSelectedInvitation(null)
      toast.info(`Đã từ chối lời mời tham gia dự án "${proj.name}".`)
    } catch {
      toast.error('Có lỗi xảy ra khi từ chối lời mời.')
    }
  }

  const handleCancelEmployeeProject = async (projectId: number, reason?: string) => {
    try {
      const proj = employeeProjects.find((p) => p.id === projectId)
      await cancelEmployeeProject({ projectId, reason })
      setSearchParams({}, { replace: true })
      toast.info(`Đã hủy hợp đồng tham gia dự án "${proj?.name || ''}".`)
    } catch {
      toast.error('Có lỗi xảy ra khi hủy hợp đồng.')
    }
  }

  const handleCancelMyProject = async (projectId: number, reason?: string) => {
    try {
      const proj = myProjects.find((p) => p.id === projectId)
      await cancelMyProject({ projectId, reason })
      setSearchParams({}, { replace: true })
      toast.info(`Đã hủy dự án "${proj?.name || ''}".`)
    } catch {
      toast.error('Có lỗi xảy ra khi hủy dự án.')
    }
  }

  const handleUpdateMyProjectMembers = async (
    projectId: number,
    updatedMembers: ProjectMember[],
  ) => {
    try {
      await updateMyProjectMembers({ projectId, members: updatedMembers })
    } catch {
      toast.error('Có lỗi xảy ra khi cập nhật thành viên.')
    }
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

  const handleCreateProject = async (formData: CreateProjectFormData) => {
    try {
      await createProject(formData)
      setSearchParams({}, { replace: true })
      toast.success(`Dự án "${formData.name}" đã được tạo thành công!`)
    } catch {
      toast.error('Có lỗi xảy ra khi tạo dự án.')
    }
  }

  const handleCreateContract = async (formData: CreateContractFormData) => {
    try {
      await createContract(formData)
      setContractContext(null)
      setSearchParams({}, { replace: true })
      toast.success(
        `Hợp đồng vị trí "${formData.roleTitle || formData.role}" đã được gửi tới ứng viên ${
          formData.candidateName || formData.candidateEmail || formData.freelancerEmail
        } thành công!`,
      )
    } catch {
      toast.error('Có lỗi xảy ra khi tạo hợp đồng.')
    }
  }

  // 1. Sub-page: Create project
  if (subPage === 'create-project') {
    return <CreateProjectPage onBack={handleBack} onSubmit={handleCreateProject} />
  }

  // 2. Sub-page: Create contract
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

  // 3. Sub-page: My Project Detail (Employer View)
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

  // 4. Sub-page: Employee Project Detail (Freelancer View)
  if (viewingEmpProject) {
    return (
      <EmployeeProjectDetailPage
        project={viewingEmpProject}
        onBack={handleBack}
        onCancelContract={handleCancelEmployeeProject}
      />
    )
  }

  // 5. Main Workspace Dashboard
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

      {/* Loading state */}
      {isLoading && (
        <div className="py-16 text-center text-sm !text-[var(--text-secondary)]">
          Đang tải dữ liệu dự án...
        </div>
      )}

      {/* Content Rendering */}
      {!isLoading && activeTab === 'all' && (
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

      {!isLoading && activeTab === 'owner' && (
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

      {!isLoading && activeTab === 'participant' && (
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

      {!isLoading && activeTab === 'pending' && (
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

export default WorkspacePage
