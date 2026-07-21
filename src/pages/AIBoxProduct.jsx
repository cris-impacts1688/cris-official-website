import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCmsContent } from '../hooks/useCmsContent'
import {
  ShieldCheck, Zap, Cpu, TrendingDown,
  Bot, Database, BarChart2, Layers,
  Lock, DollarSign, Activity, GitBranch,
  ArrowRight, ChevronDown, CheckCircle2,
} from 'lucide-react'

// ─── Static icon maps (non-translatable) ─────────────────────────────────────

const featureIcons = [ShieldCheck, Zap, Cpu, TrendingDown]
const featureAccentLight = [
  'bg-blue-50 border-blue-100',
  'bg-violet-50 border-violet-100',
  'bg-blue-50 border-blue-100',
  'bg-emerald-50 border-emerald-100',
]
const featureAccentIcon = [
  'text-cris-blue bg-cris-blue/10',
  'text-violet-600 bg-violet-100',
  'text-cris-blue bg-cris-blue/10',
  'text-emerald-600 bg-emerald-100',
]

const moduleIcons = [Bot, Database, BarChart2, Layers]
const moduleGlow = [
  'hover:shadow-cris-blue/20',
  'hover:shadow-violet-500/20',
  'hover:shadow-emerald-500/20',
  'hover:shadow-amber-500/20',
]
const moduleBorder = [
  'hover:border-cris-blue/50',
  'hover:border-violet-400/50',
  'hover:border-emerald-400/50',
  'hover:border-amber-400/50',
]

const kpiIcons = [Lock, DollarSign, Activity, GitBranch]
const kpiValues = ['100%', '0 元', '99.9%', '∞']

// ─── AI Box CSS Visual ────────────────────────────────────────────────────────

function AIBoxVisual() {
  const bars = [
    { id: 'CPU', pct: 42, cls: 'bg-violet-500' },
    { id: 'RAM', pct: 68, cls: 'bg-violet-400' },
    { id: 'NET', pct: 31, cls: 'bg-emerald-500' },
  ]
  const rows = [
    { label: '▸ AI Agent', value: 'READY',  color: 'text-emerald-400' },
    { label: '▸ LLM',      value: '72B ✓',  color: 'text-violet-400' },
    { label: '▸ RAG Docs', value: '14,832', color: 'text-violet-300' },
    { label: '▸ GPU Util', value: '67%',    color: 'text-amber-400' },
  ]
  const leds = [
    { cls: 'bg-violet-500',  delay: 0 },
    { cls: 'bg-emerald-400', delay: 0.4 },
    { cls: 'bg-violet-400',  delay: 0.8 },
    { cls: 'bg-amber-400',   delay: 1.2 },
  ]
  const chips = [
    { label: 'CPU', right: '-14%', top: '18%' },
    { label: 'LLM', left:  '-12%', top: '38%' },
    { label: 'RAG', right: '-13%', bottom: '22%' },
  ]

  return (
    <div className="relative flex items-center justify-center h-[420px]">
      {/* Pulsing rings */}
      {[380, 300, 220].map((d, i) => (
        <motion.div
          key={d}
          className="absolute rounded-full border border-violet-500/15"
          style={{ width: d, height: d }}
          animate={{ opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 3.5 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
        />
      ))}

      {/* Device */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        {/* Breathing glow */}
        <motion.div
          className="absolute -inset-10 rounded-3xl bg-violet-500/20 blur-3xl"
          animate={{ opacity: [0.25, 0.7, 0.25], scale: [0.88, 1.05, 0.88] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Device body */}
        <div className="relative w-52 rounded-2xl border border-violet-500/50 bg-gradient-to-b from-slate-800 to-slate-950 shadow-2xl shadow-violet-600/30 overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
            <img src={import.meta.env.BASE_URL + 'Logo_CRIS.png'} alt="" className="h-4 brightness-0 invert opacity-60" />
            <span className="flex items-center gap-1.5">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[9px] font-mono text-emerald-400 tracking-widest">ONLINE</span>
            </span>
          </div>

          {/* Stats display */}
          <div className="mx-3 my-3 rounded-lg bg-slate-950 border border-violet-500/20 p-3 space-y-1.5">
            {rows.map((r) => (
              <div key={r.label} className="flex justify-between text-[9px] font-mono">
                <span className="text-slate-500">{r.label}</span>
                <span className={r.color}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="px-3 pb-3 space-y-1.5">
            {bars.map((b) => (
              <div key={b.id} className="flex items-center gap-2">
                <span className="text-[8px] font-mono text-slate-500 w-6">{b.id}</span>
                <div className="flex-1 h-[3px] bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${b.cls} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 1.6, ease: 'easeOut', delay: 0.9 }}
                  />
                </div>
                <span className="text-[8px] font-mono text-slate-500">{b.pct}%</span>
              </div>
            ))}
          </div>

          {/* LED row */}
          <div className="flex justify-center gap-2.5 pb-4">
            {leds.map((l, i) => (
              <motion.span
                key={i}
                className={`w-2 h-2 rounded-full ${l.cls}`}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: l.delay }}
              />
            ))}
          </div>
        </div>

        {/* Floating satellite chips */}
        {chips.map((c, i) => (
          <motion.div
            key={c.label}
            className="absolute z-20 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-white/10 backdrop-blur-sm text-[10px] font-mono font-bold text-violet-400 shadow-lg"
            style={{ right: c.right, left: c.left, top: c.top, bottom: c.bottom }}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4 + i * 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.7 }}
          >
            {c.label}
          </motion.div>
        ))}
      </motion.div>

      {/* Dashed connection lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
        <svg className="w-full h-full" viewBox="0 0 400 420" fill="none">
          <line x1="200" y1="210" x2="335" y2="130" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5 4" />
          <line x1="200" y1="210" x2="60"  y2="175" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5 4" />
          <line x1="200" y1="210" x2="340" y2="310" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5 4" />
        </svg>
      </div>
    </div>
  )
}

// ─── Animation helpers ─────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 250, damping: 22, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIBoxProduct() {
  const { t } = useTranslation()
  const cmsHeroDesc = useCmsContent('aibox', 'hero_desc')
  const modulesRef = useRef(null)
  const modulesInView = useInView(modulesRef, { once: true, margin: '-60px' })
  const kpiRef = useRef(null)
  const kpiInView = useInView(kpiRef, { once: true, margin: '-60px' })

  const coreFeatures = t('aibox.core_features', { returnObjects: true })
  const modules = t('aibox.modules', { returnObjects: true })
  const kpis = t('aibox.kpis', { returnObjects: true })
  const tags = t('aibox.tags', { returnObjects: true })

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden
        bg-gradient-to-br from-violet-50 via-white to-slate-100
        dark:bg-none dark:[background:linear-gradient(135deg,#0f172a_0%,#0d0a1e_60%,#000_100%)]">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.10]"
          style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* Light blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none dark:opacity-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl opacity-50 pointer-events-none dark:opacity-0" />

        {/* Dark glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.07] rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100" />

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
            <svg width={g.size} height={g.size} viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </motion.div>
        ))}

        {/* Tech accent lines */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none overflow-hidden opacity-[0.15] dark:opacity-[0.10]">
          <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
            <line x1="256" y1="0"  x2="0"   y2="256" stroke="#7c3aed" strokeWidth="0.8" />
            <line x1="256" y1="48" x2="48"  y2="256" stroke="#7c3aed" strokeWidth="0.5" />
            <line x1="256" y1="96" x2="96"  y2="256" stroke="#7c3aed" strokeWidth="0.5" />
            <circle cx="220" cy="36" r="2.5" fill="#7c3aed" opacity="0.8" />
            <circle cx="180" cy="76" r="1.8" fill="#7c3aed" opacity="0.55" />
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
            <Link to="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-slate-500 dark:text-slate-500">{t('navbar.home')}</Link>
            <span>/</span>
            <span>{t('navbar.products')}</span>
            <span>/</span>
            <span className="text-violet-600 dark:text-violet-400">{t('aibox.breadcrumb')}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8
                bg-violet-100 border border-violet-200 text-violet-700
                dark:bg-white/5 dark:border-white/10 dark:text-violet-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium tracking-wide">{t('aibox.badge')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight">
                <span className="text-slate-900 dark:text-white">{t('aibox.product_name')} </span>
                <span className="text-gradient-violet-anim">{t('aibox.product_name_gradient')}</span>
              </h1>
              <p className="mt-3 text-2xl font-semibold text-slate-700 dark:text-white/80">
                {t('aibox.product_subtitle')}
              </p>

              <div className="mt-7 text-base text-slate-600 dark:text-slate-400 leading-[1.8] max-w-lg">
                {cmsHeroDesc ? (
                  <span dangerouslySetInnerHTML={{ __html: cmsHeroDesc }} />
                ) : (
                  <>賦能企業具備<span className="text-slate-900 dark:text-slate-100 font-semibold">{t('aibox.product_desc_part1')}</span>與<span className="text-slate-900 dark:text-slate-100 font-semibold">{t('aibox.product_desc_part2')}</span>的完整 AI 生態。從私有部署到數位員工調度，一機解決企業 AI 轉型的全部需求。</>
                )}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.97] text-white font-semibold rounded-lg transition-all duration-200 text-sm
                    shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/35 hover:-translate-y-0.5"
                >
                  {t('aibox.cta_primary')} <ArrowRight size={16} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-lg transition-all duration-200 text-sm active:scale-[0.97]
                    border border-slate-300 text-slate-600 hover:border-violet-500 hover:text-violet-600
                    dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-500/60 dark:hover:text-violet-400"
                >
                  {t('aibox.cta_secondary')} <ChevronDown size={16} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded text-[11px] font-medium
                      bg-white border border-slate-200 text-slate-500
                      dark:bg-white/5 dark:border-white/10 dark:text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: AI Box Visual */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
              className="relative"
            >
              <AIBoxVisual />
              <motion.div
                className="absolute -bottom-3 right-8 bg-violet-600 dark:bg-violet-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg shadow-violet-300 dark:shadow-violet-900/60"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, type: 'spring', stiffness: 280 }}
              >
                {t('aibox.floating_badge')}
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Core Features ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-20">
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('aibox.feat_tag')}
            </span>
            <h2 className="section-title mt-3">{t('aibox.feat_title')}</h2>
            <p className="section-subtitle">
              {t('aibox.feat_subtitle')}
            </p>
          </FadeUp>

          <div className="space-y-24">
            {coreFeatures.map((feat, index) => {
              const Icon = featureIcons[index]
              const isEven = index % 2 === 1
              return (
                <FadeUp key={feat.title} delay={0.05}>
                  <div className={`flex flex-col lg:flex-row gap-12 items-center ${isEven ? 'lg:flex-row-reverse' : ''}`}>

                    {/* Text side */}
                    <div className="flex-1">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5
                        ${featureAccentLight[index]} border dark:bg-transparent dark:border-white/10 dark:text-slate-400`}>
                        {feat.badge}
                      </span>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                        {feat.title}
                      </h3>
                      <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                        {feat.desc}
                      </p>
                      <ul className="mt-6 space-y-3">
                        {feat.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-3">
                            <CheckCircle2 size={18} className="text-cris-blue dark:text-cris-blue-light mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Visual side */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className={`relative w-full max-w-sm h-56 rounded-2xl border flex items-center justify-center overflow-hidden
                        ${featureAccentLight[index]} dark:border-white/10 dark:bg-white/[0.03]`}>
                        {/* Bg icon */}
                        <Icon size={120} className="absolute right-4 bottom-0 opacity-[0.06] text-slate-900 dark:text-white" strokeWidth={1} />
                        {/* Foreground */}
                        <div className="relative z-10 text-center">
                          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${featureAccentIcon[index]} dark:bg-white/10 dark:text-cris-blue-light mb-4`}>
                            <Icon size={30} />
                          </div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{feat.title}</p>
                        </div>
                        {/* Corner accent */}
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cris-blue/30 dark:bg-cris-blue/50" />
                        <div className="absolute top-3 right-7 w-1.5 h-1.5 rounded-full bg-cris-blue/20 dark:bg-cris-blue/30" />
                      </div>
                    </div>

                  </div>
                </FadeUp>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Key Modules (Glassmorphism) ────────────────────────────────────── */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <span className="text-sm font-semibold text-cris-blue-light uppercase tracking-widest">
              {t('aibox.modules_tag')}
            </span>
            <h2 className="section-title mt-3 text-white">{t('aibox.modules_title')}</h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {t('aibox.modules_subtitle')}
            </p>
          </FadeUp>

          {/* Dot grid overlay for this section */}
          <div className="relative">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage: 'radial-gradient(circle, #4C86E3 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            <motion.div
              ref={modulesRef}
              className="relative grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {modules.map((mod, i) => {
                const Icon = moduleIcons[i]
                return (
                  <motion.div
                    key={mod.title}
                    initial={{ opacity: 0, y: 32 }}
                    animate={modulesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 240, damping: 22, delay: i * 0.1 }}
                    className={`group relative rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6
                      hover:bg-white/[0.07] hover:shadow-xl transition-all duration-300 cursor-default
                      ${moduleGlow[i]} ${moduleBorder[i]}`}
                  >
                    {/* Hover glow border effect */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      ring-1 ring-cris-blue/30 shadow-inner" />

                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center mb-5
                        group-hover:bg-cris-blue/20 group-hover:border-cris-blue/30 transition-all duration-300">
                        <Icon size={22} className="text-slate-300 group-hover:text-cris-blue-light transition-colors duration-300" />
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 leading-snug">{mod.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-5">{mod.desc}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {mod.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-medium
                              bg-white/5 border border-white/10 text-slate-500
                              group-hover:border-white/20 group-hover:text-slate-400 transition-colors duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Strategic Benefits / KPIs ──────────────────────────────────────── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-16">
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('aibox.kpi_tag')}
            </span>
            <h2 className="section-title mt-3">{t('aibox.kpi_title')}</h2>
            <p className="section-subtitle">
              {t('aibox.kpi_subtitle')}
            </p>
          </FadeUp>

          <motion.div
            ref={kpiRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {kpis.map((kpi, i) => {
              const Icon = kpiIcons[i]
              return (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, y: 28 }}
                  animate={kpiInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ type: 'spring', stiffness: 250, damping: 22, delay: i * 0.1 }}
                  className="group text-center p-8 rounded-2xl border border-slate-100 dark:border-slate-700/60
                    bg-white dark:bg-slate-800/60 hover:border-cris-blue/30 dark:hover:border-cris-blue/40
                    hover:shadow-lg hover:shadow-cris-blue/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cris-blue/10 dark:bg-cris-blue/15 flex items-center justify-center mx-auto mb-5
                    group-hover:bg-cris-blue/15 dark:group-hover:bg-cris-blue/25 transition-colors duration-300">
                    <Icon size={26} className="text-cris-blue dark:text-cris-blue-light" />
                  </div>
                  <div className="text-4xl font-bold text-gradient-anim tabular-nums mb-2">
                    {kpiValues[i]}
                  </div>
                  <div className="text-base font-semibold text-slate-800 dark:text-slate-100 mb-1">{kpi.label}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{kpi.desc}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-cris-blue dark:bg-cris-blue-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {t('aibox.cta_title')}
            </h2>
            <p className="mt-5 text-lg text-blue-100 leading-relaxed">
              {t('aibox.cta_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cris-blue font-bold rounded-lg
                  hover:bg-blue-50 active:scale-[0.97] transition-all duration-200 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-base"
              >
                {t('aibox.cta_btn')} <ArrowRight size={18} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-lg
                  hover:border-white hover:bg-white/10 active:scale-[0.97] transition-all duration-200 text-base"
              >
                {t('aibox.cta_back')}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

    </div>
  )
}
