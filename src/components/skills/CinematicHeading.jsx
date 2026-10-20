import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const words = [['Skills', 0], ['&', 0], ['learning', 1], ['paths', 1]]
const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } } }
const letter = {
  hidden: { opacity: 0, y: '0.6em', rotateX: -75, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] } },
}

// Letters rise out of blur with a 3D flip when the heading scrolls into view.
export default function CinematicHeading({ reduce }) {
  const ref = useRef(null), inView = useInView(ref, { once: true, amount: 0.6 })
  const on = reduce || inView
  return (
    <div ref={ref}>
      <h2 aria-label="Skills & learning paths" className="h-display text-5xl sm:text-6xl lg:text-7xl [perspective:800px]">
        <motion.span aria-hidden="true" variants={wrap} initial={reduce ? false : 'hidden'} animate={on ? 'show' : 'hidden'} className="flex flex-wrap gap-x-[0.28em]">
          {words.map(([w, accent]) => (
            <span key={w} className="inline-flex">
              {[...w].map((c, i) => <motion.span key={i} variants={letter} style={{ transformOrigin: '50% 100%' }} className={`inline-block ${accent ? 'depth-accent' : 'depth-text'}`}>{c}</motion.span>)}
            </span>
          ))}
        </motion.span>
      </h2>
      <motion.div aria-hidden="true" initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: on ? 1 : 0 }} transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
        style={{ transformOrigin: 'left' }} className="mt-5 h-px w-40 bg-gradient-to-r from-accent via-accent/50 to-transparent shadow-[0_0_12px_#FF4528]" />
      <motion.p initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 14 }} transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-5 max-w-xl text-white/70">Five paths I’m building across, from interfaces and servers to networks, AI and security. Pick one to see how the pieces connect.</motion.p>
    </div>
  )
}
