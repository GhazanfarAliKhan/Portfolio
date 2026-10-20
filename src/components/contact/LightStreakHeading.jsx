import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const words = ["Let's", 'build', 'something', 'great.']
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } } }
const word = {
  hidden: { opacity: 0, y: '0.7em', rotateX: -45, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } },
}
const STREAK = 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,.95) 47%, rgba(255,170,130,.9) 53%, transparent 65%)'
const cls = 'h-display text-5xl sm:text-6xl lg:text-7xl'

// Staggered word reveal; "great." carries a living orange gradient; a light streak sweeps once across the text.
export default function LightStreakHeading({ reduce }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, amount: 0.5 }), on = reduce || inView
  return (
    <div ref={ref} className="relative">
      <h2 aria-label="Let's build something great." className={`${cls} [perspective:800px]`}>
        <motion.span aria-hidden="true" variants={wrap} initial={reduce ? false : 'hidden'} animate={on ? 'show' : 'hidden'} className="block">
          {words.map((w, i) => (
            <span key={w}>
              <motion.span variants={word} style={{ transformOrigin: '50% 100%' }} className={`inline-block ${i === 3 ? '' : 'depth-text'}`}>{i === 3 ? <span className="great-glow">{w}</span> : w}</motion.span>{i < 3 && ' '}
            </span>
          ))}
        </motion.span>
      </h2>
      {/* light streak: same text, transparent except for a travelling highlight */}
      {!reduce && (
        <motion.div aria-hidden="true" initial={{ backgroundPosition: '100% 0' }} animate={on ? { backgroundPosition: '0% 0' } : undefined} transition={{ duration: 1.5, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundImage: STREAK, backgroundSize: '250% 100%', backgroundRepeat: 'no-repeat', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          className={`${cls} pointer-events-none absolute inset-0 select-none`}>{words.join(' ')}</motion.div>
      )}
    </div>
  )
}
