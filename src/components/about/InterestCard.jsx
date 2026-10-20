import { motion } from 'framer-motion'
import useTilt from '../skills/useTilt'

// Interest / learning-path card: spring lift, pointer-following edge light, quiet icon motion.
export default function InterestCard({ Icon, title, desc, reduce, variants, custom }) {
  const tilt = useTilt(2, reduce)
  return (
    <motion.li variants={variants} custom={custom} className="[perspective:900px]">
      <motion.div style={{ rotateX: tilt.rx, rotateY: tilt.ry }} onPointerMove={tilt.onMove} onPointerLeave={tilt.reset}
        whileHover={reduce ? undefined : { y: -4 }} whileTap={{ scale: 0.985 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="skill-card group relative flex h-full items-center gap-4 rounded-2xl p-4 hover:border-accent/50">
        <motion.span aria-hidden="true" style={{ background: tilt.glare }} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <motion.span aria-hidden="true" style={{ background: tilt.edge }} className="edge-follow rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="tech-tile relative grid size-12 shrink-0 place-items-center transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
          <Icon size={22} className="text-accent drop-shadow-[0_0_8px_#FF4528aa]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="relative min-w-0">
          <span className="block font-display text-lg font-bold uppercase leading-tight tracking-wide">{title}</span>
          <span className="mt-0.5 block text-xs text-white/70">{desc}</span>
        </span>
      </motion.div>
    </motion.li>
  )
}
