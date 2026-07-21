import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Calendar, Layers, Wrench, RefreshCw, BarChart2, Package,
  AlertTriangle, CheckCircle2, ArrowRight, ChevronDown, ChevronUp,
  TrendingUp, Clock, Archive, Zap, X, Cpu,
  CheckCircle, XCircle, AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCmsContent } from '../hooks/useCmsContent'

// ─── Pipeline Intelligence data ───────────────────────────────────────────────

const pipelineOrders = [
  { id: 'ORD-0312', name: '電機外殼 × 200 pcs', progress: 68, status: '進行中', statusClr: 'blue',    due: '03/28' },
  { id: 'ORD-0318', name: '傳動軸組 × 50 sets',  progress: 35, status: '待加工', statusClr: 'amber',   due: '03/31' },
  { id: 'ORD-0325', name: '液壓缸蓋 × 80 pcs',  progress: 100, status: '已完成', statusClr: 'emerald', due: '03/25' },
]

const machineLoads = [
  { id: 'CNC-01',  load: 87, warn: false },
  { id: 'CNC-02',  load: 73, warn: false },
  { id: '沖床-01', load: 45, warn: false },
  { id: '研磨機',  load: 92, warn: true  },
  { id: '鑽孔機',  load: 31, warn: false },
]

const materialStatus = [
  { name: '鋁棒 A6061', state: 'ok',    qty: '庫存 2,400 kg' },
  { name: '模具 #M-028',state: 'ok',    qty: '上線備用' },
  { name: '塑粒 POM-C', state: 'warn',  qty: '3 天後到貨' },
  { name: 'PCB 主板',   state: 'error', qty: '缺料・需催料' },
]

const integrationPartners = [
  { name: '主流 ERP 系統',  cat: 'ERP' },
  { name: 'MES 製造執行',   cat: 'MES' },
  { name: 'WMS 倉儲系統',   cat: 'WMS' },
  { name: 'PLM 設計系統',   cat: 'PLM' },
  { name: 'IoT 設備數據',   cat: 'IoT' },
  { name: '模具管理系統',   cat: 'MTS' },
  { name: 'CRM 訂單系統',   cat: 'CRM' },
  { name: 'QMS 品質系統',   cat: 'QMS' },
]

// Icon map for pain points (order matches pain_points array)
const painPointIcons = [Zap, Package, RefreshCw]

// Icon map for features (order matches features array)
const featureIcons = [Calendar, Wrench, RefreshCw, Layers, BarChart2, Archive]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ status, color }) {
  const map = {
    blue:    'bg-blue-100  text-cris-blue  dark:bg-blue-900/40  dark:text-cris-blue-light',
    amber:   'bg-amber-100 text-amber-700  dark:bg-amber-900/40 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  }
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${map[color] || map.blue}`}>
      {status}
    </span>
  )
}

function MatIcon({ state }) {
  if (state === 'ok')    return <CheckCircle  size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
  if (state === 'warn')  return <AlertCircle  size={14} className="text-amber-500   flex-shrink-0 mt-0.5" />
  return                        <XCircle      size={14} className="text-red-500     flex-shrink-0 mt-0.5" />
}

function PipelineBoard({ inView }) {
  const { t } = useTranslation()
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/40 dark:shadow-cris-blue/5">
      {/* Toolbar */}
      <div className="bg-slate-800 dark:bg-slate-900 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-sm font-mono text-slate-300 tracking-wide">
            APS 智慧排程
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 tracking-widest">CONCEPT</span>
      </div>

      {/* Board */}
      <div className="bg-slate-100 dark:bg-slate-950 p-5 overflow-x-auto">
        <div className="grid grid-cols-3 gap-4 min-w-[680px]">

          {/* ── Column 1: 訂單進度 ── */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
              <Package size={11} /> {t('aps.pipeline_orders_col')}
            </div>
            <div className="space-y-3">
              {pipelineOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -28, y: 14 }}
                  animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ type: 'spring', stiffness: 240, damping: 24, delay: 0.08 + i * 0.13 }}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-mono text-slate-400">{order.id}</span>
                    <StatusPill status={order.status} color={order.statusClr} />
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2.5">{order.name}</p>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
                    <motion.div
                      className={`h-full rounded-full ${order.statusClr === 'emerald' ? 'bg-emerald-500' : 'bg-cris-blue'}`}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${order.progress}%` } : {}}
                      transition={{ duration: 1.1, delay: 0.35 + i * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>{order.progress}% 完成</span>
                    <span>交期 {order.due}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Column 2: 機台負荷 ── */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
              <Cpu size={11} /> {t('aps.pipeline_machine_col')}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: 'spring', stiffness: 220, damping: 24, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3.5"
            >
              {machineLoads.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400">{m.id}</span>
                    <span className={`text-[10px] font-bold tabular-nums ${m.warn ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400'}`}>
                      {m.load}% {m.warn && '⚡'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${m.warn ? 'bg-amber-400' : 'bg-cris-blue'}`}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${m.load}%` } : {}}
                      transition={{ duration: 1.1, delay: 0.45 + i * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[9px] text-slate-400 flex justify-between">
                <span>{t('aps.pipeline_avg_load')}</span>
                <span className="font-bold text-cris-blue dark:text-cris-blue-light">65.6%</span>
              </div>
            </motion.div>
          </div>

          {/* ── Column 3: 物料狀態 ── */}
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">
              <Archive size={11} /> {t('aps.pipeline_material_col')}
            </div>
            <div className="space-y-2.5">
              {materialStatus.map((mat, i) => (
                <motion.div
                  key={mat.name}
                  initial={{ opacity: 0, x: 28, y: 14 }}
                  animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ type: 'spring', stiffness: 240, damping: 24, delay: 0.12 + i * 0.12 }}
                  className={`bg-white dark:bg-slate-800 rounded-xl border p-3 flex items-start gap-2.5
                    ${mat.state === 'ok'    ? 'border-emerald-200 dark:border-emerald-900/40' : ''}
                    ${mat.state === 'warn'  ? 'border-amber-200   dark:border-amber-900/40'   : ''}
                    ${mat.state === 'error' ? 'border-red-200     dark:border-red-900/40'     : ''}
                  `}
                >
                  <MatIcon state={mat.state} />
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">{mat.name}</p>
                    <p className={`text-[10px] mt-0.5
                      ${mat.state === 'ok'    ? 'text-emerald-600 dark:text-emerald-400' : ''}
                      ${mat.state === 'warn'  ? 'text-amber-600   dark:text-amber-400'   : ''}
                      ${mat.state === 'error' ? 'text-red-500     dark:text-red-400'     : ''}
                    `}>{mat.qty}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function KpiCard({ kpi, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 240, damping: 22, delay: index * 0.1 }}
      className="text-center p-6 rounded-2xl border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800/50
        hover:border-cris-blue/20 hover:shadow-lg hover:shadow-cris-blue/8 transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`text-5xl md:text-6xl font-extrabold tabular-nums ${kpi.color}`}>{kpi.value}</div>
      <div className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{kpi.label}</div>
      <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{kpi.sublabel}</div>
    </motion.div>
  )
}

function PainCard({ item, index }) {
  const { t } = useTranslation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = item.icon
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 240, damping: 22, delay: index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
    >
      <div className="bg-red-50 dark:bg-red-950/30 p-6 border-r-0 md:border-r border-b md:border-b-0 border-red-100 dark:border-red-900/40">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-red-500" />
          <span className="text-[10px] font-semibold text-red-500 uppercase tracking-widest">{t('aps.pain_before')}</span>
        </div>
        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{item.pain}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.pain_desc}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 p-6">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={14} className="text-emerald-500" />
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('aps.pain_after')}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Icon size={14} className="text-cris-blue dark:text-cris-blue-light flex-shrink-0" />
          <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.solution}</h4>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.solution_desc}</p>
      </div>
    </motion.div>
  )
}

function FeatureCard({ feature, index }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 240, damping: 22, delay: (index % 3) * 0.1 }}
      className={`card cursor-pointer select-none ${open ? 'ring-2 ring-cris-blue dark:ring-cris-blue-light' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors duration-200 ${
            open ? 'bg-cris-blue text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-cris-blue dark:text-cris-blue-light'
          }`}>
            <Icon size={22} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{feature.short}</p>
          </div>
        </div>
        <div className="flex-shrink-0 mt-1 text-slate-400 dark:text-slate-500">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
              <pre className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {feature.detail}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function APSProduct() {
  const { t } = useTranslation()
  const cmsHeroDesc = useCmsContent('aps', 'hero_desc')

  const tags       = t('aps.tags',        { returnObjects: true })
  const quickStats = t('aps.quick_stats', { returnObjects: true })
  const kpiData    = t('aps.kpis',        { returnObjects: true })
  const painPoints = t('aps.pain_points', { returnObjects: true }).map((item, i) => ({
    ...item,
    icon: painPointIcons[i],
  }))
  const features   = t('aps.features',   { returnObjects: true }).map((item, i) => ({
    ...item,
    icon: featureIcons[i],
  }))
  const cases      = t('aps.cases',      { returnObjects: true })

  // KPI colors (positional, not translated)
  const kpiColors = [
    'text-cris-blue dark:text-cris-blue-light',
    'text-violet-600 dark:text-violet-400',
    'text-emerald-600 dark:text-emerald-400',
    'text-amber-600 dark:text-amber-400',
  ]
  // KPI values (positional, not translated)
  const kpiValues = ['95%', '35%', '40%', '98%']

  // Case tag colors (positional, not translated)
  const caseTagColors = [
    'bg-blue-100 text-cris-blue dark:bg-blue-900/40 dark:text-cris-blue-light',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  ]

  // Case metrics values (positional, hardcoded visual values)
  const caseMetricValues = [
    ['97%', '5min', '35%'],
    ['58%', '84%', '40%'],
  ]

  const pipelineRef  = useRef(null)
  const pipelineInView = useInView(pipelineRef,  { once: true, margin: '-80px' })
  const kpiRef       = useRef(null)
  const kpiInView    = useInView(kpiRef,         { once: true, margin: '-80px' })
  const painRef      = useRef(null)
  const painInView   = useInView(painRef,        { once: true, margin: '-80px' })
  const featRef      = useRef(null)
  const featInView   = useInView(featRef,        { once: true, margin: '-80px' })
  const logoRef      = useRef(null)
  const logoInView   = useInView(logoRef,        { once: true, margin: '-60px' })
  const caseRef      = useRef(null)
  const caseInView   = useInView(caseRef,        { once: true, margin: '-80px' })

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden
        bg-gradient-to-br from-blue-50 via-white to-slate-100
        dark:bg-none dark:[background:linear-gradient(135deg,#0f172a_0%,#0a0f1e_60%,#000_100%)]">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.10]"
          style={{ backgroundImage: 'radial-gradient(circle, #0052D9 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* Light blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl opacity-60 pointer-events-none dark:opacity-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cris-blue/10 rounded-full blur-3xl opacity-50 pointer-events-none dark:opacity-0" />

        {/* Dark glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cris-blue/[0.07] rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100" />

        {/* Gear micro-icons */}
        {[
          { left: '6%',  top: '18%', size: 22, delay: 0,   dur: 12 },
          { left: '91%', top: '25%', size: 18, delay: 1.4, dur: 15 },
          { left: '88%', top: '68%', size: 14, delay: 0.7, dur: 10 },
          { left: '3%',  top: '74%', size: 20, delay: 2.1, dur: 13 },
          { left: '55%', top: '90%', size: 16, delay: 1.0, dur: 11 },
        ].map((g, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-[0.18] dark:opacity-[0.12]"
            style={{ left: g.left, top: g.top }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: 'linear' }}
          >
            <svg width={g.size} height={g.size} viewBox="0 0 24 24" fill="none" stroke="#0052D9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </motion.div>
        ))}

        {/* Tech lines */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none overflow-hidden opacity-[0.15] dark:opacity-[0.10]">
          <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
            <line x1="256" y1="0"   x2="0"   y2="256" stroke="#0052D9" strokeWidth="0.8" />
            <line x1="256" y1="48"  x2="48"  y2="256" stroke="#0052D9" strokeWidth="0.5" />
            <line x1="256" y1="96"  x2="96"  y2="256" stroke="#0052D9" strokeWidth="0.5" />
            <circle cx="220" cy="36" r="2.5" fill="#0052D9" opacity="0.8" />
            <circle cx="180" cy="76" r="1.8" fill="#0052D9" opacity="0.55" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-14"
          >
            <Link to="/" className="hover:text-cris-blue dark:hover:text-cris-blue-light transition-colors">{t('navbar.home')}</Link>
            <span>/</span>
            <span>{t('navbar.products')}</span>
            <span>/</span>
            <span className="text-cris-blue dark:text-cris-blue-light">{t('aps.breadcrumb')}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8
                bg-blue-100 border border-blue-200 text-cris-blue
                dark:bg-white/5 dark:border-white/10 dark:text-cris-blue-light">
                <span className="w-1.5 h-1.5 rounded-full bg-cris-blue dark:bg-cris-blue-light animate-pulse" />
                <span className="text-xs font-medium tracking-wide">{t('aps.badge')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight">
                <span className="text-slate-900 dark:text-white">{t('aps.product_name')} </span>
                <span className="text-gradient-anim">{t('aps.product_name_gradient')}</span>
              </h1>
              <p className="mt-3 text-2xl font-semibold text-slate-700 dark:text-white/80 leading-snug">
                {t('aps.product_subtitle')}
              </p>

              <div className="mt-7 text-base text-slate-600 dark:text-slate-400 leading-[1.8] max-w-lg">
                {cmsHeroDesc
                  ? <span dangerouslySetInnerHTML={{ __html: cmsHeroDesc }} />
                  : t('aps.product_desc')}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-cris-blue hover:bg-cris-blue-dark active:scale-[0.97] text-white font-semibold rounded-lg transition-all duration-200 text-sm
                    shadow-lg shadow-cris-blue/25 hover:shadow-xl hover:shadow-cris-blue/35 hover:-translate-y-0.5"
                >
                  {t('aps.cta_primary')} <ArrowRight size={16} />
                </Link>
                <a
                  href="#pipeline"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-lg transition-all duration-200 text-sm active:scale-[0.97]
                    border border-slate-300 text-slate-600 hover:border-cris-blue hover:text-cris-blue
                    dark:border-slate-700 dark:text-slate-400 dark:hover:border-cris-blue/60 dark:hover:text-cris-blue-light"
                >
                  {t('aps.cta_secondary')} <ChevronDown size={16} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag}
                    className="px-2.5 py-1 rounded text-[11px] font-medium
                      bg-white border border-slate-200 text-slate-500
                      dark:bg-white/5 dark:border-white/10 dark:text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: APS Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
              className="flex items-center justify-center"
            >
              <motion.div
                className="relative w-full rounded-2xl p-4
                  border border-blue-100 bg-white/80 backdrop-blur-md shadow-xl shadow-blue-100/60
                  dark:border-white/10 dark:bg-white/5 dark:shadow-none"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={import.meta.env.BASE_URL + 'APS.png'}
                  alt="IMPACTs APS 排程系統截圖"
                  className="w-full rounded-xl"
                  style={{ boxShadow: '0 0 50px -12px rgba(0,82,217,0.4)' }}
                />
                {/* Floating badge */}
                <motion.div
                  className="absolute -top-3 -right-3 bg-cris-blue text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-cris-blue/40"
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {t('aps.floating_badge')}
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Quick Stats Band ──────────────────────────────────────────────── */}
      <section className="py-0 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
            {quickStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 240, damping: 22, delay: i * 0.12 }}
                className="flex-1 px-8 py-8 text-center"
              >
                <div className="text-5xl font-extrabold text-gradient-anim tabular-nums">{s.value}</div>
                <div className="mt-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">{s.label}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pipeline Intelligence ─────────────────────────────────────────── */}
      <section id="pipeline" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={pipelineRef}
            initial={{ opacity: 0, y: 20 }}
            animate={pipelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
                  {t('aps.pipeline_tag')}
                </span>
                <h2 className="section-title mt-2">{t('aps.pipeline_title')}</h2>
                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                  {t('aps.pipeline_subtitle')}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 italic">
                {t('aps.pipeline_note')}
              </div>
            </div>
          </motion.div>

          <PipelineBoard inView={pipelineInView} />
        </div>
      </section>

      {/* ── Integration Logo Wall ─────────────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={logoRef}
            initial={{ opacity: 0, y: 16 }}
            animate={logoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="text-center mb-10"
          >
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t('aps.integration_tag')}</p>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">{t('aps.integration_title')}</h3>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {integrationPartners.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={logoInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: 'spring', stiffness: 280, damping: 22, delay: i * 0.07 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                  border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800
                  hover:border-cris-blue/30 hover:bg-white dark:hover:border-cris-blue/30 dark:hover:bg-slate-700
                  transition-all duration-200 cursor-default group"
              >
                <span className="w-2 h-2 rounded-full bg-cris-blue/50 group-hover:bg-cris-blue transition-colors duration-200" />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200">
                  {p.name}
                </span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {p.cat}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={logoInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center text-xs text-slate-400 dark:text-slate-600 mt-8"
          >
            {t('aps.integration_note')}
          </motion.p>
        </div>
      </section>

      {/* ── Detailed KPIs ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={kpiRef}
            initial={{ opacity: 0, y: 16 }}
            animate={kpiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('aps.kpi_tag')}
            </span>
            <h2 className="section-title mt-3">{t('aps.kpi_title')}</h2>
            <p className="section-subtitle">
              {t('aps.kpi_subtitle')}
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {kpiData.map((kpi, i) => (
              <KpiCard
                key={kpi.label}
                kpi={{ ...kpi, value: kpiValues[i], color: kpiColors[i] }}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pain vs Solution ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={painRef}
            initial={{ opacity: 0, y: 16 }}
            animate={painInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('aps.pain_tag')}
            </span>
            <h2 className="section-title mt-3">{t('aps.pain_title')}</h2>
            <p className="section-subtitle">
              {t('aps.pain_subtitle')}
            </p>
          </motion.div>
          <div className="space-y-6">
            {painPoints.map((item, i) => (
              <PainCard key={item.pain} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={featRef}
            initial={{ opacity: 0, y: 16 }}
            animate={featInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            className="text-center mb-4"
          >
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('aps.feat_tag')}
            </span>
            <h2 className="section-title mt-3">{t('aps.feat_title')}</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={featInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-cris-blue dark:text-cris-blue-light px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800">
              {t('aps.feat_hint')}
            </span>
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Stories ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={caseRef}
            initial={{ opacity: 0, y: 20 }}
            animate={caseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">{t('aps.cases_tag')}</span>
            <h2 className="section-title mt-3">{t('aps.cases_title')}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((c, i) => (
              <motion.div
                key={c.company}
                initial={{ opacity: 0, y: 30 }}
                animate={caseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${caseTagColors[i]} mb-3`}>{c.tag}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">{c.company}</h3>

                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">挑戰</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-wider mb-1">成效</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.result}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {[c.m0_label, c.m1_label, c.m2_label].map((label, j) => (
                      <div key={label} className="text-center">
                        <div className="text-xl font-extrabold text-gradient-anim tabular-nums">{caseMetricValues[i][j]}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-cris-blue dark:bg-cris-blue-dark">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {t('aps.cta_title')}
            </h2>
            <p className="mt-5 text-lg text-blue-100 leading-relaxed">
              {t('aps.cta_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cris-blue font-bold rounded-lg
                  hover:bg-blue-50 active:scale-[0.97] transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-base"
              >
                {t('aps.cta_btn')} <ArrowRight size={18} />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-lg
                  hover:border-white hover:bg-white/10 active:scale-[0.97] transition-all duration-200 text-base"
              >
                {t('aps.cta_back')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
