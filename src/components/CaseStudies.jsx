import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { AlertCircle, Lightbulb, TrendingUp, X, Server, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CASES_META, CATEGORIES, ICON_MAP } from '../constants/cases'
import { supabase } from '../lib/supabase'

// ─── Filter tabs ──────────────────────────────────────────────────────────────

const FILTER_KEYS = ['all', 'finance', 'support', 'manufacturing', 'green', 'special']

function FilterPills({ active, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {FILTER_KEYS.map(key => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-cris-blue text-white shadow-md shadow-cris-blue/25'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cris-blue hover:text-cris-blue dark:hover:text-cris-blue-light'
            }`}
          >
            {t(`cases.filter_${key}`)}
          </button>
        )
      })}
    </div>
  )
}

// ─── Case card ────────────────────────────────────────────────────────────────

function CaseCard({ meta, data, index, isInView, onClick }) {
  const { t } = useTranslation()
  const Icon = meta.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
      layout
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-md hover:border-cris-blue/30 dark:hover:border-cris-blue/30 transition-all duration-200"
    >
      {/* Subtle top accent line */}
      <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-700 group-hover:bg-cris-blue transition-colors duration-200" />

      <div className="p-6">
        {/* Category tag */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
            <Icon size={11} strokeWidth={2} />
            {t(`cases.filter_${meta.category}`)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 leading-snug">
          {data.title}
        </h3>

        {/* Challenge → Solution → Benefit summary */}
        <ul className="space-y-2.5">
          <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
            <AlertCircle size={14} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{data.challenge}</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-slate-500 dark:text-slate-400">
            <Lightbulb size={14} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{data.solution}</span>
          </li>
          <li className="flex items-start gap-2.5 text-sm text-cris-blue dark:text-cris-blue-light font-medium">
            <TrendingUp size={14} className="mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{data.benefit}</span>
          </li>
        </ul>

        {/* Hover reveal CTA */}
        <div className="mt-5 flex items-center justify-end">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-cris-blue dark:text-cris-blue-light opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {t('cases.view_detail')} <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function CaseModal({ meta, data, onClose }) {
  const { t } = useTranslation()
  const cat = meta ? CATEGORIES[meta.category] : null
  const Icon = meta ? meta.icon : null

  return (
    <AnimatePresence>
      {meta && data && cat && Icon && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="h-0.5 w-full bg-cris-blue rounded-t-2xl" />

            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600 mb-2">
                      <Icon size={10} strokeWidth={2} />
                      {t(`cases.filter_${meta.category}`)}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                      {data.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label={t('cases.close')}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                >
                  <X size={15} className="text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Private deployment badge */}
              <div className="flex items-center gap-2.5 bg-cris-blue/[0.07] dark:bg-cris-blue/[0.12] border border-cris-blue/20 dark:border-cris-blue/30 rounded-xl px-4 py-3 mb-6">
                <Server size={15} className="text-cris-blue dark:text-cris-blue-light flex-shrink-0" />
                <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light">
                  {t('cases.appliance_badge')}
                </span>
              </div>

              {/* Detail sections */}
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={13} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t('cases.challenge_label')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.detail_challenge}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={13} className="text-slate-400 dark:text-slate-500" />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t('cases.solution_label')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {data.detail_solution}
                  </p>
                </div>

                <div className="rounded-xl bg-cris-blue/[0.05] dark:bg-cris-blue/[0.10] border border-cris-blue/20 dark:border-cris-blue/30 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={13} className="text-cris-blue dark:text-cris-blue-light" />
                    <span className="text-xs font-bold text-cris-blue dark:text-cris-blue-light uppercase tracking-wider">
                      {t('cases.benefit_label')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {data.detail_benefit}
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="btn-primary text-sm px-5 py-2.5 gap-1.5 flex-1 justify-center"
                  onClick={onClose}
                >
                  {t('solutions.cta_demo')} <ArrowRight size={14} />
                </Link>
                <button
                  onClick={onClose}
                  className="btn-outline text-sm px-5 py-2.5 flex-1 justify-center cursor-pointer"
                >
                  {t('cases.close')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function CaseStudies() {
  const { t, i18n } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)
  const [dbRows, setDbRows] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    supabase.from('cases').select('*').order('sort_order', { ascending: true })
      .then(({ data }) => setDbRows(data || []))
  }, [])

  const langSuffix = i18n.language === 'zh-TW' ? '_tw'
    : i18n.language === 'zh-CN' ? '_cn' : '_en'

  const { caseMeta, caseItems } = useMemo(() => {
    if (!dbRows || dbRows.length === 0) {
      const fallbackItems = t('cases.items', { returnObjects: true })
      return { caseMeta: CASES_META, caseItems: Array.isArray(fallbackItems) ? fallbackItems : [] }
    }
    return {
      caseMeta: dbRows.map((row, idx) => ({
        id: idx,
        category: row.category,
        icon: ICON_MAP[row.icon_name] || ICON_MAP.TrendingUp,
      })),
      caseItems: dbRows.map(row => ({
        title:            row[`title${langSuffix}`]            || row.title_tw,
        challenge:        row[`challenge${langSuffix}`]        || row.challenge_tw,
        solution:         row[`solution${langSuffix}`]         || row.solution_tw,
        benefit:          row[`benefit${langSuffix}`]          || row.benefit_tw,
        detail_challenge: row[`detail_challenge${langSuffix}`] || row.detail_challenge_tw,
        detail_solution:  row[`detail_solution${langSuffix}`]  || row.detail_solution_tw,
        detail_benefit:   row[`detail_benefit${langSuffix}`]   || row.detail_benefit_tw,
      })),
    }
  }, [dbRows, langSuffix, t])

  const items = caseItems

  const filtered = caseMeta.filter(
    m => activeFilter === 'all' || m.category === activeFilter
  )

  const selectedMeta = selectedId !== null ? caseMeta[selectedId] : null
  const selectedData = selectedId !== null && Array.isArray(items) ? items[selectedId] : null

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
            {t('cases.section_tag')}
          </span>
          <h2 className="section-title mt-3">{t('cases.section_title')}</h2>
          <p className="section-subtitle">{t('cases.section_subtitle')}</p>
        </motion.div>

        {/* Filter */}
        <FilterPills active={activeFilter} onChange={setActiveFilter} />

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((meta, displayIdx) => {
              const data = Array.isArray(items) ? items[meta.id] : null
              if (!data) return null
              return (
                <motion.div
                  key={meta.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                >
                  <CaseCard
                    meta={meta}
                    data={data}
                    index={displayIdx}
                    isInView={isInView}
                    onClick={() => setSelectedId(meta.id)}
                  />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* Modal */}
      <CaseModal
        meta={selectedMeta}
        data={selectedData}
        onClose={() => setSelectedId(null)}
      />
    </section>
  )
}
