import { motion } from 'framer-motion'

const wrap = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } }
const word = {
  hidden: { opacity: 0, y: '0.65em', rotateX: -50, filter: 'blur(10px)' },
  show: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] } },
}

// parts: ['More than code.', 'A mindset.']; the last part gets the accent treatment. Reveals word by word.
export default function AboutHeading({ parts, on, reduce }) {
  const label = parts.join(' ')
  const words = parts.flatMap((p, i) => p.split(' ').map(w => [w, i === parts.length - 1]))
  return (
    <h2 aria-label={label} className="h-display text-5xl sm:text-6xl lg:text-7xl [perspective:800px]">
      <motion.span aria-hidden="true" variants={wrap} initial={reduce ? false : 'hidden'} animate={on ? 'show' : 'hidden'} className="block">
        {words.map(([w, accent], i) => (
          <span key={i}><motion.span variants={word} style={{ transformOrigin: '50% 100%' }} className={`inline-block ${accent ? 'depth-accent' : 'depth-text'}`}>{w}</motion.span>{i < words.length - 1 && ' '}</span>
        ))}
      </motion.span>
    </h2>
  )
}
