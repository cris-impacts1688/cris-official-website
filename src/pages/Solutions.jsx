import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart2, HeadphonesIcon, Wrench,
  CheckCircle2, ArrowRight, Zap, Brain, Activity,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useCmsPageContent } from '../hooks/useCmsContent'
import CaseStudies from '../components/CaseStudies'
import GovProgramCases from '../components/GovProgramCases'

// ─── Neural network nodes ─────────────────────────────────────────────────────
const nodes = [
  { id: 1, cx: 80,  cy: 60  },
  { id: 2, cx: 160, cy: 30  },
  { id: 3, cx: 240, cy: 80  },
  { id: 4, cx: 120, cy: 130 },
  { id: 5, cx: 200, cy: 155 },
  { id: 6, cx: 290, cy: 50  },
  { id: 7, cx: 50,  cy: 160 },
  { id: 8, cx: 320, cy: 130 },
]
const edges = [
  [1,2],[2,3],[3,6],[1,4],[2,4],[4,5],[3,5],[5,8],[6,8],[4,7],[7,5],[2,6]
]

// ─── Floating AI chip icons ───────────────────────────────────────────────────
const floatingItems = [
  { id: 'a', x: '8%',  y: '18%', size: 44, delay: 0,   dur: 8  },
  { id: 'b', x: '88%', y: '12%', size: 36, delay: 1.2, dur: 10 },
  { id: 'c', x: '92%', y: '68%', size: 30, delay: 0.6, dur: 9  },
  { id: 'd', x: '5%',  y: '72%', size: 38, delay: 1.8, dur: 11 },
  { id: 'e', x: '78%', y: '80%', size: 26, delay: 0.9, dur: 7  },
]

function NeuralNet({ side }) {
  return (
    <svg
      viewBox="0 0 370 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute top-1/2 -translate-y-1/2 w-80 opacity-[0.10] dark:opacity-[0.08] pointer-events-none ${
        side === 'left' ? 'left-0' : 'right-0 scale-x-[-1]'
      }`}
    >
      {edges.map(([a, b], i) => {
        const na = nodes.find(n => n.id === a)
        const nb = nodes.find(n => n.id === b)
        return (
          <line
            key={i}
            x1={na.cx} y1={na.cy}
            x2={nb.cx} y2={nb.cy}
            stroke="#0052D9" strokeWidth="1"
          />
        )
      })}
      {nodes.map(n => (
        <g key={n.id}>
          <circle cx={n.cx} cy={n.cy} r="7" fill="#EFF6FF" stroke="#0052D9" strokeWidth="1.2" />
          <circle cx={n.cx} cy={n.cy} r="3" fill="#0052D9" />
        </g>
      ))}
    </svg>
  )
}

function AiChipSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="#0052D9" strokeWidth="1.3" strokeLinecap="round">
      <rect x="9" y="9" width="14" height="14" rx="2" />
      <rect x="12" y="12" width="8" height="8" rx="1" fill="#0052D9" fillOpacity="0.12" />
      <line x1="13" y1="9" x2="13" y2="5" /><line x1="16" y1="9" x2="16" y2="5" /><line x1="19" y1="9" x2="19" y2="5" />
      <line x1="13" y1="23" x2="13" y2="27" /><line x1="16" y1="23" x2="16" y2="27" /><line x1="19" y1="23" x2="19" y2="27" />
      <line x1="9" y1="13" x2="5" y2="13" /><line x1="9" y1="16" x2="5" y2="16" /><line x1="9" y1="19" x2="5" y2="19" />
      <line x1="23" y1="13" x2="27" y2="13" /><line x1="23" y1="16" x2="27" y2="16" /><line x1="23" y1="19" x2="27" y2="19" />
      <text x="16" y="17.5" textAnchor="middle" fontSize="4" fill="#0052D9" fontFamily="monospace" strokeWidth="0">AI</text>
    </svg>
  )
}

function TechHeroBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft blue gradient blobs */}
      <div className="absolute -top-20 left-1/4 w-[480px] h-[320px] bg-cris-blue/[0.05] dark:bg-cris-blue/[0.08] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-[360px] h-[260px] bg-blue-300/[0.07] dark:bg-blue-400/[0.06] rounded-full blur-[80px]" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.10]"
        style={{
          backgroundImage: 'radial-gradient(circle, #0052D9 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Neural network — left & right */}
      <NeuralNet side="left" />
      <NeuralNet side="right" />

      {/* Tech accent lines top-right (same as Hero) */}
      <div className="absolute top-0 right-0 w-60 h-60 opacity-[0.12] dark:opacity-[0.07]">
        <svg viewBox="0 0 240 240" fill="none" className="w-full h-full">
          <line x1="240" y1="0"  x2="0"  y2="240" stroke="#0052D9" strokeWidth="0.8" />
          <line x1="240" y1="40" x2="40" y2="240" stroke="#0052D9" strokeWidth="0.5" />
          <line x1="240" y1="80" x2="80" y2="240" stroke="#0052D9" strokeWidth="0.5" />
          <circle cx="204" cy="36" r="2.5" fill="#0052D9" opacity="0.9" />
          <circle cx="168" cy="72" r="1.8" fill="#0052D9" opacity="0.6" />
        </svg>
      </div>

      {/* Floating AI chip icons */}
      {floatingItems.map(item => (
        <motion.div
          key={item.id}
          className="absolute opacity-[0.18] dark:opacity-[0.13]"
          style={{ left: item.x, top: item.y }}
          animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
          transition={{ duration: item.dur, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AiChipSVG size={item.size} />
        </motion.div>
      ))}

      {/* Pulsing ring at centre-top */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-[340px] h-[340px] rounded-full border border-cris-blue/[0.10] dark:border-cris-blue/[0.14]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.2, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-24 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full border border-cris-blue/[0.14] dark:border-cris-blue/[0.18]"
        animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0.2, 0.6] }}
        transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

const modulesMeta = [
  {
    key: 'module_1',
    icon: BarChart2,
    iconBg: 'bg-blue-50 dark:bg-blue-900/30',
    iconColor: 'text-cris-blue dark:text-cris-blue-light',
    tagBg: 'bg-cris-blue/10 dark:bg-cris-blue/20',
    tagColor: 'text-cris-blue dark:text-cris-blue-light',
    barColor: 'bg-gradient-to-r from-cris-blue to-blue-400',
    badgeIcon: Zap,
  },
  {
    key: 'module_2',
    icon: HeadphonesIcon,
    iconBg: 'bg-violet-50 dark:bg-violet-900/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
    tagBg: 'bg-violet-100 dark:bg-violet-900/30',
    tagColor: 'text-violet-700 dark:text-violet-400',
    barColor: 'bg-gradient-to-r from-violet-500 to-purple-500',
    badgeIcon: Brain,
  },
  {
    key: 'module_3',
    icon: Wrench,
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    tagBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    tagColor: 'text-emerald-700 dark:text-emerald-400',
    barColor: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    badgeIcon: Activity,
  },
]

function ModuleCard({ meta, index, isInView, cms = {} }) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useTranslation()
  const Icon = meta.icon
  const BadgeIcon = meta.badgeIcon
  const features = t(`solutions.${meta.key}_features`, { returnObjects: true })

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="card group cursor-pointer hover:-translate-y-1"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top colour bar */}
      <div className={`h-1 w-full ${meta.barColor} rounded-t-2xl -mt-px -mx-px`} />

      <div className="p-8 pt-6">
        {/* Tag */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${meta.tagBg} ${meta.tagColor} mb-5`}>
          <BadgeIcon size={11} />
          {t(`solutions.${meta.key}_tag`)}
        </span>

        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl ${meta.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={24} className={meta.iconColor} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {t(`solutions.${meta.key}_title`)}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {t(`solutions.${meta.key}_subtitle`)}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          {cms[`${meta.key}_desc`]
            ? <span dangerouslySetInnerHTML={{ __html: cms[`${meta.key}_desc`] }} />
            : t(`solutions.${meta.key}_desc`)}
        </p>

        {/* Expandable features */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              {t('solutions.feature_label')}
            </p>
            <ul className="space-y-2.5">
              {Array.isArray(features) && features.map((feat, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={15} className="text-cris-blue dark:text-cris-blue-light mt-0.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {expanded ? t('solutions.collapse') : t('solutions.expand')}
            </span>
          </span>
          <Link
            to="/contact"
            className="btn-primary text-xs px-4 py-2 gap-1.5"
            onClick={e => e.stopPropagation()}
          >
            {t('solutions.cta_demo')} <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function Solutions() {
  const headerRef = useRef(null)
  const gridRef   = useRef(null)
  const ctaRef    = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })
  const gridInView   = useInView(gridRef,   { once: true, margin: '-60px' })
  const ctaInView    = useInView(ctaRef,    { once: true, margin: '-60px' })
  const { t } = useTranslation()
  const cms = useCmsPageContent('solutions')

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">

      {/* Header */}
      <section className="relative py-20 bg-white dark:bg-slate-900 overflow-hidden">
        <TechHeroBg />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('solutions.tag')}
            </span>
            <h1 className="section-title mt-3">{t('solutions.title')}</h1>
            <p className="section-subtitle">
              {cms.hero_subtitle
                ? <span dangerouslySetInnerHTML={{ __html: cms.hero_subtitle }} />
                : t('solutions.subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="btn-primary text-sm px-6 py-3">
                {t('solutions.cta_demo')} <ArrowRight size={16} />
              </Link>
              <Link to="/products/ai-box" className="btn-outline text-sm px-6 py-3">
                {t('solutions.cta_learn')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16">
        <div ref={gridRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modulesMeta.map((meta, i) => (
              <ModuleCard key={meta.key} meta={meta} index={i} isInView={gridInView} cms={cms} />
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <CaseStudies />

      {/* Gov Program Cases */}
      <GovProgramCases />

      {/* Bottom CTA band */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div ref={ctaRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
              {t('solutions.aibox_powered_by')}
            </span>
            <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
              {t('solutions.aibox_cta_title')}
            </h3>
            <p className="section-subtitle mt-3 text-sm">
              {t('solutions.aibox_cta_subtitle')}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact" className="btn-primary text-sm px-6 py-3">
                {t('solutions.aibox_cta_btn')} <ArrowRight size={16} />
              </Link>
              <Link to="/products/ai-box" className="btn-outline text-sm px-6 py-3">
                {t('solutions.aibox_learn_more')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
