# redirect

Cosense（Scrapbox）などから、外部URL・Obsidianディープリンク・ローカルのFinderパスにワンクリックでアクセスするためのリダイレクター。

## 使い方

```
https://shogit.github.io/redirect#<target>
```

| ハッシュの内容 | 動作 |
|---|---|
| 通常の URL（`https://...` など） | そのままリダイレクト |
| `obsidian://...` | Obsidian を開く |
| `file:///path/to/dir` | Finder で対象パスを開く（要 OpenInFinder.app） |

URLエンコードが必要な場合は [urlencoder.io](https://www.urlencoder.io/) を利用。

## ローカルファイルを Finder で開く仕組み

ブラウザは https ページから `file://` への直接遷移をブロックするため、`main.js` が `file://` を `openfinder://` カスタムスキームに変換し、ローカルの **OpenInFinder.app** が受け取って Finder を起動する。

```
Cosense リンク
  → https://shogit.github.io/redirect#file:///Users/sho/...
  → main.js が openfinder:// に変換
  → OpenInFinder.app がパスを Finder で開く
```

## セットアップ（OpenInFinder.app）

macOS ローカルへの初回セットアップが必要。

1. [Platypus](https://sveinbjorn.org/platypus) をインストール
2. `openfinder.sh` を Script Path に指定して App Name `Openfinder` でビルド → `/Applications` に配置
3. Info.plist に `CFBundleURLTypes` で `openfinder` スキームを登録
4. スキームを再登録：
   ```bash
   /System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -f /Applications/Openfinder.app
   ```

詳細は [CLAUDE.md](CLAUDE.md) を参照。
