'use client'

import { useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Bell, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

// タスクデータの型定義
interface TaskDetail {
  taskId: string
  task: string
  project: string
  customerType: string
  priority: string
  assignee: string
  deadline: string
  daysLeft: string
  status: string
  auto: string
  approval: string
  description?: string
  updates?: {
    date: string
    content: string
    user: string
  }[]
}

// タスク詳細のダミーデータ
const taskDetails: { [key: string]: TaskDetail } = {
  "task-001": {
    taskId: "task-001",
    task: "顧客Aへ見積送付",
    project: "A社案件",
    customerType: "新規",
    priority: "高",
    assignee: "山田太郎",
    deadline: "2024/07/10",
    daysLeft: "3日",
    status: "進行中",
    auto: "AI自動",
    approval: "承認待ち",
    description: "A社向けの新規案件の見積書を作成し送付する。競合他社との比較表も含める。",
    updates: [
      {
        date: "2024/07/07 15:30",
        content: "見積書の初版を作成完了",
        user: "山田太郎"
      },
      {
        date: "2024/07/07 16:45",
        content: "競合他社との比較表を追加",
        user: "Sela"
      }
    ]
  },
  "task-002": {
    taskId: "task-002",
    task: "商談Bの準備",
    project: "B社案件",
    customerType: "既存",
    priority: "中",
    assignee: "鈴木一郎",
    deadline: "2024/07/12",
    daysLeft: "1日",
    status: "未着手",
    auto: "手動",
    approval: "",
    description: "B社との定例商談の準備。前回の議事録の内容を確認し、新規提案資料を作成する。",
    updates: [
      {
        date: "2024/07/07 10:00",
        content: "前回の議事録を確認",
        user: "鈴木一郎"
      }
    ]
  }
}

export default function TaskDetail() {
  const params = useParams()
  const taskId = params.id as string
  const task = taskDetails[taskId]

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-xl font-bold tracking-tight">タスク詳細</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Calendar className="w-6 h-6" /></Button>
            <Button variant="ghost" size="icon"><Bell className="w-6 h-6" /></Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <User className="w-5 h-5 text-gray-500" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="container mx-auto py-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h1 className="text-xl font-semibold text-gray-900">タスクが見つかりません</h1>
            <p className="mt-2 text-gray-600">指定されたタスクは存在しないか、アクセス権限がありません。</p>
            <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              ホームに戻る
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="text-xl font-bold tracking-tight">タスク詳細</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon"><Calendar className="w-6 h-6" /></Button>
          <Button variant="ghost" size="icon"><Bell className="w-6 h-6" /></Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              <User className="w-5 h-5 text-gray-500" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="space-y-6">
          {/* タスク基本情報 */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{task.task}</h1>
                <p className="mt-1 text-gray-600">{task.project}</p>
              </div>
              <span className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ${
                task.priority === '高' ? 'bg-red-50 text-red-700' : 
                task.priority === '中' ? 'bg-yellow-50 text-yellow-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {task.priority}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">担当者</p>
                <p className="mt-1 text-gray-900">{task.assignee}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">顧客区分</p>
                <p className="mt-1 text-gray-900">{task.customerType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">期限</p>
                <p className="mt-1 text-gray-900">{task.deadline} (残り{task.daysLeft})</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ステータス</p>
                <p className="mt-1 text-gray-900">{task.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">実行タイプ</p>
                <p className="mt-1 text-gray-900">{task.auto}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">承認状態</p>
                <p className="mt-1 text-gray-900">{task.approval || '-'}</p>
              </div>
            </div>

            {task.description && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500">タスク詳細</p>
                <p className="mt-1 text-gray-900">{task.description}</p>
              </div>
            )}
          </div>

          {/* 更新履歴 */}
          {task.updates && task.updates.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900">更新履歴</h2>
              <div className="mt-4 space-y-4">
                {task.updates.map((update, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {update.user === 'Sela' ? 'AI' : update.user[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{update.user}</p>
                      <p className="text-sm text-gray-500">{update.date}</p>
                      <p className="mt-1 text-gray-900">{update.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 