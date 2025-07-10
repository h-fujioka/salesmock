"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    Briefcase,
    Calendar,
    FileText,
    Home,
    Mail,
    Settings,
    Target,
    User,
    Users
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  // const [notifications] = useState(5);
  const [unreadEmails] = useState(3);
  const [urgentTasks] = useState(2);

  const navigationItems = [
    {
      id: "dashboard",
      name: "統合タイムライン",
      icon: Home,
      description: "AI対話 × タイムライン",
      badge: null
    },
    {
      id: "cases",
      name: "案件管理",
      icon: Briefcase,
      description: "営業案件の管理",
      badge: null
    },
    {
      id: "tasks",
      name: "タスク管理",
      icon: Target,
      description: "カンバンボード形式",
      badge: urgentTasks > 0 ? urgentTasks : null,
      ai: true
    },
    {
      id: "emails",
      name: "メール管理",
      icon: Mail,
      description: "メールボックス",
      badge: unreadEmails > 0 ? unreadEmails : null
    }
  ];

  const secondaryItems = [
    {
      id: "analytics",
      name: "分析・レポート",
      icon: BarChart3,
      description: "営業分析"
    },
    {
      id: "calendar",
      name: "カレンダー",
      icon: Calendar,
      description: "スケジュール管理"
    },
    {
      id: "documents",
      name: "ドキュメント",
      icon: FileText,
      description: "提案書・資料"
    },
    {
      id: "team",
      name: "チーム管理",
      icon: Users,
      description: "メンバー管理"
    }
  ];

  return (
    <div className="w-[68px] bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* ヘッダー削除済み */}
      {/* メインナビゲーション */}
      <div className="flex-1 py-4 flex flex-col items-center overflow-y-auto">
        <div className="space-y-2 w-full flex flex-col items-center">
          {/* ラベル非表示 or アイコンのみ表示に最適化 */}
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className="w-12 h-12 flex items-center justify-center p-0 mb-2"
              onClick={() => onPageChange(item.id)}
              title={item.name}
            >
              <item.icon className="w-6 h-6" />
              {item.badge && (
                <Badge variant="secondary" className="absolute top-1 right-1 h-4 w-4 p-0 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        <div className="mt-8 space-y-2 w-full flex flex-col items-center">
          {secondaryItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-12 h-12 flex items-center justify-center p-0 mb-2"
              onClick={() => onPageChange(item.id)}
              title={item.name}
            >
              <item.icon className="w-6 h-6" />
            </Button>
          ))}
        </div>
      </div>

      {/* フッター */}
      <div className="py-4 border-t border-gray-200 flex flex-col items-center">
        <Button variant="ghost" className="w-12 h-12 flex items-center justify-center p-0 mb-2" title="設定">
          <Settings className="w-6 h-6" />
        </Button>
        <Button variant="ghost" className="w-12 h-12 flex items-center justify-center p-0" title="プロフィール">
          <User className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
} 