"use client";

import { Button } from "@/components/ui/button";
import SidebarHomeButton from "@/components/ui/SidebarHomeButton";
import { Briefcase, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import "./globals.css";

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

function SidebarCasesButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 p-1 mb-2"
      onClick={() => router.push("/cases")}
      aria-label="案件一覧"
    >
      <Briefcase className="w-8 h-8" />
    </Button>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full" suppressHydrationWarning>
      <body className="bg-white min-h-screen h-full flex flex-col" suppressHydrationWarning>
        {/* ヘッダー削除済み */}
        <div className="flex flex-1 min-h-0 h-full">
          {/* サイドバー */}
          <aside className="w-[72px] bg-gray-50 border-r flex flex-col h-full py-0">
            <div className="flex flex-col items-center pt-4 h-full">
              <GridDotsIcon className="w-7 h-7 text-gray-700 mb-6" />
              <SidebarHomeButton />
              <SidebarCasesButton />
              <Button variant="ghost" size="icon" className="w-10 h-10 p-1"><Settings className="w-8 h-8" /></Button>
            </div>
          </aside>
          {/* メインエリア */}
          <main className="flex-1 flex flex-col bg-white overflow-visible">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
} 