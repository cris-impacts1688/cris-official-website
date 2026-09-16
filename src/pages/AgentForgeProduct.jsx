import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useCmsContent } from '../hooks/useCmsContent'
import AgentNetwork from '../components/agentforge/AgentNetwork'
import DualMode from '../components/agentforge/DualMode'
import DataInsight from '../components/agentforge/DataInsight'
import WorkflowCases from '../components/agentforge/WorkflowCases'
import FadeUp from '../components/agentforge/FadeUp'

const SUBNAV = [
  { key: 'dual',    href: '#dual'    },
  { key: 'insight', href: '#insight' },
  { key: 'cases',   href: '#cases'   },
]

/** 捲過 Hero 後淡入的區塊導覽。固定在 Navbar（h-16）下方。 */
function SubNav() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="fixed top-16 left-0 right-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-md
            dark:border-slate-700/70 dark:bg-slate-900/90"
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-5 sm:gap-7 overflow-x-auto">
            {SUBNAV.map((s) => (
              <a
                key={s.key}
                href={s.href}
                className="text-sm font-medium whitespace-nowrap text-slate-600 hover:text-violet-600
                  dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
              >
                {t(`agentforge.subnav.${s.key}`)}
              </a>
            ))}
            <Link
              to="/contact"
              className="ml-auto text-sm font-semibold whitespace-nowrap text-violet-600 dark:text-violet-400 hover:underline"
            >
              {t('agentforge.subnav.contact')}
            </Link>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function AgentForgeProduct() {
  const { t } = useTranslation()
  const reduceMotion = useReducedMotion()
  const cmsHeroDesc = useCmsContent('agentforge', 'hero_desc')
  const tags = t('agentforge.tags', { returnObjects: true })

  return (
    <div className="min-h-screen">
      <SubNav />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden
        bg-gradient-to-br from-violet-50 via-white to-slate-100
        dark:bg-none dark:[background:linear-gradient(135deg,#0f172a_0%,#0d0a1e_60%,#000_100%)]">

        <div className="absolute inset-0 pointer-events-none opacity-[0.22] dark:opacity-[0.10]"
          style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-100 rounded-full blur-3xl opacity-60 pointer-events-none dark:opacity-0" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/[0.07] rounded-full blur-[100px] pointer-events-none opacity-0 dark:opacity-100" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          {/* 麵包屑 */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.4 }}
            className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 mb-14"
          >
            <Link to="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-slate-500">
              {t('navbar.home')}
            </Link>
            <span>/</span>
            <span>{t('navbar.products')}</span>
            <span>/</span>
            <span className="text-violet-600 dark:text-violet-400">{t('agentforge.breadcrumb')}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* 左：文字 */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8
                bg-violet-100 border border-violet-200 text-violet-700
                dark:bg-white/5 dark:border-white/10 dark:text-violet-400">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-pulse" />
                <span className="text-xs font-medium tracking-wide">{t('agentforge.badge')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.08] tracking-tight">
                <span className="text-slate-900 dark:text-white">{t('agentforge.hero_title')} </span>
                <span className="text-gradient-violet-anim">{t('agentforge.hero_title_gradient')}</span>
              </h1>
              <p className="mt-3 text-2xl font-semibold text-slate-700 dark:text-white/80">
                {t('agentforge.hero_subtitle')}
              </p>

              <div className="mt-7 text-base text-slate-600 dark:text-slate-400 leading-[1.8] max-w-lg">
                {cmsHeroDesc
                  ? <span dangerouslySetInnerHTML={{ __html: cmsHeroDesc }} />
                  : t('agentforge.hero_desc')}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 active:scale-[0.97]
                    text-white font-semibold rounded-lg transition-all duration-200 text-sm
                    shadow-lg shadow-violet-600/25 hover:shadow-xl hover:shadow-violet-600/35 hover:-translate-y-0.5"
                >
                  {t('agentforge.cta_primary')} <ArrowRight size={16} />
                </Link>
                <a
                  href="#cases"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-lg transition-all duration-200 text-sm active:scale-[0.97]
                    border border-slate-300 text-slate-600 hover:border-violet-500 hover:text-violet-600
                    dark:border-slate-700 dark:text-slate-400 dark:hover:border-violet-500/60 dark:hover:text-violet-400"
                >
                  {t('agentforge.cta_secondary')} <ChevronDown size={16} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded text-[11px] font-medium
                      bg-white border border-slate-200 text-slate-500
                      dark:bg-white/5 dark:border-white/10 dark:text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 右：Multi-Agent 協作網絡 */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.8, ease: 'easeOut', delay: 0.25 }}
            >
              <AgentNetwork />
            </motion.div>
          </div>
        </div>
      </section>

      <DualMode />
      <DataInsight />
      <WorkflowCases />

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="py-20 bg-violet-600 dark:bg-violet-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
              {t('agentforge.cta_title')}
            </h2>
            <p className="mt-5 text-lg text-violet-100 leading-relaxed">
              {t('agentforge.cta_subtitle')}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-bold rounded-lg
                  hover:bg-violet-50 active:scale-[0.97] transition-all duration-200 shadow-xl hover:-translate-y-0.5 text-base"
              >
                {t('agentforge.cta_btn')} <ArrowRight size={18} />
              </Link>
              <a
                href="#cases"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-lg
                  hover:border-white hover:bg-white/10 active:scale-[0.97] transition-all duration-200 text-base"
              >
                {t('agentforge.cta_back')}
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
