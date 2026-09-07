# 任務拆解

| ID | 工作 | 驗收 |
|---|---|---|
| T01 | 工作區與課程流程 | 導航、提示、解答、重設、進度、自動保存 |
| T02 | 40 題課程內容 | 每題解答通過，起始碼失敗 |
| T03 | 型別與執行引擎 | 正反契約、型別診斷、console、例外、超時 |
| T04 | 編輯器 | 補全、hover、快捷鍵、模組型別、fallback |
| T05 | 驗證與交付 | tests、typecheck、lint、build、GitHub Pages（`/typescript-lab/`） |

遷移驗收：GitHub Actions 建置／發布、base path 資產與 GitHub Pages 瀏覽器驗收目前 pending；公開或私有 repository 尚待使用者選擇。邊界清楚的獨立任務優先使用 Luna，主 agent 負責整合與最終驗證，避免重複昂貴工作。

各工作完成證據見 release-audit.md。這份清單不代替驗證結果。
