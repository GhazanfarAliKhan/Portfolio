import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const words = [['My', 0], ['work', 1]]
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } }
const word = {
  hidden: { opacity: 0, y: '0.65em', rotateX: -50, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.2, 0.8, 0.2, 1] } },
}

// Staggered word reveal, a glowing line that draws in, then the subtitle. Plays once.
export default function WorkHeading({ reduce }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, amount: 0.6 }), on = reduce || inView
  return (
    <div ref={ref}>
      <h2 aria-label="My work" className="h-display text-5xl sm:text-6xl lg:text-7xl [perspective:800px]">
        <motion.span aria-hidden="true" variants={wrap} initial={reduce ? false : 'hidden'} animate={on ? 'show' : 'hidden'} className="block">
          {words.map(([w, accent], i) => <span key={w}><motion.span variants={word} style={{ transformOrigin: '50% 100%' }} className={`inline-block ${accent ? 'depth-accent' : 'depth-text'}`}>{w}</motion.span>{i < words.length - 1 && ' '}</span>)}
        </motion.span>
      </h2>
      <motion.div aria-hidden="true" initial={reduce ? false : { scaleX: 0, opacity: 0 }} animate={{ scaleX: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 1, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: 'left' }} className="mt-5 h-[2px] w-48 rounded-full bg-gradient-to-r from-accent via-orange-400 to-transparent shadow-[0_0_16px_#FF4528]" />
      <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }} transition={{ duration: 0.8, delay: 0.75, ease: 'easeOut' }}
        className="mt-5 max-w-xl text-white/70">Selected projects across web development, networking and AI. Some are still in progress.</motion.p>
    </div>
  )
}
