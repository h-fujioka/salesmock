"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bot,
    Briefcase,
    CheckCircle,
    Clock,
    Filter,
    Mail,
    Search,
    Send,
    Target
} from "lucide-react";
import { useState } from "react";

interface TimelineItem {
  id: string;
  type: 'email' | 'case' | 'task' | 'progress' | 'ai';
  title: string;
  content: string;
  timestamp: string;
  status?: 'pending' | 'completed' | 'in-progress';
  priority?: 'low' | 'medium' | 'high';
  sender?: string;
  avatar?: string;
}

interface AIConversation {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
}

export default function AgentInbox() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedFilter, setSelectedFilter] = useState("all");
  const [aiMessage, setAiMessage] = useState("");
  const [conversations, setConversations] = useState<AIConversation[]>([
    {
      id: "1",
      type: "ai",
      message: "こんにちは！営業支援AIのSelaです。何かお手伝いできることはありますか？",
      timestamp: "14:30"
    }
  ]);

  const timelineItems: TimelineItem[] = [
    {
      id: "1",
      type: "email",
      title: "新規案件の問い合わせ",
      content: "株式会社ABC様からの新規案件についての問い合わせメールを受信しました。",
      timestamp: "14:30",
      sender: "info@abc-company.co.jp",
      priority: "high"
    },
    {
      id: "2",
      type: "case",
      title: "案件：ABC社システム導入",
      content: "新規案件が作成されました。予算：500万円、期間：3ヶ月",
      timestamp: "14:25",
      status: "in-progress"
    },
    {
      id: "3",
      type: "task",
      title: "提案書作成",
      content: "ABC社向け提案書の作成タスクが割り当てられました。期限：明日",
      timestamp: "14:20",
      status: "pending",
      priority: "high"
    },
    {
      id: "4",
      type: "progress",
      title: "進捗更新",
      content: "XYZ社案件の進捗が更新されました。完了率：75%",
      timestamp: "14:15"
    },
    {
      id: "5",
      type: "ai",
      title: "AI提案",
      content: "Selaが提案書のテンプレートを自動生成しました。",
      timestamp: "14:10"
    }
  ];

  const handleSendMessage = () => {
    if (aiMessage.trim()) {
      const newMessage: AIConversation = {
        id: Date.now().toString(),
        type: "user",
        message: aiMessage,
        timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => [...prev, newMessage]);
      setAiMessage("");
      
      // AI応答をシミュレート
      setTimeout(() => {
        const aiResponse: AIConversation = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          message: "承知いたしました。提案書の作成をお手伝いします。どのような内容をお求めでしょうか？",
          timestamp: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
        };
        setConversations(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'case': return <Briefcase className="w-4 h-4" />;
      case 'task': return <Target className="w-4 h-4" />;
      case 'progress': return <CheckCircle className="w-4 h-4" />;
      case 'ai': return <Bot className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* サイドバー */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">営業支援システム</h2>
          <p className="text-sm text-gray-500">統合タイムライン</p>
        </div>
        
        <div className="flex-1 p-4">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">概要</TabsTrigger>
              <TabsTrigger value="cases">案件</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">今日のサマリー</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>新規メール</span>
                      <Badge variant="secondary">3</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>進行中案件</span>
                      <Badge variant="secondary">5</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>期限タスク</span>
                      <Badge variant="destructive">2</Badge>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">最近の案件</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>ABC社システム導入</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>XYZ社保守契約</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="cases" className="mt-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Briefcase className="w-4 h-4 mr-2" />
                  全案件
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="w-4 h-4 mr-2" />
                  進行中
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  完了
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* メインエリア - タイムライン */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">統合タイムライン</h1>
              <Badge variant="outline">リアルタイム更新</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                フィルター
              </Button>
            </div>
          </div>
        </div>

        {/* タイムライン */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {timelineItems.map((item) => (
              <Card key={item.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getTypeIcon(item.type)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        {item.priority && (
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                          </Badge>
                        )}
                        {item.status && (
                          <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                            {item.status === 'completed' ? '完了' : item.status === 'in-progress' ? '進行中' : '待機'}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{item.content}</p>
                    
                    {item.sender && (
                      <div className="flex items-center space-x-1 mt-2">
                        <span className="text-xs text-gray-500">送信者:</span>
                        <span className="text-xs text-blue-600">{item.sender}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* AI対話パネル */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/sela-avatar.png" />
              <AvatarFallback className="bg-purple-100 text-purple-600">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">Sela</h3>
              <p className="text-xs text-gray-500">AI営業アシスタント</p>
            </div>
          </div>
        </div>

        {/* 会話履歴 */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex ${conversation.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    conversation.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{conversation.message}</p>
                  <p className="text-xs mt-1 opacity-70">{conversation.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* メッセージ入力 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Selaに質問する..."
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 