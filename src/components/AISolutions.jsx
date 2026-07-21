import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart2, HeadphonesIcon, Wrench,
  CheckCircle2, ArrowRight, Zap, Brain, Activity,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

function ModuleCard({ meta, index, isInView }) {
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
      <div className={`h-1 w-full ${meta.barColor} rounded-t-2xl -mt-px -mx-px`} />

      <div className="p-7 pt-6">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${meta.tagBg} ${meta.tagColor} mb-5`}>
          <BadgeIcon size={11} />
          {t(`solutions.${meta.key}_tag`)}
        </span>

        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl ${meta.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={24} className={meta.iconColor} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t(`solutions.${meta.key}_title`)}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t(`solutions.${meta.key}_subtitle`)}
            </p>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          {t(`solutions.${meta.key}_desc`)}
        </p>

        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              {t('solutions.feature_label')}
            </p>
            <ul className="space-y-2">
              {Array.isArray(features) && features.map((feat, fi) => (
                <li key={fi} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <CheckCircle2 size={14} className="text-cris-blue dark:text-cris-blue-light mt-0.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-slate-400">{expanded ? '收起 ↑' : '展開功能 ↓'}</span>
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

export default function AISolutions() {
  const ref = useRef(null)
  const gridRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' })
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
            {t('solutions.tag')}
          </span>
          <h2 className="section-title mt-3">{t('solutions.title')}</h2>
          <p className="section-subtitle">{t('solutions.subtitle')}</p>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modulesMeta.map((meta, i) => (
            <ModuleCard key={meta.key} meta={meta} index={i} isInView={gridInView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={gridInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 text-center"
        >
          <Link to="/solutions" className="btn-outline">
            {t('solutions.cta_learn')} <ArrowRight size={15} />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}
