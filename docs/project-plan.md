# TypeScript Lab：專案計畫

日期：2026-09-07。目標使用者：熟悉 C++、C#、Python 的開發者。版本：0.1.0。

## 目標與範圍

用 10 章、40 題的短教材與真實 TypeScript 編輯器，集中學習語法與型別系統。包括逐層提示、解答、語言對照、執行輸出、正向與負向型別契約、執行時測試、草稿與進度保存、自由練習區。所有章節可自由選擇。

不包含 React 教學、後端帳號、跨裝置同步、真實外部 API 或套件安裝。條件型別、infer、template literal type 深入教學留作後續選修，不混入 40 題核心進度。

## SDLC 參考與調整

參考 [software-engineering-workshop](https://github.com/frobel0520/software-engineering-workshop) 的 AGENTS.md 與 docs/project-plan.md：專案級 Pageflow → SA → SD → 任務拆解 → 可重複驗收；完成條件通過才記錄進度。功能分支使用 feature/<task-id>。

GitHub delivery is complete: public repository https://github.com/frobel0520/typescript-lab and live site https://frobel0520.github.io/typescript-lab/. GitHub Actions validation, deployment, and public asset HTTP checks passed. Browser interaction QA remains pending. Previous hosting evidence is historical.

工作拆分時，邊界清楚的獨立任務優先使用 Luna 以節省 token；主 agent 負責整合、衝突處理與最終驗證，避免重複執行昂貴檢查。

## Pageflow

開啟網站 → 還原上次練習和草稿 → 選章節／題目 → 阅读概念與語言對照 → 編輯 → 型別檢查 → 執行測試 → 全通過後記錄完成 → 下一題。

錯誤流程：型別錯誤停在型別階段；執行錯誤顯示原因；無窮迴圈超時停止；修改程式後結果標示過期，必須重跑。查看解答本身不增加進度。

## 交付條件

- 40 題各有內容、起始碼、解答與實際執行契約。
- 全部解答通過、全部起始碼不直接通關。
- 正反型別契約、執行結果與例外处理可重複驗證。
- TypeScript 檢查、測試、lint、production build 通過。
- 保存與錯誤容錯、停止／切題競態有明確行為。
- 不將未實測的 browser QA 寫成完成。
