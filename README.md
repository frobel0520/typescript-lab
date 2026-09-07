# TypeScript Lab

給熟悉 C++、C#、Python 的開發者使用的繁體中文 TypeScript 語法實戰網站。

10 章、40 題，包含真實編輯器、型別檢查、負向型別契約、執行測試、解答、語言對照、草稿／進度儲存與自由練習區。

## 開發

Node.js >= 22.13。

Public repository: https://github.com/frobel0520/typescript-lab. Live site: https://frobel0520.github.io/typescript-lab/. GitHub Actions validation and deployment succeeded. Build with VITE_BASE_PATH=/typescript-lab/. Browser interaction QA remains pending.

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

## 教材來源

以官方 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) 的型別與語法語意為基礎，教材與練習自行撰寫。使用 TypeScript 5.9.3 作正式檢查。Monaco 的即時提示採其內建版本；若提示不同，過關以執行檢查結果為準。

## 開發習慣參考

參考使用者的 software-engineering-workshop：專案級規格、feature/<task-id> 分支、deterministic fixture、完成條件與驗收文件。GitHub Pages 遷移中的部署與瀏覽器驗收，見 [驗收紀錄](docs/release-audit.md)。
