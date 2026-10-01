import type { MyProject, PendingProject } from '../types'
import {
  MY_PROJECTS_DATA,
  EMPLOYEE_PROJECTS_DATA,
  PENDING_PROJECTS_DATA,
} from '@/features/mock-data'

let myProjectsStore: MyProject[] = [...MY_PROJECTS_DATA]
let employeeProjectsStore: MyProject[] = [...EMPLOYEE_PROJECTS_DATA]
let pendingProjectsStore: PendingProject[] = [...PENDING_PROJECTS_DATA]

export async function getMyProjects(): Promise<MyProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...myProjectsStore]
}

export async function getEmployeeProjects(): Promise<MyProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...employeeProjectsStore]
}

export async function getPendingProjects(): Promise<PendingProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 80))
  return [...pendingProjectsStore]
}

export function setInternalStores(data: {
  myProjects?: MyProject[]
  employeeProjects?: MyProject[]
  pending?: PendingProject[]
}) {
  if (data.myProjects) myProjectsStore = data.myProjects
  if (data.employeeProjects) employeeProjectsStore = data.employeeProjects
  if (data.pending) pendingProjectsStore = data.pending
}

export function getInternalStores() {
  return {
    myProjects: myProjectsStore,
    employeeProjects: employeeProjectsStore,
    pending: pendingProjectsStore,
  }
}
