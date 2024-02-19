# HonoX Boilerplate

### About

[HonoX](https://github.com/honojs/honox)で作成したアプリを [Cloudflare Pages](https://pages.cloudflare.com/) 上で構築するためのボイラープレートです。

### スタック

- JavaScript 実行ランタイム - [Bun](https://bun.sh/)
- ビルドツールチェイン - [Vite](https://ja.vitejs.dev/)
- ホスティング - [Cloudflare Pages](https://pages.cloudflare.com/)
- FW - [HonoX](https://github.com/honojs/honox)
- データベース - [Cloudflare D1](https://developers.cloudflare.com/d1/) (ローカルでは[SQLite](https://bun.sh/docs/api/sqlite))
- ORM - [Drizzle](https://orm.drizzle.team/)
- レンダーエンジン - [hono/jsx](https://hono.dev/guides/jsx)
- Linter & Formatter - [Biome](https://biomejs.dev/ja/)
- テスト [Bun](https://bun.sh/docs/cli/test)

### ローカル環境構築

```bash
#  ローカル環境のセットアップ
$ bun setup
```

依存パッケージのインストール ローカル DB の作成 環境変数ファイルのコピーが行われるので、 `.env` に適切な値を設定する。

```bash
#  ローカルサーバーの起動
$ bun dev
```

http://localhost:5173/ にアプリが起動する

### ディレクトリ構成

```
- .mf/ (ignored) ローカル環境データベースの保存ディレクトリ
- app/ フロントエンド関連
  - islands フロントエンド側でインタラクションを行うコンポーネントはここに記述する
    ここ以外でクライアントサイドのロジックは動かないので注意
  - routes ページコンポーネントの記述ファイル File Based Routing に基づいてテンプレートを作成する
    - _renderer.tsx ページコンポーネントのレンダリングを行う。Hono の [JSX Renderer Middleware](https://hono.dev/middleware/builtin/jsx-renderer) が呼ばれるファイル
  - client.ts フロント側のエントリーポイント
  - server.ts サーバー側のエントリーポイント
  - style.css グローバルで参照するCSS (リセットCSSを記述している)
- db/ データベース関連
  - migrations drizzle-kitによって生成されたマイグレーションファイルが格納される
  - schemas DBのスキーマを記述する
  - seed.ts ローカル環境DBに仮データを挿入するためのシーディング処理を記述する
- public/static Webの静的ファイルを格納するディレクトリ
  - style.css リモート環境ではこちらを参照している。 app/style.cssと同じ内容
- server/ サーバーサイドロジックの記述
  - __tests__ テストコードに用いる処理を定義する
    - fixtures DBのテストデータに関する処理
    - mocks 各処理系のモックオブジェクトを作成
  - domains ドメインロジックを記述する
  - repositories データベースを扱う処理
  - services 外部サービスを扱うためのモジュールに関する処理
- .env (ignored) ローカルで参照する環境変数ファイル
- .env.example 環境変数ファイルのサンプル
- .gitignore
- biome.json フォーマットとLinterを兼ねるBiomeの設定ファイル
- bun.lockb
- drizzle.config.ts Drizzleの設定ファイル ローカルDBのマイグレーション設定が記述されている
- lefthook.yml Gitコミット時に呼ばれるコマンドを設定するファイル
- package.json
- README.md
- tsconfig.json
- vite.config.ts Viteの設定ファイル
- wrangler.toml (ignored) Cloudflareの設定ファイル
- wrangler.toml.example wrangler.tomlのサンプル
```

### DB スキーマ更新のマイグレーション

`db/schemas/index.ts` にはデータベースのスキーマが drizzle で定義されており、また`db/seed.ts` にはローカル DB に仮データを挿入するためのシーディング処理が実装されている。

これらのファイルを編集した後、以下のコマンドでマイグレーションを実行する。

```bash
# マイグレーションファイルの生成
$ bun migrate:gen

# ローカルDBにマイグレーションを適用
$ bun migrate:dev

# ローカルDBに仮データを挿入
$ bun seed:dev
```

### デプロイ

Cloudflare Pages と GitHub リポジトリの連携を行うと、production ブランチに push された際に自動的にデプロイが行われる。

### FIXME

`$ bun test` で呼び出されるサーバーのテストでは、 `mock.module` によるモジュールのモックがうまくリセットできなかったため、単体テストのモックの影響が別のテストに影響を与えてテストが失敗する。

cf ) package.json の "test" スクリプトの部分。ディレクトリ単位で単体テストを行い、モックの影響を疎にしている。

```
$ bun run test
```
