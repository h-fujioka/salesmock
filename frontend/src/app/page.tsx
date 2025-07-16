"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Calendar, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { FileSpreadsheet, Search, Send, PenLine } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import fs from "fs";

function Header() {
  return (
    <header className="h-16 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
      <span className="text-xl font-bold tracking-tight">SalesOn ダッシュボード</span>
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

type Suggestion = { icon: string; title: string; url: string };
export default function Home() {
  const [command, setCommand] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // 新規追加: フォローアップメール用の状態
  const [followupCandidates, setFollowupCandidates] = useState<any[] | null>(null);
  const [mailPreview, setMailPreview] = useState<string | null>(null);
  // ApprovalStep型を拡張
  const [approvalStep, setApprovalStep] = useState<"none" | "search_results" | "select_recipients" | "preview_mail" | "sent">("none");
  // 送信先選択用の状態
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([0,1,2]); // デフォルト全選択
  // 全選択・個別選択ハンドラ
  const handleSelectAll = (checked: boolean) => {
    setSelectedRecipients(checked ? followupCandidates?.map((_, i) => i) ?? [] : []);
  };
  const handleSelectOne = (idx: number, checked: boolean) => {
    setSelectedRecipients(prev => checked ? [...prev, idx] : prev.filter(i => i !== idx));
  };

  const handleSend = () => {
    setAiResponse("");
    setSuggestions([]);
    setFollowupCandidates(null);
    setMailPreview(null);
    setApprovalStep("none");
    if (command.includes("フォローアップメール")) {
      const candidates = [
        { name: "A社（田中様）", lastContact: "2024/06/20", project: "新製品提案", reason: "2週間連絡なし" },
        { name: "B社（佐藤様）", lastContact: "2024/06/15", project: "保守契約更新", reason: "更新案内未返信" },
        { name: "C社（鈴木様）", lastContact: "2024/06/10", project: "導入サポート", reason: "初回提案後フォロー未実施" },
      ];
      setFollowupCandidates(candidates);
      setMailPreview(
        `件名: ご無沙汰しております（${candidates[0].name}様）\n\n${candidates[0].name}様\n\nお世話になっております。\n前回ご提案後、ご不明点や追加のご要望などございませんでしょうか？\nご返信をお待ちしております。\n\nSalesOnチーム`
      );
      setApprovalStep("search_results");
      setCommand("");
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
  };

  const handleClear = () => {
    setAiResponse("");
    setSuggestions([]);
    setFollowupCandidates(null);
    setMailPreview(null);
    setApprovalStep("none");
  };

  // フォローアップメール承認処理
  const handleApprove = () => {
    setApprovalStep("sent");
  };
  // フォローアップメール修正処理（今回はダミーでリセット）
  const handleEdit = () => {
    setApprovalStep("none");
    setFollowupCandidates(null);
    setMailPreview(null);
  };

  // Data Table用カラム定義
  const taskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "task", header: "タスク名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "project", header: "関連案件", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "daysLeft", header: "残り日数", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "status", header: "ステータス", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "auto", header: "AI/手動", cell: info => <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span> },
    { accessorKey: "approval", header: "承認待ち", cell: info => info.getValue() ? <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">{info.getValue()}</span> : null },
    { id: "detail", header: "", cell: () => <Button size="sm" variant="outline">詳細</Button> },
  ];
  // Data Table用ダミーデータ
  const taskData = [
    { task: "顧客Aへ見積送付", project: "A社案件", customerType: "新規", priority: "高", deadline: "2024/07/10", daysLeft: "3日", status: "進行中", auto: "AI自動", approval: "承認待ち" },
    { task: "商談Bの準備", project: "B社案件", customerType: "既存", priority: "中", deadline: "2024/07/12", daysLeft: "1日", status: "未着手", auto: "手動", approval: "" },
    { task: "C社 提案書ドラフト作成", project: "C社新規案件", customerType: "新規", priority: "高", deadline: "2024/07/15", daysLeft: "2日", status: "進行中", auto: "AI自動", approval: "" },
    { task: "D社 定例会議準備", project: "D社サポート案件", customerType: "既存", priority: "中", deadline: "2024/07/13", daysLeft: "0日", status: "進行中", auto: "手動", approval: "" },
    { task: "E社 契約書レビュー", project: "E社更新案件", customerType: "既存", priority: "高", deadline: "2024/07/09", daysLeft: "1日", status: "完了", auto: "AI自動", approval: "" },
    { task: "F社 サポート対応", project: "F社サポート案件", customerType: "既存", priority: "低", deadline: "2024/07/20", daysLeft: "0日", status: "未着手", auto: "手動", approval: "" },
    { task: "G社 進捗報告作成", project: "G社大型案件", customerType: "新規", priority: "高", deadline: "2024/07/11", daysLeft: "0日", status: "進行中", auto: "AI自動", approval: "承認待ち" },
    { task: "H社 顧客ヒアリング", project: "H社新規案件", customerType: "新規", priority: "中", deadline: "2024/07/18", daysLeft: "0日", status: "進行中", auto: "手動", approval: "" },
    { task: "I社 サービス説明資料作成", project: "I社新規案件", customerType: "新規", priority: "低", deadline: "2024/07/22", daysLeft: "0日", status: "未着手", auto: "AI自動", approval: "" },
    { task: "J社 受注処理", project: "J社大型案件", customerType: "新規", priority: "高", deadline: "2024/07/14", daysLeft: "0日", status: "進行中", auto: "手動", approval: "承認待ち" },
  ];

  // Data Table用カラム定義（リスク案件）
  const riskColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "customer", header: "顧客名", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "deadline", header: "期限", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span> },
    { accessorKey: "progress", header: "進捗", cell: info => {
      const value = info.getValue() as unknown;
      const { percent, color } = value as { percent: number, color: string };
      return (
        <div className="w-32">
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
          </div>
          <span className="text-xs text-gray-500 ml-1">{percent}%</span>
        </div>
      );
    } },
    { accessorKey: "risk", header: "リスク内容", cell: info => {
      const value = info.getValue();
      if (typeof value === "string") {
        return <span className={`font-normal ${value.includes('超過') ? 'text-red-600' : value.includes('遅延') ? 'text-yellow-600' : 'text-red-600'}`}>{value}</span>;
      }
      return <span className="font-normal">{value}</span>;
    } },
    { id: "detail", header: "", cell: () => <Button size="sm" variant="outline">詳細</Button> },
  ];
  // Data Table用ダミーデータ（リスク案件）
  const riskData = [
    { project: "新製品導入プロジェクト", customer: "株式会社みらいテック", customerType: "新規", deadline: "2024/07/10", priority: "高", progress: { percent: 80, color: "bg-blue-500" }, risk: "期限超過" },
    { project: "システム更改案件", customer: "東都情報サービス株式会社", customerType: "既存", deadline: "2024/07/12", priority: "中", progress: { percent: 40, color: "bg-blue-400" }, risk: "進捗遅延" },
    { project: "海外展開サポート", customer: "グローバル商事株式会社", customerType: "新規", deadline: "2024/07/15", priority: "高", progress: { percent: 20, color: "bg-blue-300" }, risk: "顧客要望未対応" },
    { project: "契約更新交渉", customer: "日本エネルギー株式会社", customerType: "既存", deadline: "2024/07/18", priority: "中", progress: { percent: 60, color: "bg-blue-500" }, risk: "承認遅延" },
    { project: "新規サービス提案", customer: "株式会社さくらネット", customerType: "新規", deadline: "2024/07/20", priority: "高", progress: { percent: 50, color: "bg-blue-400" }, risk: "顧客連絡途絶" },
    { project: "サポート契約見直し", customer: "西日本物流株式会社", customerType: "既存", deadline: "2024/07/22", priority: "低", progress: { percent: 10, color: "bg-blue-200" }, risk: "資料未提出" },
    { project: "定例会議準備", customer: "株式会社アーバン開発", customerType: "新規", deadline: "2024/07/25", priority: "高", progress: { percent: 30, color: "bg-blue-300" }, risk: "会議資料遅延" },
    { project: "導入支援プロジェクト", customer: "株式会社グリーンファーム", customerType: "新規", deadline: "2024/07/28", priority: "中", progress: { percent: 15, color: "bg-blue-200" }, risk: "要件不明確" },
    { project: "業務改善提案", customer: "株式会社エコライフ", customerType: "既存", deadline: "2024/07/30", priority: "高", progress: { percent: 55, color: "bg-blue-400" }, risk: "承認保留" },
    { project: "新規取引先開拓", customer: "株式会社フューチャーリンク", customerType: "新規", deadline: "2024/08/02", priority: "中", progress: { percent: 10, color: "bg-blue-200" }, risk: "初回連絡未完了" },
  ];

  // Data Table用カラム定義（AI提案の承認）
  const aiColumns: ColumnDef<any, React.ReactNode>[] = [
    { accessorKey: "project", header: "案件名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "customerType", header: "顧客区分", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "proposal", header: "提案内容", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "priority", header: "優先度", cell: info => <span className={`text-black rounded px-2 py-0.5 font-normal ${info.getValue()==='高' ? 'bg-gray-200' : info.getValue()==='中' ? 'bg-gray-100' : 'bg-gray-200'}`}>{info.getValue()}</span> },
    { accessorKey: "last", header: "前回実行", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { id: "detail", header: "", cell: () => <Button size="sm" variant="outline">詳細</Button> },
  ];
  // Data Table用ダミーデータ（AI提案の承認）
  const aiData = [
    { project: "新製品導入プロジェクト", customerType: "新規", proposal: "顧客Aにフォローアップメール送信", priority: "高", last: "初回提案済み" },
    { project: "システム更改案件", customerType: "既存", proposal: "B社に技術資料を追加送付", priority: "中", last: "基本提案書送付済み" },
    { project: "海外展開サポート", customerType: "新規", proposal: "C社に現地パートナー紹介", priority: "高", last: "初期ヒアリング完了" },
    { project: "契約更新交渉", customerType: "既存", proposal: "D社に価格見直し提案", priority: "中", last: "現行契約継続中" },
    { project: "新規サービス提案", customerType: "新規", proposal: "E社に追加サービス紹介", priority: "高", last: "基本サービス導入済み" },
  ];

  //DataTable用カラム定義（フォローアップメール）
  const followupColumns: ColumnDef<any, React.ReactNode>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={selectedRecipients.length === followupCandidates?.length}
          onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectAll(!!checked)}
          aria-label="全選択"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRecipients.includes(row.index)}
          onCheckedChange={(checked: boolean | 'indeterminate') => handleSelectOne(row.index, !!checked)}
          aria-label="送信先選択"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
    { accessorKey: "name", header: "顧客名", cell: info => <span className="text-black font-normal">{info.getValue()}</span> },
    { accessorKey: "project", header: "案件", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "lastContact", header: "最終連絡日", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
    { accessorKey: "reason", header: "抽出理由", cell: info => <span className="text-gray-700 font-normal">{info.getValue()}</span> },
  ];

  // 質問リストをファイルから取得（現状は静的に記述）
  const questionList = [
    "フォローアップメールが必要な案件を抽出して"
  ];

  // コマンド入力欄の表示位置を制御
  const showInputAtBottom =
    approvalStep === "search_results" ||
    approvalStep === "select_recipients" ||
    approvalStep === "preview_mail" ||
    approvalStep === "sent" ||
    !!aiResponse;

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="flex-1 flex flex-col gap-6 p-6 justify-start px-8 max-w-[1200px] w-full mx-auto" style={{ paddingBottom: showInputAtBottom ? '120px' : undefined }}>
        {/* 初期ホーム画面：タイトルラベルとコマンド入力欄 */}
        {approvalStep === "none" && !aiResponse && (
          <div className="w-full flex flex-col items-center pt-12 pb-8">
            <label className="text-center font-semibold text-[64px] mb-8">SalesOn</label>
            <div className="w-full flex justify-center">
              <div className="w-full max-w-[1200px] flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <Textarea
                  placeholder="Selaに質問してください"
                  value={command}
                  onChange={e => setCommand(e.target.value)}
                  className="command-textarea w-full resize-none h-16 min-h-[64px] max-h-[180px] border-none outline-none bg-transparent p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none font-normal"
                  rows={1}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!command.trim()}
                  className="ml-2 w-12 h-12 rounded-xl bg-gray-700 text-white flex items-center justify-center hover:bg-black transition-all duration-150 shadow-none border-none self-start"
                  aria-label="送信"
                  style={{ boxShadow: 'none', border: 'none', background: command.trim() ? '#22223b' : '#bdbdbd' }}
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}
        {/* コマンド送信後のプロセスフロー */}
        {approvalStep === "search_results" && (
          <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* 検索結果の説明テキスト */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">フォローアップメール候補を抽出しました</h3>
                  <p className="text-gray-600 mb-4">
                    CRMデータを分析した結果、{followupCandidates ? followupCandidates.length : 0}件のフォローアップが必要な案件を特定しました。
                    各案件について、最終連絡日から2週間以上経過しており、積極的なアプローチが推奨されます。
                  </p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>抽出条件: 最終連絡から14日以上経過</span>
                    <span>対象期間: 過去30日間</span>
                    <span>優先度: 高・中優先案件</span>
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => setApprovalStep("select_recipients")} className="bg-blue-600 hover:bg-blue-700 text-white">次へ進む</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {approvalStep === "select_recipients" && followupCandidates && (
          <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* 候補テーブルと送信先選択 */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">フォローアップ候補 ({selectedRecipients.length}/{followupCandidates.length}件選択)</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">送信先選択:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRecipients.length}件</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <DataTable columns={followupColumns} data={followupCandidates} />
              </div>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" onClick={() => setApprovalStep("search_results")}>戻る</Button>
                <Button onClick={() => setApprovalStep("preview_mail")} disabled={selectedRecipients.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white">メールプレビューへ</Button>
              </div>
            </div>
          </div>
        )}

        {approvalStep === "preview_mail" && mailPreview && (
          <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
            {/* メールプレビューと修正・承認 */}
            <div className="bg-white rounded-xl shadow p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">メールプレビュー</h4>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  編集
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border mb-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">{mailPreview}</pre>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setApprovalStep("select_recipients")}>戻る</Button>
                <Button onClick={handleApprove} disabled={selectedRecipients.length === 0} className="bg-green-600 hover:bg-green-700 text-white">メール送信</Button>
              </div>
            </div>
          </div>
        )}

        {approvalStep === "sent" && (
          <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">フォローアップメールを送信しました</h3>
                  <p className="text-green-700 mb-4">{selectedRecipients.length}件のフォローアップメールが正常に送信されました。送信状況は「メール履歴」で確認できます。</p>
                  <div className="flex items-center gap-4 text-sm text-green-600">
                    <span>送信日時: {new Date().toLocaleString('ja-JP')}</span>
                    <span>送信先: {selectedRecipients.length}件</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* タブ付きテーブル（優先タスク・リスク案件・AI提案の承認） */}
        {approvalStep === "none" && !aiResponse && (
          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 mt-0 w-full">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="mb-4 bg-gray-100">
                <TabsTrigger value="tasks" className="text-gray-700 font-normal">優先タスク</TabsTrigger>
                <TabsTrigger value="risks" className="text-gray-700 font-normal">リスク案件</TabsTrigger>
                <TabsTrigger value="ai" className="text-gray-700 font-normal">AI提案の承認</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <div className="overflow-x-auto">
                  <DataTable columns={taskColumns} data={taskData} />
                </div>
              </TabsContent>
              <TabsContent value="risks">
                <div className="overflow-x-auto">
                  <DataTable columns={riskColumns} data={riskData} />
                </div>
              </TabsContent>
              <TabsContent value="ai">
                <div className="overflow-x-auto">
                  <DataTable columns={aiColumns} data={aiData} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      {/* 下部コマンド入力欄（AI返答やプロセス表示時のみ） */}
      {showInputAtBottom && (
        <div
          className="fixed bottom-0 flex justify-center z-50 bg-white/80 border-t border-gray-200 shadow-lg"
          style={{ left: 72, right: 0 }}
        >
          <div className="w-full" style={{ maxWidth: 1200, paddingLeft: 32, paddingRight: 32, paddingBottom: 24 }}>
            <div className="flex items-end">
              <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm w-full">
                <Textarea
                  placeholder="Selaに質問してください"
                  value={command}
                  onChange={e => setCommand(e.target.value)}
                  className="command-textarea w-full resize-none h-16 min-h-[64px] max-h-[180px] border-none outline-none bg-transparent p-0 focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none font-normal"
                  rows={1}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!command.trim()}
                  className="ml-2 w-12 h-12 rounded-xl bg-gray-700 text-white flex items-center justify-center hover:bg-black transition-all duration-150 shadow-none border-none self-start"
                  aria-label="送信"
                  style={{ boxShadow: 'none', border: 'none', background: command.trim() ? '#22223b' : '#bdbdbd' }}
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 