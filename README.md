# URL Summarizer (Gemini)

与えられたURLを1行で要約するCLIツールです。Google Gemini API を利用しています。

## 事前準備

1. Google AI Studio などで API キーを取得し、環境変数 `GEMINI_API_KEY` に設定してください。

```powershell
setx GEMINI_API_KEY "YOUR_API_KEY_HERE"
```

2. 依存関係をインストールします。

```powershell
npm install
```

## 使い方

```powershell
node summarize-url.js <URL>
```

例:

```powershell
node summarize-url.js https://example.com
```

結果として日本語1行の要約が出力されます。
