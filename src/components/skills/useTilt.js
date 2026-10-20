import { useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

// Pointer-driven 3D tilt + light follow. Mouse only; disabled for touch and reduced motion.
export default function useTilt(max = 7, disabled = false) {
  const rx = useMotionValue(0), ry = useMotionValue(0), mx = useMotionValue(50), my = useMotionValue(50)
  const cfg = { stiffness: 220, damping: 20, mass: 0.4 }
  const sx = useSpring(rx, cfg), sy = useSpring(ry, cfg)
  const glare = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, rgba(255,130,90,.16), transparent 62%)`
  const edge = useMotionTemplate`radial-gradient(150px circle at ${mx}% ${my}%, #FF4528, rgba(255,69,40,0) 70%)`
  const onMove = e => {
    if (disabled || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * 2 * max); rx.set(-(py - 0.5) * 2 * max); mx.set(px * 100); my.set(py * 100)
  }
  const reset = () => { rx.set(0); ry.set(0) }
  return { rx: sx, ry: sy, glare, edge, onMove, reset }
}
