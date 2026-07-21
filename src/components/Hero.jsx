import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { ArrowRight, ChevronDown, Cpu } from 'lucide-react'
import { useTranslation } from 'react-i18next'

// ─── Decorative shapes config ─────────────────────────────────────────────────

const geoShapes = [
  { id: 1, type: 'hex',    left: '7%',  top: '22%', size: 60, delay: 0,   dur: 7.5 },
  { id: 2, type: 'circle', left: '89%', top: '14%', size: 44, delay: 1.3, dur: 9.2 },
  { id: 3, type: 'square', left: '93%', top: '62%', size: 34, delay: 0.7, dur: 8.0 },
  { id: 4, type: 'hex',    left: '4%',  top: '70%', size: 48, delay: 2.0, dur: 10.5 },
  { id: 5, type: 'circle', left: '76%', top: '82%', size: 26, delay: 1.0, dur: 6.5 },
]

const microIcons = [
  { id: 'n1', kind: 'node',    left: '18%', top: '12%', size: 20, delay: 0.4, dur: 11, rotDir: 1 },
  { id: 'n2', kind: 'circuit', left: '82%', top: '42%', size: 16, delay: 1.6, dur: 14, rotDir: -1 },
  { id: 'n3', kind: 'node',    left: '12%', top: '55%', size: 18, delay: 0.9, dur: 9,  rotDir: 1 },
  { id: 'n4', kind: 'circuit', left: '72%', top: '20%', size: 22, delay: 2.2, dur: 12, rotDir: -1 },
  { id: 'n5', kind: 'node',    left: '60%', top: '88%', size: 14, delay: 1.1, dur: 10, rotDir: 1 },
  { id: 'n6', kind: 'circuit', left: '87%', top: '76%', size: 16, delay: 0.2, dur: 13, rotDir: 1 },
]

const statValues = ['80%', '60%', '200+']

// ─── SVG micro icons ──────────────────────────────────────────────────────────

function NodeSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0052D9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="6" strokeDasharray="2 3" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

function CircuitSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#0052D9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="8" height="8" rx="1" />
      <line x1="12" y1="2" x2="12" y2="8" />
      <line x1="12" y1="16" x2="12" y2="22" />
      <line x1="2" y1="12" x2="8" y2="12" />
      <line x1="16" y1="12" x2="22" y2="12" />
      <circle cx="12" cy="2" r="1.2" fill="#0052D9" />
      <circle cx="12" cy="22" r="1.2" fill="#0052D9" />
      <circle cx="2" cy="12" r="1.2" fill="#0052D9" />
      <circle cx="22" cy="12" r="1.2" fill="#0052D9" />
    </svg>
  )
}

function GeoShape({ type, size }) {
  const c = size / 2, r = size * 0.42
  if (type === 'hex') {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6
      return `${(c + r * Math.cos(a)).toFixed(2)},${(c + r * Math.sin(a)).toFixed(2)}`
    }).join(' ')
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <polygon points={pts} stroke="#0052D9" strokeWidth="1.5" />
      </svg>
    )
  }
  if (type === 'circle') {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <circle cx={c} cy={c} r={size * 0.40} stroke="#0052D9" strokeWidth="1.5" />
        <circle cx={c} cy={c} r={size * 0.22} stroke="#0052D9" strokeWidth="1" opacity="0.5" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect x={size*0.18} y={size*0.18} width={size*0.64} height={size*0.64} rx="3"
        stroke="#0052D9" strokeWidth="1.5" transform={`rotate(25 ${c} ${c})`} />
    </svg>
  )
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.18 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
}

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 14 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 22 },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero() {
  const sectionRef = useRef(null)
  const { t } = useTranslation()

  /* ── Mouse parallax ── */
  const rawX = useMotionValue(0.5)
  const rawY = useMotionValue(0.5)
  const springCfg = { stiffness: 40, damping: 18 }
  const smoothX = useSpring(rawX, springCfg)
  const smoothY = useSpring(rawY, springCfg)

  const blobX  = useTransform(smoothX, [0, 1], [-14, 14])
  const blobY  = useTransform(smoothY, [0, 1], [-8,  8])
  const shapeX = useTransform(smoothX, [0, 1], [-22, 22])
  const shapeY = useTransform(smoothY, [0, 1], [-12, 12])

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left) / rect.width)
    rawY.set((e.clientY - rect.top) / rect.height)
  }, [rawX, rawY])

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 transition-colors duration-500" />

      {/* Glow blobs — parallax layer 1 */}
      <motion.div
        style={{ x: blobX, y: blobY }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-40 -left-40 w-[640px] h-[640px] bg-cris-blue/[0.07] dark:bg-cris-blue/[0.05] rounded-full blur-[110px]" />
        <div className="absolute top-1/2 -right-20 w-[440px] h-[440px] bg-blue-400/[0.07] dark:bg-blue-400/[0.04] rounded-full blur-[90px]" />
        <div className="absolute -bottom-20 left-1/3 w-[320px] h-[320px] bg-indigo-400/[0.06] dark:bg-indigo-400/[0.04] rounded-full blur-[70px]" />
      </motion.div>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.28] dark:opacity-[0.14]"
        style={{
          backgroundImage: 'radial-gradient(circle, #0052D9 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Tech accent lines — top right */}
      <div className="absolute top-0 right-0 w-80 h-80 pointer-events-none overflow-hidden opacity-[0.18] dark:opacity-[0.10]">
        <svg viewBox="0 0 320 320" fill="none" className="w-full h-full">
          <line x1="320" y1="0"   x2="0"   y2="320" stroke="#0052D9" strokeWidth="0.8" />
          <line x1="320" y1="50"  x2="50"  y2="320" stroke="#0052D9" strokeWidth="0.5" />
          <line x1="320" y1="100" x2="100" y2="320" stroke="#0052D9" strokeWidth="0.5" />
          <line x1="270" y1="0"   x2="0"   y2="270" stroke="#0052D9" strokeWidth="0.5" />
          <circle cx="274" cy="46"  r="3"   fill="#0052D9" opacity="0.9" />
          <circle cx="228" cy="92"  r="2"   fill="#0052D9" opacity="0.65" />
          <circle cx="182" cy="138" r="1.5" fill="#0052D9" opacity="0.45" />
        </svg>
      </div>

      {/* Tech accent lines — bottom left */}
      <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none overflow-hidden opacity-[0.13] dark:opacity-[0.08]">
        <svg viewBox="0 0 256 256" fill="none" className="w-full h-full">
          <line x1="0" y1="256" x2="256" y2="0"   stroke="#0052D9" strokeWidth="0.8" />
          <line x1="0" y1="206" x2="206" y2="0"   stroke="#0052D9" strokeWidth="0.5" />
          <line x1="0" y1="156" x2="156" y2="0"   stroke="#0052D9" strokeWidth="0.5" />
          <circle cx="50"  cy="206" r="2.5" fill="#0052D9" opacity="0.8" />
          <circle cx="100" cy="156" r="1.8" fill="#0052D9" opacity="0.55" />
        </svg>
      </div>

      {/* Floating geometric shapes — parallax layer 2 */}
      <motion.div
        style={{ x: shapeX, y: shapeY }}
        className="absolute inset-0 pointer-events-none"
      >
        {geoShapes.map((sh) => (
          <motion.div
            key={sh.id}
            className="absolute opacity-[0.20] dark:opacity-[0.15]"
            style={{ left: sh.left, top: sh.top }}
            animate={{ y: [0, -14, 0], rotate: [0, sh.id % 2 === 0 ? 9 : -9, 0] }}
            transition={{ duration: sh.dur, delay: sh.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <GeoShape type={sh.type} size={sh.size} />
          </motion.div>
        ))}
      </motion.div>

      {/* Micro-icons (gears + leaves) — parallax layer 2 */}
      <motion.div
        style={{ x: shapeX, y: shapeY }}
        className="absolute inset-0 pointer-events-none"
      >
        {microIcons.map((ic) => (
          <motion.div
            key={ic.id}
            className="absolute opacity-[0.18] dark:opacity-[0.13]"
            style={{ left: ic.left, top: ic.top }}
            animate={{
              y: [0, -10, 0],
              rotate: ic.rotDir === 1 ? [0, 15, 0] : [0, -15, 0],
            }}
            transition={{ duration: ic.dur, delay: ic.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            {ic.kind === 'node' ? <NodeSVG size={ic.size} /> : <CircuitSVG size={ic.size} />}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Badge */}
        <motion.div variants={badgeVariants}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cris-blue/[0.08] dark:bg-cris-blue/[0.18] border border-cris-blue/20 dark:border-cris-blue/30">
            <Cpu size={13} className="text-cris-blue dark:text-cris-blue-light" />
            <span className="w-1.5 h-1.5 rounded-full bg-cris-blue dark:bg-cris-blue-light animate-pulse" />
            <span className="text-xs font-semibold text-cris-blue dark:text-cris-blue-light tracking-widest uppercase">
              {t('hero.badge')}
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight"
        >
          {t('hero.title_prefix')}
          <br />
          <span className="text-gradient-anim">{t('hero.title_g1')}</span>
          {' '}{t('hero.title_between')}
          {t('hero.title_g2') && <> <span className="text-gradient-anim">{t('hero.title_g2')}</span></>}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mt-7 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-[1.75]"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="#contact" className="btn-primary text-base px-8 py-4">
            {t('hero.cta_primary')} <ArrowRight size={18} />
          </a>
          <a href="#features" className="btn-outline text-base px-8 py-4">
            {t('hero.cta_secondary')}
          </a>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="mt-4 text-xs text-slate-400 dark:text-slate-500 tracking-wide"
        >
          {t('hero.trust')}
        </motion.p>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-700"
        >
          {statValues.map((val, i) => (
            <div key={i} className="px-10 py-4 text-center">
              <div className="text-4xl font-bold text-gradient-anim tabular-nums">{val}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">{t(`hero.stat_${i}_label`)}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500"
      >
        <span className="text-[11px] font-semibold tracking-[0.15em] uppercase">{t('hero.scroll')}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}
