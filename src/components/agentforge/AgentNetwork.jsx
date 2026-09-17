import { useRef, useState, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import { CalendarClock, Network, ScanLine, Bot, BarChart3 } from 'lucide-react'

/**
 * 5 個環繞節點。只宣告位置，連線端點由實際量測決定 ——
 * 節點盒的寬度取決於標籤文字，換語言或換寬度都會變，寫死的座標必定對不上。
 * 右側節點用 right 定位，讓盒子往內長，避免窄畫面撐出容器。
 */
const NODES = [
  { key: 'sched',  icon: CalendarClock, pos: { left: '2%',  top: '8%' } },
  { key: 'supply', icon: Network,       pos: { right: '2%', top: '6%' } },
  { key: 'qc',     icon: ScanLine,      pos: { left: '0%',  top: '64%' } },
  { key: 'decide', icon: Bot,           pos: { right: '0%', top: '68%' } },
  { key: 'report', icon: BarChart3,     pos: { left: '50%', bottom: '4%', transform: 'translateX(-50%)' } },
]

/** 線與節點之間留的空隙（px），避免線頂到邊框。 */
const GAP = 6

/**
 * 從 (sx, sy) 朝矩形中心連線時，線該停在矩形邊界的哪一點。
 * 用來把線裁到節點外緣，而不是穿進盒子裡。
 */
function edgePoint(sx, sy, rect) {
  const cx = rect.x + rect.w / 2
  const cy = rect.y + rect.h / 2
  const dx = cx - sx
  const dy = cy - sy
  if (dx === 0 && dy === 0) return { x: cx, y: cy }
  const tx = dx !== 0 ? (rect.w / 2 + GAP) / Math.abs(dx) : Infinity
  const ty = dy !== 0 ? (rect.h / 2 + GAP) / Math.abs(dy) : Infinity
  const t = Math.min(tx, ty, 1)
  return { x: cx - dx * t, y: cy - dy * t }
}

export default function AgentNetwork() {
  const { t, i18n } = useTranslation()
  const reduceMotion = useReducedMotion()

  const wrapRef = useRef(null)
  const centerRef = useRef(null)
  const nodeRefs = useRef([])
  const [edges, setEdges] = useState([])

  /**
   * 量測中心與各節點的實際位置，算出裁切後的線段。
   * 量的是外層定位 div —— 內層才有浮動與縮放動畫，transform 不影響 layout，
   * 所以外層的 rect 在動畫進行中仍然穩定。
   */
  const measure = useCallback(() => {
    const wrap = wrapRef.current
    const center = centerRef.current
    if (!wrap || !center) return

    const w = wrap.getBoundingClientRect()
    const toLocal = (r) => ({ x: r.left - w.left, y: r.top - w.top, w: r.width, h: r.height })
    const c = toLocal(center.getBoundingClientRect())
    const ccx = c.x + c.w / 2
    const ccy = c.y + c.h / 2

    const next = []
    for (const el of nodeRefs.current) {
      if (!el) continue
      const n = toLocal(el.getBoundingClientRect())
      const from = edgePoint(n.x + n.w / 2, n.y + n.h / 2, c) // 中心盒朝節點那一側的邊界
      const to = edgePoint(ccx, ccy, n)                        // 節點盒朝中心那一側的邊界
      next.push({ x1: from.x, y1: from.y, x2: to.x, y2: to.y })
    }
    setEdges(next)
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    if (centerRef.current) ro.observe(centerRef.current)
    nodeRefs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
    // 語言改變會換掉標籤文字、改變節點寬度，必須重新量測
  }, [measure, i18n.language])

  /**
   * 無限循環動畫（呼吸、浮動、閃爍）對開啟「減少動態效果」的使用者最不友善，
   * 一律關閉。回傳空物件時元素就停在 CSS 的靜態樣式。
   */
  const loop = (animate, transition) => (reduceMotion ? {} : { animate, transition })

  return (
    <div ref={wrapRef} className="relative h-[420px] w-full select-none" aria-hidden="true">
      {/* 呼吸光暈 */}
      <motion.div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl"
        {...loop(
          { opacity: [0.25, 0.6, 0.25], scale: [0.9, 1.06, 0.9] },
          { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        )}
      />

      {/* 連線：以容器像素為座標系，不設 viewBox，避免非等比拉伸讓角度跑掉 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {edges.map((e, i) => (
          <motion.line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="currentColor"
            className="text-violet-400 dark:text-violet-500"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.45"
            {...loop(
              { opacity: [0.15, 0.7, 0.15] },
              { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }
            )}
          />
        ))}
      </svg>

      {/* 中心：平台 */}
      <div ref={centerRef} className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div {...loop({ y: [0, -8, 0] }, { duration: 5, repeat: Infinity, ease: 'easeInOut' })}>
          <div className="rounded-2xl border border-violet-400/60 bg-violet-600/90 dark:bg-violet-600/80 px-6 py-4 shadow-2xl shadow-violet-500/40 backdrop-blur-sm text-center">
            <p className="text-[10px] font-mono tracking-widest text-violet-200">CRIS</p>
            <p className="text-base font-extrabold text-white leading-tight">AgentForge</p>
          </div>
        </motion.div>
      </div>

      {/* 環繞的 Agent 節點 */}
      {NODES.map((n, i) => {
        const Icon = n.icon
        return (
          <div
            key={n.key}
            ref={(el) => { nodeRefs.current[i] = el }}
            className="absolute z-10"
            style={n.pos}
          >
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
