'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    AlertTriangle,
    Bell,
    CheckCircle,
    Clock,
    Mail,
    MessageCircle,
    TrendingUp
} from 'lucide-react';
import React from 'react';

interface Task {
  id: string;
  title: string; // タスク名
  project: string; // 案件名
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  description?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  timestamp: string;
}

interface HomePageProps {
  onShowAllTasks?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onShowAllTasks }) => {
  // const [activeTab, setActiveTab] = useState('overview');

  // モックデータ
  const tasks: Task[] = [
    {
      id: '1',
      title: 'サービス説明資料送付',
      project: 'X社 クラウド契約管理サービス新規導入相談',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-07-12',
      description: '新規導入相談に対する資料送付'
    },
    {
      id: '2',
      title: '契約書ファイル受領確認',
      project: 'Y社 契約書レビュー依頼',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2024-07-13',
      description: '契約書レビュー依頼のファイル確認'
    },
    {
      id: '3',
      title: 'オプション説明資料送付',
      project: 'Z社 電子署名オプション追加相談',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-07-10',
      description: '電子署名オプション追加相談への対応'
    }
  ];

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'info',
      message: 'A社から契約書表示不具合のサポート依頼が届きました',
      timestamp: '09:30'
    },
    {
      id: '2',
      type: 'warning',
      message: 'Y社のレビュー結果フィードバックが遅延しています',
      timestamp: '08:50'
    },
    {
      id: '3',
      type: 'success',
      message: 'Z社のオプション説明資料送付が完了しました',
      timestamp: '08:20'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  // 優先度の日本語変換関数
  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '';
    }
  };

  // ダッシュボード用ダミーデータ
  const dashboard = {
    todayEvents: 2,
    unreadMails: 3,
    newProjects: 1,
    risks: [
      'A社 契約書表示不具合サポート'
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー削除済み */}
      <div className="max-w-[1280px] w-full mx-auto py-8 px-2">
        {/* 4エリアレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
          {/* 状況確認エリア */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span>状況確認</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="mb-2 flex flex-wrap gap-4 text-sm text-gray-700">
                <span>今日の予定：<span className="font-bold">{dashboard.todayEvents}件</span></span>
                <span>未読メール：<span className="font-bold">{dashboard.unreadMails}件</span></span>
                <span>新着案件：<span className="font-bold">{dashboard.newProjects}件</span></span>
              </div>
              <Separator className="mb-2" />
              <div className="mb-2 text-sm text-gray-700">
                進行中の案件（3件）
                <ul className="list-disc ml-5 mt-1">
                  <li>X社 クラウド契約管理サービス新規導入相談</li>
                  <li>Y社 契約書レビュー依頼</li>
                  <li>Z社 電子署名オプション追加相談</li>
                </ul>
              </div>
              <Separator className="mb-2" />
              <div className="text-sm text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                リスク案件：{dashboard.risks.join('、')}
              </div>
            </CardContent>
          </Card>

          {/* 次のアクションエリア */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span>次のアクション</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(task.status)}
                        <span className="text-xs text-gray-500">
                          {task.status === 'pending' && '未着手'}
                          {task.status === 'in-progress' && '進行中'}
                          {task.status === 'completed' && '完了'}
                        </span>
                      </div>
                      <div className="font-medium text-gray-900 truncate text-base leading-tight">{task.title}</div>
                      <div className="text-xs text-gray-500 truncate mb-1">{task.project}</div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-full min-w-[60px]">
                      <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
                      <span className="text-xs text-gray-400 mt-2">{task.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={onShowAllTasks}>
                すべてのタスクを表示
              </Button>
            </CardContent>
          </Card>

          {/* 承認・確認エリア */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span>承認・確認</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">承認待ち</span>
                  </div>
                  <p className="text-sm text-yellow-700">Z社 契約書改定案 社内承認待ち</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">確認必要</span>
                  </div>
                  <p className="text-sm text-blue-700">X社 導入見積書 社内レビュー</p>
                </div>
                <Button variant="outline" className="w-full">
                  承認・確認一覧
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 補完・リスク管理エリア */}
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span>補完・リスク管理</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-1">
              <div className="flex gap-2 mb-2">
                <div className="flex-1 flex flex-col items-center justify-center bg-red-50 rounded-md py-2">
                  <span className="text-lg font-bold text-red-600 leading-none">1</span>
                  <span className="text-xs text-red-700 leading-none">リスク案件</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center bg-green-50 rounded-md py-2">
                  <span className="text-lg font-bold text-green-600 leading-none">2</span>
                  <span className="text-xs text-green-700 leading-none">フォローアップ</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-1">
                <span className="text-xs text-gray-500">リスク・未対応</span>
                <span className="text-xs text-gray-700 font-semibold">A社 契約書表示不具合サポート</span>
                <span className="text-xs text-gray-500">遅延</span>
                <span className="text-xs text-gray-700 font-semibold">Y社 レビュー結果フィードバック</span>
              </div>
              <Button variant="outline" className="w-full text-xs py-1 h-7 mt-1">
                リスク管理ダッシュボード
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 通知エリア */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <span>最新の通知</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.type === 'info' ? 'bg-blue-500' :
                      notification.type === 'warning' ? 'bg-yellow-500' :
                      notification.type === 'success' ? 'bg-green-500' :
                      'bg-red-500'
                    }`} />
                    <span className="text-sm text-gray-900">{notification.message}</span>
                  </div>
                  <span className="text-xs text-gray-500">{notification.timestamp}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage; 