import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/** 捲到畫面內淡入上浮。once: true 避免來回捲動重複播放。 */
export default function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 250, damping: 22, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
