"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertCircle,
    Briefcase,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    Edit,
    Eye,
    Filter,
    MessageCircle,
    Plus,
    Search,
    Trash2,
    User,
    Mail,
    Bell
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Case {
  id: string;
  name: string;
  company: string;
  status: 'prospecting' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  progress: number;
  budget: number;
  startDate: string;
  endDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  isMyCase: boolean;
  unreadMessages: number;
  pendingActions: number;
  nextAction?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  aiSuggestion?: {
    status?: string;
    action?: string;
    approval?: string;
    risk?: string;
  };
}

export default function CaseList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [caseFilter, setCaseFilter] = useState<'my' | 'all'>("my");

  const cases: Case[] = [
    {
      id: "1",
      name: "ABC社システム導入",
      company: "株式会社ABC",
      status: "proposal",
      progress: 75,
      budget: 5000000,
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      assignedTo: "田中太郎",
      priority: "high",
      description: "基幹システムの導入プロジェクト",
      isMyCase: true,
      unreadMessages: 2,
      pendingActions: 1,
      nextAction: "提案書の最終確認",
      riskLevel: "medium",
      aiSuggestion: {
        status: "未読メール2件、進捗75%",
        action: "次は提案書の最終確認",
        approval: "承認待ち書類あり",
        risk: "顧客から進捗確認の連絡あり"
      }
    },
    {
      id: "2",
      name: "XYZ社保守契約",
      company: "XYZ株式会社",
      status: "negotiation",
      progress: 90,
      budget: 2000000,
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      assignedTo: "佐藤花子",
      priority: "medium",
      description: "年間保守契約の更新",
      isMyCase: false,
      unreadMessages: 0,
      pendingActions: 0,
      nextAction: "契約書のレビュー",
      riskLevel: "low",
      aiSuggestion: {
        status: "進捗90%",
        action: "契約書のレビュー",
        approval: "－",
        risk: "－"
      }
    },
    {
      id: "3",
      name: "DEF社クラウド移行",
      company: "DEFテクノロジー",
      status: "prospecting",
      progress: 25,
      budget: 3000000,
      startDate: "2024-03-01",
      endDate: "2024-08-31",
      assignedTo: "山田次郎",
      priority: "high",
      description: "オンプレミスからクラウドへの移行",
      isMyCase: true,
      unreadMessages: 5,
      pendingActions: 3,
      nextAction: "緊急会議の設定",
      riskLevel: "high",
      aiSuggestion: {
        status: "未読メール5件、進捗25%",
        action: "緊急会議の設定",
        approval: "－",
        risk: "顧客から問い合わせあり、緊急対応推奨"
      }
    },
    {
      id: "4",
      name: "GHI社セキュリティ強化",
      company: "GHIセキュリティ",
      status: "closed",
      progress: 100,
      budget: 1500000,
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      assignedTo: "田中太郎",
      priority: "medium",
      description: "セキュリティシステムの導入",
      isMyCase: true,
      unreadMessages: 0,
      pendingActions: 0,
      nextAction: "完了報告書作成",
      riskLevel: "low",
      aiSuggestion: {
        status: "完了済み",
        action: "完了報告書作成",
        approval: "－",
        risk: "－"
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospecting': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'prospecting': return 'リード';
      case 'proposal': return '提案中';
      case 'negotiation': return '交渉中';
      case 'closed': return '完了';
      case 'lost': return '失注';
      default: return '不明';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskText = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'high': return '高リスク';
      case 'medium': return '中リスク';
      case 'low': return '低リスク';
      default: return 'リスクなし';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = caseFilter === 'all' || caseItem.isMyCase;
    return matchesSearch && matchesFilter;
  });

  const myCases = cases.filter(c => c.isMyCase);
  const riskCases = myCases.filter(c => c.riskLevel === 'high');
  const pendingActions = myCases.reduce((sum, c) => sum + c.pendingActions, 0);
  const unreadMessages = myCases.reduce((sum, c) => sum + c.unreadMessages, 0);

  const handleNewCase = () => {
    toast.success("新規案件作成画面を開きます（メール起点での作成をお勧めします）");
  };

  const handleViewCase = (caseId: string) => {
    toast.info(`案件ID: ${caseId} の詳細を表示します`);
  };

  const handleEditCase = (caseId: string) => {
    toast.info(`案件ID: ${caseId} を編集します`);
  };

  const handleDeleteCase = (caseId: string) => {
    toast.error(`案件ID: ${caseId} を削除します`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1280px] w-full mx-auto py-4 px-2">
        {/* ヘッダー */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
          <div className="mb-4 lg:mb-0 lg:mr-4 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-[20px] font-bold text-gray-900">案件管理</h1>
                <p className="text-sm text-gray-600">営業案件の一覧と管理</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* 新規案件ボタンは削除 */}
              </div>
            </div>
          </div>
          
          {/* AIのおすすめ */}
          {/* AIのおすすめエリアを削除 */}
        </div>

        {/* 案件フィルタ */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="案件名や会社名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Tabs value={caseFilter} onValueChange={(value) => setCaseFilter(value as 'my' | 'all')} className="w-auto">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="my">自分の案件</TabsTrigger>
                    <TabsTrigger value="all">すべての案件</TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  フィルター
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 案件一覧（カード表示のみ・横一列・高さ抑えめ） */}
        <Card>
          <CardHeader>
            <CardTitle>案件一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 pb-2">
              {filteredCases.map((caseItem) => (
                <Card key={caseItem.id} className="w-full flex flex-col border rounded-2xl shadow-sm bg-white p-0">
                  {/* タイトル＋バッジ */}
                  <div className="flex items-center gap-2 px-5 pt-4 pb-2 rounded-t-2xl bg-white border-b border-gray-100">
                    <span className="text-xl font-extrabold text-gray-900 truncate">{caseItem.name}</span>
                    {caseItem.aiSuggestion && (
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full ml-2">AIおすすめ</span>
                    )}
                  </div>
                  {/* 担当・ステータス・進捗・優先度 */}
                  <div className="text-xs text-gray-600 px-5 pt-2 pb-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>担当：{caseItem.assignedTo}</span>
                    <span>ステータス：{getStatusText(caseItem.status)}</span>
                    <span>進捗：{caseItem.progress}%</span>
                    <span>優先度：{getPriorityText(caseItem.priority)}</span>
                  </div>
                  {/* 未完了タスク・次のアクション */}
                  <div className="text-sm px-5 pt-1 pb-0.5 font-bold text-gray-800">
                    未完了タスク：<span className="font-normal">{caseItem.pendingActions}件{caseItem.nextAction && `（次のアクション：${caseItem.nextAction}）`}</span>
                  </div>
                  {/* 最新のやり取り */}
                  <div className="text-sm px-5 pb-1 font-bold text-gray-800">
                    最新：<span className="font-normal">{caseItem.description}</span>
                  </div>
                  {/* AI提案（4分類） */}
                  {caseItem.aiSuggestion && (
                    <div className="mx-4 my-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 flex flex-col gap-1">
                      <div><span className="font-bold text-blue-800">状況：</span>{caseItem.aiSuggestion.status || "－"}</div>
                      <div><span className="font-bold text-blue-800">アクション：</span>{caseItem.aiSuggestion.action || "－"}</div>
                      <div><span className="font-bold text-blue-800">承認：</span>{caseItem.aiSuggestion.approval || "－"}</div>
                      <div><span className="font-bold text-blue-800">リスク：</span>{caseItem.aiSuggestion.risk || "－"}</div>
                    </div>
                  )}
                  {/* 操作ボタン */}
                  <div className="flex justify-between items-center gap-2 px-5 pb-4 pt-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1 h-8 px-0.5 py-0 text-xs rounded-lg border-gray-300 hover:bg-gray-100 transition" onClick={() => handleViewCase(caseItem.id)}>
                      <Eye className="w-4 h-4 mr-1" />詳細
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1 h-8 px-0.5 py-0 text-xs rounded-lg border-gray-300 hover:bg-blue-50 transition" onClick={() => handleEditCase(caseItem.id)}>
                      <Edit className="w-4 h-4 mr-1" />編集
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 flex items-center justify-center gap-1 h-8 px-0.5 py-0 text-xs rounded-lg border-gray-300 hover:bg-red-50 transition" onClick={() => handleDeleteCase(caseItem.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />削除
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AIチャットボタン */}
      <button
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center"
        onClick={() => toast.info('AIチャットUI（ダミー）を開きます')}
        aria-label="AIに相談"
      >
        <MessageCircle className="w-6 h-6 mr-2" />
        <span className="font-semibold">AIに相談</span>
      </button>
    </div>
  );
} 