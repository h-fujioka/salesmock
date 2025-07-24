# SalesOn 画面遷移図

本ドキュメントはSalesOnの主要画面遷移をMermaid記法で示したものです。

---

```mermaid
flowchart TD
    Start["ログイン/トップ画面"]
    Home["ホーム画面"]
    CaseList["案件管理画面"]
    TaskList["タスク管理画面"]
    MailList["メール管理画面"]
    CaseDetail["案件詳細"]
    TaskDetail["タスク詳細"]
    MailDetail["メール詳細"]
    Settings["設定画面"]
    
    %% ホーム画面内の確認フロー
    AIProposal["AI提案・確認エリア"]
    AIHistory["AI実行履歴"]
    ApprovalFlow["確認・判断フロー"]
    SupportView["サポートスタッフ専用ビュー"]
    
    %% サブフロー
    AIAutoExec["AI自動実行"]
    PendingReview["確認待ち状態"]
    HumanReview["人間確認・判断"]
    Feedback["フィードバック・コメント"]

    Start --> Home
    Home --> CaseList
    Home --> TaskList
    Home --> MailList
    Home --> Settings
    CaseList --> CaseDetail
    TaskList --> TaskDetail
    MailList --> MailDetail
    CaseDetail --> Home
    TaskDetail --> Home
    MailDetail --> Home
    Settings --> Home

    %% ホーム画面内の遷移
    Home --> AIProposal
    Home --> AIHistory
    Home --> ApprovalFlow
    Home --> SupportView
    
    %% AI自動化フロー
    AIAutoExec --> PendingReview
    PendingReview --> HumanReview
    HumanReview --> Feedback
    
    %% 通知・アラートによる直接遷移
    Home -.->|通知・アラート| CaseDetail
    Home -.->|AI提案| TaskDetail
    Home -.->|AI提案| MailDetail
    
    %% 確認フローからの遷移
    ApprovalFlow -.->|確認後| TaskDetail
    ApprovalFlow -.->|確認後| CaseDetail
    ApprovalFlow -.->|確認後| MailDetail
```

---

## 画面遷移の詳細説明

### 基本遷移
- ログイン/トップ画面からホーム画面へ遷移
- ホームから案件管理・タスク管理・メール管理・設定画面へ遷移
- 各リスト画面から詳細画面へ遷移
- 詳細画面や設定画面からホームへ戻る

### ホーム画面内の遷移
- **AI提案・確認エリア**: AIからの提案を確認・判断
- **AI実行履歴**: AIの自動実行履歴を時系列で表示
- **確認・判断フロー**: AI提案に対する人間の確認・判断プロセス
- **サポートスタッフ専用ビュー**: サポートスタッフ向けの特別なビュー

### AI自動化フロー
1. **AI自動実行**: AIが自動でアクションを実行
2. **確認待ち状態**: 人間の確認を待つ状態
3. **人間確認・判断**: 人間による確認・判断・実行指示
4. **フィードバック・コメント**: 結果の記録・フィードバック

### 通知・アラートによる直接遷移
- ホームから通知・アラートによる直接遷移（dotted line）
- AI提案による直接遷移（dotted line）
- 確認フローからの遷移（dotted line）

### サポートスタッフ専用機能
- サポートスタッフ専用ビューへの分岐
- 顧客対応履歴とAI提案の紐付け表示
- サポート案件の特別な処理フロー 