"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bell, Calendar, CheckCircle, ChevronRight, FileText, Home, Loader2, Mail, MoreHorizontal, Play, Plus, Send, Settings, User, Zap } from "lucide-react";
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
  status: 'generating' | 'completed' | 'error' | 'unconfirmed' | 'confirmed';
  isPreparedForSending?: boolean;
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
  const [activeTab, setActiveTab] = useState<'timeline' | 'sela'>('timeline');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [aiActionItems, setAiActionItems] = useState<AIActionItem[]>([
    {

      id: '1',
      title: 'フォローアップメール作成と送信',
      timestamp: new Date('2025-07-23T08:49:00'),

      details: [
        'Sela提案: フォローアップメール作成と最適化',
        '自動生成による対応',
        'AI処理による最適化'
      ],
      assignee: '山田太郎',
      targetCompany: '株式会社サンプル',
      status: 'confirmed',
      generatedContent: {
        type: 'email',
        content: `フォローアップメールの作成と送信が完了しました。

送信内容:
• 件名: プロジェクト進捗について
• 送信先: 顧客担当者
• 内容: 進捗報告と次回ミーティングの提案

自動生成による最適化が完了し、次回アクションの提案も生成されました。`,

        files: [
          { name: 'followup_email.txt', type: 'text', size: '1.8KB' },
          { name: 'progress_report.pdf', type: 'pdf', size: '2.1MB' }
        ]
      }
    },
    {
      id: '2',
      title: '見積書に競合他社との比較表を追加',
      timestamp: new Date('2025-07-23T09:15:00'),
      details: [
        'Sela提案: 見積書の改善',
        '競合他社との比較表追加',
        '顧客への提案価値向上'
      ],
      assignee: '山田太郎',
      targetCompany: '株式会社サンプル',
      status: 'unconfirmed',
      generatedContent: {
        type: 'document',
        content: `見積書に競合他社との比較表を追加しました。

追加内容:
• 競合他社3社との機能比較
• 価格比較表
• 当社の優位性ポイント

これにより、顧客への提案価値が向上し、受注率の向上が期待できます。`,
        files: [
          { name: 'comparison_table.xlsx', type: 'excel', size: '856KB' },
          { name: 'updated_quote.pdf', type: 'pdf', size: '1.2MB' }
        ]
      }
    }
  ]);
  const [selectedAIItem, setSelectedAIItem] = useState<AIActionItem | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [executingSuggestions, setExecutingSuggestions] = useState<Set<string>>(new Set());
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: '',
    attachments: [] as Array<{ name: string; type: string; size: string }>
  });
  
  // 提案ドロワー用の状態
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [showProposalDrawer, setShowProposalDrawer] = useState(false);
  const [proposalMessages, setProposalMessages] = useState<Message[]>([]);
  const [proposalCommand, setProposalCommand] = useState("");

  // Sela依頼ドロワー用の状態
  const [selectedSelaRequest, setSelectedSelaRequest] = useState<string | null>(null);
  const [showSelaRequestDrawer, setShowSelaRequestDrawer] = useState(false);
  const [selaRequestMessages, setSelaRequestMessages] = useState<Message[]>([]);
  const [selaRequestCommand, setSelaRequestCommand] = useState("");

  // AIドロワー用の状態
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<AIChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

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

    // Sela依頼ドロワーを開く
    setSelectedSelaRequest(command);
    setShowSelaRequestDrawer(true);
    
    // 初期メッセージを設定
    setSelaRequestMessages([
      { content: command, type: 'question' }
    ]);

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

    setSelaRequestMessages([
      { content: command, type: 'question' },
      { content: aiResponse, type: 'answer' }
    ]);
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

      // Selaレスポンスをアラート表示
      const response = `Selaが「${suggestion}」を実行しました。結果は対応予定リストで確認できます。`;
      setAlertMessage(response);
      
      // 3秒後にアラートを自動で非表示
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);

    } catch (error) {
      // エラー状態に更新
      setAiActionItems(prev => prev.map(item => 
        item.id === newAIAction.id ? { ...item, status: 'error' } : item
      ));

      // エラーメッセージをアラート表示
      const errorResponse = `「${suggestion}」の実行中にエラーが発生しました。再実行をお試しください。`;
      setAlertMessage(errorResponse);
      
      // 3秒後にアラートを自動で非表示
      setTimeout(() => {
        setAlertMessage(null);
      }, 3000);
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

  // メール送信ハンドラー
  const handleSendEmail = (item: AIActionItem) => {
    // メールデータを設定
    setEmailData({
      to: 'customer@example.com', // 実際の実装では動的に設定
      subject: item.title,
      content: item.generatedContent?.content || '',
      attachments: item.generatedContent?.files || []
    });
    setShowEmailModal(true);
  };

  const handleEmailSend = async () => {
    try {
      // メール送信処理（実際の実装ではAPI呼び出し）
      console.log('メール送信中:', emailData);
      
      // 送信完了後の処理
      setShowEmailModal(false);
      setAlertMessage('メールが正常に送信されました。');
      setTimeout(() => setAlertMessage(null), 3000);
      
      // タイムラインに記録
      addTimelineEntry(
        'メール送信完了',
        { 
          to: emailData.to, 
          subject: emailData.subject,
          attachments: emailData.attachments.length 
        },
        'human',
        'approved'
      );
    } catch (error) {
      console.error('メール送信エラー:', error);
      setAlertMessage('メール送信に失敗しました。');
      setTimeout(() => setAlertMessage(null), 3000);
    }
  };

  // 提案ドロワーでのメッセージ送信
  const handleProposalSend = () => {
    if (!proposalCommand.trim()) return;

    const newMessage: Message = {
      content: proposalCommand,
      type: 'question'
    };
    setProposalMessages(prev => [...prev, newMessage]);
    setProposalCommand("");

    // Selaレスポンスをシミュレート
    const aiResponse = `提案「${selectedProposal}」について、以下の回答をいたします：

1. **提案内容の理解**：
   - 提案内容: ${selectedProposal}
   - 提案の目的: 現在のタスク状況を分析し、自動生成された提案です。

2. **提案の詳細**：
   - 提案の実装方法: この提案は、SelaのAIモデルによって自動生成されたものです。
   - 提案の効果: この提案を実装することで、タスクの進捗が加速し、リスクが軽減されます。

3. **次のアクション**：
   - 提案の実装: この提案を実装するために、必要な手順や注意点を説明します。
   - 提案の評価: 提案の実装が完了したら、その結果を確認し、次のアクションを提案します。

この提案について、何かご質問はありますか？`;

    setProposalMessages(prev => [...prev, { content: aiResponse, type: 'answer' }]);
  };

  // Sela依頼ドロワーでのメッセージ送信
  const handleSelaRequestSend = () => {
    if (!selaRequestCommand.trim()) return;

    const newMessage: Message = {
      content: selaRequestCommand,
      type: 'question'
    };
    setSelaRequestMessages(prev => [...prev, newMessage]);
    setSelaRequestCommand("");

    // Selaレスポンスをシミュレート
    const aiResponse = `依頼「${selaRequestCommand}」について、以下の回答をいたします：

1. **依頼内容の理解**：
   - 依頼内容: ${selaRequestCommand}
   - 依頼の目的: 現在のタスク状況を分析し、最適な対応を提案します。

2. **対応の詳細**：
   - 対応方法: この依頼に対して、SelaのAIモデルが最適な対応を自動生成します。
   - 対応の効果: この対応を実装することで、タスクの進捗が加速し、効率が向上します。

3. **次のアクション**：
   - 対応の実装: この対応を実装するために、必要な手順や注意点を説明します。
   - 対応の評価: 対応の実装が完了したら、その結果を確認し、次のアクションを提案します。

この依頼について、何かご質問はありますか？`;

    setSelaRequestMessages(prev => [...prev, { content: aiResponse, type: 'answer' }]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* パンクズリスト */}
      <nav className="flex items-center space-x-2 text-xs text-gray-600 px-8 pt-6 mb-6">
        <Link href="/" className="flex items-center hover:text-gray-900 transition-colors">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/cases" className="hover:text-gray-900 transition-colors">案件一覧</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">{task.task}</span>
      </nav>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 pt-0 pb-8">
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
                  className={`px-4 py-2 text-base font-medium transition-colors rounded-t-lg ${
                    activeTab === 'timeline'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  タイムライン
                </button>
                <button
                  onClick={() => setActiveTab('sela')}
                  className={`px-4 py-2 text-base font-medium transition-colors rounded-t-lg ${
                    activeTab === 'sela'
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Selaからの対応提案
                </button>
              </div>

              {/* タイムライン */}
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
                                <span className="text-base bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {entry.source}
                                </span>
                              )}
                            </div>
                                                          <span className="text-base text-gray-500">
                              {entry.timestamp.toLocaleString('ja-JP', {
                                month: 'numeric',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-base text-gray-700">{entry.action}</p>
                          {entry.reason && (
                            <p className="text-base text-gray-500 mt-1">理由: {entry.reason}</p>
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
                                <span className="text-base bg-gray-100 text-gray-600 px-2 py-1 rounded">コメント</span>
                              </div>
                              <span className="text-base text-gray-500">
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
                        <Button size="sm" className="text-base" onClick={handleAddComment} disabled={!commentText.trim()}>
                          コメント追加
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

                                            {/* Selaからの対応提案 */}
               {activeTab === 'sela' && (
                <div>
                   {/* アラート表示 */}
                   {alertMessage && (
                     <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                            <div className="flex items-center space-x-2">
                         <CheckCircle className="w-5 h-5 text-gray-600" />
                         <span className="text-sm text-gray-700">{alertMessage}</span>
                            </div>
                          </div>
                   )}
                     
                     {/* Sela提案 */}
                   <div className="mb-6">
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
                               <div className="flex space-x-2">
                                 <Button 
                                   variant="outline" 
                                   size="sm" 
                                   onClick={() => {
                                     setSelectedProposal(suggestion);
                                     setShowProposalDrawer(true);
                                     // 初期メッセージをクリア
                                     setProposalMessages([]);
                                   }}
                                   className="flex items-center space-x-2"
                                 >
                                   <span>詳細を見る</span>
                                 </Button>
                                 <Button 
                                   variant="outline" 
                                   size="sm" 
                                   onClick={() => {
                                     // 対応リストに追加する処理
                                     console.log('対応リストに追加:', suggestion);
                                     setAlertMessage('対応リストに追加しました');
                                     setTimeout(() => setAlertMessage(null), 3000);
                                   }}
                                   className="flex items-center space-x-2"
                                 >
                                   <Plus className="w-4 h-4 mr-1" />
                                   対応リストに追加
                                 </Button>
                            </div>
                             )}
                    </div>
                         );
                       })}
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
              )}
            </div>

            {/* 対応タスクリスト */}
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">対応タスクリスト</h3>
              </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">確認状況</th>
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
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-base font-medium ${
                              item.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            item.status === 'unconfirmed' ? 'bg-yellow-100 text-yellow-800' :
                              item.status === 'error' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status === 'generating' && (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              )}
                              {item.status === 'generating' ? '生成中...' :
                             item.status === 'confirmed' ? '確認済み' :
                             item.status === 'unconfirmed' ? '未確認' :
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
                  <span className="text-base text-gray-500">期限</span>
                  <span className="text-base font-medium text-gray-900">{task.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">残り</span>
                  <span className="text-base font-medium text-gray-900">{task.daysLeft}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-gray-500">進捗</span>
                  <span className="text-base font-medium text-gray-900">{task.progress}%</span>
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
                  <AvatarFallback className="text-base">{task.assignee.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-base text-gray-900">{task.assignee}</span>
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
              <div className="text-base text-gray-900">{task.project}</div>
            </div>

            {/* 説明 */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium text-gray-900">説明</h3>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <Settings className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-base text-gray-700 leading-relaxed">{task.description}</div>
            </div>

            {/* 優先度 */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-base font-medium text-gray-900 mb-2">優先度</h3>
              <div className="space-y-1">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-base font-medium ${
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
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-base font-medium ${
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
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-base font-medium bg-purple-100 text-purple-800">
                  {task.customerType}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI対応詳細ドロワー */}
          {showAIModal && selectedAIItem && (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedAIItem.title}</h3>
                  <button 
                    onClick={() => {
                      setShowAIModal(false);
                      setSelectedAIItem(null);
                    }}
                className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    ✕
                  </button>
                </div>
                
            <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  <div>
                  <p className="text-sm text-gray-500 mb-3">
                      {selectedAIItem.timestamp.toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    
                    {/* ステータス表示 */}
                    <div className="mb-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-base font-medium ${
                        selectedAIItem.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                      selectedAIItem.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      selectedAIItem.status === 'unconfirmed' ? 'bg-yellow-100 text-yellow-800' :
                        selectedAIItem.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedAIItem.status === 'generating' && (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        )}
                        {selectedAIItem.status === 'generating' ? '生成中...' :
                       selectedAIItem.status === 'confirmed' ? '確認済み' :
                       selectedAIItem.status === 'unconfirmed' ? '未確認' :
                         selectedAIItem.status === 'error' ? 'エラー' :
                         '生成中...'}
                      </span>
                    </div>
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
                  
                  {/* 生成済みの場合の結果表示 */}
                  {selectedAIItem.status === 'completed' && selectedAIItem.generatedContent && (
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">生成結果</h5>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {selectedAIItem.generatedContent.content}
                        </p>
                      </div>
                      
                      {/* ファイル一覧 */}
                      {selectedAIItem.generatedContent.files && selectedAIItem.generatedContent.files.length > 0 && (
                        <div>
                        <h6 className="text-base font-medium text-gray-600 mb-2">生成されたファイル</h6>
                          <div className="space-y-2">
                            {selectedAIItem.generatedContent.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-base text-gray-500">({file.size})</span>
                                </div>
                                <Button size="sm" variant="outline">
                                  ダウンロード
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* エラーの場合のエラー詳細 */}
                  {selectedAIItem.status === 'error' && (
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="text-sm font-medium text-red-700 mb-2">エラー詳細</h5>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">
                          処理中にエラーが発生しました。再実行をお試しください。
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* アクションボタン */}
                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    {selectedAIItem.status === 'generating' && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        生成中です...
                      </div>
                    )}
                    
                  {(selectedAIItem.status === 'confirmed' || selectedAIItem.status === 'unconfirmed') && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {selectedAIItem.generatedContent?.type === 'email' && (
                          <div onClick={() => handleSendEmail(selectedAIItem)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                              <Mail className="mr-2 h-4 w-4" />
                              メール送信
                            </div>
                          )}
                          <div onClick={() => handleReExecuteAI(selectedAIItem.id)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <Play className="mr-2 h-4 w-4" />
                            再実行
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    
                    {selectedAIItem.status === 'error' && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <div onClick={() => handleReExecuteAI(selectedAIItem.id)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <Play className="mr-2 h-4 w-4" />
                            再実行
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
            </div>
            
            {/* チャット欄（固定） */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* 次のアクションボタン（横並び、モノクロ） */}
              {(selectedAIItem.status === 'confirmed' || selectedAIItem.status === 'unconfirmed') && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div>
                    {selectedAIItem.generatedContent?.type === 'email' && (
                      <Button 
                        onClick={() => handleSendEmail(selectedAIItem)}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        size="sm"
                      >
                        この内容でメール送信
                      </Button>
                    )}
                    

                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Input
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="返信する..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 text-base"
                />
                <Button onClick={handleSend} disabled={!command.trim()} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 提案詳細ドロワー */}
      {showProposalDrawer && selectedProposal && (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white border-l border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedProposal}</h3>
              <button 
                onClick={() => {
                  setShowProposalDrawer(false);
                  setSelectedProposal(null);
                  setProposalMessages([]);
                  setProposalCommand("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900 mb-3">{selectedProposal}</p>
                  
                  <div className="mb-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-base font-medium bg-blue-100 text-blue-800">
                      提案中
                    </span>
                  </div>
                </div>
                

              </div>
            </div>
            
            {/* チャット欄（固定） */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
                             {/* アクションボタン */}
               <div className="mb-4 pb-4 border-b border-gray-200">
                 <Button 
                   onClick={() => {
                     console.log('対応リストに追加:', selectedProposal);
                     setAlertMessage('対応リストに追加しました');
                     setTimeout(() => setAlertMessage(null), 3000);
                     setShowProposalDrawer(false);
                   }}
                   variant="outline"
                   className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                   size="sm"
                 >
                   <Plus className="w-4 h-4 mr-1" />
                   対応リストに追加
                 </Button>
               </div>
              
              {/* メッセージ履歴 */}
              <div className="mb-4 max-h-48 overflow-y-auto space-y-3">
                {proposalMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.type === 'question' 
                        ? 'bg-gray-900 text-white' 
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
                  value={proposalCommand}
                  onChange={(e) => setProposalCommand(e.target.value)}
                  placeholder="Selaに質問しましょう..."
                  onKeyDown={(e) => e.key === 'Enter' && handleProposalSend()}
                  className="flex-1 text-base"
                />
                <Button onClick={handleProposalSend} disabled={!proposalCommand.trim()} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sela依頼詳細ドロワー */}
      {showSelaRequestDrawer && (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-xl transform transition-transform z-40">
          <div className="h-full flex flex-col">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {selectedSelaRequest}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSelaRequestDrawer(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>

            {/* 中央エリア（空） */}
            <div className="flex-1"></div>
            
            {/* 下部固定エリア */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              {/* アクションボタン */}
              <div className="mb-4">
                <Button 
                  onClick={() => {
                    console.log('対応リストに追加:', selectedSelaRequest);
                    setAlertMessage('対応リストに追加しました');
                    setTimeout(() => setAlertMessage(null), 3000);
                    setShowSelaRequestDrawer(false);
                  }}
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  対応リストに追加
                </Button>
              </div>
              
              {/* コマンド入力欄 */}
              <div className="flex space-x-2">
                <Input
                  value={selaRequestCommand}
                  onChange={(e) => setSelaRequestCommand(e.target.value)}
                  placeholder="Selaに依頼しましょう..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSelaRequestSend()}
                  className="flex-1 text-base"
                />
                <Button onClick={handleSelaRequestSend} disabled={!selaRequestCommand.trim()} size="sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* メール送信モーダル */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">メール送信</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">宛先</label>
              <Input
                value={emailData.to}
                onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
                className="mb-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">件名</label>
              <Input
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="mb-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">本文</label>
              <Textarea
                value={emailData.content}
                onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px] mb-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">添付ファイル</label>
              <div className="flex flex-wrap items-center gap-2">
                {emailData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                    <FileText className="w-4 h-4 mr-1" />
                    {file.name} ({file.size})
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEmailModal(false)}>キャンセル</Button>
              <Button onClick={handleEmailSend}>送信</Button>
            </div>
              </div>
            </div>
          )}
    </div>
  );
} 