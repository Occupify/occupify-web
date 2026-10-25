import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyProjects,
  getEmployeeProjects,
  getPendingProjects,
  getProjectById,
  createProject,
  updateProject,
  closeProject,
  createContract,
  cancelMyProject,
  cancelEmployeeProject,
  updateMyProjectMembers,
  acceptInvitation,
  rejectInvitation,
} from '../api'
import type { UpdateProjectPayload } from '../types'

export const projectKeys = {
  all: ['projects'] as const,
  my: () => [...projectKeys.all, 'my'] as const,
  employee: () => [...projectKeys.all, 'employee'] as const,
  pending: () => [...projectKeys.all, 'pending'] as const,
  detail: (id: string | number) => [...projectKeys.all, 'detail', String(id)] as const,
}

export function useProjectDetail(id?: string | number) {
  return useQuery({
    queryKey: projectKeys.detail(id ?? ''),
    queryFn: () => (id ? getProjectById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  })
}

export function useProjects(employerId?: string) {
  const queryClient = useQueryClient()

  const myProjectsQuery = useQuery({
    queryKey: employerId ? [...projectKeys.my(), employerId] : projectKeys.my(),
    queryFn: () => getMyProjects(employerId),
  })

  const employeeProjectsQuery = useQuery({
    queryKey: projectKeys.employee(),
    queryFn: getEmployeeProjects,
  })

  const pendingQuery = useQuery({
    queryKey: projectKeys.pending(),
    queryFn: getPendingProjects,
  })

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const updateProjectMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string | number
      payload: UpdateProjectPayload
    }) => updateProject(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(variables.id) })
    },
  })

  const closeProjectMutation = useMutation({
    mutationFn: (projectId: string | number) => closeProject(projectId),
    onSuccess: (_data, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) })
    },
  })

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.my() })
    },
  })

  const cancelMyProjectMutation = useMutation({
    mutationFn: ({ projectId, reason }: { projectId: number | string; reason?: string }) =>
      cancelMyProject(projectId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.all })
    },
  })

  const cancelEmployeeProjectMutation = useMutation({
    mutationFn: ({ projectId, reason }: { projectId: number | string; reason?: string }) =>
      cancelEmployeeProject(projectId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.employee() })
    },
  })

  const updateMembersMutation = useMutation({
    mutationFn: ({
      projectId,
      members,
    }: {
      projectId: number | string
      members: Parameters<typeof updateMyProjectMembers>[1]
    }) => updateMyProjectMembers(projectId, members),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.my() })
    },
  })

  const acceptInvitationMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.pending() })
      queryClient.invalidateQueries({ queryKey: projectKeys.employee() })
    },
  })

  const rejectInvitationMutation = useMutation({
    mutationFn: rejectInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.pending() })
    },
  })

  return {
    myProjects: myProjectsQuery.data ?? [],
    employeeProjects: employeeProjectsQuery.data ?? [],
    pending: pendingQuery.data ?? [],
    isLoading:
      myProjectsQuery.isLoading || employeeProjectsQuery.isLoading || pendingQuery.isLoading,
    createProject: createProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    closeProject: closeProjectMutation.mutateAsync,
    createContract: createContractMutation.mutateAsync,
    cancelMyProject: cancelMyProjectMutation.mutateAsync,
    cancelEmployeeProject: cancelEmployeeProjectMutation.mutateAsync,
    updateMyProjectMembers: updateMembersMutation.mutateAsync,
    acceptInvitation: acceptInvitationMutation.mutateAsync,
    rejectInvitation: rejectInvitationMutation.mutateAsync,
  }
}
