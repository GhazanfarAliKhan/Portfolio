import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const words = [['Learning', 0], ['journey', 1]]
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } } }
const word = {
  hidden: { opacity: 0, y: '0.65em', rotateX: -50, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.2, 0.8, 0.2, 1] } },
}

// Word-by-word cinematic reveal, played once when the heading scrolls into view.
export default function TimelineHeading({ reduce }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, amount: 0.6 }), on = reduce || inView
  return (
    <div ref={ref}>
      <h2 aria-label="Learning journey" className="h-display text-5xl sm:text-6xl lg:text-7xl [perspective:800px]">
        <motion.span aria-hidden="true" variants={wrap} initial={reduce ? false : 'hidden'} animate={on ? 'show' : 'hidden'} className="block">
          {words.map(([w, accent], i) => (
            <span key={w}><motion.span variants={word} style={{ transformOrigin: '50% 100%' }} className={`inline-block ${accent ? 'depth-accent' : 'depth-text'}`}>{w}</motion.span>{i < words.length - 1 && ' '}</span>
          ))}
        </motion.span>
      </h2>
      <motion.div aria-hidden="true" initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }} className="mt-5 h-px w-40 bg-gradient-to-r from-accent via-accent/50 to-transparent shadow-[0_0_12px_#FF4528]" />
      <motion.p initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 14 }} transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-5 max-w-xl text-white/70">Ongoing studies and skill-building paths, shown as focus areas rather than job history.</motion.p>
    </div>
  )
}
