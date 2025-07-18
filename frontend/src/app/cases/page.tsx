"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Bell, Calendar, User } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
  status: "進行中" | "完了" | "保留" | "失注";
  source: "メール" | "議事録" | "AI検知";
  assignee: string;
  relatedTasks: number;
  lastUpdated: string;
};

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

export default function CasesPage() {
  // フィルター状態
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [customerTypeFilter, setCustomerTypeFilter] = useState<string>("all");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [deadlineFilter, setDeadlineFilter] = useState<string>("all");
  const [deadlineStart, setDeadlineStart] = useState<string>("");
  const [deadlineEnd, setDeadlineEnd] = useState<string>("");

  // 検索状態
  const [searchQuery, setSearchQuery] = useState("");

  // モーダル状態
  const [showRelatedTasksModal, setShowRelatedTasksModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  // 案件データ
  const casesData: Case[] = [
    {
      id: "case-001",
      name: "新製品導入についてのご相談",
      customer: "株式会社みらいテック",
      customerType: "新規",
      progress: 80,
      risk: "高",
      deadline: "2024/07/10",
      priority: "高",
      status: "進行中",
      source: "メール",
      assignee: "山田太郎",
      relatedTasks: 5,
      lastUpdated: "2024/07/10 15:30"
    },
    {
      id: "case-002",
      name: "システム更改の件について",
      customer: "東都情報サービス株式会社",
      customerType: "既存",
      progress: 40,
      risk: "中",
      deadline: "2024/07/12",
      priority: "中",
      status: "進行中",
      source: "議事録",
      assignee: "鈴木一郎",
      relatedTasks: 3,
      lastUpdated: "2024/07/10 14:45"
    },
    {
      id: "case-003",
      name: "海外展開サポートのご依頼",
      customer: "グローバル商事株式会社",
      customerType: "新規",
      progress: 20,
      risk: "高",
      deadline: "2024/07/15",
      priority: "高",
      status: "進行中",
      source: "AI検知",
      assignee: "佐藤花子",
      relatedTasks: 7,
      lastUpdated: "2024/07/10 13:20"
    },
    {
      id: "case-004",
      name: "契約更新について",
      customer: "日本エネルギー株式会社",
      customerType: "既存",
      progress: 60,
      risk: "中",
      deadline: "2024/07/18",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "田中次郎",
      relatedTasks: 4,
      lastUpdated: "2024/07/10 11:15"
    },
    {
      id: "case-005",
      name: "新規サービス提案の件",
      customer: "株式会社さくらネット",
      customerType: "新規",
      progress: 50,
      risk: "高",
      deadline: "2024/07/20",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "山田太郎",
      relatedTasks: 6,
      lastUpdated: "2024/07/10 10:30"
    },
    {
      id: "case-006",
      name: "クラウド移行についてのご相談",
      customer: "デジタルソリューションズ",
      customerType: "既存",
      progress: 90,
      risk: "低",
      deadline: "2024/07/25",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "高橋美咲",
      relatedTasks: 2,
      lastUpdated: "2024/07/10 09:15"
    },
    {
      id: "case-007",
      name: "データ連携システムの導入について",
      customer: "ITコンサルティング",
      customerType: "新規",
      progress: 30,
      risk: "中",
      deadline: "2024/07/28",
      priority: "中",
      status: "保留",
      source: "AI検知",
      assignee: "鈴木一郎",
      relatedTasks: 4,
      lastUpdated: "2024/07/10 08:45"
    },
    {
      id: "case-008",
      name: "セキュリティ対策のご相談",
      customer: "株式会社セキュリティテック",
      customerType: "新規",
      progress: 15,
      risk: "高",
      deadline: "2024/07/30",
      priority: "高",
      status: "進行中",
      source: "メール",
      assignee: "佐藤花子",
      relatedTasks: 8,
      lastUpdated: "2024/07/10 07:30"
    },
    {
      id: "case-009",
      name: "既存システムの保守について",
      customer: "株式会社メンテナンス",
      customerType: "既存",
      progress: 75,
      risk: "低",
      deadline: "2024/08/05",
      priority: "中",
      status: "進行中",
      source: "議事録",
      assignee: "田中次郎",
      relatedTasks: 3,
      lastUpdated: "2024/07/10 06:15"
    },
    {
      id: "case-010",
      name: "AI導入支援のご依頼",
      customer: "株式会社AIソリューション",
      customerType: "新規",
      progress: 25,
      risk: "高",
      deadline: "2024/08/10",
      priority: "高",
      status: "進行中",
      source: "AI検知",
      assignee: "山田太郎",
      relatedTasks: 9,
      lastUpdated: "2024/07/10 05:45"
    },
    {
      id: "case-011",
      name: "業務効率化の提案について",
      customer: "株式会社エフィシエンシー",
      customerType: "既存",
      progress: 45,
      risk: "中",
      deadline: "2024/08/15",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "鈴木一郎",
      relatedTasks: 5,
      lastUpdated: "2024/07/10 04:30"
    },
    {
      id: "case-012",
      name: "DX推進プロジェクトの件",
      customer: "株式会社デジタル変革",
      customerType: "新規",
      progress: 35,
      risk: "高",
      deadline: "2024/08/20",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "高橋美咲",
      relatedTasks: 7,
      lastUpdated: "2024/07/10 03:15"
    },
    {
      id: "case-013",
      name: "リモートワーク環境構築について",
      customer: "株式会社リモートワーク",
      customerType: "新規",
      progress: 85,
      risk: "中",
      deadline: "2024/08/25",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "佐藤花子",
      relatedTasks: 4,
      lastUpdated: "2024/07/10 02:00"
    },
    {
      id: "case-014",
      name: "データ分析基盤の構築について",
      customer: "株式会社データアナリティクス",
      customerType: "既存",
      progress: 55,
      risk: "中",
      deadline: "2024/08/30",
      priority: "中",
      status: "進行中",
      source: "AI検知",
      assignee: "田中次郎",
      relatedTasks: 6,
      lastUpdated: "2024/07/10 01:45"
    },
    {
      id: "case-015",
      name: "コンプライアンス対応のご相談",
      customer: "株式会社コンプライアンス",
      customerType: "新規",
      progress: 10,
      risk: "高",
      deadline: "2024/09/05",
      priority: "高",
      status: "進行中",
      source: "メール",
      assignee: "山田太郎",
      relatedTasks: 10,
      lastUpdated: "2024/07/10 00:30"
    },
    {
      id: "case-016",
      name: "既存システムの更新について",
      customer: "株式会社システムアップデート",
      customerType: "既存",
      progress: 70,
      risk: "低",
      deadline: "2024/09/10",
      priority: "中",
      status: "進行中",
      source: "議事録",
      assignee: "鈴木一郎",
      relatedTasks: 3,
      lastUpdated: "2024/07/09 23:15"
    },
    {
      id: "case-017",
      name: "クラウドネイティブ化のご依頼",
      customer: "株式会社クラウドネイティブ",
      customerType: "新規",
      progress: 20,
      risk: "高",
      deadline: "2024/09/15",
      priority: "高",
      status: "進行中",
      source: "AI検知",
      assignee: "高橋美咲",
      relatedTasks: 8,
      lastUpdated: "2024/07/09 22:00"
    },
    {
      id: "case-018",
      name: "業務アプリケーション開発について",
      customer: "株式会社アプリ開発",
      customerType: "既存",
      progress: 65,
      risk: "中",
      deadline: "2024/09/20",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "佐藤花子",
      relatedTasks: 5,
      lastUpdated: "2024/07/09 21:45"
    },
    {
      id: "case-019",
      name: "セキュリティ監査のご相談",
      customer: "株式会社セキュリティ監査",
      customerType: "新規",
      progress: 30,
      risk: "高",
      deadline: "2024/09/25",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "田中次郎",
      relatedTasks: 7,
      lastUpdated: "2024/07/09 20:30"
    },
    {
      id: "case-020",
      name: "データバックアップ体制の構築について",
      customer: "株式会社バックアップ",
      customerType: "既存",
      progress: 80,
      risk: "低",
      deadline: "2024/09/30",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "山田太郎",
      relatedTasks: 4,
      lastUpdated: "2024/07/09 19:15"
    },
    {
      id: "case-021",
      name: "API連携システムの導入について",
      customer: "株式会社APIソリューション",
      customerType: "新規",
      progress: 40,
      risk: "中",
      deadline: "2024/10/05",
      priority: "中",
      status: "進行中",
      source: "AI検知",
      assignee: "鈴木一郎",
      relatedTasks: 6,
      lastUpdated: "2024/07/09 18:00"
    },
    {
      id: "case-022",
      name: "既存システムの統合について",
      customer: "株式会社システム統合",
      customerType: "既存",
      progress: 25,
      risk: "高",
      deadline: "2024/10/10",
      priority: "高",
      status: "進行中",
      source: "メール",
      assignee: "高橋美咲",
      relatedTasks: 9,
      lastUpdated: "2024/07/09 17:45"
    },
    {
      id: "case-023",
      name: "モバイルアプリ開発のご相談",
      customer: "株式会社モバイル開発",
      customerType: "新規",
      progress: 15,
      risk: "高",
      deadline: "2024/10/15",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "佐藤花子",
      relatedTasks: 8,
      lastUpdated: "2024/07/09 16:30"
    },
    {
      id: "case-024",
      name: "ネットワーク構築について",
      customer: "株式会社ネットワーク",
      customerType: "既存",
      progress: 90,
      risk: "低",
      deadline: "2024/10/20",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "田中次郎",
      relatedTasks: 3,
      lastUpdated: "2024/07/09 15:15"
    },
    {
      id: "case-025",
      name: "AIチャットボット導入のご依頼",
      customer: "株式会社チャットボット",
      customerType: "新規",
      progress: 35,
      risk: "中",
      deadline: "2024/10/25",
      priority: "中",
      status: "進行中",
      source: "AI検知",
      assignee: "山田太郎",
      relatedTasks: 7,
      lastUpdated: "2024/07/09 14:00"
    },
    {
      id: "case-026",
      name: "既存システムの性能改善について",
      customer: "株式会社性能改善",
      customerType: "既存",
      progress: 60,
      risk: "中",
      deadline: "2024/10/30",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "鈴木一郎",
      relatedTasks: 5,
      lastUpdated: "2024/07/09 12:45"
    },
    {
      id: "case-027",
      name: "ブロックチェーン技術導入のご相談",
      customer: "株式会社ブロックチェーン",
      customerType: "新規",
      progress: 20,
      risk: "高",
      deadline: "2024/11/05",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "高橋美咲",
      relatedTasks: 10,
      lastUpdated: "2024/07/09 11:30"
    },
    {
      id: "case-028",
      name: "データセンター移転について",
      customer: "株式会社データセンター",
      customerType: "既存",
      progress: 75,
      risk: "中",
      deadline: "2024/11/10",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "佐藤花子",
      relatedTasks: 6,
      lastUpdated: "2024/07/09 10:15"
    },
    {
      id: "case-029",
      name: "IoTシステム構築のご依頼",
      customer: "株式会社IoTソリューション",
      customerType: "新規",
      progress: 30,
      risk: "高",
      deadline: "2024/11/15",
      priority: "高",
      status: "進行中",
      source: "AI検知",
      assignee: "田中次郎",
      relatedTasks: 8,
      lastUpdated: "2024/07/09 09:00"
    },
    {
      id: "case-030",
      name: "既存システムのセキュリティ強化について",
      customer: "株式会社セキュリティ強化",
      customerType: "既存",
      progress: 50,
      risk: "中",
      deadline: "2024/11/20",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "山田太郎",
      relatedTasks: 4,
      lastUpdated: "2024/07/09 08:45"
    },
    {
      id: "case-031",
      name: "機械学習システム導入のご相談",
      customer: "株式会社機械学習",
      customerType: "新規",
      progress: 25,
      risk: "高",
      deadline: "2024/11/25",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "鈴木一郎",
      relatedTasks: 9,
      lastUpdated: "2024/07/09 07:30"
    },
    {
      id: "case-032",
      name: "既存システムの保守契約更新について",
      customer: "株式会社保守契約",
      customerType: "既存",
      progress: 85,
      risk: "低",
      deadline: "2024/11/30",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "高橋美咲",
      relatedTasks: 3,
      lastUpdated: "2024/07/09 06:15"
    },
    {
      id: "case-033",
      name: "VR/AR技術導入のご依頼",
      customer: "株式会社VR/AR",
      customerType: "新規",
      progress: 15,
      risk: "高",
      deadline: "2024/12/05",
      priority: "高",
      status: "進行中",
      source: "AI検知",
      assignee: "佐藤花子",
      relatedTasks: 7,
      lastUpdated: "2024/07/09 05:00"
    },
    {
      id: "case-034",
      name: "既存システムのユーザビリティ改善について",
      customer: "株式会社ユーザビリティ",
      customerType: "既存",
      progress: 45,
      risk: "中",
      deadline: "2024/12/10",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "田中次郎",
      relatedTasks: 5,
      lastUpdated: "2024/07/09 04:45"
    },
    {
      id: "case-035",
      name: "量子コンピューティング技術のご相談",
      customer: "株式会社量子コンピューティング",
      customerType: "新規",
      progress: 10,
      risk: "高",
      deadline: "2024/12/15",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "山田太郎",
      relatedTasks: 12,
      lastUpdated: "2024/07/09 03:30"
    },
    {
      id: "case-036",
      name: "既存システムの障害対応について",
      customer: "株式会社障害対応",
      customerType: "既存",
      progress: 95,
      risk: "低",
      deadline: "2024/12/20",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "鈴木一郎",
      relatedTasks: 2,
      lastUpdated: "2024/07/09 02:15"
    },
    {
      id: "case-037",
      name: "5G技術導入のご依頼",
      customer: "株式会社5Gソリューション",
      customerType: "新規",
      progress: 20,
      risk: "高",
      deadline: "2024/12/25",
      priority: "高",
      status: "進行中",
      source: "AI検知",
      assignee: "高橋美咲",
      relatedTasks: 8,
      lastUpdated: "2024/07/09 01:00"
    },
    {
      id: "case-038",
      name: "既存システムの容量拡張について",
      customer: "株式会社容量拡張",
      customerType: "既存",
      progress: 70,
      risk: "中",
      deadline: "2024/12/30",
      priority: "中",
      status: "進行中",
      source: "メール",
      assignee: "佐藤花子",
      relatedTasks: 4,
      lastUpdated: "2024/07/09 00:45"
    },
    {
      id: "case-039",
      name: "自動運転技術導入のご相談",
      customer: "株式会社自動運転",
      customerType: "新規",
      progress: 5,
      risk: "高",
      deadline: "2025/01/05",
      priority: "高",
      status: "進行中",
      source: "議事録",
      assignee: "田中次郎",
      relatedTasks: 15,
      lastUpdated: "2024/07/08 23:30"
    },
    {
      id: "case-040",
      name: "既存システムの最終更新について",
      customer: "株式会社最終更新",
      customerType: "既存",
      progress: 100,
      risk: "低",
      deadline: "2025/01/10",
      priority: "中",
      status: "完了",
      source: "メール",
      assignee: "山田太郎",
      relatedTasks: 1,
      lastUpdated: "2024/07/08 22:15"
    }
  ];

  // 案件テーブルのカラム定義
  const caseColumns: ColumnDef<Case, React.ReactNode>[] = [
    {
      accessorKey: "name",
      header: "案件名",
      cell: info => (
        <Link href={`/cases/${info.row.original.id}`} className="font-medium text-gray-900 hover:text-gray-600">
          {info.getValue() as string}
        </Link>
      )
    },
    {
      accessorKey: "customer",
      header: "顧客名",
      cell: info => <span className="text-gray-700">{info.getValue() as string}</span>
    },
    {
      accessorKey: "customerType",
      header: "顧客区分",
      cell: info => (
        <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
          {info.getValue() as string}
        </span>
      )
    },
    {
      accessorKey: "status",
      header: "ステータス",
      cell: info => {
        const status = info.getValue() as string;
        return (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
      }
    },
    {
      accessorKey: "priority",
      header: "優先度",
      cell: info => {
        const priority = info.getValue() as string;
        return (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
            {priority}
          </span>
        );
      }
    },
    {
      accessorKey: "progress",
      header: "進捗率",
      cell: info => {
        const progress = info.getValue() as number;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
        );
      }
    },
    {
      accessorKey: "risk",
      header: "リスク",
      cell: info => {
        const risk = info.getValue() as string;
        return (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
            {risk}
          </span>
        );
      }
    },
    {
      accessorKey: "deadline",
      header: "期限",
      cell: info => {
        const deadline = info.getValue() as string;
        const today = new Date();
        const deadlineDate = new Date(deadline);
        const daysLeft = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex flex-col">
            <span className="text-gray-700">{deadline}</span>
            <span className="text-xs text-gray-500">
              {daysLeft < 0 ? `${Math.abs(daysLeft)}日超過` : 
               daysLeft === 0 ? '今日' : 
               daysLeft === 1 ? '明日' : `${daysLeft}日後`}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: "source",
      header: "発生源",
      cell: info => {
        const source = info.getValue() as string;
        return (
          <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700">
            {source}
          </span>
        );
      }
    },
    {
      accessorKey: "relatedTasks",
      header: "関連タスク",
      cell: info => (
        <button
          onClick={() => handleRelatedTasksClick(info.row.original)}
          className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          {info.getValue() as number}
        </button>
      )
    },
    {
      accessorKey: "lastUpdated",
      header: "最終更新",
      cell: info => {
        const date = info.getValue() as string;
        const updateDate = new Date(date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - updateDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex flex-col">
            <span className="text-gray-700">{date.split(' ')[0]}</span>
            <span className="text-xs text-gray-500">
              {diffDays === 0 ? '今日' : 
               diffDays === 1 ? '昨日' : 
               diffDays <= 3 ? `${diffDays}日前` : '古い'}
            </span>
          </div>
        );
      }
    }
  ];

  // フィルター適用済みデータ
  const filteredData = casesData.filter(caseItem => {
    const today = new Date();
    // ステータスフィルター
    if (statusFilter !== "all" && caseItem.status !== statusFilter) return false;
    
    // 優先度フィルター
    if (priorityFilter !== "all" && caseItem.priority !== priorityFilter) return false;
    
    // 顧客区分フィルター
    if (customerTypeFilter !== "all" && caseItem.customerType !== customerTypeFilter) return false;
    
    // リスクフィルター
    if (riskFilter !== "all" && caseItem.risk !== riskFilter) return false;
    
    // 発生源フィルター
    if (sourceFilter !== "all" && caseItem.source !== sourceFilter) return false;

    // 期限フィルター
    if (deadlineFilter === "thisWeek") {
      const caseDeadline = new Date(caseItem.deadline);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return caseDeadline >= startOfWeek && caseDeadline <= endOfWeek;
    }
    if (deadlineFilter === "thisMonth") {
      const caseDeadline = new Date(caseItem.deadline);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return caseDeadline >= startOfMonth && caseDeadline <= endOfMonth;
    }
    if (deadlineFilter === "overdue") {
      const caseDeadline = new Date(caseItem.deadline);
      return caseDeadline < today;
    }
    if (deadlineFilter === "range") {
      const caseDeadline = new Date(caseItem.deadline);
      const start = new Date(deadlineStart);
      const end = new Date(deadlineEnd);
      return caseDeadline >= start && caseDeadline <= end;
    }
    
    // 検索クエリ
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        caseItem.name.toLowerCase().includes(query) ||
        caseItem.customer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // カラム表示状態
  const [columnVisibility, setColumnVisibility] = useState<boolean[]>(caseColumns.map(() => true));

  // 関連タスククリックハンドラー
  const handleRelatedTasksClick = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowRelatedTasksModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* メインコンテンツエリア */}
      <main className="flex-1 container mx-auto px-8 pt-8 pb-48">
        <div className="space-y-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">案件一覧</h1>
            </div>
          </div>

          {/* 案件テーブル */}
          <div className="bg-white border border-gray-100 rounded-xl shadow">
            <div className="p-6">
              {/* 検索・ソート機能 */}
              <div className="flex flex-wrap gap-4 items-center mb-2">
                {/* 検索ボックス */}
                <div className="flex-1 min-w-[100px] max-w-[240px]">
                  <Input
                    placeholder="案件名・顧客名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* ステータス */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">ステータス: すべて</option>
                  <option value="進行中">進行中</option>
                  <option value="完了">完了</option>
                  <option value="保留">保留</option>
                  <option value="失注">失注</option>
                </select>

                {/* 優先度 */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">優先度: すべて</option>
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>

                {/* 顧客区分 */}
                <select
                  value={customerTypeFilter}
                  onChange={(e) => setCustomerTypeFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">顧客区分: すべて</option>
                  <option value="新規">新規</option>
                  <option value="既存">既存</option>
                </select>

                {/* リスク */}
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">リスク: すべて</option>
                  <option value="高">高</option>
                  <option value="中">中</option>
                  <option value="低">低</option>
                </select>

                {/* 発生源 */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">発生源: すべて</option>
                  <option value="メール">メール</option>
                  <option value="議事録">議事録</option>
                  <option value="AI検知">AI検知</option>
                </select>

                {/* 期限フィルタ */}
                <select
                  value={deadlineFilter}
                  onChange={(e) => setDeadlineFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">期限: すべて</option>
                  <option value="thisWeek">今週</option>
                  <option value="thisMonth">今月</option>
                  <option value="overdue">期限超過</option>
                  <option value="range">日付範囲</option>
                </select>
                {/* 日付範囲選択（必要な場合のみ表示） */}
                {deadlineFilter === "range" && (
                  <>
                    <input
                      type="date"
                      value={deadlineStart}
                      onChange={e => setDeadlineStart(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                    <span className="mx-1">〜</span>
                    <input
                      type="date"
                      value={deadlineEnd}
                      onChange={e => setDeadlineEnd(e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </>
                )}
              </div>

              <DataTable
                columns={caseColumns.filter((_, index) => columnVisibility[index])}
                data={filteredData}
                pageSize={20}
                showPagination={true}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 関連タスクモーダル */}
      {showRelatedTasksModal && selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedCase.name} - 関連タスク
              </h2>
              <button
                onClick={() => setShowRelatedTasksModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {/* 案件情報 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">案件情報</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">顧客名:</span>
                      <span className="ml-2 text-gray-900">{selectedCase.customer}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">進捗:</span>
                      <span className="ml-2 text-gray-900">{selectedCase.progress}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ステータス:</span>
                      <span className="ml-2 text-gray-900">{selectedCase.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">期限:</span>
                      <span className="ml-2 text-gray-900">{selectedCase.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* 関連タスク一覧 */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">関連タスク一覧</h3>
                  <div className="space-y-3">
                    {Array.from({ length: selectedCase.relatedTasks }, (_, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                              getTaskPriority(index) === '高' ? 'bg-red-100 text-red-700' :
                              getTaskPriority(index) === '中' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
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
            <div className="flex justify-end p-6 border-t">
              <button
                onClick={() => setShowRelatedTasksModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
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