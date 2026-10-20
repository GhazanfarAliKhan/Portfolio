import { useEffect, useMemo, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { playTick } from '../lib/sound'

// Reveals `text` letter by letter (scale + fade + rise + neon glow) with a soft tick per letter.
export default function AnimatedName({
  text, as: Tag = 'h1', className = '', stagger = 75, spaceExtra = 170, delay = 450,
  active = true, runKey = 0, onDone,
}) {
  const reduce = useReducedMotion()
  const root = useRef(null)
  const done = useRef(onDone)
  useEffect(() => { done.current = onDone })   // keep the latest callback without writing refs during render
  const words = useMemo(() => text.split(' '), [text])
  const total = text.replace(/ /g, '').length
  let n = 0

  useEffect(() => {
    const items = [...root.current.querySelectorAll('[data-s]')]
    items.forEach(el => el.classList.remove('in'))
    if (!active) return
    if (reduce) { items.forEach(el => el.classList.add('in')); done.current?.(); return }
    const timers = []; let t = delay, k = 0
    items.forEach(el => {
      const space = el.dataset.s === 'space'
      timers.push(setTimeout(() => { el.classList.add('in'); if (!space) playTick(k++) }, t))
      t += space ? spaceExtra + stagger : stagger
    })
    timers.push(setTimeout(() => done.current?.(), t + 250))
    return () => timers.forEach(clearTimeout)
  }, [runKey, reduce, active, delay, spaceExtra, stagger])

  return (
    <Tag ref={root} aria-label={text} className={`flex flex-wrap ${className}`}>
      {words.map((w, wi) => (
        <span key={wi} className="flex" aria-hidden="true">
          <span className="flex whitespace-nowrap">
            {[...w].map((c, ci) => <span key={ci} data-s="ch" className="name-ch" style={{ '--h': Math.round(8 + (n++ / Math.max(total - 1, 1)) * 28) }}>{c}</span>)}
          </span>
          {wi < words.length - 1 && <span data-s="space" className="name-space" />}
        </span>
      ))}
    </Tag>
  )
}
