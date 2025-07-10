# 営業支援システム - Ambient Agent & エージェントインボックス

環境に溶け込むAIエージェントと統合インターフェースを組み合わせた営業支援システムのフロントエンドです。

## 機能

- **エージェントインボックス**: 統合コミュニケーション管理
- **Ambient Agent**: 環境シグナル監視・自動タスク実行・予測支援
- **タスク管理**: タスクの作成・追跡・完了管理
- **案件管理**: 案件の進捗・ステータス・関連情報管理

## 技術スタック

- **Next.js 14**: Reactフレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **Styled Components**: コンポーネントスタイリング
- **Framer Motion**: アニメーション
- **Lucide React**: アイコン

## 開発環境のセットアップ

### 前提条件
- Node.js 18.0.0以上
- npm または yarn

### インストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

### ビルド
```bash
npm run build
```

### 本番サーバー起動
```bash
npm start
```

## プロジェクト構造

```
frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # ホームページ
│   │   └── globals.css        # グローバルスタイル
│   ├── components/            # コンポーネント
│   │   ├── ui/               # 基本UIコンポーネント
│   │   ├── layout/           # レイアウトコンポーネント
│   │   └── features/         # 機能別コンポーネント
│   │       └── AgentInbox/   # エージェントインボックス
│   ├── lib/                  # ユーティリティ
│   ├── hooks/                # カスタムフック
│   ├── types/                # TypeScript型定義
│   └── styles/               # スタイル定義
├── public/                   # 静的ファイル
└── package.json
```

## 開発ガイドライン

### コンポーネント設計
- 機能別にディレクトリを分割
- TypeScriptで型安全性を確保
- 再利用可能なコンポーネントを作成

### スタイリング
- Tailwind CSSを基本として使用
- 必要に応じてStyled Componentsを使用
- レスポンシブデザインを考慮

### 状態管理
- React Hooksを使用
- 必要に応じてContext APIを使用

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。
