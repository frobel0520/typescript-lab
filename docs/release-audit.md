# Release audit — 0.1.0

2026-09-07: 10 chapters / 40 exercises. Public repository: https://github.com/frobel0520/typescript-lab. Live site: https://frobel0520.github.io/typescript-lab/. GitHub Pages deployment succeeded; one-exercise browser smoke test completed on 2026-09-29, broader interaction QA remains pending.

## GitHub Pages 遷移

- GitHub Actions validation and Pages deployment succeeded: https://github.com/frobel0520/typescript-lab/actions/runs/34118044346. Public homepage returned HTTP 200; six deployed editor/worker/compiler asset HTTP checks passed.
- 遷移後 `npm run check`：89 項測試、型別與 lint 通過。
- `VITE_BASE_PATH=/typescript-lab/ npm run build`：純靜態產物建置通過。
- repository 子路徑下的頁面、worker、Monaco 與 compiler 等 8 個 HTTP 資產檢查：通過；不代表瀏覽器執行驗收。
- 2026-09-29 公開站真實瀏覽器 smoke test：第 1 題起始碼顯示 2 個型別錯誤；輸入正確解後以 ⌘+Enter 執行，4/4 檢查通過，進度變為 1/40；重新整理後解答草稿與 1/40 進度仍在。375px 模擬視窗可閱讀練習內容、開啟章節側欄並切到第 2 章。
- Public repository and Pages deployment: complete. 上述只涵蓋一題與模擬 375px；40 題逐題、真實手機、螢幕閱讀器與完整鍵盤巡覽仍 pending。

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

遷移前未執行瀏覽器點擊、截圖或 mobile / zoom / screen-reader QA；不能把模擬 DOM 測試視為真實瀏覽器驗收。2026-09-29 已補一題的線上互動與 375px 模擬視窗 smoke test；真實手機、zoom、screen-reader 及完整課程操作仍待驗收。響應式 CSS、語意標籤、鍵盤支援與 reduced-motion 已實作，尚未全面實機確認。

Monaco 0.52.2 的即時語言服務與正式檢查的 TS 5.9.3 版本不同；核心教材語法兩者都支援，正式過關以執行時檢查為準。

lint 範圍排除原封未動的 starter `components/ui/**` 和 `hooks/use-mobile.ts`，避免把供應商元件既有 lint 問題混入專案程式。應用程式、教材、執行引擎與測試仍納入檢查。僅對瀏覽器儲存同步 effect、隔離 worker 必要的 Function constructor，以及測試 fake DOM 的型別環境衝突使用有說明的局部例外。

## 依賴調整

修補 starter 已知漏洞：React / React DOM / RSC 19.2.8、Vinext beta.9、Vite 8.2.2、Cloudflare Vite plugin 1.54.4、Wrangler 4.129.0，以及其必要 peer dependencies。未使用 force / legacy-peer-deps 略過相容性驗證。

## 後續選修

Conditional types、infer、template literal types 深入課程不計入本次 40 題核心課程。學習紀錄只在當前瀏覽器保存，沒有跨裝置同步。

## 收尾修正

遷移前本機 server 的瀏覽器錯誤轉送紀錄揭露 Monaco worker 從 blob URL 解析 root-relative AMD path 失敗；當時已修正並重新執行型別檢查、lint 與建置。這項歷史紀錄不是 GitHub Pages base path 的完整瀏覽器互動驗收。

## 2026-10-24 安全修補（SEC-P1-TS）

- `vite` 從 8.2.2 更新至 8.3.5，`body-parser` 間接開發依賴從 2.3.0 更新至 2.4.0；其餘 lockfile 變更是這些相容更新的傳遞依賴。
- npm 官方 advisory 查核修補前有 2 項 high（Vite、body-parser），修補後 `npm audit` 為 0 vulnerabilities（critical 0、high 0）。
- 以 portable Node 24.22.1、npm 11.12.1 執行 `npm ci --ignore-scripts`；之後 `npm test` 89/89、`npm run typecheck`、`npm run lint`、`npm run build` 均通過。建置輸出為 205.23 kB CSS、360.83 kB JS（gzip 分別 31.27 kB、117.62 kB）。
- Bundle 效能回歸：在相同來源 commit `990264611dd291994d0ca3d7e218d046c67ed16b` 下，以基底原 lockfile（Vite 8.2.2、body-parser 2.3.0）與修補 lockfile（Vite 8.3.5、body-parser 2.4.0）分別乾淨安裝並建置；環境為 Windows、Node 24.22.1、npm 11.12.1，兩次 `npm ci --ignore-scripts`。使用 Node `zlib.gzipSync` level 9 計算輸出 bytes：CSS 205,237 bytes / gzip 31,093 bytes，前後相同；JS 基準 361,202 / gzip 116,418 bytes，修補後 360,838 / gzip 116,355 bytes（原始 -0.10%、gzip -0.05%），低於 5% 增幅門檻。
- 此差異只量測靜態 bundle 大小；開發工具依賴沒有進入正式 runtime dependencies，正式 API 延遲、互動 p50/p95、CPU／記憶體及正式環境效能指標不適用。本次未做正式站效能量測，bundle 大小不能代替正式 runtime 效能驗收。
- 整合驗證另以 Chromium 在 1280px／375px 真實鍵盤輸入第一題合成解答，通過型別檢查、執行與課程驗收；手機章節側欄可切換。兩種寬度無 page error／水平溢出，外部網路封鎖，未使用真實學習紀錄。這只驗證一條核心流程，不替代完整 40 題正式驗收；未部署。
