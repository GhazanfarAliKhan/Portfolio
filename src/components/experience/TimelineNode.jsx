import { motion } from 'framer-motion'

// Dot on the timeline. Lit once the timeline has reached it; a single ring pulse plays when it becomes active.
export default function TimelineNode({ nodeRef, reached, active, reduce }) {
  return (
    <div className="relative z-10 flex justify-center pt-6 lg:col-start-2 lg:row-start-1">
      <span ref={nodeRef} aria-hidden="true"
        className={`relative grid size-5 place-items-center rounded-full border-2 bg-ink transition-[border-color,box-shadow] duration-500 ${reached ? 'border-accent shadow-[0_0_14px_#FF4528aa]' : 'border-white/25'}`}>
        <span className={`size-2 rounded-full transition-colors duration-500 ${reached ? 'bg-accent' : 'bg-white/25'}`} />
        {active && !reduce && <motion.span initial={{ scale: 1, opacity: 0.7 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="absolute inset-0 rounded-full border border-accent" />}
      </span>
    </div>
  )
}
