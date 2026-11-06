import { useTranslation } from 'react-i18next'
import { Rocket, Users, Share2, TrendingUp, ChevronRight } from 'lucide-react'
import { afIcon } from '../../constants/agentforge'
import FadeUp from './FadeUp'
import MarketBanner from './MarketBanner'

/**
 * S1–S4 四階方案的視覺設定。文案在 locale（agentforge.plans.tiers），
 * 這裡只放「第幾階長什麼樣子」：主圖標與色系。
 * Tailwind JIT 只認得完整字串，所以每一階的 class 都要寫死，不能用模板拼色名。
 * 色系沿用原稿示意圖：藍 → 青 → 紫 → 橙，代表導入深度由淺到深；
 * 四張卡頂端的色條並排時連成一條漸層，箭頭圓鈕也是「這一階色 → 下一階色」。
 */
const TIER_STYLES = [
  {
    icon: Rocket,
    bar: 'from-blue-500 to-sky-400',
    glow: 'bg-blue-400/25 dark:bg-blue-500/25',
    tile: 'from-blue-500 to-blue-700 shadow-blue-600/30',
    code: 'from-blue-500 to-sky-400',
    chip: 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-400/25',
    bullet: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
    feature: 'bg-blue-50/80 dark:bg-blue-500/[0.08]',
    featureLabel: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:border-blue-300 hover:shadow-blue-500/25 dark:hover:border-blue-400/40',
    arrow: 'from-blue-500 to-teal-500',
  },
  {
    icon: Users,
    bar: 'from-teal-500 to-emerald-400',
    glow: 'bg-teal-400/25 dark:bg-teal-500/25',
    tile: 'from-teal-500 to-teal-700 shadow-teal-600/30',
    code: 'from-teal-500 to-emerald-400',
    chip: 'bg-teal-50 text-teal-700 ring-teal-200 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-400/25',
    bullet: 'bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300',
    feature: 'bg-teal-50/80 dark:bg-teal-500/[0.08]',
    featureLabel: 'text-teal-700 dark:text-teal-300',
    hover: 'hover:border-teal-300 hover:shadow-teal-500/25 dark:hover:border-teal-400/40',
    arrow: 'from-teal-500 to-violet-500',
  },
  {
    icon: Share2,
    bar: 'from-violet-500 to-fuchsia-400',
    glow: 'bg-violet-400/25 dark:bg-violet-500/25',
    tile: 'from-violet-500 to-violet-700 shadow-violet-600/30',
    code: 'from-violet-500 to-fuchsia-400',
    chip: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/25',
    bullet: 'bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300',
    feature: 'bg-violet-50/80 dark:bg-violet-500/[0.08]',
    featureLabel: 'text-violet-700 dark:text-violet-300',
    hover: 'hover:border-violet-300 hover:shadow-violet-500/25 dark:hover:border-violet-400/40',
    arrow: 'from-violet-500 to-amber-500',
  },
  {
    icon: TrendingUp,
    bar: 'from-amber-500 to-orange-400',
    glow: 'bg-amber-400/25 dark:bg-amber-500/20',
    tile: 'from-amber-500 to-orange-600 shadow-orange-600/30',
    code: 'from-amber-500 to-orange-400',
    chip: 'bg-amber-50 text-orange-700 ring-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/25',
    bullet: 'bg-amber-50 text-orange-600 dark:bg-amber-500/15 dark:text-amber-300',
    feature: 'bg-amber-50/80 dark:bg-amber-500/[0.08]',
    featureLabel: 'text-orange-700 dark:text-amber-300',
    hover: 'hover:border-amber-300 hover:shadow-amber-500/25 dark:hover:border-amber-400/40',
    arrow: '',
  },
]

/**
 * 單一方案卡。index 決定色系；isLast 決定要不要畫往下一階的箭頭。
 * 具名匯出：/design-system 會 import 來做 Live Preview，避免文件與實作漂移。
 */
export function TierCard({ tier, index, featureLabel, isLast = false }) {
  const s = TIER_STYLES[index % TIER_STYLES.length]
  const Icon = s.icon

  return (
    <div className="relative h-full">
      <article
        className={`group relative h-full flex flex-col overflow-hidden rounded-2xl border
          border-white/60 bg-white shadow-xl shadow-black/20
          dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/40
          transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${s.hover}`}
      >
        {/* 頂端色條：四張並排時連成藍 → 橙的漸層 */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${s.bar}`} />

        {/* 頂部柔光，讓卡片帶一點該階的色溫 */}
        <div aria-hidden="true"
          className={`pointer-events-none absolute -top-20 -left-10 w-56 h-40 rounded-full blur-3xl ${s.glow}`} />

        <div className="relative flex flex-1 flex-col p-6">
          {/* 標頭：圖標 ↔ 階級代號 */}
          <div className="flex items-start justify-between">
            <span className={`w-12 h-12 rounded-xl bg-gradient-to-br text-white shadow-lg
              flex items-center justify-center ${s.tile}`}>
              <Icon size={23} strokeWidth={2} />
            </span>
            <span className={`text-4xl font-black leading-none tracking-tight tabular-nums
              bg-gradient-to-br bg-clip-text text-transparent ${s.code}`}>
              {tier.code}
            </span>
          </div>

          {/* 名稱 + 英文定位 */}
          <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white tracking-tight">{tier.name}</h3>
          <span className={`mt-2 self-start rounded-full px-2.5 py-1 ring-1 text-[10.5px] font-bold tracking-[0.14em]
            whitespace-nowrap ${s.chip}`}>
            {tier.en}
          </span>

          {/* 一句話 + 適用對象。xl 四欄並排時預留固定行數（2 + 3 行），
              讓四張卡的分隔線與條列對齊；兩欄以下卡片夠寬，預留反而留白，不預留 */}
          <p className="mt-5 xl:min-h-[2lh] text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-snug text-balance">
            {tier.tagline}
          </p>
          <p className="mt-2 xl:min-h-[3lh] text-sm text-slate-500 dark:text-slate-400 leading-relaxed text-pretty">
            {tier.fit}
          </p>

          {/* 方案內容 */}
          <ul className="mt-5 pt-5 flex-1 space-y-2.5 border-t border-slate-100 dark:border-white/[0.08]">
            {tier.points.map((p, i) => {
              const PIcon = afIcon(p.icon)
              return (
                <li key={i} className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${s.bullet}`}>
                    <PIcon size={15} />
                  </span>
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{p.text}</span>
                </li>
              )
            })}
          </ul>

          {/* 方案特色 */}
          <div className={`mt-6 rounded-xl p-4 ${s.feature}`}>
            <p className={`text-[11px] font-bold tracking-wider ${s.featureLabel}`}>{featureLabel}</p>
            <p className="mt-1 text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed text-pretty">{tier.feature}</p>
          </div>
        </div>
      </article>

      {/* 往下一階的箭頭：這一階色 → 下一階色的圓鈕，ring 與區塊底色相同，像從背景挖出來。
          手機版朝下、xl 四欄時朝右；md 兩欄時換行位置不連續，不畫。 */}
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute z-10 flex md:hidden xl:flex items-center justify-center w-10 h-10 rounded-full
            bg-gradient-to-r text-white shadow-lg shadow-black/40 ring-4 ring-slate-900 dark:ring-slate-950
            left-1/2 -bottom-[52px] -translate-x-1/2 rotate-90
            xl:left-auto xl:-right-[38px] xl:top-1/2 xl:bottom-auto xl:translate-x-0 xl:-translate-y-1/2 xl:rotate-0
            ${s.arrow}`}
        >
          <ChevronRight size={20} strokeWidth={2.75} />
        </span>
      )}
    </div>
  )
}

/**
 * 中文長標題在全形逗號處斷行：每個子句包成 inline-block，寬度夠時不會從子句中間折開
 * （text-balance 只會平均切字數，會切出「肩膀／上」這種斷法）。英文沒有全形逗號，原樣輸出。
 */
function BreakAtComma({ text }) {
  const i = text.indexOf('，')
  if (i < 0) return text
  return (
    <>
      <span className="inline-block">{text.slice(0, i + 1)}</span>
      <span className="inline-block">{text.slice(i + 1)}</span>
    </>
  )
}

/** 產品與方案：S1 → S4 四階導入路徑（原稿示意圖的 DOM 版）＋ 雲市集橫幅。 */
export default function PlanTiers() {
  const { t } = useTranslation()
  const tiers = t('agentforge.plans.tiers', { returnObjects: true })
  const market = t('agentforge.plans.market', { returnObjects: true })
  const featureLabel = t('agentforge.plans.feature_label')

  return (
    <section id="plans" className="scroll-mt-32 py-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
      {/* 點陣底紋 */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #a78bfa 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* 兩端柔光：左上藍（S1 起點）、右下橙（S4 終點），呼應四階色序 */}
      <div aria-hidden="true" className="absolute -top-48 -left-40 w-[560px] h-[560px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/3 -right-48 w-[520px] h-[520px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeUp className="text-center mb-16">
          <span className="text-sm font-semibold text-violet-400 uppercase tracking-widest">
            {t('agentforge.plans.tag')}
          </span>
          <h2 className="section-title mt-3 text-white max-w-4xl mx-auto text-balance">
            <BreakAtComma text={t('agentforge.plans.title')} />
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed text-balance">
            <BreakAtComma text={t('agentforge.plans.intro')} />
          </p>
        </FadeUp>

        <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6 xl:gap-x-9 gap-y-16 md:gap-y-6 mb-20">
          {tiers.map((tier, i) => (
            <li key={tier.code}>
              <FadeUp delay={i * 0.08} className="h-full">
                <TierCard tier={tier} index={i} featureLabel={featureLabel} isLast={i === tiers.length - 1} />
              </FadeUp>
            </li>
          ))}
        </ol>

        <MarketBanner market={market} />
      </div>
    </section>
  )
}
