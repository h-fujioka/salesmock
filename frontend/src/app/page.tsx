import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Calendar, User } from "lucide-react";

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
          {/* コンテンツなし */}
        </div>
      </div>
    </div>
  );
} 