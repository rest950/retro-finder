# RetroFinder 🚀

一個幫助 Scrum 團隊快速找到合適 Sprint Retrospective（回顧會議）模式的小工具。

收錄 **12 種** 經典回顧框架，並提供「團隊現況快速測驗」，根據你目前面臨的挑戰（氣氛低迷、衝刺期、新團隊磨合、流程僵化等），推薦最適合的回顧形式。

線上版：<https://rest950.github.io/retro-finder>

## ✨ 主要功能

- **快速測驗**：複選團隊當前狀態，系統依權重推薦最契合的 3 種回顧模式。
- **模式總覽**：12 種回顧法的完整圖鑑（包含優點、缺點、適用情境、標籤分類）。
- **詳細圖解**：每種模式都附有畫布參考圖，並逐一說明每個區塊「該寫什麼」。
- **通用標籤系統**：不論使用哪種模式，皆對應到 `#值得慶祝 / #繼續保持 / #遇到阻礙 / #新嘗試 / #潛在風險 / #學習發現` 等通用分類，方便團隊快速理解與彙整。

## 🧩 收錄的 12 種回顧模式

小青蛙、高山、海盜船、花園、蜘蛛、施工現場、熱氣球、繁忙樂園、賽車、Scrum 價值觀、Scrum 事件、團隊回顧畫布。

## 🛠 技術棧

- React 19 + Vite
- Tailwind CSS
- lucide-react（圖示）
- GitHub Pages（部署）

## 🚀 快速開始

```bash
npm install
npm run dev      # 本機開發
npm run build    # 產出靜態檔
npm run deploy   # 部署到 GitHub Pages
```

## 📚 內容來源與致謝

本專案收錄的 12 種 Retrospective 框架（小青蛙、海盜船、花園、熱氣球、賽車等）以及對應的畫布參考圖，內容與圖片皆來自：

> **Scrum Adventures — Retrospectives**
> <https://scrumadventures.com/retrospectives/>

原作者擁有其內容、圖片與框架設計之版權。本專案僅將這些優秀的回顧框架整理成中文化、互動式的查找工具，**僅供學習、團隊內部分享等非商業用途**。

如果你喜歡這些回顧框架，強烈建議直接前往原網站閱讀完整的英文說明與更多 Scrum 相關資源 🙌

## 🔒 隱私說明

- 本站為**純靜態網頁**，部署於 GitHub Pages，**不主動收集任何使用者個資**（沒有後端、沒有表單、沒有 Analytics 追蹤）。
- 但詳細頁面中的「畫布參考圖」是直接引用自 scrumadventures.com（透過 `i0.wp.com` CDN）。當您瀏覽該頁面時，您的瀏覽器會直接向對方伺服器請求圖片，對方可能會收到您的 IP 與瀏覽器資訊。
- 我們已在 `<img>` 加上 `referrerPolicy="no-referrer"`，避免將本站 URL 作為 Referer 洩漏給對方。
- 關於 scrumadventures.com 如何處理使用者資料，請參閱其 [Privacy Policy](https://scrumadventures.com/privacy/)。

## ⚖️ 授權與使用聲明

- 本專案程式碼以開源方式提供，可自由 fork、學習與修改。
- 框架內容、畫布圖片之版權歸屬 [Scrum Adventures](https://scrumadventures.com/) 原作者所有。
- **請勿** 將本專案或其中引用的圖片、框架內容用於任何商業用途。
- 若原作者希望調整引用方式或移除特定內容，請開 issue 通知，將立即配合處理。
