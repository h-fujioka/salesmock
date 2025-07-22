"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bell, Calendar, CheckCircle, FileText, Mail, Send, User, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 案件詳細の型定義
type CaseDetail = {
  id: string;
  name: string;
  customer: string;
  customerType: "新規" | "既存";
  progress: number;
  risk: "高" | "中" | "低";
  deadline: string;
  priority: "高" | "中" | "低";
  status: "進行中" | "完了" | "保留" | "失注";
  source: "メール" | "議事録" | "AI検知";
  assignee: string;
  relatedTasks: number;
  lastUpdated: string;
  description: string;
  budget: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
};

// タイムラインエントリの型定義
type TimelineEntry = {
  id: string;
  timestamp: Date;
  action: string;
  details: Record<string, unknown>;
  type: 'ai' | 'human' | 'system';
  status?: 'pending' | 'approved' | 'rejected';
  reason?: string;
  source?: string;
};

// メッセージ型の定義
type Message = {
  content: string;
  type: 'question' | 'answer' | 'system';
};

// コメントの型定義
type Comment = {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
};

// AI対応項目の型定義
type AIActionItem = {
  id: string;
  title: string;
  timestamp: Date;
  details: string[];
  assignee: string;
  targetCompany: string;
  status: 'pending' | 'approved' | 'rejected' | 'modified';
};

// ヘッダーコンポーネント
function Header() {
  return (
    <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
      <span className="text-xl font-bold tracking-tight">デモ画面</span>
      <div className="flex items-center gap-4">
        <input className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none" placeholder="検索..." />
        <Button variant="ghost" size="icon"><Calendar className="w-6 h-6" /></Button>
        <Button variant="ghost" size="icon"><Bell className="w-6 h-6" /></Button>
        <Avatar className="w-8 h-8">
          <AvatarFallback>
            <User className="w-5 h-5 text-gray-500" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  // 状態管理
  const [activeTab, setActiveTab] = useState<'timeline' | 'communication' | 'ai-status'>('timeline');
  const [isEditing, setIsEditing] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState("");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [aiActionItems, setAiActionItems] = useState<AIActionItem[]>([]);
  const [selectedAIItem, setSelectedAIItem] = useState<AIActionItem | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  // ダミーデータ（実際の実装ではAPIから取得）
  const caseDetail: CaseDetail = {
    id: caseId,
    name: "新製品導入についてのご相談",
    customer: "株式会社みらいテック",
    customerType: "新規",
    progress: 80,
    risk: "高",
    deadline: "2024/07/10",
    priority: "高",
    status: "進行中",
    source: "メール",
    assignee: "山田太郎",
    relatedTasks: 5,
    lastUpdated: "2024/07/10 15:30",
    description: "顧客からの新製品導入に関する相談案件です。既存システムとの連携や導入スケジュールについて詳細な検討が必要です。",
    budget: "¥5,000,000",
    contactPerson: "田中様",
    contactEmail: "tanaka@miraitech.co.jp",
    contactPhone: "03-1234-5678"
  };

  // コメント追加ハンドラー
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content: commentText,
      timestamp: new Date(),
      author: "山田太郎"
    };
    
    setComments(prev => [newComment, ...prev]);
    setCommentText("");
  };

  // タイムラインエントリを自動追加する関数
  const addTimelineEntry = (action: string, details: Record<string, unknown>, type: 'ai' | 'human' | 'system', status?: 'pending' | 'approved' | 'rejected', reason?: string) => {
    const entry: TimelineEntry = {
      id: `entry-${Date.now()}`,
      timestamp: new Date(),
      action,
      details,
      type,
      status,
      reason
    };
    
    setTimeline(prev => [entry, ...prev]);
    return entry;
  };

  // Selaへの指示送信
  const handleSend = async () => {
    if (!command.trim()) return;

    // ユーザーのメッセージを履歴に追加
    setMessages(prev => [...prev, { content: command, type: 'question' }]);

    // Selaレスポンスをシミュレート
    const aiResponse = `案件「${caseDetail.name}」について、以下の提案をいたします：

1. **進捗加速のための提案**：
   - 提案書の自動生成機能を活用
   - 顧客とのスケジュール調整を自動化
   - 関連資料の自動収集・整理

2. **リスク軽減のための提案**：
   - 期限前のリマインダー設定
   - 進捗状況の自動報告機能
   - 承認プロセスの自動化

3. **次のアクション**：
   - 提案書の最終確認（30分）
   - 顧客への送付準備（15分）
   - フォローアップスケジュール設定（10分）

これらの提案を実行しますか？`;

    setMessages(prev => [...prev, { content: aiResponse, type: 'answer' }]);
    setCommand("");
  };

  // 初期タイムラインを設定
  useEffect(() => {
    const initialTimeline: TimelineEntry[] = [
      {
        id: "entry-1",
        timestamp: new Date('2024-07-10T15:30:00'),
        action: "進捗率を80%に更新しました。提案書の作成が完了し、顧客からのフィードバックを待機中です。",
        details: { type: "progress_update", progress: 80 },
        type: 'human',
        source: '手動更新'
      },
      {
        id: "entry-2",
        timestamp: new Date('2024-07-10T14:15:00'),
        action: "顧客との次回ミーティングを7月15日に設定しました。議事録の準備が必要です。",
        details: { type: "meeting_schedule" },
        type: 'human',
        source: '手動更新'
      },
      {
        id: "entry-3",
        timestamp: new Date('2024-07-10T13:00:00'),
        action: "提案書の作成を自動生成しました。レビューをお願いします。",
        details: { type: "ai_proposal" },
        type: 'ai',
        status: 'approved',
        source: 'AI検知'
      },
      {
        id: "entry-4",
        timestamp: new Date('2024-07-10T10:30:00'),
        action: "メールから案件を自動作成しました。新規顧客のため、詳細なヒアリングが必要です。",
        details: { type: "case_creation" },
        type: 'ai',
        status: 'approved',
        source: 'メール'
      }
    ];
    setTimeline(initialTimeline);
  }, []);

  // AI対応項目の初期データ
  useEffect(() => {
    const initialAIActions: AIActionItem[] = [
      {
        id: "ai-1",
        title: "提案書の自動生成",
        timestamp: new Date('2024-07-10T13:00:00'),
        details: [
          "顧客の要件に基づく提案書を自動生成",
          "競合他社との比較分析を含む",
          "価格設定の最適化提案"
        ],
        assignee: "山田太郎",
        targetCompany: caseDetail.customer,
        status: 'approved'
      },
      {
        id: "ai-2",
        title: "スケジュール調整の自動化",
        timestamp: new Date('2024-07-10T14:00:00'),
        details: [
          "顧客とのミーティングスケジュールを自動調整",
          "参加者の空き時間を自動確認",
          "会議室の自動予約"
        ],
        assignee: "山田太郎",
        targetCompany: caseDetail.customer,
        status: 'pending'
      }
    ];
    setAiActionItems(initialAIActions);
  }, [caseDetail.customer]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* パンくずナビゲーション */}
      <div>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 h-12">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホーム
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/cases" className="text-gray-600 hover:text-gray-600">
              案件一覧
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">
        {/* タイトル */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{caseDetail.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-3 space-y-6">

            {/* タイムライン・対応履歴 */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {/* タブ */}
              <div className="flex space-x-1 mb-4">
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === 'timeline'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  作業タイムライン
                </button>
                <button
                  onClick={() => setActiveTab('communication')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === 'communication'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  顧客対応履歴
                </button>
                <button
                  onClick={() => setActiveTab('ai-status')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeTab === 'ai-status'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  AI対応状況
                </button>
              </div>

              {/* 作業タイムライン */}
              {activeTab === 'timeline' && (
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {timeline.map((entry, index) => (
                        <div key={entry.id} className="relative flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 ${
                            entry.type === 'ai' ? 'bg-blue-100' :
                            entry.type === 'human' ? 'bg-green-100' :
                            'bg-gray-100'
                          }`}>
                            {entry.type === 'ai' ? (
                              <Zap className="w-4 h-4 text-blue-600" />
                            ) : entry.type === 'human' ? (
                              <User className="w-4 h-4 text-green-600" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {entry.type === 'ai' ? 'Sela' :
                                   entry.type === 'human' ? '山田太郎' :
                                   'システム'}
                                </span>
                                {entry.source && (
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                    {entry.source}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {entry.timestamp.toLocaleString('ja-JP', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{entry.action}</p>
                            {entry.reason && (
                              <p className="text-xs text-gray-500 mt-1">理由: {entry.reason}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* コメント表示 */}
                  {comments.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className="relative flex items-start space-x-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-gray-100">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">コメント</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {comment.timestamp.toLocaleString('ja-JP', {
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 統一されたコメント入力欄 */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="コメントを入力..."
                        className="min-h-[60px] text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                      />
                      <div className="flex justify-end">
                        <Button size="sm" className="text-xs" onClick={handleAddComment} disabled={!commentText.trim()}>
                          コメント追加
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 顧客対応履歴 */}
              {activeTab === 'communication' && (
                <div>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {/* 提案書送付 */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-purple-100">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">提案書送付</span>
                            </div>
                            <span className="text-xs text-gray-500">7/8 10:00</span>
                          </div>
                          <p className="text-sm text-gray-700">初期提案書を送付、顧客から好意的な反応</p>
                          <p className="text-xs text-gray-500 mt-1">顧客A担当者宛</p>
                        </div>
                      </div>

                      {/* 商談履歴 */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-green-100">
                          <Users className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">初回商談</span>
                            </div>
                            <span className="text-xs text-gray-500">7/5 14:00</span>
                          </div>
                          <p className="text-sm text-gray-700">顧客との初回ミーティング実施、要件の詳細確認</p>
                          <p className="text-xs text-gray-500 mt-1">参加者: 山田太郎、顧客A担当者</p>
                        </div>
                      </div>

                      {/* 問い合わせ履歴 */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-blue-100">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">問い合わせ対応</span>
                            </div>
                            <span className="text-xs text-gray-500">7/3 16:30</span>
                          </div>
                          <p className="text-sm text-gray-700">顧客Aから見積書の詳細について問い合わせ</p>
                          <p className="text-xs text-gray-500 mt-1">対応者: 山田太郎</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI対応状況 */}
              {activeTab === 'ai-status' && (
                <div>
                  <div className="space-y-4">
                    {aiActionItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{item.title}</h4>
                              <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                                item.status === 'approved' ? 'bg-green-100 text-green-700' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {item.status === 'approved' ? '承認済み' :
                                 item.status === 'pending' ? '承認待ち' :
                                 item.status === 'rejected' ? '却下' : '修正済み'}
                              </span>
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {item.details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-gray-400">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                              <span>担当: {item.assignee}</span>
                              <span>対象: {item.targetCompany}</span>
                              <span>{item.timestamp.toLocaleDateString('ja-JP')}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {item.status === 'pending' && (
                              <>
                                <Button size="sm" variant="outline" className="text-xs">
                                  承認
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  修正
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  却下
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selaとの対話エリア */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selaとの対話</h3>
              
              {/* メッセージ履歴 */}
              <div className="mb-4">
                <div className="space-y-4 max-h-48 overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.type === 'question' 
                          ? 'bg-gray-900 text-white' 
                          : msg.type === 'system'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 入力欄 */}
              <div className="flex space-x-2 mt-4">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Selaに依頼しましょう..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!command.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* コンパクトな右サイドバー */}
          <div className="space-y-6">
            {/* 案件情報 */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-base font-medium text-gray-900 mb-3">案件情報</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">顧客名</label>
                  <p className="text-sm text-gray-900">{caseDetail.customer}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">顧客区分</label>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                    caseDetail.customerType === '新規' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {caseDetail.customerType}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">担当者</label>
                  <p className="text-sm text-gray-900">{caseDetail.assignee}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">発生源</label>
                  <p className="text-sm text-gray-900">{caseDetail.source}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">優先度</label>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                    caseDetail.priority === '高' ? 'bg-red-100 text-red-700' :
                    caseDetail.priority === '中' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {caseDetail.priority}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">リスク</label>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                    caseDetail.risk === '高' ? 'bg-red-100 text-red-700' :
                    caseDetail.risk === '中' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {caseDetail.risk}
                  </span>
                </div>
              </div>
            </div>

            {/* 進捗・期限 */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-base font-medium text-gray-900 mb-3">進捗・期限</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-gray-600">進捗</label>
                    <span className="text-xs text-gray-600">{caseDetail.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${caseDetail.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">期限</label>
                  <p className="text-sm text-gray-900">{caseDetail.deadline}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">ステータス</label>
                  <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                    caseDetail.status === '進行中' ? 'bg-blue-100 text-blue-700' :
                    caseDetail.status === '完了' ? 'bg-green-100 text-green-700' :
                    caseDetail.status === '保留' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {caseDetail.status}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">関連タスク</label>
                  <p className="text-sm text-gray-900">{caseDetail.relatedTasks}件</p>
                </div>
              </div>
            </div>

            {/* 連絡先 */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-base font-medium text-gray-900 mb-3">連絡先</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">担当者</label>
                  <p className="text-sm text-gray-900">{caseDetail.contactPerson}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">メール</label>
                  <p className="text-sm text-gray-900">{caseDetail.contactEmail}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">電話</label>
                  <p className="text-sm text-gray-900">{caseDetail.contactPhone}</p>
                </div>
              </div>
            </div>

            {/* 顧客属性 */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-base font-medium text-gray-900 mb-2">顧客属性</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">予算</label>
                  <p className="text-sm text-gray-900">{caseDetail.budget}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">最終更新</label>
                  <p className="text-sm text-gray-900">{caseDetail.lastUpdated}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 