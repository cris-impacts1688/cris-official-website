import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

/**
 * 捲到畫面內淡入上浮。once: true 避免來回捲動重複播放。
 * 使用者若在系統開啟「減少動態效果」，直接顯示不做動畫。
 */
export default function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 250, damping: 22, delay }
      }
      className={className}
    >
      {children}
    </motion.div>
  )
}
