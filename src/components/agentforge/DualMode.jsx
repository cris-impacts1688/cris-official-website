import { useTranslation } from 'react-i18next'
import { CheckCircle2, ArrowLeftRight } from 'lucide-react'
import { afIcon } from '../../constants/agentforge'
import FadeUp from './FadeUp'

/** 單一能力卡：圖標 + 標題 + 一句話 + 說明 + 效益清單 */
function ModeCard({ item, index }) {
  const Icon = afIcon(item.icon)
  return (
    <FadeUp delay={index * 0.06} className="h-full">
      <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6
        hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1
        transition-all duration-300
        dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50">
        <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-4">
          <Icon size={21} className="text-violet-600 dark:text-violet-300" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
        <p className="mt-1 text-sm font-medium text-violet-700 dark:text-violet-300 leading-snug">{item.slogan}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
        <ul className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {item.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  )
}

/** 一組：標籤 + 標題 + 導言 + 6 張卡 */
function ModeGroup({ order, group }) {
  return (
    <div>
      <FadeUp className="mb-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums">{order}</span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{group.label}</h3>
        </div>
        <p className="mt-1 text-lg font-semibold text-slate-700 dark:text-slate-300">{group.title}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">{group.intro}</p>
      </FadeUp>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {group.items.map((item, i) => (
          <ModeCard key={i} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}

export default function DualMode() {
  const { t } = useTranslation()
  const cmp = t('agentforge.dual.compare', { returnObjects: true })
  const aiplus = t('agentforge.dual.aiplus', { returnObjects: true })
  const plusai = t('agentforge.dual.plusai', { returnObjects: true })

  return (
    <section id="dual" className="scroll-mt-32 py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 區塊標頭 —— 吸頂子導覽的「雙軌能力」會跳到這裡，要有明確落點 */}
        <FadeUp className="text-center mb-12">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {t('agentforge.dual.tag')}
          </span>
          <h2 className="section-title mt-3">{t('agentforge.dual.title')}</h2>
        </FadeUp>

        {/* 對照導言：先講清楚 AI+ 和 +AI 差在哪 */}
        <FadeUp className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 items-stretch">
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50/60 p-6 dark:border-violet-500/40 dark:bg-violet-500/[0.07]">
              <p className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">{cmp.a_label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{cmp.a_head}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.a_desc}</p>
            </div>
            <div className="flex items-center justify-center py-1 md:py-0">
              <ArrowLeftRight size={22} className="rotate-90 md:rotate-0 text-slate-300 dark:text-slate-600" />
            </div>
            <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6 dark:border-indigo-500/40 dark:bg-indigo-500/[0.07]">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{cmp.b_label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{cmp.b_head}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.b_desc}</p>
            </div>
          </div>
        </FadeUp>

        <div className="space-y-20">
          <ModeGroup order="01" group={aiplus} />
          <ModeGroup order="02" group={plusai} />
        </div>
      </div>
    </section>
  )
}
