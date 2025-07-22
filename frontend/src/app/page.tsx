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
import { Bell, Calendar, ChevronDown, FileSpreadsheet, PenLine, Plus, Search, Send, User } from "lucide-react";
import Link from "next/link";
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
          ? "bg-gray-800 rounded-3xl px-8 py-6 w-fit text-xl text-white font-medium mb-4"
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

type Suggestion = { icon: string; title: string; url: string };
// メッセージ型の定義を追加
type Message = {
  content: string;
  type: 'question' | 'answer' | 'system';
};

// カラム定義
const taskColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "priority", header: "優先度", cell: info => <span className="text-black rounded px-2 py-0.5 font-normal bg-gray-100">{info.getValue()}</span> },
  { 
    accessorKey: "task", 
    header: "タスク名", 
    cell: info => {
      const row = info.row.original;
      return (
        <Link 
          href={`/tasks/task-1`}
          className="text-gray-600 hover:text-gray-900 hover:underline cursor-pointer transition-colors"
          style={{ textDecoration: "none" }}
        >
          {info.getValue()}
        </Link>
      );
    }
  },
  { accessorKey: "project", header: "案件名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "assignee", header: "担当者", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "daysLeft", header: "残日数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "auto", header: "AI/手動", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "approval", header: "承認", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
]

const riskColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-red-100' : 'bg-yellow-100'}`}>{info.getValue()}</span> },
  { accessorKey: "project", header: "案件名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "assignee", header: "担当者", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "risk", header: "リスク", cell: info => <span className="text-red-600 font-normal">{info.getValue()}</span> }
]

const memberColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "name", header: "メンバー名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
  { accessorKey: "role", header: "役割", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "deals", header: "成約件数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "revenue", header: "売上金額", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "progress", header: "目標達成率", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}%</span> }
]

const competitorColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "company", header: "顧客名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
  { accessorKey: "competitor", header: "利用中の競合製品", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "contract", header: "契約更新時期", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
]

const slipColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
  { accessorKey: "company", header: "顧客名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "currentMonth", header: "当初予定", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "slipMonth", header: "スリップ先", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "reason", header: "理由", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
]

const aiApprovalColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-red-100' : 'bg-yellow-100'}`}>{info.getValue()}</span> },
  { accessorKey: "taskName", header: "タスク名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "assignee", header: "担当者", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
]

// データ定義
const taskData = [
  { taskId: "task-001", task: "顧客Aへ見積送付", project: "A社案件", customerType: "新規", priority: "高", assignee: "山田太郎", deadline: "2024/07/10", daysLeft: "3日", status: "進行中", auto: "AI自動", approval: "承認待ち" },
  { taskId: "task-002", task: "商談Bの準備", project: "B社案件", customerType: "既存", priority: "中", assignee: "鈴木一郎", deadline: "2024/07/12", daysLeft: "1日", status: "未着手", auto: "手動", approval: "" },
  { taskId: "task-003", task: "C社 提案書ドラフト作成", project: "C社新規案件", customerType: "新規", priority: "高", assignee: "佐藤花子", deadline: "2024/07/15", daysLeft: "2日", status: "進行中", auto: "AI自動", approval: "" },
  { taskId: "task-004", task: "D社 定例会議準備", project: "D社サポート案件", customerType: "既存", priority: "中", assignee: "田中次郎", deadline: "2024/07/13", daysLeft: "0日", status: "進行中", auto: "手動", approval: "" },
  { taskId: "task-005", task: "E社 契約書レビュー", project: "E社更新案件", customerType: "既存", priority: "高", assignee: "山田太郎", deadline: "2024/07/09", daysLeft: "1日", status: "完了", auto: "AI自動", approval: "" },
  { taskId: "task-006", task: "F社 サポート対応", project: "F社サポート案件", customerType: "既存", priority: "低", assignee: "鈴木一郎", deadline: "2024/07/20", daysLeft: "0日", status: "未着手", auto: "手動", approval: "" },
  { taskId: "task-007", task: "G社 進捗報告作成", project: "G社大型案件", customerType: "新規", priority: "高", assignee: "佐藤花子", deadline: "2024/07/11", daysLeft: "0日", status: "進行中", auto: "AI自動", approval: "承認待ち" },
  { taskId: "task-008", task: "H社 顧客ヒアリング", project: "H社新規案件", customerType: "新規", priority: "中", assignee: "田中次郎", deadline: "2024/07/18", daysLeft: "0日", status: "進行中", auto: "手動", approval: "" },
  { taskId: "task-009", task: "I社 サービス説明資料作成", project: "I社新規案件", customerType: "新規", priority: "低", assignee: "山田太郎", deadline: "2024/07/22", daysLeft: "0日", status: "未着手", auto: "AI自動", approval: "" },
  { taskId: "task-010", task: "J社 受注処理", project: "J社大型案件", customerType: "新規", priority: "高", assignee: "鈴木一郎", deadline: "2024/07/14", daysLeft: "0日", status: "進行中", auto: "手動", approval: "承認待ち" }
]

const riskData = [
  { priority: "高", project: "新製品導入プロジェクト", assignee: "山田太郎", deadline: "2024/07/10", daysLeft: "3日", status: "進行中", risk: "期限超過" },
  { priority: "中", project: "システム更改案件", assignee: "鈴木一郎", deadline: "2024/07/12", daysLeft: "1日", status: "未着手", risk: "進捗遅延" }
]

const memberData = [
  { name: "山田太郎", role: "営業マネージャー", deals: 15, revenue: "¥15,000,000", progress: 85 },
  { name: "鈴木一郎", role: "営業担当", deals: 10, revenue: "¥10,000,000", progress: 75 },
  { name: "佐藤花子", role: "営業担当", deals: 8, revenue: "¥8,000,000", progress: 60 },
  { name: "田中次郎", role: "営業担当", deals: 12, revenue: "¥12,000,000", progress: 90 }
]

const competitorData = [
  { company: "株式会社ABC", competitor: "競合製品X", contract: "2024/12", status: "情報収集中" },
  { company: "DEF工業", competitor: "競合製品Y", contract: "2024/10", status: "商談開始" },
  { company: "GHI商事", competitor: "競合製品Z", contract: "2024/11", status: "検討中" }
]

const slipData = [
  { project: "システム更改案件", company: "株式会社ABC", currentMonth: "2024/07", slipMonth: "2024/08", reason: "要件定義の遅延" },
  { project: "クラウド移行案件", company: "DEF工業", currentMonth: "2024/07", slipMonth: "2024/09", reason: "社内決裁の遅れ" },
  { project: "データ連携案件", company: "GHI商事", currentMonth: "2024/07", slipMonth: "2024/08", reason: "技術検証の追加" }
]

const aiApprovalData = [
  { priority: "優先", taskName: "フォローアップメール作成と送信", assignee: "山田太郎", deadline: "2024/07/11", status: "承認待ち" },
  { priority: "通常", taskName: "商談議事録作成と共有", assignee: "鈴木一郎", deadline: "2024/07/11", status: "修正中" }
]

export default function Home() {
  // State定義
  const [command, setCommand] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [followupCandidates, setFollowupCandidates] = useState<any[] | null>(null)
  const [mailPreview, setMailPreview] = useState<string | null>(null)
  const [approvalStep, setApprovalStep] = useState<"none" | "search_results" | "select_recipients" | "preview_mail" | "sent">("none")
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([0,1])
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({ 0: true, 1: true })
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [editingMailId, setEditingMailId] = useState<string | null>(null)
  const [editedMails, setEditedMails] = useState<{[key: string]: {subject: string, body: string}}>({})
  const [currentTab, setCurrentTab] = useState('tasks')
  const [taskColumnVisibility, setTaskColumnVisibility] = useState(taskColumns.map(() => true))
  const [riskColumnVisibility, setRiskColumnVisibility] = useState(riskColumns.map(() => true))
  const [memberColumnVisibility, setMemberColumnVisibility] = useState(memberColumns.map(() => true))
  const [competitorColumnVisibility, setCompetitorColumnVisibility] = useState(competitorColumns.map(() => true))
  const [slipColumnVisibility, setSlipColumnVisibility] = useState(slipColumns.map(() => true))
  const [aiApprovalColumnVisibility, setAiApprovalColumnVisibility] = useState(aiApprovalColumns.map(() => true))

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
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.type === 'question' ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
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
        const basePath = process.env.NODE_ENV === 'production' ? '/salesmock' : '';
        const res = await fetch(`${basePath}/api/followup-candidates`);
        const data = await res.json();
        const candidates = data.candidates || [];
        setFollowupCandidates(candidates);
        
        // 各候補の次のアクションに基づいてメールプレビューを生成
        const generateMailContent = (candidate: any) => {
          const { name, project, nextAction, lastAction } = candidate;
          
          let subject = "";
          let body = "";
          
          switch (nextAction) {
            case "価格見積もり送付":
              subject = `${project} 価格見積もりについて`;
              body = `${name}様\n\nお世話になっております。\n先日は${lastAction}にご参加いただき、ありがとうございました。\n\n${project}について、詳細な価格見積もりを準備いたしました。\n添付資料をご確認いただけますでしょうか。\n\nご不明な点やご質問がございましたら、お気軽にお声がけください。\n\nご検討をお待ちしております。\n\nSalesOnチーム`;
              break;
            case "追加資料提供":
              subject = `${project} 追加資料のご提供`;
              body = `${name}様\n\nお世話になっております。\n先日は${lastAction}をご検討いただき、ありがとうございました。\n\n${project}について、ご要望いただいた追加資料を準備いたしました。\n技術仕様書と導入スケジュールの詳細を添付いたします。\n\nご不明な点がございましたら、お気軽にお声がけください。\n\nSalesOnチーム`;
              break;
            case "決裁者へのアプローチ":
              subject = `${project} 決裁者様へのご紹介`;
              body = `${name}様\n\nお世話になっております。\n先日は${lastAction}にご協力いただき、ありがとうございました。\n\n${project}について、決裁者様へのご紹介をお願いできませんでしょうか。\n弊社の提案内容について、直接ご説明させていただきたいと思います。\n\nご都合の良い日時をご教示いただけますでしょうか。\n\nSalesOnチーム`;
              break;
            default:
              subject = `ご無沙汰しております（${name}様）`;
              body = `${name}様\n\nお世話になっております。\n前回ご提案後、ご不明点や追加のご要望などございませんでしょうか？\nご返信をお待ちしております。\n\nSalesOnチーム`;
          }
          
          return `件名: ${subject}\n\n${body}`;
        };
        
        // 選択された候補のメールプレビューを生成
        const selectedCandidates = candidates.filter((c: any) => c.selected);
        const mailPreviews = selectedCandidates.map(generateMailContent);
        setMailPreview(mailPreviews.join('\n\n---\n\n'));
        
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
    setEditingMailId(null);
    setEditedMails({});
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
      header: "顧客名",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "project",
      header: "案件名",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "lastContact",
      header: "最終接触日",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "status",
      header: "案件ステータス",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
    },
    { 
      accessorKey: "lastAction",
      header: "前回接触内容",
      cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span>
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

  // メンバー実績用のダミーデータ
  const memberData = [
    { name: "山田太郎", role: "営業マネージャー", deals: 15, revenue: "¥15,000,000", progress: 85 },
    { name: "鈴木一郎", role: "営業担当", deals: 10, revenue: "¥10,000,000", progress: 75 },
    { name: "佐藤花子", role: "営業担当", deals: 8, revenue: "¥8,000,000", progress: 60 },
    { name: "田中次郎", role: "営業担当", deals: 12, revenue: "¥12,000,000", progress: 90 }
  ];

  // 競合利用企業用のダミーデータ
  const competitorData = [
    { company: "株式会社ABC", competitor: "競合製品X", contract: "2024/12", status: "情報収集中" },
    { company: "DEF工業", competitor: "競合製品Y", contract: "2024/10", status: "商談開始" },
    { company: "GHI商事", competitor: "競合製品Z", contract: "2024/11", status: "検討中" }
  ];

  // スリップ案件用のダミーデータ
  const slipData = [
    { project: "システム更改案件", company: "株式会社ABC", currentMonth: "2024/07", slipMonth: "2024/08", reason: "要件定義の遅延" },
    { project: "クラウド移行案件", company: "DEF工業", currentMonth: "2024/07", slipMonth: "2024/09", reason: "社内決裁の遅れ" },
    { project: "データ連携案件", company: "GHI商事", currentMonth: "2024/07", slipMonth: "2024/08", reason: "技術検証の追加" }
  ];

  // タイムライン用のダミーデータ
  const timelineData = [
    {
      id: 1,
      icon: "⚡",
      actor: "Sela",
      actorType: "AI検知",
      description: "見積書の競合他社比較表を自動生成しました。",
      timestamp: "7/7 15:30"
    },
    {
      id: 2,
      icon: "⚡",
      actor: "Sela",
      actorType: "",
      description: "見積書の内容を確認しました。価格設定は適切ですが、競合他社との差別化ポイントをより明確に記載することをお勧めします。",
      timestamp: "7/7 15:00"
    },
    {
      id: 3,
      icon: "👤",
      actor: "山田太郎",
      actorType: "",
      description: "見積書のドラフトを作成しました。レビューをお願いします。",
      timestamp: "7/7 14:30"
    },
    {
      id: 4,
      icon: "✓",
      actor: "システム",
      actorType: "",
      description: "ステータスを「未着手」から「進行中」に変更しました。",
      timestamp: "7/7 10:00"
    },
    {
      id: 5,
      icon: "⚡",
      actor: "Sela",
      actorType: "",
      description: "顧客の過去の取引履歴を分析し、最適な価格設定を提案しました。",
      timestamp: "7/7 09:30"
    },
    {
      id: 6,
      icon: "⚡",
      actor: "Sela",
      actorType: "",
      description: "メール内容を解析し、タスク「顧客Aへ見積送付」を自動生成しました。",
      timestamp: "7/6 09:00"
    }
  ];

  // コメント用の状態
  const [comment, setComment] = useState("");

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

  // AI承認待ちタスク用のダミーデータ
  const aiApprovalData = [
    { 
      timestamp: "2024/07/10 15:30",
      priority: "優先",
      status: "承認待ち",
      deadline: "2024/07/11",
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
      deadline: "2024/07/11",
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
      deadline: "2024/07/11",
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
      deadline: "2024/07/11",
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
      deadline: "2024/07/11",
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
                <h1 className="text-center font-semibold text-[32px] mb-8">今日は何をしましょうか？</h1>
                <div className="w-full max-w-[1000px] flex justify-center">
                  <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3">
                    <Textarea
                        placeholder="Selaへの依頼を入力してください"
                      value={command}
                        onChange={e => {
                          setCommand(e.target.value);
                          validateCommand(e.target.value);
                        }}
                      className="command-textarea flex-1 resize-none h-[60px] min-h-[60px] bg-gray-50 border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
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
                      <TabsTrigger value="tasks" className="text-gray-700 font-normal text-base flex items-center gap-1">
                        優先タスク
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{taskData.filter(task => task.priority === '高').length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="risks" className="text-gray-700 font-normal text-base flex items-center gap-1">
                        リスク案件
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{riskData.filter(risk => risk.priority === '高').length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="members" className="text-gray-700 font-normal text-base">メンバー実績</TabsTrigger>
                      <TabsTrigger value="competitors" className="text-gray-700 font-normal text-base">競合利用企業</TabsTrigger>
                      <TabsTrigger value="slips" className="text-gray-700 font-normal text-base">スリップ案件</TabsTrigger>
                      <TabsTrigger value="ai-history" className="text-gray-700 font-normal text-base flex items-center gap-1">
                        AI承認待ち
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{aiApprovalData.filter(item => item.status === '承認待ち' && item.priority === '優先').length}</span>
                      </TabsTrigger>
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
                          ) : currentTab === 'ai' ? (
                            // aiApprovalColumnsのカラム選択ロジックも削除
                            null
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
                      <DataTable columns={aiApprovalColumns.filter((_, i) => aiApprovalColumnVisibility[i])} data={aiApprovalData.filter(item => item.status === '承認待ち')}
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
                    title="フォローアップ候補を抽出しました"
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
                    nextActionText="選択した案件について、メール内容を確認しますか？"
                  />

                  {/* コマンド入力欄 */}
                  <div className="fixed bottom-0 left-[32px] right-0 z-50 w-full flex justify-center pointer-events-none">
                    <div className="w-full max-w-[1000px] mx-auto py-8 pointer-events-auto">
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3 w-full">
                          <Textarea
                            placeholder="Selaへの依頼を入力してください"
                            value={command}
                            onChange={e => {
                              setCommand(e.target.value);
                              validateCommand(e.target.value);
                            }}
                            className="command-textarea flex-1 resize-none h-[60px] min-h-[60px] bg-gray-50 border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base w-full"
                            rows={1}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            onClick={handleSend}
                          >
                            <Send className="w-5 h-5 text-gray-500" />
                          </Button>
                        </div>
                        {alertMessage && (
                          <div className="text-red-600 text-xs px-2">
                            {alertMessage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
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
                    {followupCandidates.filter((_, idx) => rowSelection[idx]).map((candidate, idx) => {
                      // 各候補の次のアクションに基づいてメールプレビューを生成
                      const generateMailContent = (candidate: any) => {
                        const { name, project, nextAction, lastAction } = candidate;
                        
                        let subject = "";
                        let body = "";
                        
                        switch (nextAction) {
                          case "価格見積もり送付":
                            subject = `${project} 価格見積もりについて`;
                            body = `${name}様\n\nお世話になっております。\n先日は${lastAction}にご参加いただき、ありがとうございました。\n\n${project}について、詳細な価格見積もりを準備いたしました。\n添付資料をご確認いただけますでしょうか。\n\nご不明な点やご質問がございましたら、お気軽にお声がけください。\n\nご検討をお待ちしております。\n\nSalesOnチーム`;
                            break;
                          case "追加資料提供":
                            subject = `${project} 追加資料のご提供`;
                            body = `${name}様\n\nお世話になっております。\n先日は${lastAction}をご検討いただき、ありがとうございました。\n\n${project}について、ご要望いただいた追加資料を準備いたしました。\n技術仕様書と導入スケジュールの詳細を添付いたします。\n\nご不明な点がございましたら、お気軽にお声がけください。\n\nSalesOnチーム`;
                            break;
                          case "決裁者へのアプローチ":
                            subject = `${project} 決裁者様へのご紹介`;
                            body = `${name}様\n\nお世話になっております。\n先日は${lastAction}にご協力いただき、ありがとうございました。\n\n${project}について、決裁者様へのご紹介をお願いできませんでしょうか。\n弊社の提案内容について、直接ご説明させていただきたいと思います。\n\nご都合の良い日時をご教示いただけますでしょうか。\n\nSalesOnチーム`;
                            break;
                          default:
                            subject = `ご無沙汰しております（${name}様）`;
                            body = `${name}様\n\nお世話になっております。\n前回ご提案後、ご不明点や追加のご要望などございませんでしょうか？\nご返信をお待ちしております。\n\nSalesOnチーム`;
                        }
                        
                        return { subject, body };
                      };
                      
                      const mailContent = generateMailContent(candidate);
                      
                      return (
                        <div key={candidate.id} className="relative bg-white border border-gray-100 rounded-xl shadow p-6">
                          <div className="absolute top-4 left-4">
                            <Checkbox
                              checked={rowSelection[idx] ?? false}
                              onCheckedChange={(checked: boolean | 'indeterminate') => {
                                setRowSelection((prev) => ({ ...prev, [idx]: checked === true }));
                              }}
                              aria-label="送信対象に含める"
                              className="w-5 h-5"
                            />
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingMailId(editingMailId === candidate.id ? null : candidate.id)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {editingMailId === candidate.id ? '完了' : '編集'}
                            </Button>
                          </div>
                          <div className="text-base text-gray-700 mb-2 font-semibold pl-8 pr-16">
                            {editingMailId === candidate.id ? (
                              <input
                                type="text"
                                value={editedMails[candidate.id]?.subject ?? mailContent.subject}
                                onChange={(e) => setEditedMails(prev => ({
                                  ...prev,
                                  [candidate.id]: {
                                    ...prev[candidate.id],
                                    subject: e.target.value
                                  }
                                }))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-base"
                                placeholder="件名を入力"
                              />
                            ) : (
                              `件名：${editedMails[candidate.id]?.subject ?? mailContent.subject}`
                            )}
                          </div>
                          <div className="text-base text-gray-700 whitespace-pre-line font-mono pl-8 pr-16">
                            {editingMailId === candidate.id ? (
                              <textarea
                                value={editedMails[candidate.id]?.body ?? mailContent.body}
                                onChange={(e) => setEditedMails(prev => ({
                                  ...prev,
                                  [candidate.id]: {
                                    ...prev[candidate.id],
                                    body: e.target.value
                                  }
                                }))}
                                className="w-full border border-gray-300 rounded px-2 py-1 text-base font-mono min-h-[200px] resize-y"
                                placeholder="本文を入力"
                              />
                            ) : (
                              editedMails[candidate.id]?.body ?? mailContent.body
                            )}
                          </div>
                        </div>
                      );
                    })}
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
                    <Link
                      key={i}
                      href={suggestion.url}
                      className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow hover:shadow-md transition-shadow"
                    >
                      {suggestion.icon === "spreadsheet" && <FileSpreadsheet className="w-5 h-5 text-gray-500" />}
                      {suggestion.icon === "search" && <Search className="w-5 h-5 text-gray-500" />}
                      {suggestion.icon === "send" && <Send className="w-5 h-5 text-gray-500" />}
                      {suggestion.icon === "pen" && <PenLine className="w-5 h-5 text-gray-500" />}
                      <span className="text-sm text-gray-700">{suggestion.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
    </div>
  );
} 