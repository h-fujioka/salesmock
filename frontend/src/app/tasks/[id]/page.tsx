"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, CheckCircle, Clock, Edit, MessageSquare, Send, User, Zap } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { useState } from "react";

// ダミータスクデータ
const dummyTasks = [
  {
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
    description: "顧客Aに見積書を送付するタスクです。前回の商談内容を踏まえて、適切な価格設定とサービス内容を含めた見積書を作成します。",
    progress: 60,
    comments: [
      { id: 1, user: "山田太郎", timestamp: "2024/07/07 14:30", content: "見積書のドラフトを作成しました。レビューをお願いします。" },
      { id: 2, user: "AIエージェント", timestamp: "2024/07/07 15:00", content: "見積書の内容を確認しました。価格設定は適切ですが、競合他社との差別化ポイントをより明確に記載することをお勧めします。" }
    ],
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
    comments: [],
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

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = dummyTasks.find(t => t.taskId === params.id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [command, setCommand] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  if (!task) return notFound();

  // AIエージェントへの指示送信
  const handleSend = async () => {
    if (!command.trim()) return;

    // ユーザーのメッセージを履歴に追加
    setMessages(prev => [...prev, { content: command, type: 'question' }]);

    // AIレスポンスをシミュレート
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
    // 実際の実装では、APIを呼び出してタスクを更新
  };

  // AI提案の実行
  const handleExecuteSuggestion = (suggestion: string) => {
    setMessages(prev => [...prev, { 
      content: `AI提案「${suggestion}」を実行しました。`, 
      type: 'system' 
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                戻る
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">タスク詳細</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                編集
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* タスク基本情報 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {isEditing ? (
                      <Input 
                        value={editedTask?.task || task.task}
                        onChange={(e) => setEditedTask(prev => prev ? {...prev, task: e.target.value} : task)}
                        className="text-2xl font-bold"
                      />
                    ) : (
                      task.task
                    )}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === '高' ? 'bg-red-100 text-red-800' :
                      task.priority === '中' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === '完了' ? 'bg-green-100 text-green-800' :
                      task.status === '進行中' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {task.customerType}
                    </span>
                  </div>
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <Button onClick={handleSave} size="sm">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      保存
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                      キャンセル
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">担当者</p>
                    <p className="font-medium">{task.assignee}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">期限</p>
                    <p className="font-medium">{task.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">残り日数</p>
                    <p className="font-medium">{task.daysLeft}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">生成方法</p>
                    <p className="font-medium">{task.auto}</p>
                  </div>
                </div>
              </div>

              {/* 進捗バー */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">進捗</span>
                  <span className="text-sm text-gray-500">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* タスク説明 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">説明</h3>
                <p className="text-gray-700 leading-relaxed">{task.description}</p>
              </div>
            </div>

            {/* AI提案エリア */}
            <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI提案</h3>
              </div>
              <div className="space-y-3">
                {task.aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-700">{suggestion}</span>
                    <Button 
                      size="sm" 
                      onClick={() => handleExecuteSuggestion(suggestion)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      実行
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* AIエージェントとの対話 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">AIエージェント</h3>
              </div>
              
              {/* メッセージ履歴 */}
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.type === 'question' 
                        ? 'bg-blue-600 text-white' 
                        : msg.type === 'system'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 入力欄 */}
              <div className="flex space-x-2">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="AIエージェントに指示を入力..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!command.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* コメント履歴 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">コメント履歴</h3>
              <div className="space-y-4">
                {task.comments.length === 0 ? (
                  <p className="text-gray-500 text-sm">コメントはありません。</p>
                ) : (
                  task.comments.map(comment => (
                    <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {comment.user === "AIエージェント" ? "AI" : comment.user.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-gray-900">{comment.user}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 関連情報 */}
            <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">関連情報</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">関連案件</p>
                  <p className="font-medium">{task.project}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">顧客区分</p>
                  <p className="font-medium">{task.customerType}</p>
                </div>
                {task.approval && (
                  <div>
                    <p className="text-sm text-gray-500">承認状況</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {task.approval}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
