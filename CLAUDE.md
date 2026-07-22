# CLAUDE.md — redirect / openfinder プロジェクト

## 概要
Cosense（Scrapbox）などから、外部URL・Obsidianディープリンク・**ローカルのFinderパス**にワンクリックでアクセスするための仕組み。
`https://shogit.github.io/redirect#<target>` を踏むと `main.js` が `<target>` を解釈し、適切な遷移先へリダイレクトする。

## 構成要素
- **`redirect` リポジトリ**（GitHub Pages, `shogit/redirect`）
  - `main.js`: `location.hash` を読み取り、種別に応じて分岐・リダイレクトする本体
  - 既存: 通常URL・obsidian:// ディープリンクの転送
  - 追加: `file://` で始まるハッシュを `openfinder://` に変換して転送（後述）
- **OpenInFinder.app**（macOSローカル、`/Applications` 配置）
  - `openfinder://` スキームを受け取り、Finderで対象パスを開くだけの常駐しないヘルパーアプリ
  - [Platypus](https://sveinbjorn.org/platypus) でシェルスクリプトをラップして作成（Xcode不要）

## 技術的な前提（ハマりどころ）
- ブラウザは **https ページから `file://` への直接遷移をブロックする**ため、`main.js` から `file://` にリダイレクトしても何も起きない。
- カスタムURLスキーム（`openfinder://` 等）は外部アプリ起動の確認ダイアログを経由するため通る。→ これを中継させる。
- `file://` のパスは3スラッシュ表記（`file:///Users/...`）が正しい。Cosense側のリンク生成テンプレートに2スラッシュ（`file://Users/...`）のミスがないか要確認。
- Platypusの **URL Schemes** 設定欄は見当たらないバージョンがある。その場合は Create App 後に Info.plist を XML に変換して `CFBundleURLTypes` を手動追加し、`lsregister -f` で再登録する。
- Platypus で入力ミスしやすい: `CFBBundleURLTypes`（B が2つ）は無効。`CFBundleURLTypes`（B は1つ）が正しい。
- 初回起動時のみ「このアプリで開きますか」の確認ダイアログが出る（Chrome/macOSの外部プロトコル許可の仕様、恒久的な回避は不可）。

## openfinder.sh（OpenInFinder.appの中身）
```bash
#!/bin/bash
url="$1"
path="${url#openfinder://}"
path=$(python3 -c "import urllib.parse,sys; print(urllib.parse.unquote(sys.argv[1]))" "$path")
[[ "$path" != /* ]] && path="/$path"
open -R "$path" 2>/dev/null || open "$path"
```

## main.js 側の分岐（追加分）
```javascript
const hash = decodeURIComponent(location.hash.slice(1));

if (hash.startsWith('file://')) {
  const path = hash.replace(/^file:\/\//, '');
  location.href = 'openfinder://' + encodeURIComponent(path);
} else {
  location.href = hash;
}
```

## TODO
- [x] Platypusで `OpenInFinder.app` をビルドし `/Applications` に配置
- [x] `redirect` リポジトリの `main.js` に上記分岐を追加してデプロイ
- [ ] Chromeの外部プロトコル許可設定を確認（毎回ダイアログが出ないか）
- [ ] Cosense側のリンク生成テンプレートが `file:///` （3スラッシュ）になっているか確認・修正

## 作業方針
- 変更は `redirect` リポジトリと `OpenInFinder.app` の両方に影響するため、片方だけ更新して動作確認できない状態を避ける
- シェルスクリプト・main.jsの変更は小さく刻んでその都度動作確認
