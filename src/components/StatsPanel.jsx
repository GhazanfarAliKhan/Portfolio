import { motion } from 'framer-motion'
import { stats } from '../data/site'
// Sample numbers are never shown to visitors. Put your real numbers in site.js and set `placeholder: false` to show this panel.
export default function StatsPanel() {
  if (stats.placeholder) return null
  return (
    <dl className="glass grid grid-cols-2 divide-white/10 md:grid-cols-4 md:divide-x">
      {stats.items.map(([n, l], i) => (
        <motion.div key={l} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col-reverse p-6 text-center">
          <dt className="mt-1 text-[11px] uppercase tracking-widest text-white/60">{l}</dt>
          <dd className="font-display text-4xl font-extrabold">{n}</dd>
        </motion.div>
      ))}
    </dl>
  )
}
