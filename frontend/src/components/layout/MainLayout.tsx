"use client";

import AgentInbox from "@/components/features/AgentInbox/AgentInbox";
import EmailInbox from "@/components/features/EmailManagement/EmailInbox";
import TaskList from "@/components/features/TaskManagement/TaskList";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import Navigation from "./Navigation";

export default function MainLayout() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const pathname = usePathname();

  const renderPage = () => {
    // 案件管理ページの場合は何も表示しない（専用ページで表示される）
    if (pathname === '/cases') {
      return null;
    }

    // その他のページは従来通り内部状態で管理
    switch (currentPage) {
      case "dashboard":
        return <AgentInbox />;
      case "tasks":
        return <TaskList />;
      case "emails":
        return <EmailInbox />;
      default:
        return <AgentInbox />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex justify-center">
        <div className="max-w-[1280px] w-full mx-auto py-8 px-2 overflow-hidden">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
