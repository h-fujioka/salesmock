// フォローアップ候補のダミーデータAPI (GET)
import { NextResponse } from 'next/server';

export async function GET() {
  // ダミーデータを返す
  const candidates = [
    {
      id: 1,
      name: "山田太郎",
      company: "株式会社A",
      lastContact: "2024/03/01",
      status: "提案済み",
      priority: "高",
      nextAction: "フォローアップ",
      selected: true
    },
    {
      id: 2,
      name: "鈴木一郎",
      company: "B工業株式会社",
      lastContact: "2024/03/05",
      status: "検討中",
      priority: "中",
      nextAction: "フォローアップ",
      selected: true
    },
    {
      id: 3,
      name: "佐藤花子",
      company: "C商事株式会社",
      lastContact: "2024/03/10",
      status: "提案済み",
      priority: "高",
      nextAction: "フォローアップ",
      selected: true
    }
  ];

  return NextResponse.json({ candidates });
} 