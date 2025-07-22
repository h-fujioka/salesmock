"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bell, Calendar, CheckCircle, FileText, Loader2, Mail, MoreHorizontal, Play, Send, Settings, User, Users, Zap, X, XCircle, CheckCircle2, Copy } from "lucide-react";
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

// AIチャットメッセージ型の定義
type AIChatMessage = {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
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
  status: 'generating' | 'completed' | 'error';
  isPreparedForSending?: boolean; // 送信準備済みフラグ
  generatedContent?: {
    type: 'email' | 'document' | 'analysis' | 'report';
    content: string;
    files?: Array<{
      name: string;
      type: string;
      size: string;
      url?: string;
    }>;
  };
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
  // ここで4つのダミーデータを直接初期値として設定
  const [aiActionItems, setAiActionItems] = useState<AIActionItem[]>([
    {
      id: 'ai-generating-1',
      title: '見積書の自動生成と最適化',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      details: [
        'Sela提案: 見積書の自動生成機能を活用',
        '自動生成による対応',
        'AI処理による最適化'
      ],
      assignee: 'Sela',
      targetCompany: '自動検知',
      status: 'generating'
    },
    {
      id: 'ai-completed-1',
      title: 'フォローアップメール作成と最適化',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      details: [
        'Sela提案: フォローアップメール作成と最適化',
        '自動生成による対応',
        'AI処理による最適化'
      ],
      assignee: 'Sela',
      targetCompany: '自動検知',
      status: 'completed',
      generatedContent: {
        type: 'email',
        content: 'フォローアップメールの作成と最適化が完了しました。\n\n最適化内容:\n• 件名: プロジェクト進捗について\n• 送信先: 顧客担当者\n• 内容: 進捗報告と次回ミーティングの提案\n\nAIによる最適化が完了しました。内容を確認してから送信ボタンでワンクリック送信できます。',
        files: [
          { name: 'followup_email.txt', type: 'text', size: '1.8KB' },
          { name: 'progress_report.pdf', type: 'pdf', size: '2.1MB' }
        ]
      }
    },
    {
      id: 'ai-completed-2',
      title: '競合他社分析レポート作成と最適化',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      details: [
        'Sela提案: 競合他社の動向分析',
        '市場調査データの収集',
        '分析レポートの自動生成'
      ],
      assignee: 'Sela',
      targetCompany: '自動検知',
      status: 'completed',
      generatedContent: {
        type: 'report',
        content: '競合他社分析レポートが完成しました。\n\n分析結果:\n• 主要競合3社の動向を調査\n• 価格戦略の比較分析\n• 差別化ポイントの特定\n\n次回商談での活用提案も含まれています。',
        files: [
          { name: 'competitor_analysis.pdf', type: 'pdf', size: '3.2MB' },
          { name: 'market_data.xlsx', type: 'excel', size: '1.5MB' }
        ]
      }
    },
    {
      id: 'ai-completed-3',
      title: '顧客ヒアリング議事録作成と最適化',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      details: [
        'Sela提案: 議事録の自動作成',
        '音声データの文字起こし',
        '重要ポイントの抽出'
      ],
      assignee: 'Sela',
      targetCompany: '自動検知',
      status: 'completed',
      generatedContent: {
        type: 'document',
        content: '顧客ヒアリングの議事録を作成しました。\n\n議事録内容:\n• 会議日時: 2024年7月7日 14:00-15:30\n• 参加者: 顧客担当者、営業担当\n• 主要議題: プロジェクト要件の詳細確認\n• 決定事項: 次回ミーティングの日程調整\n\nアクションアイテムも自動抽出されています。',
        files: [
          { name: 'meeting_minutes.docx', type: 'word', size: '2.8MB' },
          { name: 'action_items.txt', type: 'text', size: '0.5KB' }
        ]
      }
    }
  ]);
  const [selectedAIItem, setSelectedAIItem] = useState<AIActionItem | null>(null);
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [executingSuggestions, setExecutingSuggestions] = useState<Set<string>>(new Set());
  
  // AIチャット機能用の状態
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  
  // Selaの実行結果アラート用の状態
  const [selaAlert, setSelaAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Selaタブ管理用の状態
  const [activeSelaTab, setActiveSelaTab] = useState<'proposals' | 'history'>('proposals');

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
  const handleExecuteSuggestion = async (suggestion: string) => {
    setExecutingSuggestions(prev => new Set(prev).add(suggestion));
    // 新しいAI対応項目を作成
    const newAIAction: AIActionItem = {
      id: `ai-${Date.now()}`,
      title: suggestion,
      timestamp: new Date(),
      details: [
        `Sela提案: ${suggestion}`,
        "自動生成による対応",
        "AI処理による最適化"
      ],
      assignee: "Sela",
      targetCompany: "自動検知",
      status: 'generating'
    };

    // AI対応項目リストに追加
    setAiActionItems(prev => [newAIAction, ...prev]);

    // タイムラインに追加
    addTimelineEntry(
      `Sela実行開始: ${suggestion}`,
      { action: suggestion, status: 'generating' },
      'ai'
    );

    try {
      // AI処理をシミュレート（実際のAPI呼び出し）
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 生成済み状態に更新
      setAiActionItems(prev => prev.map(item => 
        item.id === newAIAction.id ? { 
          ...item, 
          status: 'completed',
          generatedContent: {
            type: 'email',
            content: `${suggestion}の実行が完了しました。\n\n実行内容:\n• 自動処理による最適化\n• 結果の生成と保存\n• 次回アクションの提案`,
            files: [
              { name: `${suggestion}_result.txt`, type: 'text', size: '1.2KB' },
              { name: `${suggestion}_report.pdf`, type: 'pdf', size: '856KB' }
            ]
          }
        } : item
      ));

      // タイムラインに完了を追加
      addTimelineEntry(
        `Sela実行完了: ${suggestion}`,
        { action: suggestion, result: 'completed' },
        'ai'
      );

      // アラートを表示（チャットメッセージではなく）
      setSelaAlert({
        message: `Selaが「${suggestion}」を実行しました。結果はAI対応状況タブで確認できます。`,
        type: 'success'
      });

      // 5秒後にアラートを消去
      setTimeout(() => {
        setSelaAlert(null);
      }, 5000);

    } catch (error) {
      // エラー状態に更新
      setAiActionItems(prev => prev.map(item => 
        item.id === newAIAction.id ? { ...item, status: 'error' } : item
      ));

      // エラーアラートを表示
      setSelaAlert({
        message: `「${suggestion}」の実行中にエラーが発生しました。再実行をお試しください。`,
        type: 'error'
      });

      // 5秒後にアラートを消去
      setTimeout(() => {
        setSelaAlert(null);
      }, 5000);
    } finally {
      setExecutingSuggestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestion);
        return newSet;
      });
    }
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



  // AI対応項目の実行
  const handleExecuteAI = async (itemId: string) => {
    // 生成中状態に変更
    setAiActionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'generating' as const } : item
    ));

    try {
      // AI処理をシミュレート（実際のAPI呼び出し）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 生成済み状態に変更
      setAiActionItems(prev => prev.map(item => 
        item.id === itemId ? { 
          ...item, 
          status: 'completed' as const,
          generatedContent: {
            type: 'email',
            content: `${item.title}の実行結果が生成されました。`,
            files: [
              { name: `${item.title}.txt`, type: 'text', size: '1.5KB' }
            ]
          }
        } : item
      ));

      // タイムラインに追加
      addTimelineEntry(
        `AI実行完了: ${aiActionItems.find(item => item.id === itemId)?.title}`,
        { action: 'ai_execution', result: 'completed' },
        'ai'
      );

    } catch (error) {
      // エラー状態に変更
      setAiActionItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, status: 'error' as const } : item
      ));
    }
  };

  // AI対応項目の再実行
  const handleReExecuteAI = (itemId: string) => {
    handleExecuteAI(itemId);
  };

  // AI対応項目の詳細表示（ドロワー用）
  const handleShowAIDetails = (item: AIActionItem) => {
    setSelectedAIItem(item);
    setShowAIDrawer(true);
    // チャット履歴をリセット
    setAiChatMessages([]);
  };

  // ドロワーを閉じる
  const handleCloseDrawer = () => {
    setShowAIDrawer(false);
    setSelectedAIItem(null);
  };

  // 顧客向け編集ハンドラー
  const handleCustomerEdit = (item: AIActionItem) => {
    console.log('顧客向け編集:', item.title);
    // TODO: 顧客向け編集モーダルを開く
    alert(`「${item.title}」の顧客向け編集機能を実装予定です。`);
  };

  // 送付準備ハンドラー
  const handlePrepareSend = (item: AIActionItem) => {
    console.log('送付準備:', item.title);
    // TODO: 送付準備画面に遷移
    alert(`「${item.title}」の送付準備機能を実装予定です。`);
  };

  // AIチャットメッセージ送信
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || !selectedAIItem) return;

    // ユーザーメッセージを追加
    const userMessage: AIChatMessage = {
      id: `chat-${Date.now()}`,
      content: chatInput,
      type: 'user',
      timestamp: new Date()
    };
    
    setAiChatMessages(prev => [...prev, userMessage]);
    setChatInput("");

    // AIレスポンスをシミュレート
    setTimeout(() => {
      const aiResponse: AIChatMessage = {
        id: `ai-${Date.now()}`,
        content: `「${selectedAIItem.title}」についてのご質問ですね。\n\n${chatInput}の内容を確認しました。生成された内容について、より具体的な修正や改善点があればお聞かせください。`,
        type: 'ai',
        timestamp: new Date()
      };
      
      setAiChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // 内容を調整する（AI最適化）
  const handleEditContent = (item: AIActionItem) => {
    if (item.status === 'generating') {
      alert('生成中の内容は調整できません。');
      return;
    }
    // AIによる内容の最適化を実行
    alert(`「${item.title}」の内容をAIが最適化しています...`);
    // TODO: AIによる内容最適化の実装
    setTimeout(() => {
      alert('AIによる内容最適化が完了しました。');
    }, 2000);
  };

  // 内容をコピーする
  const handleCopyContent = (item: AIActionItem) => {
    if (item.status === 'generating') {
      alert('生成中の内容はコピーできません。');
      return;
    }
    if (item.generatedContent?.content) {
      navigator.clipboard.writeText(item.generatedContent.content);
      alert('最適化された内容をコピーしました。');
    } else {
      alert('コピーする内容がありません。');
    }
  };

  // 送信準備を実行する（AI最適化）
  const handlePrepareForSending = (item: AIActionItem) => {
    if (item.status === 'generating') {
      alert('生成中の内容は送信準備できません。');
      return;
    }
    // AIによる送信準備（最適化、フォーマット調整、添付ファイル準備など）
    alert(`「${item.title}」の送信準備をAIが実行しています...`);
    
    setTimeout(() => {
      setAiActionItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, isPreparedForSending: true } : i
      ));
      alert('AIによる送信準備が完了しました。内容を確認してから手動で送信してください。');
    }, 2000);
  };

  // 最終確認を実行する（人間による確認）
  const handleFinalReview = (item: AIActionItem) => {
    if (confirm(`「${item.title}」の内容を最終確認しますか？\n\n確認後、手動でメールクライアントから送信してください。`)) {
      // 最終確認の実行
      alert('最終確認が完了しました。メールクライアントで手動送信を行ってください。');
      
      // 送信準備状態をリセット
      setAiActionItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, isPreparedForSending: false } : i
      ));
    }
  };

  // ワンクリック送信ハンドラー
  const handleOneClickSend = (item: AIActionItem) => {
    if (item.status === 'generating') {
      alert('生成中の内容はワンクリック送信できません。');
      return;
    }
    if (!item.isPreparedForSending) {
      alert('送信準備が完了していません。先に「送信準備」ボタンを押してください。');
      return;
    }
    if (item.generatedContent?.content) {
      if (confirm(`「${item.title}」の内容をワンクリック送信しますか？\n\n送信内容:\n${item.generatedContent.content.substring(0, 100)}...`)) {
        // 実際の送信ロジックをここに追加
        alert('ワンクリック送信が完了しました！');
        
        // 送信準備状態をリセット
        setAiActionItems(prev => prev.map(i => 
          i.id === item.id ? { ...i, isPreparedForSending: false } : i
        ));
        
        // 送信履歴をタイムラインに追加
        addTimelineEntry(
          `「${item.title}」をワンクリック送信`,
          { 
            type: 'email_sent',
            content: item.generatedContent.content,
            timestamp: new Date()
          },
          'human',
          'approved'
        );
      }
    } else {
      alert('送信する内容がありません。');
    }
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
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">ステータス</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">対応内容</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">日時</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiActionItems.map((item) => (
                        <tr 
                          key={item.id} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                              item.status === 'completed' ? 'bg-green-100 text-green-800' :
                              item.status === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status === 'generating' && (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              )}
                              {item.status === 'generating' ? '生成中...' :
                               item.status === 'completed' ? '生成済み' :
                               item.status === 'error' ? 'エラー' :
                               '生成中...'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span 
                              className="font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => handleShowAIDetails(item)}
                            >
                              {item.title}
                            </span>
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

                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Sela - タブ版 */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              {/* タブヘッダー - ラベル変更 */}
              <div className="flex space-x-1 mb-4">
                <button
                  onClick={() => setActiveSelaTab('proposals')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeSelaTab === 'proposals'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Selaからの提案</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveSelaTab('history')}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                    activeSelaTab === 'history'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>依頼履歴</span>
                  </div>
                </button>
              </div>

              {/* タブコンテンツ */}
              {activeSelaTab === 'proposals' && (
                <div className="space-y-6">
                  {/* Sela実行結果アラート */}
                  {selaAlert && (
                    <div className="mb-4">
                      <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                              {selaAlert.type === 'success' ? (
                                <CheckCircle2 className="h-4 w-4 text-gray-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-600" />
                              )}
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {selaAlert.type === 'success' ? '実行完了' : '実行エラー'}
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {selaAlert.message}
                            </p>
                          </div>
                          <div className="ml-3 flex-shrink-0">
                            <button
                              onClick={() => setSelaAlert(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Sela提案 - タイトル削除 */}
                  <div className="space-y-3">
                    {task.aiSuggestions.map((suggestion) => {
                      const isExecuting = executingSuggestions.has(suggestion);
                      return (
                        <div key={suggestion} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{suggestion}</span>
                          {isExecuting ? (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>生成中...</span>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleExecuteSuggestion(suggestion)}
                              className="flex items-center space-x-2"
                            >
                              <Play className="h-4 w-4" />
                              <span>実行</span>
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Selaに依頼 - タイトル削除 */}
                  <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Zap className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        Selaに依頼
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Textarea
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Selaに依頼しましょう... (例: 見積書のドラフトを作成しました。レビューをお願いします。)"
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        className="flex-1 min-h-[80px] resize-none border-gray-300 focus:border-gray-500"
                      />
                      <Button 
                        onClick={handleSend} 
                        disabled={!command.trim()}
                        className="bg-gray-900 hover:bg-gray-800 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSelaTab === 'history' && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
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
              )}
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

          {/* AI対応詳細ドロワー */}
          {showAIDrawer && selectedAIItem && (
            <>
              {/* オーバーレイ */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={handleCloseDrawer}
              />
              
              {/* ドロワーパネル */}
              <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                <div className="flex flex-col h-full">
                  {/* ヘッダー */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedAIItem.title}</h3>
                    <button 
                      onClick={handleCloseDrawer}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* メインコンテンツ */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {/* タイムスタンプ */}
                      <div>
                        <p className="text-xs text-gray-500">
                          {selectedAIItem.timestamp.toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      {/* 生成済みの場合の結果表示 */}
                      {selectedAIItem.status === 'completed' && selectedAIItem.generatedContent && (
                        <div className="space-y-4">
                          <div>
                            <p className="text-base text-gray-700 whitespace-pre-wrap">
                              {selectedAIItem.generatedContent.content}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {/* エラーの場合のエラー詳細 */}
                      {selectedAIItem.status === 'error' && (
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-red-700">エラー詳細</h5>
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-700">
                              処理中にエラーが発生しました。再実行をお試しください。
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* フッター */}
                  <div className="border-t border-gray-200 p-6">
                    {selectedAIItem.status === 'generating' && (
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中です...
                      </div>
                    )}
                    
                    {selectedAIItem.status === 'error' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleReExecuteAI(selectedAIItem.id)}
                        className="w-full"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        再実行
                      </Button>
                    )}

                    {/* 完了時のアクションエリア */}
                    {selectedAIItem.status === 'completed' && (
                      <div className="space-y-4">
                        {/* AI最適化・準備アクションボタン */}
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContent(selectedAIItem)}
                            className="flex-1"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            内容を調整
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyContent(selectedAIItem)}
                            className="flex-1"
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            コピー
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handlePrepareForSending(selectedAIItem)}
                            size="sm"
                            className="flex-1"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            送信準備
                          </Button>
                        </div>

                        {/* 送信準備完了時の確認エリア */}
                        {selectedAIItem.isPreparedForSending && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-900">
                                  送信準備完了
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-blue-700 mb-3">
                              AIによる最適化が完了しました。内容を確認してから送信ボタンでワンクリック送信できます。
                            </p>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFinalReview(selectedAIItem)}
                                className="flex-1 text-blue-700 border-blue-300 hover:bg-blue-100"
                              >
                                最終確認
                              </Button>
                              <Button
                                onClick={() => handleOneClickSend(selectedAIItem)}
                                size="sm"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                ワンクリック送信
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* チャット履歴 */}
                        {aiChatMessages.length > 0 && (
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {aiChatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                    message.type === 'user'
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-100 text-gray-900'
                                  }`}
                                >
                                  <p className="whitespace-pre-wrap">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString('ja-JP', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* チャット入力欄 */}
                        <div className="flex space-x-2">
                          <Textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="AIに内容の最適化や調整を指示..."
                            className="flex-1 min-h-[60px] resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendChatMessage();
                              }
                            }}
                          />
                          <Button
                            onClick={handleSendChatMessage}
                            disabled={!chatInput.trim()}
                            size="sm"
                            className="self-end h-[60px] px-3"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
    </div>
  );
} 