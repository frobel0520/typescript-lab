# TypeScript Lab

給熟悉 C++、C#、Python 的開發者使用的繁體中文 TypeScript 語法實戰網站。

10 章、40 題，包含真實編輯器、型別檢查、負向型別契約、執行測試、解答、語言對照、草稿／進度儲存與自由練習區。

## 現況

- 網站：https://frobel0520.github.io/typescript-lab/ （2026-09-07 上線，GitHub Actions 檢查與 Pages 部署成功）
- `npm run check` 共 89 項測試，含型別檢查與 lint。
- 屬於 [Learning Atlas](https://frobel0520.github.io/learning-atlas/)「程式語言」路線；站內導覽有返回 Learning Atlas 的連結（2026-09-25 起）。
- `index.html` 載入 Harbor 維護腳本（`data-project="typescript-lab"`，2026-09-15 起），Harbor 連不上時頁面照常顯示。
- 仍待完成：公開網址上的真實瀏覽器、行動版、鍵盤與重新整理驗收；Conditional types、`infer`、template literal types 等選修章節；跨裝置同步。

詳細進度見 [progress.md](progress.md)。

## 開發

Node.js >= 22.13。部署到 GitHub Pages 時以 `VITE_BASE_PATH=/typescript-lab/` 建置。

```sh
npm ci
npm run dev
```

```sh
npm run check
npm run build
```

編輯器與編譯器資產由 prepare-assets 自動複製到 public，不依賴執行時第三方 CDN。課程來源為 curriculum/lessons.mjs。執行環境提供標準 JS、console 與固定模組，不提供 DOM、網路或 npm 安裝。

## 文件

- [專案計畫](docs/project-plan.md)
- [系統分析](docs/project-sa.md)
- [系統設計](docs/project-sd.md)
- [任務拆解](docs/task-breakdown.md)
- [驗收紀錄](docs/release-audit.md)
- [專案進度](progress.md)

## 教材來源

以官方 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) 的型別與語法語意為基礎，教材與練習自行撰寫。使用 TypeScript 5.9.3 作正式檢查。Monaco 的即時提示採其內建版本；若提示不同，過關以執行檢查結果為準。

## 開發習慣參考

參考使用者的 software-engineering-workshop：專案級規格、feature/<task-id> 分支、deterministic fixture、完成條件與驗收文件。GitHub Pages 部署紀錄與待完成的瀏覽器驗收，見 [驗收紀錄](docs/release-audit.md)。
