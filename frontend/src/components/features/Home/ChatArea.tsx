'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import React, { useState } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatAreaProps {
  className?: string;
}

const quickActions = [
  '未読メールを確認',
  '確認が必要なタスク',
  '今週中に対応が必要な案件は？',
];

const ChatArea: React.FC<ChatAreaProps> = ({ className }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'こんにちは！今日は何かお手伝いできることはありますか？',
      timestamp: '10:00'
    }
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: time
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    // 簡易アシスタント自動返信
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'ご質問ありがとうございます。内容を確認します。',
        timestamp: new Date().getHours().toString().padStart(2, '0') + ':' + new Date().getMinutes().toString().padStart(2, '0')
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 800);
  };

  return (
    <div className={`flex flex-col h-full ${className || ''}`}>

      
      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto px-6 pb-2">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8">
                  {message.type === 'assistant' ? (
                    <AvatarFallback className="bg-blue-500 text-white text-base">S</AvatarFallback>
                  ) : (
                    <AvatarFallback className="bg-gray-400 text-white text-base">U</AvatarFallback>
                  )}
                </Avatar>
                <div className={`rounded-lg px-3 py-2 ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border'
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 入力欄 */}
      <div className="mt-auto px-6 pb-6">
        <div className="flex items-center border rounded-xl px-4 py-3 bg-white shadow-sm">
          <input
            className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-base"
            placeholder="何かお手伝いできることはありますか？"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button className="ml-2 text-gray-500 hover:text-blue-600" onClick={sendMessage}>
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea; 