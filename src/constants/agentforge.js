import {
  Search, Factory, CalendarClock, Network, Bot, Zap,
  Activity, ClipboardList, BarChart3, Wrench, MessageSquare, AlertTriangle,
  Headphones, Leaf, FileCheck2, Ship, Package2, Cpu, Gauge, ScanLine,
  Users, Repeat2, Sparkles,
  BookOpen, Workflow, UsersRound, MonitorPlay, Plug,
  TrendingUp, Copy, Gem, Handshake,
  FileSpreadsheet, FileBarChart, ListChecks, Database, RefreshCw,
  Presentation, ShieldCheck, Landmark,
  ArrowLeftRight, Lightbulb, Target,
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
  dualtrack: ArrowLeftRight,
  patent: Lightbulb,
  target: Target,
  // 核心功能
  book: BookOpen,
  workflow: Workflow,
  team: UsersRound,
  monitor: MonitorPlay,
  plug: Plug,
  // 實質效益
  trending: TrendingUp,
  copy: Copy,
  gem: Gem,
  handshake: Handshake,
  // 產品與方案 S1–S4 條列（另沿用上方 chart / bot / users / link / zap）
  sheet: FileSpreadsheet,
  report: FileBarChart,
  rules: ListChecks,
  database: Database,
  sync: RefreshCw,
  warroom: Presentation,
  shield: ShieldCheck,
  governance: Landmark,
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
