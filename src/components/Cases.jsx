import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Clock, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const metricIcons = [TrendingUp, Clock, Package]
const metricColors = [
  'text-blue-600 dark:text-blue-400',
  'text-emerald-600 dark:text-emerald-400',
  'text-violet-600 dark:text-violet-400',
]
const metricValues = [
  ['80%', '2天→2小時', '35%'],
  ['62%', '3週→1天', '0%'],
]
const tagColors = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
]

function CaseCard({ index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useTranslation()
  const casesData = t('cases_data', { returnObjects: true })
  const c = casesData[index]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
    >
      <div className="p-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${tagColors[index]}`}>{c.tag}</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-3">{c.industry}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.company}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('cases_section.challenge_label')}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.challenge}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">{t('cases_section.solution_label')}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.solution}</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">{t('cases_section.result_label')}</h4>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((mi) => {
              const Icon = metricIcons[mi]
              return (
                <div key={mi} className="text-center">
                  <Icon size={20} className={`mx-auto mb-2 ${metricColors[mi]}`} />
                  <div className={`text-2xl font-bold ${metricColors[mi]}`}>{metricValues[index][mi]}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c[`metric_${mi}`]}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Cases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useTranslation()

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
            {t('cases_section.tag')}
          </span>
          <h2 className="section-title mt-3">{t('cases_section.title')}</h2>
          <p className="section-subtitle">{t('cases_section.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[0, 1].map((i) => (
            <CaseCard key={i} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <a href="#contact" className="btn-primary">
            {t('cases_section.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
