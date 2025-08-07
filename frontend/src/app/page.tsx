"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SectionTitle } from "@/components/ui/section-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { Bell, Calendar, CheckCircle2, ChevronDown, Clock, Mail, MessageSquare, Plus, User, Users, XCircle } from "lucide-react";
import React, { useState } from "react";

// 検索結果テンプレートコンポーネント
interface SearchResultTemplateProps {
  title: string;
  dataComponent: React.ReactNode;
  nextActionText: string; // 追加：具体的なネクストアクション名
}

function SearchResultTemplate({
  title,
  dataComponent,
  nextActionText
}: SearchResultTemplateProps) {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-6">
      <SectionTitle
        title={title}
        className="mb-2"
      />
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        {dataComponent}
      </div>
      <footer className="mt-4">
        <p className="text-sm font-normal text-gray-700">{nextActionText}</p>
      </footer>
    </section>
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
          ? "bg-gray-800 rounded-xl px-6 py-4 w-fit text-lg font-medium mb-4 text-white"
          : "w-full max-w-7xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 flex items-center justify-between text-sm font-normal text-gray-700 mb-4"
      }
      style={isAnswer ? { maxWidth: 1000, marginLeft: 'auto' } : {}}
    >
      {isEditing ? (
        <input
          className={isAnswer ? "flex-1 bg-transparent outline-none border-none text-lg font-medium mr-2 px-2 py-1 rounded text-white" : "flex-1 bg-transparent outline-none border-none text-sm font-normal text-gray-700 mr-2 px-2 py-1 rounded"}
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
          className="h-10 w-10 ml-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500"
          onClick={onEdit}
          aria-label="編集"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Button>
      )}
    </div>
  );
}

function Header({ onClear }: { onClear: () => void }) {
  return (
    <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
              <span className="text-base font-semibold tracking-tight">デモ環境</span>
      <div className="flex items-center gap-4">
        <input className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none" placeholder="検索..." />
        <Button variant="ghost" size="icon"><Calendar className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon"><Bell className="w-4 h-4" /></Button>
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
const taskColumns: ColumnDef<any>[] = [
  { 
    accessorKey: "priority", 
    header: "優先度", 
    cell: ({ row }) => (
      <span className="inline-block bg-gray-100 text-gray-800 text-sm font-normal rounded-full px-2 py-0.5">
        {row.getValue("priority") as string}
        </span>
    ),
  },
  { accessorKey: "task", header: "タスク", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("task") as string}
        </span>
  ) },
  { accessorKey: "project", header: "案件名", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("project") as string}
    </span>
  ) },
  { accessorKey: "customerType", header: "顧客区分", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("customerType") as string}
    </span>
  ) },
  { accessorKey: "assignee", header: "担当者", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("assignee") as string}
    </span>
  ) },
  { accessorKey: "deadline", header: "期限", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("deadline") as string}
    </span>
  ) },
  { 
    accessorKey: "daysLeft", 
    header: "残り日数",
    cell: ({ row }) => (
      <span className="text-sm font-normal">
        {row.getValue("daysLeft") as string}
          </span>
    ),
  },
  { accessorKey: "status", header: "ステータス", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("status") as string}
    </span>
  ) },
  { 
    accessorKey: "auto", 
    header: "自動化", 
    cell: ({ row }) => (
      <span className="inline-block bg-gray-100 text-gray-800 text-sm font-normal rounded-full px-2 py-0.5">
        {row.getValue("auto") as string}
          </span>
    ),
  },
];

const riskColumns: ColumnDef<any>[] = [
  { 
    accessorKey: "priority", 
    header: "優先度", 
    cell: ({ row }) => (
      <span className="inline-block bg-gray-100 text-gray-800 text-sm font-normal rounded-full px-2 py-0.5">
        {row.getValue("priority") as string}
        </span>
    ),
  },
  { accessorKey: "project", header: "案件名", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("project") as string}
    </span>
  ) },
  { accessorKey: "assignee", header: "担当者", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("assignee") as string}
    </span>
  ) },
  { accessorKey: "deadline", header: "期限", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("deadline") as string}
    </span>
  ) },
  { 
    accessorKey: "daysLeft", 
    header: "残り日数",
    cell: ({ row }) => (
      <span className="text-sm font-normal">
        {row.getValue("daysLeft") as string}
          </span>
    ),
  },
  { accessorKey: "status", header: "ステータス", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("status") as string}
    </span>
  ) },
  { 
    accessorKey: "risk", 
    header: "リスク", 
    cell: ({ row }) => (
      <span className="inline-block bg-gray-100 text-gray-800 text-sm font-normal rounded-full px-2 py-0.5">
        {row.getValue("risk") as string}
        </span>
    ),
  },
];



const competitorColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "company", header: "顧客名", cell: info => <span className="text-black text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "competitor", header: "利用中の競合製品", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "contract", header: "契約更新時期", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> }
]

const slipColumns: ColumnDef<any, React.ReactNode>[] = [
  { accessorKey: "project", header: "案件名", cell: info => <span className="text-black text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "company", header: "顧客名", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "currentMonth", header: "当初予定", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "slipMonth", header: "スリップ先", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> },
  { accessorKey: "reason", header: "理由", cell: info => <span className="text-gray-700 text-sm font-normal">{info.getValue()}</span> }
]



// データ定義
const taskData = [
  {
    taskId: "task-001",
    task: "A社向け見積書作成・送付",
    project: "A社向けシステム開発案件",
    customerType: "新規",
    assignee: "山田 太郎",
    deadline: "2024/07/10",
    daysLeft: "3日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "メール内容から見積書作成が必要と判断",
    priority: "高",
    caseId: "case-001"
  },
  {
    taskId: "task-002",
    task: "C社向け提案書ドラフト作成",
    project: "C社DX推進プロジェクト",
    customerType: "新規",
    assignee: "佐藤 花子",
    deadline: "2024/07/15",
    daysLeft: "2日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "商談履歴から提案書作成タイミングと判断",
    priority: "高",
    caseId: "case-002"
  },
  {
    taskId: "task-003",
    task: "G社向け進捗報告作成",
    project: "G社基幹システム改修プロジェクト",
    customerType: "既存",
    assignee: "鈴木 一郎",
    deadline: "2024/07/11",
    daysLeft: "0日",
    status: "進行中",
    auto: "手動",
    priority: "高",
    caseId: "case-003"
  },
  {
    taskId: "task-004",
    task: "J社向け受注処理",
    project: "J社クラウド移行プロジェクト",
    customerType: "既存",
    assignee: "田中 次郎",
    deadline: "2024/07/14",
    daysLeft: "0日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "契約書署名完了を検知し受注処理を自動生成",
    priority: "高",
    caseId: "case-004"
  },
  {
    taskId: "task-005",
    task: "K社向け競合調査",
    project: "K社向け競合他社分析レポート",
    customerType: "新規",
    assignee: "高橋 美咲",
    deadline: "2024/07/12",
    daysLeft: "1日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "競合他社の動向情報を検知し調査タスクを生成",
    priority: "高",
    caseId: "case-005"
  },
  {
    taskId: "task-006",
    task: "L社向け商談準備",
    project: "L社向けAI導入検討ミーティング",
    customerType: "既存",
    assignee: "伊藤 健太",
    deadline: "2024/07/13",
    daysLeft: "2日",
    status: "進行中",
    auto: "手動",
    priority: "高",
    caseId: "case-006"
  },
  {
    taskId: "task-007",
    task: "M社向けフォローアップ",
    project: "M社向け提案書のご確認について",
    customerType: "既存",
    assignee: "渡辺 恵子",
    deadline: "2024/07/16",
    daysLeft: "5日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "提案書送付から1週間経過しフォローアップが必要と判断",
    priority: "高",
    caseId: "case-007"
  },
  {
    taskId: "task-008",
    task: "N社向け見積書修正",
    project: "N社向けシステム開発費の再見積",
    customerType: "新規",
    assignee: "中村 大輔",
    deadline: "2024/07/17",
    daysLeft: "6日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "顧客からの要件変更メールを検知し見積書修正を生成",
    priority: "高",
    caseId: "case-008"
  },
  {
    taskId: "task-009",
    task: "O社向け契約書確認",
    project: "O社向け保守契約書のご確認",
    customerType: "既存",
    assignee: "小林 麻衣",
    deadline: "2024/07/18",
    daysLeft: "7日",
    status: "進行中",
    auto: "手動",
    priority: "中",
    caseId: "case-009"
  },
  {
    taskId: "task-010",
    task: "P社向け技術検証",
    project: "P社向け新技術PoCの実施",
    customerType: "新規",
    assignee: "加藤 雄一",
    deadline: "2024/07/19",
    daysLeft: "8日",
    status: "進行中",
    auto: "AI自動",
    autoReason: "技術要件の複雑性から検証タスクが必要と判断",
    priority: "中",
    caseId: "case-010"
  },
  {
    taskId: "task-011",
    task: "Q社向け新規案件の初期調査",
    project: "Q社向け新規案件の市場調査",
    customerType: "新規",
    assignee: "山田 太郎",
    deadline: "2024/07/25",
    daysLeft: "14日",
    status: "新規受信",
    auto: "AI自動",
    autoReason: "新規顧客からの問い合わせメールを検知し調査タスクを生成",
    priority: "低",
    caseId: "case-011"
  },
  {
    taskId: "task-012",
    task: "R社向け案件化検討",
    project: "R社向け案件化の可能性調査",
    customerType: "新規",
    assignee: "佐藤 花子",
    deadline: "2024/07/30",
    daysLeft: "19日",
    status: "案件化検討中",
    auto: "手動",
    priority: "中",
    caseId: "case-012"
  },
  {
    taskId: "task-013",
    task: "S社向け提案書作成",
    project: "S社向けDX推進プロジェクト",
    customerType: "既存",
    assignee: "鈴木 一郎",
    deadline: "2024/07/22",
    daysLeft: "11日",
    status: "提案中",
    auto: "AI自動",
    autoReason: "商談内容から提案書作成タイミングを判断",
    priority: "高",
    caseId: "case-013"
  },
  {
    taskId: "task-014",
    task: "T社向け契約書レビュー",
    project: "T社向け契約書の最終確認",
    customerType: "既存",
    assignee: "田中 次郎",
    deadline: "2024/07/15",
    daysLeft: "4日",
    status: "完了",
    auto: "手動",
    priority: "高",
    caseId: "case-014"
  },
  {
    taskId: "task-015",
    task: "U社向け保留案件の再開検討",
    project: "U社向け保留案件の再検討",
    customerType: "既存",
    assignee: "高橋 美咲",
    deadline: "2024/08/15",
    daysLeft: "35日",
    status: "保留",
    auto: "手動",
    priority: "低",
    caseId: "case-015"
  },
  {
    taskId: "task-016",
    task: "V社向け失注案件の分析",
    project: "V社向け失注原因の分析",
    customerType: "新規",
    assignee: "伊藤 健太",
    deadline: "2024/07/20",
    daysLeft: "9日",
    status: "失注",
    auto: "AI自動",
    autoReason: "失注通知を受信し原因分析タスクを自動生成",
    priority: "中",
    caseId: "case-016"
  }
];

const riskData = [
  {
    project: "【緊急】A社向けシステム開発案件の競合対応について",
    assignee: "山田 太郎",
    deadline: "2024/07/10",
    daysLeft: "3日",
    status: "要対応",
    risk: "競合他社の参入",
    priority: "高"
  },
  {
    project: "【予算】B社向けDXプロジェクトの予算見直しについて",
    assignee: "佐藤 花子",
    deadline: "2024/07/12",
    daysLeft: "1日",
    status: "要対応",
    risk: "予算削減の可能性",
    priority: "高"
  },
  {
    project: "【決裁】C社向け提案書の決裁者変更への対応",
    assignee: "鈴木 一郎",
    deadline: "2024/07/15",
    daysLeft: "4日",
    status: "要対応",
    risk: "決裁者の変更",
    priority: "高"
  },
  {
    project: "【要件変更】D社向けシステム要件の大幅変更について",
    assignee: "田中 次郎",
    deadline: "2024/07/11",
    daysLeft: "0日",
    status: "要対応",
    risk: "技術要件の変更",
    priority: "高"
  },
  {
    project: "【スケジュール】E社向けプロジェクトの遅延対応",
    assignee: "高橋 美咲",
    deadline: "2024/07/13",
    daysLeft: "2日",
    status: "要対応",
    risk: "スケジュール遅延",
    priority: "高"
  },
  {
    project: "【要件変更】F社向け顧客要求の大幅変更への対応",
    assignee: "伊藤 健太",
    deadline: "2024/07/16",
    daysLeft: "5日",
    status: "要対応",
    risk: "顧客要求の大幅変更",
    priority: "高"
  },
  {
    project: "【価格交渉】G社向け価格交渉の難航について",
    assignee: "渡辺 恵子",
    deadline: "2024/07/14",
    daysLeft: "3日",
    status: "要対応",
    risk: "価格交渉の難航",
    priority: "高"
  },
  {
    project: "【組織変更】H社向け組織体制変更への対応",
    assignee: "中村 大輔",
    deadline: "2024/07/17",
    daysLeft: "6日",
    status: "要対応",
    risk: "組織体制の変更",
    priority: "高"
  },
  {
    project: "【技術課題】I社向け技術的課題の解決について",
    assignee: "小林 麻衣",
    deadline: "2024/07/18",
    daysLeft: "7日",
    status: "要対応",
    risk: "技術的課題の発生",
    priority: "中"
  },
  {
    project: "【品質】J社向け品質基準の見直しについて",
    assignee: "加藤 雄一",
    deadline: "2024/07/19",
    daysLeft: "8日",
    status: "要対応",
    risk: "品質基準の変更",
    priority: "中"
  },
  {
    project: "【技術】K社向け技術的課題の解決について",
    assignee: "山田 太郎",
    deadline: "2024/07/25",
    daysLeft: "14日",
    status: "要対応",
    risk: "技術的課題の発生",
    priority: "低"
  },
  {
    project: "【予算】L社向け予算見直しへの対応",
    assignee: "佐藤 花子",
    deadline: "2024/07/30",
    daysLeft: "19日",
    status: "要対応",
    risk: "予算削減の可能性",
    priority: "低"
  }
];



const competitorData = [
  { company: "株式会社ABC", competitor: "競合製品X", contract: "2024/12", status: "情報収集中" },
  { company: "DEF工業", competitor: "競合製品Y", contract: "2024/10", status: "商談開始" },
  { company: "GHI商事", competitor: "競合製品Z", contract: "2024/11", status: "検討中" },
  { company: "JKL株式会社", competitor: "競合製品A", contract: "2024/09", status: "提案中" },
  { company: "MNO工業", competitor: "競合製品B", contract: "2024/08", status: "契約締結" },
  { company: "PQR商事", competitor: "競合製品C", contract: "2025/01", status: "失注" }
]

const slipData = [
  { project: "システム更改案件", company: "株式会社ABC", currentMonth: "2024/07", slipMonth: "2024/08", reason: "要件定義の遅延" },
  { project: "クラウド移行案件", company: "DEF工業", currentMonth: "2024/07", slipMonth: "2024/09", reason: "社内決裁の遅れ" },
  { project: "データ連携案件", company: "GHI商事", currentMonth: "2024/07", slipMonth: "2024/08", reason: "技術検証の追加" }
];

// AI提案・アラートデータ
const aiProposalData = [
  { 
    id: "proposal-001",
    type: "提案",
    title: "A社向けフォローアップメールの自動送信",
    description: "A社の案件について、フォローアップメールを自動送信することを提案します。",
    priority: "高", 
    status: "未確認",
    assignee: "山田 太郎",
    createdAt: "2024/07/20 10:30",
    relatedCase: "A社向けシステム開発案件"
  },
  {
    id: "alert-001",
    type: "アラート",
    title: "B社案件の期限切れリスク",
    description: "B社の案件が期限切れのリスクがあります。早急な対応が必要です。",
    priority: "高",
    status: "未対応",
    assignee: "佐藤 花子",
    createdAt: "2024/07/20 09:15",
    relatedCase: "B社DX推進プロジェクト"
  },
  {
    id: "proposal-002",
    type: "提案",
    title: "C社向け競合分析レポートの自動生成",
    description: "C社の競合他社について、分析レポートを自動生成することを提案します。",
    priority: "中", 
    status: "未確認",
    assignee: "鈴木 一郎",
    createdAt: "2024/07/20 08:45",
    relatedCase: "C社向けAI導入検討"
  },
  {
    id: "notification-001",
    type: "通知",
    title: "D社からの新規問い合わせ",
    description: "D社から新規の問い合わせがありました。案件化の検討をお願いします。",
    priority: "中",
    status: "未確認",
    assignee: "田中 次郎",
    createdAt: "2024/07/20 08:00",
    relatedCase: "D社新規案件"
  },
  {
    id: "alert-002",
    type: "アラート",
    title: "E社案件の予算超過リスク",
    description: "E社の案件で予算超過のリスクが発生しています。対策の検討が必要です。",
    priority: "高", 
    status: "未対応",
    assignee: "高橋 美咲",
    createdAt: "2024/07/19 17:30",
    relatedCase: "E社基幹システム改修"
  }
]



// 今日のアクションデータ（営業担当者視点）
const todayActionData = [
  {
    id: "action-001",
    what: "A社向けフォローアップメール送信",
    why: "顧客の期待に応える機会 - 前回商談から1週間経過",
    when: "今日 17:00まで",
    who: "山田 太郎",
    priority: "緊急",
    relatedCase: "A社向けシステム開発案件",
    relatedTask: "A社向け商談フォローアップ"
  },
  {
    id: "action-002", 
    what: "B社向け提案書の最終確認",
    why: "決裁者を動かす機会 - 来週最終プレゼン準備",
    when: "明日 10:00まで",
    who: "佐藤 花子",
    priority: "重要",
    relatedCase: "B社向けDXプロジェクト",
    relatedTask: "B社向け最終提案書作成"
  },
  {
    id: "action-003",
    what: "C社向け競合対応戦略の策定",
    why: "競合優位性確保の機会 - 競合動向把握",
    when: "今日 15:00まで",
    who: "鈴木 一郎",
    priority: "緊急",
    relatedCase: "C社向け提案書の決裁者変更対応",
    relatedTask: "C社向け競合分析"
  },
  {
    id: "action-004",
    what: "D社向け価格交渉の準備",
    why: "企業価値向上の機会 - 予算制約への価値提案",
    when: "明日 14:00まで",
    who: "田中 次郎",
    priority: "重要",
    relatedCase: "D社向けシステム要件の大幅変更対応",
    relatedTask: "D社向け価格交渉準備"
  },
  {
    id: "action-005",
    what: "E社向け技術検証の結果報告",
    why: "顧客の心を動かす機会 - 技術課題解決",
    when: "今日 18:00まで",
    who: "高橋 美咲",
    priority: "緊急",
    relatedCase: "E社向けプロジェクトの遅延対応",
    relatedTask: "E社向け技術検証実施"
  }
];

// 朝一ダッシュボードデータ
const morningData = [
  { id: "1", item: "未読メール", count: 12, priority: "高", action: "確認" },
  { id: "2", item: "Slack通知", count: 5, priority: "中", action: "確認" },
  { id: "3", item: "今日の商談", count: 3, priority: "高", action: "準備" },
  { id: "4", item: "追客案件", count: 8, priority: "中", action: "フォロー" },
];

// 今日の予定の詳細データ
const emailData = [
  { id: "1", sender: "A社 田中様", subject: "見積書について", time: "09:15", priority: "高", status: "未読" },
  { id: "2", sender: "B社 佐藤様", subject: "商談の日程調整", time: "09:30", priority: "高", status: "未読" },
  { id: "3", sender: "C社 鈴木様", subject: "提案書のご確認", time: "10:00", priority: "中", status: "未読" },
  { id: "4", sender: "D社 高橋様", subject: "契約書の修正依頼", time: "10:15", priority: "高", status: "未読" },
  { id: "5", sender: "E社 渡辺様", subject: "技術検証の結果", time: "10:30", priority: "中", status: "未読" },
  { id: "6", sender: "F社 中村様", subject: "価格交渉について", time: "11:00", priority: "高", status: "未読" },
  { id: "7", sender: "G社 小林様", subject: "進捗報告", time: "11:15", priority: "中", status: "未読" },
  { id: "8", sender: "H社 加藤様", subject: "新規案件のご相談", time: "11:30", priority: "高", status: "未読" },
  { id: "9", sender: "I社 伊藤様", subject: "保守契約の更新", time: "12:00", priority: "中", status: "未読" },
  { id: "10", sender: "J社 山田様", subject: "システム障害について", time: "12:15", priority: "高", status: "未読" },
  { id: "11", sender: "K社 佐々木様", subject: "競合他社の情報", time: "12:30", priority: "中", status: "未読" },
  { id: "12", sender: "L社 井上様", subject: "プロジェクト完了報告", time: "12:45", priority: "中", status: "未読" },
];

const slackData = [
  { id: "1", channel: "#営業チーム", sender: "田中", message: "A社案件の進捗について", time: "09:00", priority: "高" },
  { id: "2", channel: "#案件管理", sender: "佐藤", message: "B社の契約書レビュー完了", time: "09:30", priority: "中" },
  { id: "3", channel: "#営業チーム", sender: "鈴木", message: "今日の商談スケジュール", time: "10:00", priority: "高" },
  { id: "4", channel: "#技術サポート", sender: "高橋", message: "C社の技術検証結果", time: "10:30", priority: "中" },
  { id: "5", channel: "#営業チーム", sender: "渡辺", message: "D社からの緊急連絡", time: "11:00", priority: "高" },
];

const meetingData = [
  { id: "1", company: "A社", time: "10:00-11:00", type: "新規案件", assignee: "田中", status: "準備中", priority: "高" },
  { id: "2", company: "B社", time: "14:00-15:00", type: "既存案件", assignee: "佐藤", status: "準備中", priority: "高" },
  { id: "3", company: "C社", time: "16:00-17:00", type: "フォローアップ", assignee: "鈴木", status: "準備中", priority: "中" },
];

const followupData = [
  { id: "1", company: "A社", type: "提案書送付済み", daysAgo: 3, assignee: "田中", status: "フォロー待ち", priority: "高" },
  { id: "2", company: "B社", type: "見積書送付済み", daysAgo: 5, assignee: "佐藤", status: "フォロー待ち", priority: "高" },
  { id: "3", company: "C社", type: "提案書送付済み", daysAgo: 7, assignee: "鈴木", status: "フォロー待ち", priority: "中" },
  { id: "4", company: "D社", type: "見積書送付済み", daysAgo: 2, assignee: "高橋", status: "フォロー待ち", priority: "高" },
  { id: "5", company: "E社", type: "提案書送付済み", daysAgo: 4, assignee: "渡辺", status: "フォロー待ち", priority: "中" },
  { id: "6", company: "F社", type: "見積書送付済み", daysAgo: 6, assignee: "中村", status: "フォロー待ち", priority: "中" },
  { id: "7", company: "G社", type: "提案書送付済み", daysAgo: 1, assignee: "小林", status: "フォロー待ち", priority: "高" },
  { id: "8", company: "H社", type: "見積書送付済み", daysAgo: 8, assignee: "加藤", status: "フォロー待ち", priority: "中" },
];

// AI提案データ
const aiProposalsData = [
  { 
    id: "1", 
    title: "A社向けフォローアップメール自動送信", 
    priority: "高", 
    status: "確認待ち", 
    action: "案件に追加",
    description: "前回商談から1週間経過。顧客の期待に応える機会として、フォローアップメールを自動送信することを提案します。",
    expectedOutcome: "顧客の関心維持・次の商談機会創出",
    confidence: "85%"
  },
  { 
    id: "2", 
    title: "B社向け提案書の競合分析追加", 
    priority: "高", 
    status: "確認待ち", 
    action: "案件に追加",
    description: "競合他社の動向を分析し、差別化ポイントを明確にした提案書の更新を提案します。",
    expectedOutcome: "競合優位性の明確化・受注確率向上",
    confidence: "78%"
  },
  { 
    id: "3", 
    title: "C社向け価格交渉戦略の自動生成", 
    priority: "中", 
    status: "確認待ち", 
    action: "案件に追加",
    description: "顧客の予算制約と価値提案を分析し、最適な価格交渉戦略を自動生成します。",
    expectedOutcome: "価格最適化・顧客満足度向上",
    confidence: "72%"
  },
  { 
    id: "4", 
    title: "D社向け技術検証結果の自動報告", 
    priority: "高", 
    status: "却下済み", 
    action: "詳細",
    description: "技術検証の結果を自動分析し、顧客向け報告書を生成することを提案しました。",
    expectedOutcome: "技術課題解決・顧客の安心感向上",
    confidence: "90%"
  },
  { 
    id: "5", 
    title: "E社向けナーチャリング戦略の最適化", 
    priority: "中", 
    status: "確認待ち", 
    action: "案件に追加",
    description: "顧客の購買サイクルを分析し、最適なタイミングでのアプローチ戦略を提案します。",
    expectedOutcome: "顧客関係強化・長期的な売上向上",
    confidence: "81%"
  },
  { 
    id: "6", 
    title: "F社向けリスクアラート：予算超過の可能性", 
    priority: "高", 
    status: "確認待ち", 
    action: "案件に追加",
    description: "プロジェクト進捗を分析した結果、予算超過のリスクが検出されました。早期対策を提案します。",
    expectedOutcome: "リスク回避・プロジェクト成功確率向上",
    confidence: "92%"
  }
];

// AI実行履歴データ
const historyData = [
  { 
    id: "1", 
    timestamp: "09:15", 
    content: "A社向けフォローアップメール自動送信", 
    status: "AI自動", 
    result: "完了",
    impact: "顧客からの返信あり",
    efficiency: "営業時間30分短縮"
  },
  { 
    id: "2", 
    timestamp: "09:30", 
    content: "B社向け競合分析レポート生成", 
    status: "人間確認", 
    result: "承認済み",
    impact: "提案書品質向上",
    efficiency: "分析時間2時間短縮"
  },
  { 
    id: "3", 
    timestamp: "10:00", 
    content: "C社向け価格交渉戦略提案", 
    status: "人間確認", 
    result: "確認中",
    impact: "交渉戦略最適化",
    efficiency: "戦略立案時間1時間短縮"
  },
  { 
    id: "4", 
    timestamp: "10:15", 
    content: "D社向け技術検証結果報告", 
    status: "却下", 
    result: "却下済み",
    impact: "手動対応が必要",
    efficiency: "報告書作成時間短縮"
  },
  { 
    id: "5", 
    timestamp: "10:30", 
    content: "E社向けナーチャリング戦略最適化", 
    status: "AI自動", 
    result: "完了",
    impact: "顧客接触頻度最適化",
    efficiency: "戦略立案時間短縮"
  },
  { 
    id: "6", 
    timestamp: "10:45", 
    content: "F社向けリスクアラート：予算超過検知", 
    status: "人間確認", 
    result: "承認済み",
    impact: "早期対策実施",
    efficiency: "リスク検知時間短縮"
  }
];

// ナレッジデータ
const knowledgeData = [
  {
    id: "1",
    title: "高単価案件の成功パターン",
    category: "成功事例",
    author: "田中営業",
    date: "2024/01/15",
    views: 45,
    rating: 4.8,
    summary: "単価500万円以上の案件で共通する成功要因を分析。決裁者へのアプローチ方法と価値提案のポイントをまとめました。",
    tags: ["高単価", "決裁者", "価値提案"],
    content: "高単価案件では、顧客の課題を深く理解し、ROIを明確に示すことが重要です。決裁者へのアプローチでは、経営課題に焦点を当てた提案が効果的です。"
  },
  {
    id: "2",
    title: "競合他社への対応戦略",
    category: "ベストプラクティス",
    author: "佐藤マネージャー",
    date: "2024/01/10",
    views: 32,
    rating: 4.5,
    summary: "主要競合他社との差別化ポイントと、競合が登場した際の対応フローを整理。",
    tags: ["競合対応", "差別化", "戦略"],
    content: "競合が登場した際は、自社の強みを明確に伝え、顧客の課題解決に焦点を当てた提案を行います。価格競争ではなく、価値提案で勝負することが重要です。"
  },
  {
    id: "3",
    title: "顧客の心を動かす提案書作成法",
    category: "スキル向上",
    author: "山田営業",
    date: "2024/01/08",
    views: 67,
    rating: 4.9,
    summary: "顧客の課題を深く理解し、感情に訴える提案書の作成方法。具体的なテンプレートと事例を紹介。",
    tags: ["提案書", "テンプレート", "感情訴求"],
    content: "効果的な提案書は、顧客の課題を明確にし、解決策の価値を具体的に示します。データとストーリーを組み合わせることで、より説得力のある提案になります。"
  },
  {
    id: "4",
    title: "新規顧客のアプローチ成功事例",
    category: "成功事例",
    author: "鈴木営業",
    date: "2024/01/05",
    views: 28,
    rating: 4.6,
    summary: "コールドアプローチから商談成立までの全プロセス。最初の接触から契約締結までの具体的なステップ。",
    tags: ["新規顧客", "コールドアプローチ", "商談"],
    content: "新規顧客へのアプローチでは、まず顧客の業界や課題をリサーチし、価値のある情報を提供することから始めます。信頼関係を築いてから商談に進むことが成功の鍵です。"
  },
  {
    id: "5",
    title: "既存顧客の拡販戦略",
    category: "ベストプラクティス",
    author: "高橋営業",
    date: "2024/01/03",
    views: 41,
    rating: 4.7,
    summary: "既存顧客からの追加受注を獲得するための戦略と実践方法。顧客の成長段階に応じた提案方法。",
    tags: ["既存顧客", "拡販", "成長段階"],
    content: "既存顧客の拡販では、現在の利用状況を把握し、追加価値を提供できる領域を特定します。顧客の成長に合わせた提案が重要です。"
  },
  {
    id: "6",
    title: "商談での質問テクニック",
    category: "スキル向上",
    author: "伊藤営業",
    date: "2024/01/01",
    views: 55,
    rating: 4.6,
    summary: "顧客の真のニーズを引き出す質問の仕方と、効果的な商談の進め方。",
    tags: ["商談", "質問", "ニーズ発掘"],
    content: "効果的な質問は、顧客の課題を深く理解するために重要です。オープンクエスチョンとクローズドクエスチョンを適切に使い分けることで、より良い提案ができます。"
  },
  {
    id: "7",
    title: "失敗事例から学ぶ営業の教訓",
    category: "学習",
    author: "渡辺営業",
    date: "2023/12/28",
    views: 38,
    rating: 4.4,
    summary: "実際の失敗事例を分析し、再発防止策と改善点をまとめました。",
    tags: ["失敗事例", "学習", "改善"],
    content: "失敗から学ぶことは成長の重要な要素です。失敗の原因を分析し、同じ過ちを繰り返さないための対策を立てることが重要です。"
  },
  {
    id: "8",
    title: "営業活動の効率化テクニック",
    category: "ベストプラクティス",
    author: "中村営業",
    date: "2023/12/25",
    views: 62,
    rating: 4.8,
    summary: "時間管理と優先順位付けによる営業活動の効率化方法。",
    tags: ["効率化", "時間管理", "優先順位"],
    content: "営業活動の効率化には、適切な時間管理と優先順位付けが重要です。重要な案件に集中し、効果的な活動を行うことで成果を最大化できます。"
  },
  {
    id: "9",
    title: "効果的な営業メール作成テンプレート集",
    category: "スキル向上",
    author: "小林営業",
    date: "2023/12/20",
    views: 89,
    rating: 4.7,
    summary: "顧客の興味を喚起するメールの作成テンプレートと、適切な送信タイミングの判断方法。",
    tags: ["メール", "テンプレート", "タイミング", "興味喚起"],
    content: "効果的な営業メールは、顧客の課題に直接アプローチし、具体的な価値を提示します。送信タイミングは顧客の行動パターンを分析して決定し、パーソナライズされた内容で反応率を向上させます。"
  },
  {
    id: "10",
    title: "提案資料作成の実践テンプレート",
    category: "ベストプラクティス",
    author: "斎藤マネージャー",
    date: "2023/12/18",
    views: 73,
    rating: 4.9,
    summary: "業界別・案件規模別の提案資料テンプレートと、効率的なカスタマイズ手法。",
    tags: ["提案資料", "テンプレート", "カスタマイズ", "効率化"],
    content: "提案資料のテンプレート化により、作成時間を大幅に短縮できます。業界特性や案件規模に応じたテンプレートを活用し、顧客の課題に合わせてカスタマイズすることで、高品質な提案資料を効率的に作成できます。"
  },
  {
    id: "11",
    title: "顧客タイプ別アプローチ戦略",
    category: "スキル向上",
    author: "田村営業",
    date: "2023/12/15",
    views: 51,
    rating: 4.5,
    summary: "顧客の性格・役職・業界に応じた効果的なアプローチ方法とコミュニケーション戦略。",
    tags: ["顧客タイプ", "アプローチ", "コミュニケーション", "戦略"],
    content: "顧客のタイプに応じたアプローチは成功確率を大幅に向上させます。決裁者、技術者、経営者など役職別のアプローチ方法と、業界特性を考慮したコミュニケーション戦略を実践することで、より効果的な営業活動が可能になります。"
  },
  {
    id: "12",
    title: "営業活動のデータ分析と改善手法",
    category: "学習",
    author: "山本営業",
    date: "2023/12/12",
    views: 44,
    rating: 4.6,
    summary: "営業活動のデータを分析し、継続的な改善を実現する手法とツールの活用方法。",
    tags: ["データ分析", "改善", "KPI", "継続的改善"],
    content: "営業活動のデータ分析により、効果的な活動と非効率な活動を明確に区別できます。KPIの設定と定期的な分析により、営業手法の継続的な改善を実現し、成果の向上につなげることができます。"
  },
  {
    id: "13",
    title: "ハイパフォーマーの商談トーク完全パターン集",
    category: "成功事例",
    author: "AI分析チーム",
    date: "2023/12/10",
    views: 156,
    rating: 4.9,
    summary: "ハイパフォーマーの商談をAI分析し、成功パターンを体系化。状況別の具体的なトークスクリプトを提供。",
    tags: ["商談トーク", "パターン化", "AI分析", "ハイパフォーマー"],
    content: "ハイパフォーマーの商談をAI分析した結果、共通する成功パターンが明らかになりました。顧客の反応に応じた適切なトークスクリプトと、状況別の対応パターンを体系化しています。これにより、ローパフォーマーでも効果的な商談が可能になります。"
  },
  {
    id: "14",
    title: "フォローアップサイクルの最適化手法",
    category: "ベストプラクティス",
    author: "AI分析チーム",
    date: "2023/12/08",
    views: 134,
    rating: 4.8,
    summary: "ハイパフォーマーのフォローアップサイクルを分析し、最適なタイミングと内容をパターン化。",
    tags: ["フォローアップ", "サイクル", "タイミング", "パターン化"],
    content: "ハイパフォーマーのフォローアップサイクルを分析した結果、顧客の行動パターンに応じた最適なタイミングと内容が明らかになりました。段階的なアプローチと適切な間隔でフォローアップを行うことで、成約率を大幅に向上させることができます。"
  },
  {
    id: "15",
    title: "ローパフォーマー向け段階的学習プログラム",
    category: "学習",
    author: "教育チーム",
    date: "2023/12/05",
    views: 98,
    rating: 4.7,
    summary: "ローパフォーマーが段階的にスキルを向上させるための学習プログラム。基礎から応用まで体系的に学習。",
    tags: ["段階的学習", "ローパフォーマー", "育成", "基礎から応用"],
    content: "ローパフォーマーの育成には、基礎から応用まで段階的な学習が重要です。各段階で必要なスキルとマインドセットを明確にし、実践的な演習を通じて確実にスキルを向上させることができます。"
  },
  {
    id: "16",
    title: "営業マインドセット育成ガイド",
    category: "学習",
    author: "心理カウンセラー",
    date: "2023/12/03",
    views: 112,
    rating: 4.6,
    summary: "営業成功に必要なマインドセットの育成方法。90%がマインドセット、10%がスキルという考えに基づく実践的ガイド。",
    tags: ["マインドセット", "心理", "育成", "成功思考"],
    content: "営業成功の90%はマインドセット、10%がスキルと言われています。成功する営業担当者に共通する思考パターンと行動習慣を分析し、ローパフォーマーがマインドセットを育成するための具体的な方法を提供します。"
  },
  {
    id: "17",
    title: "案件確認の実践手法とチェックポイント",
    category: "ベストプラクティス",
    author: "リーダー育成チーム",
    date: "2023/12/01",
    views: 87,
    rating: 4.5,
    summary: "リーダーが行う案件確認の具体的な手法と、ローパフォーマーの対応できないパターンを補完する方法。",
    tags: ["案件確認", "リーダー", "チェックポイント", "補完"],
    content: "リーダーによる案件確認は、ローパフォーマーの育成に重要な施策です。商談内容や追客ロードマップを確認し、対応できないパターンを事前に特定して補完することで、成功率を大幅に向上させることができます。"
  },
  {
    id: "18",
    title: "顧客状況別カスタマイズ対応パターン集",
    category: "スキル向上",
    author: "AI分析チーム",
    date: "2023/11/28",
    views: 145,
    rating: 4.8,
    summary: "定型的なシナリオを顧客の状況や変数に合わせてカスタマイズする手法。ローパフォーマーが不足している柔軟性を補完。",
    tags: ["カスタマイズ", "柔軟性", "状況対応", "変数対応"],
    content: "営業には定型的なシナリオが存在しますが、顧客の状況や変数に合わせてカスタマイズする能力がローパフォーマーには不足しています。この能力を補完するため、様々な状況に対応できるカスタマイズパターンを体系化しました。"
  },
  {
    id: "19",
    title: "受注に繋がるケース対応パターン大全",
    category: "成功事例",
    author: "AI分析チーム",
    date: "2023/11/25",
    views: 178,
    rating: 4.9,
    summary: "ハイパフォーマーとローパフォーマーの決定的な差である「受注に繋がるケース対応パターンの多さ」を体系化。",
    tags: ["ケース対応", "受注パターン", "ハイパフォーマー", "差別化"],
    content: "ハイパフォーマーとローパフォーマーの決定的な差は「受注に繋がるケース対応パターンの多さ」です。様々な状況に対応できるパターンを蓄積し、ローパフォーマーでも効果的な対応ができるよう体系化しました。"
  },
  {
    id: "20",
    title: "知識不足を解消する営業基礎知識大全",
    category: "学習",
    author: "教育チーム",
    date: "2023/11/22",
    views: 203,
    rating: 4.7,
    summary: "ローパフォーマーが受注できない主な原因である「知らない」（知識不足）を解消するための基礎知識集。",
    tags: ["基礎知識", "知識不足解消", "ローパフォーマー", "受注要因"],
    content: "ローパフォーマーが受注できない主な原因として「知らない」（知識不足）が8〜9割を占めているという推測があります。この知識不足を解消するため、営業に必要な基礎知識を体系的に整理しました。"
  }
];

// 朝一ダッシュボードカラム定義
const morningColumns: ColumnDef<any>[] = [
  {
    accessorKey: "item",
    header: "項目",
    cell: ({ row }) => {
      const item = row.getValue("item") as string;
      const getIcon = (item: string) => {
        switch (item) {
          case "未読メール": return <Mail className="w-4 h-4 mr-2" />;
          case "Slack通知": return <MessageSquare className="w-4 h-4 mr-2" />;
          case "今日の商談": return <Calendar className="w-4 h-4 mr-2" />;
          case "追客案件": return <Users className="w-4 h-4 mr-2" />;
          default: return null;
        }
      };
      return (
        <div className="flex items-center">
          {getIcon(item)}
          <span>{item}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "count",
    header: "件数",
    cell: ({ row }) => {
      const count = row.getValue("count") as number;
      return (
        <span className="inline-block bg-gray-100 text-gray-800 text-sm font-semibold rounded-full px-2 py-0.5">
          {count}件
        </span>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "優先度",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "高": return "bg-red-100 text-red-800";
          case "中": return "bg-yellow-100 text-yellow-800";
          case "低": return "bg-green-100 text-green-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "アクション",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      return (
        <Button variant="outline" size="sm">
          {action}
        </Button>
      );
    },
  },
];

// AI提案カラム定義
const aiProposalColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "提案タイトル",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="font-medium">{title}</span>;
    },
  },
  {
    accessorKey: "priority",
    header: "優先度",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "高": return "bg-red-100 text-red-800";
          case "中": return "bg-yellow-100 text-yellow-800";
          case "低": return "bg-green-100 text-green-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "提案内容",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <span className="text-sm text-gray-600 max-w-xs truncate" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "expectedOutcome",
    header: "期待効果",
    cell: ({ row }) => {
      const outcome = row.getValue("expectedOutcome") as string;
      return (
        <span className="text-sm text-gray-700 max-w-xs truncate" title={outcome}>
          {outcome}
        </span>
      );
    },
  },
  {
    accessorKey: "action",
    header: "アクション",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      const status = row.getValue("status") as string;
      
      if (status === "確認待ち") {
        return (
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              案件に追加
            </Button>
            <Button size="sm" variant="destructive">
              <XCircle className="w-4 h-4 mr-1" />
              却下
            </Button>
          </div>
        );
      }
      
      return (
        <Button variant="outline" size="sm">
          {action}
        </Button>
      );
    },
  },
];

// AI実行履歴カラム定義
const historyColumns: ColumnDef<any>[] = [
  {
    accessorKey: "timestamp",
    header: "実行日時",
    cell: ({ row }) => {
      const timestamp = row.getValue("timestamp") as string;
      return (
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          <span className="font-mono">{timestamp}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "content",
    header: "実行内容",
    cell: ({ row }) => {
      const content = row.getValue("content") as string;
      return <span>{content}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "ステータス",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case "AI自動": return "bg-purple-100 text-purple-800";
          case "人間確認": return "bg-blue-100 text-blue-800";
          case "判断": return "bg-orange-100 text-orange-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "result",
    header: "結果",
    cell: ({ row }) => {
      const result = row.getValue("result") as string;
      const getResultColor = (result: string) => {
        switch (result) {
          case "完了": return "bg-green-100 text-green-800";
          case "確認中": return "bg-yellow-100 text-yellow-800";
          case "承認済み": return "bg-green-100 text-green-800";
          case "却下済み": return "bg-red-100 text-red-800";
          case "エラー": return "bg-red-100 text-red-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getResultColor(result)}`}>
          {result}
        </span>
      );
    },
  },
  {
    accessorKey: "impact",
    header: "影響",
    cell: ({ row }) => {
      const impact = row.getValue("impact") as string;
      return (
        <span className="text-sm text-gray-700 max-w-xs truncate" title={impact}>
          {impact}
        </span>
      );
    },
  },
  {
    accessorKey: "efficiency",
    header: "効率化",
    cell: ({ row }) => {
      const efficiency = row.getValue("efficiency") as string;
      return (
        <span className="text-sm text-green-700 max-w-xs truncate" title={efficiency}>
          {efficiency}
        </span>
      );
    },
  },
];

// 今日のアクションカラム定義
const todayActionColumns: ColumnDef<any>[] = [
  {
    accessorKey: "what",
    header: "アクション名",
    cell: ({ row }) => (
      <div className="font-medium text-sm">
        {row.getValue("what") as string}
      </div>
    )
  },
  {
    accessorKey: "why",
    header: "営業機会",
    cell: ({ row }) => (
      <div className="text-sm text-gray-700 leading-relaxed">
        {row.getValue("why") as string}
      </div>
    )
  },
  {
    accessorKey: "when",
    header: "期限",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-2 py-1">
          {row.getValue("when") as string}
        </span>
      </div>
    )
  },
  {
    accessorKey: "who",
    header: "担当者",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.getValue("who") as string}
      </div>
    )
  },
  {
    accessorKey: "priority",
    header: "優先度",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      return (
        <span className="inline-block rounded-full px-2 py-1 text-sm font-medium bg-gray-100 text-gray-800">
          {priority}
        </span>
      );
    }
  },
  {
    accessorKey: "relatedCase",
    header: "関連案件",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.getValue("relatedCase") as string}
      </div>
    )
  },
  {
    accessorKey: "relatedTask",
    header: "関連タスク",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {row.getValue("relatedTask") as string}
      </div>
    )
  }
];

// 詳細データ用のカラム定義
const emailColumns: ColumnDef<any>[] = [
  { 
    accessorKey: "priority", 
    header: "優先度", 
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "高": return "bg-red-100 text-red-800";
          case "中": return "bg-yellow-100 text-yellow-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      );
    },
  },
  { accessorKey: "sender", header: "送信者", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("sender") as string}
    </span>
  ) },
  { accessorKey: "subject", header: "件名", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("subject") as string}
    </span>
  ) },
  { accessorKey: "time", header: "受信時刻", cell: ({ row }) => (
    <span className="text-sm font-normal text-gray-600">
      {row.getValue("time") as string}
    </span>
  ) },
  { accessorKey: "status", header: "ステータス", cell: ({ row }) => (
    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-2 py-0.5">
      {row.getValue("status") as string}
    </span>
  ) },
];

const slackColumns: ColumnDef<any>[] = [
  { 
    accessorKey: "priority", 
    header: "優先度", 
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "高": return "bg-red-100 text-red-800";
          case "中": return "bg-yellow-100 text-yellow-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      );
    },
  },
  { accessorKey: "channel", header: "チャンネル", cell: ({ row }) => (
    <span className="text-sm font-normal text-blue-600">
      {row.getValue("channel") as string}
    </span>
  ) },
  { accessorKey: "sender", header: "送信者", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("sender") as string}
    </span>
  ) },
  { accessorKey: "message", header: "メッセージ", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("message") as string}
    </span>
  ) },
  { accessorKey: "time", header: "時刻", cell: ({ row }) => (
    <span className="text-sm font-normal text-gray-600">
      {row.getValue("time") as string}
    </span>
  ) },
];

const meetingColumns: ColumnDef<any>[] = [
  { 
    accessorKey: "priority", 
    header: "優先度", 
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "高": return "bg-red-100 text-red-800";
          case "中": return "bg-yellow-100 text-yellow-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      );
    },
  },
  { accessorKey: "company", header: "顧客名", cell: ({ row }) => (
    <span className="text-sm font-normal font-medium">
      {row.getValue("company") as string}
    </span>
  ) },
  { accessorKey: "time", header: "時間", cell: ({ row }) => (
    <span className="text-sm font-normal text-gray-600">
      {row.getValue("time") as string}
    </span>
  ) },
  { accessorKey: "type", header: "商談種別", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("type") as string}
    </span>
  ) },
  { accessorKey: "assignee", header: "担当者", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("assignee") as string}
    </span>
  ) },
  { accessorKey: "status", header: "ステータス", cell: ({ row }) => (
    <span className="inline-block bg-orange-100 text-orange-800 text-sm font-medium rounded-full px-2 py-0.5">
      {row.getValue("status") as string}
    </span>
  ) },
];

const followupColumns: ColumnDef<any>[] = [
  { 
    accessorKey: "priority", 
    header: "優先度", 
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string;
      const getPriorityColor = (priority: string) => {
        switch (priority) {
          case "高": return "bg-red-100 text-red-800";
          case "中": return "bg-yellow-100 text-yellow-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      );
    },
  },
  { accessorKey: "company", header: "顧客名", cell: ({ row }) => (
    <span className="text-sm font-normal font-medium">
      {row.getValue("company") as string}
    </span>
  ) },
  { accessorKey: "type", header: "種別", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("type") as string}
    </span>
  ) },
  { accessorKey: "daysAgo", header: "送付日数", cell: ({ row }) => (
    <span className="text-sm font-normal text-gray-600">
      {row.getValue("daysAgo") as number}日前
    </span>
  ) },
  { accessorKey: "assignee", header: "担当者", cell: ({ row }) => (
    <span className="text-sm font-normal">
      {row.getValue("assignee") as string}
    </span>
  ) },
  { accessorKey: "status", header: "ステータス", cell: ({ row }) => (
    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-2 py-0.5">
      {row.getValue("status") as string}
    </span>
  ) },
];

// ナレッジカラム定義
const knowledgeColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "タイトル",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <span className="font-medium text-gray-900">{title}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "カテゴリー",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      const getCategoryColor = (category: string) => {
        switch (category) {
          case "成功事例": return "bg-green-100 text-green-800";
          case "ベストプラクティス": return "bg-blue-100 text-blue-800";
          case "スキル向上": return "bg-purple-100 text-purple-800";
          case "学習": return "bg-orange-100 text-orange-800";
          default: return "bg-gray-100 text-gray-800";
        }
      };
      return (
        <span className={`inline-block rounded-full px-2 py-0.5 text-sm font-medium ${getCategoryColor(category)}`}>
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "author",
    header: "作成者",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.getValue("author") as string}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "作成日",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.getValue("date") as string}
      </span>
    ),
  },
  {
    accessorKey: "views",
    header: "閲覧数",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {row.getValue("views") as number}回
      </span>
    ),
  },
  {
    accessorKey: "rating",
    header: "評価",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <span className="text-sm text-gray-600">
          ⭐ {rating}
        </span>
      );
    },
  },
  {
    accessorKey: "summary",
    header: "概要",
    cell: ({ row }) => {
      const summary = row.getValue("summary") as string;
      return (
        <span className="text-sm text-gray-600 max-w-xs truncate" title={summary}>
          {summary}
        </span>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "タグ",
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      );
    },
  },
];

export default function Home() {
  // State定義
  const [command, setCommand] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [followupCandidates, setFollowupCandidates] = useState<any[] | null>(null)
  const [mailPreview, setMailPreview] = useState<string | null>(null)
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([0,1])
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({ 0: true, 1: true })
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [editingMailId, setEditingMailId] = useState<string | null>(null)
  const [editedMails, setEditedMails] = useState<{[key: string]: {subject: string, body: string}}>({})
  const [currentTab, setCurrentTab] = useState('meetings')
  const [taskColumnVisibility, setTaskColumnVisibility] = useState(taskColumns.map(() => true))
  const [riskColumnVisibility, setRiskColumnVisibility] = useState(riskColumns.map(() => true))
  const [morningColumnVisibility, setMorningColumnVisibility] = useState(morningColumns.map(() => true))
  const [historyColumnVisibility, setHistoryColumnVisibility] = useState(historyColumns.map(() => true))
  const [meetingColumnVisibility, setMeetingColumnVisibility] = useState(meetingColumns.map(() => true))
  const [followupColumnVisibility, setFollowupColumnVisibility] = useState(followupColumns.map(() => true))
  const [knowledgeColumnVisibility, setKnowledgeColumnVisibility] = useState(knowledgeColumns.map(() => true))
  const [knowledgeFilter, setKnowledgeFilter] = useState<string>("all")
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null)

  const [competitorColumnVisibility, setCompetitorColumnVisibility] = useState(competitorColumns.map(() => true))
  const [slipColumnVisibility, setSlipColumnVisibility] = useState(slipColumns.map(() => true))
  const [aiProposalColumnVisibility, setAiProposalColumnVisibility] = useState(aiProposalColumns.map(() => true))
  const [todayActionColumnVisibility, setTodayActionColumnVisibility] = useState(todayActionColumns.map(() => true))

  const [analyticsColumnVisibility, setAnalyticsColumnVisibility] = useState([true, true, true, true, true])

  // Selaの実行結果メッセージ用の状態
  const [selaMessage, setSelaMessage] = useState<React.ReactNode | null>(null);

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

    // 通常のコマンド処理
    setAiResponse("");
    setSuggestions([]);
    setFollowupCandidates(null);
    setMailPreview(null);
    
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
    setLastCommand("");
    setEditableQuestion("");
    setMessages([]);
    setCommand("");
    setEditingMailId(null);
    setEditedMails({});
    setSelaMessage(null); // クリア時にメッセージも消去
    // エージェント履歴もクリア
    setAgentHistory([]);
    setAgentInput("");
    setIsAgentProcessing(false);
  };





  // 質問リストをファイルから取得（現状は静的に記述）
  const questionList = [
    "フォローアップメールが必要な案件を抽出して"
  ];

  // コマンド入力欄の表示位置を制御
  const showInputAtBottom = !!aiResponse;

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







  // 対応提案実行ハンドラー
  const [executingSuggestions, setExecutingSuggestions] = useState<Set<string>>(new Set());

  const handleExecuteSuggestion = (suggestion: string) => {
    // 実行中状態を設定
    setExecutingSuggestions(new Set([...executingSuggestions, suggestion]));

    // 3秒後に実行完了とメッセージを表示
    setTimeout(() => {
      setExecutingSuggestions(prev => {
        const next = new Set(prev);
        next.delete(suggestion);
        return next;
      });
      
      // メッセージを設定
      const message = (
        <Alert className="bg-white border border-gray-100 shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <AlertTitle className="text-gray-900 text-sm font-semibold">
                実行完了
              </AlertTitle>
              <AlertDescription className="mt-1 text-gray-600 text-sm">
                対応提案「{suggestion}」を実行しました。結果は対応提案タブで確認できます。
              </AlertDescription>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                onClick={() => setSelaMessage(null)}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">閉じる</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </Alert>
      );
      setSelaMessage(message);

      // 5秒後にメッセージを消去
      setTimeout(() => {
        setSelaMessage(null);
      }, 5000);
    }, 3000);
  };

  const [mainTab, setMainTab] = useState<'agents' | 'dashboard'>('dashboard');

  // エージェントタブ用のstate
  const [agentInput, setAgentInput] = useState("");
  const [agentHistory, setAgentHistory] = useState<{input: string, response: string, timestamp: string}[]>([]);
  const [isAgentProcessing, setIsAgentProcessing] = useState(false);

  // エージェント送信ハンドラー
  const handleAgentSend = async () => {
    if (!agentInput.trim()) return;
    
    const timestamp = new Date().toLocaleString('ja-JP');
    const userInput = agentInput;
    
    // 入力履歴に追加
    setAgentHistory(prev => [...prev, {
      input: userInput,
      response: "処理中...",
      timestamp
    }]);
    
    setAgentInput("");
    setIsAgentProcessing(true);
    
    // 模擬的なAI応答（実際のAPI呼び出しに置き換え可能）
    setTimeout(() => {
      const response = `対応提案: ${userInput}について対応いたします。詳細な分析と提案を準備中です。`;
      setAgentHistory(prev => prev.map((item, index) => 
        index === prev.length - 1 ? { ...item, response } : item
      ));
      setIsAgentProcessing(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onClear={handleClear} />
      
      {/* メインコンテンツ */}
      <main className="flex-1 w-full mx-auto">
        {/* エージェントタブのコンテンツ */}
        {mainTab === 'agents' && (
          <div className="grid grid-cols-[240px_1fr] h-full">
            {/* サイド履歴エリア */}
            <div className="border-r border-gray-200 py-8 px-6 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">最近の活動</h2>
        <div className="space-y-4">
                  {[
                    "顧客Aへの提案資料作成",
                    "B社案件の進捗確認",
                    "新規顧客のアプローチ計画",
                    "既存顧客のフォローアップ",
                    "競合他社の調査",
                    "営業活動の報告書作成",
                    "顧客からの問い合わせ対応",
                    "商談の日程調整",
                    "見積書の作成",
                    "顧客データの更新"
                  ].map((title, index) => (
                    <div key={index} className="">
                      <a href="#" className="text-sm text-gray-800 hover:text-gray-600 hover:underline">
                        {title}
                      </a>
                    </div>
                  ))}
                </div>
            </div>
            
            {/* メインコンテンツエリア */}
            <div className="flex flex-col items-center justify-start pt-8 pb-4 px-8">
              {/* タブ */}
              <div className="w-full flex justify-center mb-8">
                <div className="inline-flex bg-gray-100 rounded-xl">
                  <button
                    className={`px-6 py-2 rounded-xl text-sm font-normal transition-colors ${(mainTab as string) === 'agents' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                    onClick={() => setMainTab('agents')}
                  >
                    エージェント
                  </button>
                  <button
                    className={`px-6 py-2 rounded-xl text-sm font-normal transition-colors ${(mainTab as string) === 'dashboard' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                    onClick={() => setMainTab('dashboard')}
                  >
                    ダッシュボード
                  </button>
                </div>
              </div>

                <h1 className="text-center font-semibold text-[32px] mb-8">今日は何をしましょうか？</h1>
              
              {/* Selaへの依頼入力欄 */}
              <div className="w-full max-w-4xl">
                <div className="relative">
                  <input
                    type="text"
                        placeholder="Selaへの依頼を入力してください"
                    value={agentInput}
                    onChange={(e) => setAgentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAgentSend();
                      }
                    }}
                    className="w-full px-4 py-4 h-24 text-base border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handleAgentSend}
                    disabled={!agentInput.trim() || isAgentProcessing}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                  </button>
                  </div>
                
                {/* サジェストボタン */}
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => setAgentInput("A社向け提案書作成の詳細分析をしてください")}
                    className="w-full flex items-center text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-lg">A社向け提案書作成の詳細分析をしてください</div>
                      <div className="text-xs text-gray-600 mt-1">顧客心理・決裁者向け・競合分析</div>
                      </div>
                  </button>
                  
                  <button 
                    onClick={() => setAgentInput("B社案件の失注リスク対策を立案してください")}
                    className="w-full flex items-center text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-lg">B社案件の失注リスク対策を立案してください</div>
                      <div className="text-xs text-gray-600 mt-1">リスク分析・対策立案・挽回戦略</div>
                  </div>
                  </button>
                  
                  <button 
                    onClick={() => setAgentInput("C社の決裁者向け情報を整理してください")}
                    className="w-full flex items-center text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-lg">C社の決裁者向け情報を整理してください</div>
                      <div className="text-xs text-gray-600 mt-1">経営指標・企業価値・競合優位性</div>
                </div>
                  </button>
                  
                  <button 
                    onClick={() => setAgentInput("私の営業スキルの改善点を教えてください")}
                    className="w-full flex items-center text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-lg">私の営業スキルの改善点を教えてください</div>
                      <div className="text-xs text-gray-600 mt-1">成功パターン・スキル向上・顧客心理</div>
              </div>
                  </button>
                  
                  <button 
                    onClick={() => setAgentInput("D社案件の競合他社動向を分析してください")}
                    className="w-full flex items-center text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group"
                  >
                    <CheckCircle2 className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-lg">D社案件の競合他社動向を分析してください</div>
                      <div className="text-xs text-gray-600 mt-1">市場動向・競合分析・差別化戦略</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ダッシュボードタブのコンテンツ */}
        {mainTab === 'dashboard' && (
          <div className="w-full flex flex-col items-center py-12 px-8">
            {/* タブ */}
            <div className="w-full flex justify-center mb-8">
              <div className="inline-flex bg-gray-100 rounded-xl">
                <button
                  className={`px-6 py-2 rounded-xl text-sm font-normal transition-colors ${(mainTab as string) === 'agents' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                  onClick={() => setMainTab('agents')}
                >
                  エージェント
                </button>
                <button
                  className={`px-6 py-2 rounded-xl text-sm font-normal transition-colors ${(mainTab as string) === 'dashboard' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                  onClick={() => setMainTab('dashboard')}
                >
                  ダッシュボード
                </button>
                </div>
              </div>

            <h1 className="text-center font-semibold text-[32px] mb-8">今日の優先事項をチェックしましょう</h1>
            
            {/* ダッシュボードのコンテンツ */}
            <div className="w-full">
              {/* タブ付きテーブル */}
              <div className="w-full bg-white border border-gray-100 rounded-xl shadow p-4">
                <Tabs defaultValue="meetings" className="w-full" value={currentTab} onValueChange={setCurrentTab}>
                  <div className="flex items-center justify-between mb-2 gap-4">
                    <TabsList className="bg-gray-100 flex-shrink-0">
                      <TabsTrigger value="meetings" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        今日の商談
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{meetingData.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="followup" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        追客案件
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{followupData.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="tasks" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        優先タスク
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{taskData.filter(task => task.priority === '高').length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="risks" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        リスク案件
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{riskData.filter(risk => risk.priority === '高').length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="knowledge" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        ナレッジ
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{knowledgeData.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="ai-proposals" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        対応提案
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{aiProposalsData.length}</span>
                      </TabsTrigger>
                      <TabsTrigger value="history" className="text-gray-700 font-normal text-sm flex items-center gap-1">
                        履歴
                        <span className="inline-block bg-gray-300 text-gray-800 text-xs font-semibold rounded-full px-2 py-0.5 ml-1">{historyData.length}</span>
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
                          {currentTab === 'tasks' ? (
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
                          ) : currentTab === 'risks' ? (
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
                          ) : currentTab === 'ai-proposals' ? (
                            aiProposalColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={aiProposalColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setAiProposalColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'meetings' ? (
                            meetingColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={meetingColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setMeetingColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'followup' ? (
                            followupColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={followupColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setFollowupColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'knowledge' ? (
                            knowledgeColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={knowledgeColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setKnowledgeColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : currentTab === 'history' ? (
                            historyColumns.map((col, idx) => (
                              <DropdownMenuCheckboxItem
                                key={typeof col.header === 'string' ? col.header : `col${idx}`}
                                checked={historyColumnVisibility[idx]}
                                onCheckedChange={checked => {
                                  setHistoryColumnVisibility(prev => prev.map((v, i) => i === idx ? checked : v));
                                }}
                              >
                                {typeof col.header === 'string' ? col.header : `カラム${idx+1}`}
                              </DropdownMenuCheckboxItem>
                            ))
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <TabsContent value="meetings" className="mt-0 w-full">
                    <DataTable
                      columns={meetingColumns}
                      data={meetingData}
                      showSearch={true}
                      showColumnSelector={false}
                      showPagination={true}
                    />
                  </TabsContent>

                  <TabsContent value="followup" className="mt-0 w-full">
                    <DataTable
                      columns={followupColumns}
                      data={followupData}
                      showSearch={true}
                      showColumnSelector={false}
                      showPagination={true}
                    />
                  </TabsContent>

                  <TabsContent value="ai-proposals" className="mt-0 w-full">
                    <DataTable
                      columns={aiProposalColumns.filter((_, idx) => aiProposalColumnVisibility[idx])}
                      data={aiProposalsData}
                      showSearch={false}
                      showColumnSelector={false}
                      showPagination={false}
                    />
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-0 w-full">
                    <DataTable
                      columns={taskColumns.filter((_, idx) => taskColumnVisibility[idx])}
                      data={taskData}
                      showSearch={false}
                      showColumnSelector={false}
                      showPagination={false}
                    />
                  </TabsContent>

                  <TabsContent value="risks" className="mt-0 w-full">
                    <DataTable
                      columns={riskColumns.filter((_, idx) => riskColumnVisibility[idx])}
                      data={riskData}
                      showSearch={false}
                      showColumnSelector={false}
                      showPagination={false}
                    />
                  </TabsContent>

                  <TabsContent value="history" className="mt-0 w-full">
                    <DataTable
                      columns={historyColumns.filter((_, idx) => historyColumnVisibility[idx])}
                      data={historyData}
                      showSearch={false}
                      showColumnSelector={false}
                      showPagination={false}
                    />
                  </TabsContent>

                  <TabsContent value="knowledge" className="mt-0 w-full">
                    <div className="space-y-4">
                      {/* フィルターと検索 */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <select
                            value={knowledgeFilter}
                            onChange={(e) => setKnowledgeFilter(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="all">すべてのカテゴリー</option>
                            <option value="成功事例">成功事例</option>
                            <option value="ベストプラクティス">ベストプラクティス</option>
                            <option value="スキル向上">スキル向上</option>
                            <option value="学習">学習</option>
                          </select>
                        </div>
                        <div className="text-sm text-gray-600">
                          {knowledgeData.filter(item => knowledgeFilter === "all" || item.category === knowledgeFilter).length}件
                        </div>
                      </div>

                      {/* ナレッジ詳細表示 */}
                      {selectedKnowledge ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{selectedKnowledge.title}</h3>
                            <button
                              onClick={() => setSelectedKnowledge(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>作成者: {selectedKnowledge.author}</span>
                              <span>作成日: {selectedKnowledge.date}</span>
                              <span>閲覧数: {selectedKnowledge.views}回</span>
                              <span>評価: ⭐ {selectedKnowledge.rating}</span>
                            </div>
                            <div className="flex gap-2">
                              {selectedKnowledge.tags.map((tag: string, index: number) => (
                                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="border-t pt-4">
                              <h4 className="font-medium text-gray-900 mb-2">概要</h4>
                              <p className="text-gray-700 mb-4">{selectedKnowledge.summary}</p>
                              <h4 className="font-medium text-gray-900 mb-2">詳細内容</h4>
                              <p className="text-gray-700">{selectedKnowledge.content}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* ナレッジ一覧カード表示 */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {knowledgeData
                            .filter(item => knowledgeFilter === "all" || item.category === knowledgeFilter)
                            .map((item) => (
                              <div 
                                key={item.id} 
                                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
                                onClick={() => setSelectedKnowledge(item)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{item.title}</h3>
                                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                    item.category === "成功事例" ? "bg-green-100 text-green-800" :
                                    item.category === "ベストプラクティス" ? "bg-blue-100 text-blue-800" :
                                    item.category === "スキル向上" ? "bg-purple-100 text-purple-800" :
                                    "bg-orange-100 text-orange-800"
                                  }`}>
                                    {item.category}
                                  </span>
                                </div>
                                <p className="text-gray-600 text-xs mb-3 line-clamp-3">{item.summary}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{item.author}</span>
                                  <div className="flex items-center gap-2">
                                    <span>⭐ {item.rating}</span>
                                    <span>{item.views}回</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                  {item.tags.length > 3 && (
                                    <span className="text-gray-400 text-xs">+{item.tags.length - 3}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                </Tabs>
                </div>
                        </div>
                          </div>
                        )}
      </main>
      
      {/* メッセージ履歴 */}
      <MessageHistory />

      {/* Selaの実行結果メッセージ */}
      {selaMessage && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-sm">
          <div className="max-w-2xl mx-auto">
            {selaMessage}
                          </div>
                          </div>
                        )}
    </div>
  );
} 