import { useTranslation } from 'react-i18next'
import { afIcon } from '../../constants/agentforge'
import FadeUp from './FadeUp'

/** AFP 實質效益：4 項，一列排開。 */
export default function Benefits() {
  const { t } = useTranslation()
  const items = t('agentforge.benefits.items', { returnObjects: true })

  return (
    <section id="benefits" className="scroll-mt-32 py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-14">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {t('agentforge.benefits.tag')}
          </span>
          <h2 className="section-title mt-3">{t('agentforge.benefits.title')}</h2>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const Icon = afIcon(item.icon)
            return (
              <FadeUp key={i} delay={i * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-7
                  dark:border-slate-700 dark:bg-slate-800">
                  <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600
                    flex items-center justify-center shadow-lg shadow-violet-600/25">
                    <Icon size={22} className="text-white" />
                  </span>
                  <h3 className="mt-5 text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}
