"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    Eye,
    Filter,
    MessageSquare,
    Plus,
    Search,
    Tag,
    Target
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  dueDate: string;
  caseId?: string;
  caseName?: string;
  tags: string[];
  comments: number;
}

export default function TaskList() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedPriority, setSelectedPriority] = useState("all");

  const priorities = ["high", "medium", "low", "urgent"] as const;
  const statuses = ["todo", "in-progress", "review", "completed"] as const;
  // const projects = [
  //   "X社 クラウド契約管理サービス新規導入相談",
  //   "Y社 契約書レビュー依頼",
  //   "Z社 電子署名オプション追加相談",
  //   "A社 サポート依頼",
  //   "B社 新規提案",
  //   "C社 契約更新手続き"
  // ];
  const taskNames = [
    "見積書作成・送付",
    "契約書ドラフト作成",
    "契約書レビュー",
    "顧客への提案資料作成",
    "新規リードへの初回アプローチ",
    "既存顧客へのフォローアップ",
    "サービス導入スケジュール調整",
    "社内承認申請",
    "顧客からの問い合わせ対応",
    "契約更新案内送付",
    "サポート依頼対応",
    "競合調査・レポート作成",
    "顧客満足度アンケート送付",
    "請求書発行",
    "デモ日程調整",
    "進捗報告書作成",
    "導入トレーニング資料作成",
    "導入後フォローアップコール",
    "アップセル提案準備",
    "顧客ヒアリング実施",
    "社内ミーティング準備",
    "顧客要望ヒアリング",
    "導入事例インタビュー依頼",
    "契約締結手続き",
    "納品スケジュール調整",
    "請求内容確認",
    "顧客情報更新",
    "新サービス案内メール作成",
    "導入効果レポート作成",
    "サポートFAQ更新",
    "顧客満足度集計",
    "リード情報精査",
    "展示会招待メール送付",
    "ウェビナー案内作成",
    "導入マニュアル送付",
    "契約内容確認",
    "社内稟議資料作成",
    "顧客課題ヒアリング",
    "アップデート案内メール作成",
    "導入前QA対応",
    "顧客訪問日程調整",
    "導入後アンケート送付",
    "サポートチケット対応",
    "新規案件リサーチ",
    "顧客担当者変更対応",
    "契約満了案内送付",
    "導入現地調査手配",
    "顧客要望整理",
    "社内共有資料作成",
    "導入後レビュー依頼",
    "アップセル提案書作成",
    "顧客向けFAQ作成",
    "導入後サポート案内",
    "契約書押印手配",
    "請求先情報確認",
    "顧客満足度ヒアリング",
    "新機能案内メール作成",
    "導入後トラブル対応",
    "顧客向け操作説明会準備",
    "導入後定期フォロー",
    "契約書原本送付",
    "顧客要望フィードバック",
    "導入後アンケート集計",
    "アップセル提案ミーティング",
    "顧客向け導入事例送付",
    "契約内容変更手続き",
    "請求書再発行対応",
    "顧客向けアップデート説明",
    "導入後サポート満足度調査",
    "新規リード情報登録",
    "顧客向けFAQ案内",
    "導入後トラブルヒアリング",
    "顧客向け操作マニュアル作成",
    "導入後定期レポート作成",
    "契約書電子化対応",
    "顧客向けアップセル案内",
    "導入後サポートQA対応",
    "顧客向け導入効果報告",
    "契約書内容精査",
    "請求書内容確認",
    "顧客向け新サービス案内",
    "導入後サポート体制案内",
    "アップセル提案内容確認",
    "顧客向け導入後アンケート",
    "契約書修正対応",
    "請求書送付手配",
    "顧客向け導入後QA対応",
    "導入後サポート満足度集計",
    "新規案件情報共有",
    "顧客向けFAQ更新案内",
    "導入後トラブルレポート作成",
    "顧客向け操作説明動画作成",
    "導入後定期ミーティング調整",
    "契約書電子署名手配",
    "請求書内容修正",
    "顧客向けアップセル提案書送付",
    "導入後サポートQA集計",
    "顧客向け導入事例案内",
    "契約書内容確認・修正",
    "請求書送付先確認",
    "顧客向け導入後サポート案内"
  ];
  const assignedTos = ["田中太郎", "佐藤花子", "山田次郎", "鈴木一郎", "高橋美咲"];
  const caseNames = [
    "ABC社システム導入",
    "XYZ社保守契約",
    "DEF社クラウド移行",
    "GHI社セキュリティ強化",
    "JKL社新規導入"
  ];
  const tagsList = [
    ["提案書", "システム導入"],
    ["契約書", "レビュー"],
    ["ヒアリング", "準備"],
    ["進捗報告", "完了"],
    ["リサーチ", "新規案件"]
  ];
  const tasks: Task[] = Array.from({ length: 100 }, (_, i) => {
    const idx = i + 1;
    return {
      id: String(idx),
      title: taskNames[i % taskNames.length],
      description: `${taskNames[i % taskNames.length]}の対応`,
      status: statuses[i % statuses.length],
      priority: priorities[i % priorities.length],
      assignedTo: assignedTos[i % assignedTos.length],
      dueDate: `2024-07-${String((idx % 28) + 1).padStart(2, '0')}`,
      caseId: String((i % 5) + 1),
      caseName: caseNames[i % caseNames.length],
      tags: tagsList[i % tagsList.length],
      comments: (i % 4),
    };
  });

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'todo': return 'bg-gray-100 text-gray-800';
  //     case 'in-progress': return 'bg-blue-100 text-blue-800';
  //     case 'review': return 'bg-yellow-100 text-yellow-800';
  //     case 'completed': return 'bg-green-100 text-green-800';
  //     default: return 'bg-gray-100 text-gray-800';
  //   }
  // };

  // const getStatusText = (status: string) => {
  //   switch (status) {
  //     case 'todo': return '未着手';
  //     case 'in-progress': return '進行中';
  //     case 'review': return 'レビュー中';
  //     case 'completed': return '完了';
  //     default: return '不明';
  //   }
  // };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };

  const getStatusTasks = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleNewTask = () => {
    toast.success("新規タスク作成画面を開きます");
  };

  const handleViewTask = (taskId: string) => {
    toast.info(`タスクID: ${taskId} の詳細を表示します`);
  };

  const handleEditTask = (taskId: string) => {
    toast.info(`タスクID: ${taskId} を編集します`);
  };

  // const handleDeleteTask = (taskId: string) => {
  //   toast.error(`タスクID: ${taskId} を削除します`);
  // };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1280px] w-full mx-auto py-8 px-2">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">タスク管理</h1>
              <p className="text-gray-600">カンバンボード形式でのタスク管理</p>
            </div>
            <Button onClick={handleNewTask}>
              <Plus className="w-4 h-4 mr-2" />
              新規タスク
            </Button>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総タスク数</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <p className="text-xs text-muted-foreground">+3 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">進行中</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">+1 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完了済み</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">期限超過</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter(t => isOverdue(t.dueDate)).length}
              </div>
              <p className="text-xs text-muted-foreground">要対応</p>
            </CardContent>
          </Card>
        </div>

        {/* 検索・フィルター */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="タスク名で検索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  フィルター
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  期限
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* カンバンボード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 未着手 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>未着手</span>
                <Badge variant="secondary">{getStatusTasks('todo').length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {getStatusTasks('todo').map((task) => (
                    <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm">{task.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTask(task.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {task.assignedTo.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{task.assignedTo}</span>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                        
                        {task.caseName && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.caseName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                              {task.dueDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.comments}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 進行中 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>進行中</span>
                <Badge variant="secondary">{getStatusTasks('in-progress').length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {getStatusTasks('in-progress').map((task) => (
                    <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm">{task.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTask(task.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {task.assignedTo.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{task.assignedTo}</span>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                        
                        {task.caseName && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.caseName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                              {task.dueDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.comments}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* レビュー中 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>レビュー中</span>
                <Badge variant="secondary">{getStatusTasks('review').length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {getStatusTasks('review').map((task) => (
                    <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm">{task.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTask(task.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {task.assignedTo.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{task.assignedTo}</span>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                        
                        {task.caseName && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.caseName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                              {task.dueDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.comments}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 完了 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>完了</span>
                <Badge variant="secondary">{getStatusTasks('completed').length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {getStatusTasks('completed').map((task) => (
                    <Card key={task.id} className="p-3 hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-sm">{task.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTask(task.id)}
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {task.assignedTo.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">{task.assignedTo}</span>
                          </div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                        </div>
                        
                        {task.caseName && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.caseName}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
                              {task.dueDate}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.comments}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 