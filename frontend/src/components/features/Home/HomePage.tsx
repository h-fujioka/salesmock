'use client';

import { cn } from '@/lib/utils';
import {
    AlertTriangle,
    CheckCircle,
    Clock
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

type AreaKey = 'status' | 'action' | 'approval' | 'risk';
interface Item {
  id: string;
  type: string;
  title: string;
  desc: string;
  due: string;
  priority: string;
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

  const areaTabs: { key: AreaKey; label: string }[] = [
    { key: 'status', label: '状況確認' },
    { key: 'action', label: '次のアクション' },
    { key: 'approval', label: '承認・確認' },
    { key: 'risk', label: 'リスク管理' },
  ];

  // mockItemsのstatusエリアから進捗・未読メール・リスク案件・KPIを削除
  const mockItems: Record<AreaKey, Item[]> = {
    status: [], // 状況確認タブでのみ表示するため空に
    action: [
      { id: '5', type: '優先', title: 'B社 契約書レビュー', desc: '本日17時が法的締切', due: '今日17時', priority: '高' },
      { id: '6', type: '次点', title: 'C社 提案書ドラフト作成', desc: '明日までに提出', due: '明日', priority: '中' },
      { id: '7', type: '予定', title: 'D社 顧問契約更新フォロー', desc: '今週中に連絡', due: '今週中', priority: '低' },
    ],
    approval: [
      { id: '8', type: '承認待ち', title: 'AI自動生成議事録（3件）', desc: 'A社定例、B社交渉、社内会議の議事録', due: '本日', priority: '中' },
      { id: '9', type: '確認中', title: 'A社 見積書（法務チェック中）', desc: 'A社の見積書が法務部でチェック中', due: '明日', priority: '中' },
      { id: '10', type: 'レビュー', title: 'E社 NDAドラフト（品質チェック依頼）', desc: 'E社のNDAドラフトが品質管理部門でレビュー依頼中', due: '今週中', priority: '低' },
    ],
    risk: [
      { id: '11', type: '見逃しリスク', title: 'F社 フォローアップ（5日未連絡）', desc: 'F社へのフォローアップが5日間未連絡', due: '至急', priority: '高' },
      { id: '12', type: '改善提案', title: '契約書レビューのAI自動化を推奨', desc: 'Selaが契約書レビュー業務のAI自動化を提案', due: '-', priority: '中' },
      { id: '13', type: '自動実行', title: '明日の定例会議アジェンダ自動生成済み', desc: 'AIが明日の定例会議アジェンダを自動生成済み', due: '明日', priority: '低' },
    ],
  };

  const [activeTab, setActiveTab] = React.useState<AreaKey>('status');
  const items = mockItems[activeTab];

  // 状況確認タブ用データ
  const statusTabs = [
    { key: 'progress', label: '進捗' },
    { key: 'mail', label: '未読メール' },
    { key: 'risk', label: 'リスク' },
    { key: 'kpi', label: 'KPI' },
  ];
  const [activeStatusTab, setActiveStatusTab] = React.useState('progress');
  const statusTabData: Record<string, { title: string; desc: string; value: string; badgeColor?: string }> = {
    progress: {
      title: '今日の進捗',
      desc: '契約書作成、会議参加、メール返信など10件完了',
      value: '10/10タスク完了（100%）',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    mail: {
      title: '未読メール',
      desc: 'B社：至急 契約書レビュー依頼',
      value: '2件（重要:1件）',
      badgeColor: 'bg-red-100 text-red-700',
    },
    risk: {
      title: 'リスク案件',
      desc: 'B社の契約書レビューが期限切れ',
      value: '1件',
      badgeColor: 'bg-yellow-100 text-yellow-800',
    },
    kpi: {
      title: '受注見込み',
      desc: '今月目標1,500万円のうち80%達成',
      value: '1,200万円（今月目標の80%）',
      badgeColor: 'bg-green-100 text-green-700',
    },
  };

  const badgeColor = (type: string) => {
    switch (type) {
      case '要承認': return 'bg-red-100 text-red-600 border border-red-200';
      case '確認待ち': return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case '通知': return 'bg-orange-100 text-orange-700 border border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };
  const priorityColor = (priority: string) => {
    switch (priority) {
      case '高': return 'text-red-600 font-bold';
      case '中': return 'text-yellow-700 font-bold';
      case '低': return 'text-green-700 font-bold';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="w-full px-8 py-8">
        {/* 4エリアタブ（カード型・横並び） */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {areaTabs.map(tab => (
            <button
              key={tab.key}
              className={cn(
                'rounded-xl px-6 py-2 text-center font-semibold border transition-all flex flex-col items-center shadow-sm hover:shadow-md',
                activeTab === tab.key
                  ? 'bg-white border-blue-500 text-blue-700 ring-2 ring-blue-100'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              <span className="flex items-center gap-2 text-base">
                {tab.label}
                <span className="ml-1 text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-normal">
                  {mockItems[tab.key].length}件未対応
                </span>
              </span>
            </button>
          ))}
        </div>
        {/* 状況確認エリアのタブ切り替え（カード型UIで表示） */}
        {activeTab === 'status' && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <div className="flex gap-4 mb-4">
              {statusTabs.map(tab => (
                <button
                  key={tab.key}
                  className={cn(
                    'px-5 py-2 rounded-full text-base font-semibold transition',
                    activeStatusTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                  )}
                  onClick={() => setActiveStatusTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* カード型UIで表示 */}
            <div className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#fcfcfd] shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full border bg-gray-100 text-gray-700 border-gray-200">{statusTabs.find(t => t.key === activeStatusTab)?.label}</span>
                </div>
                <div className="font-semibold text-gray-900 truncate text-base leading-tight mb-1">{statusTabData[activeStatusTab].title}{statusTabData[activeStatusTab].value && <span className={cn('ml-2 text-base font-bold px-3 py-1 rounded-full', statusTabData[activeStatusTab].badgeColor)}>{statusTabData[activeStatusTab].value}</span>}</div>
                <div className="text-sm text-gray-500 truncate mb-1">{statusTabData[activeStatusTab].desc}</div>
              </div>
            </div>
          </div>
        )}
        {/* 未対応事項リスト＋タブ（statusエリアは削除） */}
        {activeTab !== 'status' && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex gap-2 mb-4">
              <button className="px-4 py-1 rounded-full bg-gray-200 text-base font-semibold hover:bg-blue-100 transition">全て</button>
              <button className="px-4 py-1 rounded-full bg-gray-200 text-base font-semibold hover:bg-blue-100 transition">要承認</button>
              <button className="px-4 py-1 rounded-full bg-gray-200 text-base font-semibold hover:bg-blue-100 transition">確認待ち</button>
              <button className="px-4 py-1 rounded-full bg-gray-200 text-base font-semibold hover:bg-blue-100 transition">通知</button>
            </div>
            <div className="space-y-4">
              {items.map((item: Item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#fcfcfd] hover:shadow-md transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border', badgeColor(item.type))}>{item.type}</span>
                      <span className="text-sm text-gray-400">期限: {item.due}</span>
                    </div>
                    <div className="font-semibold text-gray-900 truncate text-base leading-tight mb-1">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate mb-1">{item.desc}</div>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full min-w-[100px] gap-2">
                    <span className={cn('text-base', priorityColor(item.priority))}>優先度: {item.priority}</span>
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-1 rounded-lg border border-gray-300 bg-white text-base font-semibold hover:bg-gray-100 transition">詳細</button>
                      <button className="px-4 py-1 rounded-lg bg-blue-600 text-white text-base font-semibold hover:bg-blue-700 transition">対応</button>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-center text-gray-400 text-base py-8">未対応事項はありません</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage; 