import { useTranslation } from 'react-i18next'
import { CheckCircle2, ArrowLeftRight } from 'lucide-react'
import { afIcon } from '../constants/agentforge'
import FadeUp from './agentforge/FadeUp'
import IconCard from './agentforge/IconCard'

/** 單一能力卡：圖標 + 標題 + 一句話 + 說明 + 效益清單 */
function ModeCard({ item, index }) {
  return (
    <IconCard
      icon={afIcon(item.icon)}
      iconSize={21}
      tileSize="w-11 h-11"
      title={item.title}
      slogan={item.slogan}
      desc={item.desc}
      descSpacing="mt-3"
      points={item.points}
      checkIcon={CheckCircle2}
      checkSize={15}
      tone="blue"
      delay={index * 0.06}
    />
  )
}

/** 一組：標籤 + 標題 + 導言 + 6 張卡。id 讓 /solutions#ai-plus 這類連結能直接跳到該組。 */
function ModeGroup({ id, order, group }) {
  return (
    <div id={id} className="scroll-mt-24">
      <FadeUp className="mb-8">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl font-extrabold text-cris-blue dark:text-cris-blue-light tabular-nums">{order}</span>
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

/**
 * AI+（應用系統）與 +AI（自動化操作）雙軌能力。
 * 1030 改版從 AgentForge 產品頁搬到解決方案頁，改用 CRIS 品牌藍；
 * 區塊標題由解決方案頁的頁首負責，這裡從對照卡開始。
 */
export default function DualMode() {
  const { t } = useTranslation()
  const cmp = t('solutions.dual.compare', { returnObjects: true })
  const aiplus = t('solutions.dual.aiplus', { returnObjects: true })
  const plusai = t('solutions.dual.plusai', { returnObjects: true })

  return (
    <section id="dual" className="scroll-mt-24 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 對照導言：先講清楚 AI+ 和 +AI 差在哪 */}
        <FadeUp className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 items-stretch">
            <a href="#ai-plus" className="block rounded-2xl border-2 border-cris-blue/25 bg-blue-50/70 p-6
              hover:border-cris-blue/50 transition-colors
              dark:border-cris-blue-light/40 dark:bg-cris-blue/[0.10] dark:hover:border-cris-blue-light/70">
              <p className="text-3xl font-extrabold text-cris-blue dark:text-cris-blue-light">{cmp.a_label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{cmp.a_head}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.a_desc}</p>
            </a>
            <div className="flex items-center justify-center py-1 md:py-0">
              <ArrowLeftRight size={22} className="rotate-90 md:rotate-0 text-slate-300 dark:text-slate-600" />
            </div>
            <a href="#plus-ai" className="block rounded-2xl border-2 border-indigo-200 bg-indigo-50/60 p-6
              hover:border-indigo-300 transition-colors
              dark:border-indigo-500/40 dark:bg-indigo-500/[0.07] dark:hover:border-indigo-400/70">
              <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{cmp.b_label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">{cmp.b_head}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{cmp.b_desc}</p>
            </a>
          </div>
        </FadeUp>

        <div className="space-y-20">
          <ModeGroup id="ai-plus" order="01" group={aiplus} />
          <ModeGroup id="plus-ai" order="02" group={plusai} />
        </div>
      </div>
    </section>
  )
}
