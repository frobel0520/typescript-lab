# Release audit — 0.1.0

2026-09-07: 10 chapters / 40 exercises. Public repository: https://github.com/frobel0520/typescript-lab. Live site: https://frobel0520.github.io/typescript-lab/. GitHub Pages deployment succeeded; browser interaction QA remains pending.

## GitHub Pages 遷移

- GitHub Actions validation and Pages deployment succeeded: https://github.com/frobel0520/typescript-lab/actions/runs/34118044346. Public homepage returned HTTP 200; six deployed editor/worker/compiler asset HTTP checks passed.
- 遷移後 `npm run check`：89 項測試、型別與 lint 通過。
- `VITE_BASE_PATH=/typescript-lab/ npm run build`：純靜態產物建置通過。
- repository 子路徑下的頁面、worker、Monaco 與 compiler 等 8 個 HTTP 資產檢查：通過；不代表瀏覽器執行驗收。
- GitHub Pages 真實瀏覽器、重新整理與行動版驗收：pending。
- Public repository and Pages deployment: complete. Browser interaction QA: pending.

## 已執行

- `npm run check`：通過，包括 TypeScript、89 項自動化測試及 lint。
- 40 題參考解法：型別、負向用法、執行契約全部通過。
- 40 題起始程式：每題都至少有一項未滿足，不能直接通關。
- 標準庫載入、跨模組編譯、型別錯誤位置、any / directive 繞過攔截：通過。
- 草稿／進度資料解析、錯誤格式、未知 ID 與去重：通過。
- 執行 host 隔離屬性、訊息來源驗證、完成清理及 3 秒超時清理：以模擬 DOM 的整合測試通過。
- runtime-worker：在 Node VM 執行真實解答與 runtime probes，覆蓋 console、模組和 async。
- `npm run build`：套件更新後成功；此為遷移前歷史結果，當時產生 Sites Worker 與本機靜態編輯器／編譯器資產。
- 本機 `/` HTTP 200。
- 套件安全修補後 npm install audit 回報 0 vulnerabilities。

## 驗證邊界

遷移前未執行瀏覽器點擊、截圖或 mobile / zoom / screen-reader QA；不能把模擬 DOM 測試視為真實瀏覽器驗收。GitHub Pages 遷移後的實際瀏覽器驗收仍 pending。響應式 CSS、語意標籤、鍵盤支援與 reduced-motion 已實作，但仍需實際操作驗收。

Monaco 0.52.2 的即時語言服務與正式檢查的 TS 5.9.3 版本不同；核心教材語法兩者都支援，正式過關以執行時檢查為準。

lint 範圍排除原封未動的 starter `components/ui/**` 和 `hooks/use-mobile.ts`，避免把供應商元件既有 lint 問題混入專案程式。應用程式、教材、執行引擎與測試仍納入檢查。僅對瀏覽器儲存同步 effect、隔離 worker 必要的 Function constructor，以及測試 fake DOM 的型別環境衝突使用有說明的局部例外。

## 依賴調整

修補 starter 已知漏洞：React / React DOM / RSC 19.2.8、Vinext beta.9、Vite 8.2.2、Cloudflare Vite plugin 1.54.4、Wrangler 4.129.0，以及其必要 peer dependencies。未使用 force / legacy-peer-deps 略過相容性驗證。

## 後續選修

Conditional types、infer、template literal types 深入課程不計入本次 40 題核心課程。學習紀錄只在當前瀏覽器保存，沒有跨裝置同步。

## 收尾修正

遷移前本機 server 的瀏覽器錯誤轉送紀錄揭露 Monaco worker 從 blob URL 解析 root-relative AMD path 失敗；當時已修正並重新執行型別檢查、lint 與建置。這項歷史紀錄不是 GitHub Pages base path 的完整瀏覽器互動驗收。
