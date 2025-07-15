# SalesOn 画面遷移図

本ドキュメントはSalesOnの主要画面遷移をMermaid記法で示したものです。

---

```mermaid
flowchart TD
    Start["ログイン/トップ画面"]
    Home["AIエージェントホーム"]
    CaseList["案件管理画面"]
    TaskList["タスク管理画面"]
    MailList["メール管理画面"]
    CaseDetail["案件詳細"]
    TaskDetail["タスク詳細"]
    MailDetail["メール詳細"]
    Settings["設定画面"]

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

    Home -.->|通知・アラート| CaseDetail
    Home -.->|AI提案| TaskDetail
    Home -.->|AI提案| MailDetail
```

---

- ログイン/トップ画面からAIエージェントホームへ遷移
- ホームから案件管理・タスク管理・メール管理・設定画面へ遷移
- 各リスト画面から詳細画面へ遷移
- 詳細画面や設定画面からホームへ戻る
- ホームから通知・AI提案による直接遷移も dotted line で表現 