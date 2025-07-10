import { Action, AmbientAgentStatus, Case, Communication, Notification, Task } from '@/types'

// ダミーデータ生成用のヘルパー関数
// function generateId(): string {
//   return Math.random().toString(36).substr(2, 9)
// }

// function randomDate(start: Date, end: Date): Date {
//   return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
// }

// function randomElement<T>(array: T[]): T {
//   return array[Math.floor(Math.random() * array.length)]
// }

// コミュニケーションデータ
export const mockCommunications: Communication[] = [
  {
    id: 'comm-001',
    type: 'email',
    subject: '製品問い合わせについて',
    content: '御社の営業支援システムについて詳しく知りたいです。デモのご依頼をお願いします。',
    sender: 'tanaka@example.com',
    recipient: 'sales@company.com',
    timestamp: new Date('2024-01-15T10:30:00'),
    priority: 'high',
    status: 'unread',
    relatedCase: 'case-001'
  },
  {
    id: 'comm-002',
    type: 'chat',
    subject: '商談の進捗確認',
    content: '先日の打ち合わせの件で、提案書の準備状況はいかがでしょうか？',
    sender: 'yamada@client.com',
    recipient: 'sales@company.com',
    timestamp: new Date('2024-01-14T15:45:00'),
    priority: 'medium',
    status: 'read',
    relatedCase: 'case-002'
  },
  {
    id: 'comm-004',
    type: 'email',
    subject: '契約書の確認',
    content: '契約書の内容を確認いたしました。いくつか質問があります。',
    sender: 'sato@client.com',
    recipient: 'sales@company.com',
    timestamp: new Date('2024-01-12T09:15:00'),
    priority: 'medium',
    status: 'replied',
    relatedCase: 'case-003'
  },
  {
    id: 'comm-005',
    type: 'chat',
    subject: 'システム導入について',
    content: 'システム導入のスケジュールについて相談したいです。',
    sender: 'watanabe@prospect.com',
    recipient: 'sales@company.com',
    timestamp: new Date('2024-01-11T16:30:00'),
    priority: 'low',
    status: 'unread'
  }
]

// タスクデータ
export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'A社への提案書作成',
    description: 'A社の要件に合わせた提案書を作成する',
    assignee: '田中太郎',
    dueDate: new Date('2024-01-20T17:00:00'),
    priority: 'high',
    status: 'in_progress',
    relatedCase: 'case-001',
    tags: ['提案書', 'A社'],
    createdAt: new Date('2024-01-10T09:00:00'),
    updatedAt: new Date('2024-01-15T14:30:00')
  },
  {
    id: 'task-002',
    title: 'B社との次回商談準備',
    description: 'B社との次回商談に向けて資料を準備する',
    assignee: '佐藤花子',
    dueDate: new Date('2024-01-18T17:00:00'),
    priority: 'medium',
    status: 'todo',
    relatedCase: 'case-002',
    tags: ['商談', 'B社'],
    createdAt: new Date('2024-01-12T10:00:00'),
    updatedAt: new Date('2024-01-12T10:00:00')
  },
  {
    id: 'task-003',
    title: 'C社の契約書レビュー',
    description: 'C社からの契約書の内容を確認し、修正点をまとめる',
    assignee: '田中太郎',
    dueDate: new Date('2024-01-16T17:00:00'),
    priority: 'high',
    status: 'completed',
    relatedCase: 'case-003',
    tags: ['契約書', 'C社'],
    createdAt: new Date('2024-01-08T11:00:00'),
    updatedAt: new Date('2024-01-15T16:00:00')
  },
  {
    id: 'task-004',
    title: 'D社へのデモ実施',
    description: 'D社に対して製品デモを実施する',
    assignee: '佐藤花子',
    dueDate: new Date('2024-01-22T15:00:00'),
    priority: 'medium',
    status: 'todo',
    tags: ['デモ', 'D社'],
    createdAt: new Date('2024-01-14T13:00:00'),
    updatedAt: new Date('2024-01-14T13:00:00')
  },
  {
    id: 'task-005',
    title: '月次レポート作成',
    description: '1月の営業活動レポートを作成する',
    assignee: '田中太郎',
    dueDate: new Date('2024-01-25T17:00:00'),
    priority: 'low',
    status: 'todo',
    tags: ['レポート', '月次'],
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T09:00:00')
  },
  {
    id: 'task-006',
    title: 'A社向けデモ準備',
    description: 'A社営業支援システムのデモ資料・環境を準備する',
    assignee: '田中太郎',
    dueDate: new Date('2024-01-19T17:00:00'),
    priority: 'medium',
    status: 'todo',
    relatedCase: 'case-001',
    tags: ['デモ', 'A社'],
    createdAt: new Date('2024-01-16T09:00:00'),
    updatedAt: new Date('2024-01-16T09:00:00')
  }
]

// 案件データ
export const mockCases: Case[] = [
  {
    id: 'case-001',
    name: 'A社営業支援システム導入案件',
    company: 'A株式会社',
    description: 'A社の営業部門の効率化を目的としたシステム導入案件',
    status: 'proposal',
    value: 5000000,
    probability: 0.7,
    assignee: '田中太郎',
    createdAt: new Date('2024-01-05T09:00:00'),
    updatedAt: new Date('2024-01-15T14:30:00'),
    relatedTasks: ['task-001', 'task-005', 'task-006'],
    relatedCommunications: ['comm-001']
  },
  {
    id: 'case-002',
    name: 'B社CRMシステム導入案件',
    company: 'B株式会社',
    description: 'B社の顧客管理システムの導入案件',
    status: 'negotiation',
    value: 3000000,
    probability: 0.8,
    assignee: '佐藤花子',
    createdAt: new Date('2024-01-08T10:00:00'),
    updatedAt: new Date('2024-01-14T15:45:00'),
    relatedTasks: ['task-002'],
    relatedCommunications: ['comm-002']
  },
  {
    id: 'case-003',
    name: 'C社業務効率化案件',
    company: 'C株式会社',
    description: 'C社の業務プロセス改善を目的としたシステム導入案件',
    status: 'closed_won',
    value: 8000000,
    probability: 1.0,
    assignee: '田中太郎',
    createdAt: new Date('2023-12-20T09:00:00'),
    updatedAt: new Date('2024-01-15T16:00:00'),
    relatedTasks: ['task-003'],
    relatedCommunications: ['comm-004']
  },
  {
    id: 'case-004',
    name: 'D社デジタル化推進案件',
    company: 'D株式会社',
    description: 'D社のデジタル化推進を支援する案件',
    status: 'qualification',
    value: 4000000,
    probability: 0.5,
    assignee: '佐藤花子',
    createdAt: new Date('2024-01-12T11:00:00'),
    updatedAt: new Date('2024-01-11T16:30:00'),
    relatedTasks: ['task-004'],
    relatedCommunications: ['comm-005']
  }
]

// Ambient Agentステータスデータ
export const mockAmbientAgentStatus: AmbientAgentStatus = {
  isActive: true,
  monitoringTargets: ['email', 'chat', 'schedule', 'task', 'case', 'customer_activity', 'legal_regulations', 'contract_analysis'],
  autoExecutionEnabled: true,
  predictionEnabled: true,
  lastActivity: new Date('2024-01-15T16:45:00'),
  performance: {
    accuracy: 0.85,
    responseTime: 2.3,
    successRate: 0.92
  }
}

// アクションデータ
export const mockActions: Action[] = [
  {
    id: 'action-001',
    title: 'A社契約書のリスク分析自動実行',
    description: 'A社の契約書レビューシステム提案書に関連するリスク分析を自動実行。法務要件の充足性と技術的実現可能性をAIが自動評価。',
    type: 'automatic',
    status: 'pending',
    priority: 'high',
    dueDate: new Date('2024-01-17T17:00:00'),
    assignee: '田中太郎',
    relatedItem: {
      type: 'task',
      id: 'task-001'
    },
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:00')
  },
  {
    id: 'action-002',
    title: 'B社の法務業務効率化事例収集',
    description: 'B社との商談に向けて、同業他社の法務業務効率化事例を自動収集・分析。導入効果とROIの予測データを生成。',
    type: 'automatic',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date('2024-01-18T17:00:00'),
    assignee: '佐藤花子',
    relatedItem: {
      type: 'task',
      id: 'task-002'
    },
    createdAt: new Date('2024-01-14T15:45:00'),
    updatedAt: new Date('2024-01-15T10:00:00')
  },
  {
    id: 'action-003',
    title: 'C社契約書管理システム導入効果レポート生成',
    description: 'C社の契約書管理システム導入プロジェクトの完了効果を自動分析。業務効率化率とコスト削減効果を数値化してレポート生成。',
    type: 'automatic',
    status: 'completed',
    priority: 'high',
    dueDate: new Date('2024-01-16T17:00:00'),
    assignee: '田中太郎',
    relatedItem: {
      type: 'task',
      id: 'task-003'
    },
    createdAt: new Date('2024-01-12T09:15:00'),
    updatedAt: new Date('2024-01-15T16:00:00')
  },
  {
    id: 'action-004',
    title: 'D社向けコンプライアンス監視システム技術検証',
    description: 'D社向けコンプライアンス監視システムの技術検証を自動実行。金融業界特有の法規制対応機能とリスク分析精度を評価。',
    type: 'automatic',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-01-19T17:00:00'),
    assignee: '佐藤花子',
    relatedItem: {
      type: 'task',
      id: 'task-004'
    },
    createdAt: new Date('2024-01-14T13:00:00'),
    updatedAt: new Date('2024-01-14T13:00:00')
  },
  {
    id: 'action-005',
    title: '新規法規制変更の営業影響度分析',
    description: '最新の法規制変更を検出し、営業案件への影響度を自動分析。各案件のリスク要因と対応策を提案。',
    type: 'automatic',
    status: 'in_progress',
    priority: 'high',
    dueDate: new Date('2024-01-20T17:00:00'),
    assignee: '田中太郎',
    relatedItem: {
      type: 'case',
      id: 'case-001'
    },
    createdAt: new Date('2024-01-15T09:00:00'),
    updatedAt: new Date('2024-01-15T16:30:00')
  },
  {
    id: 'action-006',
    title: '競合他社のリーガルテック導入動向監視',
    description: '競合他社のリーガルテック導入動向を自動監視・分析。市場トレンドと自社提案の差別化ポイントを特定。',
    type: 'automatic',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date('2024-01-21T17:00:00'),
    assignee: '佐藤花子',
    relatedItem: {
      type: 'case',
      id: 'case-002'
    },
    createdAt: new Date('2024-01-15T11:00:00'),
    updatedAt: new Date('2024-01-15T11:00:00')
  }
]

// 通知データ
export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'warning',
    title: '期限切れタスクがあります',
    message: 'A社への契約書レビューシステム提案書作成が期限を過ぎています',
    timestamp: new Date('2024-01-15T16:30:00'),
    isRead: false,
    action: {
      label: '確認する',
      url: '/tasks/task-001'
    }
  },
  {
    id: 'notif-002',
    type: 'info',
    title: '新しいメールを受信しました',
    message: 'B社からの法務業務効率化に関するメールを受信しました',
    timestamp: new Date('2024-01-15T15:45:00'),
    isRead: true,
    action: {
      label: '確認する',
      url: '/communications/comm-002'
    }
  },
  {
    id: 'notif-003',
    type: 'success',
    title: 'タスクが完了しました',
    message: 'C社の契約書管理システム導入支援が完了しました',
    timestamp: new Date('2024-01-15T16:00:00'),
    isRead: false,
    action: {
      label: '確認する',
      url: '/tasks/task-003'
    }
  },
  {
    id: 'notif-004',
    type: 'info',
    title: '新しい案件が作成されました',
    message: 'D社のコンプライアンス監視システム導入案件が新規作成されました',
    timestamp: new Date('2024-01-15T14:00:00'),
    isRead: true,
    action: {
      label: '確認する',
      url: '/cases/case-004'
    }
  },
  {
    id: 'notif-005',
    type: 'warning',
    title: 'Ambient Agentが異常を検出しました',
    message: 'A社案件の進捗に遅延の可能性があります。早急な対応が必要です。',
    timestamp: new Date('2024-01-15T16:45:00'),
    isRead: false,
    action: {
      label: '確認する',
      url: '/ambient-agent'
    }
  },
  {
    id: 'notif-006',
    type: 'info',
    title: '法規制変更を検出しました',
    message: '個人情報保護法の改正により、A社案件の提案内容に影響があります',
    timestamp: new Date('2024-01-15T13:30:00'),
    isRead: false,
    action: {
      label: '詳細を確認',
      url: '/ambient-agent'
    }
  },
  {
    id: 'notif-007',
    type: 'success',
    title: '自動分析が完了しました',
    message: 'B社向け法務業務効率化事例の収集・分析が完了しました',
    timestamp: new Date('2024-01-15T12:15:00'),
    isRead: true,
    action: {
      label: '結果を確認',
      url: '/ambient-agent'
    }
  },
  {
    id: 'notif-008',
    type: 'warning',
    title: '競合動向を検出しました',
    message: '競合他社が同様のリーガルテックソリューションを発表しました',
    timestamp: new Date('2024-01-15T11:00:00'),
    isRead: false,
    action: {
      label: '詳細を確認',
      url: '/ambient-agent'
    }
  }
]

// 統計データ
export const mockStats = {
  communications: {
    total: mockCommunications.length,
    unread: mockCommunications.filter(c => c.status === 'unread').length,
    highPriority: mockCommunications.filter(c => c.priority === 'high').length
  },
  tasks: {
    total: mockTasks.length,
    completed: mockTasks.filter(t => t.status === 'completed').length,
    overdue: mockTasks.filter(t => new Date() > t.dueDate && t.status !== 'completed').length
  },
  cases: {
    total: mockCases.length,
    active: mockCases.filter(c => c.status !== 'closed_won' && c.status !== 'closed_lost').length,
    won: mockCases.filter(c => c.status === 'closed_won').length
  },
  actions: {
    total: mockActions.length,
    pending: mockActions.filter(a => a.status === 'pending').length,
    overdue: mockActions.filter(a => new Date() > a.dueDate && a.status !== 'completed').length
  }
} 