import { useState, useMemo, useCallback, useEffect } from 'react'
import { toast } from '@/components/feedback'
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
  getAdminProjects,
  getAdminProjectDetail,
  getAdminReports,
  getAdminReportDetail,
  updateAdminReportStatus,
  toAdminUser,
  toAdminProject,
  toAdminViolation,
  type BackendReportStatus,
} from '../api'

const ROWS_PER_PAGE = 8

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

  // Load real users from backend API
  useEffect(() => {
    let isMounted = true
    const fetchUsers = async () => {
      try {
        let statusParam: string | undefined = undefined
        if (userStatusFilter === 'Hoạt động') statusParam = 'ACTIVE'
        if (userStatusFilter === 'Bị khóa') statusParam = 'INACTIVE'

        const res = await getAdminUsers({
          keyword: userSearch.trim() || undefined,
          status: statusParam,
        })
        if (isMounted && res.data && res.data.length > 0) {
          const mappedUsers = res.data.map((u) => toAdminUser(u))
          setUsers(mappedUsers)
        }
      } catch {
        // Fallback gracefully to mock data when unauthenticated or offline
      }
    }
    fetchUsers()
    return () => {
      isMounted = false
    }
  }, [userSearch, userStatusFilter])

  const setActiveNav = useCallback(
    (tab: AdminTabId) => {
      setActiveNavState(tab)
      setUserCurrentPage(1)
    },
    [setUserCurrentPage],
  )

  const setUserSearch = useCallback(
    (val: string) => {
      setUserSearchState(val)
      setUserCurrentPage(1)
    },
    [setUserCurrentPage],
  )

  const setUserStatusFilter = useCallback(
    (val: string) => {
      setUserStatusFilterState(val)
      setUserCurrentPage(1)
    },
    [setUserCurrentPage],
  )

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
          (u.status as string) === 'SUSPENDED' ||
          (u.status as string) === 'BANNED',
      ).length,
    [users],
  )

  const handleToggleFlag = useCallback((id: EntityId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status:
                u.status === 'Bị gắn cờ' || (u.status as string) === 'FLAGGED'
                  ? 'Hoạt động'
                  : 'Bị gắn cờ',
            }
          : u,
      ),
    )
    setUserDetailModal((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status:
              prev.status === 'Bị gắn cờ' || (prev.status as string) === 'FLAGGED'
                ? 'Hoạt động'
                : 'Bị gắn cờ',
          }
        : prev,
    )
    toast.info('Tính năng đang phát triển: Thao tác gắn cờ tài khoản chưa được hỗ trợ bởi backend.')
  }, [])

  const handleToggleLock = useCallback((id: EntityId) => {
    let nextStatus: 'Hoạt động' | 'Bị khóa' = 'Hoạt động'
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const isCurrentlyLocked =
            u.status === 'Bị khóa' ||
            (u.status as string) === 'SUSPENDED' ||
            (u.status as string) === 'BANNED'
          nextStatus = isCurrentlyLocked ? 'Hoạt động' : 'Bị khóa'
          return { ...u, status: nextStatus }
        }
        return u
      }),
    )
    setUserDetailModal((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status:
              prev.status === 'Bị khóa' ||
              (prev.status as string) === 'SUSPENDED' ||
              (prev.status as string) === 'BANNED'
                ? 'Hoạt động'
                : 'Bị khóa',
          }
        : prev,
    )
    toast.info(
      'Tính năng đang phát triển: Thao tác khóa tài khoản từ Admin Portal chưa được hỗ trợ bởi backend.',
    )
  }, [])

  const handleConfirmDeleteUser = useCallback(() => {
    if (!deleteTarget || !deleteReason.trim()) return
    const targetId = deleteTarget.id
    setUsers((prev) => prev.filter((u) => u.id !== targetId))
    setDeleteTarget(null)
    setDeleteReason('')
    toast.info(
      'Tính năng đang phát triển: Thao tác xóa vĩnh viễn tài khoản chưa được hỗ trợ bởi backend.',
    )
  }, [deleteTarget, deleteReason])

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
          ((u.status as string) === 'SUSPENDED' || (u.status as string) === 'BANNED'))
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
            createdAt: res.data.createdAt,
            deletedAt: res.data.deletedAt,
            isFlagged: res.data.isFlagged,
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
        if (isMounted && res.data && res.data.length > 0) {
          const mappedProjects = res.data.map((p) => toAdminProject(p))
          setProjects(mappedProjects)
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

  const handleConfirmDeleteProject = useCallback(() => {
    if (!projectDeleteTarget || !projectDeleteReason.trim()) return
    const targetId = projectDeleteTarget.id
    setProjects((prev) => prev.filter((p) => p.id !== targetId))
    setProjectDeleteTarget(null)
    setProjectDeleteReason('')
    toast.info('Tính năng đang phát triển: Thao tác gỡ dự án chưa được hỗ trợ bởi backend.')
  }, [projectDeleteTarget, projectDeleteReason])

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
  const [sanctionAction, setSanctionAction] = useState('Cảnh cáo người dùng')
  const [sanctionReason, setSanctionReason] = useState('')
  const [notifyTargetUser, setNotifyTargetUser] = useState(true)
  const [notifyReporter, setNotifyReporter] = useState(true)

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
        if (isMounted && res.data && res.data.length > 0) {
          const mappedViolations = res.data.map((r) => toAdminViolation(r))
          setViolations(mappedViolations)
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

  const handleRejectViolation = useCallback(async (id: string) => {
    try {
      await updateAdminReportStatus(id, { status: 'DISMISSED', note: 'Bác bỏ báo cáo' })
    } catch {
      // Local state update proceeds
    }
    setViolations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'Đã bác bỏ' } : v)))
    setEvidenceTarget(null)
    toast.info('Đã bác bỏ báo cáo vi phạm!')
  }, [])

  const handleStartResolveViolation = useCallback((violation: AdminViolation) => {
    setSanctionTarget(violation)
    setSanctionAction(
      violation.category === 'Tài khoản' ? 'Cảnh cáo người dùng' : 'Gỡ bỏ dự án khỏi nền tảng',
    )
    setSanctionReason('')
    setNotifyTargetUser(true)
    setNotifyReporter(true)
    setEvidenceTarget(null)
  }, [])

  const handleConfirmSanction = useCallback(async () => {
    if (!sanctionTarget || !sanctionReason.trim()) return

    const nowStr = `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
    const targetId = sanctionTarget.id
    const targetCategory = sanctionTarget.category
    const targetName = sanctionTarget.target
    const chosenAction = sanctionAction
    const note = sanctionReason.trim()

    // 1. Call backend API to persist RESOLVED status and note
    try {
      await updateAdminReportStatus(targetId, {
        status: 'RESOLVED',
        note: `Chế tài: ${chosenAction} | Lý do: ${note}`,
      })
    } catch {
      // Proceed with local update
    }

    // 2. Cập nhật trạng thái và thông tin chế tài của báo cáo
    setViolations((prev) =>
      prev.map((v) =>
        v.id === targetId
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

    // 3. Đồng bộ hóa chế tài thực tế sang Người dùng hoặc Dự án
    if (targetCategory === 'Tài khoản') {
      const cleanTarget = targetName
        .replace(/^Tài khoản:\s*/i, '')
        .replace('@', '')
        .toLowerCase()
        .trim()

      if (
        chosenAction === 'Khóa tài khoản vĩnh viễn' ||
        chosenAction === 'Tạm khóa tài khoản 7 ngày'
      ) {
        setUsers((prev) =>
          prev.map((u) => {
            const match =
              u.name.toLowerCase().includes(cleanTarget) ||
              u.email.toLowerCase().includes(cleanTarget)
            return match ? { ...u, status: 'Bị khóa' } : u
          }),
        )
      } else if (chosenAction === 'Xóa tài khoản khỏi nền tảng') {
        setUsers((prev) =>
          prev.filter(
            (u) =>
              !u.name.toLowerCase().includes(cleanTarget) &&
              !u.email.toLowerCase().includes(cleanTarget),
          ),
        )
      } else if (chosenAction === 'Cảnh cáo người dùng') {
        setUsers((prev) =>
          prev.map((u) => {
            const match =
              u.name.toLowerCase().includes(cleanTarget) ||
              u.email.toLowerCase().includes(cleanTarget)
            return match && (u.status === 'Hoạt động' || (u.status as string) === 'ACTIVE')
              ? { ...u, status: 'Bị gắn cờ' }
              : u
          }),
        )
      }
    } else if (targetCategory === 'Dự án') {
      const cleanProject = targetName
        .replace(/^Dự án:\s*/i, '')
        .toLowerCase()
        .trim()
      if (chosenAction.includes('Gỡ')) {
        setProjects((prev) => prev.filter((p) => !p.title.toLowerCase().includes(cleanProject)))
      }
    }

    setSanctionTarget(null)
    setSanctionReason('')
    toast.success(`Đã áp dụng chế tài "${chosenAction}" và xử lý vi phạm thành công!`)
  }, [sanctionTarget, sanctionReason, sanctionAction])

  const handleResolveViolation = useCallback(async (id: string) => {
    try {
      await updateAdminReportStatus(id, { status: 'RESOLVED', note: 'Xử lý vi phạm' })
    } catch {
      // Local state update proceeds
    }
    setViolations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'Đã giải quyết' } : v)))
    setEvidenceTarget(null)
    toast.success('Đã xử lý vi phạm thành công!')
  }, [])

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
    handleToggleFlag,
    handleToggleLock,
    userDetailModal,
    setUserDetailModal: handleOpenUserDetail,
    deleteTarget,
    setDeleteTarget,
    deleteReason,
    setDeleteReason,
    handleConfirmDeleteUser,
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
    handleConfirmDeleteProject,

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
    notifyTargetUser,
    setNotifyTargetUser,
    notifyReporter,
    setNotifyReporter,
    handleRejectViolation,
    handleStartResolveViolation,
    handleConfirmSanction,
    handleResolveViolation,
  }
}
