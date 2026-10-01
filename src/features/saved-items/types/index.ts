export interface JobRoleItem {
  id: string
  title: string
  skills?: string[]
}

export interface JobListing {
  id: number
  title: string
  company: string
  location?: string
  clientName?: string
  budget: string
  postedAgo: string
  description: string
  skills?: string[]
  roles?: JobRoleItem[]
}
