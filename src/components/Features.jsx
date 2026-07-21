import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, BarChart3, Cpu, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const featureMeta = [
  { icon: Calendar, iconColor: 'text-blue-500',    lightBg: 'bg-blue-50 dark:bg-blue-900/20',    href: '/products/aps' },
  { icon: BarChart3, iconColor: 'text-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-900/20', href: '/products/esg' },
  { icon: Cpu,       iconColor: 'text-violet-500',  lightBg: 'bg-violet-50 dark:bg-violet-900/20', href: '/products/ai-box' },
]

function FeatureCard({ meta, data, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const Icon = meta.icon
  const { t } = useTranslation()

  return (
    <Link to={meta.href} className="block">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="card group cursor-pointer h-full"
      >
        <div className={`inline-flex p-3 rounded-xl ${meta.lightBg} mb-6`}>
          <Icon size={28} className={meta.iconColor} strokeWidth={1.5} />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{data.title}</h3>
        <p className="text-sm font-medium text-cris-blue dark:text-cris-blue-light mt-1">{data.subtitle}</p>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">{data.desc}</p>

        <ul className="mt-6 space-y-3">
          {data.points.map((point, pi) => (
            <li key={pi} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
              <CheckCircle2 size={16} className="text-cris-blue dark:text-cris-blue-light mt-0.5 flex-shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            {t('features_section.learn_more')}
          </span>
        </div>
      </motion.div>
    </Link>
  )
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useTranslation()
  const featuresData = t('features_data', { returnObjects: true })

  return (
    <section id="features" className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-cris-blue dark:text-cris-blue-light uppercase tracking-widest">
            {t('features_section.tag')}
          </span>
          <h2 className="section-title mt-3">{t('features_section.title')}</h2>
          <p className="section-subtitle">{t('features_section.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureMeta.map((meta, i) => (
            <FeatureCard key={meta.href} meta={meta} data={featuresData[i]} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
