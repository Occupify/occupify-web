import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyProjects,
  getEmployeeProjects,
  getPendingProjects,
  createProject,
  createContract,
  cancelMyProject,
  cancelEmployeeProject,
  updateMyProjectMembers,
  acceptInvitation,
  rejectInvitation,
} from '../api'

export const projectKeys = {
  all: ['projects'] as const,
  my: () => [...projectKeys.all, 'my'] as const,
  employee: () => [...projectKeys.all, 'employee'] as const,
  pending: () => [...projectKeys.all, 'pending'] as const,
}

export function useProjects() {
  const queryClient = useQueryClient()

  const myProjectsQuery = useQuery({
    queryKey: projectKeys.my(),
    queryFn: getMyProjects,
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
      queryClient.invalidateQueries({ queryKey: projectKeys.my() })
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
    },
  })

  const createContractMutation = useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.my() })
    },
  })

  const cancelMyProjectMutation = useMutation({
    mutationFn: ({ projectId, reason }: { projectId: number; reason?: string }) =>
      cancelMyProject(projectId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.my() })
    },
  })

  const cancelEmployeeProjectMutation = useMutation({
    mutationFn: ({ projectId, reason }: { projectId: number; reason?: string }) =>
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
      projectId: number
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
    createContract: createContractMutation.mutateAsync,
    cancelMyProject: cancelMyProjectMutation.mutateAsync,
    cancelEmployeeProject: cancelEmployeeProjectMutation.mutateAsync,
    updateMyProjectMembers: updateMembersMutation.mutateAsync,
    acceptInvitation: acceptInvitationMutation.mutateAsync,
    rejectInvitation: rejectInvitationMutation.mutateAsync,
  }
}
