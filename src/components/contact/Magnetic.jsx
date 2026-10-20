import { motion, useMotionValue, useSpring } from 'framer-motion'

// Button/link that leans toward the cursor (mouse only) with spring physics and a press response.
export default function Magnetic({ as = 'button', strength = 0.28, reduce, className = '', children, ...rest }) {
  const Comp = motion[as]
  const x = useMotionValue(0), y = useMotionValue(0), cfg = { stiffness: 240, damping: 16, mass: 0.5 }
  const sx = useSpring(x, cfg), sy = useSpring(y, cfg)
  const move = e => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength); y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }
  return (
    <Comp {...rest} style={{ x: sx, y: sy, transitionProperty: 'background-color,border-color,box-shadow,color,opacity' }} onPointerMove={move} onPointerLeave={leave} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={`group relative overflow-hidden ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 blur-[2px] transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </Comp>
  )
}
