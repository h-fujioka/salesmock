import ChatArea from "@/components/features/Home/ChatArea";

const SelaPanel = () => {
  return (
    <aside
      className="hidden lg:block fixed right-0 top-12 h-[calc(100%-48px)] w-[360px] bg-white border-l border-gray-200 shadow-lg z-40 flex flex-col"
      style={{ minWidth: 320 }}
    >
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-lg font-bold">S</span>
        </div>
        <div>
          <div className="text-base font-semibold text-gray-900">Sela</div>
          <div className="text-xs text-gray-500">AIアシスタント</div>
        </div>
      </div>
      {/* 会話エリア */}
      <div className="flex-1 overflow-y-auto p-2">
        <ChatArea />
      </div>
    </aside>
  );
};

export default SelaPanel; 