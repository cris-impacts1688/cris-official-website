import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Landmark, CheckCircle2, Building2 } from 'lucide-react'

const TAG_STYLES = {
  '智慧製造':  'bg-blue-50   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300',
  '供需規劃':  'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  '供應鏈':    'bg-violet-50  text-violet-700  dark:bg-violet-900/30  dark:text-violet-300',
  '智慧客服':  'bg-orange-50  text-orange-700  dark:bg-orange-900/30  dark:text-orange-300',
  '國際行銷':  'bg-pink-50    text-pink-700    dark:bg-pink-900/30    dark:text-pink-300',
  '知識管理':  'bg-amber-50   text-amber-700   dark:bg-amber-900/30   dark:text-amber-300',
}

const CASES = [
  {
    industry: '精密製造．線性馬達',
    plan: '製造決策協作代理人（AgentForge + APS）',
    desc: '台灣中小製造業生管部門普遍僅 1–3 人，卻需全天候應對插單、異常重排與交期承諾。APS 系統雖已建置，但每次重排仍需人工手動觸發，夜班假日形同停擺。快思協助導入 Multi-Agent AI 架構，在 APS 外圍建立自主感知與決策協作層，讓系統能主動監控工廠事件並自動呼叫排程引擎，同時將每次決策脈絡沉澱至向量記憶庫，解決因人員異動造成的知識歸零問題。',
    benefit: '7×24 AI 自主排程，生管人工介入降低 80%，排程知識永久傳承',
    tag: '智慧製造',
  },
  {
    industry: '精密製造．線性馬達',
    plan: 'ATP/CTP 精敏詢單系統',
    desc: '業務端高峰期同時面對數百筆詢單湧入，現行 ERP 受限資料庫 I/O 瓶頸，高併發時頻繁觸發列級鎖甚至批量逾時；直接在 ERP 做交期模擬又會干擾既有生產計畫。快思設計三層解耦架構，以記憶體式計算引擎（Memory-Based Architecture）預載全量資源快照，所有供需匹配與資源扣減皆在記憶體內完成，徹底隔離 ERP 負載。',
    benefit: '毫秒級高併發詢單回應，500 筆/秒吞吐量，零列鎖問題',
    tag: '供需規劃',
  },
  {
    industry: '精密製造．線性馬達',
    plan: '供應鏈數位生態協作與指揮中心',
    desc: '核心產品涉及磁性材料、精密加工、電子元件等多元供應商協作，現行仰賴電話、Email 與人工 Excel 追蹤，資訊不對稱導致交期承諾難以兌現。快思規劃供應鏈數位協作平台（C-1）與決策控制塔（C-2），整合採購、品質驗收、異常通知與 ESG 碳排追溯，讓中心廠與供應商建立共同的數位作業語言。',
    benefit: '供應鏈全鏈路透明化，從採購到出貨可追溯，符合半導體客戶 ESG 合規要求',
    tag: '供應鏈',
  },
  {
    industry: '條碼識別設備．全球 60+ 國',
    plan: 'AI 智慧技術支援系統（n8n + LLM）',
    desc: '技術支援團隊每年接獲數千件跨時區郵件，估計逾七成屬重複性常見問題，卻仍需高階工程師逐一回覆；三十年累積的設備操作手冊、維修 SOP 與歷史客服紀錄分散各處，新人查詢費時且難以傳承。快思以 n8n 自動化工作流為核心，整合 LLM 與多層級 Markdown 知識路由，建立雙軌分流機制——常見問題自動回覆、複雜問題 AI 輔助草稿後人工審核。',
    benefit: '常見問題自動回覆率達 70% 以上，首次回應時間縮短 60%，實現 7×24 全天候服務',
    tag: '智慧客服',
  },
  {
    industry: '條碼識別設備．全球 60+ 國',
    plan: 'INTERPACK 2026 國際展覽暨 AI 售服數位化',
    desc: '面對德義大廠壟斷高端市場、中國低價競爭以及美國關稅壓力，企業亟需在全球最大包裝機械展 INTERPACK 2026 重塑差異化定位。快思協助規劃參展策略，以智慧貼標機搭載 AI 健康診斷模組為展示核心，讓買主現場體驗從硬體供應到預測維護服務的轉型成果，對接歐美客戶對高稼動率、低 TCO 與 ESG 合規性的迫切需求。',
    benefit: '從硬體導向轉型為 AI 服務化，以「高品質 × 合理價格 × 低維護成本」黃金三角搶進歐美市場',
    tag: '國際行銷',
  },
  {
    industry: '精密製造',
    plan: 'IMPACTs APS 智能排程與交期優化',
    benefit: '排程工時由 1 小時/次縮短為 10 分鐘，日產出從 1,300 件提升至 1,500 件',
    desc: '生管部門每次排程耗時近一小時，面對多品項、複雜加工途程時尤為吃力，設備稼動率與交期準確性均難以最佳化。快思導入 IMPACTs APS 系統，依企業特性完成工廠建模、客製功能開發與 ERP 整合，讓系統自動執行供需匹配與產能模擬，大幅壓縮排程作業時間並提升產出效率。',
    tag: '智慧製造',
  },
  {
    industry: '傳統製造業數位轉型',
    plan: '生成式 AI 助手暨企業知識庫建置',
    desc: '企業已導入 ERP、MES 等多套資訊系統，各單位文檔與 Excel 表單卻仍高度分散；現場關鍵技術與調機經驗長期存在資深師傅腦中，難以系統化保存。生產遇到異常時，操作人員往往需跨多個系統查找維修紀錄，平均耗時超過 15 分鐘。快思規劃生成式 AI 助手與數智員工，整合知識庫、提升文件檢索效率，並將隱性經驗轉化為可持續擴充的結構化資產。',
    benefit: '知識查詢時間大幅縮短，老師傅經驗數位化留存，降低人員異動對生產品質的衝擊',
    tag: '知識管理',
  },
  {
    industry: '製造業',
    plan: '智慧報工與生產協作系統（SPRCS）',
    desc: '現場生產仍高度依賴紙本工單與人工回報，各工序標準工時需事後人工彙算，生管與現場之間資訊存在時間落差，導致生產進度難以即時掌握、成本核算費時費力。快思導入以平板裝置搭配條碼／QR Code 掃描的電子報工系統，將進站、開工、報工、出站全面數位化，並與 ERP 即時整合，取代人工紙本作業流程。',
    benefit: '現場報工全電子化，生管即時掌握生產進度，產能與成本核算自動化完成',
    tag: '智慧製造',
  },
]

function CaseCard({ c, index, isInView }) {
  const tagStyle = TAG_STYLES[c.tag] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 2) * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-7 flex flex-col gap-5 hover:border-cris-blue/30 dark:hover:border-cris-blue/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
    >
      {/* Industry + tag row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <Building2 size={15} className="text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">{c.industry}</p>
        </div>
        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${tagStyle}`}>
          {c.tag}
        </span>
      </div>

      {/* Plan name */}
      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
        {c.plan}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
        {c.desc}
      </p>

      {/* Benefit */}
      <div className="flex items-start gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-700">
        <CheckCircle2 size={15} className="text-cris-blue dark:text-cris-blue-light mt-0.5 flex-shrink-0" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{c.benefit}</p>
      </div>
    </motion.div>
  )
}

export default function GovProgramCases() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cris-blue/[0.08] dark:bg-cris-blue/[0.14] border border-cris-blue/20 dark:border-cris-blue/30 mb-5">
            <Landmark size={14} className="text-cris-blue dark:text-cris-blue-light" />
            <span className="text-xs font-semibold text-cris-blue dark:text-cris-blue-light tracking-widest uppercase">
              115 年度產業競爭力輔導計畫
            </span>
          </div>

          <h2 className="section-title mt-2">輔導申請案例</h2>
          <p className="section-subtitle mt-3 max-w-2xl mx-auto">
            快思科技具備政府核可之產業競爭力輔導資格，協助製造業與服務業廠商規劃與執行 AI 導入計畫，加速數位轉型落地。
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CASES.map((c, i) => (
            <CaseCard key={i} c={c} index={i} isInView={isInView} />
          ))}
        </div>

      </div>
    </section>
  )
}
