# 系統設計

## 架構

Vite / React + 本機瀏覽器執行。頁面部署到 GitHub Pages 靜態網站，repository site base path 為 `/typescript-lab/`，由 `VITE_BASE_PATH` 注入。編輯與學員程式在客戶端處理，沒有學員程式送至伺服器的 API。先前 Sites Worker 架構只作歷史參考。

- app/page.tsx：學習流程、導航、結果狀態、持久化整合。
- components/code-editor.tsx：Monaco 延遲載入、模組型別、快捷鍵、fallback。
- curriculum/lessons.mjs：10 × 4 課程與 fixture modules。
- lib/compiler.mjs：獨立於 UI 的 TypeScript Compiler API 適配器。
- public/compiler-worker.js：載入 compiler / standard libs，背景檢查。
- lib/run-code.ts：opaque-origin sandbox iframe 中建立 disposable runtime worker。
- public/runtime-worker.js：執行程式、CommonJS fixture resolution、限量 console、結果比較。
- lib/storage.ts：版本化持久化結構與輸入驗證。

## 檢查流程

1. createProgram(strict) 對程式與標準函式庫進行完整檢查。
2. 額外檢查精確型別 assertion；對負向用法各自編譯，要求追加程式位置有錯誤。
3. 練習不允許 any 或 @ts-* 繞過檢查。
4. transpileModule 轉成 JavaScript，在新 runtime worker 執行程式與測試。
5. 前端整合所有結果；全部通過才加入 completed。

## 執行隔離

學員程式不在主視窗執行。runtime iframe 只有 allow-scripts，沒有 allow-same-origin。CSP default-src none、connect-src none，worker-src blob；學員程式在 iframe 建立的 worker 執行。父視窗驗證 message source 與每次隨機 nonce。3 秒逾時或切題停止 worker 並移除 iframe。新執行不共用學生全域狀態。

這是學習工具的隔離設計，不宣稱能抵抗瀏覽器漏洞；也不是對抗刻意改寫測試的考試平台。

## 狀態與生命週期

每次 run 使用递增 request id，切題或停止使舊回傳失效。AbortController 中止執行環境。執行途中修改 code，完成結果仍對應原 snapshot，UI 顯示結果過期。compiler worker 可重用；runtime worker 每次新建。卸載釋放 worker、event listener 與 timers。

localStorage key：typescript-lab:v1。保存 drafts、completed、selected、language；解析時只接受已知課程 ID 及有效型別。草稿上限 100,000 字元。唯讀提供模組由相同課程資料交给 compiler 與 runtime。
