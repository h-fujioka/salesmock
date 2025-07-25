"use client";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionTitle } from "@/components/ui/section-title";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Heart,
  Home,
  Lightbulb,
  Mail,
  MessageSquare,
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
  isUnread?: boolean; // 未読状態
};

export default function CaseDetailPage() {
  const [activeTab, setActiveTab] = useState('customer');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic-info']));
  const [commentText, setCommentText] = useState('');
  const [unreadEmails, setUnreadEmails] = useState<Set<string>>(new Set(['1', '2', '3'])); // 未読メールのIDを管理（メール1、2、3を未読に設定）

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
      id: "1",
      timestamp: new Date("2024-07-20T10:30:00"),
      type: "meeting",
      title: "最終提案ミーティング",
      content: "【When】7月20日 10:30-12:00 【Where】ABC物流本社会議室 【Who】法務部長・佐藤様、IT部長・田中様、営業担当・田中 【What】最終提案とROI説明 【Why】契約締結に向けた最終確認 【How】プレゼン資料を使用し、ROI 200%と年間500万円削減効果を説明。決裁者から前向きな反応。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    },
    {
      id: "2",
      timestamp: new Date("2024-07-19T16:45:00"),
      type: "slack",
      title: "IT部長との技術要件確認",
      content: "【When】7月19日 16:45-17:30 【Where】Slack #abc-company 【Who】IT部長・田中様、営業担当・田中 【What】技術要件とシステム連携の詳細確認 【Why】導入時の技術的課題を事前に解決 【How】Slackで資料を共有しながら、既存システム連携方法とデータ移行手順を確認。セキュリティ要件も明確化。",
      author: "Hirokazu Tanaka",
      channel: "#abc-company",
      threadCount: 8,
      aiGenerated: false
    },
    {
      id: "3",
      timestamp: new Date("2024-07-18T14:15:00"),
      type: "analysis",
      title: "競合他社の動向確認",
      content: "【When】7月18日 14:15-15:00 【Where】営業部オフィス 【Who】営業担当・田中、マーケティング部・鈴木 【What】競合他社A社の提案内容調査 【Why】差別化ポイントの明確化と価格戦略の策定 【How】業界情報と顧客からの情報を収集。A社は我社より20%高い価格で同等機能を提案中。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    },
    {
      id: "4",
      timestamp: new Date("2024-07-17T11:20:00"),
      type: "meeting",
      title: "法務部長との個別面談",
      content: "【When】7月17日 11:20-12:30 【Where】ABC物流法務部会議室 【Who】法務部長・佐藤様、営業担当・田中 【What】導入への懸念事項の確認と安心感の提供 【Why】顧客の不安を解消し、契約締結への道筋を作る 【How】個別面談で懸念事項（精度、責任範囲）を確認。具体的なサポート体制と保証内容を説明。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    },
    {
      id: "5",
      timestamp: new Date("2024-07-16T09:30:00"),
      type: "email",
      title: "予算承認申請の提出",
      content: "【When】7月16日 9:30 【Where】ABC物流経営陣 【Who】経営陣、営業担当・田中 【What】予算承認申請書の提出 【Why】契約締結に必要な予算の承認を得る 【How】ROI計算根拠と他社事例を含む詳細資料を添付してメール送信。承認プロセスは2週間程度の見込み。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    },
    {
      id: "6",
      timestamp: new Date("2024-07-15T14:00:00"),
      type: "meeting",
      title: "初回提案ミーティング",
      content: "【When】7月15日 14:00-16:00 【Where】ABC物流本社会議室 【Who】法務部・IT部合同、営業担当・田中 【What】初回提案と現状課題の説明 【Why】顧客の課題を理解し、解決策を提示する 【How】法務部・IT部合同で現状の課題と解決策を説明。参加者から多くの質問があり、関心の高さを確認。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    },
    {
      id: "7",
      timestamp: new Date("2024-07-14T10:00:00"),
      type: "analysis",
      title: "顧客心理分析完了",
      content: "【When】7月14日 10:00-11:00 【Where】営業部オフィス 【Who】AI Assistant、営業担当・田中 【What】顧客心理分析の実施 【Why】顧客の真のニーズと不安要素を把握する 【How】AIによる顧客心理分析が完了。佐藤法務部長の業務改善への意欲とAI導入への不安要素を特定。提案内容の調整が必要。",
      author: "AI Assistant",
      aiGenerated: true,
      humanApproved: true
    },
    {
      id: "8",
      timestamp: new Date("2024-07-12T16:00:00"),
      type: "email",
      title: "要件定義書の送付",
      content: "【When】7月12日 16:00 【Where】ABC物流法務部 【Who】法務部長・佐藤様、営業担当・田中 【What】要件定義書の送付 【Why】顧客の要件を明確化し、提案内容を具体化する 【How】顧客からの要件を整理した要件定義書をメール送信。契約書の自動チェック機能と承認フローの自動化について具体的な実装方法を記載。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    },
    {
      id: "9",
      timestamp: new Date("2024-07-10T11:00:00"),
      type: "meeting",
      title: "初回商談",
      content: "【When】7月10日 11:00-12:30 【Where】ABC物流本社会議室 【Who】法務部長・佐藤様、営業担当・田中 【What】初回商談と課題ヒアリング 【Why】顧客の現状課題を把握し、ニーズを明確化する 【How】ABC物流の法務部長と初回商談。年間約500件の契約書レビュー業務の課題を確認。工数削減への強いニーズを確認。",
      author: "Hirokazu Tanaka",
      aiGenerated: false
    }
  ];  const toggleSection = (sectionId: string) => {
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

  const handleEmailClick = (emailId: string) => {
    // メールをクリックしたら未読状態を解除
    setUnreadEmails(prev => {
      const newSet = new Set(prev);
      newSet.delete(emailId);
      return newSet;
    });
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
                  <div className="relative">
                    {/* タイムラインの縦線 */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-4">
                      {timelineData.map((entry, index) => (
                        <div key={entry.id} className="relative flex items-start gap-4">
                          {/* タイムラインのアイコン（縦線上に配置） */}
                          <div className="relative z-10 flex-shrink-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                            {entry.type === "analysis" && <Brain className="w-4 h-4 text-gray-600" />}
                            {entry.type === "ai" && <Zap className="w-4 h-4 text-gray-600" />}
                            {entry.type === "comment" && <MessageSquare className="w-4 h-4 text-gray-600" />}
                            {entry.type === "meeting" && <Calendar className="w-4 h-4 text-gray-600" />}
                            {entry.type === "email" && <Mail className="w-4 h-4 text-gray-600" />}
                            {entry.type === "slack" && <MessageSquare className="w-4 h-4 text-gray-600" />}
                          </div>
                          
                          {/* イベント内容 */}
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-900">{entry.title}</span>
                                <div className="flex gap-1">
                                  {entry.aiGenerated && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                      AI生成
                                    </span>
                                  )}
                                  {entry.humanApproved && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                      承認済み
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-sm text-gray-500 underline">
                                {`${entry.timestamp.getFullYear()}/${String(entry.timestamp.getMonth() + 1).padStart(2, "0")}/${String(entry.timestamp.getDate()).padStart(2, "0")}`}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">{entry.author}</span>
                              {entry.channel && ` • #${entry.channel}`}
                              {entry.threadCount && ` • ${entry.threadCount}件`}
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                              {entry.content.split("【").map((part, index) => {
                                if (index === 0) return null;
                                const [tag, ...contentParts] = part.split("】");
                                const content = contentParts.join("】");
                                return (
                                  <div key={index} className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                                      {tag}
                                    </span>
                                    <span className="text-sm text-gray-700">{content}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                {/* Slackタブ */}
                <TabsContent value="slack" className="mt-6">
                  <div className="space-y-0">
                    {/* スレッドの詳細表示 */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="flex-1 min-w-0 space-y-1">
                        {/* メインメッセージ */}
                        <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src="/avatars/yamada.jpg" alt="山田太郎" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">山田太郎</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">#abc-company</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">ABC物流様向けの契約書レビュー支援ツールの提案について、法務部門の要件を確認したところ、以下の点について検討が必要かと思います：

1. 契約書の自動チェック機能の範囲
2. 社内規定との整合性確認の仕組み
3. 承認フローの自動化レベル

これらの要件について、開発チームと確認したいのですが、ミーティングの設定をお願いできますでしょうか？</p>
                            </div>
                          </div>
                        </div>

                        {/* 返信1 */}
                        <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src="/avatars/suzuki.jpg" alt="鈴木花子" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">鈴木花子</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">承知しました。開発チームのスケジュールを確認したところ、来週火曜日の14時から1時間程度であれば調整可能です。その時間帯でミーティングを設定させていただいてもよろしいでしょうか？</p>
                            </div>
                          </div>
                        </div>

                        {/* 返信2 */}
                        <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src="/avatars/yamada.jpg" alt="山田太郎" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">山田太郎</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">はい、火曜日14時で問題ありません。ABC物流様の法務部門からの具体的な要件も整理できていますので、その内容も含めて議論できればと思います。</p>
                            </div>
                          </div>
                        </div>

                        {/* 返信3 */}
                        <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src="/avatars/sato.jpg" alt="佐藤美咲" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">佐藤美咲</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">コスト面での詳細分析も含めて検討したいと思います。導入効果の測定方法についても議論できればと思います。</p>
                            </div>
                          </div>
                        </div>

                        {/* 返信4 */}
                        <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src="/avatars/tanaka.jpg" alt="田中博一" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">田中博一</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">セキュリティ要件の確認も重要ですね。特に契約書データの暗号化と アクセス制御について詳しく確認したいと思います。</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* タスクタブ */}
                <TabsContent value="tasks" className="mt-6">
                  <div className="space-y-0">
                    {/* タスク1 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">契約条件の最終確認</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">高</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月25日 | 担当: 田中博一 | ステータス: 進行中
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* タスク2 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">導入スケジュールの調整</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月30日 | 担当: 佐藤美咲 | ステータス: 待機中
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* タスク3 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">技術要件の詳細確認</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">低</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 8月5日 | 担当: 山田太郎 | ステータス: 未着手
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* タスク4 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">セキュリティ要件の確認</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">高</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月28日 | 担当: 鈴木花子 | ステータス: 進行中
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* タスク5 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">導入後サポート体制の準備</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 8月10日 | 担当: 田中博一 | ステータス: 計画中
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* タスク6 */}
                    <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">契約書の最終確認</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">完了</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月20日 | 担当: 佐藤美咲 | ステータス: 完了
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* メールタブ */}
                <TabsContent value="emails" className="mt-6">
                  <div className="space-y-0">
                    {/* メール1 */}
                    <div 
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md"
                      onClick={() => handleEmailClick('1')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/sato.jpg" alt="佐藤美咲" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-sm ${unreadEmails.has('1') ? 'font-bold' : 'font-semibold'} text-gray-900`}>佐藤美咲</span>
                              {unreadEmails.has('1') && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                  未読
                                </span>
                              )}
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月20日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm leading-relaxed ${unreadEmails.has('1') ? 'font-bold' : 'font-normal'} text-gray-700 flex-1 line-clamp-1`}>最終提案について、経営陣への説明資料をお送りいただきありがとうございます。ROIの詳細な計算根拠が明確で非常に分かりやすかったです。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メール2 */}
                    <div 
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md"
                      onClick={() => handleEmailClick('2')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/tanaka.jpg" alt="田中博一" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-sm ${unreadEmails.has('2') ? 'font-bold' : 'font-semibold'} text-gray-900`}>田中博一</span>
                              {unreadEmails.has('2') && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                  未読
                                </span>
                              )}
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月18日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm leading-relaxed ${unreadEmails.has('2') ? 'font-bold' : 'font-normal'} text-gray-700 flex-1 line-clamp-1`}>技術的な質問についてご回答いただき、ありがとうございます。既存システムとの連携について、追加で確認したい点があります。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メール3 */}
                    <div 
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md"
                      onClick={() => handleEmailClick('3')}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/yamada.jpg" alt="山田太郎" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-sm ${unreadEmails.has('3') ? 'font-bold' : 'font-normal'} text-gray-900`}>山田太郎</span>
                              {unreadEmails.has('3') && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                  未読
                                </span>
                              )}
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月16日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm leading-relaxed ${unreadEmails.has('3') ? 'font-bold' : 'font-normal'} text-gray-700 flex-1 line-clamp-1`}>競合他社分析資料をお送りします。機能比較表と価格体系の違いについてまとめましたので、ご参考ください。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メール4 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/suzuki.jpg" alt="鈴木花子" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-normal text-gray-900">鈴木花子</span>
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月14日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm leading-relaxed font-normal text-gray-700 flex-1 line-clamp-1">導入スケジュールの詳細案を作成いたしました。段階的な導入により、業務への影響を最小限に抑える計画となっています。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メール5 */}
                    <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/sato.jpg" alt="佐藤美咲" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-normal text-gray-900">佐藤美咲</span>
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月12日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm leading-relaxed font-normal text-gray-700 flex-1 line-clamp-1">予算申請の承認を得るために、ROIの詳細な計算根拠をお示しいただけますでしょうか。経営陣への説明資料として使用したいと思います。</p>
                          </div>
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
                  <div className="p-6 space-y-7">
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