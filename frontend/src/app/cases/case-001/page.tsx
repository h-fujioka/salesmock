"use client";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertTriangle,
    Building,
    Calendar,
    FileText,
    Home,
    Info,
    Mail,
    MessageSquare,
    MoreVertical,
    RotateCcw,
    Settings,
    Star,
    User
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// 案件データの型定義
type Case = {
  id: string;
  name: string;
  company: string;
  customerType: "新規" | "既存";
  status: "提案中" | "進行中" | "完了" | "保留" | "失注";
  priority: "高" | "中" | "低";
  assignee: string;
  stakeholders: string[];
  customerOwner: string;
  customerStakeholders: string[];
  project: string;
  description: string;
  budget: string;
  deadline: string;
  progress: number;
  firstContact: string;
  lastContact: string;
  taskCount: number;
  emailCount: number;
};

// タイムラインエントリの型定義
type TimelineEntry = {
  id: string;
  timestamp: Date;
  type: 'email' | 'comment' | 'meeting' | 'ai' | 'system';
  title: string;
  content: string;
  author?: string;
  replies?: number;
  attachments?: string[];
  warning?: boolean;
  status?: 'pending' | 'completed' | 'cancelled';
};

// コメントの型定義
type Comment = {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
  authorAvatar?: string;
};

export default function CaseDetailPage() {
  const [commentText, setCommentText] = useState('');
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

  // リアルな案件データ
  const caseData: Case = {
    id: "case-001",
    name: "LegalOn Cloudのご紹介 (佐藤様)",
    company: "株式会社クロステック",
    customerType: "新規",
    status: "提案中",
    priority: "高",
    assignee: "Hirokazu Tanaka",
    stakeholders: ["木村拓真", "中村 結衣", "田中次郎"],
    customerOwner: "佐藤二郎",
    customerStakeholders: ["山田太郎", "高橋洋子", "西野淳一", "鈴木美咲"],
    project: "クロステック様法務業務効率化PJ",
    description: "クロステック様は現在、契約業務のクラウド化を検討されており、LegalOn Cloudの導入にご興味をお持ちです。現在はPoC（概念実証）の提案段階で、具体的な導入スコープとROIの検討を行っています。既存の契約管理システムとの連携や、社内の承認フローの最適化も含めた包括的なソリューションを求められています。",
    budget: "500万円〜800万円",
    deadline: "2024年8月31日",
    progress: 65,
    firstContact: "2024年6月1日 09:00",
    lastContact: "2024年7月20日 12:01",
    taskCount: 5,
    emailCount: 12
  };

  // リアルなタイムラインデータ
  const timelineData: TimelineEntry[] = [
    {
      id: "1",
      timestamp: new Date('2024-07-20T12:01:00'),
      type: 'email',
      title: "LegalOn営業 → info@crosstech.co.jp",
      content: "契約書レビュー支援ツールのご提案について、詳細な資料を添付いたします。ご検討いただけますと幸いです。",
      author: "LegalOn営業",
      replies: 3,
      attachments: ["proposal_20240720.pdf", "comparison_table.xlsx"]
    },
    {
      id: "2",
      timestamp: new Date('2024-07-20T14:21:00'),
      type: 'comment',
      title: "ディスカウントの依頼について",
      content: "佐藤様からディスカウントの依頼が来ているのですが、どのように進めましょうか？価格交渉の戦略を検討する必要があります。",
      author: "Hirokazu Tanaka",
      replies: 1
    },
    {
      id: "3",
      timestamp: new Date('2024-07-20T14:34:00'),
        type: 'ai',
      title: "AI提案: 返信保留の理由",
      content: "佐藤様からのメール、以下の理由で返信保留しました:\n\n• ご質問の内容が曖昧 (導入済か検討中かが不明)\n• 製品AとBの混在に関する記載あり\n• 予算範囲の確認が必要\n\nご確認のうえ、対応方針を教えていただけますか？必要なら下書きの作成も承ります！",
      author: "Sela",
      warning: true
    },
    {
      id: "4",
      timestamp: new Date('2024-07-19T15:30:00'),
      type: 'meeting',
      title: "初回商談実施",
      content: "佐藤様との初回商談を実施。契約業務の現状課題とLegalOn Cloudの導入効果について詳細な議論を行いました。",
      author: "Hirokazu Tanaka",
      status: 'completed'
    },
    {
      id: "5",
      timestamp: new Date('2024-07-18T10:15:00'),
      type: 'email',
      title: "info@crosstech.co.jp → LegalOn営業",
      content: "LegalOn Cloudについて興味があります。詳細な資料とデモのご提案をお願いします。",
      author: "佐藤二郎",
      replies: 2
    }
  ];

  // リアルなコメントデータ
  const commentsData: Comment[] = [
    {
      id: "1",
      content: "CorporeteOnも関心あり。競合他社との比較資料も準備しておきましょう。",
      timestamp: new Date('2024-07-20T10:30:00'),
      author: "Hirokazu Tanaka",
      authorAvatar: "HT"
    },
    {
      id: "2",
      content: "予算交渉の際は、ROIの具体的な数値も提示する必要がありますね。",
      timestamp: new Date('2024-07-19T16:45:00'),
      author: "木村拓真",
      authorAvatar: "KT"
    },
    {
      id: "3",
      content: "技術的な質問が来る可能性が高いので、技術資料も準備しておきましょう。",
      timestamp: new Date('2024-07-19T14:20:00'),
      author: "中村 結衣",
      authorAvatar: "NY"
    }
  ];

  // 案件一覧データ（左サイドバー用）
  const caseListData = [
    { id: "case-001", name: "LegalOn Cloudのご紹介 (佐藤様)", company: "株式会社クロステック", status: "提案中", priority: "高" },
    { id: "case-002", name: "契約管理システム導入支援", company: "株式会社テックソリューション", status: "進行中", priority: "中" },
    { id: "case-003", name: "法務業務効率化コンサルティング", company: "ABC株式会社", status: "完了", priority: "低" },
    { id: "case-004", name: "新規サービス提案", company: "XYZコーポレーション", status: "保留", priority: "高" },
    { id: "case-005", name: "契約書テンプレート作成支援", company: "株式会社イノベーション", status: "進行中", priority: "中" }
  ];

  // ブックマーク案件データ
  const bookmarkData = [
    { id: "case-001", name: "LegalOn Cloudのご紹介 (佐藤様)", company: "株式会社クロステック" },
    { id: "case-002", name: "契約管理システム導入支援", company: "株式会社テックソリューション" }
  ];

  const handleAddComment = () => {
    if (commentText.trim()) {
      // コメント追加のロジック
      setCommentText('');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* ヘッダー */}
      <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white border-b shadow-sm">
        <span className="text-xl font-bold tracking-tight">デモ画面</span>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Calendar className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback>HT</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* パンくず */}
      <nav className="flex items-center space-x-2 text-xs text-gray-600 px-8 pt-6 mb-6">
        <Home className="w-4 h-4" />
        <span>&gt;</span>
        <Link href="/cases" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">案件一覧</Link>
        <span>&gt;</span>
        <span className="text-gray-700 font-medium">{caseData.name}</span>
      </nav>

      {/* 3カラムレイアウト */}
      <div className="flex flex-1 w-full px-8 gap-6 min-h-0">
        {/* 左サイドバー: Slack風ナビゲーション */}
        <aside className="w-80 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="py-6">
            {/* 現在の案件セクション */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 text-base font-medium text-gray-600 px-4">
                <span>▼</span>
                <span>現在の案件</span>
              </div>
              <div className="space-y-1">
                <div className="p-3 bg-gray-100 border-gray-400">
                  <div className="text-sm font-medium text-gray-700">{caseData.name}</div>
                </div>
              </div>
            </div>

            {/* 案件一覧セクション */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 text-base font-medium text-gray-600 px-4">
                <span>▼</span>
                <span>案件一覧</span>
              </div>
              <div className="space-y-1">
                {caseListData.map((caseItem) => (
                  <Link key={caseItem.id} href={`/cases/${caseItem.id}/`} className="block">
                    <div className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors px-4">
                      <div className="text-sm text-gray-700">{caseItem.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ブックマークセクション */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 text-base font-medium text-gray-600 px-4">
                <span>▼</span>
                <span>ブックマーク</span>
              </div>
              <div className="space-y-1">
                {bookmarkData.map((caseItem) => (
                  <Link key={caseItem.id} href={`/cases/${caseItem.id}/`} className="block">
                    <div className="p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors px-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <div className="text-sm text-gray-700">{caseItem.name}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* 中央: タイムライン */}
        <main className="flex-1 flex flex-col min-h-0">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col min-h-0">
            {/* ヘッダー部分 */}
            <div className="p-6 pb-4">
              <h1 className="text-xl font-bold text-gray-700 mb-4">{caseData.name}</h1>
            </div>

            {/* タイムラインコンテンツ - スクロール可能エリア */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6">
              <Tabs defaultValue="timeline" className="w-full h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="timeline">タイムライン</TabsTrigger>
                  <TabsTrigger value="slack">Slack</TabsTrigger>
                  <TabsTrigger value="email">メール</TabsTrigger>
                </TabsList>
                
                <TabsContent value="timeline" className="flex-1">
                  <div>
                    {timelineData.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="pt-6 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0 relative group hover:bg-gray-50 rounded-lg px-2 py-2 transition-colors"
                        onMouseEnter={() => setHoveredEntry(entry.id)}
                        onMouseLeave={() => setHoveredEntry(null)}
                      >
                        {/* ホバー時のアクションアイコン */}
                        {hoveredEntry === entry.id && (
                          <div className="absolute top-0 right-0 flex items-center gap-3 bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                              <Star className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                              <Info className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                              <MoreVertical className="w-3 h-3" />
                            </Button>
                          </div>
                        )}

                        {entry.type === 'email' && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Mail className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-base font-semibold text-gray-700">{entry.title}</div>
                                <div className="text-xs text-gray-500">
                                  {entry.timestamp.toLocaleDateString('ja-JP', {
                                    month: 'numeric',
                                    day: 'numeric'
                                  })} {entry.timestamp.toLocaleTimeString('ja-JP', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="ml-11">
                              <div className="text-base text-gray-700 mb-1">{entry.content}</div>
                              {entry.attachments && (
                                <div className="flex items-center gap-1 mb-1">
                                  <FileText className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">{entry.attachments.join(', ')}</span>
                                </div>
                              )}
                              {entry.replies && (
                                <div className="text-xs text-gray-500">{entry.replies}件の返信</div>
                              )}
                            </div>
                          </div>
                        )}

                        {entry.type === 'comment' && (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{entry.author?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base font-semibold text-gray-700">{entry.author}</span>
                                  <span className="text-xs text-gray-500">
                                    {entry.timestamp.toLocaleTimeString('ja-JP', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                <div className="text-base text-gray-700">{entry.content}</div>
                                {entry.replies && (
                                  <div className="text-xs text-gray-500 mt-2">{entry.replies}件の返信</div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {entry.type === 'ai' && (
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Avatar className="w-8 h-8 bg-gray-100">
                                <AvatarFallback className="text-gray-600 text-xs">AI</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base font-semibold text-gray-700">{entry.author}</span>
                                  <span className="text-xs text-gray-500">
                                    {entry.timestamp.toLocaleTimeString('ja-JP', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                                {entry.warning && (
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-gray-600" />
                                    <span className="text-base text-gray-700">{entry.title}</span>
                                  </div>
                                )}
                                <div className="text-base text-gray-700 whitespace-pre-line">{entry.content}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {entry.type === 'meeting' && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-gray-600" />
                              </div>
                              <div className="flex-1">
                                <div className="text-base font-semibold text-gray-700">{entry.title}</div>
                                <div className="text-xs text-gray-500">
                                  {entry.timestamp.toLocaleDateString('ja-JP', {
                                    month: 'numeric',
                                    day: 'numeric'
                                  })} {entry.timestamp.toLocaleTimeString('ja-JP', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="ml-11">
                              <div className="text-base text-gray-700 mb-1">{entry.content}</div>
                              <div className="text-xs text-gray-500">参加者: {entry.author}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="slack" className="">
                  <div className="text-center py-8 text-gray-500">
                    Slackのメッセージがここに表示されます
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="">
                  <div className="text-center py-8 text-gray-500">
                    メールの履歴がここに表示されます
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* コメント入力エリア - 最下部に固定 */}
            <div className="p-6 pt-4 border-t border-gray-200 bg-white">
              <Textarea
                placeholder="コメントを入力..."
                className="w-full mb-4 resize-none"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <FileText className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <User className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                  投稿
                </Button>
              </div>
            </div>
          </div>
        </main>

        {/* 右サイドバー: 案件情報 */}
        <aside className="w-80 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="">
            {/* 案件主担当者 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">案件主担当者</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs">HT</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-700">{caseData.assignee}</span>
              </div>
            </div>

            {/* 案件関係者 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">案件関係者</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {caseData.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs">{stakeholder.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-700">{stakeholder}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 企業 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">企業</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{caseData.company}</span>
              </div>
            </div>

            {/* 顧客主担当者 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">顧客主担当者</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-sm text-gray-700">{caseData.customerOwner}</span>
            </div>

            {/* 顧客関係者 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">顧客関係者</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {caseData.customerStakeholders.map((stakeholder, index) => (
                  <div key={index} className="text-sm text-gray-700">{stakeholder}</div>
                ))}
              </div>
            </div>

            {/* プロジェクト */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">プロジェクト</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-sm text-gray-700">{caseData.project}</span>
            </div>

            {/* 説明 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-700">説明</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{caseData.description}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
} 