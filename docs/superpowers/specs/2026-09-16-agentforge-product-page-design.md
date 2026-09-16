# CRIS AgentForge Platform 產品頁改版 — 設計規格

日期：2026-09-16
狀態：待實作

---

## 1. 目標與範圍

把現有的「CRIS AI 一體機」產品（`/products/ai-box`）整個改版成「CRIS AgentForge Platform」，
並移除導覽列中連到外部網站 `crisforge.com` 的產品項目。

產品頁內容全部重寫，原本的「私有化部署 / 資料主權 / 零 Token 費用 / 硬體一體機」主張全數移除，
改成四大節：AI+（應用系統）、+AI（自動化操作）、DATA INSIGHT、企業案例（14 個工作流）。

### 範圍內

- 新產品頁 `/products/agentforge`（取代 `/products/ai-box`）
- 導覽列移除 crisforge.com 外連項目
- 全站對舊產品的連結與名稱更新（Navbar / Footer / Features / CMS 後台）
- 繁中 / 简中 / EN 三語系內容
- 刪除死碼 `AIAppliance.jsx` 與 `ai_appliance.*` locale keys
- 依 CLAUDE.md 規定，新元件同步補進 `/design-system` 文件頁

### 範圍外

- 不動 APS / ESG / Mission Control / Solutions 等其他產品頁
- 不動 Supabase 資料庫內容（舊的 `page_id='aibox'` CMS 覆寫列留著不管）
- 不做 `/products/ai-box` 的轉向

---

## 2. 決策紀錄

| # | 決策 | 選擇 | 備註 |
|---|---|---|---|
| 1 | 舊「一體機」賣點 | **全部拿掉，完全重寫** | 私有化部署、資料主權、零 Token 費用、KPI（100%/0元/99.9%/∞）全刪 |
| 2 | 網址 | **`/products/agentforge`，不做轉向** | 舊網址直接移除；網站搬遷不久，舊連結影響小 |
| 3 | 多語系 | **繁中 / 简中 / EN 三語都做** | 繁中為準；简中做繁轉簡＋大陸用語在地化；EN 重寫成 B2B 文案 |
| 4 | 14 個工作流排法 | **3 個旗艦攤開全寬 ＋ 11 個網格** | 工作流 pipeline 與 before→after 數字不藏在 Modal 裡 |
| 5 | AI+ / +AI 排法 | **對照導言 ＋ 兩節堆疊網格** | 12 項全部露出，導言負責解釋兩者差異 |
| 6 | Hero 主視覺 | **Multi-Agent 協作網絡** | 中心平台 + 5 個 Agent 節點，連線流動 |
| 7 | 案例 2 成果樣式 | **照原稿，用不同樣式區隔** | 標「質化成果」，不編造數字 |
| 8 | DATA INSIGHT 的 80% | **不標免責聲明** | 屬實際導入成果，性質與情境試算不同 |
| 9 | 舊 CMS 資料 | **留著不管** | 程式改讀 `page_id='agentforge'`，舊列成為孤兒但不影響前台 |

---

## 3. 頁面資訊架構

```
/products/agentforge

① Hero
   麵包屑  首頁 / 產品 / CRIS AgentForge Platform
   Badge   企業智慧團隊鍛造平台
   H1      CRIS AgentForge Platform（AgentForge 走紫色漸層）
   說明    從單點應用到企業營運，多個工作場景已成功落地。
           AI 不只是回答問題，而是真正參與企業工作。
   CTA     預約 Demo ／ 看 14 個工作場景 ↓
   標籤    Multi-Agent · 工作流自動化 · 企業知識庫 · 資料安全 · ERP/MES/CRM 整合
   右視覺  <AgentNetwork /> Multi-Agent 協作網絡

   ── 吸頂子導覽（捲過 Hero 後淡入）──
      雙軌能力 · 數據洞察 · 企業案例 · 預約諮詢

② 雙軌能力  #dual                                   白底
   對照導言   AI+ 把 AI 加進營運決策  ←→  +AI 把執行交給 AI
   ②a AI+（應用系統）· 智慧決策與營運應用平台      6 張卡（lg 3 欄 / md 2 欄 / sm 1 欄）
   ②b +AI（自動化操作）· 智慧自動化與 AI Agent 平台  6 張卡（同上）

③ DATA INSIGHT  #insight                            深色底（bg-slate-900 dark:bg-slate-950）
   標題 AI 數據分析與智慧報告平台
   左右對照   企業痛點 ×5    →    導入後企業獲得 ×5
   三階段     <AgentFlow /> ① Data Analysis → ② Dashboard → ③ Report Agent
   雲市集卡片  已上架經濟部雲市集 + 4 個賣點 + 外連按鈕

④ 企業案例  #cases                                  白底
   平台價值   5 條 ✔
   ④a 旗艦案例 ×3（全寬、左右交錯排列）
        每個 = 背景 ｜ 痛點 ｜ <AgentFlow /> ｜ 可量化成果 ｜ 免責聲明
   ④b 更多工作場景 ×10（網格卡片）
   ④c 第 14 張：建立專屬於您的 AI Agent 團隊（客製化 CTA 卡，紫色強調）

⑤ CTA Banner   預約諮詢
```

### 設計決定與理由

**深色底的 DATA INSIGHT。** 四大節全白底會變成看不到盡頭的捲軸。DATA INSIGHT 用深色底當視覺換氣點，
也讓 ①→②→③ 的 Agent pipeline 圖最好看。沿用現有 AI 一體機頁「AI 軟體堆」區塊的手法。

**`<AgentFlow />` 是整頁的敘事骨架。** DATA INSIGHT 的三階段與三個旗艦案例的工作流，
共用同一個流程圖元件（共 4 處），讓「AI Agent 依序接手完成工作」這個主張在整頁重複四次。
Hero 的 `<AgentNetwork />` 是另一個元件（節點網絡，不是線性流程），但共用同一套紫色節點／
流動連線的視覺語言，讓訪客捲到下面時認得出是同一件事。

**免責聲明不縮小、不藏。** 三個旗艦案例的「依實際資料進行情境試算，非已導入成果」
放在成果數字正下方，`text-xs text-slate-500`，清楚可讀。

**色系維持紫色。** 與 APS（藍）、ESG（綠）區隔，沿用現有一體機頁的 violet 主調。

---

## 4. 元件拆解與檔案結構

內容量約為現有一體機頁的三倍。單檔會超過 1400 行（現有最大的 `MissionControl.jsx` 已 1781 行，
不易維護），因此拆成一頁 + 一個元件資料夾。

```
src/pages/AgentForgeProduct.jsx            Hero + 區塊組裝 + 吸頂子導覽   ~230 行
src/constants/agentforge.js                icon 字串鍵 → lucide 對應表    ~35
src/components/agentforge/
  ├── AgentNetwork.jsx      Hero 的 Multi-Agent 協作網絡動畫            ~130
  ├── DualMode.jsx          AI+ / +AI 對照導言 + 兩組 6 卡              ~150
  ├── DataInsight.jsx       痛點/獲得對照 + 三階段 + 雲市集             ~170
  ├── WorkflowCases.jsx     5 條平台價值 + 3 旗艦 + 10 網格 + 客製卡    ~300
  ├── AgentFlow.jsx         共用的 ①→②→③ 流程圖元件                   ~90
  └── FadeUp.jsx            共用進場動畫包裝（資料夾內 5 個元件共用）    ~20
scripts/check-i18n.mjs                     三份 locale key 對齊校驗      ~55
```

### 各元件的責任與介面

| 元件 | 做什麼 | Props | 相依 |
|---|---|---|---|
| `AgentForgeProduct` | 頁面組裝、Hero、吸頂子導覽的捲動狀態 | 無 | 以下全部 |
| `AgentNetwork` | 中心節點 + 5 個環繞 Agent 節點 + 流動連線的純 CSS/framer-motion 視覺 | 無 | framer-motion |
| `DualMode` | 對照導言卡 + 兩組標題與 6 卡網格 | 無（自行讀 i18n） | `ICON_MAP` |
| `DataInsight` | 痛點/獲得左右對照 + 三階段 + 雲市集外連卡 | 無（自行讀 i18n） | `AgentFlow` |
| `WorkflowCases` | 平台價值 + `FlagshipCase` ×3 + 網格卡 ×10 + 客製卡 | 無（自行讀 i18n） | `AgentFlow`、`ICON_MAP` |
| `AgentFlow` | 把步驟陣列畫成 ①→②→③ 垂直/水平流程圖 | `steps`, `orientation`, `tone` | framer-motion |

`FlagshipCase` 是 `WorkflowCases.jsx` 內部的區域元件，不獨立成檔（只在該處使用）。

### 刪除

```
src/pages/AIBoxProduct.jsx          整頁改版，不再使用
src/components/AIAppliance.jsx      死碼：全專案沒有任何 import，內容講的是「一體機」
```

---

## 5. i18n 資料結構

新增 namespace `agentforge.*`，刪除 `aibox.*` 與 `ai_appliance.*`。
`navbar.agentforge_name` / `navbar.agentforge_desc` 已存在且文案正確（「CRIS AgentForge Platform」/
「企業智慧團隊鍛造平台」），直接沿用；刪除 `navbar.aibox_name` / `navbar.aibox_desc`。

```jsonc
"agentforge": {
  "breadcrumb": "CRIS AgentForge Platform",
  "badge": "企業智慧團隊鍛造平台",
  "hero_title": "CRIS AgentForge",
  "hero_title_gradient": "Platform",
  "hero_subtitle": "企業智慧團隊鍛造平台",
  "hero_desc": "…",
  "cta_primary": "預約 Demo",
  "cta_secondary": "看 14 個工作場景",
  "tags": ["Multi-Agent", "工作流自動化", "企業知識庫", "資料安全", "ERP/MES/CRM 整合"],

  "subnav": { "dual": "雙軌能力", "insight": "數據洞察", "cases": "企業案例", "contact": "預約諮詢" },

  "dual": {
    "tag": "雙軌能力",
    "title": "兩種導入路徑，一個平台",
    "compare": {
      "a_label": "AI+", "a_head": "把 AI 加進營運決策", "a_desc": "…",
      "b_label": "+AI", "b_head": "把執行交給 AI",     "b_desc": "…"
    },
    "aiplus": {
      "label": "AI+（應用系統）",
      "title": "智慧決策與營運應用平台",
      "intro": "…",
      "items": [ { "icon": "search", "title": "…", "slogan": "…", "desc": "…", "points": ["…"] } ]  // ×6
    },
    "plusai": {
      "label": "+AI（自動化操作）",
      "title": "智慧自動化與 AI Agent 平台",
      "intro": "…",
      "items": [ /* 同上結構 ×6 */ ]
    }
  },

  "insight": {
    "tag": "DATA INSIGHT",
    "title": "AI 數據分析與智慧報告平台",
    "intro": "…",
    "pains_label": "企業痛點",
    "pains": ["…"],                                   // ×5
    "gains_label": "導入後企業獲得",
    "gains": ["…"],                                   // ×5
    "agents": [ { "en": "Data Analysis Agent", "zh": "資料分析代理人", "desc": "…" } ],  // ×3
    // ①②③ 是呈現層的事，由元件端的 NUMERALS 陣列產生，不進 locale
    "market": {
      "tag": "雲市集",
      "title": "AI Agent 導入更簡單",
      "desc": "…",
      "points": ["…"],                                // ×4
      "cta": "前往經濟部雲市集",
      "url": "https://keid.nat.gov.tw/cloud/Web/ai_solution_in.aspx?P=7f3e42ee-8167-e9a1-aac9-9178981d9338"
    }
  },

  "cases": {
    "tag": "企業案例",
    "title": "14 個已落地的工作場景",
    "intro": "…",
    "values_label": "打造企業專屬 AI Workforce",
    "values": [ { "title": "…", "desc": "…" } ],      // ×5

    // 以下五個標籤三個旗艦案例共用，不逐筆重複
    "flagship_label": "旗艦案例",
    "background_label": "背景",
    "pains_label": "痛點",
    "flow_label": "工作流",
    "disclaimer": "依實際資料進行情境試算，非已導入成果",

    "flagship": [
      {
        "title": "生產排程與緊急插單",
        "summary": "…",
        "background": "…",
        "pains": ["…"],
        // agents 是字串不是陣列；多個 Agent 用全形「＋」串在同一字串裡，
        // 這樣 locale 好翻譯，AgentFlow 也不必處理陣列 join
        "flow": [ { "agents": "排程分析 Agent", "label": "排程狀態分析", "human": false } ],
        // metrics_label 逐筆定義：案例 1、2 用「可量化成果」「質化成果」，案例 3 原稿作「可衡量效益」
        "metrics_label": "可量化成果",
        "metrics_kind": "delta",                       // "delta" = before→after；"qualitative" = 方向箭頭
        "metrics": [ { "label": "訂單準交率", "before": "約 71%", "after": "85～90%" } ]
      }
      // ×3
    ],
    "more_label": "更多工作場景",
    "more": [ { "icon": "headphones", "title": "…", "desc": "…", "points": ["…"] } ],  // ×10
    "custom": {
      "title": "建立專屬於您的 AI Agent 團隊",
      "desc": "…",
      "tagline": "您的需求，就是下一個 Agent 工作場景",
      "points": ["…"],                                 // ×5
      "cta": "聊聊你的工作場景"
    }
  },

  "cta_title": "…", "cta_subtitle": "…", "cta_btn": "預約諮詢"
}
```

### 兩種成果樣式

`metrics_kind` 決定渲染方式：

- `"delta"`（案例 1、3）— 刪除線舊值 ＋ 大字新值：`約 71%` → **`85～90%`**
- `"qualitative"`（案例 2）— 方向箭頭 ＋ 說明：`缺貨率 ↓` ／ 即時掌握需求與庫存缺口

案例 2 的資料仍保留 `before` / `after` 空欄位，日後補上數字時只要填 locale 檔、
把 `metrics_kind` 改成 `"delta"` 即可，不需改程式。

### 圖標對應

Emoji 不進 locale 檔。locale 存 `icon` 字串鍵，元件端用靜態對應表換成 lucide 圖標
（沿用 `src/constants/cases.js` 的 `ICON_MAP` 模式）。理由：emoji 在 Windows／Mac／Android
渲染不一致，彩色 emoji 與網站的乾淨 B2B 調性衝突，且 CLAUDE.md 指定圖標用 lucide-react。

| 原稿 | icon key | lucide |
|---|---|---|
| 🔍 ATP/CTP 精敏詢單 | `search` | `Search` |
| 🏭 先進物料與產能規劃 | `factory` | `Factory` |
| 📅 APS 智慧排程 | `calendar` | `CalendarClock` |
| 🔗 供應鏈協作平台 | `link` | `Network` |
| 🤖 Multi-Agent 智慧資料分析 | `bot` | `Bot` |
| ⚡ Multi-Agent 智慧操作數智員工 | `zap` | `Zap` |
| 📈 設備監控系統 | `activity` | `Activity` |
| 📋 智慧報工系統 | `clipboard` | `ClipboardList` |
| 📊 ERP 採購與財務分析 | `chart` | `BarChart3` |
| 🔧 智慧技術支援服務 | `wrench` | `Wrench` |
| 💬 AI 客服系統 | `message` | `MessageSquare` |
| ⚠️ 品質異常與設備維護 | `alert` | `AlertTriangle` |
| 智慧售服 | `headphones` | `Headphones` |
| ESG 碳盤查 | `leaf` | `Leaf` |
| AI+BPM 差勤與文管 | `filecheck` | `FileCheck2` |
| 智慧報關 | `ship` | `Ship` |
| 倉儲管理 WMS | `package` | `Package2` |
| AIOT 與產線邊緣監控 | `cpu` | `Cpu` |
| 能源與碳排管理 | `gauge` | `Gauge` |
| AOI 與智慧品質管理 | `scan` | `ScanLine` |
| 產銷協調會議 | `users` | `Users` |
| 結合 RPA 資料處理 | `repeat` | `Repeat2` |
| 建立專屬 AI Agent 團隊 | `sparkles` | `Sparkles` |

---

## 6. 內容清單（繁中為準）

以下為 locale 檔的內容來源。简中由繁轉簡＋大陸用語在地化（資訊→信息、產能→产能、
軟體→软件等）；EN 重寫為 B2B 文案，不做逐字直譯。

### 6.0 Hero

| 欄位 | 內容 |
|---|---|
| `badge` | 企業智慧團隊鍛造平台 |
| `hero_title` / `hero_title_gradient` | CRIS AgentForge ／ Platform |
| `hero_subtitle` | 企業智慧團隊鍛造平台 |
| `hero_desc` | 從單點應用到企業營運，多個工作場景已成功落地。AI 不只是回答問題，而是真正參與企業工作。 |
| `cta_primary` | 預約 Demo |
| `cta_secondary` | 看 14 個工作場景 |
| `tags` | Multi-Agent · 工作流自動化 · 企業知識庫 · 資料安全 · ERP/MES/CRM 整合 |

`hero_desc` 同時是 CMS 可覆寫欄位（`useCmsContent('agentforge', 'hero_desc')`）。

### 6.1 AI+（應用系統）· 智慧決策與營運應用平台

> 讓企業從資料驅動走向智慧決策，提升營運效率與競爭優勢。
> 整合接單、生產、供應鏈與經營分析等核心場景，協助企業即時掌握營運狀況並提升決策品質。

| # | 標題 | 一句話 | 說明 | 效益 |
|---|---|---|---|---|
| 1 | ATP/CTP 精敏詢單 | 接單前了解是否能準時交貨 | 即時評估物料、產能與排程狀況，快速提供可靠交期承諾 | 降低誤接訂單與延遲交貨風險／提升接單成功率／建立客戶對交期的信任 |
| 2 | 先進物料與產能規劃 | 提前看見缺料與產能瓶頸 | 整合 BOM、庫存、採購與生產資訊，自動分析未來缺料風險與產能負荷，協助企業提前規劃 | 降低缺料停工風險／提高生產計畫準確度 |
| 3 | APS 智慧排程 | 生產排程不再依賴人工經驗 | 透過 AI 與模擬演算，自動產生最佳生產排程方案，即時因應插單、急單與異常狀況 | 提升設備利用率／縮短交期／降低在製品庫存 |
| 4 | 供應鏈協作平台 | 打造即時透明的供應鏈協同機制 | 串聯企業、供應商與外包夥伴資訊，讓採購、交期、出貨與異常處理能即時協作與追蹤 | 提升供應鏈反應速度／降低溝通成本與資訊落差 |
| 5 | Multi-Agent 智慧資料分析 | 資料自動變成管理洞察 | AI Agent 自動整合企業資料、執行分析、生成儀表板與管理報告 | 快速掌握營運現況／減少報表整理時間／加速數據驅動決策 |
| 6 | Multi-Agent 智慧操作數智員工 | 讓 AI 成為企業的數位執行助手 | AI Agent 可依據標準流程執行資料查詢、系統操作、回覆問題與跨系統協作 | 減少重複性工作／提升作業效率／人力專注於更高價值工作 |

### 6.2 +AI（自動化操作）· 智慧自動化與 AI Agent 平台

> 打造企業全天候運作的數位員工團隊，降低人工作業負擔並提升執行效率，
> 讓資訊查詢、分析判斷與流程執行自動化。

| # | 標題 | 一句話 | 說明 | 效益 |
|---|---|---|---|---|
| 1 | 設備監控系統 | 設備異常從被動處理變成主動預警 | 即時監控設備運轉、稼動率與異常訊號，透過 AI 分析提前發現潛在問題 | 降低停機風險與維修成本／提升設備利用率／降低非預期停機損失 |
| 2 | 智慧報工系統 | 現場生產進度即時透明化 | 透過 QR Code 與行動裝置快速報工，自動回傳工單進度、生產狀況與設備資訊 | 減少人工填報與資訊延遲／提升現場管理效率／即時掌握生產執行情況 |
| 3 | ERP 採購與財務分析系統 | 將 ERP 資料自動轉為經營洞察 | AI Agent 直接分析採購、成本、庫存與財務數據，自動產出分析結果與管理報表 | 縮短決策準備時間／快速掌握成本結構與採購風險／提升經營決策效率 |
| 4 | 智慧技術支援服務系統 | 企業客服與技術支援 24 小時在線 | 整合知識庫、FAQ 與 AI Agent，自動回覆技術問題、產品諮詢與服務需求 | 提高回覆速度與服務品質／降低人力成本 |
| 5 | AI 客服系統 | 全天候智慧客服中心 | 透過 AI Agent 自動理解客戶問題，提供即時回覆、資訊查詢與服務引導，提升客戶互動體驗 | 提升客戶滿意度／減少重複性客服工作 |
| 6 | 品質異常與設備維護系統 | 提早發現品質問題與設備風險 | 整合品質檢驗、異常通報與設備維護資訊，利用 AI 自動分析異常原因並提供改善建議 | 降低品質成本／減少不良品與設備故障風險 |

### 6.3 DATA INSIGHT · AI 數據分析與智慧報告平台

> 從資料蒐集、分析決策到管理報告，全流程由 AI Agent 自動完成。

**企業痛點**（5）：資料分散難以整合 · 分析耗時 · 報表產製負擔重 · 部門數據不一 · 決策速度慢
（注意：原稿第 1 項作「資料分散自動整合」，語意不通，已修正為「資料分散難以整合」——
見 §9 待確認文案）

**導入後企業獲得**（5）：
報表製作時間減少 80% · 即時掌握關鍵 KPI · 降低跨部門溝通成本 · 建立標準化決策流程 · 從資料走向決策

**三階段 Agent**：

| 階段 | 名稱 | 說明 |
|---|---|---|
| ① | Data Analysis Agent 資料分析代理人 | 自動整合 ERP、MES、CRM 與 Excel 資料，將資料轉換為可執行洞察 |
| ② | Dashboard Agent 智慧儀表板代理人 | 即時產生儀表板與 KPI 監控畫面，快速掌握營運現況 |
| ③ | Report Agent 智慧報告代理人 | 自動生成管理報告與決策摘要，減少報告撰寫時間 |

**雲市集卡片**：

> **AI Agent 導入更簡單** — 已上架經濟部雲市集 AI 工具庫。
> 不需自行開發，即可快速導入企業級 AI 資料分析、儀表板與報告生成平台。
>
> ✔ 直接線上採購 ✔ 快速部署上線 ✔ 政府補助方案可搭配申請 ✔ 降低 AI 導入成本
>
> 外連：`https://keid.nat.gov.tw/cloud/Web/ai_solution_in.aspx?P=7f3e42ee-8167-e9a1-aac9-9178981d9338`
> （`target="_blank" rel="noopener noreferrer"`，附外連圖標）

### 6.4 企業案例

標題：**14 個已落地的工作場景**（見 §9 第 2 點）

簡介（原稿的前兩句已移到 Hero，此處另擬）：
> 涵蓋接單、排程、供應鏈、品質、ESG 到行政流程。每一個都是可直接套用的 Multi-Agent 工作流，
> 不是從零開始的客製專案。

**平台價值**（5 條 ✔）：

| 標題 | 說明 |
|---|---|
| 企業資料安全機制 | 支援資料脫敏、權限控管與加密處理，讓 AI 能安心應用企業核心資料 |
| 持續工作的 AI Agent | 可執行長時間、多步驟與定時任務，不只是一次性的問答工具 |
| 具備長期記憶能力 | 結合企業知識庫與歷史經驗累積，提供更精準且符合企業情境的回應與決策建議 |
| 直接套用企業工作場景 | 內建多種企業級 Workflow，從分析、決策到執行，快速落地 AI 應用 |
| 打造企業專屬 AI Workforce | 從單一 Agent 到多 Agent 協作，建立可持續運作的數位員工團隊 |

#### 旗艦案例 1 — 生產排程與緊急插單

摘要：整合訂單、產能、物料與設備資訊，自動規劃最佳生產排程方案。

**背景**：某電子製造企業主要承接多品項、少量多樣的電子產品製造與組裝訂單，生產流程包含多階段製程，
需要依據不同訂單需求安排多類型生產資源。其訂單品項多、製程階層複雜、交期要求高且生產資源需動態調度；
當訂單集中或需求異動時，容易形成特定產線與製程瓶頸。

**痛點**：訂單延遲難以即時掌握 · 瓶頸產能造成長時間排隊 · 多階製程難以同步調度 · 排程調整高度依賴人工判斷

**工作流**：

| 步驟 | Agent | 任務 |
|---|---|---|
| ① | 排程分析 Agent | 排程狀態分析 |
| ② | 產能分析 Agent ＋ 交期風險 Agent | 瓶頸與交期風險辨識 |
| ③ | 排程優化 Agent | 排程方案模擬 |
| ④ | 決策 Agent | 方案比較與決策 |
| ⑤ | Human Review | 管理者確認（`human: true`，樣式與 Agent 步驟區隔） |

**可量化成果**（`metrics_kind: "delta"`）：

| 指標 | before | after |
|---|---|---|
| 訂單準交率 | 約 71% | 85～90% |
| 平均延遲 | 約 46 天 | < 20 天 |
| 整體資源稼動率 | 約 77% | 85%+ |
| 生管人工排程工時 | 約 20 小時／週 | 約 8 小時／週 |

免責：依實際資料進行情境試算，非已導入成果

#### 旗艦案例 2 — 供應鏈協調與智慧採購

摘要：串聯企業與供應商資訊，自動追蹤需求、交期與供料狀態。AI Agent 協助採購分析、
風險預警與供應商協同管理，提升供應鏈韌性與反應速度。

**背景**：某快速消費品零售企業，經營多據點、多品項的日常消費商品，產品具有消費頻率高、
SKU 數量多、需求變化快速等特性，並透過多個銷售據點服務終端消費者。客戶需求容易受季節、
節慶及促銷活動影響，不同區域的商品銷售速度亦存在差異。當促銷活動或需求突然增加時，
若無法及時預測需求並協調庫存與物流，容易產生部分據點缺貨、部分區域庫存過剩，
以及緊急調貨成本增加等問題。

**痛點**：需求變化難以及時預測 · 區域庫存分布不均 · 促銷備貨難以精準掌握 · 採購與物流協調耗時

**工作流**：

| 步驟 | Agent | 任務 |
|---|---|---|
| ① | 需求預測 Agent | 需求感知與預測 |
| ② | 採購決策 Agent | 採購需求判斷 |
| ③ | 供應商管理 Agent ＋ 物流調度 Agent | 庫存與物流協調 |
| ④ | 風險監控 Agent ＋ Orchestrator Agent | 異常預警與決策 |

**質化成果**（`metrics_kind: "qualitative"`）：

| 指標 | 方向 | 說明 |
|---|---|---|
| 缺貨率 | ↓ | 即時掌握需求與庫存缺口 |
| 備貨準確率 | ↑ | 促銷需求提前預測 |
| 庫存失衡 | ↓ | 跨區庫存動態調配 |
| 採購行政工時 | ↓ | Agent 自動彙整與分析 |

免責：依實際資料進行情境試算，非已導入成果

#### 旗艦案例 3 — OTD 從接單到出貨

摘要：從接單、排程、生產到出貨，全流程即時追蹤與管理。AI Agent 主動監控訂單履行情況，
預測交期風險，確保準時交付（OTD）目標達成。

**背景**：某電子製造企業，具備 SMT、插件、波焊及 SPI、AOI、X-Ray 等電子組裝與品質檢測設備，
主要承接高混合、少量多樣的 EMS 製造訂單，客戶需求變動頻繁且交期要求緊縮。
企業每日面臨大量詢單與訂單異動，需跨部門共同協調，並即時掌握進度與品質狀態。

**痛點**：詢單回覆慢 · 跨部門資訊斷點 · 物料與產能風險難提前發現 · OTD 風險無法事先得知

**工作流**：

| 步驟 | Agent | 任務 |
|---|---|---|
| ① | 業務詢答 Agent ＋ ATP／CTP 試算 Agent ＋ PO／SO Agent | 接單與交期承諾 |
| ② | 物料／產能規劃 Agent ＋ 採購協同 Agent | 物料與產能協同 |
| ③ | 生產／品質監控 Agent ＋ 出貨／售後 Agent | 生產與品質監控 |
| ④ | OTD 決策 Agent | 出貨與 OTD 決策 |

**可量化成果**（`metrics_kind: "delta"`，標題用原稿的「可衡量效益」）：

| 指標 | before | after |
|---|---|---|
| 詢單回覆時間 | 4-6 hr | < 30 min |
| 報價／交期準確率 | 70% | 92%+ |
| OTD 準時達交率 | 82% | 95% |
| 生管人工排程 | 20 hr／週 | 8 hr／週 |

免責：依實際資料進行情境試算，非已導入成果

#### 更多工作場景（10 張網格卡）

| # | 標題 | 說明 | 效益 |
|---|---|---|---|
| 4 | 智慧售服 | 整合客服、技術支援與知識庫資料，自動回應客戶問題與服務需求 | 客戶問題即時回應，提升滿意度與黏著度／降低客服與技術支援人力成本／減少人員異動造成的服務品質落差／建立企業知識持續累積與傳承機制 |
| 5 | ESG 碳盤查與資料解析報告 | 自動整合能源、設備與營運數據，執行碳排放盤查與 ESG 指標分析，快速生成報表與管理報告 | 即時掌握碳排放與永續績效指標／快速完成客戶、供應鏈與法規要求資料準備／提升 ESG 揭露與稽核應對能力 |
| 6 | AI+BPM 企業差勤管理與文管 | 將請假、簽核、文件與行政流程數位化與自動化，協助流程追蹤、文件查詢與規範執行 | 強化企業制度落實與內部稽核能力／提升簽核與文件流轉效率／降低行政與人資作業成本 |
| 7 | 智慧報關系統 | 整合進出口文件、產品資訊與法規要求，自動協助報關作業 | 強化跨境物流與國際貿易競爭力／縮短通關與出貨等待時間／降低報關資料錯誤與罰款風險 |
| 8 | 倉儲管理 WMS 系統 | 即時掌握庫存、收貨、出貨與庫位狀況，建立智慧化倉儲管理流程 | 提高庫存週轉率與資金使用效率／降低缺料、超額採購與呆滯庫存／提升倉儲作業效率與空間利用率 |
| 9 | AIOT 與產線邊緣監控 | 連接設備、感測器與產線數據，即時掌握設備運轉與生產狀況，主動分析異常訊號與設備健康度 | 降低非預期停線損失／預先發現設備異常與停機風險／提升設備稼動率與生產效率 |
| 10 | 能源與碳排管理 | 即時監控能源使用狀況與碳排放資料，掌握高耗能設備與異常耗用情形，並提供節能建議與減碳分析報告 | 即時掌握能源成本與耗能熱點／找出節能改善機會並降低營運成本 |
| 11 | AOI 與智慧品質管理 | 結合 AOI 檢測與品質管理數據，自動分析不良原因與品質趨勢 | 提前發現異常並縮短問題處理時間／降低不良率與品質成本 |
| 12 | 產銷協調會議 | 整合業務接單、生產排程、庫存與供應鏈資訊，自動彙整決策所需數據，協助產生會議摘要、風險分析與行動建議 | 提前識別交期、物料與產能風險／降低資訊落差與溝通成本／讓管理會議從報告資料轉向決策行動 |
| 13 | 結合 RPA 資料處理 | 透過 RPA 與 AI Agent 協同作業，自動完成資料蒐集、轉換、比對與彙整 | 大幅減少重複性人工作業／使人力專注於高價值分析與決策工作／提高整體作業效率與速度 |

#### 第 14 張：客製化 CTA 卡

> **建立專屬於您的 AI Agent 團隊**
>
> 每家企業都有獨特的流程與管理需求。我們可依據企業 SOP、知識文件、系統資料與工作規則，
> 快速打造專屬 Multi-Agent 工作流，讓 AI 成為真正參與企業營運的數位團隊。
>
> **您的需求，就是下一個 Agent 工作場景**
>
> ✔ 客製化流程設計
> ✔ 串接 ERP / MES / CRM / WMS 等系統
> ✔ 整合知識庫與企業規範
> ✔ AI 分析、決策與自動執行
> ✔ 快速建立企業專屬 AI Workforce
>
> CTA → `/contact`

### 6.5 CTA Banner（原稿未提供，此處另擬）

| 欄位 | 內容 |
|---|---|
| `cta_title` | 打造企業專屬的 AI Workforce |
| `cta_subtitle` | 您的需求，就是下一個 Agent 工作場景。告訴我們您的流程，我們協助評估可落地的 Multi-Agent 方案。 |
| `cta_btn` | 預約諮詢 → `/contact` |
| `cta_back` | 回到工作場景 → `#cases` |

---

## 7. 全站連動修改清單

| 檔案 | 修改 |
|---|---|
| `src/App.jsx` | import 改 `AgentForgeProduct`；路由 `/products/ai-box` → `/products/agentforge` |
| `src/components/Navbar.jsx` | **移除 `external: true` 連到 `https://www.crisforge.com/` 的產品項目**；第 3 項產品改用 `navbar.agentforge_name` / `navbar.agentforge_desc` 並指向 `/products/agentforge`；`ctaStyle` 對應表 key 改為 `/products/agentforge`（維持 violet）。若移除後不再有任何 external 產品，`ProductLink` 與 `ExternalLink` import 一併清掉 |
| `src/components/Footer.jsx` | 產品欄第 3 項 `navbar.aibox_name` → `navbar.agentforge_name`，href → `/products/agentforge` |
| `src/components/Features.jsx` | 第 3 張卡 `href` → `/products/agentforge`；`features_data` 第 3 筆文案改寫（見 §9） |
| `src/pages/AdminContent.jsx` | `{ id: 'aibox', label: 'AI 一體機' }` → `{ id: 'agentforge', label: 'CRIS AgentForge Platform' }`，section 維持只有 `hero_desc` |
| `src/pages/Admin.jsx` | `AI_TAGS` 中的 `'AI 一體機'` → `'AgentForge'`（次要，可選） |
| `src/pages/DesignSystem.jsx` | 新增三個元件的 Live Preview / Code snippet / Anatomy table：Agent 流程圖、before→after 數字、AI+/+AI 對照卡 |
| `src/locales/{zh-TW,zh-CN,en}.json` | 刪 `aibox.*`、`ai_appliance.*`、`navbar.aibox_*`；新增 `agentforge.*` |

CMS 讀取點：`useCmsContent('agentforge', 'hero_desc')`（原為 `useCmsContent('aibox', 'hero_desc')`）。
Supabase 中 `page_id='aibox'` 的舊列不處理，成為孤兒資料，不影響前台。

---

## 8. 設計規範對齊

沿用 CLAUDE.md 既有規範，不新增 design token：

- 主色 violet（`violet-600` / `violet-500` / `violet-400`），與 APS 藍、ESG 綠區隔
- 區塊間距 `py-24`，白底與 `bg-slate-50` / 深色底交錯
- 網格 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`（與 APS / ESG 產品頁一致）
- 進場動畫 `framer-motion` + `useInView({ once: true })`
- 深色模式所有區塊都要有對應的 `dark:` 樣式
- 對比度符合 WCAG AA

---

## 9. 待確認文案

實作時採用下列處理，若不同意請在實作前提出：

| # | 問題 | 處理方式 |
|---|---|---|
| 1 | 原稿痛點「資料分散自動整合」語意不通（痛點不該是「自動整合」） | 改為「**資料分散難以整合**」 |
| 2 | 第 4 節原標題「CRIS AgentForge Platform 企業智慧團隊鍛造平台」與 Hero 主標完全重複，訪客會以為捲回頂端 | 第 4 節標題改為「**14 個已落地的工作場景**」，原句移到 Hero |
| 3 | AI+ 第 6 項「Multi-Agent 智慧操作數智員工」與整個 +AI 節的主題重疊 | 照原稿保留，不合併。但 §6.1 第 6 項的說明文字會與 +AI 節導言做措辭區隔，避免讀起來像重複 |
| 4 | 首頁 `Features.jsx` 第 3 張卡文案（現為「私有化部署 · 數據主權掌控」）原稿未提供 | 由 §6.4 內容擬一版，實作後請 review |
| 5 | AI+ / +AI 對照導言（「把 AI 加進營運決策」／「把執行交給 AI」）原稿未提供 | 由我撰寫，實作後請 review |
| 6 | 第 4 節簡介（§6.4）、CTA Banner 文案（§6.5）原稿未提供 | 由我撰寫，實作後請 review |

---

## 10. 驗收標準

- [ ] `/products/agentforge` 可正常開啟，`/products/ai-box` 已移除
- [ ] 導覽列產品下拉中沒有任何連到 `crisforge.com` 的項目
- [ ] 導覽列、Footer、首頁 Features 第 3 張卡都指向 `/products/agentforge`，名稱為 CRIS AgentForge Platform
- [ ] 頁面五大區塊齊全：Hero / 雙軌能力 / DATA INSIGHT / 企業案例 / CTA
- [ ] 雙軌能力 12 個項目全部渲染，沒有藏在分頁或摺疊裡
- [ ] 三個旗艦案例的工作流 pipeline 與成果數字在捲動時直接可見，不需點擊
- [ ] 案例 2 使用質化樣式，未出現編造的數字
- [ ] 三個旗艦案例的免責聲明可讀可見
- [ ] 雲市集外連可正常開啟，`target="_blank" rel="noopener noreferrer"`
- [ ] 吸頂子導覽的四個錨點都能正確跳轉
- [ ] 繁中 / 简中 / EN 三語系切換都完整，無 fallback 到繁中的殘留
- [ ] 深色模式所有區塊正常
- [ ] 手機（sm）、平板（md）、桌機（lg）三個斷點版面正常，旗艦案例的左右交錯在手機上垂直堆疊
- [ ] `npm run build` 通過
- [ ] 全專案 grep 不到 `ai-box`、`aibox`、`AIBoxProduct`、`AIAppliance`、`ai_appliance`
- [ ] `/design-system` 已補上三個新元件的文件
