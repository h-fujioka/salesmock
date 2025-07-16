import "./globals.css";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Calendar, Home, Settings, Users, List, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

function GridDotsIcon({ className = "w-6 h-6" }) {
  // 3x3 grid of dots
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="none">
      <circle cx="5" cy="5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="5" r="1.5" fill="currentColor" />
      <circle cx="19" cy="5" r="1.5" fill="currentColor" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
      <circle cx="5" cy="19" r="1.5" fill="currentColor" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" />
      <circle cx="19" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="bg-white min-h-screen h-full flex flex-col">
        {/* ヘッダー削除済み */}
        <div className="flex flex-1 min-h-0 h-full">
          {/* サイドバー */}
          <aside className="w-[72px] bg-gray-50 border-r flex flex-col h-full py-0">
            <div className="flex flex-col items-center pt-4 h-full">
              <GridDotsIcon className="w-7 h-7 text-gray-700 mb-6" />
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0 mb-2"><Home className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0 mb-2"><Briefcase className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" className="w-8 h-8 p-0"><Settings className="w-5 h-5" /></Button>
            </div>
          </aside>
          {/* メインエリア */}
          <main className="flex-1 flex flex-col bg-white overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 