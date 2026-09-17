import { useTranslation } from 'react-i18next'
import { AlertCircle, Check, ExternalLink } from 'lucide-react'
import AgentFlow from './AgentFlow'
import FadeUp from './FadeUp'

/** 經濟部雲市集上架頁。外連，非本站連結。 */
const MARKET_URL =
  'https://keid.nat.gov.tw/cloud/Web/ai_solution_in.aspx?P=7f3e42ee-8167-e9a1-aac9-9178981d9338'

const NUMERALS = ['①', '②', '③']

export default function DataInsight() {
  const { t } = useTranslation()
  const pains = t('agentforge.insight.pains', { returnObjects: true })
  const gains = t('agentforge.insight.gains', { returnObjects: true })
  const agents = t('agentforge.insight.agents', { returnObjects: true })
  const market = t('agentforge.insight.market', { returnObjects: true })

  // 只把名稱餵給流程圖，說明文字留給右欄 —— 兩邊都放會讓同一段話在畫面上出現兩次。
  // zh 是英文術語的在地對照（例：Data Analysis Agent／資料分析代理人）。
  // 英文語系翻出來會等於 en 本身，此時不重複顯示。
  const flowSteps = agents.map((a) => ({
    title: a.en,
    subtitle: a.zh === a.en ? undefined : a.zh,
  }))

  return (
    <section id="insight" className="scroll-mt-32 py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
      {/* 點陣底紋 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-16">
          <span className="text-sm font-semibold text-violet-400 uppercase tracking-widest">
            {t('agentforge.insight.tag')}
          </span>
          <h2 className="section-title mt-3 text-white">{t('agentforge.insight.title')}</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('agentforge.insight.intro')}
          </p>
        </FadeUp>

        {/* 痛點 → 獲得 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <FadeUp>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-5">
                {t('agentforge.insight.pains_label')}
              </p>
              <ul className="space-y-3">
                {pains.map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlertCircle size={17} className="text-amber-500/80 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300 leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="h-full rounded-2xl border border-violet-500/30 bg-violet-500/[0.07] p-7">
              <p className="text-sm font-bold text-violet-300 uppercase tracking-wider mb-5">
                {t('agentforge.insight.gains_label')}
              </p>
              <ul className="space-y-3">
                {gains.map((g, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={17} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-200 leading-relaxed">{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>

        {/* 三階段 Agent */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
          <FadeUp>
            <div className="max-w-md mx-auto lg:mx-0 w-full">
              <AgentFlow steps={flowSteps} tone="onDark" />
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="space-y-5">
              {agents.map((a, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-2xl text-violet-400 leading-none flex-shrink-0">{NUMERALS[i]}</span>
                  <div>
                    <p className="text-base font-bold text-white leading-snug">{a.en}</p>
                    {a.zh !== a.en && (
                      <p className="text-sm font-medium text-violet-300">{a.zh}</p>
                    )}
                    <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* 雲市集 */}
        <FadeUp>
          <div className="rounded-2xl border border-violet-500/40 bg-gradient-to-br from-violet-600/20 to-transparent p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <span className="inline-block text-xs font-bold text-violet-300 uppercase tracking-widest mb-3">
                  {market.tag}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{market.title}</h3>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-xl">{market.desc}</p>
              </div>
              <div>
                <ul className="space-y-2.5 mb-6">
                  {market.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200 leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={MARKET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700
                    text-white font-semibold rounded-lg text-sm transition-all duration-200
                    shadow-lg shadow-violet-600/30 hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  {market.cta}
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
