# CRIS AgentForge Platform 產品頁改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/products/ai-box`（CRIS AI 一體機）整個改版成 `/products/agentforge`（CRIS AgentForge Platform），並移除導覽列連到 crisforge.com 的外連項目。

**Architecture:** 一個頁面檔 + 一個 `src/components/agentforge/` 元件資料夾（6 個元件），內容全部走 i18n（繁中／简中／EN 三語），圖標走靜態對應表換成 lucide。頁面分五大區塊：Hero、雙軌能力（AI+／+AI）、DATA INSIGHT、企業案例（3 旗艦 + 10 網格 + 1 客製卡）、CTA。

**Tech Stack:** Vite 5 · React 18 · Tailwind CSS v3（class-based dark mode）· framer-motion · lucide-react · react-i18next · react-router-dom v7

**設計規格：** [docs/superpowers/specs/2026-09-16-agentforge-product-page-design.md](../specs/2026-09-16-agentforge-product-page-design.md)

---

## 執行前必讀

**1. 文案來源。** 本計畫**不重抄**規格書的中文文案。所有 locale 內容逐字取自規格書 §6.0–§6.5 的表格，計畫中只給 JSON 結構與範例筆數。這是刻意的 DRY —— 文案抄兩份必然會漂移，規格書是唯一真實來源。填 locale 檔時請把規格書開在旁邊，**每一筆都要填滿，不得留空或寫「同上」**。

**2. 沒有單元測試框架。** 本專案沒有 vitest／jest，零測試檔。這是純呈現層的行銷頁，不為此引入測試框架。驗證靠四件事：

| 驗證 | 指令 | 抓什麼 |
|---|---|---|
| 多語系對齊 | `npm run check:i18n` | 缺 key（會靜默 fallback 成繁中，不報錯）、列舉值被誤譯 |
| 編譯 | `npm run build` | import 錯誤、語法錯誤 |
| Lint（新檔） | `npx eslint <新檔> --rule '{"react/prop-types":"off"}'` | 未使用的 import、hooks 規則 |
| 人工 | `npm run dev` | 版面、深色模式、斷點、動畫 |

**3. `npm run lint` 不能當作通過／失敗的閘門。** 專案現況：`npx eslint .` 有 280 筆問題，其中 **265 筆是 `react/prop-types`** —— 這個專案 20 幾個元件沒有任何 PropTypes，顯然不遵循該規則，這 265 筆是設定與慣例不合造成的雜訊，不是缺陷。真正可行動的只有 11 筆 `no-unused-vars` 與 4 筆 `react-hooks/exhaustive-deps`，全部在本次不會改動的既有檔案裡。

因此各 task 的 lint 驗證一律**只掃該 task 動到的檔案並濾掉 prop-types**，要求是「沒有任何 error 輸出」。這樣才擋得住真正想擋的東西（例如多餘的 import）。

（本次已順手修掉一個設定缺陷：`eslint.config.js` 原本只 ignore `dist`，導致 eslint 連 `.claude/worktrees/` 底下其他分支的副本一起掃，問題數從 1880 虛報到只剩 280。）

**4. Task 5 之後 `check:i18n` 會刻意失敗。** Task 5 只加繁中，簡中與英文要到 Task 12、13 才補。這是預期的紅燈 —— Task 5 到 Task 13 之間 `check:i18n` 失敗屬正常，Task 13 結束後必須轉綠。

**5. 所有動畫一律處理 `prefers-reduced-motion`。** `index.css` 既有的漸層文字動畫已經處理，新元件必須比照。一次性進場動畫用 `useReducedMotion()` 改為 `initial={false}` + `duration: 0`；無限循環動畫（呼吸、浮動、閃爍）在該偏好下**完全關閉**，因為無限動畫對這類使用者傷害最大。`useReducedMotion` 由 framer-motion 提供，不需新套件。

**6. 每個 Task 結束都要 commit。** commit message 用繁中，結尾加上：

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
```

---

## 檔案結構

| 檔案 | 責任 | 行數估計 |
|---|---|---|
| `scripts/check-i18n.mjs` | **新增** 校驗三份 locale 的 key 結構完全一致 | ~55 |
| `src/constants/agentforge.js` | **新增** icon 字串鍵 → lucide 元件對應表 | ~35 |
| `src/components/agentforge/FadeUp.jsx` | **新增** 共用進場動畫包裝（資料夾內 5 個元件共用） | ~20 |
| `src/components/agentforge/AgentFlow.jsx` | **新增** ①→②→③ 流程圖，DATA INSIGHT + 3 旗艦案例共用 | ~90 |
| `src/components/agentforge/AgentNetwork.jsx` | **新增** Hero 的 Multi-Agent 協作網絡視覺 | ~130 |
| `src/components/agentforge/DualMode.jsx` | **新增** AI+／+AI 對照導言 + 兩組 6 卡 | ~150 |
| `src/components/agentforge/DataInsight.jsx` | **新增** 痛點/獲得對照 + 三階段 + 雲市集 | ~170 |
| `src/components/agentforge/WorkflowCases.jsx` | **新增** 平台價值 + 3 旗艦 + 10 網格 + 客製卡 | ~300 |
| `src/pages/AgentForgeProduct.jsx` | **新增** Hero + 區塊組裝 + 吸頂子導覽 | ~230 |
| `src/pages/AIBoxProduct.jsx` | **刪除** | — |
| `src/components/AIAppliance.jsx` | **刪除**（死碼，全專案無 import） | — |
| `src/App.jsx` | 改路由 | — |
| `src/components/Navbar.jsx` | 移除 crisforge 外連項目、改產品連結 | — |
| `src/components/Footer.jsx` | 改產品連結 | — |
| `src/components/Features.jsx` | 改第 3 張卡連結 | — |
| `src/pages/AdminContent.jsx` | 改 CMS 頁面代號 | — |
| `src/pages/Admin.jsx` | 改標籤字串 | — |
| `src/pages/DesignSystem.jsx` | 補三個新元件文件 | — |
| `src/locales/{zh-TW,zh-CN,en}.json` | 刪舊 namespace、加 `agentforge.*` | — |
| `package.json` | 加 `check:i18n` script | — |

---

## Task 1：多語系對齊校驗腳本

先建護欄。這支腳本是後面所有 locale 工作的驗證依據。

**Files:**
- Create: `scripts/check-i18n.mjs`
- Modify: `package.json`（`scripts` 區塊）

- [ ] **Step 1：寫校驗腳本**

Create `scripts/check-i18n.mjs`：

```js
#!/usr/bin/env node
// 校驗三份 locale 檔的 key 結構完全一致。
// i18next 的 fallbackLng 是 zh-TW，缺 key 時會靜默回退、不會報錯，
// 因此需要這支腳本在 build 前把缺漏抓出來。
import { readFileSync } from 'node:fs'

const LOCALES = ['zh-TW', 'zh-CN', 'en']
const BASE = 'zh-TW'

/** 把巢狀物件攤平成 key 路徑清單。陣列會記錄長度，並展開每一筆元素的結構。 */
function keyPaths(node, prefix = '') {
  if (Array.isArray(node)) {
    const out = [`${prefix}[] len=${node.length}`]
    node.forEach((item, i) => {
      if (item !== null && typeof item === 'object') {
        out.push(...keyPaths(item, `${prefix}[${i}]`))
      }
    })
    return out
  }
  if (node !== null && typeof node === 'object') {
    return Object.keys(node).flatMap((k) =>
      keyPaths(node[k], prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

const data = Object.fromEntries(
  LOCALES.map((l) => {
    const path = `src/locales/${l}.json`
    try {
      return [l, JSON.parse(readFileSync(path, 'utf8'))]
    } catch (e) {
      console.error(`✗ 無法讀取 ${path}：${e.message}`)
      process.exit(1)
    }
  })
)

const basePaths = new Set(keyPaths(data[BASE]))
let failed = false

for (const locale of LOCALES) {
  if (locale === BASE) continue
  const paths = new Set(keyPaths(data[locale]))
  const missing = [...basePaths].filter((p) => !paths.has(p))
  const extra = [...paths].filter((p) => !basePaths.has(p))

  if (missing.length || extra.length) {
    failed = true
    console.error(`\n✗ ${locale}`)
    missing.forEach((p) => console.error(`   缺少：${p}`))
    extra.forEach((p) => console.error(`   多餘：${p}`))
  } else {
    console.log(`✓ ${locale} 與 ${BASE} 對齊（${paths.size} 個 key）`)
  }
}

if (failed) {
  console.error('\n多語系 key 不一致。缺少的 key 會靜默 fallback 成繁中。')
  process.exit(1)
}
console.log('\n三份 locale 檔完全對齊。')
```

- [ ] **Step 2：加 npm script**

在 `package.json` 的 `scripts` 中，`lint` 之後加一行：

```json
    "lint": "eslint .",
    "check:i18n": "node scripts/check-i18n.mjs",
```

- [ ] **Step 3：跑一次，確認現況是綠的**

Run: `npm run check:i18n`

Expected：三行 `✓`，最後 `三份 locale 檔完全對齊。`，exit code 0。
（現有三份 locale 本來就對齊，這一步在確認腳本本身正確，不是在抓 bug。）

- [ ] **Step 4：刻意弄壞一次，確認腳本真的會抓到**

Run:

```bash
node -e "const f='src/locales/en.json',fs=require('fs');const d=JSON.parse(fs.readFileSync(f,'utf8'));delete d.navbar.home;fs.writeFileSync(f,JSON.stringify(d,null,2))"
npm run check:i18n
```

Expected：`✗ en` 與 `缺少：navbar.home`，exit code 1。

- [ ] **Step 5：還原**

Run:

```bash
git checkout src/locales/en.json
npm run check:i18n
```

Expected：回到全綠。

- [ ] **Step 6：Commit**

```bash
git add scripts/check-i18n.mjs package.json
git commit -m "chore: 新增多語系 key 對齊校驗腳本

i18next fallbackLng 為 zh-TW，缺 key 時會靜默回退不報錯，
加這支腳本在 build 前把三份 locale 的結構差異抓出來。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2：圖標對應表

**Files:**
- Create: `src/constants/agentforge.js`

- [ ] **Step 1：建立對應表**

Create `src/constants/agentforge.js`：

```js
import {
  Search, Factory, CalendarClock, Network, Bot, Zap,
  Activity, ClipboardList, BarChart3, Wrench, MessageSquare, AlertTriangle,
  Headphones, Leaf, FileCheck2, Ship, Package2, Cpu, Gauge, ScanLine,
  Users, Repeat2, Sparkles,
} from 'lucide-react'

/**
 * locale 檔只存 icon 字串鍵，這裡換成 lucide 元件。
 * 原稿用 emoji，但 emoji 跨平台渲染不一致、彩色 emoji 與網站 B2B 調性衝突，
 * 且 CLAUDE.md 指定圖標一律用 lucide-react。
 * 對應關係見規格書 §5「圖標對應」。
 */
export const AF_ICONS = {
  // AI+（應用系統）
  search: Search,
  factory: Factory,
  calendar: CalendarClock,
  link: Network,
  bot: Bot,
  zap: Zap,
  // +AI（自動化操作）
  activity: Activity,
  clipboard: ClipboardList,
  chart: BarChart3,
  wrench: Wrench,
  message: MessageSquare,
  alert: AlertTriangle,
  // 更多工作場景
  headphones: Headphones,
  leaf: Leaf,
  filecheck: FileCheck2,
  ship: Ship,
  package: Package2,
  cpu: Cpu,
  gauge: Gauge,
  scan: ScanLine,
  users: Users,
  repeat: Repeat2,
  sparkles: Sparkles,
}

/**
 * 查無對應時回傳 Sparkles，避免 locale 打錯字造成整頁白畫面。
 * 開發模式下額外發出警告，讓打錯的 key 不會靜默溜過去。
 */
export function afIcon(key) {
  const Icon = AF_ICONS[key]
  if (!Icon && import.meta.env.DEV) {
    console.warn(`[afIcon] 未知的圖標鍵："${key}"，已退回 Sparkles`)
  }
  return Icon ?? Sparkles
}
```

- [ ] **Step 2：驗證所有圖標名稱在 lucide-react 中存在**

Run:

```bash
node -e "
const l=require('lucide-react');
const want=['Search','Factory','CalendarClock','Network','Bot','Zap','Activity','ClipboardList','BarChart3','Wrench','MessageSquare','AlertTriangle','Headphones','Leaf','FileCheck2','Ship','Package2','Cpu','Gauge','ScanLine','Users','Repeat2','Sparkles'];
const miss=want.filter(n=>!l[n]);
console.log(miss.length?'MISSING: '+miss.join(', '):'all 23 icons OK');
"
```

Expected: `all 23 icons OK`

- [ ] **Step 3：Commit**

```bash
git add src/constants/agentforge.js
git commit -m "feat(agentforge): 新增圖標對應表

locale 檔存 icon 字串鍵，元件端換成 lucide 圖標，
避免 emoji 跨平台渲染不一致。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3：FadeUp 共用進場動畫

資料夾內 5 個元件都要用，抽出來避免重複五次。

**Files:**
- Create: `src/components/agentforge/FadeUp.jsx`

- [ ] **Step 1：建立元件**

Create `src/components/agentforge/FadeUp.jsx`：

```jsx
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * 捲到畫面內淡入上浮。once: true 避免來回捲動重複播放。
 * 使用者若在系統開啟「減少動態效果」，直接顯示不做動畫。
 */
export default function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 250, damping: 22, delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2：Commit**

```bash
git add src/components/agentforge/FadeUp.jsx
git commit -m "feat(agentforge): 新增共用 FadeUp 進場動畫元件

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4：AgentFlow 共用流程圖

整頁的敘事骨架，會被 DATA HSIGHT 三階段與 3 個旗艦案例共用（共 4 處）。

**Files:**
- Create: `src/components/agentforge/AgentFlow.jsx`

**介面：**

```js
<AgentFlow
  steps={[
    { title: '排程分析 Agent', subtitle: '排程狀態分析' },
    { title: '產能分析 Agent ＋ 交期風險 Agent', subtitle: '瓶頸與交期風險辨識' },
    { title: 'Human Review', subtitle: '管理者確認', human: true },
  ]}
  tone="onLight"   // 'onLight' 用在白底 | 'onDark' 用在深色底
/>
```

`desc` 為選填第三行（DATA INSIGHT 的三階段會用到，旗艦案例不用）。
`human: true` 的步驟改用虛線外框與灰階，與 Agent 步驟區隔 —— 這是刻意的視覺訊號：
人還在迴圈裡，AI 不是脫韁執行。

- [ ] **Step 1：建立元件**

Create `src/components/agentforge/AgentFlow.jsx`：

```jsx
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowDown, UserCheck } from 'lucide-react'

const TONES = {
  onLight: {
    box:    'bg-white border-violet-200 dark:bg-slate-800 dark:border-violet-500/30',
    human:  'bg-slate-50 border-slate-300 border-dashed dark:bg-slate-800/50 dark:border-slate-600',
    num:    'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    title:  'text-slate-900 dark:text-white',
    sub:    'text-violet-700 dark:text-violet-300',
    desc:   'text-slate-500 dark:text-slate-400',
    arrow:  'text-violet-300 dark:text-violet-500/60',
  },
  onDark: {
    box:    'bg-white/[0.04] border-violet-500/40 backdrop-blur-sm',
    human:  'bg-white/[0.02] border-slate-600 border-dashed',
    num:    'bg-violet-500/25 text-violet-200',
    title:  'text-white',
    sub:    'text-violet-300',
    desc:   'text-slate-400',
    arrow:  'text-violet-500/60',
  },
}

const NUMERALS = ['①', '②', '③', '④', '⑤', '⑥']

export default function AgentFlow({ steps, tone = 'onLight' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const c = TONES[tone] ?? TONES.onLight

  return (
    <div ref={ref} className="flex flex-col">
      {steps.map((step, i) => (
        <div key={i}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 260, damping: 24, delay: i * 0.12 }
            }
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${step.human ? c.human : c.box}`}
          >
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold
                ${step.human ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : c.num}`}
            >
              {step.human ? <UserCheck size={15} aria-hidden="true" /> : NUMERALS[i] ?? i + 1}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-bold leading-snug ${c.title}`}>{step.title}</p>
              <p className={`text-xs mt-0.5 leading-snug ${step.human ? c.desc : c.sub}`}>{step.subtitle}</p>
              {step.desc && (
                <p className={`text-xs mt-1.5 leading-relaxed ${c.desc}`}>{step.desc}</p>
              )}
            </div>
          </motion.div>

          {i < steps.length - 1 && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={reduceMotion ? { duration: 0 } : { delay: i * 0.12 + 0.08 }}
              className="flex justify-center py-1.5"
            >
              <ArrowDown size={16} className={c.arrow} aria-hidden="true" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2：確認編譯通過**

Run: `npm run build`
Expected：`✓ built in ...`，無錯誤。
（此時元件尚未被任何頁面 import，這一步只在確認語法與 import 正確。）

- [ ] **Step 3：Commit**

```bash
git add src/components/agentforge/AgentFlow.jsx
git commit -m "feat(agentforge): 新增共用 Agent 流程圖元件

DATA INSIGHT 三階段與三個旗艦案例共用，
Human Review 步驟用虛線外框與 Agent 步驟區隔。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5：AgentNetwork Hero 視覺

中心平台節點 + 5 個環繞 Agent 節點 + 呼吸的連線。取代原本的硬體機器視覺。

**Files:**
- Create: `src/components/agentforge/AgentNetwork.jsx`

- [ ] **Step 1：建立元件**

Create `src/components/agentforge/AgentNetwork.jsx`：

```jsx
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarClock, Network, ScanLine, Bot, BarChart3 } from 'lucide-react'

/**
 * 5 個環繞節點。`pos` 是絕對定位樣式，`line` 是連到中心的線在
 * viewBox 座標中的端點 —— 兩者放在同一筆資料裡，改了位置不會忘記改線。
 * 右側節點用 right 定位，讓盒子往內長，避免窄畫面撐出容器。
 */
const NODES = [
  { key: 'sched',  icon: CalendarClock, pos: { left: '2%',  top: '10%' },    line: { x: 14, y: 18 } },
  { key: 'supply', icon: Network,       pos: { right: '2%', top: '8%' },     line: { x: 86, y: 16 } },
  { key: 'qc',     icon: ScanLine,      pos: { left: '0%',  top: '66%' },    line: { x: 12, y: 72 } },
  { key: 'decide', icon: Bot,           pos: { right: '0%', top: '70%' },    line: { x: 88, y: 76 } },
  { key: 'report', icon: BarChart3,     pos: { left: '50%', bottom: '2%', transform: 'translateX(-50%)' }, line: { x: 50, y: 92 } },
]

export default function AgentNetwork() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()

  /**
   * 無限循環動畫（呼吸、浮動、閃爍）對開啟「減少動態效果」的使用者最不友善，
   * 一律關閉。回傳空物件時元素就停在 CSS 的靜態樣式。
   */
  const loop = (animate, transition) => (reduceMotion ? {} : { animate, transition })

  return (
    <div className="relative h-[420px] w-full select-none" aria-hidden="true">
      {/* 呼吸光暈 */}
      <motion.div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl"
        {...loop(
          { opacity: [0.25, 0.6, 0.25], scale: [0.9, 1.06, 0.9] },
          { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        )}
      />

      {/* 連線 */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
        {NODES.map((n, i) => (
          <motion.line
            key={n.key}
            x1="50" y1="46" x2={n.line.x} y2={n.line.y}
            stroke="currentColor"
            className="text-violet-400 dark:text-violet-500"
            strokeWidth="0.35"
            vectorEffect="non-scaling-stroke"
            opacity="0.45"
            {...loop(
              { opacity: [0.15, 0.7, 0.15] },
              { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }
            )}
          />
        ))}
      </svg>

      {/* 中心：平台 */}
      <motion.div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 z-10"
        {...loop({ y: [0, -8, 0] }, { duration: 5, repeat: Infinity, ease: 'easeInOut' })}
      >
        <div className="rounded-2xl border border-violet-400/60 bg-violet-600/90 dark:bg-violet-600/80 px-6 py-4 shadow-2xl shadow-violet-500/40 backdrop-blur-sm text-center">
          <p className="text-[10px] font-mono tracking-widest text-violet-200">CRIS</p>
          <p className="text-base font-extrabold text-white leading-tight">AgentForge</p>
        </div>
      </motion.div>

      {/* 環繞的 Agent 節點 */}
      {NODES.map((n, i) => {
        const Icon = n.icon
        return (
          <div key={n.key} className="absolute z-10" style={n.pos}>
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { delay: 0.3 + i * 0.13, type: 'spring', stiffness: 260, damping: 18 }
              }
            >
              <motion.div
                {...loop(
                  { y: [0, -6, 0] },
                  { duration: 4 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }
                )}
                className="flex items-center gap-2 rounded-xl border border-violet-300 bg-white/90 px-3 py-2 shadow-lg shadow-violet-500/10 backdrop-blur-sm
                  dark:border-violet-500/40 dark:bg-white/[0.06] dark:shadow-violet-900/40"
              >
                <span className="relative flex-shrink-0">
                  <Icon size={15} className="text-violet-600 dark:text-violet-300" aria-hidden="true" />
                  <motion.span
                    className="absolute -right-1 -top-1 w-1.5 h-1.5 rounded-full bg-emerald-500"
                    {...loop({ opacity: [0.3, 1, 0.3] }, { duration: 1.8, repeat: Infinity, delay: i * 0.35 })}
                  />
                </span>
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 sm:whitespace-nowrap">
                  {t(`agentforge.hero_network.${n.key}`)}
                </span>
              </motion.div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2：確認編譯通過**

Run: `npm run build`
Expected：`✓ built in ...`

- [ ] **Step 3：Commit**

```bash
git add src/components/agentforge/AgentNetwork.jsx
git commit -m "feat(agentforge): 新增 Hero 的 Multi-Agent 協作網絡視覺

中心平台節點 + 5 個環繞 Agent 節點 + 呼吸連線，
取代原一體機頁的硬體機器視覺。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6：繁中 locale — `agentforge` namespace

**Files:**
- Modify: `src/locales/zh-TW.json`

**內容來源：規格書 §6.0–§6.5。逐字填入，不得省略。**

- [ ] **Step 1：在 zh-TW.json 的 `aibox` 之後插入 `agentforge` namespace**

結構如下。範例值展示格式，其餘照規格書填滿：

```jsonc
"agentforge": {
  "breadcrumb": "CRIS AgentForge Platform",
  "badge": "企業智慧團隊鍛造平台",
  "hero_title": "CRIS AgentForge",
  "hero_title_gradient": "Platform",
  "hero_subtitle": "企業智慧團隊鍛造平台",
  "hero_desc": "從單點應用到企業營運，多個工作場景已成功落地。AI 不只是回答問題，而是真正參與企業工作。",
  "cta_primary": "預約 Demo",
  "cta_secondary": "看 14 個工作場景",
  "tags": ["Multi-Agent", "工作流自動化", "企業知識庫", "資料安全", "ERP/MES/CRM 整合"],

  "subnav": {
    "dual": "雙軌能力",
    "insight": "數據洞察",
    "cases": "企業案例",
    "contact": "預約諮詢"
  },

  "hero_network": {
    "sched":  "排程 Agent",
    "supply": "採購 Agent",
    "qc":     "品質 Agent",
    "decide": "決策 Agent",
    "report": "報告 Agent"
  },

  "dual": {
    "tag": "雙軌能力",
    "title": "兩種導入路徑，一個平台",
    "compare": {
      "a_label": "AI+",
      "a_head": "把 AI 加進營運決策",
      "a_desc": "接單、生產、供應鏈、經營分析 —— 讓人做的判斷更準。",
      "b_label": "+AI",
      "b_head": "把執行交給 AI",
      "b_desc": "監控、報工、客服、品質 —— 讓 AI 代替人把事情做完。"
    },
    "aiplus": {
      "label": "AI+（應用系統）",
      "title": "智慧決策與營運應用平台",
      "intro": "讓企業從資料驅動走向智慧決策，提升營運效率與競爭優勢。整合接單、生產、供應鏈與經營分析等核心場景，協助企業即時掌握營運狀況並提升決策品質。",
      "items": [
        {
          "icon": "search",
          "title": "ATP/CTP 精敏詢單",
          "slogan": "接單前了解是否能準時交貨",
          "desc": "即時評估物料、產能與排程狀況，快速提供可靠交期承諾。",
          "points": ["降低誤接訂單與延遲交貨風險", "提升接單成功率", "建立客戶對交期的信任"]
        }
        // 其餘 5 筆依序：factory / calendar / link / bot / zap
        // 內容取自規格書 §6.1 表格第 2–6 列
      ]
    },
    "plusai": {
      "label": "+AI（自動化操作）",
      "title": "智慧自動化與 AI Agent 平台",
      "intro": "打造企業全天候運作的數位員工團隊，降低人工作業負擔並提升執行效率，讓資訊查詢、分析判斷與流程執行自動化。",
      "items": [
        // 6 筆，icon 依序：activity / clipboard / chart / wrench / message / alert
        // 內容取自規格書 §6.2 表格
      ]
    }
  },

  "insight": {
    "tag": "DATA INSIGHT",
    "title": "AI 數據分析與智慧報告平台",
    "intro": "從資料蒐集、分析決策到管理報告，全流程由 AI Agent 自動完成。",
    "pains_label": "企業痛點",
    "pains": ["資料分散難以整合", "分析耗時", "報表產製負擔重", "部門數據不一", "決策速度慢"],
    "gains_label": "導入後企業獲得",
    "gains": ["報表製作時間減少 80%", "即時掌握關鍵 KPI", "降低跨部門溝通成本", "建立標準化決策流程", "從資料走向決策"],
    "agents": [
      {
        "en": "Data Analysis Agent",
        "zh": "資料分析代理人",
        "desc": "自動整合 ERP、MES、CRM 與 Excel 資料，將資料轉換為可執行洞察。"
      }
      // 其餘 2 筆：Dashboard Agent / Report Agent，取自規格書 §6.3
    ],
    "market": {
      "tag": "雲市集",
      "title": "AI Agent 導入更簡單",
      "desc": "已上架經濟部雲市集 AI 工具庫。不需自行開發，即可快速導入企業級 AI 資料分析、儀表板與報告生成平台。",
      "points": ["直接線上採購", "快速部署上線", "政府補助方案可搭配申請", "降低 AI 導入成本"],
      "cta": "前往經濟部雲市集"
    }
  },

  "cases": {
    "tag": "企業案例",
    "title": "14 個已落地的工作場景",
    "intro": "涵蓋接單、排程、供應鏈、品質、ESG 到行政流程。每一個都是可直接套用的 Multi-Agent 工作流，不是從零開始的客製專案。",
    "values_label": "打造企業專屬 AI Workforce",
    "values": [
      {
        "title": "企業資料安全機制",
        "desc": "支援資料脫敏、權限控管與加密處理，讓 AI 能安心應用企業核心資料。"
      }
      // 其餘 4 筆，取自規格書 §6.4「平台價值」表格
    ],
    "flagship_label": "旗艦案例",
    "background_label": "背景",
    "pains_label": "痛點",
    "flow_label": "工作流",
    "disclaimer": "※ 依實際資料進行情境試算，非已導入成果",
    "flagship": [
      {
        "title": "生產排程與緊急插單",
        "summary": "整合訂單、產能、物料與設備資訊，自動規劃最佳生產排程方案。",
        "background": "某電子製造企業主要承接多品項、少量多樣的電子產品製造與組裝訂單…（全文見規格書 §6.4 旗艦案例 1）",
        "pains": ["訂單延遲難以即時掌握", "瓶頸產能造成長時間排隊", "多階製程難以同步調度", "排程調整高度依賴人工判斷"],
        "flow": [
          { "agents": "排程分析 Agent", "label": "排程狀態分析", "human": false },
          { "agents": "產能分析 Agent ＋ 交期風險 Agent", "label": "瓶頸與交期風險辨識", "human": false },
          { "agents": "排程優化 Agent", "label": "排程方案模擬", "human": false },
          { "agents": "決策 Agent", "label": "方案比較與決策", "human": false },
          { "agents": "Human Review", "label": "管理者確認", "human": true }
        ],
        "metrics_label": "可量化成果",
        "metrics_kind": "delta",
        "metrics": [
          { "label": "訂單準交率", "before": "約 71%", "after": "85～90%" },
          { "label": "平均延遲", "before": "約 46 天", "after": "< 20 天" },
          { "label": "整體資源稼動率", "before": "約 77%", "after": "85%+" },
          { "label": "生管人工排程工時", "before": "約 20 小時／週", "after": "約 8 小時／週" }
        ]
      },
      {
        "title": "供應鏈協調與智慧採購",
        // summary / background / pains / flow 取自規格書 §6.4 旗艦案例 2
        "metrics_label": "質化成果",
        "metrics_kind": "qualitative",
        "metrics": [
          { "label": "缺貨率", "direction": "down", "note": "即時掌握需求與庫存缺口" },
          { "label": "備貨準確率", "direction": "up", "note": "促銷需求提前預測" },
          { "label": "庫存失衡", "direction": "down", "note": "跨區庫存動態調配" },
          { "label": "採購行政工時", "direction": "down", "note": "Agent 自動彙整與分析" }
        ]
      },
      {
        "title": "OTD 從接單到出貨",
        // 取自規格書 §6.4 旗艦案例 3
        "metrics_label": "可衡量效益",
        "metrics_kind": "delta",
        "metrics": [
          { "label": "詢單回覆時間", "before": "4-6 hr", "after": "< 30 min" },
          { "label": "報價／交期準確率", "before": "70%", "after": "92%+" },
          { "label": "OTD 準時達交率", "before": "82%", "after": "95%" },
          { "label": "生管人工排程", "before": "20 hr／週", "after": "8 hr／週" }
        ]
      }
    ],
    "more_label": "更多工作場景",
    "more": [
      {
        "icon": "headphones",
        "title": "智慧售服",
        "desc": "整合客服、技術支援與知識庫資料，自動回應客戶問題與服務需求。",
        "points": ["客戶問題即時回應，提升客戶滿意度與黏著度", "降低客服與技術支援人力成本", "減少人員異動造成的服務品質落差", "建立企業知識持續累積與傳承機制"]
      }
      // 其餘 9 筆，icon 依序：leaf / filecheck / ship / package / cpu / gauge / scan / users / repeat
      // 內容取自規格書 §6.4「更多工作場景」表格第 5–13 列
    ],
    "custom": {
      "icon": "sparkles",
      "title": "建立專屬於您的 AI Agent 團隊",
      "desc": "每家企業都有獨特的流程與管理需求。我們可依據企業 SOP、知識文件、系統資料與工作規則，快速打造專屬 Multi-Agent 工作流，讓 AI 成為真正參與企業營運的數位團隊。",
      "tagline": "您的需求，就是下一個 Agent 工作場景",
      "points": ["客製化流程設計", "串接 ERP / MES / CRM / WMS 等系統", "整合知識庫與企業規範", "AI 分析、決策與自動執行", "快速建立企業專屬 AI Workforce"],
      "cta": "聊聊你的工作場景"
    }
  },

  "cta_title": "打造企業專屬的 AI Workforce",
  "cta_subtitle": "您的需求，就是下一個 Agent 工作場景。告訴我們您的流程，我們協助評估可落地的 Multi-Agent 方案。",
  "cta_btn": "預約諮詢",
  "cta_back": "回到工作場景"
}
```

**注意：** `flow[].agents` 是**字串**不是陣列（多個 Agent 用全形「＋」串在同一字串裡）。這樣 locale 檔好翻譯，`AgentFlow` 也不用處理陣列 join。

- [ ] **Step 2：確認 JSON 合法且筆數正確**

Run:

```bash
node -e "
const d=JSON.parse(require('fs').readFileSync('src/locales/zh-TW.json','utf8')).agentforge;
const chk=[
  ['dual.aiplus.items', d.dual.aiplus.items.length, 6],
  ['dual.plusai.items', d.dual.plusai.items.length, 6],
  ['insight.pains', d.insight.pains.length, 5],
  ['insight.gains', d.insight.gains.length, 5],
  ['insight.agents', d.insight.agents.length, 3],
  ['insight.market.points', d.insight.market.points.length, 4],
  ['cases.values', d.cases.values.length, 5],
  ['cases.flagship', d.cases.flagship.length, 3],
  ['cases.more', d.cases.more.length, 10],
  ['cases.custom.points', d.cases.custom.points.length, 5],
];
let bad=0;
chk.forEach(([k,got,want])=>{ if(got!==want){bad++;console.log('✗',k,'got',got,'want',want)} });
d.cases.flagship.forEach((f,i)=>{
  if(!f.background||f.background.includes('見規格書')) {bad++;console.log('✗ flagship['+i+'].background 尚未填入全文')}
  if(!f.pains||!f.pains.length) {bad++;console.log('✗ flagship['+i+'].pains 空的')}
  if(!f.flow||!f.flow.length) {bad++;console.log('✗ flagship['+i+'].flow 空的')}
  if(f.metrics.length!==4) {bad++;console.log('✗ flagship['+i+'].metrics 應為 4 筆')}
});
console.log(bad?'FAIL: '+bad+' 項':'OK: 所有筆數與必填欄位正確');
"
```

Expected: `OK: 所有筆數與必填欄位正確`

另外確認 `agentforge.hero_network` 剛好有 5 個 key：`sched`、`supply`、`qc`、`decide`、`report`——
`AgentNetwork` 的 Hero 節點標籤是照這幾個 key 讀的，少一個節點就會顯示原始 key 字串。

- [ ] **Step 3：確認 check:i18n 現在會失敗（預期的紅燈）**

Run: `npm run check:i18n`
Expected：`✗ zh-CN` 與 `✗ en`，列出大量 `缺少：agentforge.*`，exit code 1。
**這是預期的。** 簡中與英文在 Task 13、14 補。

- [ ] **Step 4：Commit**

```bash
git add src/locales/zh-TW.json
git commit -m "feat(agentforge): 新增繁中 agentforge locale 內容

四大節完整文案：AI+ 6 項、+AI 6 項、DATA INSIGHT、
3 個旗艦案例 + 10 個工作場景 + 客製化卡片。
簡中與英文待補，check:i18n 此時為預期紅燈。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7：DualMode 元件（AI+／+AI）

**Files:**
- Create: `src/components/agentforge/DualMode.jsx`

- [ ] **Step 1：建立元件**

Create `src/components/agentforge/DualMode.jsx`：

```jsx
import { useTranslation } from 'react-i18next'
import { CheckCircle2, ArrowLeftRight } from 'lucide-react'
import { afIcon } from '../../constants/agentforge'
import FadeUp from './FadeUp'

/** 單一能力卡：圖標 + 標題 + 一句話 + 說明 + 效益清單 */
function ModeCard({ item, index }) {
  const Icon = afIcon(item.icon)
  return (
    <FadeUp delay={index * 0.06} className="h-full">
      <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6
        hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1
        transition-all duration-300
        dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50">
        <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-4">
          <Icon size={21} className="text-violet-600 dark:text-violet-300" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
        <p className="mt-1 text-sm font-medium text-violet-700 dark:text-violet-300 leading-snug">{item.slogan}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
        <ul className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {item.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  )
}

/** 一組：標籤 + 標題 + 導言 + 6 張卡 */
function ModeGroup({ order, group }) {
  return (
    <div>
      <FadeUp className="mb-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums">{order}</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{group.label}</h3>
        </div>
        <p className="mt-1 text-lg font-semibold text-slate-700 dark:text-slate-300">{group.title}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">{group.intro}</p>
      </FadeUp>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {group.items.map((item, i) => (
          <ModeCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function DualMode() {
  const { t } = useTranslation()
  const cmp = t('agentforge.dual.compare', { returnObjects: true })
  const aiplus = t('agentforge.dual.aiplus', { returnObjects: true })
  const plusai = t('agentforge.dual.plusai', { returnObjects: true })

  return (
    <section id="dual" className="scroll-mt-32 py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 區塊標頭 —— 吸頂子導覽的「雙軌能力」會跳到這裡，要有明確落點 */}
        <FadeUp className="text-center mb-12">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {t('agentforge.dual.tag')}
          </span>
          <h2 className="section-title mt-3">{t('agentforge.dual.title')}</h2>
        </FadeUp>

        {/* 對照導言：先講清楚 AI+ 和 +AI 差在哪 */}
        <FadeUp className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 items-stretch">
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-6 dark:border-violet-500/40 dark:bg-violet-500/[0.07]">
              <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{cmp.a_label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{cmp.a_head}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.a_desc}</p>
            </div>
            <div className="flex items-center justify-center py-1 md:py-0">
              <ArrowLeftRight size={22} className="rotate-90 md:rotate-0 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-500/40 dark:bg-indigo-500/[0.07]">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{cmp.b_label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{cmp.b_head}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.b_desc}</p>
            </div>
          </div>
        </FadeUp>

        <div className="space-y-20">
          <ModeGroup order="01" group={aiplus} />
          <ModeGroup order="02" group={plusai} />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2：確認編譯通過**

Run: `npm run build`
Expected：`✓ built in ...`

- [ ] **Step 3：Commit**

```bash
git add src/components/agentforge/DualMode.jsx
git commit -m "feat(agentforge): 新增 AI+／+AI 雙軌能力區塊

先用對照卡說明兩者差異，再各自展開 6 張能力卡，
12 項全部露出不藏在分頁裡。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8：DataInsight 元件

深色底區塊。左右對照痛點與獲得、三階段 Agent、雲市集外連卡。

**Files:**
- Create: `src/components/agentforge/DataInsight.jsx`

- [ ] **Step 1：建立元件**

Create `src/components/agentforge/DataInsight.jsx`：

```jsx
import { useTranslation } from 'react-i18next'
import { AlertCircle, Check, ExternalLink } from 'lucide-react'
import AgentFlow from './AgentFlow'
import FadeUp from './FadeUp'

/** 經濟部雲市集上架頁。外連，非本站連結。 */
const MARKET_URL =
  'https://keid.nat.gov.tw/cloud/Web/ai_solution_in.aspx?P=7f3e42ee-8167-e9a1-aac9-9178981d9338'

const NUMERALS = ['①', '②', '③']

export default function DataInsight() {
  const { t } = useTranslation()
  const pains = t('agentforge.insight.pains', { returnObjects: true })
  const gains = t('agentforge.insight.gains', { returnObjects: true })
  const agents = t('agentforge.insight.agents', { returnObjects: true })
  const market = t('agentforge.insight.market', { returnObjects: true })

  // 只把名稱餵給流程圖，說明文字留給右欄 —— 兩邊都放會讓同一段話在畫面上出現兩次。
  const flowSteps = agents.map((a) => ({ title: a.en, subtitle: a.zh }))

  return (
    <section id="insight" className="scroll-mt-32 py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
      {/* 點陣底紋 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-16">
          <span className="text-sm font-semibold text-violet-400 uppercase tracking-widest">
            {t('agentforge.insight.tag')}
          </span>
          <h2 className="section-title mt-3 text-white">{t('agentforge.insight.title')}</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('agentforge.insight.intro')}
          </p>
        </FadeUp>

        {/* 痛點 → 獲得 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <FadeUp>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-5">
                {t('agentforge.insight.pains_label')}
              </p>
              <ul className="space-y-3">
                {pains.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertCircle size={17} className="text-amber-500/80 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="h-full rounded-2xl border border-violet-500/30 bg-violet-500/[0.07] p-7">
              <p className="text-sm font-bold text-violet-300 uppercase tracking-wider mb-5">
                {t('agentforge.insight.gains_label')}
              </p>
              <ul className="space-y-3">
                {gains.map((g, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={17} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-200 leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>

        {/* 三階段 Agent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <FadeUp>
            <div className="max-w-md mx-auto lg:mx-0 w-full">
              <AgentFlow steps={flowSteps} tone="onDark" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="space-y-5">
              {agents.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-2xl text-violet-400 leading-none flex-shrink-0">{NUMERALS[i]}</span>
                  <div>
                    <p className="text-base font-bold text-white leading-snug">{a.en}</p>
                    <p className="text-sm font-medium text-violet-300">{a.zh}</p>
                    <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* 雲市集 */}
        <FadeUp>
          <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-600/20 to-transparent p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <span className="inline-block text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">
                  {market.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{market.title}</h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">{market.desc}</p>
              </div>
              <div>
                <ul className="space-y-2.5 mb-6">
                  {market.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200 leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={MARKET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700
                    text-white font-semibold rounded-lg text-sm transition-all duration-200
                    shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  {market.cta}
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
```

- [ ] **Step 2：確認編譯與 lint 都通過**

Run: `npm run build`
Expected：`✓ built in ...`

Run（只掃本 task 新增／修改的檔案，並濾掉 prop-types）：

```bash
npx eslint <本 task 動到的檔案> --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。

- [ ] **Step 3：Commit**

```bash
git add src/components/agentforge/DataInsight.jsx
git commit -m "feat(agentforge): 新增 DATA INSIGHT 深色區塊

痛點與導入後獲得左右對照、三階段 Agent 流程、
經濟部雲市集外連卡片。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 9：WorkflowCases 元件

整頁最大的區塊。平台價值 5 條 + 3 個旗艦案例（全寬交錯）+ 10 張網格卡 + 客製化 CTA 卡。

**Files:**
- Create: `src/components/agentforge/WorkflowCases.jsx`

- [ ] **Step 1：建立元件**

Create `src/components/agentforge/WorkflowCases.jsx`：

```jsx
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react'
import { afIcon } from '../../constants/agentforge'
import AgentFlow from './AgentFlow'
import FadeUp from './FadeUp'

/* ── 成果：before → after ──────────────────────────────────────────── */
/* 具名匯出：/design-system 會 import 來做 Live Preview，避免文件與實作漂移 */
export function DeltaMetrics({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((m, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-4 text-center
            dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-xs text-slate-400 line-through dark:text-slate-500">{m.before}</p>
          <p className="mt-1 text-xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums leading-tight">
            {m.after}
          </p>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-snug">{m.label}</p>
        </div>
      ))}
    </div>
  )
}

/* ── 成果：方向箭頭（案例 2 原稿未提供數字，不編造） ──────────────── */
export function QualitativeMetrics({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((m, i) => {
        if (m.direction !== 'up' && m.direction !== 'down' && import.meta.env.DEV) {
          console.warn(`[QualitativeMetrics] 未知的 direction："${m.direction}"，已當作 down 處理`)
        }
        const up = m.direction === 'up'
        const Arrow = up ? ArrowUpRight : ArrowDownRight
        return (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4
              dark:border-slate-700 dark:bg-slate-800"
          >
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                ${up
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400'}`}
            >
              <Arrow size={17} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{m.label}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.note}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── 旗艦案例：全寬，左右交錯 ──────────────────────────────────────── */
function FlagshipCase({ data, index, labels }) {
  const reversed = index % 2 === 1
  const flowSteps = data.flow.map((s) => ({
    title: s.agents,
    subtitle: s.label,
    human: s.human,
  }))

  if (data.metrics_kind !== 'delta' && data.metrics_kind !== 'qualitative' && import.meta.env.DEV) {
    console.warn(`[FlagshipCase] 未知的 metrics_kind："${data.metrics_kind}"，已當作 qualitative 處理`)
  }

  return (
    <FadeUp>
      <article className="rounded-3xl border border-slate-200 bg-slate-50/60 p-7 md:p-10
        dark:border-slate-700 dark:bg-slate-800/40">

        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {labels.flagship} {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
          {data.title}
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          {data.summary}
        </p>

        <div className={`mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start
          ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>

          {/* 背景 + 痛點 */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {labels.background}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.85]">{data.background}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5
              dark:border-amber-500/30 dark:bg-amber-500/[0.07]">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                {labels.pains}
              </p>
              <ul className="space-y-2">
                {data.pains.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <AlertTriangle size={15} className="text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 工作流 */}
          <div>
            <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider mb-3">
              {labels.flow}
            </p>
            <AgentFlow steps={flowSteps} tone="onLight" />
          </div>
        </div>

        {/* 成果 */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            {data.metrics_label}
          </p>
          {data.metrics_kind === 'delta'
            ? <DeltaMetrics items={data.metrics} />
            : <QualitativeMetrics items={data.metrics} />}
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
            {labels.disclaimer}
          </p>
        </div>
      </article>
    </FadeUp>
  )
}

/* ── 更多工作場景：網格卡 ──────────────────────────────────────────── */
function MoreCard({ item, index }) {
  const Icon = afIcon(item.icon)
  return (
    <FadeUp delay={index * 0.05} className="h-full">
      <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6
        hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1
        transition-all duration-300
        dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-4">
          <Icon size={19} className="text-violet-600 dark:text-violet-300" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
        <ul className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {item.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={14} className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  )
}

/* ── 第 14 張：客製化 CTA ──────────────────────────────────────────── */
function CustomCard({ data }) {
  const Icon = afIcon(data.icon)
  return (
    <FadeUp>
      <div className="rounded-3xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-white p-8 md:p-10
        dark:border-violet-500/40 dark:from-violet-500/[0.12] dark:to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-600/30">
              <Icon size={23} className="text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {data.title}
            </h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-[1.85]">{data.desc}</p>
            <p className="mt-5 text-lg font-bold text-violet-700 dark:text-violet-300">{data.tagline}</p>
          </div>
          <div>
            <ul className="space-y-2.5 mb-7">
              {data.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check size={16} className="text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700
                text-white font-semibold rounded-lg text-sm transition-all duration-200
                shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {data.cta} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

/* ── 區塊 ──────────────────────────────────────────────────────────── */
export default function WorkflowCases() {
  const { t } = useTranslation()
  const values = t('agentforge.cases.values', { returnObjects: true })
  const flagship = t('agentforge.cases.flagship', { returnObjects: true })
  const more = t('agentforge.cases.more', { returnObjects: true })
  const custom = t('agentforge.cases.custom', { returnObjects: true })

  const labels = {
    flagship: t('agentforge.cases.flagship_label'),
    background: t('agentforge.cases.background_label'),
    pains: t('agentforge.cases.pains_label'),
    flow: t('agentforge.cases.flow_label'),
    disclaimer: t('agentforge.cases.disclaimer'),
  }

  return (
    <section id="cases" className="scroll-mt-32 py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="text-center mb-14">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {t('agentforge.cases.tag')}
          </span>
          <h2 className="section-title mt-3">{t('agentforge.cases.title')}</h2>
          <p className="section-subtitle">{t('agentforge.cases.intro')}</p>
        </FadeUp>

        {/* 平台價值 */}
        <FadeUp className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
            {t('agentforge.cases.values_label')}
          </h3>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {values.map((v, i) => (
            <FadeUp key={i} delay={i * 0.06} className="h-full">
              <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-5
                dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex items-start gap-2.5">
                  <Check size={17} className="text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{v.title}</p>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* 旗艦案例 ×3 */}
        <div className="space-y-10 mb-24">
          {flagship.map((c, i) => (
            <FlagshipCase key={i} data={c} index={i} labels={labels} />
          ))}
        </div>

        {/* 更多工作場景 ×10 */}
        <FadeUp className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('agentforge.cases.more_label')}
          </h3>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {more.map((m, i) => (
            <MoreCard key={i} item={m} index={i} />
          ))}
        </div>

        {/* 第 14 張：客製化 */}
        <CustomCard data={custom} />
      </div>
    </section>
  )
}
```

- [ ] **Step 2：確認編譯與 lint 都通過**

Run: `npm run build`
Expected：`✓ built in ...`

Run（只掃本 task 新增／修改的檔案，並濾掉 prop-types）：

```bash
npx eslint <本 task 動到的檔案> --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。

- [ ] **Step 3：Commit**

```bash
git add src/components/agentforge/WorkflowCases.jsx
git commit -m "feat(agentforge): 新增企業案例區塊

平台價值 5 條、3 個旗艦案例（背景/痛點/工作流/成果）、
10 張工作場景卡、1 張客製化 CTA 卡。
成果支援 before→after 與方向箭頭兩種樣式。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 10：AgentForgeProduct 頁面

Hero + 吸頂子導覽 + 組裝三個區塊 + CTA Banner。

**Files:**
- Create: `src/pages/AgentForgeProduct.jsx`

- [ ] **Step 1：建立頁面**

Create `src/pages/AgentForgeProduct.jsx`：

```jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useCmsContent } from '../hooks/useCmsContent'
import AgentNetwork from '../components/agentforge/AgentNetwork'
import DualMode from '../components/agentforge/DualMode'
import DataInsight from '../components/agentforge/DataInsight'
import WorkflowCases from '../components/agentforge/WorkflowCases'
import FadeUp from '../components/agentforge/FadeUp'

const SUBNAV = [
  { key: 'dual',    href: '#dual'    },
  { key: 'insight', href: '#insight' },
  { key: 'cases',   href: '#cases'   },
]

/** 捲過 Hero 後淡入的區塊導覽。固定在 Navbar（h-16）下方。 */
function SubNav() {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md
            dark:border-slate-700/70 dark:bg-slate-900/90"
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-5 sm:gap-7 overflow-x-auto">
            {SUBNAV.map((s) => (
              <a
                key={s.key}
                href={s.href}
                className="text-sm font-medium whitespace-nowrap text-slate-600 hover:text-violet-600
                  dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
              >
                {t(`agentforge.subnav.${s.key}`)}
              </a>
            ))}
            <Link
              to="/contact"
              className="ml-auto text-sm font-semibold whitespace-nowrap text-violet-600 dark:text-violet-400 hover:underline"
            >
              {t('agentforge.subnav.contact')}
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function AgentForgeProduct() {
  const { t } = useTranslation()
  const cmsHeroDesc = useCmsContent('agentforge', 'hero_desc')
  const tags = t('agentforge.tags', { returnObjects: true })

  return (
    <div className="min-h-screen">
      <SubNav />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden
        bg-gradient-to-br from-violet-50 via-white to-slate-100
        dark:bg-none dark:[background:linear-gradient(135deg,#0f172a_0%,#0d0a1e_60%,#000_100%)]">

        <div className="absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.10]"
          style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none dark:opacity-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.07] rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          {/* 麵包屑 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-14"
          >
            <Link to="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-slate-500">
              {t('navbar.home')}
            </Link>
            <span>/</span>
            <span>{t('navbar.products')}</span>
            <span>/</span>
            <span className="text-violet-600 dark:text-violet-400">{t('agentforge.breadcrumb')}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* 左：文字 */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8
                bg-violet-100 border border-violet-200 text-violet-700
                dark:bg-white/5 dark:border-white/10 dark:text-violet-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium tracking-wide">{t('agentforge.badge')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight">
                <span className="text-slate-900 dark:text-white">{t('agentforge.hero_title')} </span>
                <span className="text-gradient-violet-anim">{t('agentforge.hero_title_gradient')}</span>
              </h1>
              <p className="mt-3 text-2xl font-semibold text-slate-700 dark:text-white/80">
                {t('agentforge.hero_subtitle')}
              </p>

              <div className="mt-7 text-base text-slate-600 dark:text-slate-400 leading-[1.8] max-w-lg">
                {cmsHeroDesc
                  ? <span dangerouslySetInnerHTML={{ __html: cmsHeroDesc }} />
                  : t('agentforge.hero_desc')}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.97]
                    text-white font-semibold rounded-lg transition-all duration-200 text-sm
                    shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/35 hover:-translate-y-0.5"
                >
                  {t('agentforge.cta_primary')} <ArrowRight size={16} />
                </Link>
                <a
                  href="#cases"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-lg transition-all duration-200 text-sm active:scale-[0.97]
                    border border-slate-300 text-slate-600 hover:border-violet-500 hover:text-violet-600
                    dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-500/60 dark:hover:text-violet-400"
                >
                  {t('agentforge.cta_secondary')} <ChevronDown size={16} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded text-[11px] font-medium
                      bg-white border border-slate-200 text-slate-500
                      dark:bg-white/5 dark:border-white/10 dark:text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 右：Multi-Agent 協作網絡 */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
            >
              <AgentNetwork />
            </motion.div>
          </div>
        </div>
      </section>

      <DualMode />
      <DataInsight />
      <WorkflowCases />

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="py-20 bg-violet-600 dark:bg-violet-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {t('agentforge.cta_title')}
            </h2>
            <p className="mt-5 text-lg text-violet-100 leading-relaxed">
              {t('agentforge.cta_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold rounded-lg
                  hover:bg-violet-50 active:scale-[0.97] transition-all duration-200 shadow-xl hover:-translate-y-0.5 text-base"
              >
                {t('agentforge.cta_btn')} <ArrowRight size={18} />
              </Link>
              <a
                href="#cases"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-lg
                  hover:border-white hover:bg-white/10 active:scale-[0.97] transition-all duration-200 text-base"
              >
                {t('agentforge.cta_back')}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2：確認編譯與 lint 都通過**

Run: `npm run build`
Expected：`✓ built in ...`

Run（只掃本 task 新增／修改的檔案，並濾掉 prop-types）：

```bash
npx eslint <本 task 動到的檔案> --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。

- [ ] **Step 3：Commit**

```bash
git add src/pages/AgentForgeProduct.jsx
git commit -m "feat(agentforge): 新增 CRIS AgentForge Platform 產品頁

Hero（Multi-Agent 網絡）+ 吸頂子導覽 + 三大區塊 + CTA Banner。
尚未接上路由。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 11：接上路由與全站連結

這一步之後頁面才真的看得到。

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Navbar.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Features.jsx`
- Modify: `src/pages/AdminContent.jsx`
- Modify: `src/pages/Admin.jsx`

- [ ] **Step 1：`src/App.jsx` — 換 import 與路由**

把這行：

```jsx
import AIBoxProduct from './pages/AIBoxProduct'
```

改成：

```jsx
import AgentForgeProduct from './pages/AgentForgeProduct'
```

把這行：

```jsx
<Route path="/products/ai-box" element={<AIBoxProduct />} />
```

改成：

```jsx
<Route path="/products/agentforge" element={<AgentForgeProduct />} />
```

- [ ] **Step 2：`src/components/Navbar.jsx` — 移除 crisforge 外連項目**

把 `ctaStyle` 的 key 改掉：

```jsx
const ctaStyle = {
  '/products/aps':        'bg-cris-blue hover:bg-cris-blue-dark shadow-cris-blue/20',
  '/products/esg':        'bg-green-600 hover:bg-green-700 shadow-green-600/20',
  '/products/agentforge': 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20',
}
```

把 `products` 陣列改成（**刪掉最後一筆 external，第三筆改用 agentforge**）：

```jsx
  const products = [
    { name: t('navbar.aps_name'), desc: t('navbar.aps_desc'), href: '/products/aps' },
    { name: t('navbar.esg_name'), desc: t('navbar.esg_desc'), href: '/products/esg' },
    { name: t('navbar.agentforge_name'), desc: t('navbar.agentforge_desc'), href: '/products/agentforge' },
    { name: t('navbar.mc_name'), desc: t('navbar.mc_desc'), href: '/products/mission-control' },
  ]
```

移除 `ProductLink` 元件定義（整段 function 與它上面的註解），因為已經沒有 external 產品。
把桌機下拉與手機選單裡的 `<ProductLink ... >` 換回 `<Link to={p.href} ...>`，並刪掉
`{p.external && <ExternalLink ... />}` 兩處。

桌機下拉內的迴圈改成：

```jsx
                  {products.map((p) => (
                    <Link
                      key={p.href}
                      to={p.href}
                      className="flex flex-col px-4 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      onClick={() => setProductOpen(false)}
                    >
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{p.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</span>
                    </Link>
                  ))}
```

手機選單內的迴圈改成：

```jsx
                {products.map((p) => (
                  <Link key={p.href} to={p.href} className="text-sm text-slate-600 dark:text-slate-400" onClick={() => setMenuOpen(false)}>
                    {p.name}
                  </Link>
                ))}
```

最後把第一行 import 裡的 `ExternalLink` 刪掉：

```jsx
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react'
```

- [ ] **Step 3：`src/components/Footer.jsx` — 改產品連結**

把：

```jsx
      { key: 'navbar.aibox_name', href: '/products/ai-box' },
```

改成：

```jsx
      { key: 'navbar.agentforge_name', href: '/products/agentforge' },
```

- [ ] **Step 4：`src/components/Features.jsx` — 改第 3 張卡連結**

把 `featureMeta` 第三筆的 `href`：

```jsx
  { icon: Cpu,       iconColor: 'text-violet-500',  lightBg: 'bg-violet-50 dark:bg-violet-900/20', href: '/products/agentforge' },
```

- [ ] **Step 5：`src/pages/AdminContent.jsx` — 改 CMS 頁面代號**

把：

```jsx
  {
    id: 'aibox',
    label: 'AI 一體機',
```

改成：

```jsx
  {
    id: 'agentforge',
    label: 'CRIS AgentForge Platform',
```

- [ ] **Step 6：`src/pages/Admin.jsx` — 改標籤字串**

把 `AI_TAGS` 裡的 `'AI 一體機'` 改成 `'AgentForge'`。

- [ ] **Step 7：確認編譯與 lint**

Run: `npm run build`
Expected：`✓ built in ...`

Run：

```bash
npx eslint src/App.jsx src/components/Navbar.jsx src/components/Footer.jsx src/components/Features.jsx src/pages/AdminContent.jsx src/pages/Admin.jsx --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。特別確認 `ExternalLink`、`ProductLink` 沒有殘留成未使用的變數。

- [ ] **Step 8：人工驗證**

Run: `npm run dev`

在瀏覽器逐項確認：

1. 開 `http://localhost:5173/products/agentforge` —— 頁面完整顯示五大區塊
2. 導覽列「產品」下拉 —— **只有 4 個項目，沒有任何外連圖標**，第 3 項是 CRIS AgentForge Platform
3. 捲過 Hero —— 吸頂子導覽淡入，點四個連結都能正確跳到對應區塊（且不被導覽列蓋住）
4. 三個旗艦案例 —— 工作流 pipeline 與成果數字直接可見，案例 2 顯示方向箭頭樣式
5. 免責聲明三處都清楚可讀
6. 雲市集按鈕 —— 另開分頁到 keid.nat.gov.tw
7. 切深色模式 —— 所有區塊正常，沒有白底黑字或看不見的文字
8. 視窗縮到手機寬度 —— 旗艦案例左右欄垂直堆疊，網格變單欄，子導覽可橫向捲動
9. 首頁第三張卡、頁尾產品欄 —— 都連到新頁

- [ ] **Step 9：Commit**

```bash
git add src/App.jsx src/components/Navbar.jsx src/components/Footer.jsx src/components/Features.jsx src/pages/AdminContent.jsx src/pages/Admin.jsx
git commit -m "feat(agentforge): 接上路由並更新全站連結

路由改為 /products/agentforge，
導覽列移除連到 crisforge.com 的外連項目。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 12：刪除舊產品

**Files:**
- Delete: `src/pages/AIBoxProduct.jsx`
- Delete: `src/components/AIAppliance.jsx`
- Modify: `src/locales/{zh-TW,zh-CN,en}.json`

- [ ] **Step 1：確認 AIAppliance 真的沒有被 import**

Run: `grep -rn "AIAppliance" src/ --include=*.jsx | grep -v "^src/components/AIAppliance.jsx"`
Expected：無輸出。若有輸出就**不要刪**，先回報。

- [ ] **Step 2：刪檔**

```bash
git rm src/pages/AIBoxProduct.jsx src/components/AIAppliance.jsx
```

- [ ] **Step 3：三份 locale 刪除舊 namespace**

在 `zh-TW.json`、`zh-CN.json`、`en.json` 三份檔案中，各刪除：

- 整個 `"aibox": { ... }` 區塊
- 整個 `"ai_appliance": { ... }` 區塊
- `navbar` 內的 `"aibox_name"` 與 `"aibox_desc"` 兩行

保留 `navbar.agentforge_name` 與 `navbar.agentforge_desc`（現有值已正確）。

- [ ] **Step 4：確認沒有殘留參照**

Run:

```bash
grep -rn "aibox\|ai-box\|AIBoxProduct\|AIAppliance\|ai_appliance" src/ || echo "CLEAN"
```

Expected: `CLEAN`

- [ ] **Step 5：確認編譯通過**

Run: `npm run build`
Expected：`✓ built in ...`

Run（只掃本 task 新增／修改的檔案，並濾掉 prop-types）：

```bash
npx eslint <本 task 動到的檔案> --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。

- [ ] **Step 6：Commit**

```bash
git add -A src/
git commit -m "refactor: 移除 AI 一體機產品頁與相關 locale

刪除 AIBoxProduct.jsx、死碼 AIAppliance.jsx，
以及三份 locale 的 aibox / ai_appliance namespace。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 13：简中 locale

**Files:**
- Modify: `src/locales/zh-CN.json`

- [ ] **Step 1：翻譯**

把 zh-TW 的整個 `agentforge` namespace 複製到 zh-CN.json 的相同位置，做繁轉簡 **並且**做大陸用語在地化。不是單純字形轉換。

常見對應：

| 繁中 | 简中 |
|---|---|
| 資訊 | 信息 |
| 軟體 / 硬體 | 软件 / 硬件 |
| 網路 | 网络 |
| 程式 | 程序 |
| 品質 | 质量 |
| 專案 | 项目 |
| 最佳化 | 优化 |
| 儀表板 | 仪表盘 |
| 稼動率 | 稼动率（製造業慣用，保留） |
| 詢單 | 询单 |
| 缺料 | 缺料（保留） |
| 報工 | 报工 |
| 差勤 | 考勤 |
| 報關 | 报关 |

專有名詞保持原樣不翻：`CRIS AgentForge Platform`、`Multi-Agent`、`ERP`、`MES`、`CRM`、`WMS`、`APS`、`ATP/CTP`、`AOI`、`RPA`、`BPM`、`ESG`、`OTD`、`SMT`、`SKU`、`BOM`、`Data Analysis Agent`、`Dashboard Agent`、`Report Agent`、`Orchestrator Agent`、`Human Review`、`AI Workforce`、`Workflow`。

`icon`、`metrics_kind`、`direction`、`human` 這些欄位是程式用的鍵值，**原樣照抄不要翻譯**。

> `npm run check:i18n` 會比對這三個列舉欄位的值是否三語相同。把 `"up"` 譯成「上升」、`"delta"` 譯成「差量」會被直接擋下並指出應為什麼值 —— 這類錯誤只比對 key 抓不到，畫面卻會靜默走錯分支（箭頭方向錯、成果樣式錯、圖標退回 fallback）。

「經濟部雲市集」是台灣政府單位名稱，簡中版保留「经济部云市集」，不要改成其他名稱。

`agentforge.cases.disclaimer` 保留 `※` 前綴（`※` 是泛中文的注記慣例，簡中沿用，不是台灣特有寫法），只翻譯後面的文字本身。

- [ ] **Step 2：確認結構對齊**

Run: `npm run check:i18n`
Expected：`✓ zh-CN` 通過；`✗ en` 仍然失敗（英文在 Task 14 補）。

- [ ] **Step 3：Commit**

```bash
git add src/locales/zh-CN.json
git commit -m "feat(agentforge): 新增简中 locale 內容

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 14：英文 locale

**Files:**
- Modify: `src/locales/en.json`

- [ ] **Step 1：翻譯**

把 `agentforge` namespace 加進 en.json。**重寫成 B2B 英文文案，不做逐字直譯。**中文的四字詞與排比在英文裡會顯得冗贅，改用製造業／供應鏈的標準英文術語。

術語對照：

| 繁中 | English |
|---|---|
| 企業智慧團隊鍛造平台 | Forge Your Enterprise AI Workforce |
| 精敏詢單 | Order Feasibility Check (ATP/CTP) |
| 先進物料與產能規劃 | Advanced Material & Capacity Planning |
| 智慧排程 | AI Production Scheduling |
| 供應鏈協作平台 | Supply Chain Collaboration |
| 數智員工 | Digital Workers |
| 設備監控 | Equipment Monitoring |
| 智慧報工 | Shop-Floor Reporting |
| 稼動率 | equipment utilization / OEE |
| 準交率 | on-time delivery rate |
| 詢單回覆時間 | quote turnaround time |
| 生管人工排程工時 | planner scheduling hours |
| 缺料 | material shortage |
| 在製品庫存 | WIP inventory |
| 產銷協調會議 | S&OP meeting |
| 碳盤查 | carbon inventory / GHG accounting |
| 報關 | customs clearance |
| 差勤管理與文管 | attendance & document management |
| 情境試算 | scenario simulation |

免責聲明英文版：`* Based on scenario simulation using actual data; not results from a completed deployment.`
`agentforge.cases.disclaimer` 的注記符號英文版用 `*`（ASCII 星號），不要沿用中文的 `※`。

`icon`、`metrics_kind`、`direction`、`human` 原樣照抄不要翻譯 —— `check:i18n` 會比對這三個列舉欄位的值三語是否相同，譯了會被擋下。
`metrics` 的 `before` / `after` 值（`約 71%` → `~71%`、`約 46 天` → `~46 days`、`20 小時／週` → `20 hrs/week`）要翻。

- [ ] **Step 2：確認三份 locale 全部對齊**

Run: `npm run check:i18n`
Expected：

```
✓ zh-CN 與 zh-TW 對齊（NNN 個 key）
✓ en 與 zh-TW 對齊（NNN 個 key）

三份 locale 檔完全對齊。
```

exit code 0。**這是 Task 6 起紅燈的轉綠點。**

- [ ] **Step 2.5：檢查 Hero 協作網絡在英文下的節點間距**

英文 `hero_network` 標籤比中文長（Procurement Agent vs 採購 Agent）。已量測過：**不會溢出容器**（節點用 `right` 定位，右緣位置與內容寬度無關），但左右節點之間的間距會從中文的約 116px 縮到約 32px。實際英文文案定案後，用瀏覽器把視窗縮到 375px 看一眼，確認 `sched` 與 `supply`、`qc` 與 `decide` 沒有互相重疊。若真的太擠，縮短英文標籤（例如 `Procurement` 而非 `Procurement Agent`）比改版面便宜。

- [ ] **Step 3：人工驗證三語切換**

Run: `npm run dev`，開 `/products/agentforge`，用導覽列的語言切換器切三次，確認：

- 三種語言下五大區塊都有完整內容
- 沒有任何區塊殘留繁中（表示該 key 有 fallback）
- 英文版沒有版面爆開（英文較長，特別看能力卡標題與成果數字格）

- [ ] **Step 4：Commit**

```bash
git add src/locales/en.json
git commit -m "feat(agentforge): 新增英文 locale 內容

三份 locale 檔至此完全對齊，check:i18n 轉綠。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 15：設計系統文件頁

CLAUDE.md 規定：「新增元件或修改 token 時，請同步更新此頁面。」

**Files:**
- Modify: `src/pages/DesignSystem.jsx`

現有 helper：`SectionAnchor` / `SubSection` / `PreviewBox` / `Code` / `AnatomyRow`。
頁面為淺色版型，三個新區塊照樣沿用這些 helper。

- [ ] **Step 1：加 import**

在 `src/pages/DesignSystem.jsx` 檔案頂端 import 區加入：

```jsx
import AgentFlow from '../components/agentforge/AgentFlow'
import { DeltaMetrics, QualitativeMetrics } from '../components/agentforge/WorkflowCases'
import { ArrowLeftRight } from 'lucide-react'
```

（`ArrowLeftRight` 若已在既有的 lucide import 清單中就不必重複加。）

- [ ] **Step 2：加三個區塊函式**

在 `DarkModeSection` 之後、頁面主元件之前，加入：

```jsx
// ─── AgentForge components ───────────────────────────────────────────────────

function AgentFlowSection() {
  return (
    <>
      <SectionAnchor id="comp-agentflow" title="Agent Flow" subtitle="Multi-Agent 工作流程圖，DATA INSIGHT 與旗艦案例共用" />

      <SubSection title="Live Preview — onLight">
        <PreviewBox label='<AgentFlow steps={...} tone="onLight" />'>
          <div className="w-full max-w-sm">
            <AgentFlow
              steps={[
                { title: '排程分析 Agent', subtitle: '排程狀態分析' },
                { title: '產能分析 Agent ＋ 交期風險 Agent', subtitle: '瓶頸與交期風險辨識' },
                { title: 'Human Review', subtitle: '管理者確認', human: true },
              ]}
              tone="onLight"
            />
          </div>
        </PreviewBox>
        <Code>{`<AgentFlow
  steps={[
    { title: '排程分析 Agent', subtitle: '排程狀態分析' },
    { title: '產能分析 Agent ＋ 交期風險 Agent', subtitle: '瓶頸與交期風險辨識' },
    { title: 'Human Review', subtitle: '管理者確認', human: true },
  ]}
  tone="onLight"
/>`}</Code>
      </SubSection>

      <SubSection title="Live Preview — onDark">
        <PreviewBox dark label='tone="onDark" — 用在深色底區塊（DATA INSIGHT）'>
          <div className="w-full max-w-sm">
            <AgentFlow
              steps={[
                { title: 'Data Analysis Agent', subtitle: '資料分析代理人', desc: '自動整合 ERP、MES、CRM 與 Excel 資料。' },
                { title: 'Dashboard Agent', subtitle: '智慧儀表板代理人', desc: '即時產生儀表板與 KPI 監控畫面。' },
              ]}
              tone="onDark"
            />
          </div>
        </PreviewBox>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="steps"          value="{ title, subtitle, desc?, human? }[]" desc="流程步驟陣列，依序編號 ①②③…" />
            <AnatomyRow name="steps[].title"  value="string"                  desc="Agent 名稱。多個 Agent 用全形「＋」串成同一字串" />
            <AnatomyRow name="steps[].subtitle" value="string"                desc="該步驟做什麼" />
            <AnatomyRow name="steps[].desc"   value="string (選填)"            desc="第三行補充說明，旗艦案例不用" />
            <AnatomyRow name="steps[].human"  value="boolean (選填)"           desc="true 改用虛線外框 + 灰階 + UserCheck 圖標，標示人工審核節點" />
            <AnatomyRow name="tone"           value="'onLight' | 'onDark'"    desc="配合底色，預設 onLight" />
            <AnatomyRow name="進場動畫"        value="useInView once + stagger 0.12s" desc="捲入時逐階點亮" />
            <AnatomyRow name="連接箭頭"        value="ArrowDown 16px"          desc="步驟之間，最後一步不畫" />
          </tbody>
        </table>
      </SubSection>
    </>
  )
}

function MetricSection() {
  return (
    <>
      <SectionAnchor id="comp-metric" title="Case Metrics" subtitle="案例成果數字，分量化與質化兩種樣式" />

      <SubSection title="Delta — 有明確 before → after 數字">
        <PreviewBox label="metrics_kind: 'delta'">
          <div className="w-full">
            <DeltaMetrics
              items={[
                { label: '訂單準交率', before: '約 71%', after: '85～90%' },
                { label: '平均延遲', before: '約 46 天', after: '< 20 天' },
                { label: '整體資源稼動率', before: '約 77%', after: '85%+' },
                { label: '生管人工排程工時', before: '約 20 小時／週', after: '約 8 小時／週' },
              ]}
            />
          </div>
        </PreviewBox>
      </SubSection>

      <SubSection title="Qualitative — 只有方向，沒有數字">
        <PreviewBox label="metrics_kind: 'qualitative'">
          <div className="w-full">
            <QualitativeMetrics
              items={[
                { label: '缺貨率', direction: 'down', note: '即時掌握需求與庫存缺口' },
                { label: '備貨準確率', direction: 'up', note: '促銷需求提前預測' },
              ]}
            />
          </div>
        </PreviewBox>
        <p className="text-xs text-slate-500 mt-3">
          客戶未提供量化數據時一律用這個樣式，<strong>不得以 delta 樣式填入推估數字</strong>。
          兩種樣式刻意做得不像，避免讀者把質化成果誤讀成量化承諾。
        </p>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="delta 舊值"   value="text-xs line-through text-slate-400" desc="刪除線，弱化" />
            <AnatomyRow name="delta 新值"   value="text-xl font-extrabold text-violet-600 tabular-nums" desc="視覺主體，等寬數字避免跳動" />
            <AnatomyRow name="qualitative ↑" value="ArrowUpRight + emerald" desc="正向指標上升" />
            <AnatomyRow name="qualitative ↓" value="ArrowDownRight + violet" desc="負向指標下降（缺貨率、工時等）" />
            <AnatomyRow name="免責聲明"      value="text-xs text-slate-500 italic" desc="緊接成果下方，不得縮小或隱藏" />
            <AnatomyRow name="grid"         value="grid-cols-2 lg:grid-cols-4 / sm:grid-cols-2" desc="delta 四欄、qualitative 兩欄" />
          </tbody>
        </table>
      </SubSection>
    </>
  )
}

function DualCompareSection() {
  return (
    <>
      <SectionAnchor id="comp-dualcompare" title="Dual Mode Compare" subtitle="AI+ 與 +AI 的概念對照卡" />

      <SubSection title="Live Preview">
        <PreviewBox label="AgentForge 產品頁 #dual 區塊開頭">
          <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-6">
              <p className="text-3xl font-extrabold text-violet-600">AI+</p>
              <p className="mt-2 text-lg font-bold text-slate-900">把 AI 加進營運決策</p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">接單、生產、供應鏈、經營分析 —— 讓人做的判斷更準。</p>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <ArrowLeftRight size={22} className="text-slate-300" />
            </div>
            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6">
              <p className="text-3xl font-extrabold text-indigo-600">+AI</p>
              <p className="mt-2 text-lg font-bold text-slate-900">把執行交給 AI</p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">監控、報工、客服、品質 —— 讓 AI 代替人把事情做完。</p>
            </div>
          </div>
        </PreviewBox>
        <p className="text-xs text-slate-500 mt-3">
          存在理由：「AI+」與「+AI」只差一個加號位置，訪客無法自行分辨。
          這張對照卡是進入 12 張能力卡之前的必要前導。
        </p>
      </SubSection>

      <SubSection title="Anatomy">
        <table className="w-full">
          <tbody>
            <AnatomyRow name="左卡（AI+）"  value="border-violet-200 / bg-violet-50/60"  desc="決策導向，沿用產品主色" />
            <AnatomyRow name="右卡（+AI）"  value="border-indigo-200 / bg-indigo-50/60"  desc="執行導向，鄰近色區隔但不衝突" />
            <AnatomyRow name="標籤字級"     value="text-3xl font-extrabold"             desc="加號位置是識別重點，必須夠大" />
            <AnatomyRow name="中央圖標"     value="ArrowLeftRight，hidden md:flex"      desc="md 以下隱藏，兩卡改上下堆疊" />
            <AnatomyRow name="grid"        value="md:grid-cols-[1fr_auto_1fr]"         desc="中欄依圖標寬度自適應" />
          </tbody>
        </table>
      </SubSection>
    </>
  )
}
```

- [ ] **Step 3：加進側邊導覽與頁面組裝**

在 `NAV` 陣列尾端（`comp-darkmode` 之後）加入：

```jsx
  { id: 'comp-agentflow',    label: 'Agent Flow' },
  { id: 'comp-metric',       label: 'Case Metrics' },
  { id: 'comp-dualcompare',  label: 'Dual Mode Compare' },
```

在頁面組裝的 `<DarkModeSection />` 之後加入：

```jsx
          <AgentFlowSection />
          <MetricSection />
          <DualCompareSection />
```

- [ ] **Step 4：更新頁首統計數字**

頁首有一組統計卡（`{ label: 'Type Styles', val: '9' }` 那一區）。把元件數量往上加 3，保持與實際一致。

- [ ] **Step 5：確認編譯並人工檢視**

Run: `npm run build`
Expected：`✓ built in ...`

Run（只掃本 task 新增／修改的檔案，並濾掉 prop-types）：

```bash
npx eslint <本 task 動到的檔案> --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。

Run: `npm run dev`，開 `http://localhost:5173/design-system`，確認：

- 側邊導覽多了三個項目，點擊都能正確跳轉
- Agent Flow 的 onLight 與 onDark 兩種預覽都正常（onDark 用 `PreviewBox dark`）
- Case Metrics 兩種樣式並陳，一眼看得出差異
- Dual Mode Compare 在視窗縮小到 md 以下時，中央箭頭消失、兩卡垂直堆疊

- [ ] **Step 4：Commit**

```bash
git add src/pages/DesignSystem.jsx
git commit -m "docs(design-system): 補上 AgentForge 三個新元件文件

Agent 流程圖、before→after 數字、AI+／+AI 對照卡。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 16：最終驗收

對照規格書 §10 的驗收標準逐項確認。

- [ ] **Step 1：自動化檢查全綠**

Run:

```bash
npm run check:i18n && npm run build
```

Expected：兩項全過，exit code 0。

再跑新增檔案的 lint：

```bash
npx eslint src/components/agentforge src/pages/AgentForgeProduct.jsx src/constants/agentforge.js --rule '{"react/prop-types":"off"}'
```

Expected：無任何輸出，exit code 0。

最後確認全專案可行動問題數沒有增加：

```bash
npx eslint . 2>&1 | grep -cE "no-unused-vars|exhaustive-deps"
```

Expected：**14 或更少**。（改版前基線為 15；Task 12 刪掉 `AIAppliance.jsx` 會少一筆，故為 14。）

- [ ] **Step 2：確認舊產品完全清乾淨**

Run:

```bash
grep -rn "ai-box\|aibox\|AIBoxProduct\|AIAppliance\|ai_appliance\|crisforge" src/ || echo "CLEAN"
```

Expected: `CLEAN`

- [ ] **Step 3：確認 14 個工作場景數量正確**

Run:

```bash
node -e "
const d=JSON.parse(require('fs').readFileSync('src/locales/zh-TW.json','utf8')).agentforge;
const n=d.cases.flagship.length + d.cases.more.length + 1;
console.log('工作場景總數：'+n+(n===14?' ✓':' ✗ 應為 14'));
console.log('AI+ '+d.dual.aiplus.items.length+' 項，+AI '+d.dual.plusai.items.length+' 項'+
  (d.dual.aiplus.items.length===6&&d.dual.plusai.items.length===6?' ✓':' ✗ 各應為 6'));
"
```

Expected：

```
工作場景總數：14 ✓
AI+ 6 項，+AI 6 項 ✓
```

- [ ] **Step 4：人工逐項驗收**

Run: `npm run dev`，對照規格書 §10 的 16 條清單逐項打勾。重點：

- [ ] `/products/agentforge` 正常，`/products/ai-box` 已不存在
- [ ] 產品下拉沒有任何 crisforge.com 外連
- [ ] 導覽列 / 頁尾 / 首頁第 3 張卡都指向新頁且名稱正確
- [ ] 雙軌能力 12 項全部渲染
- [ ] 旗艦案例的 pipeline 與數字不需點擊即可見
- [ ] 案例 2 用質化樣式，無編造數字
- [ ] 三處免責聲明可讀
- [ ] 雲市集外連正常另開分頁
- [ ] 子導覽四個錨點跳轉正確、不被導覽列遮住
- [ ] 三語切換完整
- [ ] 深色模式所有區塊正常
- [ ] sm / md / lg 三斷點版面正常
- [ ] `/design-system` 三個新元件已補上

- [ ] **Step 5：回報需 review 的自擬文案**

規格書 §9 列了 6 項由我方自擬、需要使用者確認的文案。實作完成後，把實際採用的文字整理出來請使用者過目：

1. 痛點「資料分散難以整合」（原稿為「資料分散自動整合」）
2. 第 4 節標題「14 個已落地的工作場景」
3. AI+／+AI 對照導言兩段
4. 第 4 節簡介
5. CTA Banner 標題與副標
6. **首頁 `Features.jsx` 第 3 張卡文案** —— 注意：第 3 張卡的內容來自 `features_data` 第 3 筆，
   Task 11 只改了連結，**文案還是舊的「私有化部署 · 數據主權掌控」**。這一步要把三份 locale 的
   `features_data[2]` 改寫成 AgentForge 的內容（title / subtitle / desc / points），
   然後 `npm run check:i18n && npm run build`，再 commit。

- [ ] **Step 6：最終 commit**

```bash
git add -A
git commit -m "feat(agentforge): 更新首頁產品卡文案並完成驗收

首頁第三張卡改為 CRIS AgentForge Platform 內容。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```
