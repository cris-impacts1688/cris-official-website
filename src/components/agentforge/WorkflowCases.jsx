import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Check, ArrowRight, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react'
import { afIcon } from '../../constants/agentforge'
import AgentFlow from './AgentFlow'
import FadeUp from './FadeUp'

/* ── 成果：before → after ──────────────────────────────────────────── */
/* 具名匯出：/design-system 會 import 來做 Live Preview，避免文件與實作漂移 */
export function DeltaMetrics({ items }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((m, i) => (
        <div
          key={i}
          className="rounded-xl border border-slate-200 bg-white p-4 text-center
            dark:border-slate-700 dark:bg-slate-800"
        >
          <p className="text-xs text-slate-400 line-through dark:text-slate-500">{m.before}</p>
          <p className="mt-1 text-xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums leading-tight">
            {m.after}
          </p>
          <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-snug">{m.label}</p>
        </div>
      ))}
    </div>
  )
}

/* ── 成果：方向箭頭（案例 2 原稿未提供數字，不編造） ──────────────── */
export function QualitativeMetrics({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((m, i) => {
        if (m.direction !== 'up' && m.direction !== 'down' && import.meta.env.DEV) {
          console.warn(`[QualitativeMetrics] 未知的 direction："${m.direction}"，已當作 down 處理`)
        }
        const up = m.direction === 'up'
        const Arrow = up ? ArrowUpRight : ArrowDownRight
        return (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4
              dark:border-slate-700 dark:bg-slate-800"
          >
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                ${up
                  ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400'}`}
            >
              <Arrow size={17} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{m.label}</p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{m.note}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── 旗艦案例：全寬，左右交錯 ──────────────────────────────────────── */
function FlagshipCase({ data, index, labels }) {
  const reversed = index % 2 === 1
  const flowSteps = data.flow.map((s) => ({
    title: s.agents,
    subtitle: s.label,
    human: s.human,
  }))

  if (data.metrics_kind !== 'delta' && data.metrics_kind !== 'qualitative' && import.meta.env.DEV) {
    console.warn(`[FlagshipCase] 未知的 metrics_kind："${data.metrics_kind}"，已當作 qualitative 處理`)
  }

  return (
    <FadeUp>
      <article className="rounded-3xl border border-slate-200 bg-slate-50/60 p-7 md:p-10
        dark:border-slate-700 dark:bg-slate-800/40">

        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {labels.flagship} {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
          {data.title}
        </h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          {data.summary}
        </p>

        <div className={`mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start
          ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>

          {/* 背景 + 痛點 */}
          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                {labels.background}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-[1.85]">{data.background}</p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-5
              dark:border-amber-500/30 dark:bg-amber-500/[0.07]">
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-3">
                {labels.pains}
              </p>
              <ul className="space-y-2">
                {data.pains.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <AlertTriangle size={15} className="text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 工作流 */}
          <div>
            <p className="text-xs font-bold text-violet-700 dark:text-violet-400 uppercase tracking-wider mb-3">
              {labels.flow}
            </p>
            <AgentFlow steps={flowSteps} tone="onLight" />
          </div>
        </div>

        {/* 成果 */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            {data.metrics_label}
          </p>
          {data.metrics_kind === 'delta'
            ? <DeltaMetrics items={data.metrics} />
            : <QualitativeMetrics items={data.metrics} />}
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 italic">
            {labels.disclaimer}
          </p>
        </div>
      </article>
    </FadeUp>
  )
}

/* ── 更多工作場景：網格卡 ──────────────────────────────────────────── */
function MoreCard({ item, index }) {
  const Icon = afIcon(item.icon)
  return (
    <FadeUp delay={index * 0.05} className="h-full">
      <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6
        hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1
        transition-all duration-300
        dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50">
        <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-4">
          <Icon size={19} className="text-violet-600 dark:text-violet-300" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{item.title}</h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
        <ul className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {item.points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check size={14} className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  )
}

/* ── 第 14 張：客製化 CTA ──────────────────────────────────────────── */
function CustomCard({ data }) {
  const Icon = afIcon(data.icon)
  return (
    <FadeUp>
      <div className="rounded-3xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 to-white p-8 md:p-10
        dark:border-violet-500/40 dark:from-violet-500/[0.12] dark:to-transparent">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-600/30">
              <Icon size={23} className="text-white" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              {data.title}
            </h3>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-[1.85]">{data.desc}</p>
            <p className="mt-5 text-lg font-bold text-violet-700 dark:text-violet-300">{data.tagline}</p>
          </div>
          <div>
            <ul className="space-y-2.5 mb-7">
              {data.points.map((p, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Check size={16} className="text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700
                text-white font-semibold rounded-lg text-sm transition-all duration-200
                shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 active:scale-[0.97]"
            >
              {data.cta} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </FadeUp>
  )
}

/* ── 區塊 ──────────────────────────────────────────────────────────── */
export default function WorkflowCases() {
  const { t } = useTranslation()
  const values = t('agentforge.cases.values', { returnObjects: true })
  const flagship = t('agentforge.cases.flagship', { returnObjects: true })
  const more = t('agentforge.cases.more', { returnObjects: true })
  const custom = t('agentforge.cases.custom', { returnObjects: true })

  const labels = {
    flagship: t('agentforge.cases.flagship_label'),
    background: t('agentforge.cases.background_label'),
    pains: t('agentforge.cases.pains_label'),
    flow: t('agentforge.cases.flow_label'),
    disclaimer: t('agentforge.cases.disclaimer'),
  }

  return (
    <section id="cases" className="scroll-mt-32 py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeUp className="text-center mb-14">
          <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            {t('agentforge.cases.tag')}
          </span>
          <h2 className="section-title mt-3">{t('agentforge.cases.title')}</h2>
          <p className="section-subtitle">{t('agentforge.cases.intro')}</p>
        </FadeUp>

        {/* 平台價值 */}
        <FadeUp className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
            {t('agentforge.cases.values_label')}
          </h3>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-24">
          {values.map((v, i) => (
            <FadeUp key={i} delay={i * 0.06} className="h-full">
              <div className="h-full rounded-xl border border-slate-200 bg-slate-50/60 p-5
                dark:border-slate-700 dark:bg-slate-800/40">
                <div className="flex items-start gap-2.5">
                  <Check size={17} className="text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{v.title}</p>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* 旗艦案例 ×3 */}
        <div className="space-y-10 mb-24">
          {flagship.map((c, i) => (
            <FlagshipCase key={i} data={c} index={i} labels={labels} />
          ))}
        </div>

        {/* 更多工作場景 ×10 */}
        <FadeUp className="mb-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t('agentforge.cases.more_label')}
          </h3>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {more.map((m, i) => (
            <MoreCard key={i} item={m} index={i} />
          ))}
        </div>

        {/* 第 14 張：客製化 */}
        <CustomCard data={custom} />
      </div>
    </section>
  )
}
