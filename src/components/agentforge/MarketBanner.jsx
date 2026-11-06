import { Check, ExternalLink } from 'lucide-react'
import FadeUp from './FadeUp'

/** 經濟部雲市集上架頁。外連，非本站連結。 */
const MARKET_URL =
  'https://keid.nat.gov.tw/cloud/Web/ai_solution_in.aspx?P=7f3e42ee-8167-e9a1-aac9-9178981d9338'

/**
 * 雲市集導購橫幅。原本在 DATA INSIGHT 區塊底部；1030 改版後 DATA INSIGHT
 * 併入 S1 方案，橫幅跟著搬到「產品與方案」底下。只放在深色底上。
 */
export default function MarketBanner({ market }) {
  return (
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
  )
}
