import { motion } from 'framer-motion'

// Toggle buttons (aria-pressed) with a shared-layout indicator that glides between filters.
export default function FilterBar({ cats, counts, value, onChange, reduce }) {
  return (
    <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
      {cats.map(c => {
        const on = value === c
        return (
          <button key={c} type="button" aria-pressed={on} onClick={() => onChange(c)}
            className={`relative rounded-full border px-4 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0d] ${on ? 'border-transparent text-white' : 'border-white/15 text-white/70 hover:border-white/40 hover:text-white'}`}>
            {on && <motion.span layoutId="work-filter-pill" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
              className="absolute inset-0 rounded-full border border-accent bg-accent/15 shadow-[0_0_22px_#FF452850]" />}
            <span className="relative flex items-center gap-2">{c}<span className={`rounded-full px-1.5 text-[11px] leading-5 ${on ? 'bg-accent/30 text-white' : 'bg-white/10 text-white/70'}`}>{counts[c]}</span></span>
          </button>)
      })}
    </div>
  )
}
