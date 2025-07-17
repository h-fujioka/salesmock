"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ColumnDef } from "@tanstack/react-table";
import { Bell, Calendar, ChevronDown, FileSpreadsheet, PenLine, Search, Send, User, Plus } from "lucide-react";
import React, { useState } from "react";

// 検索結果テンプレートコンポーネント
interface SearchResultTemplateProps {
  title: string;
  description: string;
  dataComponent: React.ReactNode;
  nextActionText: string; // 追加：具体的なネクストアクション名
}

function SearchResultTemplate({
  title,
  description,
  dataComponent,
  nextActionText
}: SearchResultTemplateProps) {
  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-4">
      {/* 説明＋テーブルエリア（テンプレート化） */}
      <div className="flex flex-col gap-4">
        <div className="text-xl font-bold text-gray-800">
          {title}
        </div>
        <div className="text-gray-600 text-base leading-relaxed">
          {description}
        </div>
        <div className="overflow-x-auto">
          {dataComponent}
        </div>
        <div className="flex flex-col gap-4 mt-6">
          <div className="text-base text-gray-700">
            {nextActionText}
          </div>
        </div>
      </div>
    </div>
  );
}

// 質問内容表示コンポーネント
type QuestionBoxProps = {
  question: string;
  onEdit: () => void;
  isEditing: boolean;
  editableQuestion: string;
  setEditableQuestion: (v: string) => void;
  onEditComplete: () => void;
  variant?: "default" | "answer";
  showEdit?: boolean;
};

function QuestionBox({ question, onEdit, isEditing, editableQuestion, setEditableQuestion, onEditComplete, variant = "default", showEdit = true }: QuestionBoxProps) {
  const isAnswer = variant === "answer";
  return (
    <div
      className={
        isAnswer
          ? "bg-[#22223b] rounded-3xl px-8 py-6 w-fit text-xl text-white font-medium mb-4"
          : "w-full max-w-[1000px] mx-auto bg-gray-100 border border-gray-100 rounded-xl shadow px-4 py-3 flex items-center justify-between text-base font-normal text-gray-800 mb-4"
      }
      style={isAnswer ? { maxWidth: 1000, marginLeft: 'auto' } : {}}
    >
      {isEditing ? (
        <input
          className={isAnswer ? "flex-1 bg-transparent outline-none border-none text-xl text-white font-medium mr-2 px-2 py-1 rounded" : "flex-1 bg-transparent outline-none border-none text-base font-normal text-gray-800 mr-2 px-2 py-1 rounded"}
          value={editableQuestion}
          onChange={e => setEditableQuestion(e.target.value)}
          onBlur={onEditComplete}
          onKeyDown={e => { if (e.key === 'Enter') onEditComplete(); }}
          autoFocus
        />
      ) : (
        <span className={isAnswer ? "whitespace-pre-wrap" : "truncate"}>{question}</span>
      )}
      {showEdit && !isAnswer && (
        <Button
          size="icon"
          variant="ghost"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10 ml-4"
          onClick={onEdit}
          aria-label="編集"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </Button>
      )}
    </div>
  );
}

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

type Suggestion = { icon: string; title: string; url: string };
// メッセージ型の定義を追加
type Message = {
  content: string;
  type: 'question' | 'answer' | 'system';
};

export default function Home() {
  const [command, setCommand] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  // 新規追加: フォローアップメール用の状態
  const [followupCandidates, setFollowupCandidates] = useState<any[] | null>(null);
  const [mailPreview, setMailPreview] = useState<string | null>(null);
  // ApprovalStep型を拡張
  const [approvalStep, setApprovalStep] = useState<"none" | "search_results" | "select_recipients" | "preview_mail" | "sent">("none");
  // 送信先選択用の状態
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([0,1]); // 山田太郎・鈴木一郎のみ選択
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({ 0: true, 1: true });
  // アラートメッセージ用のstate追加
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // コマンドの検証関数
  const validateCommand = (input: string): boolean => {
    const requiredPhrase = "フォローアップメールが必要な案件を抽出して";
    if (input === requiredPhrase) {
      setAlertMessage(null);
      return true;
    } else {
      setAlertMessage(`"${requiredPhrase}" と入力してください`);
      return false;
    }
  };

  // rowSelectionとselectedRecipientsを同期
  React.useEffect(() => {
    // rowSelection → selectedRecipients
    const selected = Object.entries(rowSelection)
      .filter(([_, v]) => v)
      .map(([k]) => Number(k));
    setSelectedRecipients(selected);
  }, [rowSelection]);

  React.useEffect(() => {
    // selectedRecipients → rowSelection
    const newRowSelection: { [key: string]: boolean } = {};
    selectedRecipients.forEach(idx => { newRowSelection[idx] = true; });
    setRowSelection(newRowSelection);
  }, []); // 初回のみ

  // 全選択・個別選択ハンドラ
  const handleSelectAll = (checked: boolean) => {
    setSelectedRecipients(checked ? followupCandidates?.map((_, i) => i) ?? [] : []);
  };
  const handleSelectOne = (idx: number, checked: boolean) => {
    setSelectedRecipients(prev => checked ? [...prev, idx] : prev.filter(i => i !== idx));
  };

  // 質問内容編集用state
  const [lastCommand, setLastCommand] = useState("");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState("");

  // メッセージ履歴表示用コンポーネント
  function MessageHistory() {
    return (
      <div className="w-full max-w-[1000px] mx-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === 'question' ? 'bg-[#22223b] text-white' : 'bg-gray-50'}`}>
              <p className="text-base whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // handleSend修正: ユーザーの回答を解析して次のステップを決定
  const handleSend = async () => {
    if (!validateCommand(command)) {
      return;
    }

    // 現在のステップでユーザーの回答を解析
    if (approvalStep === "search_results") {
      const userResponse = command.toLowerCase().trim();
      
      // 肯定的な回答の場合
      if (userResponse.includes("はい") || userResponse.includes("ok") || userResponse.includes("進める") || userResponse.includes("プレビュー")) {
        setApprovalStep("preview_mail");
        // 回答を履歴に追加
        setMessages(prev => [...prev, { content: command, type: 'answer' }]);
        // 最初の質問を保持するため、setLastCommandは呼ばない
        setCommand("");
        return;
      }
      
      // 否定的な回答の場合
      if (userResponse.includes("いいえ") || userResponse.includes("変更") || userResponse.includes("再検索") || userResponse.includes("条件")) {
        setApprovalStep("none");
        setFollowupCandidates(null);
        setMailPreview(null);
        // 回答を履歴に追加
        setMessages(prev => [...prev, { content: command, type: 'answer' }]);
        setAiResponse("条件を変更して再検索しますか？以下のような条件が考えられます：\n\n• 連絡期間を1週間に変更\n• 優先度の高い案件のみ\n• 特定の顧客区分に絞り込み\n• 最終連絡日の範囲を調整\n\n新しい条件で質問してください。");
        setCommand("");
        return;
      }
      
      // キャンセルの場合
      if (userResponse.includes("キャンセル") || userResponse.includes("やめる") || userResponse.includes("戻る")) {
        setApprovalStep("none");
        setFollowupCandidates(null);
        setMailPreview(null);
        // 回答を履歴に追加
        setMessages(prev => [...prev, { content: command, type: 'answer' }]);
        setAiResponse("検索をキャンセルしました。新しい質問をどうぞ。");
        setCommand("");
        return;
      }
    }

    // 通常のコマンド処理
    setAiResponse("");
    setSuggestions([]);
    setFollowupCandidates(null);
    setMailPreview(null);
    setApprovalStep("none");
    
    if (command.includes("フォローアップメール")) {
      // APIから取得
      try {
        const res = await fetch("/api/followup-candidates");
        const data = await res.json();
        const candidates = data.candidates || [];
        setFollowupCandidates(candidates);
        setMailPreview(
          `件名: ご無沙汰しております（${candidates[0]?.name ?? "顧客名"}様）\n\n${candidates[0]?.name ?? "顧客名"}様\n\nお世話になっております。\n前回ご提案後、ご不明点や追加のご要望などございませんでしょうか？\nご返信をお待ちしております。\n\nSalesOnチーム`
        );
        setApprovalStep("search_results");
        // 質問を履歴に追加
        setMessages([{ content: command, type: 'question' }]);
        setCommand("");
      } catch (e) {
        setAiResponse("API取得に失敗しました");
      }
      return;
    }
    
    setTimeout(() => {
      setAiResponse("AI: ご要望の内容について対応案を提案します。詳細は以下のナレッジもご参照ください。");
      setSuggestions([
        { icon: "spreadsheet", title: "様々なCRMツールの比較表をスプレッドシートに生成する", url: "#" },
        { icon: "search", title: "S&P500の株価予測レポートを作成する", url: "#" },
        { icon: "send", title: "自社の経費精算のマニュアルに従って経費精算を行う", url: "#" },
        { icon: "pen", title: "エンジニア職のジョブディスクリプションを書く", url: "#" },
      ]);
      setCommand("");
    }, 0);
    if (command.trim()) setCommandHistory(prev => [...prev, command]);
  };

  const handleClear = () => {
    setAiResponse("");
    setSuggestions([]);
    setFollowupCandidates(null);
    setMailPreview(null);
    setApprovalStep("none");
    setLastCommand("");
    setEditableQuestion("");
    setMessages([]);
    setCommand("");
  };

  // フォローアップメール承認処理
  const handleApprove = () => {
    setApprovalStep("sent");
  };
  // フォローアップメール修正処理（今回はダミーでリセット）
  const handleEdit = () => {
    setApprovalStep("none");
    setFollowupCandidates(null);
    setMailPreview(null);
  };

  // タスク一覧用のカラム定義
  const taskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-red-100' : info.getValue()==='中' ? 'bg-yellow-100' : 'bg-gray-100'}`}>{info.getValue()}</span> },
    { accessorKey: "task", header: "タスク名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "daysLeft", header: "残日数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "status", header: "ステータス", cell: info => <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span> },
    { accessorKey: "project", header: "関連案件", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "auto", header: "AI/手動", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
  ];
  const [taskColumnVisibility, setTaskColumnVisibility] = useState(taskColumns.map(() => true));
  // Data Table用ダミーデータ
  const taskData = [
    { task: "顧客Aへ見積送付", project: "A社案件", customerType: "新規", priority: "高", deadline: "2024/07/10", daysLeft: "3日", status: "進行中", auto: "AI自動", approval: "承認待ち" },
    { task: "商談Bの準備", project: "B社案件", customerType: "既存", priority: "中", deadline: "2024/07/12", daysLeft: "1日", status: "未着手", auto: "手動", approval: "" },
    { task: "C社 提案書ドラフト作成", project: "C社新規案件", customerType: "新規", priority: "高", deadline: "2024/07/15", daysLeft: "2日", status: "進行中", auto: "AI自動", approval: "" },
    { task: "D社 定例会議準備", project: "D社サポート案件", customerType: "既存", priority: "中", deadline: "2024/07/13", daysLeft: "0日", status: "進行中", auto: "手動", approval: "" },
    { task: "E社 契約書レビュー", project: "E社更新案件", customerType: "既存", priority: "高", deadline: "2024/07/09", daysLeft: "1日", status: "完了", auto: "AI自動", approval: "" },
    { task: "F社 サポート対応", project: "F社サポート案件", customerType: "既存", priority: "低", deadline: "2024/07/20", daysLeft: "0日", status: "未着手", auto: "手動", approval: "" },
    { task: "G社 進捗報告作成", project: "G社大型案件", customerType: "新規", priority: "高", deadline: "2024/07/11", daysLeft: "0日", status: "進行中", auto: "AI自動", approval: "承認待ち" },
    { task: "H社 顧客ヒアリング", project: "H社新規案件", customerType: "新規", priority: "中", deadline: "2024/07/18", daysLeft: "0日", status: "進行中", auto: "手動", approval: "" },
    { task: "I社 サービス説明資料作成", project: "I社新規案件", customerType: "新規", priority: "低", deadline: "2024/07/22", daysLeft: "0日", status: "未着手", auto: "AI自動", approval: "" },
    { task: "J社 受注処理", project: "J社大型案件", customerType: "新規", priority: "高", deadline: "2024/07/14", daysLeft: "0日", status: "進行中", auto: "手動", approval: "承認待ち" },
  ];

  // リスク案件用のカラム定義
  const riskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "risk", header: "リスク", cell: info => <span className="text-red-600 font-normal">{info.getValue()}</span> },
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-red-100' : info.getValue()==='中' ? 'bg-yellow-100' : 'bg-gray-100'}`}>{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customer", header: "顧客名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "progress", header: "進捗", cell: info => {
      const value = info.getValue() as unknown;
      const progress = value as { percent: number; color: string };
      return (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${progress.color} rounded-full h-2`} style={{ width: `${progress.percent}%` }}></div>
        </div>
      );
    }}
  ];
  const [riskColumnVisibility, setRiskColumnVisibility] = useState(riskColumns.map(() => true));

  // リスク案件用のダミーデータ
  const riskData = [
    { project: "新製品導入プロジェクト", customer: "株式会社みらいテック", customerType: "新規", deadline: "2024/07/10", priority: "高", progress: { percent: 80, color: "bg-blue-500" }, risk: "期限超過" },
    { project: "システム更改案件", customer: "東都情報サービス株式会社", customerType: "既存", deadline: "2024/07/12", priority: "中", progress: { percent: 40, color: "bg-blue-400" }, risk: "進捗遅延" },
    { project: "海外展開サポート", customer: "グローバル商事株式会社", customerType: "新規", deadline: "2024/07/15", priority: "高", progress: { percent: 20, color: "bg-blue-300" }, risk: "顧客要望未対応" },
    { project: "契約更新交渉", customer: "日本エネルギー株式会社", customerType: "既存", deadline: "2024/07/18", priority: "中", progress: { percent: 60, color: "bg-blue-500" }, risk: "承認遅延" },
    { project: "新規サービス提案", customer: "株式会社さくらネット", customerType: "新規", deadline: "2024/07/20", priority: "高", progress: { percent: 50, color: "bg-blue-400" }, risk: "顧客連絡途絶" },
  ];

  // AI提案用のカラム定義
  const aiColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-red-100' : info.getValue()==='中' ? 'bg-yellow-100' : 'bg-gray-100'}`}>{info.getValue()}</span> },
    { accessorKey: "proposal", header: "提案内容", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "last", header: "前回実行", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
  ];
  const [aiColumnVisibility, setAiColumnVisibility] = useState(aiColumns.map(() => true));

  // AI提案用のダミーデータ
  const aiData = [
    { project: "新製品導入プロジェクト", customerType: "新規", proposal: "顧客Aにフォローアップメール送信", priority: "高", last: "初回提案済み" },
    { project: "システム更改案件", customerType: "既存", proposal: "B社に技術資料を追加送付", priority: "中", last: "基本提案書送付済み" },
    { project: "海外展開サポート", customerType: "新規", proposal: "C社に現地パートナー紹介", priority: "高", last: "初期ヒアリング完了" },
    { project: "契約更新交渉", customerType: "既存", proposal: "D社に価格見直し提案", priority: "中", last: "現行契約継続中" },
    { project: "新規サービス提案", customerType: "新規", proposal: "E社に追加サービス紹介", priority: "高", last: "基本サービス導入済み" },
  ];

  // フォローアップ候補テーブルのカラム定義
  const followupColumns: ColumnDef<any, React.ReactNode>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="全て選択"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
          aria-label="行を選択"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { 
      accessorKey: "name",
      header: "担当者名",
      cell: info => <span className="text-black font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "company",
      header: "会社名",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "lastContact",
      header: "最終接触日",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "status",
      header: "ステータス",
      cell: info => <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "priority",
      header: "優先度",
      cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span>
    },
    { 
      accessorKey: "nextAction",
      header: "次のアクション",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
  ];

  // 質問リストをファイルから取得（現状は静的に記述）
  const questionList = [
    "フォローアップメールが必要な案件を抽出して"
  ];

  // コマンド入力欄の表示位置を制御
  const showInputAtBottom =
    approvalStep === "search_results" ||
    approvalStep === "select_recipients" ||
    approvalStep === "preview_mail" ||
    approvalStep === "sent" ||
    !!aiResponse;

  // コマンド履歴用の状態追加
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // タブの選択状態を管理
  const [currentTab, setCurrentTab] = useState('tasks');

  // メンバー実績用のカラム定義
  const memberColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "name", header: "メンバー名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "role", header: "役割", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "deals", header: "成約件数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "revenue", header: "売上金額", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "progress", header: "目標達成率", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}%</span> }
  ];
  const [memberColumnVisibility, setMemberColumnVisibility] = useState(memberColumns.map(() => true));

  // メンバー実績用のダミーデータ
  const memberData = [
    { name: "山田太郎", role: "営業マネージャー", deals: 15, revenue: "¥15,000,000", progress: 85 },
    { name: "鈴木一郎", role: "営業担当", deals: 10, revenue: "¥10,000,000", progress: 75 },
    { name: "佐藤花子", role: "営業担当", deals: 8, revenue: "¥8,000,000", progress: 60 },
    { name: "田中次郎", role: "営業担当", deals: 12, revenue: "¥12,000,000", progress: 90 }
  ];

  // 競合利用企業用のカラム定義
  const competitorColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "company", header: "企業名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "competitor", header: "利用中の競合製品", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "contract", header: "契約更新時期", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "status", header: "ステータス", cell: info => <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span> }
  ];
  const [competitorColumnVisibility, setCompetitorColumnVisibility] = useState(competitorColumns.map(() => true));

  // 競合利用企業用のダミーデータ
  const competitorData = [
    { company: "株式会社ABC", competitor: "競合製品X", contract: "2024/09", status: "アプローチ中" },
    { company: "DEF工業", competitor: "競合製品Y", contract: "2024/12", status: "情報収集中" },
    { company: "GHI商事", competitor: "競合製品Z", contract: "2024/10", status: "商談開始" }
  ];

  // スリップ案件用のカラム定義
  const slipColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "company", header: "企業名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "currentMonth", header: "当初予定", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "slipMonth", header: "スリップ先", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "reason", header: "理由", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
  ];
  const [slipColumnVisibility, setSlipColumnVisibility] = useState(slipColumns.map(() => true));

  // スリップ案件用のダミーデータ
  const slipData = [
    { project: "システム更改案件", company: "株式会社ABC", currentMonth: "2024/07", slipMonth: "2024/08", reason: "要件定義の遅延" },
    { project: "クラウド移行案件", company: "DEF工業", currentMonth: "2024/07", slipMonth: "2024/09", reason: "社内決裁の遅れ" },
    { project: "データ連携案件", company: "GHI商事", currentMonth: "2024/07", slipMonth: "2024/08", reason: "技術検証の追加" }
  ];

  // 承認/却下/編集のハンドラー
  const handleAiTaskApprove = (task: any) => {
    // TODO: 承認処理の実装
    console.log('承認:', task);
  };

  const handleAiTaskReject = (task: any) => {
    // TODO: 却下処理の実装
    console.log('却下:', task);
  };

  const handleAiTaskEdit = (task: any) => {
    // TODO: 編集モーダルを表示
    console.log('編集:', task);
  };

  // AI承認待ちタスク用のカラム定義
  const aiApprovalColumns: ColumnDef<any, React.ReactNode>[] = [
    { 
      accessorKey: "priority", 
      header: "優先度",
      cell: info => {
        const value = info.getValue() as string;
        return (
          <span className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ${
            value === '優先' ? 'bg-red-50 text-red-700' : 
            'bg-yellow-50 text-yellow-700'
          }`}>
            {value}
          </span>
        );
      }
    },
    { 
      accessorKey: "status",
      header: "ステータス",
      cell: info => {
        const status = info.getValue() as '承認待ち' | '修正中' | '却下済み';
        const statusStyles = {
          '承認待ち': 'bg-blue-50 text-blue-700',
          '修正中': 'bg-yellow-50 text-yellow-700',
          '却下済み': 'bg-red-50 text-red-700'
        } as const;
        return (
          <span className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium ${statusStyles[status]}`}>
            {status}
          </span>
        );
      }
    },
    { 
      accessorKey: "timestamp", 
      header: "実行日時",
      cell: info => <span className="text-gray-700">{info.getValue()}</span>
    },
    { 
      accessorKey: "deadline", 
      header: "対応期限",
      cell: info => <span className="text-gray-700">{info.getValue()}</span>
    },
    { 
      accessorKey: "taskName", 
      header: "タスク名",
      cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>
    },
    { 
      accessorKey: "details", 
      header: "実行詳細",
      cell: info => {
        const details = info.getValue() as string[];
        return (
          <ul className="list-disc list-inside space-y-1.5 text-gray-600">
            {details.map((detail, idx) => (
              <li key={idx} className="text-sm">{detail}</li>
            ))}
          </ul>
        );
      }
    },
    {
      accessorKey: "assignee",
      header: "担当者",
      cell: info => <span className="text-gray-700">{info.getValue()}</span>
    },
    {
      accessorKey: "target",
      header: "対象企業",
      cell: info => <span className="text-gray-700">{info.getValue()}</span>
    },
    { 
      id: "actions",
      header: () => <div className="text-right">操作</div>,
      cell: info => (
        <div className="flex justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 bg-white hover:bg-green-50 text-green-700 border-green-200 hover:border-green-300"
            onClick={() => handleAiTaskApprove(info.row.original)}
          >
            承認
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 bg-white hover:bg-gray-50 text-gray-700 border-gray-200"
            onClick={() => handleAiTaskEdit(info.row.original)}
          >
            修正
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-3 bg-white hover:bg-red-50 text-red-700 border-red-200 hover:border-red-300"
            onClick={() => handleAiTaskReject(info.row.original)}
          >
            却下
          </Button>
        </div>
      )
    }
  ];

  // AI承認待ちタスク用のダミーデータ
  const aiApprovalData = [
    { 
      timestamp: "2024/07/10 15:30",
      priority: "優先",
      status: "承認待ち",
      deadline: "2024/07/11 15:30",
      taskName: "フォローアップメール作成と送信",
      target: "株式会社ABC",
      details: [
        "前回提案から2週間経過",
        "製品導入に関する追加提案",
        "デモ環境の準備完了報告"
      ],
      assignee: "山田太郎"
    },
    {
      timestamp: "2024/07/10 14:45",
      priority: "通常",
      status: "修正中",
      deadline: "2024/07/11 14:45",
      taskName: "商談議事録作成と共有",
      target: "DEF工業",
      details: [
        "本日の商談内容を要約",
        "予算感の確認",
        "技術要件の整理",
        "次回アクションの設定"
      ],
      assignee: "鈴木一郎"
    },
    {
      timestamp: "2024/07/10 13:20",
      priority: "優先",
      status: "承認待ち",
      deadline: "2024/07/11 13:20",
      taskName: "提案書v2の作成と価格見直し",
      target: "GHI商事",
      details: [
        "提案書v2の作成完了",
        "価格の見直し",
        "導入スケジュールの調整",
        "付帯サービスの追加"
      ],
      assignee: "佐藤花子"
    },
    {
      timestamp: "2024/07/10 11:15",
      priority: "優先",
      status: "却下済み",
      deadline: "2024/07/11 11:15",
      taskName: "失注リスク対応策の立案",
      target: "JKL株式会社",
      details: [
        "競合製品との比較分析完了",
        "当社優位性の整理",
        "価格戦略の提案",
        "導入事例の追加"
      ],
      assignee: "田中次郎"
    },
    {
      timestamp: "2024/07/10 10:30",
      priority: "通常",
      status: "承認待ち",
      deadline: "2024/07/11 10:30",
      taskName: "契約更新提案書の作成",
      target: "MNO産業",
      details: [
        "更新プラン作成完了",
        "新機能の紹介",
        "利用実績の分析",
        "割引プランの提案"
      ],
      assignee: "高橋美咲"
    }
  ];

  // 状態管理の定義を更新
  const [aiApprovalColumnVisibility, setAiApprovalColumnVisibility] = useState<boolean[]>(aiApprovalColumns.map(() => true));

  return (
    <div className="flex flex-col min-h-screen">
      <Header onClear={handleClear} />
      
      {/* メインコンテンツエリア */}
      <main className="flex-1 container mx-auto px-8 pt-8 pb-48">
        <div className="space-y-4">
          {/* ホーム画面（初期表示時） */}
          {approvalStep === "none" && !aiResponse && !followupCandidates && (
            <>
              {/* タイトルとコマンド入力欄 */}
              <div className="w-full flex flex-col items-center pt-8 pb-4">
                <h1 className="text-center font-semibold text-[64px] mb-8">SalesOn</h1>
                <div className="w-full max-w-[1000px] flex justify-center">
                  <div className="w-full flex flex-col gap-2">
                    <div className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3">
                      <Textarea
                        placeholder="Selaに質問してみましょう"
                        value={command}
                        onChange={e => {
                          setCommand(e.target.value);
                          validateCommand(e.target.value);
                        }}
                        className="command-textarea flex-1 resize-none h-12 min-h-[48px] bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                        rows={1}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!command.trim() || alertMessage !== null}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${command.trim() && !alertMessage ? 'bg-[#22223b] text-white hover:bg-black' : 'bg-gray-200 text-gray-400'}`}
                        aria-label="送信"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M22 2L11 13" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                      </Button>
                    </div>
                    {/* アラートメッセージ表示 */}
                    {alertMessage && (
                      <div className="text-red-600 text-xs px-2">
                        {alertMessage}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* タブ付きテーブル */}
              <div className="w-full bg-white border border-gray-100 rounded-xl shadow p-4">
                <Tabs defaultValue="tasks" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <TabsList className="bg-gray-100 text-base flex-shrink-0">
                      <TabsTrigger value="tasks" className="text-gray-700 font-normal text-base">今日のタスク</TabsTrigger>
                      <TabsTrigger value="risks" className="text-gray-700 font-normal text-base">失注リスク</TabsTrigger>
                      <TabsTrigger value="members" className="text-gray-700 font-normal text-base">メンバー実績</TabsTrigger>
                      <TabsTrigger value="competitors" className="text-gray-700 font-normal text-base">競合利用企業</TabsTrigger>
                      <TabsTrigger value="slips" className="text-gray-700 font-normal text-base">スリップ案件</TabsTrigger>
                      <TabsTrigger value="ai-history" className="text-gray-700 font-normal text-base">AI承認待ち</TabsTrigger>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 shrink-0 pl-4 pr-6"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      {/* 検索ボックススロット */}
                      <Input
                        placeholder="検索..."
                        className="w-48 text-base"
                      />
                      {/* カラム選択スロット: タブごとに切り替え */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="ml-2">
                            表示カラム <ChevronDown className="ml-2 w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {currentTab === 'risks' ? (
                            riskColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={riskColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setRiskColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'members' ? (
                            memberColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={memberColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setMemberColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'competitors' ? (
                            competitorColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={competitorColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setCompetitorColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'slips' ? (
                            slipColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={slipColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setSlipColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'ai-history' ? (
                            aiApprovalColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={aiApprovalColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setAiApprovalColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : (
                            taskColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={taskColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setTaskColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <TabsContent value="tasks">
                    <div className="overflow-x-auto">
                      <DataTable columns={taskColumns.filter((_, i) => taskColumnVisibility[i])} data={taskData}
                        searchSlot={null}
                        columnSelectorSlot={null}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="risks">
                    <div className="overflow-x-auto">
                      <DataTable columns={riskColumns.filter((_, i) => riskColumnVisibility[i])} data={riskData}
                        searchSlot={null}
                        columnSelectorSlot={null}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="members">
                    <div className="overflow-x-auto">
                      <DataTable columns={memberColumns.filter((_, i) => memberColumnVisibility[i])} data={memberData}
                        searchSlot={null}
                        columnSelectorSlot={null}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="competitors">
                    <div className="overflow-x-auto">
                      <DataTable columns={competitorColumns.filter((_, i) => competitorColumnVisibility[i])} data={competitorData}
                        searchSlot={null}
                        columnSelectorSlot={null}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="slips">
                    <div className="overflow-x-auto">
                      <DataTable columns={slipColumns.filter((_, i) => slipColumnVisibility[i])} data={slipData}
                        searchSlot={null}
                        columnSelectorSlot={null}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="ai-history">
                    <div className="overflow-x-auto">
                      <DataTable 
                        columns={aiApprovalColumns.filter((_, i) => aiApprovalColumnVisibility[i])} 
                        data={aiApprovalData}
                        searchSlot={null}
                        columnSelectorSlot={null}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}

          {/* チャット開始後のコンテンツ */}
          {(approvalStep !== "none" || aiResponse || followupCandidates) && (
            <>
              {messages.length > 0 && <MessageHistory />}
              {/* 質問内容の表示 */}
              {lastCommand && (
                <div className="w-full max-w-[1000px] mx-auto mt-4 flex justify-end">
                  <div className="w-fit ml-auto bg-[#22223b] rounded-3xl px-8 py-6 text-xl text-white font-medium">
                    {lastCommand}
                  </div>
                </div>
              )}

              {/* AI抽出説明文の表示 */}
              {aiResponse && (
                <div className="w-full max-w-[1000px] mx-auto bg-white border border-gray-100 rounded-xl shadow p-8">
                  <div className="text-gray-600 whitespace-pre-wrap">{aiResponse}</div>
                </div>
              )}

              {/* フォローアップ候補テーブル */}
              {followupCandidates && (
                <>
                  <SearchResultTemplate
                    title="フォローアップ候補"
                    description={`以下の${followupCandidates.length}件の案件が抽出されました。フォローアップメールの送信対象を選択してください。`}
                    dataComponent={
                      <DataTable
                        columns={followupColumns}
                        data={followupCandidates}
                        showSearch={false}
                        showColumnSelector={false}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                      />
                    }
                    nextActionText="選択された案件でメールプレビューを表示しますか？"
                  />
                  
                  {/* 送信先ごとにメールプレビュー＋チェックボックス */}
                  <div className="w-full max-w-[1000px] mx-auto mt-6 flex flex-col gap-6">
                  <div className="mt-2 flex justify-end">
                      {approvalStep === 'search_results' && (
                        <Button
                          onClick={() => setApprovalStep('preview_mail')}
                          className="bg-[#22223b] text-white hover:bg-black rounded-xl px-4 py-2 text-base font-medium"
                        >
                          はい
                        </Button>
                      )}
                    </div>
                    {followupCandidates.filter((_, idx) => rowSelection[idx]).map((candidate, idx) => (
                      <div key={candidate.id} className="relative bg-white border border-gray-100 rounded-xl shadow p-6">
                        <div className="absolute top-4 right-4">
                          <Checkbox
                            checked={rowSelection[idx] ?? false}
                            onCheckedChange={(checked: boolean | 'indeterminate') => {
                              setRowSelection((prev) => ({ ...prev, [idx]: checked === true }));
                            }}
                            aria-label="送信対象に含める"
                          />
                        </div>
                        <div className="text-base text-gray-700 mb-2 font-semibold">
                          件名：ご無沙汰しております（{candidate.name}様）
                        </div>
                        <div className="text-base text-gray-700 whitespace-pre-line font-mono">
                          {candidate.name}\n\nお世話になっております。\n前回ご提案後、ご不明点や追加のご要望などございませんでしょうか？\nご返信をお待ちしております。\n\nSalesOnチーム
                        </div>
                      </div>
                    ))}
                    <div className="mt-4 text-gray-600 text-base">
                      選択された{selectedRecipients.length}件の候補案件に対してメールを作成しました。この内容で送信しますか？
                    </div>
                    <div className="w-full max-w-[1000px] mx-auto mt-2 flex justify-end">
                      <div className="w-fit ml-auto bg-[#22223b] rounded-2xl px-4 py-2 text-base text-white font-medium">
                        はい
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 送信完了情報をシンプルに表示（枠・padding・アイコンなし） */}
              {selectedRecipients.length > 0 && (
                <div className="w-full max-w-[1000px] mx-auto">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800">メール送信が完了しました</h3>
                    <p className="text-gray-600">フォローアップメールの送信が正常に完了しました。</p>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">送信日時:</span>
                      <span>{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">送信件数:</span>
                      <span>{selectedRecipients.length}件</span>
                    </div>
                    <div>
                      <span className="font-medium">送信先:</span>
                      <ul className="mt-2 space-y-1 list-inside">
                        {selectedRecipients.map((idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span>{followupCandidates?.[idx].company} {followupCandidates?.[idx].name}様</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* サジェスト */}
              {suggestions.length > 0 && (
                <div className="w-full max-w-[1000px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suggestions.map((suggestion, i) => (
                    <a
                      key={i}
                      href={suggestion.url}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow hover:shadow-md transition-shadow"
                    >
                      {suggestion.icon === "spreadsheet" && <FileSpreadsheet className="w-5 h-5 text-gray-500" />}
                      {suggestion.icon === "search" && <Search className="w-5 h-5 text-gray-500" />}
                      {suggestion.icon === "send" && <Send className="w-5 h-5 text-gray-500" />}
                      {suggestion.icon === "pen" && <PenLine className="w-5 h-5 text-gray-500" />}
                      <span className="text-sm text-gray-700">{suggestion.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {(approvalStep !== "none" || aiResponse || followupCandidates) && (
        <div className="fixed bottom-0 left-0 right-0 z-50 w-full flex justify-center pointer-events-none">
          <div className="max-w-[1000px] w-full mx-auto px-8 py-8 pointer-events-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3">
                <Textarea
                  placeholder="Selaに質問してみましょう"
                  value={command}
                  onChange={e => {
                    setCommand(e.target.value);
                    validateCommand(e.target.value);
                  }}
                  className="command-textarea flex-1 resize-none h-12 min-h-[48px] bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                  rows={1}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!command.trim() || alertMessage !== null}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${command.trim() && !alertMessage ? 'bg-[#22223b] text-white hover:bg-black' : 'bg-gray-200 text-gray-400'}`}
                  aria-label="送信"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </Button>
              </div>
              {/* アラートメッセージ表示 */}
              {alertMessage && (
                <div className="text-red-600 text-xs px-2">
                  {alertMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 