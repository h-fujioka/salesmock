import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Bot, ListTodo, AlertCircle, Menu, User, Calendar } from "lucide-react";

// Sidebarコンポーネント削除

function Header() {
  return (
    <header className="h-16 w-full flex items-center justify-between px-8 bg-white/80 border-b shadow-sm">
      <div className="text-xl font-bold tracking-tight">SalesOn ダッシュボード</div>
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

function AIChatPanel() {
  return (
    <div className="col-span-1 flex flex-col h-full bg-white/90 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2"><Bot className="text-blue-500" /><span className="font-bold text-lg">AIチャット</span></div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        <div className="flex items-start gap-2"><User className="w-6 h-6 text-gray-400" /><div className="bg-gray-100 rounded-xl px-4 py-2">今月の案件進捗を教えて</div></div>
        <div className="flex items-start gap-2 self-end"><div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-2">今月は3件成約、2件進行中です。</div><Bot className="w-6 h-6 text-blue-400" /></div>
      </div>
      <div className="p-4 border-t flex gap-2"><input className="flex-1 rounded-lg border px-3 py-2 focus:outline-none" placeholder="AIに質問・依頼..." /><Button>送信</Button></div>
    </div>
  );
}

function TaskListPanel() {
  const tasks = [
    { title: "見積書作成", status: "進行中", progress: 60 },
    { title: "顧客Aへメール返信", status: "未着手", progress: 0 },
    { title: "案件Bの提案資料", status: "完了", progress: 100 },
  ];
  return (
    <div className="col-span-1 flex flex-col h-full bg-white/90 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2"><ListTodo className="text-green-500" /><span className="font-bold text-lg">タスク一覧</span></div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {tasks.map((task, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex items-center gap-2"><span className="font-medium">{task.title}</span><span className={`text-xs px-2 py-0.5 rounded-full ${task.status === "完了" ? "bg-green-100 text-green-700" : task.status === "進行中" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{task.status}</span></div>
            <div className="w-full h-2 bg-gray-200 rounded"><div className={`h-2 rounded ${task.progress === 100 ? "bg-green-400" : "bg-blue-400"}`} style={{ width: `${task.progress}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AISuggestionPanel() {
  const suggestions = [
    "案件Cのフォローアップをおすすめします",
    "未返信メールが2件あります",
    "今週のタスク進捗が遅れ気味です",
  ];
  return (
    <div className="col-span-1 flex flex-col h-full bg-white/90 rounded-2xl shadow-xl overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2"><AlertCircle className="text-orange-500" /><span className="font-bold text-lg">AIサジェスト</span></div>
      <div className="flex-1 p-4 flex flex-col gap-3">
        {suggestions.map((s, i) => (
          <div key={i} className="bg-orange-50 text-orange-800 rounded-lg px-3 py-2">{s}</div>
        ))}
      </div>
    </div>
  );
}

function AlertPanel() {
  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-xl shadow flex items-center gap-3">
      <AlertCircle className="text-red-400" />
      <span className="text-red-700 font-medium">重要アラート: 本日締切のタスクがあります！</span>
    </div>
  );
}

function NotificationPanel() {
  return (
    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-xl shadow flex items-center gap-3">
      <Bell className="text-blue-400" />
      <span className="text-blue-700 font-medium">未読通知: 2件の新着があります</span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar削除済み */}
      <Header />
      <div className="flex-1 flex flex-row gap-6 p-6">
        <div className="w-1/5 min-w-[220px] flex flex-col">
          <AlertPanel />
          <NotificationPanel />
        </div>
        <main className="flex-1 grid grid-cols-3 gap-6">
          <AIChatPanel />
          <TaskListPanel />
          <AISuggestionPanel />
        </main>
      </div>
    </div>
  );
} 