"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bell, Calendar, CheckCircle, Play, Send, Settings, User, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

// ヘッダーコンポーネント
function Header({ onClear }: { onClear: () => void }) {
  return (
    <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
      <span className="text-xl font-bold tracking-tight">SalesOn デモ画面</span>
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

// タイムラインエントリの型定義
type TimelineEntry = {
  id: string;
  timestamp: Date;
  action: string;
  details: any;
  type: 'ai' | 'human' | 'system';
  status?: 'pending' | 'approved' | 'rejected';
  reason?: string;
};

// ダミータスクデータ
const dummyTasks = [
  {
    taskId: "task-001",
    task: "顧客Aへ見積送付",
    project: "リーガル社新規銃中案件",
    customerType: "新規",
    priority: "高",
    assignee: "山田太郎",
    deadline: "2024/07/10",
    daysLeft: "3日",
    status: "進行中",
    auto: "Sela自動",
    approval: "承認待ち",
    description: "顧客Aに見積書を送付するタスクです。前回の商談内容を踏まえて、適切な価格設定とサービス内容を含めた見積書を作成します。",
    progress: 60,
    aiSuggestions: [
      "見積書に競合他社との比較表を追加",
      "顧客の予算に合わせた複数プランの提示",
      "過去の成功事例を添付資料として追加"
    ]
  },
  {
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
    description: "B社との次回商談に向けた準備を行います。前回の議事録を確認し、顧客の課題とニーズを整理して、効果的な提案資料を作成します。",
    progress: 0,
    aiSuggestions: [
      "前回商談の議事録から主要な課題を抽出",
      "競合他社の動向調査を実施",
      "顧客の業界動向を調査して提案内容に反映"
    ]
  }
];

// メッセージ型の定義
type Message = {
  content: string;
  type: 'question' | 'answer' | 'system';
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const task = dummyTasks.find(t => t.taskId === id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  if (!task) return notFound();

  // タイムラインエントリを自動追加する関数
  const addTimelineEntry = (action: string, details: any, type: 'ai' | 'human' | 'system', status?: 'pending' | 'approved' | 'rejected', reason?: string) => {
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

    setAiResponse(aiResponse);
    setMessages(prev => [...prev, { content: aiResponse, type: 'answer' }]);
    setCommand("");
  };

  // タスク編集
  const handleEdit = () => {
    setIsEditing(true);
  };

  // タスク保存
  const handleSave = () => {
    setIsEditing(false);
    addTimelineEntry(
      "タスク情報更新",
      { task: editedTask?.task || task.task },
      'human'
    );
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
        status: 'pending'
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <Header onClear={() => {}} />
      
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">

            {/* タイムライン */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">タイムライン</h3>
              <div className="relative">
                {/* 垂直線 */}
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
                            {entry.status && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                                entry.status === 'approved' ? 'bg-green-100 text-green-800' :
                                entry.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {entry.status === 'approved' ? '承認済み' :
                                 entry.status === 'rejected' ? '却下' :
                                 '承認待ち'}
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
              
              {/* タイムライン全体用のコメント入力欄 */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <Textarea
                    placeholder="タイムライン全体へのコメントを入力..."
                    className="min-h-[60px] text-sm"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" className="text-xs">
                      コメント追加
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sela */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {/* Selaヘッダー */}
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Sela</h3>
              </div>
              
              {/* Sela提案 */}
              <div className="mb-6">
                <div className="space-y-3">
                  {task.aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{suggestion}</span>
                      <Button 
                        size="sm" 
                        onClick={() => handleExecuteSuggestion(suggestion)}
                        variant="outline"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        実行
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
            {/* 期限・進捗（一番上） */}
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
    </div>
  );
}
