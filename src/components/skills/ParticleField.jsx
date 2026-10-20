import { useEffect, useRef } from 'react'

// Lightweight canvas particles: few dots, faint links, paused when off-screen or tab hidden.
export default function ParticleField({ count = 30, reduce = false, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv?.getContext('2d'); if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5), n = window.innerWidth < 640 ? Math.round(count * 0.5) : count
    let w = 0, h = 0, raf = 0, visible = true, ps = []
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i]
        ctx.fillStyle = `rgba(255,115,75,${p.a})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill()
        for (let j = i + 1; j < ps.length; j++) {
          const q = ps[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy)
          if (d < 120) { ctx.strokeStyle = `rgba(255,90,60,${0.12 * (1 - d / 120)})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
        }
      }
    }
    const step = () => {
      for (const p of ps) { p.x += p.vx; p.y += p.vy; if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w } if (p.x < -4) p.x = w + 4; if (p.x > w + 4) p.x = -4 }
      draw(); raf = requestAnimationFrame(step)
    }
    const run = () => { cancelAnimationFrame(raf); if (!reduce && visible && !document.hidden) raf = requestAnimationFrame(step) }
    const resize = () => {
      const r = cv.getBoundingClientRect(); w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!ps.length) ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 0.6 + Math.random() * 1.5, vx: (Math.random() - 0.5) * 0.16, vy: -0.05 - Math.random() * 0.18, a: 0.25 + Math.random() * 0.45 }))
      draw()
    }
    let rz = 0; const ro = new ResizeObserver(() => { cancelAnimationFrame(rz); rz = requestAnimationFrame(resize) }); ro.observe(cv)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; run() }); io.observe(cv)
    document.addEventListener('visibilitychange', run)
    resize(); run()
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(rz); ro.disconnect(); io.disconnect(); document.removeEventListener('visibilitychange', run) }
  }, [count, reduce])
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none ${className}`} />
}
