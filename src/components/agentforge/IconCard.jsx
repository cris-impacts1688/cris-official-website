import { Check } from 'lucide-react'
import FadeUp from './FadeUp'

/**
 * MoreCard（WorkflowCases）與 ModeCard（DualMode）共用的卡片外殼：
 * 圖標方塊 + 標題 + 可選的一句話 + 說明 + 分隔線 + 勾選清單。
 * 兩者差異（圖標尺寸、slogan 有無、說明間距、勾選圖標）留成 props，
 * 呼叫端各自帶入原本的值，視覺輸出不變。
 */
export default function IconCard({
  icon: Icon, iconSize = 19, tileSize = 'w-10 h-10',
  title, slogan, desc, descSpacing = 'mt-2',
  points, checkIcon: CheckIcon = Check, checkSize = 14,
  delay = 0,
}) {
  return (
    <FadeUp delay={delay} className="h-full">
      <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-6
        hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-1
        transition-all duration-300
        dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500/50">
        <div className={`${tileSize} rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center mb-4`}>
          <Icon size={iconSize} className="text-violet-600 dark:text-violet-300" />
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{title}</h4>
        {slogan && (
          <p className="mt-1 text-sm font-medium text-violet-700 dark:text-violet-300 leading-snug">{slogan}</p>
        )}
        <p className={`${descSpacing} text-sm text-slate-600 dark:text-slate-400 leading-relaxed`}>{desc}</p>
        <ul className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          {points.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckIcon size={checkSize} className="text-violet-500 dark:text-violet-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </FadeUp>
  )
}
