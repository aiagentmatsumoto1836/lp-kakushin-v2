---
name: lp-deploy
description: LPをCloudflare Pagesに公開するskill。Gitへのコミット、プッシュ、Cloudflare Pagesのデプロイ確認までを行う。「LPを公開して」「Cloudflareにデプロイして」などのリクエストに使用。
---

# LPデプロイSkill（Cloudflare Pages）

静的LP（HTML/CSS/JS）をCloudflare Pagesに公開する。

## 前提条件

- Cloudflare Pagesのプロジェクトがすでに作成されている、またはこのSkillで初回設定を行う
- GitHubリポジトリとCloudflare Pagesが連携されている（推奨）

## ワークフロー

TodoWriteツールでタスクリストを作成し、順番に進める。

### 1. lp-context.md の読み込み

まず `lp-context.md` を読み込み、デプロイ先・リポジトリ情報を確認する：

```bash
cat lp-context.md 2>/dev/null || echo "lp-context.md が見つかりません"
```

確認する項目：
- **ターゲットURL**: 公開先のドメインが設定済みか
- **リポジトリ**: push先のリモートリポジトリが正しいか
- **ホスティング**: Cloudflare Pagesの設定が完了しているか

### 2. デプロイ前チェック

#### ファイル確認
```bash
ls -la
# index.html が存在することを確認
# css/, js/, images/ ディレクトリを確認
```

#### git status 確認
```bash
git status
git diff --stat
```

未コミットの変更がある場合、ユーザーに確認してからコミットする。

### 2. コミット・プッシュ

#### ステージング
```bash
git add index.html css/ js/ images/
# .gitignoreがあれば確認してから add
```

#### コミット
コミットメッセージの形式：
- 初回: `feat: LP初期実装`
- 更新: `feat: [変更内容]の追加`
- 修正: `fix: [修正内容]`
- デザイン調整: `style: [調整内容]`

```bash
git commit -m "feat: [適切なメッセージ]"
```

#### プッシュ
```bash
git push -u origin main
# または現在のブランチ名を確認して push
```

プッシュが失敗した場合、最大4回まで指数バックオフでリトライ（2s → 4s → 8s → 16s）。

### 3. Cloudflare Pages 設定確認（初回のみ）

Cloudflare Pages が未設定の場合、以下の設定が必要だと案内する：

```
Cloudflare Dashboard での設定：
1. https://dash.cloudflare.com にアクセス
2. Pages → Create a project → Connect to Git
3. GitHubリポジトリ（lp-kakushin-v2）を選択
4. ビルド設定：
   - Framework preset: None
   - Build command: (空白)
   - Build output directory: / (ルート)
5. Save and Deploy
```

### 4. デプロイ状況の確認

GitHub経由でCloudflare Pagesに連携している場合：

```bash
# 最新のコミットが正しく push されているか確認
git log --oneline -5

# リモートの状態確認
git remote -v
```

Cloudflare Pagesのデプロイは通常 **1〜3分** で完了する。

### 5. 公開後の確認事項

ユーザーに以下を確認するよう案内する：

```
公開後チェックリスト：

□ サイトURLにアクセスして表示を確認
□ スマートフォンで表示を確認（Chrome DevToolsのモバイルビュー）
□ 主要ブラウザで確認（Chrome, Safari, Firefox）
□ ページタイトルとfavicon が正しく表示されている
□ CTAボタンが正しく動作する
□ フォームがある場合、送信が正しく動作する
□ Google Search Consoleにサイトを登録（SEO対策）

Cloudflare Pagesの管理画面：
https://dash.cloudflare.com → Pages → [プロジェクト名]
```

### 6. カスタムドメインの設定案内（任意）

カスタムドメインを使う場合の案内：

```
カスタムドメイン設定：
1. Cloudflare Dashboard → Pages → プロジェクト → Custom domains
2. ドメインを入力して「Set up a custom domain」
3. DNSレコードを設定（CloudflareでドメインDNSを管理している場合は自動）
```

### 7. 完了報告

```
✅ デプロイ完了

コミット: [コミットハッシュ]
ブランチ: [ブランチ名]
リモート: [リモートURL]

Cloudflare Pagesデプロイ:
- 通常1〜3分でデプロイ完了
- Cloudflare Dashboard で状況を確認してください

次のステップ：
- サイトURLで表示確認
- Google Search Consoleへの登録
- アクセス解析ツールの設定（Google Analytics など）
```
