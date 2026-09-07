# 系統分析

## 使用案例

1. 有經驗的開發者快速切換章節，查看 C++／C#／Python 對照。
2. 修改真實程式碼，看到 TypeScript 補全、hover 型別與診斷。
3. 一鍵驗證型別、非法用法及執行結果，修正後重跑。
4. 卡關時逐層查看提示與解答，再自行執行。
5. 離開後在同一瀏覽器接續草稿與進度。
6. 在自由練習區實驗程式，不累計課程完成。

## 契約

- curriculum/lessons.mjs 為課程順序、內容、測試的單一來源。
- completed 表示曾經成功完成的題目；後續修改不抹除歷史，但目前結果會標示過期。
- localStorage 故障時繼續允許學習，清楚顯示無法儲存。
- 重設只影響當題草稿，需在介面確認；不清除歷史完成。
- 模組題提供固定 math.ts / models.ts；不支援任意 npm import。
- 執行 timeout 為 3 秒，編譯 timeout 為 30 秒；可手動停止。
- 型別檢查使用 TypeScript 5.9.3；Monaco 0.52.2 的即時語言服務版本不同，正式過關以執行按鈕的 5.9.3 檢查為準。

## 風險

本機進度可被使用者修改，不適用考試認證。測試涵蓋教學契約與常見錯誤，並非惡意解答的防作弊系統。語法正確不代表所有輸入都正確，題目以具名範例和型別契約提供回饋。

## 部署與協作約束

網站部署目標為公開 GitHub Pages repository [`frobel0520/typescript-lab`](https://github.com/frobel0520/typescript-lab)，預期網站為 <https://frobel0520.github.io/typescript-lab/>，site base path 為 `/typescript-lab/`，由 `VITE_BASE_PATH` 控制。GitHub Pages 的靜態部署、base path、資產與瀏覽器驗收在遷移檢查完成前維持 pending。

邊界清楚的獨立任務優先交給 Luna；主 agent 負責整合與一次性的完整驗證，避免平行工作重複消耗 token。
