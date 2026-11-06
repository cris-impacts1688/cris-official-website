import { useTranslation } from 'react-i18next'
import { afIcon } from '../../constants/agentforge'
import FadeUp from './FadeUp'

/**
 * 五張卡的欄寬：lg 用 6 欄網格排成 3 + 2（上排各佔 2 欄、下排各佔 3 欄），
 * md 兩欄時第 5 張獨佔一列，避免右下角空一格。
 */
const SPAN = [
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-3',
  'md:col-span-2 lg:col-span-3',
]

/** AFP 核心功能：5 項，01–05 編號。 */
export default function CoreFeatures() {
  const { t } = useTranslation()
  const items = t('agentforge.features.items', { returnObjects: true })

  return (
    <section id="features" className="scroll-mt-32 py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-14">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {t('agentforge.features.tag')}
          </span>
          <h2 className="section-title mt-3">{t('agentforge.features.title')}</h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5">
          {items.map((item, i) => {
            const Icon = afIcon(item.icon)
            return (
              <FadeUp key={i} delay={i * 0.06} className={`h-full ${SPAN[i] ?? 'lg:col-span-2'}`}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-7
                  hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1
                  transition-all duration-300
                  dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50">
                  <div className="flex items-start justify-between">
                    <span className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center">
                      <Icon size={23} className="text-violet-600 dark:text-violet-300" />
                    </span>
                    <span className="text-sm font-bold text-slate-300 dark:text-slate-600 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h3>
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
