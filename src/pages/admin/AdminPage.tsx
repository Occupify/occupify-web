import { useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  AdminSidebar,
  UsersTab,
  ProjectsTab,
  ContractsTab,
  ViolationsTab,
  UserDetailModal,
  UserDeleteModal,
  ProjectDetailModal,
  ProjectDeleteModal,
  ContractDetailModal,
  ViolationDetailModal,
  ViolationActionModal,
  useAdminPortal,
} from '@/features/admin'
import type { AdminTabId } from '@/features/admin'

const VALID_TABS: AdminTabId[] = ['users', 'projects', 'contracts', 'violations']

export function AdminPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get('tab') as AdminTabId
  const initialTab: AdminTabId = VALID_TABS.includes(tabParam) ? tabParam : 'users'

  const portal = useAdminPortal(initialTab)

  // Sync tab with URL search parameter
  useEffect(() => {
    const currentTab = searchParams.get('tab') as AdminTabId
    if (currentTab && VALID_TABS.includes(currentTab) && currentTab !== portal.activeNav) {
      portal.setActiveNav(currentTab)
    }
  }, [searchParams, portal])

  const handleSelectNav = useCallback(
    (tab: AdminTabId) => {
      portal.setActiveNav(tab)
      setSearchParams({ tab })
    },
    [portal, setSearchParams],
  )

  const handleBackToWeb = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <div className="flex min-h-screen bg-[#F4F2EE]">
      {/* ── Fixed Sidebar ── */}
      <AdminSidebar
        activeNav={portal.activeNav}
        onSelectNav={handleSelectNav}
        flaggedUsersCount={portal.flaggedUsersCount}
        pendingViolationsCount={portal.pendingViolationsCount}
        onBack={handleBackToWeb}
      />

      {/* ── Main Workspace ── */}
      <main className="ml-[260px] flex-1 min-h-screen p-8 lg:p-10">
        {portal.activeNav === 'users' && (
          <UsersTab
            users={portal.paginatedUsers}
            totalUsersCount={portal.users.length}
            activeCount={portal.activeUsersCount}
            flaggedCount={portal.flaggedUsersCount}
            lockedCount={portal.lockedUsersCount}
            userSearch={portal.userSearch}
            onSearchChange={portal.setUserSearch}
            userStatusFilter={portal.userStatusFilter}
            onStatusFilterChange={portal.setUserStatusFilter}
            currentPage={portal.userCurrentPage}
            totalPages={portal.userTotalPages}
            filteredCount={portal.filteredUsersCount}
            onPageChange={portal.setUserCurrentPage}
            onSelectUser={portal.setUserDetailModal}
          />
        )}

        {portal.activeNav === 'projects' && (
          <ProjectsTab
            projects={portal.filteredProjects}
            totalProjectsCount={portal.projects.length}
            hiringCount={portal.hiringProjectsCount}
            inProgressCount={portal.inProgressProjectsCount}
            closedCount={portal.closedProjectsCount}
            projectSearch={portal.projectSearch}
            onSearchChange={portal.setProjectSearch}
            projectStatusFilter={portal.projectStatusFilter}
            onStatusFilterChange={portal.setProjectStatusFilter}
            onSelectProject={portal.setProjectDetail}
          />
        )}

        {portal.activeNav === 'contracts' && (
          <ContractsTab
            contracts={portal.filteredContracts}
            totalContractsCount={portal.totalContractsCount}
            inProgressCount={portal.inProgressContractsCount}
            completedCount={portal.completedContractsCount}
            contractSearch={portal.contractSearch}
            onSearchChange={portal.setContractSearch}
            contractStatusFilter={portal.contractStatusFilter}
            onStatusFilterChange={portal.setContractStatusFilter}
            onSelectContract={portal.setSelectedContractDetail}
          />
        )}

        {portal.activeNav === 'violations' && (
          <ViolationsTab
            violations={portal.filteredViolations}
            violationSearch={portal.violationSearch}
            onSearchChange={portal.setViolationSearch}
            categoryFilter={portal.violationCategoryFilter}
            onCategoryFilterChange={portal.setViolationCategoryFilter}
            statusFilter={portal.violationStatusFilter}
            onStatusFilterChange={portal.setViolationStatusFilter}
            onSelectViolation={portal.setEvidenceTarget}
          />
        )}
      </main>

      {/* ── Modals & Overlays ── */}
      <UserDetailModal
        user={portal.userDetailModal}
        onClose={() => portal.setUserDetailModal(null)}
        onToggleLock={portal.handleToggleLock}
        onDeleteClick={(u) => {
          portal.setDeleteTarget(u)
          portal.setDeleteReason('')
        }}
      />

      <UserDeleteModal
        user={portal.deleteTarget}
        reason={portal.deleteReason}
        onReasonChange={portal.setDeleteReason}
        onClose={() => portal.setDeleteTarget(null)}
        onConfirm={portal.handleConfirmDeleteUser}
      />

      <ProjectDetailModal
        project={portal.projectDetail}
        onClose={() => portal.setProjectDetail(null)}
        onDeleteClick={(p) => {
          portal.setProjectDeleteTarget(p)
          portal.setProjectDeleteReason('')
          portal.setProjectDetail(null)
        }}
      />

      <ProjectDeleteModal
        project={portal.projectDeleteTarget}
        reason={portal.projectDeleteReason}
        onReasonChange={portal.setProjectDeleteReason}
        onClose={() => portal.setProjectDeleteTarget(null)}
        onConfirm={portal.handleConfirmDeleteProject}
      />

      <ContractDetailModal
        contract={portal.selectedContractDetail}
        onClose={() => portal.setSelectedContractDetail(null)}
      />

      <ViolationDetailModal
        violation={portal.evidenceTarget}
        onClose={() => portal.setEvidenceTarget(null)}
        onReject={portal.handleRejectViolation}
        onResolveClick={portal.handleStartResolveViolation}
      />

      <ViolationActionModal
        violation={portal.sanctionTarget}
        action={portal.sanctionAction}
        onActionChange={portal.setSanctionAction}
        reason={portal.sanctionReason}
        onReasonChange={portal.setSanctionReason}
        notifyTarget={portal.notifyTargetUser}
        onNotifyTargetChange={portal.setNotifyTargetUser}
        notifyReporter={portal.notifyReporter}
        onNotifyReporterChange={portal.setNotifyReporter}
        onClose={() => portal.setSanctionTarget(null)}
        onConfirm={portal.handleConfirmSanction}
      />
    </div>
  )
}

export default AdminPage
