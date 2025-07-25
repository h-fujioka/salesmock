"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Input } from "@/components/ui/input"
import { SectionTitle } from "@/components/ui/section-title"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ColumnDef } from "@tanstack/react-table"
import { Bell, Calendar, ChevronDown, Plus, Send, User } from "lucide-react"
import React, { useState } from "react"

// ダッシュボードカードコンポーネント
function DashboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
      <SectionTitle title={title} />
      <div className="mt-4">
        {children}
      </div>
    </div>
  )
}

// ヘッダーコンポーネント
function Header({ onClear }: { onClear: () => void }) {
  return (
    <header className="h-14 min-h-14 w-full flex items-center justify-between bg-white/80 border-b shadow-sm">
              <span className="text-base font-bold tracking-tight">デモ画面</span>
      <div className="flex items-center gap-4">
        <input className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none" placeholder="検索..." />
        <Button variant="ghost" size="icon"><Calendar className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon"><Bell className="w-4 h-4" /></Button>
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <User className="w-5 h-5 text-gray-500" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}

export default function HomeV2() {
  // State定義
  const [command, setCommand] = useState("")
  const [currentTab, setCurrentTab] = useState('tasks')

  // ダミーデータ
  const taskData = [
    { priority: "高", taskName: "顧客へ見積送付", assignee: "山田太郎", deadline: "2024/07/10", daysLeft: "3日", status: "進行中", project: "【見積】A社向けシステム開発案件について", auto: "AI自動" },
    { priority: "中", taskName: "商談Bの準備", assignee: "鈴木一郎", deadline: "2024/07/12", daysLeft: "1日", status: "未着手", project: "【商談】B社向けDX推進プロジェクト", auto: "手動" },
    { priority: "高", taskName: "C社 提案書ドラフト作成", assignee: "佐藤花子", deadline: "2024/07/15", daysLeft: "2日", status: "進行中", project: "【提案書】C社向けAI導入プロジェクト", auto: "AI自動" },
    { priority: "中", taskName: "D社 定例会議準備", assignee: "田中次郎", deadline: "2024/07/13", daysLeft: "0日", status: "進行中", project: "【定例】D社向けサポート案件の進捗報告", auto: "手動" },
    { priority: "高", taskName: "E社 契約書レビュー", assignee: "山田太郎", deadline: "2024/07/09", daysLeft: "1日", status: "完了", project: "【契約更新】E社向け保守契約の更新手続き", auto: "AI自動" },
    { priority: "低", taskName: "F社 サポート対応", assignee: "鈴木一郎", deadline: "2024/07/20", daysLeft: "0日", status: "未着手", project: "【サポート】F社向けシステム障害対応", auto: "手動" },
    { priority: "高", taskName: "G社 進捗報告作成", assignee: "佐藤花子", deadline: "2024/07/11", daysLeft: "0日", status: "進行中", project: "【進捗報告】G社向け基幹システム改修プロジェクト", auto: "AI自動" },
    { priority: "中", taskName: "H社 顧客ヒアリング", assignee: "田中次郎", deadline: "2024/07/18", daysLeft: "0日", status: "進行中", project: "【ヒアリング】H社向け新規案件の要件確認", auto: "手動" },
    { priority: "低", taskName: "I社 サービス説明資料作成", assignee: "山田太郎", deadline: "2024/07/22", daysLeft: "0日", status: "未着手", project: "【資料作成】I社向けサービス説明資料", auto: "AI自動" },
    { priority: "高", taskName: "J社 受注処理", assignee: "鈴木一郎", deadline: "2024/07/14", daysLeft: "0日", status: "進行中", project: "【受注】J社向けクラウド移行プロジェクト", auto: "手動" }
  ]

  const riskData = [
    { priority: "高", project: "【緊急】新製品導入プロジェクトの期限超過について", assignee: "山田太郎", deadline: "2024/07/10", daysLeft: "3日", status: "進行中", risk: "期限超過" },
    { priority: "中", project: "【遅延】システム更改案件の進捗遅延について", assignee: "鈴木一郎", deadline: "2024/07/12", daysLeft: "1日", status: "未着手", risk: "進捗遅延" },
    { priority: "高", project: "【要望未対応】海外展開サポートの顧客要望について", assignee: "佐藤花子", deadline: "2024/07/15", daysLeft: "2日", status: "進行中", risk: "顧客要望未対応" },
    { priority: "中", project: "【承認遅延】契約更新交渉の承認プロセスについて", assignee: "田中次郎", deadline: "2024/07/18", daysLeft: "0日", status: "進行中", risk: "承認遅延" },
    { priority: "高", project: "【連絡途絶】新規サービス提案の顧客連絡について", assignee: "山田太郎", deadline: "2024/07/20", daysLeft: "0日", status: "未着手", risk: "顧客連絡途絶" },
    { priority: "中", project: "【技術課題】データ移行プロジェクトの技術的課題", assignee: "鈴木一郎", deadline: "2024/07/25", daysLeft: "5日", status: "進行中", risk: "技術的課題" },
    { priority: "高", project: "【リソース不足】セキュリティ強化案件の人員不足", assignee: "佐藤花子", deadline: "2024/07/16", daysLeft: "3日", status: "進行中", risk: "リソース不足" },
    { priority: "中", project: "【スケジュール】クラウド移行案件の遅延について", assignee: "田中次郎", deadline: "2024/07/19", daysLeft: "4日", status: "未着手", risk: "スケジュール遅延" },
    { priority: "高", project: "【予算超過】AI導入支援案件の予算超過について", assignee: "山田太郎", deadline: "2024/07/21", daysLeft: "6日", status: "進行中", risk: "予算超過" },
    { priority: "中", project: "【要件変更】業務効率化案件の要件変更について", assignee: "鈴木一郎", deadline: "2024/07/17", daysLeft: "2日", status: "進行中", risk: "要件変更" }
  ]

  // カラム定義
  const taskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "priority", header: "優先度", cell: info => <span className="text-black rounded px-2 py-0.5 text-sm font-normal bg-gray-100">{info.getValue()}</span> },
    { accessorKey: "taskName", header: "タスク名", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "assignee", header: "担当者", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "daysLeft", header: "残日数", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "auto", header: "AI/手動", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> }
  ]

  const riskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 text-sm font-normal ${info.getValue()==='高' ? 'bg-red-100' : 'bg-yellow-100'}`}>{info.getValue()}</span> },
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "assignee", header: "担当者", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
    { accessorKey: "risk", header: "リスク", cell: info => <span className="text-red-600 text-sm font-normal">{info.getValue()}</span> }
  ]

  const handleClear = () => {
    setCommand("")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onClear={handleClear} />
      
      <main className="flex-1 container mx-auto pt-8 pb-32">
        <div className="space-y-8">
          {/* タイトル */}
          <h1 className="text-center font-semibold text-[64px]">SalesOn v2</h1>

              {/* ダッシュボードエリア */}
          <div className="grid grid-cols-4 gap-4">
            {/* 進捗状況 */}
            <DashboardCard title="進捗状況">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>全体の進捗</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-gray-200 rounded-full h-2" style={{ width: '75%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>リスク案件</span>
                    <span>3件</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                      高: 2件
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                      中: 1件
                        </span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* チーム状況 */}
            <DashboardCard title="チーム状況">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>目標達成率</span>
                    <span>78%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gray-200 rounded-full h-2" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">山田太郎</span>
                          <div className="flex items-center gap-2">
                      <span className="text-xs">15件</span>
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-gray-200 rounded-full h-1.5" style={{ width: '75%' }} />
                            </div>
                          </div>
                        </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm truncate">鈴木一郎</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">10件</span>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div className="bg-gray-200 rounded-full h-1.5" style={{ width: '50%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* 優先タスク */}
            <DashboardCard title="優先タスク">
                  <div className="space-y-2">
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="truncate text-sm">顧客へ見積送付</div>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">残り3日</span>
                        </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="truncate text-sm">C社 提案書ドラフト作成</div>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">残り2日</span>
                  </div>
                <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div className="truncate text-sm">E社 契約書レビュー</div>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">残り1日</span>
                </div>
              </div>
            </DashboardCard>

            {/* アクション */}
            <DashboardCard title="アクション">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-200 rounded-lg p-2">
                      <div className="text-xs text-gray-700">未完了</div>
                  <div className="text-xl font-medium text-gray-700">5</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="text-xs text-gray-500">本日期限</div>
                  <div className="text-xl font-medium text-gray-700">2</div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="text-xs text-gray-500">完了</div>
                  <div className="text-xl font-medium text-gray-700">1</div>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-2">
                      <div className="text-xs text-gray-700">AI自動化</div>
                  <div className="text-xl font-medium text-gray-700">50%</div>
                </div>
              </div>
            </DashboardCard>
              </div>

          {/* タブ付きテーブル */}
          <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
                <Tabs defaultValue="tasks" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <TabsList className="bg-gray-100 flex-shrink-0">
                  <TabsTrigger value="tasks" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                    優先タスク
                    <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">3</span>
                  </TabsTrigger>
                  <TabsTrigger value="risks" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                    リスク案件
                    <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">2</span>
                  </TabsTrigger>
                      <TabsTrigger value="members" className="text-gray-700 font-normal text-sm">メンバー実績</TabsTrigger>
                      <TabsTrigger value="competitors" className="text-gray-700 font-normal text-sm">競合利用企業</TabsTrigger>
                      <TabsTrigger value="slips" className="text-gray-700 font-normal text-sm">スリップ案件</TabsTrigger>
                  <TabsTrigger value="ai-history" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                    AI承認待ち
                    <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">1</span>
                  </TabsTrigger>
                  <Button variant="ghost" size="icon" className="shrink-0 pl-4 pr-6">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TabsList>
                <div className="flex items-center gap-2">
                  <Input placeholder="検索..." className="w-48 text-base" />
                  <Button variant="outline" className="ml-2">
                    表示カラム <ChevronDown className="ml-2 w-4 h-4" />
                          </Button>
                    </div>
                  </div>

                  <TabsContent value="tasks">
                    <div className="overflow-x-auto">
                        <DataTable 
                    columns={taskColumns}
                          data={taskData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                    </div>
                  </TabsContent>

                  <TabsContent value="risks">
                    <div className="overflow-x-auto">
                        <DataTable 
                    columns={riskColumns}
                          data={riskData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

          {/* コマンド入力欄 */}
              <div className="fixed bottom-0 left-[72px] right-0 z-50 w-full flex justify-center pointer-events-none">
                <div className="w-full max-w-[1000px] mx-auto px-8 py-4 pointer-events-auto">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3 w-full">
                      <Textarea
                    placeholder="Selaへの依頼を入力してください"
                        value={command}
                    onChange={e => setCommand(e.target.value)}
                    className="command-textarea flex-1 resize-none h-[60px] min-h-[60px] bg-gray-50 border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base w-full"
                        rows={1}
                      />
                      <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                  >
                    <Send className="w-5 h-5 text-gray-500" />
                      </Button>
                </div>
              </div>
            </div>
                </div>
        </div>
      </main>
    </div>
  )
} 