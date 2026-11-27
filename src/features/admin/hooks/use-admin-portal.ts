import { useState, useMemo, useCallback, useEffect } from 'react'
import { toast } from '@/components/feedback'
import { ApiError } from '@/types'
import type {
  AdminUser,
  AdminProject,
  AdminContract,
  AdminViolation,
  AdminTabId,
  EntityId,
} from '../types'
import {
  getAdminUsers,
  getAdminUserDetail,
  deleteAdminUser,
  lockAdminUser,
  unlockAdminUser,
  getAdminProjects,
  getAdminProjectDetail,
  closeAdminProject,
  getAdminReports,
  getAdminReportDetail,
  updateAdminReportStatus,
  toAdminUser,
  toAdminProject,
  toAdminViolation,
  normalizeModerationReason,
  type BackendReportStatus,
} from '../api'

const ROWS_PER_PAGE = 8

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.message) {
    return error.message
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export function useAdminPortal(initialTab: AdminTabId = 'users') {
  // Navigation
  const [activeNav, setActiveNavState] = useState<AdminTabId>(initialTab)

  // ── 1. USERS DOMAIN ─────────────────────────────────────────────────────────
  const [users, setUsers] = useState<AdminUser[]>([])
  const [userSearch, setUserSearchState] = useState('')
  const [userStatusFilter, setUserStatusFilterState] = useState('Tất cả')
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [userDetailModal, setUserDetailModal] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [lockTarget, setLockTarget] = useState<AdminUser | null>(null)
  const [lockReason, setLockReason] = useState('')
  const [isSubmittingUserAction, setIsSubmittingUserAction] = useState(false)

  // Load real users from backend API
  useEffect(() => {
    let isMounted = true
    const fetchUsers = async () => {
      try {
        let statusParam: string | undefined = undefined
        if (userStatusFilter === 'Hoạt động') statusParam = 'ACTIVE'
        if (userStatusFilter === 'Bị khóa') statusParam = 'BANNED'
        if (userStatusFilter === 'Đã xóa') statusParam = 'DELETED'

        const res = await getAdminUsers({
          keyword: userSearch.trim() || undefined,
          status: statusParam,
        })
        if (isMounted && Array.isArray(res.data)) {
          setUsers(res.data.map((u) => toAdminUser(u)))
        }
      } catch {
        // Fallback gracefully when unauthenticated or offline
      }
    }
    fetchUsers()
    return () => {
      isMounted = false
    }
  }, [userSearch, userStatusFilter])

  const setActiveNav = useCallback((tab: AdminTabId) => {
    setActiveNavState(tab)
    setUserCurrentPage(1)
  }, [])

  const setUserSearch = useCallback((val: string) => {
    setUserSearchState(val)
    setUserCurrentPage(1)
  }, [])

  const setUserStatusFilter = useCallback((val: string) => {
    setUserStatusFilterState(val)
    setUserCurrentPage(1)
  }, [])

  const flaggedUsersCount = useMemo(
    () =>
      users.filter((u) => u.status === 'Bị gắn cờ' || (u.status as string) === 'FLAGGED').length,
    [users],
  )
  const activeUsersCount = useMemo(
    () => users.filter((u) => u.status === 'Hoạt động' || (u.status as string) === 'ACTIVE').length,
    [users],
  )
  const lockedUsersCount = useMemo(
    () =>
      users.filter(
        (u) =>
          u.status === 'Bị khóa' ||
          u.rawStatus === 'BANNED' ||
          (u.status as string) === 'SUSPENDED' ||
          (u.status as string) === 'BANNED',
      ).length,
    [users],
  )
  const deletedUsersCount = useMemo(
    () =>
      users.filter(
        (u) =>
          u.status === 'Đã xóa' || u.rawStatus === 'DELETED' || (u.status as string) === 'DELETED',
      ).length,
    [users],
  )

  const handleOpenLockUser = useCallback((user: AdminUser) => {
    setLockTarget(user)
    setLockReason('')
  }, [])

  const handleConfirmLockUser = useCallback(async () => {
    if (!lockTarget || isSubmittingUserAction) return
    const targetId = String(lockTarget.id)
    const normalizedReason = normalizeModerationReason(lockReason)

    setIsSubmittingUserAction(true)
    try {
      const res = await lockAdminUser(targetId, normalizedReason)
      const mapped = toAdminUser(res.data)
      setUsers((prev) => prev.map((u) => (String(u.id) === targetId ? { ...u, ...mapped } : u)))
      setUserDetailModal((prev) =>
        prev && String(prev.id) === targetId
          ? {
              ...prev,
              status: mapped.status,
              rawStatus: mapped.rawStatus,
              statusReason: mapped.statusReason,
            }
          : prev,
      )
      setLockTarget(null)
      setLockReason('')
      toast.success('Đã khóa tài khoản thành công!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể khóa tài khoản. Vui lòng thử lại.'))
    } finally {
      setIsSubmittingUserAction(false)
    }
  }, [lockTarget, lockReason, isSubmittingUserAction])

  const handleUnlockUser = useCallback(
    async (id: EntityId) => {
      if (isSubmittingUserAction) return
      const targetId = String(id)

      setIsSubmittingUserAction(true)
      try {
        const res = await unlockAdminUser(targetId)
        const mapped = toAdminUser(res.data)
        setUsers((prev) => prev.map((u) => (String(u.id) === targetId ? { ...u, ...mapped } : u)))
        setUserDetailModal((prev) =>
          prev && String(prev.id) === targetId
            ? {
                ...prev,
                status: mapped.status,
                rawStatus: mapped.rawStatus,
                statusReason: null,
              }
            : prev,
        )
        toast.success('Đã mở khóa tài khoản thành công!')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Không thể mở khóa tài khoản. Vui lòng thử lại.'))
      } finally {
        setIsSubmittingUserAction(false)
      }
    },
    [isSubmittingUserAction],
  )

  const handleConfirmDeleteUser = useCallback(async () => {
    if (!deleteTarget || isSubmittingUserAction) return
    const targetId = String(deleteTarget.id)
    const normalizedReason = normalizeModerationReason(deleteReason)

    setIsSubmittingUserAction(true)
    try {
      await deleteAdminUser(targetId, normalizedReason)
      const deletedAtIso = new Date().toISOString()

      setUsers((prev) =>
        prev.map((u) =>
          String(u.id) === targetId
            ? {
                ...u,
                status: 'Đã xóa',
                rawStatus: 'DELETED',
                statusReason: normalizedReason,
                deletedAt: deletedAtIso,
              }
            : u,
        ),
      )
      setUserDetailModal((prev) =>
        prev && String(prev.id) === targetId
          ? {
              ...prev,
              status: 'Đã xóa',
              rawStatus: 'DELETED',
              statusReason: normalizedReason,
              deletedAt: deletedAtIso,
            }
          : prev,
      )
      setDeleteTarget(null)
      setDeleteReason('')
      toast.success('Đã xóa tài khoản thành công!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể xóa tài khoản. Vui lòng thử lại.'))
    } finally {
      setIsSubmittingUserAction(false)
    }
  }, [deleteTarget, deleteReason, isSubmittingUserAction])

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim()
    return users.filter((u) => {
      const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchStatus =
        userStatusFilter === 'Tất cả' ||
        u.status === userStatusFilter ||
        (userStatusFilter === 'Hoạt động' && (u.status as string) === 'ACTIVE') ||
        (userStatusFilter === 'Bị gắn cờ' && (u.status as string) === 'FLAGGED') ||
        (userStatusFilter === 'Bị khóa' &&
          (u.rawStatus === 'BANNED' ||
            (u.status as string) === 'SUSPENDED' ||
            (u.status as string) === 'BANNED')) ||
        (userStatusFilter === 'Đã xóa' &&
          (u.rawStatus === 'DELETED' || (u.status as string) === 'DELETED'))
      return matchQ && matchStatus
    })
  }, [users, userSearch, userStatusFilter])

  const userTotalPages = Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE))
  const paginatedUsers = useMemo(() => {
    const start = (userCurrentPage - 1) * ROWS_PER_PAGE
    return filteredUsers.slice(start, start + ROWS_PER_PAGE)
  }, [filteredUsers, userCurrentPage])

  // Enhance user detail modal with backend data
  const handleOpenUserDetail = useCallback(async (user: AdminUser | null) => {
    setUserDetailModal(user)
    if (!user) return
    try {
      const res = await getAdminUserDetail(String(user.id))
      if (res.data) {
        const enriched = toAdminUser(
          {
            id: res.data.id,
            email: res.data.email,
            fullName: res.data.fullName,
            avatarUrl: res.data.avatarUrl,
            role: res.data.role,
            status: res.data.status,
            statusReason: res.data.statusReason,
            createdAt: res.data.createdAt,
            deletedAt: res.data.deletedAt,
            isFlagged: res.data.isFlagged,
            totalCompletedContracts: res.data.totalCompletedContracts,
            disputeCount: res.data.disputeCount,
          },
          res.data,
        )
        setUserDetailModal(enriched)
      }
    } catch {
      // Keep initial modal data
    }
  }, [])

  // ── 2. PROJECTS DOMAIN ──────────────────────────────────────────────────────
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [projectSearch, setProjectSearch] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('Tất cả')
  const [projectDetail, setProjectDetail] = useState<AdminProject | null>(null)
  const [projectDeleteTarget, setProjectDeleteTarget] = useState<AdminProject | null>(null)
  const [projectDeleteReason, setProjectDeleteReason] = useState('')
  const [isSubmittingProjectAction, setIsSubmittingProjectAction] = useState(false)

  // Load real projects from backend API
  useEffect(() => {
    let isMounted = true
    const fetchProjects = async () => {
      try {
        let statusParam: string | undefined = undefined
        if (projectStatusFilter === 'Đang tuyển') statusParam = 'OPEN'
        if (projectStatusFilter === 'Đã đóng') statusParam = 'CLOSED'

        const res = await getAdminProjects({
          keyword: projectSearch.trim() || undefined,
          status: statusParam,
        })
        if (isMounted && Array.isArray(res.data)) {
          setProjects(res.data.map((p) => toAdminProject(p)))
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchProjects()
    return () => {
      isMounted = false
    }
  }, [projectSearch, projectStatusFilter])

  const hiringProjectsCount = useMemo(
    () =>
      projects.filter(
        (p) =>
          p.status === 'Đang tuyển' ||
          (p.status as string) === 'OPEN' ||
          (p.status as string) === 'HIRING',
      ).length,
    [projects],
  )
  const inProgressProjectsCount = useMemo(
    () =>
      projects.filter(
        (p) => p.status === 'Đang thực hiện' || (p.status as string) === 'IN_PROGRESS',
      ).length,
    [projects],
  )
  const closedProjectsCount = useMemo(
    () =>
      projects.filter((p) => p.status === 'Đã đóng' || (p.status as string) === 'CLOSED').length,
    [projects],
  )

  const handleConfirmCloseProject = useCallback(async () => {
    if (!projectDeleteTarget || isSubmittingProjectAction) return
    const targetId = String(projectDeleteTarget.id)
    const normalizedReason = normalizeModerationReason(projectDeleteReason)

    setIsSubmittingProjectAction(true)
    try {
      const res = await closeAdminProject(targetId, normalizedReason)
      const mapped = toAdminProject(res.data)
      setProjects((prev) =>
        prev.map((p) => (String(p.id) === targetId ? { ...p, status: mapped.status } : p)),
      )
      setProjectDetail((prev) =>
        prev && String(prev.id) === targetId ? { ...prev, status: mapped.status } : prev,
      )
      setProjectDeleteTarget(null)
      setProjectDeleteReason('')
      toast.success('Đã đóng dự án thành công!')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể đóng dự án. Vui lòng thử lại.'))
    } finally {
      setIsSubmittingProjectAction(false)
    }
  }, [projectDeleteTarget, projectDeleteReason, isSubmittingProjectAction])

  const filteredProjects = useMemo(() => {
    const q = projectSearch.toLowerCase().trim()
    return projects.filter((p) => {
      const matchQ =
        !q || p.title.toLowerCase().includes(q) || p.owner.name.toLowerCase().includes(q)
      const matchStatus =
        projectStatusFilter === 'Tất cả' ||
        p.status === projectStatusFilter ||
        (projectStatusFilter === 'Đang tuyển' &&
          ((p.status as string) === 'OPEN' || (p.status as string) === 'HIRING')) ||
        (projectStatusFilter === 'Đang thực hiện' && (p.status as string) === 'IN_PROGRESS') ||
        (projectStatusFilter === 'Đã đóng' && (p.status as string) === 'CLOSED')
      return matchQ && matchStatus
    })
  }, [projects, projectSearch, projectStatusFilter])

  // Enhance project detail with backend data
  const handleOpenProjectDetail = useCallback(async (proj: AdminProject | null) => {
    setProjectDetail(proj)
    if (!proj) return
    try {
      const res = await getAdminProjectDetail(String(proj.id))
      if (res.data) {
        const enriched = toAdminProject(
          {
            id: res.data.id,
            title: res.data.title,
            description: res.data.description,
            status: res.data.status,
            employer: res.data.employer,
            createdAt: res.data.createdAt,
            closedAt: res.data.closedAt,
            reportCount: res.data.reportCount,
          },
          res.data,
        )
        setProjectDetail(enriched)
      }
    } catch {
      // Keep initial modal data
    }
  }, [])

  // ── 3. CONTRACTS DOMAIN ─────────────────────────────────────────────────────
  const [contracts] = useState<AdminContract[]>([])
  const [contractSearch, setContractSearch] = useState('')
  const [contractStatusFilter, setContractStatusFilter] = useState('Tất cả')
  const [selectedContractDetail, setSelectedContractDetail] = useState<AdminContract | null>(null)

  const inProgressContractsCount = useMemo(
    () =>
      contracts.filter(
        (c) => c.status === 'Đang thực hiện' || (c.status as string) === 'IN_PROGRESS',
      ).length,
    [contracts],
  )
  const completedContractsCount = useMemo(
    () =>
      contracts.filter((c) => c.status === 'Hoàn thành' || (c.status as string) === 'COMPLETED')
        .length,
    [contracts],
  )
  const totalContractsCount = contracts.length

  const filteredContracts = useMemo(() => {
    const q = contractSearch.toLowerCase().trim()
    return contracts.filter((c) => {
      const matchQ =
        !q ||
        c.project.toLowerCase().includes(q) ||
        c.client.name.toLowerCase().includes(q) ||
        c.freelancer.name.toLowerCase().includes(q)
      const matchStatus =
        contractStatusFilter === 'Tất cả' ||
        c.status === contractStatusFilter ||
        (contractStatusFilter === 'Đang thực hiện' && (c.status as string) === 'IN_PROGRESS') ||
        (contractStatusFilter === 'Hoàn thành' && (c.status as string) === 'COMPLETED') ||
        (contractStatusFilter === 'Đã hủy / Thất bại' && (c.status as string) === 'CANCELLED')
      return matchQ && matchStatus
    })
  }, [contracts, contractSearch, contractStatusFilter])

  // ── 4. VIOLATIONS DOMAIN ────────────────────────────────────────────────────
  const [violations, setViolations] = useState<AdminViolation[]>([])
  const [violationSearch, setViolationSearch] = useState('')
  const [violationCategoryFilter, setViolationCategoryFilter] = useState('Tất cả')
  const [violationStatusFilter, setViolationStatusFilter] = useState('Tất cả')

  const [evidenceTarget, setEvidenceTarget] = useState<AdminViolation | null>(null)
  const [sanctionTarget, setSanctionTarget] = useState<AdminViolation | null>(null)
  const [sanctionAction, setSanctionAction] = useState('Khóa tài khoản vĩnh viễn')
  const [sanctionReason, setSanctionReason] = useState('')
  const [isSubmittingViolationAction, setIsSubmittingViolationAction] = useState(false)

  // Load real violation reports from backend API
  useEffect(() => {
    let isMounted = true
    const fetchReports = async () => {
      try {
        let statusParam: BackendReportStatus | undefined = undefined
        if (violationStatusFilter === 'Chờ xử lý') statusParam = 'PENDING'
        if (violationStatusFilter === 'Đã giải quyết') statusParam = 'RESOLVED'
        if (violationStatusFilter === 'Đã bác bỏ') statusParam = 'DISMISSED'

        const res = await getAdminReports({
          status: statusParam,
        })
        if (isMounted && Array.isArray(res.data)) {
          setViolations(res.data.map((r) => toAdminViolation(r)))
        }
      } catch {
        // Fallback gracefully
      }
    }
    fetchReports()
    return () => {
      isMounted = false
    }
  }, [violationStatusFilter])

  const pendingViolationsCount = useMemo(
    () =>
      violations.filter(
        (v) =>
          v.status === 'Chờ xử lý' ||
          v.status === 'Đang xác minh' ||
          (v.status as string) === 'PENDING' ||
          (v.status as string) === 'INVESTIGATING',
      ).length,
    [violations],
  )

  const handleRejectViolation = useCallback(
    async (id: string) => {
      if (isSubmittingViolationAction) return
      setIsSubmittingViolationAction(true)
      try {
        await updateAdminReportStatus(id, { status: 'DISMISSED', note: 'Bác bỏ báo cáo' })
        setViolations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'Đã bác bỏ' } : v)))
        setEvidenceTarget(null)
        toast.success('Đã bác bỏ báo cáo vi phạm!')
      } catch (error) {
        toast.error(getErrorMessage(error, 'Không thể bác bỏ báo cáo. Vui lòng thử lại.'))
      } finally {
        setIsSubmittingViolationAction(false)
      }
    },
    [isSubmittingViolationAction],
  )

  const handleStartResolveViolation = useCallback((violation: AdminViolation) => {
    setSanctionTarget(violation)
    setSanctionAction(
      violation.category === 'Tài khoản' ? 'Khóa tài khoản vĩnh viễn' : 'Đóng dự án vi phạm',
    )
    setSanctionReason('')
    setEvidenceTarget(null)
  }, [])

  const handleConfirmSanction = useCallback(async () => {
    if (!sanctionTarget || !sanctionReason.trim() || isSubmittingViolationAction) return

    const reportId = sanctionTarget.id
    const targetCategory = sanctionTarget.category
    const targetUserId = sanctionTarget.targetUserId
    const targetProjectId = sanctionTarget.targetProjectId
    const chosenAction = sanctionAction
    const note = sanctionReason.trim()

    setIsSubmittingViolationAction(true)
    try {
      // 1. Apply the moderation sanction first so report is never marked RESOLVED if sanction fails
      if (targetCategory === 'Tài khoản') {
        if (!targetUserId) {
          toast.error('Không tìm thấy mã tài khoản bị báo cáo để áp dụng chế tài.')
          return
        }
        if (chosenAction === 'Khóa tài khoản vĩnh viễn') {
          await lockAdminUser(targetUserId, note)
        } else if (chosenAction === 'Xóa tài khoản khỏi nền tảng') {
          await deleteAdminUser(targetUserId, note)
        }
      } else if (targetCategory === 'Dự án') {
        if (!targetProjectId) {
          toast.error('Không tìm thấy mã dự án bị báo cáo để đóng dự án.')
          return
        }
        await closeAdminProject(targetProjectId, note)
      }

      // 2. Mark the violation report as RESOLVED
      await updateAdminReportStatus(reportId, {
        status: 'RESOLVED',
        note: `Chế tài: ${chosenAction} | Lý do: ${note}`,
      })

      const nowStr = `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`

      // 3. Sync local state for reports, users, and projects
      setViolations((prev) =>
        prev.map((v) =>
          v.id === reportId
            ? {
                ...v,
                status: 'Đã giải quyết',
                actionTaken: chosenAction,
                resolveNote: note,
                resolvedAt: nowStr,
              }
            : v,
        ),
      )

      if (targetCategory === 'Tài khoản' && targetUserId) {
        if (chosenAction === 'Khóa tài khoản vĩnh viễn') {
          setUsers((prev) =>
            prev.map((u) =>
              String(u.id) === targetUserId
                ? { ...u, status: 'Bị khóa', rawStatus: 'BANNED', statusReason: note }
                : u,
            ),
          )
        } else if (chosenAction === 'Xóa tài khoản khỏi nền tảng') {
          const deletedAtIso = new Date().toISOString()
          setUsers((prev) =>
            prev.map((u) =>
              String(u.id) === targetUserId
                ? {
                    ...u,
                    status: 'Đã xóa',
                    rawStatus: 'DELETED',
                    statusReason: note,
                    deletedAt: deletedAtIso,
                  }
                : u,
            ),
          )
        }
      } else if (targetCategory === 'Dự án' && targetProjectId) {
        setProjects((prev) =>
          prev.map((p) => (String(p.id) === targetProjectId ? { ...p, status: 'Đã đóng' } : p)),
        )
      }

      setSanctionTarget(null)
      setSanctionReason('')
      toast.success(`Đã áp dụng chế tài "${chosenAction}" và xử lý vi phạm thành công!`)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Không thể áp dụng chế tài. Vui lòng thử lại.'))
    } finally {
      setIsSubmittingViolationAction(false)
    }
  }, [sanctionTarget, sanctionReason, sanctionAction, isSubmittingViolationAction])

  // Enhance violation evidence target with backend evidence URLs
  const handleOpenViolationDetail = useCallback(async (v: AdminViolation | null) => {
    setEvidenceTarget(v)
    if (!v) return
    try {
      const res = await getAdminReportDetail(v.id)
      if (res.data) {
        const enriched = toAdminViolation(
          {
            id: res.data.id,
            reporterId: res.data.reporterId,
            reporterEmail: res.data.reporterEmail,
            targetType: res.data.targetType,
            targetUserId: res.data.targetUserId,
            targetProjectId: res.data.targetProjectId,
            reasonCategory: res.data.reasonCategory,
            description: res.data.description,
            status: res.data.status,
            createdAt: res.data.createdAt,
            updatedAt: res.data.updatedAt,
          },
          res.data,
        )
        setEvidenceTarget(enriched)
      }
    } catch {
      // Keep initial
    }
  }, [])

  const filteredViolations = useMemo(() => {
    const q = violationSearch.toLowerCase().trim()
    return violations.filter((v) => {
      const matchQ =
        !q ||
        v.id.toLowerCase().includes(q) ||
        v.reporter.name.toLowerCase().includes(q) ||
        v.target.toLowerCase().includes(q)
      const matchCat =
        violationCategoryFilter === 'Tất cả' || v.category === violationCategoryFilter
      const matchStatus =
        violationStatusFilter === 'Tất cả' ||
        v.status === violationStatusFilter ||
        (violationStatusFilter === 'Chờ xử lý' && (v.status as string) === 'PENDING') ||
        (violationStatusFilter === 'Đang xác minh' && (v.status as string) === 'INVESTIGATING') ||
        (violationStatusFilter === 'Đã giải quyết' && (v.status as string) === 'RESOLVED') ||
        (violationStatusFilter === 'Đã bác bỏ' && (v.status as string) === 'DISMISSED')
      return matchQ && matchCat && matchStatus
    })
  }, [violations, violationSearch, violationCategoryFilter, violationStatusFilter])

  return {
    // Nav
    activeNav,
    setActiveNav,

    // Users
    users,
    userSearch,
    setUserSearch,
    userStatusFilter,
    setUserStatusFilter,
    userCurrentPage,
    setUserCurrentPage,
    userTotalPages,
    paginatedUsers,
    filteredUsersCount: filteredUsers.length,
    flaggedUsersCount,
    activeUsersCount,
    lockedUsersCount,
    deletedUsersCount,
    userDetailModal,
    setUserDetailModal: handleOpenUserDetail,
    lockTarget,
    setLockTarget,
    lockReason,
    setLockReason,
    handleOpenLockUser,
    handleConfirmLockUser,
    handleUnlockUser,
    deleteTarget,
    setDeleteTarget,
    deleteReason,
    setDeleteReason,
    handleConfirmDeleteUser,
    isSubmittingUserAction,
    rowsPerPage: ROWS_PER_PAGE,

    // Projects
    projects,
    projectSearch,
    setProjectSearch,
    projectStatusFilter,
    setProjectStatusFilter,
    filteredProjects,
    hiringProjectsCount,
    inProgressProjectsCount,
    closedProjectsCount,
    projectDetail,
    setProjectDetail: handleOpenProjectDetail,
    projectDeleteTarget,
    setProjectDeleteTarget,
    projectDeleteReason,
    setProjectDeleteReason,
    handleConfirmCloseProject,
    isSubmittingProjectAction,

    // Contracts
    contracts,
    contractSearch,
    setContractSearch,
    contractStatusFilter,
    setContractStatusFilter,
    filteredContracts,
    totalContractsCount,
    inProgressContractsCount,
    completedContractsCount,
    selectedContractDetail,
    setSelectedContractDetail,

    // Violations
    violations,
    violationSearch,
    setViolationSearch,
    violationCategoryFilter,
    setViolationCategoryFilter,
    violationStatusFilter,
    setViolationStatusFilter,
    filteredViolations,
    pendingViolationsCount,
    evidenceTarget,
    setEvidenceTarget: handleOpenViolationDetail,
    sanctionTarget,
    setSanctionTarget,
    sanctionAction,
    setSanctionAction,
    sanctionReason,
    setSanctionReason,
    handleRejectViolation,
    handleStartResolveViolation,
    handleConfirmSanction,
    isSubmittingViolationAction,
  }
}
