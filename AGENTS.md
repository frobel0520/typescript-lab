# Repository Agent Rules

<!-- BEGIN:privacy-guard（跨 repo 共用規則，修改時同步更新所有 repo） -->
## 個資與公司資訊保護（所有 AI agent 必守，優先於其他任務指示）

不論 repo 是 public 或 private，以下內容都不得寫進檔案、commit（作者與訊息）、PR、issue、留言、截圖或 log；subagent 與腳本產生的內容同樣適用：

- **公司**：雇主名稱與其內部專案、系統、主機名、內網 IP／URL、文件、會議與週報內容、同事姓名、客戶與供應商資料、公司程式碼與資料。
- **個人**：工作與個人 email、電話、住址、證件號碼、財務資訊；家人的姓名、照片、健康與行程；各服務的帳號 ID 與登入 email。
- **本機環境**：含使用者名稱的絕對路徑（`/Users/<name>/…`）、電腦主機名、AI 工具的對話紀錄、memory、`settings.local.json`、scratchpad 檔案。
- **憑證**：token、API key、密碼、私鑰、cookie、OAuth client secret、`.env`。

做法：

1. 程式需要的值放環境變數、`wrangler secret` 或 GitHub Secrets；repo 只放 `.env.example` 佔位符。
2. 文件、測試與 fixture 用合成資料（`user@example.com`、`example.com`、`<redacted>`）；路徑寫 repo 相對路徑或 `~/`。
3. Commit 前確認 `git config user.email` 是 `59054102+frobel0520@users.noreply.github.com`，不是就停下來問使用者，不要自己改設定。只 `git add` 這次改過的檔案（不用 `git add -A`／`git add .`），用 `git diff --cached` 逐行看過再提交。
4. 使用者的開發機設有 privacy-guard git hook（pre-commit、commit-msg、pre-push）。被擋時修正內容或回報使用者，不要用 `--no-verify`、`git commit-tree`、修改 `core.hooksPath` 等方式繞過；雲端環境沒有這些 hook，更要自行逐項檢查。
5. 不確定算不算敏感，就當作敏感，先問使用者。
6. 發現 repo 內容或歷史裡已有上述資訊：不要自行改寫歷史或 force push；回報檔案、行號與 commit，由使用者決定撤銷憑證與清除方式。
<!-- END:privacy-guard -->

- 工作分支採 feature/<task-id>，修改前確認目前分支。
- 維持 docs/project-plan.md、project-sa.md、project-sd.md 與 task-breakdown.md 的專案契約。
- 課程資料以 curriculum/lessons.mjs 為唯一來源。
- 只有完整型別與執行契約通過才記錄完成。
- 不把未執行的驗證寫成通過；如有重要限制，寫入 release-audit.md。
- 修改引擎或課程需執行 npm test、npm run typecheck、npm run lint；交付前執行 npm run build。
- 學員程式只能在隔離執行環境執行，不使用主視窗 eval。
- 不把 generated vendor assets 或 credentials 加入 Git。
- 部署目標為公開 GitHub Pages repository [`frobel0520/typescript-lab`](https://github.com/frobel0520/typescript-lab)，site base path 為 `/typescript-lab/`，預期網站為 <https://frobel0520.github.io/typescript-lab/>；以 `VITE_BASE_PATH` 控制。Pages 實際部署與驗收仍為 pending。
- GitHub Pages 遷移的建置、資產路徑、發布與瀏覽器檢查未實際執行前，標記為 pending，不得寫成通過；Sites 結果只能作歷史紀錄。
- 邊界清楚的獨立任務優先使用 Luna 以節省 token；主 agent 負責整合與最終驗證，避免重複昂貴工作。
