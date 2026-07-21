# 快思科技 CRIS 官網 — 設計規範

## 技術架構

- **框架**: Vite 5 + React 18
- **樣式**: Tailwind CSS v3（class-based dark mode）
- **圖標**: lucide-react
- **動畫**: framer-motion
- **套件管理**: npm

## 品牌色彩系統

### 主色

| 名稱 | HEX | Tailwind |
|------|-----|----------|
| CRIS Blue | `#0052D9` | `cris-blue` |
| Blue Light | `#4C86E3` | `cris-blue-light` |
| Blue Dark | `#003AAA` | `cris-blue-dark` |

### 淺色模式（Light Mode）

| 角色 | HEX | Tailwind |
|------|-----|----------|
| 背景 | `#F8FAFC` | `bg-slate-50` |
| 表面 | `#FFFFFF` | `bg-white` |
| 標題 | `#1E293B` | `text-slate-900` |
| 內文 | `#64748B` | `text-slate-500` |
| 邊框 | `#E2E8F0` | `border-slate-200` |

### 深色模式（Dark Mode）

| 角色 | HEX | Tailwind |
|------|-----|----------|
| 背景 | `#0F172A` | `dark:bg-slate-900` |
| 表面 | `#1E293B` | `dark:bg-slate-800` |
| 標題 | `#F8FAFC` | `dark:text-slate-100` |
| 內文 | `#94A3B8` | `dark:text-slate-400` |
| 邊框 | `#334155` | `dark:border-slate-700` |

## 共用元件類別（`@layer components`）

```css
.btn-primary   /* 主要 CTA 按鈕，藍底白字 */
.btn-outline   /* 次要按鈕，藍色外框 */
.section-title /* 區塊標題，32-40px bold */
.section-subtitle /* 區塊副標，slate-500 */
.card          /* 白色圓角卡片，hover 上浮 */
```

## 檔案結構

```
src/
├── App.jsx               # 主應用，管理 dark mode state
├── App.css               # 最小化 CSS
├── index.css             # Tailwind directives + 共用元件
└── components/
    ├── Navbar.jsx         # 導覽列（含 dropdown + dark toggle）
    ├── Hero.jsx           # Hero section
    ├── Features.jsx       # 三欄產品特色
    ├── Cases.jsx          # 案例分享
    ├── Contact.jsx        # 聯絡表單
    └── Footer.jsx         # 頁尾
```

## Dark Mode 實作

使用 Tailwind `darkMode: 'class'`。在 `App.jsx` 中透過 `useState` 管理，
並對 `<html>` 元素添加/移除 `dark` class，同時存入 `localStorage`。

## 設計原則

1. **B2B 科技感**：深藍主色、乾淨留白、精確網格系統
2. **可及性**：對比度符合 WCAG AA 標準
3. **動畫**：進場動畫使用 `framer-motion`，`useInView` 觸發，`once: true` 避免重複
4. **響應式**：Mobile first，斷點 `sm → md → lg`

## 設計系統文件頁

路由：`/design-system`（不列入官網導覽，不加 Navbar / Footer）  
檔案：`src/pages/DesignSystem.jsx`

參考 Adobe Spectrum 結構，涵蓋：

| 類型 | 項目 |
|------|------|
| **Tokens** | Color（品牌色 + 語意色票 + Category Palette）、Typography（字型/字重/行距）、Spacing（4pt grid）、Shadows（含著色陰影）、Border Radius、Animation（Spring 參數 / gradient timing）|
| **Components** | Button（Primary / Outline / Size / State / Product CTA）、Type Styles（section-title / section-subtitle）、Card、Badge & Tag（5 種）、Filter Pill、Case Card、Modal、Toast、Lang Switcher、Gradient Text（3 種）、Dark Mode Toggle |

每個元件均包含：**Live Preview · Code snippet · Anatomy table**

> 新增元件或修改 token 時，請同步更新此頁面。

## 啟動指令

```bash
npm run dev    # 開發模式，預設 http://localhost:5173
npm run build  # 生產打包
npm run preview # 預覽生產版本
```
