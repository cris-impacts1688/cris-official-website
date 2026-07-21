import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Cpu, HardDrive, Zap, Network, Server, ArrowRight, Lock, Wifi } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const specIcons = [Cpu, Server, HardDrive, Zap, Network, Shield]

function ArchDiagram() {
  return (
    <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-md mx-auto">
      {/* Center: AI Appliance box */}
      <rect x="150" y="95" width="120" height="70" rx="10" fill="#0F172A" stroke="#0052D9" strokeWidth="1.5" />
      <rect x="156" y="101" width="108" height="58" rx="7" fill="#0052D9" fillOpacity="0.12" />
      <text x="210" y="126" textAnchor="middle" fill="#93C5FD" fontSize="9" fontWeight="600" fontFamily="sans-serif">CRIS AI</text>
      <text x="210" y="139" textAnchor="middle" fill="#DBEAFE" fontSize="8" fontFamily="sans-serif">一體機</text>
      <text x="210" y="153" textAnchor="middle" fill="#60A5FA" fontSize="7" fontFamily="sans-serif">Argox AI Engine</text>
      {/* Glow behind center box */}
      <ellipse cx="210" cy="130" rx="70" ry="45" fill="#0052D9" fillOpacity="0.08" />

      {/* Left nodes */}
      {/* APS */}
      <rect x="18" y="30" width="90" height="42" rx="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <text x="63" y="50" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">AI 智能調度</text>
      <text x="63" y="63" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="sans-serif">APS Engine</text>
      <line x1="108" y1="51" x2="150" y2="110" stroke="#0052D9" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.6" />
      <circle cx="108" cy="51" r="3" fill="#0052D9" fillOpacity="0.8" />

      {/* ESG */}
      <rect x="18" y="108" width="90" height="42" rx="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <text x="63" y="128" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">AI 綠色管理</text>
      <text x="63" y="141" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="sans-serif">ESG Engine</text>
      <line x1="108" y1="129" x2="150" y2="130" stroke="#0052D9" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.6" />
      <circle cx="108" cy="129" r="3" fill="#0052D9" fillOpacity="0.8" />

      {/* Knowledge */}
      <rect x="18" y="186" width="90" height="42" rx="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <text x="63" y="206" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">RAG 知識庫</text>
      <text x="63" y="219" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="sans-serif">Knowledge Base</text>
      <line x1="108" y1="207" x2="150" y2="150" stroke="#0052D9" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.6" />
      <circle cx="108" cy="207" r="3" fill="#0052D9" fillOpacity="0.8" />

      {/* Right nodes */}
      {/* ERP */}
      <rect x="312" y="30" width="90" height="42" rx="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <text x="357" y="50" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">ERP / MES</text>
      <text x="357" y="63" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="sans-serif">Enterprise Data</text>
      <line x1="312" y1="51" x2="270" y2="110" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
      <circle cx="312" cy="51" r="3" fill="#38BDF8" fillOpacity="0.8" />

      {/* AIoT */}
      <rect x="312" y="108" width="90" height="42" rx="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <text x="357" y="128" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">AIoT 感測器</text>
      <text x="357" y="141" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="sans-serif">Sensor Network</text>
      <line x1="312" y1="129" x2="270" y2="130" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
      <circle cx="312" cy="129" r="3" fill="#38BDF8" fillOpacity="0.8" />

      {/* Dashboard */}
      <rect x="312" y="186" width="90" height="42" rx="7" fill="#1E293B" stroke="#334155" strokeWidth="1" />
      <text x="357" y="206" textAnchor="middle" fill="#94A3B8" fontSize="8" fontWeight="600" fontFamily="sans-serif">管理儀表板</text>
      <text x="357" y="219" textAnchor="middle" fill="#64748B" fontSize="7" fontFamily="sans-serif">Dashboard</text>
      <line x1="312" y1="207" x2="270" y2="150" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.5" />
      <circle cx="312" cy="207" r="3" fill="#38BDF8" fillOpacity="0.8" />

      {/* Private cloud label */}
      <rect x="140" y="230" width="140" height="22" rx="5" fill="#0052D9" fillOpacity="0.15" stroke="#0052D9" strokeOpacity="0.3" strokeWidth="1" />
      <text x="210" y="245" textAnchor="middle" fill="#93C5FD" fontSize="8" fontWeight="600" fontFamily="sans-serif">🔒 Private Cloud · On-Premise</text>
    </svg>
  )
}

export default function AIAppliance() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const { t } = useTranslation()

  const specs = [
    { labelKey: 'spec_cpu_label',     valueKey: 'spec_cpu_value',     icon: Cpu },
    { labelKey: 'spec_ram_label',     valueKey: 'spec_ram_value',     icon: Server },
    { labelKey: 'spec_storage_label', valueKey: 'spec_storage_value', icon: HardDrive },
    { labelKey: 'spec_engine_label',  valueKey: 'spec_engine_value',  icon: Zap },
    { labelKey: 'spec_network_label', valueKey: 'spec_network_value', icon: Wifi },
    { labelKey: 'spec_os_label',      valueKey: 'spec_os_value',      icon: Shield },
  ]

  const badges = [
    { key: 'badge_onprem',  icon: Lock,   color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
    { key: 'badge_security', icon: Shield, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
    { key: 'badge_plug',    icon: Zap,    color: 'text-violet-400 border-violet-500/30 bg-violet-500/10' },
  ]

  return (
    <section className="py-24 bg-slate-950 dark:bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-cris-blue/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-blue-400/[0.04] rounded-full blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #60A5FA 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-blue-400 uppercase tracking-widest">
            {t('ai_appliance.tag')}
          </span>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-white leading-tight">
            {t('ai_appliance.title')}
          </h2>
          <p className="mt-2 text-lg font-medium text-blue-300">{t('ai_appliance.subtitle')}</p>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            {t('ai_appliance.desc')}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {badges.map((b) => {
              const Icon = b.icon
              return (
                <span key={b.key} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${b.color}`}>
                  <Icon size={12} /> {t(`ai_appliance.${b.key}`)}
                </span>
              )
            })}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Specs grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map((s, i) => {
                const Icon = s.icon
                return (
                  <motion.div
                    key={s.labelKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                    className="bg-slate-900 border border-slate-800 hover:border-cris-blue/40 rounded-xl p-4 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-cris-blue/15 flex items-center justify-center group-hover:bg-cris-blue/25 transition-colors">
                        <Icon size={14} className="text-blue-400" />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">{t(`ai_appliance.${s.labelKey}`)}</span>
                    </div>
                    <p className="text-sm font-semibold text-white leading-snug">{t(`ai_appliance.${s.valueKey}`)}</p>
                  </motion.div>
                )
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.55 }}
              className="mt-6"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cris-blue hover:bg-cris-blue-dark text-white text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-cris-blue/20"
              >
                {t('ai_appliance.cta')} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Architecture diagram */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="ml-2 text-xs text-slate-500 font-mono">{t('ai_appliance.arch_label')}</span>
              </div>
              <ArchDiagram />
            </div>
            {/* Floating glow pulse */}
            <motion.div
              className="absolute inset-0 rounded-2xl border border-cris-blue/20 pointer-events-none"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
