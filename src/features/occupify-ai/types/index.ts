export type AiMessageSender = 'user' | 'ai'

export interface AiChatMessage {
  id: string
  sender: AiMessageSender
  content: string
  timestamp: string
  attachment?: {
    name: string
    size: string
    type?: string
  }
}

export interface AiChatSession {
  id: string
  title: string
  lastUpdated: string
  messages: AiChatMessage[]
}

export interface PromptTemplate {
  id: string
  category: 'jobs' | 'cv' | 'project' | 'career'
  badge: string
  title: string
  prompt: string
  description: string
  iconName: 'briefcase' | 'file-text' | 'folder-plus' | 'lightbulb'
}
