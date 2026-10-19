import { useState, useMemo, useCallback } from 'react'
import { toast } from '@/components/feedback'
import {
  ADMIN_USERS_DATA,
  ADMIN_PROJECTS_DATA,
  ADMIN_CONTRACTS_DATA,
  ADMIN_VIOLATIONS_DATA,
} from '../data'
import type { AdminUser, AdminProject, AdminContract, AdminViolation, AdminTabId } from '../types'

const ROWS_PER_PAGE = 8

export function useAdminPortal(initialTab: AdminTabId = 'users') {
  // Navigation
  const [activeNav, setActiveNavState] = useState<AdminTabId>(initialTab)

  // ── 1. USERS DOMAIN ─────────────────────────────────────────────────────────
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS_DATA)
  const [userSearch, setUserSearchState] = useState('')
  const [userStatusFilter, setUserStatusFilterState] = useState('Tất cả')
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [userDetailModal, setUserDetailModal] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [deleteReason, setDeleteReason] = useState('')

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
    () => users.filter((u) => u.status === 'Bị gắn cờ').length,
    [users],
  )
  const activeUsersCount = useMemo(
    () => users.filter((u) => u.status === 'Hoạt động').length,
    [users],
  )
  const lockedUsersCount = useMemo(
    () => users.filter((u) => u.status === 'Bị khóa').length,
    [users],
  )

  const handleToggleFlag = useCallback((id: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              status: u.status === 'Bị gắn cờ' ? 'Hoạt động' : 'Bị gắn cờ',
            }
          : u,
      ),
    )
    setUserDetailModal((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: prev.status === 'Bị gắn cờ' ? 'Hoạt động' : 'Bị gắn cờ',
          }
        : prev,
    )
    toast.success('Đã cập nhật trạng thái cờ người dùng!')
  }, [])

  const handleToggleLock = useCallback((id: number) => {
    let nextStatus: 'Hoạt động' | 'Bị khóa' = 'Hoạt động'
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          nextStatus = u.status === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa'
          return { ...u, status: nextStatus }
        }
        return u
      }),
    )
    setUserDetailModal((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: prev.status === 'Bị khóa' ? 'Hoạt động' : 'Bị khóa',
          }
        : prev,
    )
    toast.success('Đã cập nhật trạng thái khóa tài khoản!')
  }, [])

  const handleConfirmDeleteUser = useCallback(() => {
    if (!deleteTarget || !deleteReason.trim()) return
    const targetId = deleteTarget.id
    setUsers((prev) => prev.filter((u) => u.id !== targetId))
    setDeleteTarget(null)
    setDeleteReason('')
    setUserDetailModal(null)
    toast.success('Đã xóa tài khoản thành công!')
  }, [deleteTarget, deleteReason])

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !userSearch.trim() ||
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
      const matchStatus = userStatusFilter === 'Tất cả' || u.status === userStatusFilter
      return matchSearch && matchStatus
    })
  }, [users, userSearch, userStatusFilter])

  const userTotalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredUsers.length / ROWS_PER_PAGE)),
    [filteredUsers.length],
  )

  const paginatedUsers = useMemo(() => {
    const start = (userCurrentPage - 1) * ROWS_PER_PAGE
    return filteredUsers.slice(start, start + ROWS_PER_PAGE)
  }, [filteredUsers, userCurrentPage])

  // ── 2. PROJECTS DOMAIN ──────────────────────────────────────────────────────
  const [projects, setProjects] = useState<AdminProject[]>(ADMIN_PROJECTS_DATA)
  const [projectSearch, setProjectSearch] = useState('')
  const [projectStatusFilter, setProjectStatusFilter] = useState('Tất cả')
  const [projectDetail, setProjectDetail] = useState<AdminProject | null>(null)
  const [projectDeleteTarget, setProjectDeleteTarget] = useState<AdminProject | null>(null)
  const [projectDeleteReason, setProjectDeleteReason] = useState('')

  const hiringProjectsCount = useMemo(
    () => projects.filter((p) => p.status === 'Đang tuyển').length,
    [projects],
  )
  const inProgressProjectsCount = useMemo(
    () => projects.filter((p) => p.status === 'Đang thực hiện').length,
    [projects],
  )
  const closedProjectsCount = useMemo(
    () => projects.filter((p) => p.status === 'Đã đóng').length,
    [projects],
  )

  const handleConfirmDeleteProject = useCallback(() => {
    if (!projectDeleteTarget || !projectDeleteReason.trim()) return
    const targetId = projectDeleteTarget.id
    setProjects((prev) => prev.filter((p) => p.id !== targetId))
    setProjectDeleteTarget(null)
    setProjectDeleteReason('')
    setProjectDetail(null)
    toast.success('Đã gỡ dự án thành công!')
  }, [projectDeleteTarget, projectDeleteReason])

  const filteredProjects = useMemo(() => {
    const q = projectSearch.toLowerCase().trim()
    return projects.filter((p) => {
      const matchQ =
        !q || p.title.toLowerCase().includes(q) || p.owner.name.toLowerCase().includes(q)
      const matchS = projectStatusFilter === 'Tất cả' || p.status === projectStatusFilter
      return matchQ && matchS
    })
  }, [projects, projectSearch, projectStatusFilter])

  // ── 3. CONTRACTS DOMAIN ─────────────────────────────────────────────────────
  const [contracts] = useState<AdminContract[]>(ADMIN_CONTRACTS_DATA)
  const [contractSearch, setContractSearch] = useState('')
  const [contractStatusFilter, setContractStatusFilter] = useState('Tất cả')
  const [selectedContractDetail, setSelectedContractDetail] = useState<AdminContract | null>(null)

  const totalContractsCount = useMemo(() => contracts.length, [contracts])
  const inProgressContractsCount = useMemo(
    () => contracts.filter((c) => c.status === 'Đang thực hiện').length,
    [contracts],
  )
  const completedContractsCount = useMemo(
    () => contracts.filter((c) => c.status === 'Hoàn thành').length,
    [contracts],
  )

  const filteredContracts = useMemo(() => {
    const q = contractSearch.toLowerCase().trim()
    return contracts.filter((c) => {
      const matchQ =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.project.toLowerCase().includes(q) ||
        c.client.name.toLowerCase().includes(q) ||
        c.freelancer.name.toLowerCase().includes(q)
      const matchS = contractStatusFilter === 'Tất cả' || c.status === contractStatusFilter
      return matchQ && matchS
    })
  }, [contracts, contractSearch, contractStatusFilter])

  // ── 4. VIOLATIONS DOMAIN ────────────────────────────────────────────────────
  const [violations, setViolations] = useState<AdminViolation[]>(ADMIN_VIOLATIONS_DATA)
  const [violationSearch, setViolationSearch] = useState('')
  const [violationCategoryFilter, setViolationCategoryFilter] = useState('Tất cả')
  const [violationStatusFilter, setViolationStatusFilter] = useState('Tất cả')
  const [evidenceTarget, setEvidenceTarget] = useState<AdminViolation | null>(null)

  const pendingViolationsCount = useMemo(
    () => violations.filter((v) => v.status === 'Chờ xử lý').length,
    [violations],
  )

  const handleRejectViolation = useCallback((id: string) => {
    setViolations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'Đã bác bỏ' } : v)))
    setEvidenceTarget(null)
    toast.success('Đã bác bỏ báo cáo vi phạm!')
  }, [])

  const handleResolveViolation = useCallback((id: string) => {
    setViolations((prev) => prev.map((v) => (v.id === id ? { ...v, status: 'Đã giải quyết' } : v)))
    setEvidenceTarget(null)
    toast.success('Đã xử lý vi phạm thành công!')
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
      const matchStatus = violationStatusFilter === 'Tất cả' || v.status === violationStatusFilter
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
    setUserDetailModal,
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
    setProjectDetail,
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
    setEvidenceTarget,
    handleRejectViolation,
    handleResolveViolation,
  }
}
