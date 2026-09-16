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
