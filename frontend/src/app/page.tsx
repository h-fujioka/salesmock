import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Calendar, User } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

export default function Home() {
  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="flex-1 flex flex-row gap-6 p-6 justify-center px-8">
        <div className="w-full max-w-[1000px] flex flex-col gap-6">
          {/* コマンド入力欄（添付画像風デザイン） */}
          <div className="flex flex-col items-center w-full">
            <label className="text-center font-semibold text-xl mb-2 mt-6">何をしたいですか？</label>
            <div className="relative w-full">
              <input className="w-full border border-black rounded-xl py-5 pl-4 pr-16 text-lg placeholder-gray-400 focus:outline-none" placeholder="Selaにやってほしいことを入力してください" />
              <div className="absolute left-2 bottom-2 flex gap-2">
                <Button variant="ghost" size="icon" className="p-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M16.5 8.5L7.5 15.5"/><path d="M8 8L16 16"/></svg></Button>
                <Button variant="ghost" size="icon" className="p-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2 2"/></svg></Button>
              </div>
              <Button variant="ghost" size="icon" className="absolute right-2 bottom-2 bg-black text-white rounded p-1"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg></Button>
            </div>
          </div>

          {/* 優先タスク・リスク案件・AI提案をタブ切り替えでカード内に表示（白黒スタイリッシュ・ノーマルウェイト） */}
          <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2">
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="mb-4 bg-gray-100">
                <TabsTrigger value="tasks" className="data-[state=active]:bg-black data-[state=active]:text-white text-gray-700 font-normal">優先タスク</TabsTrigger>
                <TabsTrigger value="risks" className="data-[state=active]:bg-black data-[state=active]:text-white text-gray-700 font-normal">リスク案件</TabsTrigger>
                <TabsTrigger value="ai" className="data-[state=active]:bg-black data-[state=active]:text-white text-gray-700 font-normal">AI提案の承認</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-normal">タスク名</th>
                        <th className="px-3 py-2 text-left font-normal">関連案件</th>
                        <th className="px-3 py-2 text-left font-normal">顧客区分</th>
                        <th className="px-3 py-2 text-left font-normal">優先度</th>
                        <th className="px-3 py-2 text-left font-normal">期限</th>
                        <th className="px-3 py-2 text-left font-normal">残り日数</th>
                        <th className="px-3 py-2 text-left font-normal">ステータス</th>
                        <th className="px-3 py-2 text-left font-normal">AI/手動</th>
                        <th className="px-3 py-2 text-left font-normal">承認待ち</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">顧客Aへ見積送付</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">A社案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/10</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">3日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">進行中</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">AI自動</span></td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">承認待ち</span></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">商談Bの準備</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">B社案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/12</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">1日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">未着手</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">手動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">C社 提案書ドラフト作成</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">C社新規案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/15</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">進行中</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">AI自動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">D社 定例会議準備</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">D社サポート案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/13</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">0日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">進行中</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">手動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">E社 契約書レビュー</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">E社更新案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/09</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">1日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">完了</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">AI自動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">F社 サポート対応</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">F社サポート案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">低</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/20</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">0日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">未着手</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">手動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">G社 進捗報告作成</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">G社大型案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/11</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">0日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">進行中</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">AI自動</span></td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">承認待ち</span></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">H社 顧客ヒアリング</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">H社新規案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/18</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">0日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">進行中</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">手動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">I社 サービス説明資料作成</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">I社新規案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">低</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/22</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">0日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">未着手</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">AI自動</span></td>
                        <td className="px-3 py-2"></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">J社 受注処理</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">J社大型案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/14</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">0日</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">進行中</td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">手動</span></td>
                        <td className="px-3 py-2"><span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-normal">承認待ち</span></td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="risks">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-normal">案件名</th>
                        <th className="px-3 py-2 text-left font-normal">顧客名</th>
                        <th className="px-3 py-2 text-left font-normal">顧客区分</th>
                        <th className="px-3 py-2 text-left font-normal">期限</th>
                        <th className="px-3 py-2 text-left font-normal">優先度</th>
                        <th className="px-3 py-2 text-left font-normal">リスク内容</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">新製品導入プロジェクト</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">株式会社みらいテック</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/10</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-red-600 font-normal">期限超過</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">システム更改案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">東都情報サービス株式会社</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/12</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-yellow-600 font-normal">進捗遅延</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">海外展開サポート</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">グローバル商事株式会社</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/15</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-red-600 font-normal">顧客要望未対応</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">契約更新交渉</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">日本エネルギー株式会社</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/18</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-yellow-600 font-normal">承認遅延</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">新規サービス提案</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">株式会社さくらネット</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/20</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-red-600 font-normal">顧客連絡途絶</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">サポート契約見直し</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">西日本物流株式会社</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/22</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">低</span></td>
                        <td className="px-3 py-2 text-yellow-600 font-normal">資料未提出</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">定例会議準備</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">株式会社アーバン開発</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/25</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-red-600 font-normal">会議資料遅延</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">導入支援プロジェクト</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">株式会社グリーンファーム</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/28</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-yellow-600 font-normal">要件不明確</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">業務改善提案</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">株式会社エコライフ</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/07/30</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-red-600 font-normal">承認保留</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">新規取引先開拓</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">株式会社フューチャーリンク</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">2024/08/02</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-yellow-600 font-normal">初回連絡未完了</td>
                        <td className="px-3 py-2"><Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="ai">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-normal">案件名</th>
                        <th className="px-3 py-2 text-left font-normal">顧客区分</th>
                        <th className="px-3 py-2 text-left font-normal">提案内容</th>
                        <th className="px-3 py-2 text-left font-normal">優先度</th>
                        <th className="px-3 py-2 text-left font-normal">前回実行</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">新製品導入プロジェクト</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">顧客Aにフォローアップメール送信</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">初回提案済み</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">承認</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">却下</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">システム更改案件</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">B社に技術資料を追加送付</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">基本提案書送付済み</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">承認</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">却下</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">海外展開サポート</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">C社に現地パートナー紹介</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">初期ヒアリング完了</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">承認</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">却下</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">契約更新交渉</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">D社に価格見直し提案</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">既存</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-100 rounded px-2 py-0.5 font-normal">中</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">現行契約継続中</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">承認</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">却下</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-3 py-2 text-black font-normal">新規サービス提案</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">E社に追加サービス紹介</td>
                        <td className="px-3 py-2 text-gray-700 font-normal">新規</td>
                        <td className="px-3 py-2"><span className="text-black bg-gray-200 rounded px-2 py-0.5 font-normal">高</span></td>
                        <td className="px-3 py-2 text-gray-700 font-normal">基本サービス導入済み</td>
                        <td className="px-3 py-2">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">承認</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">却下</Button>
                            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 font-normal">詳細を見る</Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 