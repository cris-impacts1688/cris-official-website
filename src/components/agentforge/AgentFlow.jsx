import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowDown, UserCheck } from 'lucide-react'

const TONES = {
  onLight: {
    box:    'bg-white border-violet-200 dark:bg-slate-800 dark:border-violet-500/30',
    human:  'bg-slate-50 border-slate-300 border-dashed dark:bg-slate-800/50 dark:border-slate-600',
    num:    'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    title:  'text-slate-900 dark:text-white',
    sub:    'text-violet-700 dark:text-violet-300',
    desc:   'text-slate-500 dark:text-slate-400',
    arrow:  'text-violet-300 dark:text-violet-500/60',
  },
  onDark: {
    box:    'bg-white/[0.04] border-violet-500/40 backdrop-blur-sm',
    human:  'bg-white/[0.02] border-slate-600 border-dashed',
    num:    'bg-violet-500/25 text-violet-200',
    title:  'text-white',
    sub:    'text-violet-300',
    desc:   'text-slate-400',
    arrow:  'text-violet-500/60',
  },
}

const NUMERALS = ['①', '②', '③', '④', '⑤', '⑥']

export default function AgentFlow({ steps, tone = 'onLight' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()
  const c = TONES[tone] ?? TONES.onLight

  return (
    <div ref={ref} className="flex flex-col">
      {steps.map((step, i) => (
        <div key={step.title}>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 260, damping: 24, delay: i * 0.12 }
            }
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${step.human ? c.human : c.box}`}
          >
            <span
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold
                ${step.human ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300' : c.num}`}
            >
              {step.human ? <UserCheck size={15} /> : NUMERALS[i] ?? i + 1}
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-bold leading-snug ${c.title}`}>{step.title}</p>
              <p className={`text-xs mt-0.5 leading-snug ${step.human ? c.desc : c.sub}`}>{step.subtitle}</p>
              {step.desc && (
                <p className={`text-xs mt-1.5 leading-relaxed ${c.desc}`}>{step.desc}</p>
              )}
            </div>
          </motion.div>

          {i < steps.length - 1 && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={reduceMotion ? { duration: 0 } : { delay: i * 0.12 + 0.08 }}
              className="flex justify-center py-1.5"
            >
              <ArrowDown size={16} className={c.arrow} />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  )
}
