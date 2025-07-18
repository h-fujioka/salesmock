"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bell, Calendar, CheckCircle, FileText, Mail, Play, Send, Settings, User, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// タイムラインエントリの型定義
type TimelineEntry = {
  id: string;
  timestamp: Date;
  action: string;
  details: Record<string, unknown>;
  type: 'ai' | 'human' | 'system';
  status?: 'pending' | 'approved' | 'rejected';
  reason?: string;
  source?: string; // 発生源（メール/議事録/AI検知）
};

// メッセージ型の定義
type Message = {
  content: string;
  type: 'question' | 'answer' | 'system';
};

type Comment = {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
};

// タスクの型定義
type Task = {
  taskId: string;
  task: string;
  caseName: string; // 案件名
  project: string;
  customerType: string;
  priority: string;
  assignee: string;
  deadline: string;
  daysLeft: string;
  status: string;
  auto: string;
  approval: string;
  description: string;
  progress: number;
  aiSuggestions: string[];
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

export default function TaskDetailClient({ task }: { task: Task }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState("");
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'communication' | 'ai-status'>('timeline');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [aiActionItems, setAiActionItems] = useState<AIActionItem[]>([]);
  const [selectedAIItem, setSelectedAIItem] = useState<AIActionItem | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

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
    const aiResponse = `タスク「${task.task}」について、以下の提案をいたします：

1. **進捗加速のための提案**：
   - 見積書の自動生成機能を活用
   - 顧客とのスケジュール調整を自動化
   - 関連資料の自動収集・整理

2. **リスク軽減のための提案**：
   - 期限前のリマインダー設定
   - 進捗状況の自動報告機能
   - 承認プロセスの自動化

3. **次のアクション**：
   - 見積書の最終確認（30分）
   - 顧客への送付準備（15分）
   - フォローアップスケジュール設定（10分）

これらの提案を実行しますか？`;

    setMessages(prev => [...prev, { content: aiResponse, type: 'answer' }]);
    setCommand("");
  };

  // Sela提案の実行
  const handleExecuteSuggestion = (suggestion: string) => {
    // Sela実行をタイムラインに追加
    addTimelineEntry(
      `Sela実行: ${suggestion}`,
      { action: suggestion, result: "実行完了" },
      'ai',
      'approved'
    );
    
    // Selaレスポンスをシミュレート
    const response = `Selaが「${suggestion}」を実行しました。`;
    setMessages(prev => [...prev, { content: response, type: 'answer' }]);
  };

  // 初期タイムラインを設定
  useEffect(() => {
    const initialTimeline: TimelineEntry[] = [
      {
        id: "entry-1",
        timestamp: new Date('2024-07-07T15:30:00'),
        action: "見積書の競合他社比較表を自動生成しました。",
        details: { type: "ai_execution", action: "競合比較表生成" },
        type: 'ai',
        status: 'approved',
        source: 'AI検知'
      },
      {
        id: "entry-2",
        timestamp: new Date('2024-07-07T15:00:00'),
        action: "見積書の内容を確認しました。価格設定は適切ですが、競合他社との差別化ポイントをより明確に記載することをお勧めします。",
        details: { type: "ai_review" },
        type: 'ai',
        status: 'approved'
      },
      {
        id: "entry-3",
        timestamp: new Date('2024-07-07T14:30:00'),
        action: "見積書のドラフトを作成しました。レビューをお願いします。",
        details: { type: "manual_work" },
        type: 'human'
      },
      {
        id: "entry-4",
        timestamp: new Date('2024-07-07T10:00:00'),
        action: "ステータスを「未着手」から「進行中」に変更しました。",
        details: { type: "status_change", from: "未着手", to: "進行中" },
        type: 'system'
      },
      {
        id: "entry-5",
        timestamp: new Date('2024-07-07T09:30:00'),
        action: "顧客の過去の取引履歴を分析し、最適な価格設定を提案しました。",
        details: { type: "ai_analysis" },
        type: 'ai',
        status: 'approved'
      },
      {
        id: "entry-6",
        timestamp: new Date('2024-07-06T09:00:00'),
        action: "メール内容を解析し、タスク「顧客Aへ見積送付」を自動生成しました。",
        details: { type: "task_creation" },
        type: 'ai',
        status: 'approved'
      }
    ];
    setTimeline(initialTimeline);
  }, []);

  // AI対応項目の初期データ
  useEffect(() => {
    const initialAIActions: AIActionItem[] = [
      {
        id: "ai-1",
        title: "フォローアップメール作成と送信",
        timestamp: new Date('2024-07-10T15:30:00'),
        details: [
          "前回提案から2週間経過",
          "製品導入に関する追加提案",
          "デモ環境の準備完了報告"
        ],
        assignee: "山田太郎",
        targetCompany: "株式会社ABC",
        status: 'pending'
      },
      {
        id: "ai-2",
        title: "提案書v2の作成と価格見直し",
        timestamp: new Date('2024-07-10T13:20:00'),
        details: [
          "提案書v2の作成完了",
          "価格の見直し",
          "導入スケジュールの調整",
          "付帯サービスの追加"
        ],
        assignee: "佐藤花子",
        targetCompany: "GHI商事",
        status: 'pending'
      }
    ];
    setAiActionItems(initialAIActions);
  }, []);

  // AI対応項目の承認
  const handleApproveAI = (itemId: string) => {
    setAiActionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'approved' as const } : item
    ));
    setShowAIModal(false);
    setSelectedAIItem(null);
  };

  // AI対応項目の修正
  const handleModifyAI = (itemId: string) => {
    setAiActionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'modified' as const } : item
    ));
    setShowAIModal(false);
    setSelectedAIItem(null);
  };

  // AI対応項目の却下
  const handleRejectAI = (itemId: string) => {
    setAiActionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'rejected' as const } : item
    ));
    setShowAIModal(false);
    setSelectedAIItem(null);
  };

  // AI対応項目の詳細表示
  const handleShowAIDetails = (item: AIActionItem) => {
    setSelectedAIItem(item);
    setShowAIModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header />
      
      {/* ナビゲーション */}
      <div>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 h-12">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホーム
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/" className="text-gray-600 hover:text-gray-600">
              タスク一覧
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-8">
        {/* タイトル */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.task}</h1>
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
                  {/* タイムラインエントリー部分 */}
                <div className="relative">
                    {/* 垂直線 - タイムラインエントリー部分のみ */}
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
                              {/* 発生源の表示 */}
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
                  {/* 顧客対応履歴エントリー部分 */}
                  <div className="relative">
                    {/* 垂直線 - 顧客対応履歴エントリー部分のみ */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-6">
                      {/* 提案書送付（最古） */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-purple-100">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">提案書送付</span>
                            </div>
                            <span className="text-xs text-gray-500">7/5 10:00</span>
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
                              <span className="text-sm font-medium text-gray-900">商談</span>
                            </div>
                      <span className="text-xs text-gray-500">7/6 14:00</span>
                    </div>
                    <p className="text-sm text-gray-700">初回商談：予算・要件の確認完了</p>
                    <p className="text-xs text-gray-500 mt-1">参加者: 山田太郎、顧客A担当者</p>
                        </div>
                  </div>

                      {/* メール対応（最新） */}
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-blue-100">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">メール対応</span>
                            </div>
                            <span className="text-xs text-gray-500">7/7 15:30</span>
                          </div>
                          <p className="text-sm text-gray-700">顧客Aから見積書の詳細について問い合わせ</p>
                          <p className="text-xs text-gray-500 mt-1">件名: 見積書について</p>
                        </div>
                      </div>
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

              {/* AI対応状況タブ内容 */}
              {activeTab === 'ai-status' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {aiActionItems.map((item) => (
                        <tr 
                          key={item.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleShowAIDetails(item)}
                        >
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900">{item.title}</span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {item.timestamp.toLocaleString('ja-JP', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'approved' ? 'bg-green-100 text-green-800' :
                              item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              item.status === 'modified' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status === 'approved' ? '承認済み' :
                               item.status === 'rejected' ? '却下' :
                               item.status === 'modified' ? '修正済み' :
                               '承認待ち'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Sela */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {/* Selaヘッダー */}
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Selaからの提案</h3>
              </div>
              
              {/* Sela提案 */}
              <div className="mb-6">
                <div className="space-y-3">
                  {task.aiSuggestions.map((suggestion) => (
                    <div key={suggestion} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{suggestion}</span>
                      <Button 
                        size="sm" 
                        onClick={() => handleExecuteSuggestion(suggestion)}
                        variant="outline"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        リプレイ
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

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
          <div className="bg-white rounded-lg border shadow-sm">
            {/* 案件名（一番上） */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">案件名</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm font-medium text-gray-900">{task.caseName}</div>
            </div>

            {/* タスク名 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">タスク名</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm font-medium text-gray-900">{task.task}</div>
            </div>

            {/* 期限・進捗 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">期限・進捗</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">期限</span>
                  <span className="text-xs font-medium text-gray-900">{task.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">残り</span>
                  <span className="text-xs font-medium text-gray-900">{task.daysLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">進捗</span>
                  <span className="text-xs font-medium text-gray-900">{task.progress}%</span>
                </div>
                {/* 進捗バー */}
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gray-900 h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 担当者 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">担当者</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs">{task.assignee.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-900">{task.assignee}</span>
              </div>
            </div>

            {/* プロジェクト */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">プロジェクト</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-900">{task.project}</div>
            </div>

            {/* 説明 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">説明</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">{task.description}</div>
            </div>

            {/* 優先度 */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-base font-medium text-gray-900 mb-2">優先度</h3>
              <div className="space-y-1">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                  task.priority === '高' ? 'bg-red-100 text-red-800' :
                  task.priority === '中' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            </div>

            {/* ステータス */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-base font-medium text-gray-900 mb-2">ステータス</h3>
              <div className="space-y-1">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                  task.status === '完了' ? 'bg-green-100 text-green-800' :
                  task.status === '進行中' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>

            {/* 顧客属性 */}
            <div className="p-4">
              <h3 className="text-base font-medium text-gray-900 mb-2">顧客属性</h3>
              <div className="space-y-1">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  {task.customerType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

          {/* AI対応詳細モーダル */}
          {showAIModal && selectedAIItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">AI対応詳細</h3>
                  <button 
                    onClick={() => {
                      setShowAIModal(false);
                      setSelectedAIItem(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">{selectedAIItem.title}</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      {selectedAIItem.timestamp.toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">詳細内容</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedAIItem.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <Button 
                      size="sm" 
                      onClick={() => handleApproveAI(selectedAIItem.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      承認
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleModifyAI(selectedAIItem.id)}
                      className="flex-1"
                    >
                      修正
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRejectAI(selectedAIItem.id)}
                      className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                    >
                      却下
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
  );
} 