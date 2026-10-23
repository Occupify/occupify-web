import type { UserStatus } from './user.types'
import type { ProjectStatus } from './project.types'
import type { ContractStatus } from './contract.types'
import type { ViolationStatus } from './violation.types'

export type AdminTabId = 'users' | 'projects' | 'contracts' | 'violations'

export type AdminSemanticStatus =
  UserStatus | ProjectStatus | ContractStatus | ViolationStatus | 'Đã giải quyết' | 'Bác bỏ'
