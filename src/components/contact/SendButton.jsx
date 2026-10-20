import { motion } from 'framer-motion'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

// idle -> sending -> (ok | back to idle on error). "Sent" is shown only for a real success.
export default function SendButton({ status, reduce }) {
  const sending = status === 'sending', ok = status === 'ok'
  const label = sending ? 'SENDING…' : ok ? 'SENT' : 'SEND MESSAGE'
  return (
    <motion.button type="submit" disabled={sending} aria-busy={sending} whileTap={{ scale: 0.97 }} whileHover={reduce || sending ? undefined : { scale: 1.02 }}
      className={`group relative flex w-full items-center justify-center overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold tracking-wide text-white transition-[box-shadow,background-color] duration-300 disabled:cursor-wait sm:w-auto sm:min-w-[13rem] ${ok ? 'bg-emerald-600 shadow-[0_0_28px_#10b98166]' : 'bg-gradient-to-r from-accent to-orange-500 shadow-[0_0_24px_#FF452866] hover:shadow-[0_0_40px_#FF4528aa]'} ${sending ? 'opacity-80' : ''}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 blur-[2px] transition-transform duration-700 ease-out group-hover:translate-x-[420%]" />
      {/* keyed fade-in only (no exit animation), so the label can never get stuck on a stale state */}
      <motion.span key={status} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="relative inline-flex items-center gap-2.5">
        {label}
        {sending ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : ok ? <Check size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1.5" />}
      </motion.span>
    </motion.button>
  )
}
