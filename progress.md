# 專案進度

截至 2026-09-22，`typescript-lab` 是以 React、Vite 建置的靜態 TypeScript 練習站，部署目標為 GitHub Pages：<https://frobel0520.github.io/typescript-lab/>。公開 repository：<https://github.com/frobel0520/typescript-lab>。

目前核心課程包含 10 個章節、40 題練習。編輯器流程已涵蓋程式碼編輯、提示、評分／檢查、進度保存與解題進度顯示；型別與執行契約、起始碼與參考解法驗證也已完成。

自動化驗證與部署證據：`npm run check` 通過，共 89 項測試，並包含型別檢查與 lint；GitHub Actions validation／Pages deployment 成功（<https://github.com/frobel0520/typescript-lab/actions/runs/34118044346>）；本機子路徑 8 項 HTTP 檢查，以及公開網站首頁與 6 個 editor／worker／compiler 資產 HTTP 檢查通過。這些結果不代表真實瀏覽器互動驗收。

2026-09-15 接上 Harbor 主控台的維護畫面（PR #1，`4b21dcd`）：`index.html` 的 `<head>` 載入 Harbor 前端腳本（`data-project=typescript-lab`），維護模式時顯示全螢幕維護畫面、有公告時顯示底部公告列，Harbor 連不上時頁面照常顯示；GitHub Pages 部署後線上已確認載入腳本。這個 commit 是在 GitHub 上合入的，本機 `main` 落後 `origin/main` 1 個 commit，開工前先同步。

仍待完成：GitHub Pages 真實瀏覽器操作、重新整理、行動版與鍵盤支援 QA；Conditional types、`infer`、template literal types 等選修課程；學習紀錄跨裝置同步目前也未提供。

下一步：

1. 在公開 Pages 網址執行桌面、行動版、鍵盤與重新整理流程驗收，記錄結果。
2. 視需求規劃並加入選修型別章節，再補齊對應測試與建置驗證。
3. 邊界清楚的獨立工作優先交給 Luna，以節省 token；主 agent 負責整合與最終驗證。
