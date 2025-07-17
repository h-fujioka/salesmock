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

// 型定義
interface SearchResultTemplateProps {
  title: string;
  description: string;
  dataComponent: React.ReactNode;
  nextActionText: string;
}

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

type Suggestion = { icon: string; title: string; url: string };

type Message = {
  content: string;
  type: 'question' | 'answer' | 'system';
};

// コンポーネント定義
function SearchResultTemplate({ title, description, dataComponent, nextActionText }: SearchResultTemplateProps) {
  return (
    <div className="w-full max-w-[1000px] mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="text-xl font-bold text-gray-800">{title}</div>
        <div className="text-gray-600 text-base leading-relaxed">{description}</div>
        <div className="overflow-x-auto">{dataComponent}</div>
        <div className="flex flex-col gap-4 mt-6">
          <div className="text-base text-gray-700">{nextActionText}</div>
        </div>
      </div>
    </div>
  );
}

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
      <span className="text-xl font-bold tracking-tight">SalesOn v2</span>
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

export default function HomeV2() {
  // State定義
  const [command, setCommand] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [followupCandidates, setFollowupCandidates] = useState<any[] | null>(null);
  const [mailPreview, setMailPreview] = useState<string | null>(null);
  const [approvalStep, setApprovalStep] = useState<"none" | "search_results" | "select_recipients" | "preview_mail" | "sent">("none");
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([0,1]);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({ 0: true, 1: true });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [lastCommand, setLastCommand] = useState("");
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editableQuestion, setEditableQuestion] = useState("");
  const [currentTab, setCurrentTab] = useState('tasks');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [taskColumnVisibility, setTaskColumnVisibility] = useState([true, true, true, true, true, true, true]);

  // タスクテーブル用のカラム定義
  const taskColumns: ColumnDef<any, React.ReactNode>[] = [
    { 
      accessorKey: "priority", 
      header: () => <div className="text-sm font-medium text-gray-600">優先度</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className={`inline-flex items-center justify-center rounded px-2 py-0.5 text-sm ${
            info.getValue() === '高' ? 'bg-red-50 text-red-700' :
            info.getValue() === '中' ? 'bg-yellow-50 text-yellow-700' :
            'bg-gray-50 text-gray-700'
          }`}>
            {info.getValue()}
          </span>
        </div>
      )
    },
    { 
      accessorKey: "taskName", 
      header: () => <div className="text-sm font-medium text-gray-600">タスク名</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className="text-black font-normal">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: "deadline", 
      header: () => <div className="text-sm font-medium text-gray-600">期限</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className="text-gray-700 font-normal">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: "daysLeft", 
      header: () => <div className="text-sm font-medium text-gray-600">残日数</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className="text-gray-700 font-normal">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: "status", 
      header: () => <div className="text-sm font-medium text-gray-600">ステータス</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className="text-gray-700 font-normal">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: "project", 
      header: () => <div className="text-sm font-medium text-gray-600">関連案件</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className="text-gray-700 font-normal">{info.getValue()}</span>
        </div>
      )
    },
    { 
      accessorKey: "automation", 
      header: () => <div className="text-sm font-medium text-gray-600">AI/手動</div>,
      cell: info => (
        <div className="px-4 py-3 text-sm border-t border-gray-100">
          <span className="text-gray-700 font-normal">{info.getValue()}</span>
        </div>
      )
    }
  ];
  // リスクテーブル用のカラム定義
  const riskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "customer", header: "顧客名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-red-100' : info.getValue()==='中' ? 'bg-yellow-100' : 'bg-gray-100'}`}>{info.getValue()}</span> },
    { accessorKey: "progress", header: "進捗", cell: info => {
      const progress = info.row.original.progress as { percent: number; color: string };
      return (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className={`${progress.color} rounded-full h-2`} style={{ width: `${progress.percent}%` }} />
        </div>
      );
    }},
    { accessorKey: "risk", header: "リスク", cell: info => <span className="text-red-600 font-normal">{info.getValue()}</span> }
  ];
  const [riskColumnVisibility, setRiskColumnVisibility] = useState<boolean[]>(riskColumns.map(() => true));

  // メンバー実績用のカラム定義
  const memberColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "name", header: "メンバー名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "role", header: "役割", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "deals", header: "成約件数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "revenue", header: "売上金額", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "progress", header: "目標達成率", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}%</span> }
  ];
  const [memberColumnVisibility, setMemberColumnVisibility] = useState(memberColumns.map(() => true));

  // 競合利用企業用のカラム定義
  const competitorColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "company", header: "企業名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "competitor", header: "競合製品", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "industry", header: "業種", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "scale", header: "規模", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "status", header: "状態", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
  ];
  const [competitorColumnVisibility, setCompetitorColumnVisibility] = useState(competitorColumns.map(() => true));

  // スリップ案件用のカラム定義
  const slipColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "company", header: "企業名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "currentMonth", header: "当初予定", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "slipMonth", header: "スリップ先", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "reason", header: "理由", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> }
  ];
  const [slipColumnVisibility, setSlipColumnVisibility] = useState(slipColumns.map(() => true));

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
  const [aiApprovalColumnVisibility, setAiApprovalColumnVisibility] = useState(aiApprovalColumns.map(() => true));

  // ダミーデータ
  const taskData = [
    {
      priority: "高",
      taskName: "顧客Aへ見積送付",
      deadline: "2024/07/10",
      daysLeft: "3日",
      status: "進行中",
      project: "A社案件",
      automation: "AI自動"
    },
    {
      priority: "中",
      taskName: "商談Bの準備",
      deadline: "2024/07/12",
      daysLeft: "1日",
      status: "未着手",
      project: "B社案件",
      automation: "手動"
    },
    {
      priority: "高",
      taskName: "C社 提案書ドラフト作成",
      deadline: "2024/07/15",
      daysLeft: "2日",
      status: "進行中",
      project: "C社新規案件",
      automation: "AI自動"
    },
    {
      priority: "中",
      taskName: "D社 定例会議準備",
      deadline: "2024/07/13",
      daysLeft: "0日",
      status: "進行中",
      project: "D社サポート案件",
      automation: "手動"
    },
    {
      priority: "高",
      taskName: "E社 契約書レビュー",
      deadline: "2024/07/09",
      daysLeft: "1日",
      status: "完了",
      project: "E社更新案件",
      automation: "AI自動"
    },
    {
      priority: "低",
      taskName: "F社 サポート対応",
      deadline: "2024/07/20",
      daysLeft: "0日",
      status: "未着手",
      project: "F社サポート案件",
      automation: "手動"
    }
  ];

  const riskData = [
    { project: "新製品導入プロジェクト", customer: "株式会社みらいテック", customerType: "新規", deadline: "2024/07/10", priority: "高", progress: { percent: 80, color: "bg-blue-500" }, risk: "期限超過" },
    { project: "システム更改案件", customer: "東都情報サービス株式会社", customerType: "既存", deadline: "2024/07/12", priority: "中", progress: { percent: 40, color: "bg-blue-400" }, risk: "進捗遅延" },
    { project: "海外展開サポート", customer: "グローバル商事株式会社", customerType: "新規", deadline: "2024/07/15", priority: "高", progress: { percent: 20, color: "bg-blue-300" }, risk: "顧客要望未対応" }
  ];

  const memberData = [
    { name: "山田太郎", role: "営業マネージャー", deals: 15, revenue: "¥15,000,000", progress: 85 },
    { name: "鈴木一郎", role: "営業担当", deals: 10, revenue: "¥10,000,000", progress: 75 },
    { name: "佐藤花子", role: "営業担当", deals: 8, revenue: "¥8,000,000", progress: 60 },
    { name: "田中次郎", role: "営業担当", deals: 12, revenue: "¥12,000,000", progress: 90 }
  ];

  const competitorData = [
    { company: "株式会社ABC", competitor: "競合製品X", industry: "製造業", scale: "大企業", status: "検討中" },
    { company: "DEF工業", competitor: "競合製品Y", industry: "建設業", scale: "中小企業", status: "導入済み" },
    { company: "GHI商事", competitor: "競合製品Z", industry: "商社", scale: "大企業", status: "検討中" }
  ];

  const slipData = [
    { project: "システム更改案件", company: "株式会社ABC", currentMonth: "2024/07", slipMonth: "2024/08", reason: "要件定義の遅延" },
    { project: "クラウド移行案件", company: "DEF工業", currentMonth: "2024/07", slipMonth: "2024/09", reason: "社内決裁の遅れ" },
    { project: "データ連携案件", company: "GHI商事", currentMonth: "2024/07", slipMonth: "2024/08", reason: "技術検証の追加" }
  ];

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
    }
  ];

  // コマンドの検証関数
  const validateCommand = (input: string): boolean => {
    setAlertMessage("v2では何を入力しても送信できません");
    return false;
  };

  // rowSelectionとselectedRecipientsを同期
  React.useEffect(() => {
    const selected = Object.entries(rowSelection)
      .filter(([_, v]) => v)
      .map(([k]) => Number(k));
    setSelectedRecipients(selected);
  }, [rowSelection]);

  React.useEffect(() => {
    const newRowSelection: { [key: string]: boolean } = {};
    selectedRecipients.forEach(idx => { newRowSelection[idx] = true; });
    setRowSelection(newRowSelection);
  }, []);

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

  // ハンドラー関数
  const handleSend = async () => {
    if (!validateCommand(command)) {
      return;
    }

    if (approvalStep === "search_results") {
      const userResponse = command.toLowerCase().trim();
      
      if (userResponse.includes("はい") || userResponse.includes("ok") || userResponse.includes("進める") || userResponse.includes("プレビュー")) {
        setApprovalStep("preview_mail");
        setMessages(prev => [...prev, { content: command, type: 'answer' }]);
        setCommand("");
        return;
      }
      
      if (userResponse.includes("いいえ") || userResponse.includes("変更") || userResponse.includes("再検索") || userResponse.includes("条件")) {
        setApprovalStep("none");
        setFollowupCandidates(null);
        setMailPreview(null);
        setMessages(prev => [...prev, { content: command, type: 'answer' }]);
        setAiResponse("条件を変更して再検索しますか？以下のような条件が考えられます：\n\n• 連絡期間を1週間に変更\n• 優先度の高い案件のみ\n• 特定の顧客区分に絞り込み\n• 最終連絡日の範囲を調整\n\n新しい条件で質問してください。");
        setCommand("");
        return;
      }
    }

    setAiResponse("");
    setSuggestions([]);
    setFollowupCandidates(null);
    setMailPreview(null);
    setApprovalStep("none");
    
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

  const handleApprove = () => {
    setApprovalStep("sent");
  };

  const handleEdit = () => {
    setApprovalStep("none");
    setFollowupCandidates(null);
    setMailPreview(null);
  };

  const handleAiTaskApprove = (task: any) => {
    console.log('承認:', task);
  };

  const handleAiTaskReject = (task: any) => {
    console.log('却下:', task);
  };

  const handleAiTaskEdit = (task: any) => {
    console.log('編集:', task);
  };

  // コマンド入力欄の表示位置を制御
  const showInputAtBottom = !!followupCandidates;

  return (
    <div className="flex flex-col min-h-screen">
      <Header onClear={handleClear} />
      
      {/* メインコンテンツエリア */}
      <main className="flex-1 container mx-auto px-8 pt-8 pb-32">
        <div className="space-y-8">
          {/* ホーム画面（初期表示時） */}
          {approvalStep === "none" && !aiResponse && !followupCandidates && (
            <>
              {/* タイトルのみ表示 */}
              <div className="w-full flex flex-col items-center pt-8 pb-4">
                <h1 className="text-center font-semibold text-[64px] ">SalesOn v2</h1>
              </div>

              {/* ダッシュボードエリア */}
              <div className="w-full grid grid-cols-4 gap-4 mb-8">
                {/* 進捗状況のダッシュボード */}
                <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
                  <h2 className="text-lg font-medium mb-4">進捗状況</h2>
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
                        <span>{riskData.length}件</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                          高: {riskData.filter(r => r.priority === '高').length}件
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                          中: {riskData.filter(r => r.priority === '中').length}件
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* チーム/メンバーの状況 */}
                <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
                  <h2 className="text-lg font-medium mb-4">チーム状況</h2>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>目標達成率</span>
                        <span>{Math.round(memberData.reduce((acc, m) => acc + m.progress, 0) / memberData.length)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gray-200 rounded-full h-2" 
                          style={{ width: `${Math.round(memberData.reduce((acc, m) => acc + m.progress, 0) / memberData.length)}%` }} 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      {memberData.slice(0, 2).map((member, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm truncate">{member.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{member.deals}件</span>
                            <div className="w-16 bg-gray-100 rounded-full h-1.5">
                              <div
                                className="bg-gray-200 rounded-full h-1.5"
                                style={{ width: `${member.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 優先タスク・リスク案件のサマリー */}
                <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
                  <h2 className="text-lg font-medium mb-4">優先タスク</h2>
                  <div className="space-y-2">
                    {taskData
                      .filter(task => task.priority === '高')
                      .slice(0, 3)
                      .map((task, index) => (
                        <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <div className="truncate text-sm">{task.taskName}</div>
                          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">残り{task.daysLeft}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* チーム/メンバーのアクション状況 */}
                <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
                  <h2 className="text-lg font-medium mb-4">アクション</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-200 rounded-lg p-2">
                      <div className="text-xs text-gray-700">未完了</div>
                      <div className="text-xl font-medium text-gray-700">
                        {taskData.filter(t => t.status !== '完了').length}
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="text-xs text-gray-500">本日期限</div>
                      <div className="text-xl font-medium text-gray-700">
                        {taskData.filter(t => t.daysLeft === '0日').length}
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <div className="text-xs text-gray-500">完了</div>
                      <div className="text-xl font-medium text-gray-700">
                        {taskData.filter(t => t.status === '完了').length}
                      </div>
                    </div>
                    <div className="bg-gray-200 rounded-lg p-2">
                      <div className="text-xs text-gray-700">AI自動化</div>
                      <div className="text-xl font-medium text-gray-700">
                        {Math.round(taskData.filter(t => t.automation === 'AI自動').length / taskData.length * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* タブ付きコンテンツエリア */}
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
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="検索..."
                        className="max-w-[200px]"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="ml-auto">
                            表示カラム <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {[
                            { key: "priority", label: "優先度" },
                            { key: "taskName", label: "タスク名" },
                            { key: "deadline", label: "期限" },
                            { key: "daysLeft", label: "残日数" },
                            { key: "status", label: "ステータス" },
                            { key: "project", label: "関連案件" },
                            { key: "automation", label: "AI/手動" }
                          ].map((column, index) => (
                            <DropdownMenuCheckboxItem
                              key={index}
                              checked={taskColumnVisibility[index]}
                              onCheckedChange={(value) => {
                                const newVisibility = [...taskColumnVisibility];
                                newVisibility[index] = value;
                                setTaskColumnVisibility(newVisibility);
                              }}
                            >
                              {column.label}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* タブコンテンツ */}
                  <TabsContent value="tasks">
                    <div className="overflow-x-auto">
                      <div className="border-separate border-spacing-0 min-w-full">
                        <DataTable 
                          columns={taskColumns.map((col, i) => taskColumnVisibility[i] ? col : null).filter(Boolean) as ColumnDef<any, React.ReactNode>[]} 
                          data={taskData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="risks">
                    <div className="overflow-x-auto">
                      <div className="border-separate border-spacing-0 min-w-full">
                        <DataTable 
                          columns={riskColumns.filter((_, i) => riskColumnVisibility[i])} 
                          data={riskData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="members">
                    <div className="overflow-x-auto">
                      <div className="border-separate border-spacing-0 min-w-full">
                        <DataTable 
                          columns={memberColumns.filter((_, i) => memberColumnVisibility[i])} 
                          data={memberData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="competitors">
                    <div className="overflow-x-auto">
                      <div className="border-separate border-spacing-0 min-w-full">
                        <DataTable 
                          columns={competitorColumns.filter((_, i) => competitorColumnVisibility[i])} 
                          data={competitorData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="slips">
                    <div className="overflow-x-auto">
                      <div className="border-separate border-spacing-0 min-w-full">
                        <DataTable 
                          columns={slipColumns.filter((_, i) => slipColumnVisibility[i])} 
                          data={slipData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="ai-history">
                    <div className="overflow-x-auto">
                      <div className="border-separate border-spacing-0 min-w-full">
                        <DataTable 
                          columns={aiApprovalColumns.filter((_, i) => aiApprovalColumnVisibility[i])} 
                          data={aiApprovalData}
                          searchSlot={null}
                          columnSelectorSlot={null}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* 初期表示時のコマンド入力欄（画面下部に固定） */}
              <div className="fixed bottom-0 left-[72px] right-0 z-50 w-full flex justify-center pointer-events-none">
                <div className="w-full max-w-[1000px] mx-auto px-8 py-4 pointer-events-auto">
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3 w-full">
                      <Textarea
                        placeholder="Selaに質問してみましょう"
                        value={command}
                        onChange={e => {
                          setCommand(e.target.value);
                          validateCommand(e.target.value);
                        }}
                        className="command-textarea flex-1 resize-none h-12 min-h-[48px] bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base w-full"
                        rows={1}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!command.trim() || alertMessage !== null}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${command.trim() && !alertMessage ? 'bg-[#22223b] text-white hover:bg-black' : 'bg-gray-200 text-gray-400'}`}
                        aria-label="送信"
                      >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path d="M22 2L11 13" />
                          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
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
            </>
          )}

          {/* チャット開始後のコンテンツ（既存の実装をそのまま使用） */}
          {(aiResponse || followupCandidates) && (
            <>
              <QuestionBox
                question={lastCommand || command}
                onEdit={() => {
                  setIsEditingQuestion(true);
                  setEditableQuestion(lastCommand || command);
                }}
                isEditing={isEditingQuestion}
                editableQuestion={editableQuestion}
                setEditableQuestion={setEditableQuestion}
                onEditComplete={() => {
                  setIsEditingQuestion(false);
                  setLastCommand(editableQuestion);
                }}
              />
              {aiResponse && <MessageHistory />}
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

      {/* メール送信確認ボタン */}
      {approvalStep === "preview_mail" && (
        <div className="fixed right-8 top-1/2 transform -translate-y-1/2">
          <Button
            onClick={handleApprove}
            className="w-[65px] h-[350px] bg-[#22223b] text-white hover:bg-black rounded-xl"
          >
            はい
          </Button>
        </div>
      )}
    </div>
  );
} 