"use client";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  AlertTriangle,
  BarChart,
  Brain,
  Building,
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
  User,
  Users,
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
  sourceChannel?: string; // アクションの発生源チャンネル（Slack、メール、電話など）
};

export default function CaseDetailPage() {
  const [activeTab, setActiveTab] = useState('timeline');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic-info']));
  const [commentText, setCommentText] = useState('');
  const [unreadEmails, setUnreadEmails] = useState<Set<string>>(new Set(['1', '2', '3'])); // 未読メールのIDを管理（メール1、2、3を未読に設定）

  // ダミーデータ
  const caseData: Case = {
    id: 'case-001',
    name: '契約書レビュー支援ツールのご提案',
    company: 'ABC物流株式会社',
    customerType: '既存',
    status: '提案中',
    priority: '高',
    assignee: 'Hirokazu Tanaka',
    stakeholders: ['田中 博一', '佐藤 美咲'],
    customerOwner: '佐藤 太郎',
    customerStakeholders: ['山田 次郎', '鈴木 花子'],
    project: '契約書レビュー支援ツール導入',
    description: '法務部門の業務効率化を目的とした契約書レビュー支援ツールの導入案件。現在の手動レビュープロセスからAI支援による自動チェック機能を活用した効率的なワークフローへの移行を検討中。',
    budget: '300万円',
    deadline: '2025/02/28',
    progress: 75,
    firstContact: '2024/04/10',
    lastContact: '2024/07/20',
    taskCount: 8,
    emailCount: 32,
    meetingCount: 4,
    daysSinceLastContact: 5,
    nextActionDate: '2024/07/25',
    customerPsychology: {
      challenges: [
        '契約書レビューに時間がかかりすぎる',
        '法務担当者の負荷が高い',
        'レビュー品質のばらつきがある'
      ],
      needs: [
        'レビュー時間の短縮',
        '品質の標準化',
        'リスク検出の自動化'
      ],
      emotionalFactors: [
        '業務効率化への強い期待',
        'AIツール導入への慎重な姿勢',
        '法的リスク軽減への安心感'
      ],
      dailyBenefits: [
        '契約書レビュー時間が70%短縮される',
        'リスク検出精度が向上する',
        '法務担当者の負荷が軽減される'
      ]
    },
    decisionMaker: {
      name: '田中 次郎',
      role: '法務部長',
      businessMetrics: {
        roi: '200%',
        costSaving: '年間200万円',
        revenueImpact: 'リスク軽減効果'
      },
      companyImpact: [
        '法務業務の効率化',
        '契約リスクの軽減',
        'コンプライアンス強化'
      ],
      competitiveAdvantage: [
        '迅速な契約締結',
        'リスク管理の向上',
        '法務コストの削減'
      ]
    },
    aiInsights: {
      nextActions: [
        '最終提案書の準備',
        'デモンストレーションの実施',
        '導入スケジュールの確定'
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
      content: "【When】7月20日 10:30-12:00 【Where】ABC物流本社会議室 【Who】法務部長・田中次郎、IT部長・山田太郎、営業担当・田中博一 【What】最終提案とROI説明 【Why】契約締結に向けた最終確認 【How】プレゼン資料でROI 200%・年間200万円削減効果を説明。経営陣から前向きな反応。",
      author: "田中博一",
      aiGenerated: false,
      sourceChannel: "ミーティング"
    },
    {
      id: "2",
      timestamp: new Date("2024-07-19T17:00:00"),
      type: "slack",
      title: "法務部長からの追加要件依頼",
      content: "【When】7月19日 17:00 【Where】Slack #abc-legal 【Who】法務部長・田中次郎、営業担当・田中博一 【What】契約書レビュー機能の追加要件確認 【Why】社内規定との自動照合機能を追加希望 【How】Slackで要件リストを共有し、開発チームへ展開依頼。",
      author: "田中次郎",
      channel: "abc-legal",
      threadCount: 3,
      aiGenerated: false,
      sourceChannel: "Slack"
    },
    {
      id: "3",
      timestamp: new Date("2024-07-19T09:30:00"),
      type: "email",
      title: "顧客からのリマインドメール",
      content: "【When】7月19日 9:30 【Where】メール 【Who】顧客担当・佐藤太郎、営業担当・田中博一 【What】提案書送付のリマインド 【Why】社内決裁のため早期提出希望 【How】顧客より丁寧なリマインドメール。提出予定日を返信。",
      author: "佐藤太郎",
      aiGenerated: false,
      sourceChannel: "メール"
    },
    {
      id: "4",
      timestamp: new Date("2024-07-18T15:00:00"),
      type: "analysis",
      title: "Selaによる競合分析レポート提出",
      content: "【When】7月18日 15:00 【Where】社内AIシステム 【Who】Sela、営業担当・田中博一 【What】競合A社・B社の提案内容分析 【Why】差別化ポイントの明確化 【How】Selaが価格・機能・サポート体制を比較し、当社の優位性をレポート。",
      author: "Sela",
      aiGenerated: true,
      humanApproved: true,
      sourceChannel: "分析"
    },
    {
      id: "5",
      timestamp: new Date("2024-07-17T13:00:00"),
      type: "meeting",
      title: "開発チームとの仕様すり合わせ",
      content: "【When】7月17日 13:00-14:00 【Where】Zoom 【Who】開発リーダー・佐藤美咲、営業担当・田中博一 【What】要件定義の最終確認 【Why】追加要件の反映と納期調整 【How】Zoomで画面共有しながら仕様を確認。納期を1週間前倒しで合意。",
      author: "佐藤美咲",
      aiGenerated: false,
      sourceChannel: "ミーティング"
    },
    {
      id: "6",
      timestamp: new Date("2024-07-16T18:30:00"),
      type: "slack",
      title: "営業部内での進捗共有",
      content: "【When】7月16日 18:30 【Where】Slack #abc-sales 【Who】営業担当全員 【What】案件進捗の週次報告 【Why】全体の状況把握と課題共有 【How】Slackで進捗表を共有し、課題点をコメントで収集。",
      author: "田中博一",
      channel: "abc-sales",
      threadCount: 5,
      aiGenerated: false,
      sourceChannel: "Slack"
    },
    {
      id: "7",
      timestamp: new Date("2024-07-15T10:00:00"),
      type: "email",
      title: "法務部長への仕様確認メール",
      content: "【When】7月15日 10:00 【Where】メール 【Who】営業担当・田中博一、法務部長・田中次郎 【What】契約書自動チェック仕様の確認依頼 【Why】要件の最終確定 【How】仕様書を添付し、追加要望があれば返信依頼。",
      author: "田中博一",
      aiGenerated: false,
      sourceChannel: "メール"
    },
    {
      id: "8",
      timestamp: new Date("2024-07-14T16:00:00"),
      type: "analysis",
      title: "Selaによる顧客心理分析フィードバック",
      content: "【When】7月14日 16:00 【Where】社内AIシステム 【Who】Sela、営業担当・田中博一 【What】顧客の意思決定要因分析 【Why】提案内容の最適化 【How】Selaが過去のやりとりから顧客の重視ポイントを抽出し、提案書に反映。",
      author: "Sela",
      aiGenerated: true,
      humanApproved: true,
      sourceChannel: "分析"
    },
    {
      id: "9",
      timestamp: new Date("2024-07-13T11:00:00"),
      type: "meeting",
      title: "顧客キックオフミーティング",
      content: "【When】7月13日 11:00-12:00 【Where】ABC物流本社会議室 【Who】顧客担当・佐藤太郎、営業担当・田中博一、法務部長・田中次郎 【What】プロジェクト開始の顔合わせとゴール共有 【Why】全員の認識合わせ 【How】今後の進め方・連絡体制・スケジュールを確認。",
      author: "佐藤太郎",
      aiGenerated: false,
      sourceChannel: "ミーティング"
    },
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
                  <TabsList className="bg-gray-100 flex-shrink-0 w-full">
                    <TabsTrigger value="timeline" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      活動履歴
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      関連タスク
                    </TabsTrigger>
                    <TabsTrigger value="emails" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      メール
                    </TabsTrigger>
                    <TabsTrigger value="slack" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Slack
                    </TabsTrigger>
                    <TabsTrigger value="customer" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      顧客現状分析
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="text-gray-700 font-normal text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Sela予測分析
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 顧客分析タブ */}
                <TabsContent value="customer" className="mt-6">
                  <div className="space-y-6">
                    {/* セクション1: 基本情報 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        基本情報
                      </h3>
                      <div className="space-y-3">
                        {/* 顧客心理スコア */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Heart className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">顧客心理スコア</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">信頼度: 85%</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">関心度: 高</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                最終更新: 7月20日 | 分析者: Sela
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 決裁者情報 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <User className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">決裁者: 田中次郎（法務部長）</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">最終決裁権限</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                関心事: ROI重視、競合優位性、営業効率化
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* セクション2: 課題・ニーズ */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        課題・ニーズ
                      </h3>
                      <div className="space-y-3">
                        {/* 現在の課題 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">現在の課題</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">3件</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                契約書レビューに時間がかかりすぎる、法務担当者の負荷が高い、レビュー品質のばらつきがある
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 優先ニーズ */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Target className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">優先ニーズ</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">レビュー時間の短縮</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                レビュー時間が70%短縮される、リスク検出精度が向上する、法務担当者の負荷が軽減される
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 感情的要因 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Heart className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">感情的要因</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">不安要素あり</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                業務効率化への強い期待、AIツール導入への慎重な姿勢、法的リスク軽減への安心感
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* セクション3: ビジネス価値 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <PieChart className="w-4 h-4" />
                        ビジネス価値
                      </h3>
                      <div className="space-y-3">
                        {/* ROI・経営指標 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <PieChart className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">ROI・経営指標</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">ROI: 200%</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">リスク軽減効果</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                年間200万円削減、リスク軽減効果、コンプライアンス強化
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 競合優位性 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">競合優位性</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">迅速な契約締結</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">リスク管理の向上</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                迅速な契約締結、リスク管理の向上、法務コストの削減
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 企業への影響 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Building className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">企業への影響</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">全社効果</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                営業効率向上、顧客満足度向上、競合他社との差別化、他部門展開可能
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 期待効果 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">期待効果</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">時短70%</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                リアルタイム進捗把握、いつでもどこでも顧客情報確認、レポート作成時間70%短縮
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* セクション4: 対応策・リスク */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        対応策・リスク
                      </h3>
                      <div className="space-y-3">
                        {/* 推奨アプローチ */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Target className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">推奨アプローチ</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Sela提案</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                ROI数値を前面に、競合比較資料準備、他社導入事例の具体的効果を提示
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* リスク・機会 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">リスク・機会</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">要注意</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                リスク: 予算承認遅れ、競合参入 | 機会: 早期導入利益、他部門展開
                              </div>
                            </div>
                          </div>
                        </div>
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
                                {entry.sourceChannel && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mr-2">
                                    {entry.sourceChannel}
                                  </span>
                                )}
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
                            <div className="text-sm text-gray-700 leading-relaxed">
                              {(() => {
                                const contentParts = entry.content.split("【");
                                if (contentParts.length <= 1) return entry.content;
                                
                                // WhatとWhyの情報のみを抽出して短くまとめる
                                let what = "";
                                let why = "";
                                
                                contentParts.forEach((part, index) => {
                                  if (index === 0) return;
                                  const [tag, ...contentParts] = part.split("】");
                                  const content = contentParts.join("】").trim();
                                  
                                  if (tag === "What" && content) {
                                    what = content;
                                  } else if (tag === "Why" && content) {
                                    why = content;
                                  }
                                });
                                
                                if (what && why) {
                                  return `${what}。${why}。`;
                                } else if (what) {
                                  return `${what}。`;
                                } else if (why) {
                                  return `${why}。`;
                                }
                                
                                return entry.content;
                              })()}
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
                              <img src="/avatars/tanaka.jpg" alt="田中次郎" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">田中次郎</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">#abc-legal</span>
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
                              <img src="/avatars/sato.jpg" alt="佐藤美咲" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">佐藤美咲</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">田中部長、承知いたしました。開発チームと調整して、明日の午後にミーティングを設定いたします。

また、契約書レビュー支援ツールの機能について、以下の追加要件も検討いただけますでしょうか：

- 過去の契約書との比較分析機能
- リスクスコアの自動算出
- 承認者への自動通知機能

これらの機能があれば、より効率的なレビュープロセスが実現できると思います。</p>
                            </div>
                          </div>
                        </div>

                        {/* 返信2 */}
                        <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              <img src="/avatars/tanaka.jpg" alt="田中次郎" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-sm font-semibold text-gray-900">田中次郎</span>
                                </div>
                                <span className="text-sm leading-normal text-gray-600">7月19日</span>
                              </div>
                              <p className="text-sm leading-relaxed text-gray-700">佐藤さん、ありがとうございます。追加要件についても検討いたします。

特に過去の契約書との比較分析機能は、リスク管理の観点から非常に重要だと思います。明日のミーティングで詳細を確認させていただきます。</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* 関連タスクタブ */}
                <TabsContent value="tasks" className="mt-6">
                  <div className="space-y-0">
                    {/* タスク1 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">最終提案書の作成</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">高</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">進行中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月25日 | 担当: 田中博一
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
                            <span className="text-sm font-semibold text-gray-900">デモンストレーション準備</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">高</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">進行中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月26日 | 担当: 佐藤美咲
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
                            <span className="text-sm font-semibold text-gray-900">要件定義書の最終確認</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">中</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">待機中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月27日 | 担当: 田中次郎
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
                            <span className="text-sm font-semibold text-gray-900">導入スケジュールの確定</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">高</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">進行中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月28日 | 担当: 佐藤美咲
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">計画中</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 8月10日 | 担当: 田中博一
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
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">低</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">完了</span>
                          </div>
                          <div className="text-[13px] leading-normal text-gray-600 mb-1">
                            期限: 7月20日 | 担当: 佐藤美咲
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
                          <img src="/avatars/tanaka.jpg" alt="田中次郎" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-sm ${unreadEmails.has('1') ? 'font-bold' : 'font-semibold'} text-gray-900`}>田中次郎</span>
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
                          <img src="/avatars/sato.jpg" alt="佐藤太郎" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-sm ${unreadEmails.has('2') ? 'font-bold' : 'font-semibold'} text-gray-900`}>佐藤太郎</span>
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
                          <img src="/avatars/sato.jpg" alt="佐藤美咲" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-sm ${unreadEmails.has('3') ? 'font-bold' : 'font-semibold'} text-gray-900`}>佐藤美咲</span>
                              {unreadEmails.has('3') && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                  未読
                                </span>
                              )}
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月17日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm leading-relaxed ${unreadEmails.has('3') ? 'font-bold' : 'font-normal'} text-gray-700 flex-1 line-clamp-1`}>契約書レビュー支援ツールの機能について、追加要件を整理いたしました。社内規定との自動照合機能について詳しく説明いただけますでしょうか。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メール4 */}
                    <div className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/sela.jpg" alt="Sela" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-semibold text-gray-900">Sela</span>
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月16日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm leading-relaxed text-gray-700 flex-1 line-clamp-1">競合分析レポートが完成いたしました。ABC物流様の要件に最適化された提案内容をまとめております。ご確認ください。</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* メール5 */}
                    <div className="p-3 hover:bg-gray-50 cursor-pointer rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                          <img src="/avatars/sela.jpg" alt="Sela" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm font-semibold text-gray-900">Sela</span>
                            </div>
                            <span className="text-sm leading-normal text-gray-600">7月15日</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm leading-relaxed text-gray-700 flex-1 line-clamp-1">顧客心理分析が完了いたしました。法務部門の意思決定要因を分析し、提案書の最適化ポイントをまとめております。</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* AI分析タブ */}
                <TabsContent value="analysis" className="mt-6">
                  <div className="space-y-6">
                    {/* セクション1: 予測分析 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        予測分析
                      </h3>
                      <div className="space-y-3">
                        {/* 成約確率予測 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Brain className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">成約確率予測</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">78%</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">+6%改善</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                最終更新: 7月20日 15:30 | 前回予測: 72% | 分析者: Sela
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 成約時期予測 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">成約時期予測</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">8月中旬</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">高確度</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                予算承認プロセス完了後、2週間以内の成約を予測
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* セクション2: 戦略的アドバイス */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        戦略的アドバイス
                      </h3>
                      <div className="space-y-3">
                        {/* 次回アクション推奨 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Target className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">推奨次回アクション</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">優先度: 高</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                経営陣への最終提案書準備、デモンストレーション実施、導入スケジュール詳細化
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 戦略レコメンデーション */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Lightbulb className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">戦略レコメンデーション</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Sela提案</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                ROI具体数値提示、段階的導入プラン提案、充実サポート体制アピール
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* アプローチ戦略 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">アプローチ戦略</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">最適化済み</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                決裁者への直接アプローチ、ROI重視の提案、競合優位性の強調
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* セクション3: リスク・機会分析 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        リスク・機会分析
                      </h3>
                      <div className="space-y-3">
                        {/* リスク要因 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">リスク要因</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">要注意</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                予算承認の遅れ、他社提案との競合、導入時期の調整が必要
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* チャンス・機会 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">チャンス・機会</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">拡大可能</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                早期導入による先行者利益、他部門への展開可能性、顧客事例としての活用
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 競合分析 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <BarChart className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">競合分析</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">優位性確認</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                市場成長率15%、競合A社より機能・価格優位、当社シェア拡大のチャンス
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* セクション4: 市場・トレンド分析 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart className="w-4 h-4" />
                        市場・トレンド分析
                      </h3>
                      <div className="space-y-3">
                        {/* 市場動向 */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">市場動向</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">成長期</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                営業支援ツール市場は年率20%成長、AI機能への需要が急増中
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 顧客トレンド */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Users className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">顧客トレンド</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">好転</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                物流業界でのデジタル化加速、効率化投資の優先度向上
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 技術トレンド */}
                        <div className="p-3 bg-white border border-gray-100 rounded-md">
                          <div className="flex items-start gap-3">
                            <Zap className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900">技術トレンド</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">先行</span>
                              </div>
                              <div className="text-[13px] leading-normal text-gray-600 mb-1">
                                AI・機械学習の実用化、クラウドベースの統合ソリューションが主流
                              </div>
                            </div>
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