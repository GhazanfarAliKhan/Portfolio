import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Mail } from 'lucide-react'

// Email address in a glowing panel: the link opens mail, the icon button copies.
export default function EmailPanel({ email, copied, onCopy, reduce }) {
  return (
    <div className="relative rounded-2xl">
      <motion.span aria-hidden="true" animate={reduce ? undefined : { opacity: [0.35, 0.75, 0.35] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -inset-1 rounded-[1.25rem] bg-accent/25 blur-xl" />
      <span aria-hidden="true" className="edge-static rounded-2xl" />
      <div className="relative flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#1b1210]/95 to-[#0d0d10]/95 p-3 sm:gap-4 sm:p-4">
        <span className="tech-tile grid size-12 shrink-0 place-items-center"><Mail size={22} className="text-accent drop-shadow-[0_0_8px_#FF4528aa]" strokeWidth={1.8} aria-hidden="true" /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">Email me</p>
          <a href={`mailto:${email}`} className="block break-all text-lg font-semibold text-accent transition hover:text-orange-300 hover:underline sm:text-xl">{email}</a>
        </div>
        <div className="relative shrink-0">
          <AnimatePresence>
            {copied && <motion.span aria-hidden="true" initial={{ opacity: 0, y: 6, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}
              className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-md border border-accent/40 bg-black/90 px-2.5 py-1 text-xs text-white">Copied!</motion.span>}
          </AnimatePresence>
          <motion.button type="button" onClick={onCopy} whileTap={{ scale: 0.88 }} whileHover={reduce ? undefined : { scale: 1.08 }} aria-label={copied ? 'Email address copied' : 'Copy email address'}
            className={`relative grid size-11 place-items-center rounded-xl border transition-colors ${copied ? 'border-accent bg-accent/20 text-accent' : 'border-white/15 text-white/80 hover:border-accent hover:text-accent'}`}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={copied ? 'ok' : 'cp'} initial={{ scale: 0.4, opacity: 0, rotate: -40 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0 }} transition={{ duration: 0.18 }}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
      <span className="sr-only" role="status" aria-live="polite">{copied ? 'Email address copied to clipboard' : ''}</span>
    </div>
  )
}
