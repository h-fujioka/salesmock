"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Calendar, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FileSpreadsheet, Search, Send, PenLine } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import fs from "fs";

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
function QuestionBox({ question, onEdit, isEditing, editableQuestion, setEditableQuestion, onEditComplete }: {
  question: string;
  onEdit: () => void;
  isEditing: boolean;
  editableQuestion: string;
  setEditableQuestion: (v: string) => void;
  onEditComplete: () => void;
}) {
  return (
    <div className="w-full max-w-[1000px] mx-auto bg-gray-100 border border-gray-100 rounded-xl shadow px-4 py-3 flex items-center justify-between text-base font-normal text-gray-800 mb-4">
      {isEditing ? (
        <input
          className="flex-1 bg-transparent outline-none border-none text-base font-normal text-gray-800 mr-2 px-2 py-1 rounded"
          value={editableQuestion}
          onChange={e => setEditableQuestion(e.target.value)}
          onBlur={onEditComplete}
          onKeyDown={e => { if (e.key === 'Enter') onEditComplete(); }}
          autoFocus
        />
      ) : (
        <span className="truncate">{question}</span>
      )}
      <Button
        size="icon"
        variant="ghost"
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10 ml-4"
        onClick={onEdit}
        aria-label="編集"
      >
        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      </Button>
    </div>
  );
}

function Header({ onClear }: { onClear: () => void }) {
  return (
    <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
      <span className="text-xl font-bold tracking-tight">SalesOn プロト画面</span>
      <div className="flex items-center gap-4">
        <input className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none" placeholder="検索..." />
        <Button variant="ghost" size="icon" onClick={onClear}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></Button>
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
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([0,1,2]); // デフォルト全選択
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

  // Data Table用カラム定義
  const taskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "task", header: "タスク名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "project", header: "関連案件", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "daysLeft", header: "残り日数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "auto", header: "AI/手動", cell: info => <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span> },
    { accessorKey: "approval", header: "承認待ち", cell: info => info.getValue() ? <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span> : null },
  ];
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
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "customer", header: "顧客名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span> },
    { accessorKey: "progress", header: "進捗", cell: info => {
      const value = info.getValue() as unknown;
      const { percent, color } = value as { percent: number, color: string };
      return (
        <div className="w-32">
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-1">{percent}%</span>
        </div>
      );
    } },
    { accessorKey: "risk", header: "リスク内容", cell: info => {
      const value = info.getValue();
      if (typeof value === "string") {
        return <span className={`font-normal ${value.includes('超過') ? 'text-red-600' : value.includes('遅延') ? 'text-yellow-600' : 'text-red-600'}`}>{value}</span>;
      }
      return <span className="font-normal">{value}</span>;
    } },
  ];

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
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "proposal", header: "提案内容", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span> },
    { accessorKey: "last", header: "前回実行", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  ];

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header onClear={handleClear} />
      
      {/* メインコンテンツエリア */}
      <main className="flex-1 container mx-auto px-8 pt-8">
        <div className="space-y-4">
          {/* ホーム画面（初期表示時） */}
          {approvalStep === "none" && !aiResponse && !followupCandidates && (
            <>
              {/* タイトルとコマンド入力欄 */}
              <div className="w-full flex flex-col items-center pt-8 pb-4">
                <h1 className="text-center font-semibold text-[64px] mb-8">SalesOn</h1>
                <div className="w-full max-w-[1000px] flex justify-center">
                  <div className="w-full flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3">
                    <Textarea
                      placeholder="質問してみましょう"
                      value={command}
                      onChange={e => setCommand(e.target.value)}
                      className="flex-1 resize-none h-12 min-h-[48px] bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                      rows={1}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!command.trim()}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${command.trim() ? 'bg-[#22223b] text-white hover:bg-black' : 'bg-gray-200 text-gray-400'}`}
                      aria-label="送信"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {/* タブ付きテーブル */}
              <div className="w-full bg-white border border-gray-100 rounded-xl shadow p-4">
                <Tabs defaultValue="tasks" className="w-full">
                  <TabsList className="mb-2 bg-gray-100 text-base">
                    <TabsTrigger value="tasks" className="text-gray-700 font-normal text-base">優先タスク</TabsTrigger>
                    <TabsTrigger value="risks" className="text-gray-700 font-normal text-base">リスク案件</TabsTrigger>
                    <TabsTrigger value="ai" className="text-gray-700 font-normal text-base">AI提案の承認</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tasks">
                    <div className="overflow-x-auto">
                      <DataTable columns={taskColumns} data={taskData} />
                    </div>
                  </TabsContent>
                  <TabsContent value="risks">
                    <div className="overflow-x-auto">
                      <DataTable columns={riskColumns} data={riskData} />
                    </div>
                  </TabsContent>
                  <TabsContent value="ai">
                    <div className="overflow-x-auto">
                      <DataTable columns={aiColumns} data={aiData} />
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
                <QuestionBox
                  question={lastCommand}
                  onEdit={() => {
                    setIsEditingQuestion(true);
                    setEditableQuestion(lastCommand);
                  }}
                  isEditing={isEditingQuestion}
                  editableQuestion={editableQuestion}
                  setEditableQuestion={setEditableQuestion}
                  onEditComplete={() => {
                    setLastCommand(editableQuestion);
                    setIsEditingQuestion(false);
                  }}
                />
              )}

              {/* AI抽出説明文の表示 */}
              {aiResponse && (
                <div className="w-full max-w-[1000px] mx-auto bg-white border border-gray-100 rounded-xl shadow p-8">
                  <div className="text-gray-600 whitespace-pre-wrap">{aiResponse}</div>
                </div>
              )}

              {/* フォローアップ候補テーブル */}
              {followupCandidates && (
                <SearchResultTemplate
                  title="フォローアップ候補"
                  description={`以下の${followupCandidates.length}件の案件が抽出されました。フォローアップメールの送信対象を選択してください。`}
                  dataComponent={
                    <DataTable
                      columns={followupColumns}
                      data={followupCandidates}
                      showSearch={false}
                      showColumnSelector={false}
                    />
                  }
                  nextActionText="選択された案件でメールプレビューを表示しますか？"
                />
              )}

              {/* メールプレビュー */}
              {mailPreview && approvalStep === "preview_mail" && (
                <>
                  <QuestionBox
                    question={lastCommand}
                    onEdit={() => {
                      setIsEditingQuestion(true);
                      setEditableQuestion(lastCommand);
                    }}
                    isEditing={isEditingQuestion}
                    editableQuestion={editableQuestion}
                    setEditableQuestion={setEditableQuestion}
                    onEditComplete={() => {
                      setLastCommand(editableQuestion);
                      setIsEditingQuestion(false);
                    }}
                  />
                  <div className="mt-8">
                    <SearchResultTemplate
                      title="メールプレビュー"
                      description={`選択された${selectedRecipients.length}件の候補案件に対してメールを作成しました。内容を確認してください。`}
                      dataComponent={
                        <>
                          <div className="bg-white border border-gray-100 rounded-xl shadow p-4">
                            <Textarea
                              className="w-full text-base text-gray-700 font-mono bg-transparent border-none outline-none resize-vertical min-h-[200px]"
                              value={mailPreview}
                              readOnly
                            />
                          </div>
                        </>
                      }
                      nextActionText="この内容でよろしいですか？"
                    />
                  </div>
                </>
              )}

              {/* 送信完了画面 */}
              {approvalStep === "sent" && (
                <div className="w-full max-w-[1000px] mx-auto bg-white border border-gray-100 rounded-xl shadow p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">メール送信が完了しました</h3>
                      <p className="text-gray-600">フォローアップメールの送信が正常に完了しました。</p>
                    </div>
                  </div>
                  <div className="space-y-4 text-gray-600">
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
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
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

      {/* コマンド入力欄 - チャット開始後のみ画面下部に固定表示 */}
      {(approvalStep !== "none" || aiResponse || followupCandidates) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm">
          <div className="container mx-auto px-8 py-4">
            <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl shadow px-4 py-3">
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <Textarea
                placeholder="質問してみましょう"
                value={command}
                onChange={e => setCommand(e.target.value)}
                className="flex-1 resize-none h-12 min-h-[48px] bg-transparent border-none outline-none p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                rows={1}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              />
              <Button
                onClick={handleSend}
                disabled={!command.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${command.trim() ? 'bg-[#22223b] text-white hover:bg-black' : 'bg-gray-200 text-gray-400'}`}
                aria-label="送信"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 