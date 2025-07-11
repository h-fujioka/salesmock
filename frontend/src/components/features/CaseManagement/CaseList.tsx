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
    Trash2
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
}

export default function CaseList() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewType, setViewType] = useState<'table' | 'card'>("table");

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
      description: "基幹システムの導入プロジェクト"
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
      description: "年間保守契約の更新"
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
      description: "オンプレミスからクラウドへの移行"
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
      description: "セキュリティシステムの導入"
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

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caseItem.company.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesStatus = selectedStatus === "all" || caseItem.status === selectedStatus;
    return matchesSearch; // && matchesStatus;
  });

  const handleNewCase = () => {
    toast.success("新規案件作成画面を開きます");
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
      <div className="w-full px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
          <div className="mb-4 md:mb-0 md:mr-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[20px] font-bold text-gray-900">案件管理</h1>
                <p className="text-sm text-gray-600">営業案件の一覧と管理</p>
              </div>
              <div className="flex gap-2">
                <Button variant={viewType === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setViewType('table')}>テーブル表示</Button>
                <Button variant={viewType === 'card' ? 'default' : 'outline'} size="sm" onClick={() => setViewType('card')}>カード表示</Button>
                <Button onClick={handleNewCase}>
                  <Plus className="w-4 h-4 mr-2" />
                  新規案件
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-center mb-2">
              <MessageCircle className="w-5 h-5 text-blue-500 mr-2" />
              <span className="font-semibold text-gray-800">AIのおすすめ</span>
            </div>
            <ul className="text-base text-gray-700 space-y-1">
              <li>・リスクが高い案件: <span className="font-bold">DEF社クラウド移行</span></li>
              <li>・未対応アクション: <span className="font-bold">2件</span></li>
              <li>・今日の優先案件: <span className="font-bold">ABC社システム導入</span></li>
            </ul>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総案件数</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">進行中</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cases.filter(c => c.status === 'proposal' || c.status === 'negotiation').length}
              </div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完了案件</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {cases.filter(c => c.status === 'closed').length}
              </div>
              <p className="text-xs text-muted-foreground">+0 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総予算</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ¥{(cases.reduce((sum, c) => sum + c.budget, 0) / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">+20% from last month</p>
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
                    placeholder="案件名や会社名で検索..."
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
                  期間
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 案件一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>案件一覧</CardTitle>
          </CardHeader>
          <CardContent>
            {viewType === 'table' ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="all">全て</TabsTrigger>
                  <TabsTrigger value="prospecting">リード</TabsTrigger>
                  <TabsTrigger value="proposal">提案中</TabsTrigger>
                  <TabsTrigger value="negotiation">交渉中</TabsTrigger>
                  <TabsTrigger value="closed">完了</TabsTrigger>
                  <TabsTrigger value="lost">失注</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>案件名</TableHead>
                        <TableHead>会社名</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead>進捗</TableHead>
                        <TableHead>予算</TableHead>
                        <TableHead>担当者</TableHead>
                        <TableHead>優先度</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCases.map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium flex items-center gap-2 text-base">
                                {caseItem.name}
                                {(caseItem.progress < 30 || caseItem.priority === 'high') && (
                                  <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded ml-1">
                                    <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                                    リスク
                                  </span>
                                )}
                              </div>
                              <div className="text-base text-gray-500">{caseItem.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>{caseItem.company}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(caseItem.status)}>
                              {getStatusText(caseItem.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={caseItem.progress} className="w-20" />
                              <span className="text-sm">{caseItem.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>¥{(caseItem.budget / 10000).toFixed(0)}万</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {caseItem.assignedTo.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-base">{caseItem.assignedTo}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(caseItem.priority)}>
                              {getPriorityText(caseItem.priority)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewCase(caseItem.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCase(caseItem.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCase(caseItem.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                {['prospecting', 'proposal', 'negotiation', 'closed', 'lost'].map((status) => (
                  <TabsContent key={status} value={status} className="mt-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>案件名</TableHead>
                          <TableHead>会社名</TableHead>
                          <TableHead>ステータス</TableHead>
                          <TableHead>進捗</TableHead>
                          <TableHead>予算</TableHead>
                          <TableHead>担当者</TableHead>
                          <TableHead>優先度</TableHead>
                          <TableHead>操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCases
                          .filter(caseItem => caseItem.status === status)
                          .map((caseItem) => (
                            <TableRow key={caseItem.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium flex items-center gap-2 text-base">
                                    {caseItem.name}
                                    {(caseItem.progress < 30 || caseItem.priority === 'high') && (
                                      <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded ml-1">
                                        <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                                        リスク
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-base text-gray-500">{caseItem.description}</div>
                                </div>
                              </TableCell>
                              <TableCell>{caseItem.company}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(caseItem.status)}>
                                  {getStatusText(caseItem.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Progress value={caseItem.progress} className="w-20" />
                                  <span className="text-sm">{caseItem.progress}%</span>
                                </div>
                              </TableCell>
                              <TableCell>¥{(caseItem.budget / 10000).toFixed(0)}万</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="text-xs">
                                      {caseItem.assignedTo.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-base">{caseItem.assignedTo}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={getPriorityColor(caseItem.priority)}>
                                  {getPriorityText(caseItem.priority)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewCase(caseItem.id)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCase(caseItem.id)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCase(caseItem.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCases.map((caseItem) => (
                  <Card key={caseItem.id} className="p-4 flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold">{caseItem.name}</span>
                      {(caseItem.progress < 30 || caseItem.priority === 'high') && (
                        <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded ml-1">
                          <AlertCircle className="w-3 h-3 mr-1 text-red-500" />
                          リスク
                        </span>
                      )}
                    </div>
                    <div className="text-base text-gray-500 mb-1">{caseItem.description}</div>
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <Badge className={getStatusColor(caseItem.status)}>{getStatusText(caseItem.status)}</Badge>
                      <Badge className={getPriorityColor(caseItem.priority)}>{getPriorityText(caseItem.priority)}</Badge>
                      <span className="text-xs text-gray-500">進捗: {caseItem.progress}%</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">{caseItem.assignedTo.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-base">{caseItem.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {caseItem.startDate} ~ {caseItem.endDate}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <DollarSign className="w-4 h-4 mr-1" />
                      予算: ¥{(caseItem.budget / 10000).toFixed(0)}万
                    </div>
                    {/* AI提案・次のアクション例 */}
                    <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-900">
                      <span className="font-semibold">AI提案:</span> 次のアクションは「顧客へ進捗報告メールを送信」です。
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewCase(caseItem.id)}>
                        <Eye className="w-4 h-4 mr-1" /> 詳細
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditCase(caseItem.id)}>
                        <Edit className="w-4 h-4 mr-1" /> 編集
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCase(caseItem.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> 削除
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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