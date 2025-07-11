'use client';

import ChatArea from "@/components/features/Home/ChatArea";
import { MessageCircle } from "lucide-react";
import { useState } from "react";

const SelaPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* フロートボタン */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition"
        onClick={() => setOpen(true)}
        aria-label="Selaチャットを開く"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* サイドパネル */}
      <aside
        className={`fixed top-0 right-0 h-full w-[360px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ minWidth: 320 }}
      >
        {/* ヘッダー */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">S</span>
          </div>
          <div>
            <div className="text-base font-semibold text-gray-900">Selaとの対話</div>
            <div className="text-xs text-gray-500">AIアシスタント</div>
          </div>
          <button
            className="ml-auto p-2 rounded hover:bg-gray-100"
            onClick={() => setOpen(false)}
            aria-label="閉じる"
          >
            <span className="text-xl font-bold text-gray-400">&times;</span>
          </button>
        </div>
        {/* 会話エリア */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
          <ChatArea />
        </div>
      </aside>
    </>
  );
};

export default SelaPanel; 