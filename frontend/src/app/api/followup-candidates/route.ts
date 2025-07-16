// フォローアップ候補のダミーデータAPI (GET)
import { NextResponse } from 'next/server';

export async function GET() {
  const candidates = [
    { name: 'A社（田中様）', lastContact: '2024/06/20', project: '新製品提案', reason: '2週間連絡なし' },
    { name: 'B社（佐藤様）', lastContact: '2024/06/15', project: '保守契約更新', reason: '更新案内未返信' },
    { name: 'C社（鈴木様）', lastContact: '2024/06/10', project: '導入サポート', reason: '初回提案後フォロー未実施' },
  ];
  return NextResponse.json({ candidates });
} 