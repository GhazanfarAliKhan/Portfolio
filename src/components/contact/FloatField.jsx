import { useEffect } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

// Floating-label field: label glides up on focus/fill, orange glow when active, shake + message on error.
export default function FloatField({ id, label, type = 'text', value, onChange, error, nonce, multiline, rows = 5, autoComplete, reduce }) {
  const ctrl = useAnimationControls()
  useEffect(() => { if (nonce && error && !reduce) ctrl.start({ x: [0, -7, 7, -5, 5, 0], transition: { duration: 0.4 } }) }, [nonce]) // eslint-disable-line
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div>
      <motion.div animate={ctrl} className={`group relative rounded-xl border bg-black/40 transition-[border-color,box-shadow] duration-300 ${error
        ? 'border-red-400/80 focus-within:shadow-[0_0_0_1px_#f87171,0_0_22px_#f8717140]'
        : 'border-white/15 hover:border-white/30 focus-within:border-accent focus-within:shadow-[0_0_0_1px_#FF4528,0_0_26px_#FF452840]'}`}>
        <Tag id={id} name={id} type={multiline ? undefined : type} rows={multiline ? rows : undefined} value={value} onChange={onChange} placeholder=" " autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={`${id}-e`}
          className={`peer block w-full rounded-xl bg-transparent px-4 pb-2 pt-6 text-white outline-none placeholder-transparent ${multiline ? 'resize-y' : ''}`} />
        <label htmlFor={id} className={`pointer-events-none absolute left-4 top-[1.05rem] origin-left transition-all duration-200 peer-focus:-translate-y-3 peer-focus:scale-[.78] peer-[:not(:placeholder-shown)]:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-[.78] ${error ? 'text-red-300' : 'text-white/60 peer-focus:text-accent'}`}>{label}</label>
      </motion.div>
      <div id={`${id}-e`}>
        <AnimatePresence initial={false}>
          {error && <motion.p key={error} initial={{ opacity: 0, height: 0, y: -4 }} animate={{ opacity: 1, height: 'auto', y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}
            className="flex items-center gap-1.5 overflow-hidden pt-1.5 text-xs text-red-300"><AlertCircle size={13} aria-hidden="true" className="shrink-0" />{error}</motion.p>}
        </AnimatePresence>
      </div>
    </div>
  )
}
