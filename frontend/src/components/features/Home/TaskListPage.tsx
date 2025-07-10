"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, CheckCircle, Clock, Plus, Search } from "lucide-react";
import React, { useState } from "react";

interface Task {
  id: string;
  title: string;
  project: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

const priorities = ["high", "medium", "low"] as const;
const statuses = ["pending", "in-progress", "completed"] as const;
const projects = [
  "X社 クラウド契約管理サービス新規導入相談",
  "Y社 契約書レビュー依頼",
  "Z社 電子署名オプション追加相談",
  "A社 サポート依頼",
  "B社 新規提案",
  "C社 契約更新手続き"
];

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

const initialTasks: Task[] = Array.from({ length: 100 }, (_, i) => {
  const idx = i + 1;
  return {
    id: String(idx),
    title: taskNames[i % taskNames.length],
    project: projects[idx % projects.length],
    dueDate: `2024-07-${String((idx % 28) + 1).padStart(2, '0')}`,
    priority: priorities[idx % priorities.length],
    status: statuses[idx % statuses.length],
  };
});

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "high":
      return "高";
    case "medium":
      return "中";
    case "low":
      return "低";
    default:
      return "";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-blue-600" />;
    case "pending":
      return <AlertTriangle className="w-4 h-4 text-orange-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "完了";
    case "in-progress":
      return "進行中";
    case "pending":
      return "未着手";
    default:
      return "";
  }
};

const TaskListPage: React.FC = () => {
  const [tasks] = useState<Task[]>(initialTasks);
  const [selaInput, setSelaInput] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("");

  // フィルタ・検索適用
  const filteredTasks = tasks.filter((task) => {
    return (
      (!search || task.title.includes(search) || task.project.includes(search)) &&
      (!filterStatus || task.status === filterStatus) &&
      (!filterPriority || task.priority === filterPriority)
    );
  });

  return (
    <div className="max-w-[1280px] w-full mx-auto py-8 px-2">
      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-4">タスク管理</h1>

      {/* Sela対話エリア */}
      {/* Cardごと削除 */}

      {/* 4エリアサマリー（状況確認・次のアクション・承認・補完） */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* 状況確認 */}
        <Card>
          <div className="p-4">
            <div className="font-semibold mb-2 flex items-center gap-2"><span role='img' aria-label='状況'>📊</span>状況確認</div>
            <div className="mb-2"><span className="font-bold">5/8</span> タスク完了</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '62%'}}></div>
            </div>
            <div className="text-xs text-gray-500">未読: 2件</div>
          </div>
        </Card>
        {/* 次のアクション */}
        <Card>
          <div className="p-4">
            <div className="font-semibold mb-2 flex items-center gap-2"><span role='img' aria-label='アクション'>🔥</span>次のアクション</div>
            <div className="font-bold text-red-600 mb-1">A社へ緊急連絡</div>
            <div className="text-xs text-gray-500">期限: 今日17時</div>
            <div className="text-xs text-gray-500">B社提案書作成（明日）</div>
          </div>
        </Card>
        {/* 承認・確認 */}
        <Card>
          <div className="p-4">
            <div className="font-semibold mb-2 flex items-center gap-2"><span role='img' aria-label='承認'>✅</span>承認・確認</div>
            <div>承認待ち: 見積書(D社)</div>
            <Button size="sm" variant="outline" className="mt-2">承認画面へ</Button>
          </div>
        </Card>
        {/* 補完・リスク管理 */}
        <Card>
          <div className="p-4">
            <div className="font-semibold mb-2 flex items-center gap-2"><span role='img' aria-label='リスク'>🔍</span>補完・リスク</div>
            <div className="text-red-500 mb-1">期限切れ: 1件</div>
            <div className="text-xs text-gray-500">AI提案あり</div>
          </div>
        </Card>
      </div>

      {/* 検索・フィルタバー（タスク一覧の直上に移動） */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="タスク名・案件名で検索"
          className="w-48"
        />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">ステータス</option>
          <option value="pending">未着手</option>
          <option value="in-progress">進行中</option>
          <option value="completed">完了</option>
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="">優先度</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
        <Button variant="outline" size="icon">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* タスク一覧（常に表示） */}
      <div className="space-y-3 mb-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getStatusIcon(task.status)}
                <span className="text-xs text-gray-500">{getStatusLabel(task.status)}</span>
              </div>
              <div className="font-medium text-gray-900 truncate text-base leading-tight">{task.title}</div>
              <div className="text-xs text-gray-500 truncate mb-1">{task.project}</div>
            </div>
            <div className="flex flex-col items-end justify-between h-full min-w-[60px]">
              <Badge className={getPriorityColor(task.priority)}>{getPriorityLabel(task.priority)}</Badge>
              <span className="text-xs text-gray-400 mt-2">{task.dueDate}</span>
            </div>
          </Card>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">タスクがありません</div>
        )}
      </div>

      {/* 新規タスク追加ボタン */}
      <Button variant="default" className="w-full" size="lg">
        <Plus className="w-4 h-4 mr-2" /> 新規タスク追加
      </Button>
    </div>
  );
};

export default TaskListPage; 