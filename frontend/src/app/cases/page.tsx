"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Bell, Calendar, ChevronDown, Filter, Search, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// 案件データの型定義
type Case = {
  id: string;
  name: string;
  customer: string;
  customerType: "新規" | "既存";
  progress: number;
  risk: "高" | "中" | "低";
  deadline: string;
  priority: "高" | "中" | "低";
  status: "新規受信" | "案件化検討中" | "提案中" | "進行中" | "完了" | "保留" | "失注";
  source: "メール" | "議事録" | "AI検知";
  assignee: string;
  customerContact: string;
  firstReceived: string;
  lastReceived: string;
  relatedTasks: number;
  emailCount: number; // 追加
  lastUpdated: string;
};

function Header() {
  return (
    <header className="h-14 min-h-14 w-full flex items-center justify-between px-6 bg-white border-b shadow-sm">
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

export default function CasesPage() {
  // タブ状態
  const [activeTab, setActiveTab] = useState<'assigned' | 'all'>('all');

  // フィルター状態
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // 検索状態
  const [searchQuery, setSearchQuery] = useState("");

  // モーダル状態
  const [showRelatedTasksModal, setShowRelatedTasksModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // 案件データ（添付画像に合わせて更新）
  const casesData: Case[] = [
    {
      id: "case-001",
      name: "LegalOn Cloudのご紹介 (佐藤様)",
      customer: "株式会社クロステック",
      customerType: "新規",
      progress: 80,
      risk: "高",
      deadline: "2024/07/10",
      priority: "高",
      status: "提案中",
      source: "メール",
      assignee: "Hirokazu Tanaka",
      customerContact: "佐藤二郎",
      firstReceived: "2024/06/01 09:00",
      lastReceived: "2025/05/20 12:01",
      relatedTasks: 5,
      emailCount: 12, // 追加
      lastUpdated: "2024/07/10 15:30"
    },
    {
      id: "case-002",
      name: "Legalforce特別キャンペーンのご紹介 (宮下様)",
      customer: "株式会社グローバルソーシング",
      customerType: "既存",
      progress: 40,
      risk: "中",
      deadline: "2024/07/12",
      priority: "中",
      status: "提案中",
      source: "議事録",
      assignee: "田中 裕子",
      customerContact: "宮下 大和",
      firstReceived: "2024/06/05 10:00",
      lastReceived: "2025/05/20 11:59",
      relatedTasks: 3,
      emailCount: 7, // 追加
      lastUpdated: "2024/07/10 14:45"
    },
    {
      id: "case-003",
      name: "【LegalOn松浦】 先日の打ち合わせの資料について",
      customer: "株式会社デジタルソリューションズ",
      customerType: "新規",
      progress: 20,
      risk: "高",
      deadline: "2024/07/15",
      priority: "高",
      status: "提案中",
      source: "AI検知",
      assignee: "佐藤 花子",
      customerContact: "松浦 健一",
      firstReceived: "2024/06/10 11:00",
      lastReceived: "2025/05/20 11:45",
      relatedTasks: 7,
      emailCount: 10, // 追加
      lastUpdated: "2024/07/10 13:20"
    },
    {
      id: "case-004",
      name: "LegalOn Cloud導入についてのご相談",
      customer: "株式会社ITコンサルティング",
      customerType: "既存",
      progress: 60,
      risk: "中",
      deadline: "2024/07/18",
      priority: "中",
      status: "提案中",
      source: "メール",
      assignee: "鈴木 一郎",
      customerContact: "田中 美咲",
      firstReceived: "2024/06/15 12:00",
      lastReceived: "2025/05/20 11:30",
      relatedTasks: 4,
      emailCount: 8, // 追加
      lastUpdated: "2024/07/10 11:15"
    },
    {
      id: "case-005",
      name: "Legalforce機能追加のご提案",
      customer: "株式会社セキュリティテック",
      customerType: "新規",
      progress: 50,
      risk: "高",
      deadline: "2024/07/20",
      priority: "高",
      status: "提案中",
      source: "議事録",
      assignee: "高橋 次郎",
      customerContact: "山田 太郎",
      firstReceived: "2024/06/20 13:00",
      lastReceived: "2025/05/20 11:15",
      relatedTasks: 6,
      emailCount: 15, // 追加
      lastUpdated: "2024/07/10 10:30"
    },
    {
      id: "case-006",
      name: "LegalOn Cloud移行について",
      customer: "株式会社メンテナンス",
      customerType: "既存",
      progress: 90,
      risk: "低",
      deadline: "2024/07/25",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "佐藤 花子",
      customerContact: "伊藤 恵子",
      firstReceived: "2024/06/25 14:00",
      lastReceived: "2024/07/10 11:00",
      relatedTasks: 2,
      emailCount: 25,
      lastUpdated: "2024/07/10 09:15"
    },
    {
      id: "case-007",
      name: "Legalforceライセンス更新のご案内",
      customer: "株式会社ファイナンス",
      customerType: "既存",
      progress: 95,
      risk: "低",
      deadline: "2024/07/08",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "田中 裕子",
      customerContact: "鈴木 健太",
      firstReceived: "2024/06/20 14:30",
      lastReceived: "2024/07/10 10:45",
      relatedTasks: 1,
      emailCount: 5,
      lastUpdated: "2024/07/10 08:30"
    },
    {
      id: "case-008",
      name: "LegalOn Cloud新機能のご紹介",
      customer: "株式会社マーケティング",
      customerType: "新規",
      progress: 30,
      risk: "中",
      deadline: "2024/07/22",
      priority: "中",
      status: "新規受信",
      source: "メール",
      assignee: "高橋 次郎",
      customerContact: "佐々木 恵子",
      firstReceived: "2024/07/09 09:15",
      lastReceived: "2024/07/10 09:30",
      relatedTasks: 4,
      emailCount: 3,
      lastUpdated: "2024/07/10 09:30"
    },
    {
      id: "case-009",
      name: "Legalforce導入支援について",
      customer: "株式会社ロジスティクス",
      customerType: "既存",
      progress: 70,
      risk: "中",
      deadline: "2024/07/28",
      priority: "高",
      status: "進行中",
      source: "メール",
      assignee: "鈴木 一郎",
      customerContact: "田中 正義",
      firstReceived: "2024/06/10 13:45",
      lastReceived: "2024/07/10 08:20",
      relatedTasks: 8,
      emailCount: 18,
      lastUpdated: "2024/07/10 08:20"
    },
    {
      id: "case-010",
      name: "LegalOn Cloudセキュリティ機能のご相談",
      customer: "株式会社ヘルスケア",
      customerType: "新規",
      progress: 25,
      risk: "高",
      deadline: "2024/07/30",
      priority: "高",
      status: "案件化検討中",
      source: "メール",
      assignee: "佐藤 花子",
      customerContact: "山本 美咲",
      firstReceived: "2024/07/08 16:00",
      lastReceived: "2024/07/10 07:45",
      relatedTasks: 3,
      emailCount: 6,
      lastUpdated: "2024/07/10 07:45"
    },
    {
      id: "case-011",
      name: "Legalforceカスタマイズのご提案",
      customer: "株式会社エンターテイメント",
      customerType: "既存",
      progress: 45,
      risk: "中",
      deadline: "2024/08/05",
      priority: "中",
      status: "提案中",
      source: "メール",
      assignee: "田中 裕子",
      customerContact: "中村 翔太",
      firstReceived: "2024/06/15 11:20",
      lastReceived: "2024/07/10 06:30",
      relatedTasks: 5,
      emailCount: 11,
      lastUpdated: "2024/07/10 06:30"
    },
    {
      id: "case-012",
      name: "LegalOn Cloud API連携について",
      customer: "株式会社テクノロジー",
      customerType: "新規",
      progress: 15,
      risk: "高",
      deadline: "2024/08/10",
      priority: "高",
      status: "新規受信",
      source: "メール",
      assignee: "高橋 次郎",
      customerContact: "渡辺 智子",
      firstReceived: "2024/07/10 05:15",
      lastReceived: "2024/07/10 05:15",
      relatedTasks: 2,
      emailCount: 1,
      lastUpdated: "2024/07/10 05:15"
    },
    {
      id: "case-013",
      name: "Legalforce運用サポートのご相談",
      customer: "株式会社エデュケーション",
      customerType: "既存",
      progress: 85,
      risk: "低",
      deadline: "2024/07/15",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "鈴木 一郎",
      customerContact: "小林 真理",
      firstReceived: "2024/06/25 09:30",
      lastReceived: "2024/07/10 04:20",
      relatedTasks: 6,
      emailCount: 14,
      lastUpdated: "2024/07/10 04:20"
    },
    {
      id: "case-014",
      name: "LegalOn Cloudデータ移行について",
      customer: "株式会社リテール",
      customerType: "既存",
      progress: 55,
      risk: "中",
      deadline: "2024/08/15",
      priority: "中",
      status: "提案中",
      source: "メール",
      assignee: "佐藤 花子",
      customerContact: "加藤 健一",
      firstReceived: "2024/06/30 15:45",
      lastReceived: "2024/07/10 03:10",
      relatedTasks: 7,
      emailCount: 9,
      lastUpdated: "2024/07/10 03:10"
    },
    {
      id: "case-015",
      name: "Legalforce新プランのご紹介",
      customer: "株式会社コンサルティング",
      customerType: "新規",
      progress: 35,
      risk: "中",
      deadline: "2024/08/20",
      priority: "中",
      status: "案件化検討中",
      source: "メール",
      assignee: "田中 裕子",
      customerContact: "高田 恵美",
      firstReceived: "2024/07/05 12:00",
      lastReceived: "2024/07/10 02:45",
      relatedTasks: 4,
      emailCount: 7,
      lastUpdated: "2024/07/10 02:45"
    },
    {
      id: "case-016",
      name: "LegalOn Cloudバックアップ機能のご相談",
      customer: "株式会社マニュファクチャリング",
      customerType: "既存",
      progress: 65,
      risk: "中",
      deadline: "2024/08/25",
      priority: "高",
      status: "進行中",
      source: "メール",
      assignee: "高橋 次郎",
      customerContact: "森田 直樹",
      firstReceived: "2024/06/20 10:15",
      lastReceived: "2024/07/10 01:30",
      relatedTasks: 8,
      emailCount: 16,
      lastUpdated: "2024/07/10 01:30"
    },
    {
      id: "case-017",
      name: "Legalforce統合システムのご提案",
      customer: "株式会社フィンテック",
      customerType: "新規",
      progress: 10,
      risk: "高",
      deadline: "2024/09/01",
      priority: "高",
      status: "新規受信",
      source: "メール",
      assignee: "鈴木 一郎",
      customerContact: "井上 美穂",
      firstReceived: "2024/07/10 00:45",
      lastReceived: "2024/07/10 00:45",
      relatedTasks: 3,
      emailCount: 1,
      lastUpdated: "2024/07/10 00:45"
    },
    {
      id: "case-018",
      name: "LegalOn Cloud監査機能のご紹介",
      customer: "株式会社アカウンティング",
      customerType: "既存",
      progress: 75,
      risk: "低",
      deadline: "2024/08/30",
      priority: "中",
      status: "提案中",
      source: "メール",
      assignee: "佐藤 花子",
      customerContact: "石川 雅子",
      firstReceived: "2024/06/28 14:20",
      lastReceived: "2024/07/09 23:15",
      relatedTasks: 5,
      emailCount: 12,
      lastUpdated: "2024/07/09 23:15"
    },
    {
      id: "case-019",
      name: "Legalforceワークフロー機能のご相談",
      customer: "株式会社ホスピタリティ",
      customerType: "新規",
      progress: 40,
      risk: "中",
      deadline: "2024/09/05",
      priority: "中",
      status: "案件化検討中",
      source: "メール",
      assignee: "田中 裕子",
      customerContact: "松本 和也",
      firstReceived: "2024/07/03 16:30",
      lastReceived: "2024/07/09 22:00",
      relatedTasks: 6,
      emailCount: 8,
      lastUpdated: "2024/07/09 22:00"
    },
    {
      id: "case-020",
      name: "LegalOn Cloudモバイル対応について",
      customer: "株式会社トランスポート",
      customerType: "既存",
      progress: 60,
      risk: "中",
      deadline: "2024/09/10",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "高橋 次郎",
      customerContact: "清水 麻衣",
      firstReceived: "2024/06/22 11:45",
      lastReceived: "2024/07/09 21:30",
      relatedTasks: 7,
      emailCount: 13,
      lastUpdated: "2024/07/09 21:30"
    }
  ];

  // フィルタリングされたデータ
  const filteredData = casesData.filter(caseItem => {
    const matchesSearch = searchQuery === "" || 
      caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = companyFilter === "all" || caseItem.customer === companyFilter;
    const matchesAssignee = assigneeFilter === "all" || caseItem.assignee === assigneeFilter;
    const matchesStatus = statusFilter === "all" || caseItem.status === statusFilter;
    
    return matchesSearch && matchesCompany && matchesAssignee && matchesStatus;
  });

  // テーブル列の定義（添付画像に合わせて調整）
  const caseColumns: ColumnDef<Case>[] = [
    {
      accessorKey: "name",
      header: "案件名",
      cell: info => (
        <Link href={`/cases/${info.row.original.id}`} className="text-gray-900 hover:text-gray-700 font-medium">
          {info.getValue() as string}
        </Link>
      )
    },
    {
      accessorKey: "customer",
      header: "企業名",
      cell: info => (
        <span className="text-gray-900">{info.getValue() as string}</span>
      )
    },
    {
      accessorKey: "customerType",
      header: "顧客区分",
      cell: info => (
        <span className="text-gray-700">{info.getValue() as string}</span>
      )
    },
    {
      accessorKey: "firstReceived",
      header: "初回受信日",
      cell: info => {
        const date = info.getValue() as string;
        const [datePart, timePart] = date.split(' ');
        return (
          <div className="text-gray-700">
            <div>{datePart}</div>
            <div className="text-sm text-gray-500">{timePart}</div>
          </div>
        );
      }
    },
    {
      accessorKey: "lastReceived",
      header: "最終受信日",
      cell: info => {
        const date = info.getValue() as string;
        const [datePart, timePart] = date.split(' ');
        return (
          <div className="text-gray-700">
            <div>{datePart}</div>
            <div className="text-sm text-gray-500">{timePart}</div>
          </div>
        );
      }
    },
    {
      accessorKey: "relatedTasks",
      header: "タスク件数",
      cell: info => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {info.getValue() as number}件
          </span>
        </div>
      )
    },
    {
      accessorKey: "emailCount",
      header: "受信メール数",
      cell: info => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
            {info.getValue() as number}通
            </span>
          </div>
      )
    },
    {
      accessorKey: "status",
      header: "ステータス",
      cell: info => {
        const status = info.getValue() as string;
        return (
          <div className="text-center">
            <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
              {status}
          </span>
          </div>
        );
      }
    },
    {
      accessorKey: "customerContact",
      header: "顧客担当者",
      cell: info => (
        <span className="text-gray-900">{info.getValue() as string}</span>
      )
    },
    {
      accessorKey: "assignee",
      header: "営業担当者",
      cell: info => (
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-xs">
              {(info.getValue() as string).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-900">{info.getValue() as string}</span>
          </div>
      )
    },
  ];

  // 企業一覧（フィルター用）
  const companies = Array.from(new Set(casesData.map(c => c.customer)));
  const assignees = Array.from(new Set(casesData.map(c => c.assignee)));
  const statuses = Array.from(new Set(casesData.map(c => c.status)));

  const handleRelatedTasksClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowRelatedTasksModal(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <Header />
      
      {/* メインコンテンツ */}
      <main className="w-full">
        <div className="w-full px-6 py-6">
          {/* タブと検索・フィルターを横並び */}
          <div className="flex items-center justify-between mb-6">
            {/* タブ */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'assigned' | 'all')}>
              <TabsList className="inline-flex">
                <TabsTrigger value="assigned">担当案件</TabsTrigger>
                <TabsTrigger value="all">すべて</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* 検索・フィルター */}
            <div className="flex items-center gap-3">
                {/* 検索ボックス */}
              <div className="w-60">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="案件・企業名で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                  />
                </div>
                </div>

              {/* 企業フィルター */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`justify-between min-w-[80px] ${
                      companyFilter !== "all" 
                        ? "border-gray-900 bg-gray-50 text-gray-900" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {companyFilter === "all" ? "企業" : companyFilter}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setCompanyFilter("all")}>
                    すべて
                  </DropdownMenuItem>
                  {companies.map(company => (
                    <DropdownMenuItem key={company} onClick={() => setCompanyFilter(company)}>
                      {company}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* ステータスフィルター */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`justify-between min-w-[100px] ${
                      statusFilter !== "all" 
                        ? "border-gray-900 bg-gray-50 text-gray-900" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {statusFilter === "all" ? "ステータス" : statusFilter}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                    すべて
                  </DropdownMenuItem>
                  {statuses.map(status => (
                    <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 自社担当者フィルター */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`justify-between min-w-[120px] ${
                      assigneeFilter !== "all" 
                        ? "border-gray-900 bg-gray-50 text-gray-900" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {assigneeFilter === "all" ? "自社担当者" : assigneeFilter}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setAssigneeFilter("all")}>
                    すべて
                  </DropdownMenuItem>
                  {assignees.map(assignee => (
                    <DropdownMenuItem key={assignee} onClick={() => setAssigneeFilter(assignee)}>
                      {assignee}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 並び替えボタン */}
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 hover:border-gray-300"
                title="並び替え"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>

              {/* フィルタリングボタン */}
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 hover:border-gray-300"
                title="フィルタリング"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
              </div>

          {/* テーブル */}
          <div className="overflow-x-auto">
              <DataTable
                columns={caseColumns}
                data={filteredData}
                pageSize={20}
                showPagination={true}
                searchSlot={null}
                columnSelectorSlot={null}
              />
          </div>
        </div>
      </main>

      {/* 関連タスクモーダル */}
      <Dialog open={showRelatedTasksModal} onOpenChange={setShowRelatedTasksModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>
              {selectedCase?.name} - 関連タスク
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {/* 案件情報 */}
              <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">案件情報</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">顧客名:</span>
                    <span className="ml-2 text-gray-900">{selectedCase?.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">進捗:</span>
                    <span className="ml-2 text-gray-900">{selectedCase?.progress}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ステータス:</span>
                    <span className="ml-2 text-gray-900">{selectedCase?.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">期限:</span>
                    <span className="ml-2 text-gray-900">{selectedCase?.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* 関連タスク一覧 */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">関連タスク一覧</h3>
                  <div className="space-y-3">
                  {selectedCase && Array.from({ length: selectedCase.relatedTasks }, (_, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              タスク {index + 1}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {getTaskDescription(index, selectedCase)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium ${
                            getTaskPriority(index) === '高' ? 'bg-gray-800 text-white' :
                            getTaskPriority(index) === '中' ? 'bg-gray-500 text-white' :
                            'bg-gray-300 text-gray-800'
                            }`}>
                              {getTaskPriority(index)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {getTaskDeadline(index)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRelatedTasksModal(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ヘルパー関数
function getTaskDescription(index: number, caseItem: Case): string {
  const descriptions = [
    "顧客との初回ミーティングの準備",
    "提案書の作成と送付",
    "見積書の作成",
    "技術検証の実施",
    "契約書の準備",
    "導入スケジュールの調整",
    "最終プレゼンテーションの準備",
    "顧客フィードバックの収集",
    "プロジェクト計画の詳細化"
  ];
  return descriptions[index % descriptions.length];
}

function getTaskPriority(index: number): string {
  const priorities = ["高", "中", "低"];
  return priorities[index % priorities.length];
}

function getTaskDeadline(index: number): string {
  const today = new Date();
  const deadline = new Date(today);
  deadline.setDate(today.getDate() + (index + 1) * 3);
  return deadline.toLocaleDateString('ja-JP');
} 