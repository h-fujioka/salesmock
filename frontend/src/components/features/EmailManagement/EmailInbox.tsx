"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Archive,
    Bot,
    Forward,
    Mail,
    Paperclip,
    Reply,
    Search,
    Send,
    Star,
    StarOff,
    Trash2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'inquiry' | 'proposal' | 'contract' | 'support' | 'general';
  hasAttachment: boolean;
  caseId?: string;
  caseName?: string;
}

export default function EmailInbox() {
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [showReply, setShowReply] = useState(false);

  const emails: Email[] = [
    {
      id: "1",
      subject: "新規案件についての問い合わせ",
      sender: "田中 一郎",
      senderEmail: "tanaka@abc-company.co.jp",
      content: "弊社のシステム導入について、詳細な提案書をご送付いただけますでしょうか。予算は500万円程度を想定しております。",
      timestamp: "14:30",
      isRead: false,
      isStarred: true,
      priority: "high",
      category: "inquiry",
      hasAttachment: false,
      caseId: "1",
      caseName: "ABC社システム導入"
    },
    {
      id: "2",
      subject: "XYZ社保守契約の更新について",
      sender: "佐藤 花子",
      senderEmail: "sato@xyz-corp.com",
      content: "現在の保守契約が来月で期限を迎えます。更新条件についてご相談させていただけますでしょうか。",
      timestamp: "13:45",
      isRead: true,
      isStarred: false,
      priority: "medium",
      category: "contract",
      hasAttachment: true,
      caseId: "2",
      caseName: "XYZ社保守契約"
    },
    {
      id: "3",
      subject: "DEF社クラウド移行プロジェクトの進捗",
      sender: "山田 次郎",
      senderEmail: "yamada@def-tech.co.jp",
      content: "クラウド移行プロジェクトの進捗について、週次報告をお送りいたします。現在75%完了しております。",
      timestamp: "12:20",
      isRead: true,
      isStarred: false,
      priority: "low",
      category: "proposal",
      hasAttachment: true,
      caseId: "3",
      caseName: "DEF社クラウド移行"
    },
    {
      id: "4",
      subject: "GHI社セキュリティシステムの導入完了",
      sender: "鈴木 三郎",
      senderEmail: "suzuki@ghi-security.com",
      content: "セキュリティシステムの導入が完了いたしました。ご協力いただき、ありがとうございました。",
      timestamp: "11:15",
      isRead: true,
      isStarred: true,
      priority: "medium",
      category: "support",
      hasAttachment: false,
      caseId: "4",
      caseName: "GHI社セキュリティ強化"
    },
    {
      id: "5",
      subject: "新規案件のリード情報",
      sender: "高橋 四郎",
      senderEmail: "takahashi@new-lead.co.jp",
      content: "新規案件のリード情報をお送りいたします。詳細な資料を添付いたしますので、ご確認ください。",
      timestamp: "10:30",
      isRead: false,
      isStarred: false,
      priority: "urgent",
      category: "inquiry",
      hasAttachment: true
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '不明';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'inquiry': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-green-100 text-green-800';
      case 'support': return 'bg-orange-100 text-orange-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'inquiry': return '問い合わせ';
      case 'proposal': return '提案';
      case 'contract': return '契約';
      case 'support': return 'サポート';
      case 'general': return '一般';
      default: return '不明';
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         email.content.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesCategory = selectedCategory === "all" || email.category === selectedCategory;
    return matchesSearch; // && matchesCategory;
  });

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setShowReply(false);
  };

  const handleReply = () => {
    setShowReply(true);
  };

  const handleSendReply = () => {
    if (replyContent.trim()) {
      toast.success("返信メールを送信しました");
      setReplyContent("");
      setShowReply(false);
    } else {
      toast.error("返信内容を入力してください");
    }
  };

  const handleAIAutoReply = () => {
    toast.info("AI自動返信を生成中...");
    setTimeout(() => {
      setReplyContent("ご連絡ありがとうございます。\n\nお問い合わせいただいた件について、詳細を確認させていただきます。\n\n近日中にご回答いたしますので、少々お待ちください。\n\nよろしくお願いいたします。");
      setShowReply(true);
    }, 1000);
  };

  const handleStarEmail = () => {
    toast.success("メールをスター付けしました");
  };

  const handleArchiveEmail = () => {
    toast.success("メールをアーカイブしました");
  };

  const handleDeleteEmail = () => {
    toast.error("メールを削除しました");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1280px] w-full mx-auto py-8 px-2">
        {/* メール一覧 */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">メールボックス</h2>
              <Button size="sm">
                <Send className="w-4 h-4 mr-2" />
                新規作成
              </Button>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="メールを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 p-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">全て</TabsTrigger>
                <TabsTrigger value="inquiry">問い合わせ</TabsTrigger>
                <TabsTrigger value="proposal">提案</TabsTrigger>
                <TabsTrigger value="contract">契約</TabsTrigger>
                <TabsTrigger value="support">サポート</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {filteredEmails.map((email) => (
                      <Card 
                        key={email.id} 
                        className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
                          selectedEmail?.id === email.id ? 'ring-2 ring-blue-500' : ''
                        } ${!email.isRead ? 'bg-blue-50' : ''}`}
                        onClick={() => handleEmailClick(email)}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {email.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`font-medium text-sm ${!email.isRead ? 'font-bold' : ''}`}>
                                  {email.sender}
                                </span>
                                {email.isStarred && <Star className="w-3 h-3 text-yellow-500" />}
                                {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                              </div>
                              <span className="text-xs text-gray-500">{email.timestamp}</span>
                            </div>
                            
                            <h3 className={`text-sm ${!email.isRead ? 'font-bold' : ''} truncate`}>
                              {email.subject}
                            </h3>
                            
                            <p className="text-xs text-gray-600 truncate">{email.content}</p>
                            
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge className={getPriorityColor(email.priority)}>
                                {getPriorityText(email.priority)}
                              </Badge>
                              <Badge className={getCategoryColor(email.category)}>
                                {getCategoryText(email.category)}
                              </Badge>
                              {email.caseName && (
                                <Badge variant="outline" className="text-xs">
                                  {email.caseName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {['inquiry', 'proposal', 'contract', 'support'].map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-96">
                    <div className="space-y-2">
                      {filteredEmails
                        .filter(email => email.category === category)
                        .map((email) => (
                          <Card 
                            key={email.id} 
                            className={`p-3 cursor-pointer hover:shadow-md transition-shadow ${
                              selectedEmail?.id === email.id ? 'ring-2 ring-blue-500' : ''
                            } ${!email.isRead ? 'bg-blue-50' : ''}`}
                            onClick={() => handleEmailClick(email)}
                          >
                            <div className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {email.sender.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className={`font-medium text-sm ${!email.isRead ? 'font-bold' : ''}`}>
                                      {email.sender}
                                    </span>
                                    {email.isStarred && <Star className="w-3 h-3 text-yellow-500" />}
                                    {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                                  </div>
                                  <span className="text-xs text-gray-500">{email.timestamp}</span>
                                </div>
                                
                                <h3 className={`text-sm ${!email.isRead ? 'font-bold' : ''} truncate`}>
                                  {email.subject}
                                </h3>
                                
                                <p className="text-xs text-gray-600 truncate">{email.content}</p>
                                
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge className={getPriorityColor(email.priority)}>
                                    {getPriorityText(email.priority)}
                                  </Badge>
                                  <Badge className={getCategoryColor(email.category)}>
                                    {getCategoryText(email.category)}
                                  </Badge>
                                  {email.caseName && (
                                    <Badge variant="outline" className="text-xs">
                                      {email.caseName}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* メール詳細 */}
        <div className="flex-1 flex flex-col">
          {selectedEmail ? (
            <>
              {/* メールヘッダー */}
              <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">{selectedEmail.subject}</h2>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(selectedEmail.priority)}>
                        {getPriorityText(selectedEmail.priority)}
                      </Badge>
                      <Badge className={getCategoryColor(selectedEmail.category)}>
                        {getCategoryText(selectedEmail.category)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStarEmail()}
                    >
                      {selectedEmail.isStarred ? <Star className="w-4 h-4" /> : <StarOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveEmail()}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEmail()}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* メール内容 */}
              <ScrollArea className="flex-1 p-6">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="text-lg">
                          {selectedEmail.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{selectedEmail.sender}</h3>
                        <p className="text-sm text-gray-500">{selectedEmail.senderEmail}</p>
                        <p className="text-sm text-gray-500">{selectedEmail.timestamp}</p>
                      </div>
                    </div>
                    
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedEmail.content}</p>
                    </div>
                    
                    {selectedEmail.caseName && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">関連案件</h4>
                        <p className="text-blue-700">{selectedEmail.caseName}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>

              {/* 返信エリア */}
              {showReply && (
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">返信</h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleAIAutoReply}
                        >
                          <Bot className="w-4 h-4 mr-2" />
                          AI自動返信
                        </Button>
                        <Button size="sm" onClick={handleSendReply}>
                          <Send className="w-4 h-4 mr-2" />
                          送信
                        </Button>
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="返信内容を入力..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="min-h-32"
                    />
                  </div>
                </div>
              )}

              {/* アクションボタン */}
              {!showReply && (
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center space-x-2">
                      <Button onClick={handleReply}>
                        <Reply className="w-4 h-4 mr-2" />
                        返信
                      </Button>
                      <Button variant="outline">
                        <Forward className="w-4 h-4 mr-2" />
                        転送
                      </Button>
                      <Button variant="outline" onClick={handleAIAutoReply}>
                        <Bot className="w-4 h-4 mr-2" />
                        AI自動返信
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">メールを選択してください</h3>
                <p className="text-gray-500">左側のメール一覧から表示したいメールを選択してください</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 