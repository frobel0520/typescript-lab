# Repository Agent Rules

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
