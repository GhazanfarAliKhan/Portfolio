import { useRef } from 'react'
import { motion } from 'framer-motion'
import { splitName } from './utils'

// Accessible tablist: arrow keys, Home/End, roving tabindex, sliding highlight.
export default function CategoryTabs({ names, icons, counts, index, onChange, idBase, reduce }) {
  const refs = useRef([])
  const onKey = (e, i) => {
    const last = names.length - 1; let n
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = i === last ? 0 : i + 1
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = i === 0 ? last : i - 1
    else if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = last
    else return
    e.preventDefault(); onChange(n); refs.current[n]?.focus()
  }
  return (
    <div role="tablist" aria-label="Skill categories" className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 py-1">
      {names.map((name, i) => {
        const [main, sub] = splitName(name), on = i === index, Icon = icons[i]
        return (
          <button key={name} ref={el => (refs.current[i] = el)} role="tab" type="button" id={`${idBase}-tab-${i}`} aria-selected={on} aria-controls={`${idBase}-panel`} tabIndex={on ? 0 : -1}
            onClick={() => onChange(i)} onKeyDown={e => onKey(e, i)}
            className={`relative min-h-[3.25rem] shrink-0 snap-start rounded-xl px-4 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent ${on ? 'text-white' : 'text-white/70 hover:text-white'}`}>
            {on && <motion.span layoutId={`${idBase}-pill`} transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-xl border border-accent/50 bg-gradient-to-b from-accent/25 to-accent/5 shadow-[0_0_24px_#FF452840]" />}
            <span className="relative flex items-center gap-2.5">
              <Icon size={18} className={on ? 'text-accent' : 'text-white/60'} aria-hidden="true" />
              <span>
                <span className="block font-display text-lg font-bold uppercase leading-none tracking-wide">{main}</span>
                <span className="mt-1 block text-[11px] leading-none text-white/60">{sub || `${counts[i]} skills`}{sub && ` · ${counts[i]}`}</span>
              </span>
            </span>
          </button>)
      })}
    </div>
  )
}
