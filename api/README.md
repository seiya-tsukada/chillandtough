# AURA Experiential E-Commerce & Python Admin (Vercel Monorepo)

## 構成概要 (Architecture Overview)

本リポジトリは、**Vercel Monorepo** 構成に準拠した体験型ECプラットフォームおよびPython運用管理システムです。

```
├── api/                       # Python FastAPI バックエンド (Vercel Serverless Function)
│   ├── index.py              # FastAPI エントリーポイント (/api/...)
│   ├── models.py             # Pydantic v2 & ORM データモデル
│   └── requirements.txt      # Python 依存関係 (fastapi, pydantic, stripe, etc.)
├── src/                       # フロントエンド (React + Vite + TypeScript)
│   ├── assets/               # 生成画像 & ブランドアセット
│   ├── components/           # UIコンポーネント (Instagram風カルーセル、タグ、ストーリー、カート)
│   ├── context/              # 状態管理 (Cart, Posts, Admin, Filters)
│   ├── types/                # 厳格なTypeScript型定義
│   └── views/                # メインフィードビュー & /admin 運用ダッシュボード
├── vercel.json               # Vercel Monorepo ビルド/ルーティング設定
├── package.json              # フロントエンド Node.js 依存関係
├── tsconfig.json             # TypeScript 設定
└── vite.config.ts            # Vite ビルド設定
```

## 主な機能仕様

### 1. フロントエンド（体験型EC）
- **Instagram風カードフィード**: 1つの投稿に複数の高精細画像・動画をカルーセル/スワイプで閲覧。
- **インタラクティブ・ショッパブルタグ（Hotspots）**: 写真上の商品タグをタップして即座に商品名・価格を表示し、ワンタップでカートに追加。
- **体験ストーリー**: フルスクリーンのストーリー閲覧と購入リンク。
- **スライドオーバー・カート & 決済**: Stripe / Apple Pay を想定した即時チェックアウトシミュレーション。

### 2. バックエンド & マーケティング/戦略機能 (Python FastAPI)
- **広告運用管理 (Ad Campaigns)**: スポンサー枠の出稿、予算管理、ROAS (広告費用対効果)、CTR (クリック率)、CPC管理。
- **データ分析 (Analytics & Funnel)**: GMV (流通総額)、コンバージョン率、クリエイター別売上貢献度、チャネル別シェア。
- **SNS連携 (Instagram Graph API)**: Instagram上のカタログタグ付け、UGC投稿の同期。
- **決済連携 (Stripe Webhook / Checkout)**: UTMパラメータを保持したアトリビューション分析。
