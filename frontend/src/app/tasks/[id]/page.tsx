import TaskDetailClient from "../task-1/TaskDetailClient";

// 静的生成するパラメータを定義
export async function generateStaticParams() {
  // タスクIDの一覧を返す
  return [
    { id: 'task-001' },
    { id: 'task-002' },
    { id: 'task-003' },
    { id: 'task-004' },
    { id: 'task-005' },
    { id: 'task-006' },
    { id: 'task-007' },
    { id: 'task-008' },
    { id: 'task-009' },
    { id: 'task-010' },
  ]
}

// ダミータスクデータ
const dummyTasks = [
  {
    taskId: "task-001",
    task: "顧客Aへ見積送付",
    caseName: "見積書について",
    project: "リーガル社新規銃中案件",
    customerType: "新規",
    priority: "高",
    assignee: "山田太郎",
    deadline: "2024/07/10",
    daysLeft: "3日",
    status: "進行中",
    auto: "Sela自動",
    approval: "承認待ち",
    description: "顧客Aに見積書を送付するタスクです。前回の商談内容を踏まえて、適切な価格設定とサービス内容を含めた見積書を作成します。",
    progress: 60,
    aiSuggestions: [
      "見積書に競合他社との比較表を追加",
      "顧客の予算に合わせた複数プランの提示",
      "過去の成功事例を添付資料として追加"
    ]
  },
  {
    taskId: "task-002",
    task: "商談Bの準備",
    caseName: "次回商談の件",
    project: "B社案件",
    customerType: "既存",
    priority: "中",
    assignee: "鈴木一郎",
    deadline: "2024/07/12",
    daysLeft: "1日",
    status: "未着手",
    auto: "手動",
    approval: "",
    description: "B社との次回商談に向けた準備を行います。前回の議事録を確認し、顧客の課題とニーズを整理して、効果的な提案資料を作成します。",
    progress: 0,
    aiSuggestions: [
      "前回商談の議事録から主要な課題を抽出",
      "競合他社の動向調査を実施",
      "顧客の業界動向を調査して提案内容に反映"
    ]
  }
]

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = dummyTasks.find(t => t.taskId === params.id);
  
  if (!task) return <div>Task not found</div>;

  return <TaskDetailClient task={task} />;
} 