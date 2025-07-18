// フォローアップ候補のダミーデータAPI (GET)
import { NextResponse } from 'next/server';

export async function GET() {
  // ダミーデータを返す
  const candidates = [
    {
      id: 1,
      name: "山田太郎",
      company: "株式会社A",
      project: "新製品導入プロジェクト",
      lastContact: "2024/03/01",
      status: "提案済み",
      lastAction: "製品デモ実施",
      priority: "高",
      nextAction: "価格見積もり送付",
      selected: true
    },
    {
      id: 2,
      name: "鈴木一郎",
      company: "B工業株式会社",
      project: "システム更改案件",
      lastContact: "2024/03/05",
      status: "検討中",
      lastAction: "提案書送付",
      priority: "中",
      nextAction: "追加資料提供",
      selected: true
    },
    {
      id: 3,
      name: "佐藤花子",
      company: "C商事株式会社",
      project: "クラウド移行案件",
      lastContact: "2024/03/10",
      status: "提案済み",
      lastAction: "技術検証実施",
      priority: "高",
      nextAction: "決裁者へのアプローチ",
      selected: false
    }
  ];

  return NextResponse.json({ candidates });
} 