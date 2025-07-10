// コミュニケーション関連の型定義
export interface Communication {
  id: string
  type: 'email' | 'chat'
  subject: string
  content: string
  sender: string
  recipient: string
  timestamp: Date
  priority: 'low' | 'medium' | 'high'
  status: 'unread' | 'read' | 'replied'
  relatedCase?: string
  relatedTask?: string
}

// タスク関連の型定義
export interface Task {
  id: string
  title: string
  description: string
  assignee: string
  dueDate: Date
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'completed'
  relatedCase?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

// 案件関連の型定義
export interface Case {
  id: string
  name: string
  company: string
  description: string
  status: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  value: number
  probability: number
  assignee: string
  createdAt: Date
  updatedAt: Date
  relatedTasks: string[]
  relatedCommunications: string[]
}

// Ambient Agent関連の型定義
export interface AmbientAgentStatus {
  isActive: boolean
  monitoringTargets: ('email' | 'chat' | 'schedule' | 'task' | 'case' | 'customer_activity' | 'legal_regulations' | 'contract_analysis')[]
  autoExecutionEnabled: boolean
  predictionEnabled: boolean
  lastActivity: Date
  performance: {
    accuracy: number
    responseTime: number
    successRate: number
  }
}

// アクション関連の型定義
export interface Action {
  id: string
  title: string
  description: string
  type: 'manual' | 'automatic'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  dueDate: Date
  assignee: string
  relatedItem?: {
    type: 'task' | 'case' | 'communication'
    id: string
  }
  createdAt: Date
  updatedAt: Date
}

// 通知関連の型定義
export interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  action?: {
    label: string
    url: string
  }
} 