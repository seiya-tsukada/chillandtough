# chillandtough

ミニマルなアパレル／ライフスタイルグッズのプロダクトカタログ。

- フロントエンド: React + TypeScript + Vite + Tailwind CSS
- API: Python (FastAPI) — Vercel Serverless Functions として `/api/*` で動作
- API に接続できない環境では、ブラウザの localStorage を使ったフォールバックで動作します

## ローカル開発

**前提:** Node.js

```bash
npm install
npm run dev
```

http://localhost:3000 で起動します。管理画面は `/admin` です。

### スクリプト

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバーを起動 (port 3000) |
| `npm run build` | 本番ビルド (`dist/`) |
| `npm run preview` | ビルド結果をプレビュー |
| `npm run lint` | 型チェック (`tsc --noEmit`) |
| `npm run clean` | `dist/` を削除 |

## ディレクトリ構成

```
api/                Python FastAPI (Vercel Serverless)
  index.py          エンドポイント定義
  data.py           初期カタログデータ
public/images/      商品画像
src/
  admin/            管理画面 (/admin)
  api/client.ts     API クライアント (localStorage フォールバック付き)
  components/       公開カタログの UI コンポーネント
  constants/        定数 (カテゴリ・通貨・ストレージキー・API パス等)
  data/             初期商品データ・ルックブック定義
  types/            型定義
  utils/            フォーマット等のユーティリティ
```

## デプロイ

Vercel にデプロイします。`vercel.json` で `/api/*` を `api/index.py` に、それ以外を SPA の `index.html` にルーティングしています。Python の依存は `requirements.txt` で管理しています。
