---
name: lp-init
description: LPプロジェクトの初期構造を作成するskill。HTMLファイル、CSSファイル、JavaScriptファイルのセットアップ、ディレクトリ構造の整備、基本テンプレートの生成を行う。「LPを初期化して」「LP構造を作って」などのリクエストに使用。
---

# LP初期化Skill

静的サイト（HTML/CSS/JS）のLPプロジェクトを初期化する。

## ワークフロー

TodoWriteツールでタスクリストを作成し、順番に進める。

### 1. lp-context.md の読み込み

まず `lp-context.md` が存在するか確認し、読み込む：

```bash
cat lp-context.md 2>/dev/null || echo "lp-context.md が見つかりません"
```

- **ファイルがある場合**: 記載内容をプロジェクト情報として使用する
- **ファイルがない場合**: ユーザーに以下の情報を確認する
  - LP のタイトル・サービス名
  - ターゲットユーザー
  - メインカラー（指定がなければ後でCSSで調整できるよう変数化）
  - セクション構成（指定がなければ標準構成を使う）

`lp-context.md` の情報はHTMLのタイトル・meta description・カラー変数・セクション構成に反映する。

### 2. ディレクトリ構造の作成

```
/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── .gitkeep
└── .claude/
    └── settings.json  (既存なら更新)
```

### 3. index.html の作成

以下の要素を含む基本テンプレートを生成する：

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="[説明文]">
  <meta property="og:title" content="[タイトル]">
  <meta property="og:description" content="[説明文]">
  <meta property="og:type" content="website">
  <title>[タイトル]</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <header>...</header>
  <main>
    <!-- セクションをここに配置 -->
  </main>
  <footer>...</footer>
  <script src="js/main.js"></script>
</body>
</html>
```

**標準LPセクション構成（指定がない場合）：**
1. `#hero` - ファーストビュー（キャッチコピー + CTA）
2. `#features` - 特徴・メリット（3〜4項目）
3. `#how-it-works` - 使い方・フロー
4. `#testimonials` - お客様の声
5. `#faq` - よくある質問
6. `#cta` - 最終CTA・申し込みフォーム

### 4. css/style.css の作成

```css
/* ============================================
   CSS カスタムプロパティ（デザイントークン）
   ============================================ */
:root {
  --color-primary: #0066CC;
  --color-primary-dark: #0052A3;
  --color-accent: #FF6B35;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-bg: #FFFFFF;
  --color-bg-gray: #F5F5F5;

  --font-base: 'Noto Sans JP', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.7;

  --max-width: 1200px;
  --section-padding: 80px 20px;
}

/* リセット・ベース */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: var(--font-size-base); scroll-behavior: smooth; }
body { font-family: var(--font-base); color: var(--color-text); line-height: var(--line-height-base); }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }

/* コンテナ */
.container { max-width: var(--max-width); margin: 0 auto; padding: 0 20px; }

/* セクション共通 */
section { padding: var(--section-padding); }

/* ボタン */
.btn { display: inline-block; padding: 16px 40px; border-radius: 4px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-primary:hover { opacity: 0.85; }

/* レスポンシブ */
@media (max-width: 768px) {
  :root { --section-padding: 60px 16px; }
}
```

### 5. js/main.js の作成

```js
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // スムーズスクロール（aタグ）
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ヘッダー固定時のクラス付与
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 50);
    });
  }
});
```

### 6. ファイルの確認

作成したファイルを確認：
- HTMLのバリデーション（構造が正しいか）
- CSSのカスタムプロパティがすべて定義されているか
- JSが構文エラーなく書けているか

### 7. 完了報告

作成したファイル一覧と次のステップを報告する：

```
✅ LP初期化完了

作成ファイル：
- index.html
- css/style.css
- js/main.js
- images/.gitkeep

次のステップ：
1. 各セクションのコンテンツを編集
2. 画像ファイルをimages/に追加
3. /lp-review でレビュー実施
4. /lp-deploy でCloudflare Pagesに公開
```
