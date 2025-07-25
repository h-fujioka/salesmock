"use client";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from "@/components/ui/section-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Heart,
  Home,
  Lightbulb,
  Mail,
  MessageSquare,
  MoreVertical,
  PieChart,
  Plus,
  Settings,
  Star,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// 案件データの型定義
type Case = {
  id: string;
  name: string;
  company: string;
  customerType: "新規" | "既存";
  status: "提案中" | "進行中" | "完了" | "保留" | "失注";
  priority: "高" | "中" | "低";
  assignee: string;
  stakeholders: string[];
  customerOwner: string;
  customerStakeholders: string[];
  project: string;
  description: string;
  budget: string;
  deadline: string;
  progress: number;
  firstContact: string;
  lastContact: string;
  taskCount: number;
  emailCount: number;
  meetingCount: number; // 商談回数
  daysSinceLastContact: number; // 最終連絡からの日数
  nextActionDate: string; // 次回アクション日
  // 新しい項目
  customerPsychology: {
    challenges: string[];
    needs: string[];
    emotionalFactors: string[];
    dailyBenefits: string[];
  };
  decisionMaker: {
    name: string;
    role: string;
    businessMetrics: {
      roi: string;
      costSaving: string;
      revenueImpact: string;
    };
    companyImpact: string[];
    competitiveAdvantage: string[];
  };
  aiInsights: {
    nextActions: string[];
    riskFactors: string[];
    opportunities: string[];
    recommendations: string[];
  };
};

// タイムラインエントリの型定義
type TimelineEntry = {
  id: string;
  timestamp: Date;
  type: 'email' | 'comment' | 'meeting' | 'ai' | 'system' | 'analysis' | 'slack';
  title: string;
  content: string;
  author?: string;
  replies?: number;
  attachments?: string[];
  warning?: boolean;
  status?: 'pending' | 'completed' | 'cancelled';
  aiGenerated?: boolean;
  humanApproved?: boolean;
  analysisType?: 'customer' | 'decision' | 'competitive';
  channel?: string; // Slackチャンネル名
  threadCount?: number; // Slackスレッド数
};

export default function CaseDetailPage() {
  const [activeTab, setActiveTab] = useState('customer');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic-info']));
  const [commentText, setCommentText] = useState('');

  // ダミーデータ
  const caseData: Case = {
    id: 'case-001',
    name: 'ABC株式会社 営業支援システム導入案件',
    company: 'ABC株式会社',
    customerType: '既存',
    status: '提案中',
    priority: '高',
    assignee: 'Hirokazu Tanaka',
    stakeholders: ['田中 博一', '佐藤 美咲'],
    customerOwner: '佐藤 太郎',
    customerStakeholders: ['山田 次郎', '鈴木 花子'],
    project: '営業支援システム導入',
    description: '営業活動の効率化と顧客管理の改善を目的としたシステム導入案件。現在のExcel管理からクラウドベースのシステムへの移行を検討中。',
    budget: '500万円',
    deadline: '2025/03/31',
    progress: 65,
    firstContact: '2024/03/15',
    lastContact: '2024/07/20',
    taskCount: 12,
    emailCount: 45,
    meetingCount: 3,
    daysSinceLastContact: 10,
    nextActionDate: '2024/08/05',
    customerPsychology: {
      challenges: [
        '営業活動の進捗管理が煩雑',
        '顧客情報の共有が不十分',
        'レポート作成に時間がかかる'
      ],
      needs: [
        '営業活動の可視化',
        '顧客情報の一元管理',
        'レポートの自動生成'
      ],
      emotionalFactors: [
        '業務改善への強い意欲',
        '新しいツール導入への不安',
        '経営陣への成果報告へのプレッシャー'
      ],
      dailyBenefits: [
        '営業活動の進捗がリアルタイムで把握できる',
        '顧客情報がいつでもどこでも確認できる',
        'レポート作成時間が50%短縮される'
      ]
    },
    decisionMaker: {
      name: '田中 次郎',
      role: '営業部長',
      businessMetrics: {
        roi: '150%',
        costSaving: '年間300万円',
        revenueImpact: '売上20%向上'
      },
      companyImpact: [
        '営業効率の向上',
        '顧客満足度の向上',
        '競合他社との差別化'
      ],
      competitiveAdvantage: [
        '迅速な顧客対応',
        'データドリブンな営業活動',
        '顧客との関係性強化'
      ]
    },
    aiInsights: {
      nextActions: [
        '経営陣への最終提案書の準備',
        'デモンストレーションの実施',
        '導入スケジュールの詳細化'
      ],
      riskFactors: [
        '予算承認の遅れ',
        '他社提案との競合',
        '導入時期の調整'
      ],
      opportunities: [
        '早期導入による先行者利益',
        '他部門への展開可能性',
        '顧客事例としての活用'
      ],
      recommendations: [
        'ROIの具体的な数値提示',
        '段階的導入プランの提案',
        'サポート体制の充実'
      ]
    }
  };

  const timelineData: TimelineEntry[] = [
    {
      id: '1',
      timestamp: new Date('2024-07-20T10:30:00'),
      type: 'meeting',
      title: '最終提案ミーティング',
      content: '経営陣を交えた最終提案を実施。ROIと導入効果について詳細な説明を行い、好意的な反応を得た。',
      author: 'Hirokazu Tanaka',
      aiGenerated: false
    },
    {
      id: '2',
      timestamp: new Date('2024-07-19T16:45:00'),
      type: 'slack',
      title: 'Slackでの技術相談',
      content: 'ABC株式会社のIT部長とSlackで技術的な詳細について相談。システム要件の確認と導入スケジュールについて議論。',
      author: 'Hirokazu Tanaka',
      channel: '#abc-company',
      threadCount: 8,
      aiGenerated: false
    },
    {
      id: '3',
      timestamp: new Date('2024-07-18T14:15:00'),
      type: 'analysis',
      title: '顧客心理分析完了',
      content: 'AIによる顧客心理分析が完了。佐藤様の業務改善への意欲と不安要素を特定。提案内容の調整が必要。',
      author: 'AI Assistant',
      aiGenerated: true,
      humanApproved: true
    },
    {
      id: '4',
      timestamp: new Date('2024-07-17T11:20:00'),
      type: 'slack',
      title: '営業部内での案件共有',
      content: '営業部のSlackチャンネルでABC株式会社案件の進捗を共有。チームメンバーからのフィードバックを受けて提案内容を調整。',
      author: 'Hirokazu Tanaka',
      channel: '#sales-team',
      threadCount: 12,
      aiGenerated: false
    },
    {
      id: '5',
      timestamp: new Date('2024-07-15T09:00:00'),
      type: 'email',
      title: '提案書送付',
      content: '詳細な提案書を送付。予算、スケジュール、導入効果について具体的な数値を含めて説明。',
      author: 'Hirokazu Tanaka',
      aiGenerated: false
    }
  ];

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      setCommentText('');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header className="h-14 min-h-14 w-full flex items-center justify-between px-8 bg-white border-b shadow-sm">
        <span className="text-xl font-bold tracking-tight">営業支援システム</span>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Calendar className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MessageSquare className="w-5 h-5" />
          </Button>
          <Avatar className="w-8 h-8">
            <AvatarFallback>HT</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* パンくず */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 px-8 pt-6 mb-6">
        <div className="w-full max-w-[1280px] mx-auto flex items-center space-x-2">
          <Home className="w-4 h-4" />
          <ChevronRight className="w-4 h-4" />
          <Link href="/cases" className="text-gray-700 font-medium hover:text-gray-900 transition-colors">案件一覧</Link>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div className="flex-1 px-8 pb-8">
        <div className="w-full max-w-[1280px] mx-auto">
          {/* 案件ヘッダー */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{caseData.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-700">担当: Hirokazu Tanaka</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  ブックマーク
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  設定
                </Button>
                <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  アクション
                </Button>
              </div>
            </div>

            {/* 統計セクション - シンプルなデザイン */}
            <div className="bg-white border border-gray-100 rounded-xl shadow px-6 py-4 mb-6">
              <div className="grid grid-cols-6 gap-4">
                <div className="text-left border-r border-gray-200 pr-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1 whitespace-nowrap">期限</div>
                  <div className="text-sm text-gray-700">
                    {(() => {
                      const today = new Date();
                      const deadline = new Date(caseData.deadline);
                      const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      return `${caseData.deadline}（${diff}日）`;
                    })()}
                  </div>
                </div>
                <div className="text-left border-r border-gray-200 pr-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1 whitespace-nowrap">次回アクション日</div>
                  <div className="text-sm text-gray-700">{caseData.nextActionDate}</div>
                </div>
                <div className="text-left border-r border-gray-200 pr-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1 whitespace-nowrap">進捗率</div>
                  <div className="text-sm text-gray-700">{caseData.progress}%</div>
                </div>
                <div className="text-left border-r border-gray-200 pr-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1 whitespace-nowrap">商談回数</div>
                  <div className="text-sm text-gray-700">{caseData.meetingCount}回</div>
                </div>
                <div className="text-left border-r border-gray-200 pr-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1 whitespace-nowrap">ステータス</div>
                  <div className="text-sm text-gray-700">{caseData.status}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-700 mb-1 whitespace-nowrap">リスク</div>
                  <div className="text-sm text-gray-700">競合他社の参入</div>
                </div>
              </div>
            </div>
          </div>

          {/* タブコンテンツと基本情報の2カラムレイアウト */}
          <div className="flex gap-6">
            {/* 左カラム - タブコンテンツ */}
            <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-gray-100 flex-shrink-0">
                    <TabsTrigger value="tasks" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      タスク
                    </TabsTrigger>
                    <TabsTrigger value="emails" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      メール
                    </TabsTrigger>
                    <TabsTrigger value="slack" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Slack
                    </TabsTrigger>
                    <TabsTrigger value="meetings" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      商談
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      活動履歴
                    </TabsTrigger>
                    <TabsTrigger value="customer" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      顧客心理
                    </TabsTrigger>
                    <TabsTrigger value="decision" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <PieChart className="w-4 h-4" />
                      決裁者
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI分析
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 顧客心理タブ */}
                <TabsContent value="customer" className="mt-6">
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow">
                      <div className="pt-6 px-6">
                        <SectionTitle
                          icon={Heart}
                          title="顧客の課題・感情"
                        />
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">現在の課題</h4>
                          <div className="space-y-2">
                            {caseData.customerPsychology.challenges.map((challenge, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{challenge}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">ニーズ</h4>
                          <div className="space-y-2">
                            {caseData.customerPsychology.needs.map((need, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Target className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{need}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">感情的要因</h4>
                          <div className="space-y-2">
                            {caseData.customerPsychology.emotionalFactors.map((factor, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Heart className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{factor}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow">
                      <div className="pt-6 px-6">
                        <SectionTitle
                          icon={Zap}
                          title="日常業務への効果"
                        />
                      </div>
                      <div className="p-6">
                        <div className="space-y-2">
                          {caseData.customerPsychology.dailyBenefits.map((benefit, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-gray-600" />
                            提案のポイント
                          </h4>
                          <p className="text-sm text-gray-700">
                            佐藤様は業務改善への強い意欲を持っている一方で、新しいツール導入への不安も感じています。
                            具体的な数値と安心できる導入サポートを強調することが重要です。
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 決裁者タブ */}
                <TabsContent value="decision" className="mt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow">
                      <div className="pt-6 px-6">
                        <SectionTitle
                          icon={PieChart}
                          title="経営指標・ROI"
                        />
                      </div>
                      <div className="p-6 space-y-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">経営指標</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">ROI</span>
                              <span className="font-semibold text-gray-900">{caseData.decisionMaker.businessMetrics.roi}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">コスト削減</span>
                              <span className="font-semibold text-gray-900">{caseData.decisionMaker.businessMetrics.costSaving}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-700">売上への影響</span>
                              <span className="font-semibold text-gray-900">{caseData.decisionMaker.businessMetrics.revenueImpact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow">
                      <div className="pt-6 px-6">
                        <SectionTitle
                          icon={TrendingUp}
                          title="競合優位性"
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">企業への影響</h4>
                          <div className="space-y-2">
                            {caseData.decisionMaker.companyImpact.map((impact, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{impact}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">競合優位性</h4>
                          <div className="space-y-2">
                            {caseData.decisionMaker.competitiveAdvantage.map((advantage, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <Star className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-700">{advantage}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* AI分析タブ */}
                <TabsContent value="analysis" className="mt-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow">
                      <div className="pt-6 px-6">
                        <SectionTitle
                          icon={Brain}
                          title="次のアクション"
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        {caseData.aiInsights.nextActions.map((action, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                            <Target className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow">
                      <div className="pt-6 px-6">
                        <SectionTitle
                          icon={CheckCircle2}
                          title="推奨事項"
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        {caseData.aiInsights.recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                            <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-blue-700">{recommendation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 履歴タブ */}
                <TabsContent value="timeline" className="mt-6">
                  <div className="bg-white border border-gray-200 rounded-xl shadow">
                    <div className="pt-6 px-6">
                      <SectionTitle
                        icon={Calendar}
                        title="営業活動履歴"
                      />
                    </div>
                    <div className="p-6">
                      <div className="relative">
                        {/* タイムラインの縦線 */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        <div className="space-y-8">
                          {timelineData.map((entry, index) => (
                            <div key={entry.id} className="relative">
                              <div className="flex items-start gap-4">
                                {/* タイムラインアイコン */}
                                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white ${
                                  entry.aiGenerated
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {entry.type === 'analysis' && <Brain className="w-5 h-5" />}
                                  {entry.type === 'ai' && <Zap className="w-5 h-5" />}
                                  {entry.type === 'comment' && <MessageSquare className="w-5 h-5" />}
                                  {entry.type === 'meeting' && <Calendar className="w-5 h-5" />}
                                  {entry.type === 'email' && <Mail className="w-5 h-5" />}
                                  {entry.type === 'slack' && <MessageSquare className="w-5 h-5" />}
                                </div>

                                {/* コンテンツ */}
                                <div className="flex-1 min-w-0 bg-gray-50 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-gray-900">{entry.title}</h4>
                                    {entry.aiGenerated && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                        AI生成
                                      </span>
                                    )}
                                    {entry.humanApproved && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                        承認済み
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                                    {entry.content}
                                  </div>

                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="font-medium">{entry.author}</span>
                                    {entry.channel && (
                                      <span className="text-blue-600 font-medium">#{entry.channel}</span>
                                    )}
                                    <span>
                                      {`${entry.timestamp.getFullYear()}/${String(entry.timestamp.getMonth() + 1).padStart(2, '0')}/${String(entry.timestamp.getDate()).padStart(2, '0')}`} {' '}
                                      {entry.timestamp.toLocaleTimeString('ja-JP', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    {entry.replies && <span>{entry.replies}件の返信</span>}
                                    {entry.threadCount && <span>{entry.threadCount}件のスレッド</span>}
                                  </div>
                                </div>

                                {/* アクションボタン */}
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* コメント入力 */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <Textarea
                          placeholder="コメントを入力..."
                          className="w-full mb-4"
                          rows={3}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              ファイル
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Brain className="w-4 h-4 mr-2" />
                              AI分析依頼
                            </Button>
                          </div>
                          <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                            投稿
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Slackタブ */}
                <TabsContent value="slack" className="mt-6">
                  <div className="bg-white border border-gray-200 rounded-xl shadow">
                    <div className="pt-6 px-6">
                      <SectionTitle
                        icon={MessageSquare}
                        title="Slack履歴"
                      />
                    </div>
                    <div className="p-6">
                      <div className="relative">
                        {/* タイムラインの縦線 */}
                        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        <div className="space-y-8">
                          {timelineData
                            .filter(entry => entry.type === 'slack')
                            .map((entry, index) => (
                            <div key={entry.id} className="relative">
                              <div className="flex items-start gap-4">
                                {/* タイムラインアイコン */}
                                <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white bg-blue-50 text-blue-600">
                                  <MessageSquare className="w-5 h-5" />
                                </div>

                                {/* コンテンツ */}
                                <div className="flex-1 min-w-0 bg-blue-50 rounded-lg p-4 border border-blue-100">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-medium text-gray-900">{entry.title}</h4>
                                    {entry.aiGenerated && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                        AI生成
                                      </span>
                                    )}
                                    {entry.humanApproved && (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                        承認済み
                                      </span>
                                    )}
                                  </div>

                                  <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                                    {entry.content}
                                  </div>

                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="font-medium">{entry.author}</span>
                                    {entry.channel && (
                                      <span className="text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">
                                        #{entry.channel}
                                      </span>
                                    )}
                                    <span>
                                      {`${entry.timestamp.getFullYear()}/${String(entry.timestamp.getMonth() + 1).padStart(2, '0')}/${String(entry.timestamp.getDate()).padStart(2, '0')}`} {' '}
                                      {entry.timestamp.toLocaleTimeString('ja-JP', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </span>
                                    {entry.replies && <span>{entry.replies}件の返信</span>}
                                    {entry.threadCount && (
                                      <span className="text-blue-600 font-medium">
                                        {entry.threadCount}件のスレッド
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* アクションボタン */}
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Slack統計 */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4">Slack統計</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-900">
                              {timelineData.filter(entry => entry.type === 'slack').length}
                            </div>
                            <div className="text-sm text-gray-600">総メッセージ数</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-900">
                              {timelineData
                                .filter(entry => entry.type === 'slack')
                                .reduce((sum, entry) => sum + (entry.threadCount || 0), 0)}
                            </div>
                            <div className="text-sm text-gray-600">総スレッド数</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-semibold text-gray-900">
                              {new Set(timelineData
                                .filter(entry => entry.type === 'slack')
                                .map(entry => entry.channel)
                                .filter(Boolean)).size}
                            </div>
                            <div className="text-sm text-gray-600">使用チャンネル数</div>
                          </div>
                        </div>
                      </div>

                      {/* コメント入力 */}
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <Textarea
                          placeholder="Slackでのやりとりについてコメントを入力..."
                          className="w-full mb-4"
                          rows={3}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              ファイル
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Brain className="w-4 h-4 mr-2" />
                              AI分析依頼
                            </Button>
                          </div>
                          <Button onClick={handleAddComment} disabled={!commentText.trim()}>
                            投稿
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* タスクタブ */}
                <TabsContent value="tasks" className="mt-6">
                  <div className="bg-white border border-gray-200 rounded-xl shadow">
                    <div className="pt-6 px-6">
                      <SectionTitle
                        icon={CheckCircle2}
                        title="関連タスク"
                      />
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">タスクA</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">タスクB</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">タスクC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* メールタブ */}
                <TabsContent value="emails" className="mt-6">
                  <div className="bg-white border border-gray-200 rounded-xl shadow">
                    <div className="pt-6 px-6">
                      <SectionTitle
                        icon={Mail}
                        title="関連メール"
                      />
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">メールA</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">メールB</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">メールC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* 商談タブ */}
                <TabsContent value="meetings" className="mt-6">
                  <div className="bg-white border border-gray-200 rounded-xl shadow">
                    <div className="pt-6 px-6">
                      <SectionTitle
                        icon={Calendar}
                        title="商談履歴"
                      />
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">商談A</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">商談B</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-sm text-gray-700">商談C</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* 右カラム - 基本情報 */}
            <div className="w-96">
              {/* 基本情報セクション */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl shadow">
                  <div className="pt-6 px-6">
                    <SectionTitle
                      icon={FileText}
                      title="基本情報"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">案件ID</div>
                      <div className="text-sm text-gray-900">{caseData.id}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">案件名</div>
                      <div className="text-sm text-gray-900">{caseData.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">案件状況</div>
                      <div className="text-sm text-gray-900">{caseData.status}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">優先度</div>
                      <div className="text-sm text-gray-900">{caseData.priority}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">担当者</div>
                      <div className="text-sm text-gray-900">{caseData.assignee}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">顧客担当者</div>
                      <div className="text-sm text-gray-900">{caseData.customerOwner}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">プロジェクト</div>
                      <div className="text-sm text-gray-900">{caseData.project}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">説明</div>
                      <div className="text-sm text-gray-900">{caseData.description}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">予算</div>
                      <div className="text-sm text-gray-900">{caseData.budget}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">期限</div>
                      <div className="text-sm text-gray-900">{caseData.deadline}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">進捗率</div>
                      <div>
                        <div className="font-semibold text-gray-900">{caseData.progress}%</div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                          <div
                            className="bg-gray-800 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${caseData.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">最終連絡</div>
                      <div className="font-semibold text-gray-900">{caseData.lastContact}</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">連絡日数</div>
                      <div className="font-semibold text-gray-900">{caseData.daysSinceLastContact}日</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 