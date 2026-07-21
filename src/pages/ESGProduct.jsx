import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCmsContent } from '../hooks/useCmsContent'
import {
  Leaf, Database, FileCheck, BarChart3, Globe, ShieldCheck,
  ChevronDown, ChevronUp, ArrowRight, CheckCircle, AlertCircle,
  Package, RefreshCw, Activity, Zap, Award, X, Server, ZoomIn
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const roadmapStages = [
  {
    num: '01',
    icon: Database,
    title: '活動數據採集',
    desc: 'ERP & 設備 API 自動接入',
    topBorder: 'border-t-emerald-500',
    badge: 'API 自動同步',
    badgeCls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    iconCls:  'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    glowCls:  'dark:[box-shadow:0_0_28px_-8px_#4ade8055]',
    items: [
      { name: '電力消耗', value: '48,230 kWh', status: 'ok' },
      { name: '天然氣',   value: '2,140 m³',   status: 'ok' },
      { name: '採購原料', value: '380 MT',      status: 'ok' },
      { name: '運輸燃料', value: '1,280 L',     status: 'warn' },
    ],
  },
  {
    num: '02',
    icon: RefreshCw,
    title: '係數庫自動配對',
    desc: 'IPCC / 各國最新排放因子',
    topBorder: 'border-t-teal-500',
    badge: '動態更新',
    badgeCls: 'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300',
    iconCls:  'bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
    glowCls:  'dark:[box-shadow:0_0_28px_-8px_#2dd4bf55]',
    items: [
      { name: '電力排放係數',  value: '0.509 kgCO₂', status: 'ok' },
      { name: 'IPCC CH₄ GWP', value: '27.9 (AR6)',   status: 'ok' },
      { name: '原料碳含量',   value: '自動比對',      status: 'ok' },
      { name: '運輸排放因子', value: '待確認',        status: 'warn' },
    ],
  },
  {
    num: '03',
    icon: ShieldCheck,
    title: 'ISO 合規校驗',
    desc: 'GHG Protocol 三範疇核算',
    topBorder: 'border-t-green-500',
    badge: 'ISO 14064',
    badgeCls: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    iconCls:  'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    glowCls:  'dark:[box-shadow:0_0_28px_-8px_#4ade8055]',
    items: [
      { name: '範疇一直接排放', value: '245 tCO₂e', status: 'ok' },
      { name: '範疇二間接排放', value: '189 tCO₂e', status: 'ok' },
      { name: '範疇三價值鏈',   value: '412 tCO₂e', status: 'ok' },
      { name: '不確定性分析',   value: '±3.2%',     status: 'ok' },
    ],
  },
  {
    num: '04',
    icon: FileCheck,
    title: 'CBAM 報告生成',
    desc: '一鍵輸出多格式合規文件',
    topBorder: 'border-t-cyan-500',
    badge: '一鍵匯出',
    badgeCls: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    iconCls:  'bg-cyan-50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400',
    glowCls:  'dark:[box-shadow:0_0_28px_-8px_#22d3ee55]',
    items: [
      { name: 'CBAM 申報表格', value: '自動填充', status: 'ok' },
      { name: 'CSRD 數據架構', value: '對應完成', status: 'ok' },
      { name: 'ESG 披露文件',  value: '準備就緒', status: 'ok' },
      { name: 'ISO 14064 報告', value: 'PDF 輸出', status: 'ok' },
    ],
  },
]

const integrationPartners = [
  { name: '主流 ERP 系統',  desc: '採購 / 財務數據' },
  { name: '用友 ERP',       desc: '原生雙碳模組對接' },
  { name: 'MES 系統',       desc: '製程排放數據' },
  { name: '採購 / 財務系統', desc: '供應鏈碳足跡' },
  { name: 'AI 一體機',      desc: 'RAG 係數查詢' },
  { name: 'IPCC 數據庫',    desc: '國際排放因子' },
  { name: 'CBAM 模組',      desc: '碳邊境調整機制' },
]

const challenges = [
  {
    icon: Globe,
    title: '歐盟 CBAM 碳關稅壁壘',
    desc: '歐盟碳邊境調整機制全面實施，未完成碳盤查的出口商面臨高額關稅或訂單削減，市場准入風險急劇上升。',
    tag: '貿易合規',
  },
  {
    icon: Package,
    title: '供應鏈碳中和壓力',
    desc: '蘋果、沃爾瑪等全球巨頭要求供應商 2030 年達成碳中和，未達標供應商面臨被淘汰出局的風險。',
    tag: '供應鏈要求',
  },
  {
    icon: Database,
    title: '數據孤島與計算誤差',
    desc: '碳排放數據分散在多個系統，Excel 手動計算容易出錯，人工盤查週期長達數月，誤差率超過 15%。',
    tag: '數據管理',
  },
  {
    icon: FileCheck,
    title: '合規人才與政策風險',
    desc: '各國 ESG 法規更新頻繁，企業缺乏專業 ESG 人才進行數據披露，外部顧問費用高昂且難以內化知識。',
    tag: '法規合規',
  },
]

const features = [
  {
    icon: Database,
    title: '多源數據自動採集',
    short: '對接能源系統、ERP、MES，一站式整合所有排放數據源',
    detail: `傳統碳盤查最大痛點是數據收集耗費 70% 以上的時間。IMPACTs CeO 數據採集引擎：

• 標準 API 對接工廠能源管理系統（EMS）、電表、燃料計量設備
• 直連 SAP / Oracle ERP 採購數據，自動提取原料與燃料使用量
• 整合 MES 製程數據，精準計算各工序直接排放
• 支援 Excel 批量導入作為過渡方案，內建格式驗證
• 自動識別異常數據並提醒複核，將人為誤差降低 50% 以上`,
  },
  {
    icon: ShieldCheck,
    title: '權威模型精準核算',
    short: '內建 ISO 14064、GHG Protocol，動態更新排放因子庫',
    detail: `碳核算的準確性取決於兩個關鍵：計算方法論與排放因子。IMPACTs CeO：

• 完整支援 GHG Protocol 範疇一、二、三排放分類
• 內建 ISO 14064-1/2 盤查方法，確保第三方查驗可通過
• 動態排放因子庫：自動同步各國電網排放因子、IPCC 最新數據
• 材料碳係數中心：收錄主要工業原料碳含量，支援自定義
• 不確定性分析模組：量化計算誤差範圍，提升報告可信度`,
  },
  {
    icon: FileCheck,
    title: '合規報告一鍵生成',
    short: '自動輸出 CBAM、CSRD 合規文件，滿足跨境貿易披露需求',
    detail: `報告撰寫是碳盤查最耗時的工作。IMPACTs CeO 報告引擎：

• 一鍵輸出 Word/PDF 格式的 ISO 14064 查驗報告
• CBAM 申報表格自動填充，符合歐盟海關格式要求
• CSRD（企業永續報告指令）數據架構對應
• 支援 CDP、GRI、SASB 等主流 ESG 披露框架
• 多語言報告輸出（中文、英文），適應不同海外客戶要求
• 報告版本管理，歷年數據可橫向對比`,
  },
  {
    icon: Globe,
    title: '全生命週期碳足跡 LCA',
    short: '從原料到成品的完整 LCA 分析，支援產品碳標籤申請',
    detail: `產品碳足跡（PCF）正成為 B2B 採購的標配要求。IMPACTs CeO LCA 模組：

• 建立產品物料清單（BOM）與製程碳排放映射關係
• 自動計算原料開採、製造、運輸、使用、廢棄各階段碳排
• 符合 ISO 14067 產品碳足跡計算標準
• 支援 EPD（環境產品聲明）數據包輸出
• 多產品批量分析，找出高碳排產品並優先減排
• 情境模擬：比較更換原料或工藝後的碳足跡變化`,
  },
]

const standards = [
  { name: 'ISO 14064', desc: '組織溫室氣體盤查標準' },
  { name: 'ISO 14067', desc: '產品碳足跡計算標準' },
  { name: 'GHG Protocol', desc: '溫室氣體議定書（範疇一二三）' },
  { name: 'CBAM', desc: '歐盟碳邊境調整機制' },
  { name: 'CSRD', desc: '企業永續報告指令' },
  { name: 'CDP', desc: '碳披露項目' },
]

const cases = [
  {
    company: '某金屬製品有限公司',
    tag: 'CBAM 合規 + 綠色供應鏈',
    tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    challenge: '主要出口歐盟，CBAM 實施後面臨大量碳申報工作；同時沃爾瑪要求提交碳足跡報告方可續約。',
    result: '導入 CeO 後完成全廠碳盤查，單噸產品碳排降低 28%，成功獲得沃爾瑪綠色供應商認證，歐盟訂單零中斷。',
    metrics: [
      { value: '28%',  label: '單噸碳排降低' },
      { value: '3週',  label: '完成首次全廠盤查' },
      { value: '零',   label: '訂單中斷次數' },
    ],
  },
  {
    company: '某膠膜製品有限公司',
    tag: 'LCA 分析 + 綠色溢價',
    tagColor: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
    challenge: '客戶要求產品附帶碳足跡標籤，企業缺乏 LCA 分析能力，外部顧問報價高且交期長達半年。',
    result: '使用 CeO LCA 模組自建碳足跡數據庫，年度碳減排達 66.67%，取得國際客戶 20% 綠色訂單溢價。',
    metrics: [
      { value: '66.67%', label: '年度碳減排' },
      { value: '20%',    label: '綠色訂單溢價' },
      { value: '6月→2週', label: 'LCA 報告周期' },
    ],
  },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

function StageItem({ name, value, status }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.06] last:border-0">
      <div className="flex items-center gap-1.5 min-w-0">
        {status === 'ok'
          ? <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
          : <AlertCircle size={11} className="text-amber-400 flex-shrink-0" />
        }
        <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{name}</span>
      </div>
      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 tabular-nums ml-2 flex-shrink-0">{value}</span>
    </div>
  )
}

function FlowConnector({ inView, delay }) {
  return (
    <>
      {/* Desktop horizontal connector */}
      <div className="hidden lg:flex items-center justify-center w-6 flex-shrink-0 relative self-center h-10">
        <motion.div
          className="w-full h-px bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-teal-700"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.35, delay }}
          style={{ originX: 0 }}
        />
        {inView && (
          <motion.div
            className="absolute w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-300 dark:shadow-[0_0_6px_2px_#4ade8066]"
            initial={{ x: -12 }}
            animate={{ x: 12 }}
            transition={{ duration: 0.9, delay: delay + 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          />
        )}
      </div>
      {/* Mobile vertical connector */}
      <div className="lg:hidden flex justify-center py-1">
        <div className="w-px h-6 bg-emerald-200 dark:bg-emerald-800" />
      </div>
    </>
  )
}

function ComplianceBoard({ inView }) {
  const elements = []
  roadmapStages.forEach((stage, idx) => {
    const Icon = stage.icon
    elements.push(
      <motion.div
        key={stage.num}
        className={`flex-1 bg-white dark:bg-slate-800/60 border-t-4 ${stage.topBorder}
          rounded-xl p-4 shadow-sm ${stage.glowCls} backdrop-blur-sm`}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 + idx * 0.14, type: 'spring', stiffness: 200, damping: 22 }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`p-2 rounded-lg flex-shrink-0 ${stage.iconCls}`}>
            <Icon size={16} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Stage {stage.num}</div>
            <div className="font-bold text-[13px] text-slate-900 dark:text-white leading-tight truncate">{stage.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stage.badgeCls}`}>
            {stage.badge}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">{stage.desc}</p>

        <div>
          {stage.items.map(item => (
            <StageItem key={item.name} {...item} />
          ))}
        </div>
      </motion.div>
    )

    if (idx < roadmapStages.length - 1) {
      elements.push(
        <FlowConnector key={`conn-${idx}`} inView={inView} delay={0.38 + idx * 0.14} />
      )
    }
  })

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-3 lg:gap-0">
      {elements}
    </div>
  )
}

function FeatureCard({ feature, index }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = feature.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      className={`card cursor-pointer select-none transition-all duration-300 ${open ? 'ring-2 ring-emerald-500 dark:ring-emerald-400' : ''}`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-xl flex-shrink-0 transition-colors ${open ? 'bg-emerald-500 text-white' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
            <Icon size={22} strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{feature.short}</p>
          </div>
        </div>
        <div className="flex-shrink-0 mt-1 text-slate-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
              <pre className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {feature.detail}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── SGS Cert Section ─────────────────────────────────────────────────────────

function SGSCertSection() {
  const { t } = useTranslation()
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const advantages = t('esg.sgs_advantages', { returnObjects: true })
  const imgs = [
    { src: `${import.meta.env.BASE_URL}SGS AUP 證書_0.jpg`, alt: t('esg.sgs_img0_alt') },
  ]

  return (
    <section className="relative py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Shimmer ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            {t('esg.sgs_tag')}
          </span>
          <h2 className="section-title mt-3">{t('esg.sgs_title')}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">{t('esg.sgs_subtitle')}</p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Left — Certificate images */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {imgs.map((img, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className="group relative w-full rounded-2xl overflow-hidden border border-emerald-100 dark:border-emerald-900/40 shadow-md hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 cursor-zoom-in"
                aria-label={img.alt}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 dark:bg-slate-900/90 rounded-full p-2">
                    <ZoomIn size={18} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </button>
            ))}

            {/* CRIS AI Appliance note */}
            <div className="flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-xl px-4 py-3 mt-1">
              <Server size={15} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {t('esg.sgs_note')}
              </span>
            </div>
          </motion.div>

          {/* Right — 7 advantages */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="space-y-3"
          >
            {Array.isArray(advantages) && advantages.map((adv, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                className="flex items-start gap-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3.5 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-700/50 hover:shadow-md transition-all duration-200"
              >
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{adv.title}</span>
                  <span className="text-slate-400 dark:text-slate-500 mx-1.5 text-xs">·</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{adv.desc}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIdx(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              className="relative max-w-3xl w-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={imgs[lightboxIdx].src}
                alt={imgs[lightboxIdx].alt}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setLightboxIdx(null)}
                aria-label={t('esg.sgs_lightbox_close')}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ESGProduct() {
  const { t } = useTranslation()
  const cmsHeroDesc = useCmsContent('esg', 'hero_desc')
  const roadmapRef = useRef(null)
  const roadmapInView = useInView(roadmapRef, { once: true, margin: '-80px' })
  const challengeRef = useRef(null)
  const challengeInView = useInView(challengeRef, { once: true, margin: '-80px' })
  const kpiRef = useRef(null)
  const kpiInView = useInView(kpiRef, { once: true, margin: '-80px' })
  const caseRef = useRef(null)
  const caseInView = useInView(caseRef, { once: true, margin: '-80px' })

  const quickStats = t('esg.quick_stats', { returnObjects: true })
  const kpis = t('esg.kpis', { returnObjects: true })
  const tags = t('esg.tags', { returnObjects: true })

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden
        bg-gradient-to-br from-green-50 via-white to-emerald-50
        dark:bg-none dark:[background:linear-gradient(to_bottom,#0f172a,#020c08)]">

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.20] dark:opacity-[0.09]"
          style={{
            backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100 rounded-full blur-3xl opacity-60 pointer-events-none dark:opacity-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none dark:opacity-0" />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-0 dark:opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />

        {/* Leaf micro-icons */}
        {[
          { left: '5%',  top: '20%', size: 22, delay: 0,   dur: 11, ry: 1  },
          { left: '90%', top: '22%', size: 18, delay: 1.5, dur: 14, ry: -1 },
          { left: '87%', top: '70%', size: 14, delay: 0.6, dur: 9,  ry: 1  },
          { left: '3%',  top: '76%', size: 20, delay: 2.0, dur: 13, ry: -1 },
          { left: '58%', top: '88%', size: 16, delay: 1.1, dur: 10, ry: 1  },
          { left: '28%', top: '10%', size: 12, delay: 0.3, dur: 12, ry: -1 },
        ].map((l, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none opacity-[0.18] dark:opacity-[0.14]"
            style={{ left: l.left, top: l.top }}
            animate={{ y: [0, -10, 0], rotate: [0, l.ry * 18, 0] }}
            transition={{ duration: l.dur, delay: l.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width={l.size} height={l.size} viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </motion.div>
        ))}

        {/* Tech accent lines */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none overflow-hidden opacity-[0.14] dark:opacity-[0.07]">
          <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
            <line x1="256" y1="0"  x2="0"   y2="256" stroke="#059669" strokeWidth="0.8" />
            <line x1="256" y1="48" x2="48"  y2="256" stroke="#059669" strokeWidth="0.5" />
            <line x1="256" y1="96" x2="96"  y2="256" stroke="#059669" strokeWidth="0.5" />
            <circle cx="220" cy="36" r="2.5" fill="#059669" opacity="0.8" />
            <circle cx="180" cy="76" r="1.8" fill="#059669" opacity="0.55" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-600 mb-14"
          >
            <Link to="/" className="hover:text-green-600 dark:hover:text-slate-400 transition-colors text-slate-500 dark:text-slate-500">{t('navbar.home')}</Link>
            <span>/</span>
            <span>{t('navbar.products')}</span>
            <span>/</span>
            <span className="text-green-600 dark:text-green-400">{t('esg.breadcrumb')}</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8
                bg-green-100 border border-green-200 text-green-700
                dark:bg-white/5 dark:border-white/10 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
                <span className="text-xs font-medium tracking-wide">{t('esg.badge')}</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight">
                <span className="text-slate-900 dark:text-white">{t('esg.product_name')} </span>
                <span className="text-gradient-green-anim">{t('esg.product_name_gradient')}</span>
              </h1>
              <p className="mt-3 text-2xl font-semibold text-slate-700 dark:text-white/80">
                {t('esg.product_subtitle')}
              </p>

              <div className="mt-7 text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
                {cmsHeroDesc
                  ? <span dangerouslySetInnerHTML={{ __html: cmsHeroDesc }} />
                  : t('esg.product_desc')}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-colors text-sm shadow-lg shadow-green-200 dark:shadow-green-900/40"
                >
                  {t('esg.cta_primary')} <ArrowRight size={16} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold rounded-lg transition-colors text-sm
                    border border-slate-300 text-slate-600 hover:border-green-500 hover:text-green-700
                    dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-white"
                >
                  {t('esg.cta_secondary')} <ChevronDown size={16} />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded text-[11px] font-medium
                      bg-white border border-slate-200 text-slate-500
                      dark:bg-slate-800 dark:border-slate-700/60 dark:text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: Product Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.25 }}
              className="flex items-center justify-center"
            >
              <motion.div
                className="relative w-full rounded-2xl p-4
                  border border-green-100 bg-white/80 backdrop-blur-md shadow-xl shadow-green-100/50
                  dark:border-white/10 dark:bg-white/5 dark:shadow-none"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={import.meta.env.BASE_URL + 'ESG.png'}
                  alt="IMPACTs CeO 產品截圖"
                  className="w-full rounded-xl"
                  style={{ boxShadow: '0 0 50px -12px rgba(34,197,94,0.4)' }}
                />
                {/* Floating badge */}
                <motion.div
                  className="absolute -top-3 -right-3 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-emerald-200 dark:shadow-emerald-900/60"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 280 }}
                >
                  {t('esg.floating_badge')}
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Quick Stats Band ── */}
      <section className="py-0 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">
            {quickStats.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.1} className="py-10 px-8 text-center">
                <div className="text-5xl font-extrabold text-gradient-green-anim tabular-nums">{s.value}</div>
                <div className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{s.label}</div>
                <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{s.sub}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance Roadmap ── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        {/* Dark mode green ambient glow */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[800px] h-32 pointer-events-none opacity-0 dark:opacity-[0.05]"
          style={{ background: 'radial-gradient(ellipse, #4ade80, transparent)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-12">
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.roadmap_tag')}</span>
            <h2 className="section-title mt-3">{t('esg.roadmap_title')}</h2>
            <p className="section-subtitle">
              {t('esg.roadmap_subtitle')}
            </p>
            <p className="mt-4 text-xs italic text-slate-400 dark:text-slate-500">
              以下為概念示意圖，實際畫面依導入環境而定
            </p>
          </FadeUp>

          {/* macOS window chrome */}
          <div ref={roadmapRef} className="rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-200 dark:border-white/[0.06]">

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-5 py-3
              bg-white dark:bg-slate-900
              border-b border-slate-100 dark:border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="ml-3 text-xs font-medium text-slate-500 dark:text-slate-500">
                {t('esg.roadmap_toolbar')}
              </span>
              <div className="ml-auto text-[11px] font-mono text-slate-400 dark:text-slate-600 tracking-widest">
                CONCEPT
              </div>
            </div>

            {/* Board */}
            <div className="p-4 lg:p-6 bg-slate-50 dark:bg-slate-900/50">
              <ComplianceBoard inView={roadmapInView} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Integration Logo Wall ── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-10">
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.integration_tag')}</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{t('esg.integration_title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">{t('esg.integration_subtitle')}</p>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {integrationPartners.map((p, i) => (
              <FadeUp key={p.name} delay={i * 0.05}>
                <div className="group flex flex-col items-center text-center p-4 rounded-xl
                  border border-slate-100 dark:border-slate-800
                  bg-slate-50 dark:bg-slate-800/50
                  hover:border-emerald-200 dark:hover:border-emerald-800/60
                  hover:bg-white dark:hover:bg-slate-800
                  transition-all duration-200 cursor-default">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2 group-hover:scale-125 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">{p.name}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{p.desc}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industry Challenges ── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={challengeRef}
            initial={{ opacity: 0, y: 20 }}
            animate={challengeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.challenge_tag')}</span>
            <h2 className="section-title mt-3">{t('esg.challenge_title')}</h2>
            <p className="section-subtitle">
              {t('esg.challenge_subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={challengeInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 flex-shrink-0">
                      <Icon size={22} className="text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 dark:text-white">{c.title}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">{c.tag}</span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-4">
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.feat_tag')}</span>
            <h2 className="section-title mt-3">{t('esg.feat_title')}</h2>
          </FadeUp>
          <FadeUp delay={0.1} className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
              {t('esg.feat_hint')}
            </span>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SGS Certification ── */}
      <SGSCertSection />

      {/* ── KPIs ── */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={kpiRef}
            initial={{ opacity: 0, y: 20 }}
            animate={kpiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.kpi_tag')}</span>
            <h2 className="section-title mt-3">{t('esg.kpi_title')}</h2>
            <p className="section-subtitle">{t('esg.kpi_subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 30 }}
                animate={kpiInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-6xl font-extrabold tabular-nums text-gradient-green-anim">{kpi.value}</div>
                <div className="mt-2 text-base font-semibold text-slate-900 dark:text-white">{kpi.label}</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{kpi.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Compliance Standards ── */}
      <section className="py-16 bg-emerald-50 dark:bg-emerald-950/20 border-y border-emerald-100 dark:border-emerald-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-10">
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.standards_tag')}</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{t('esg.standards_title')}</h2>
          </FadeUp>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {standards.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700 shadow-sm"
              >
                <ShieldCheck size={22} className="text-emerald-500 mb-2" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{s.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">{s.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Stories ── */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={caseRef}
            initial={{ opacity: 0, y: 20 }}
            animate={caseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{t('esg.cases_tag')}</span>
            <h2 className="section-title mt-3">{t('esg.cases_title')}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cases.map((c, i) => (
              <motion.div
                key={c.company}
                initial={{ opacity: 0, y: 30 }}
                animate={caseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${c.tagColor} mb-3`}>{c.tag}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">{c.company}</h3>

                  <div className="space-y-3 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t('esg.challenge_label')}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.challenge}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">{t('esg.result_label')}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.result}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {c.metrics.map((m) => (
                      <div key={m.label} className="text-center">
                        <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{m.value}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Leaf size={40} className="text-white/60 mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t('esg.cta_title')}
            </h2>
            <p className="mt-4 text-emerald-100 text-lg">
              {t('esg.cta_subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-xl"
              >
                {t('esg.cta_btn')} <ArrowRight size={18} />
              </Link>
              <Link to="/"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-lg hover:border-white hover:bg-white/10 transition-colors"
              >
                {t('esg.cta_back')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
