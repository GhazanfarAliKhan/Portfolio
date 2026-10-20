import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { AlertCircle, CheckCircle2, Copy, Check } from 'lucide-react'
import { isSafeEndpoint, site } from '../data/site'
import LightStreakHeading from './contact/LightStreakHeading'
import EmailPanel from './contact/EmailPanel'
import SocialCards from './contact/SocialCards'
import FloatField from './contact/FloatField'
import SendButton from './contact/SendButton'
import Magnetic from './contact/Magnetic'
import ParticleField from './skills/ParticleField'

const fields = [['name', 'Full name', 'text', 'name'], ['email', 'Email address', 'email', 'email'], ['subject', 'Subject', 'text', 'off']]
const up = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.2, 0.8, 0.2, 1] } } }
const stagger = (d = 0.1, s = 0.09) => ({ hidden: {}, show: { transition: { delayChildren: d, staggerChildren: s } } })
const empty = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false), [v, setV] = useState(empty), [err, setErr] = useState({}), [state, setState] = useState({ s: 'idle' }), [attempt, setAttempt] = useState(0)
  const sectionRef = useRef(null), leftRef = useRef(null), formRef = useRef(null)
  const leftIn = useInView(leftRef, { once: true, amount: 0.2 }), formIn = useInView(formRef, { once: true, amount: 0.15 })
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const blobY = useTransform(scrollYProgress, [0, 1], [-60, 80])

  // ---- unchanged behavior: validation, submission, clipboard ----
  const validate = () => { const e = {}; if (v.name.trim().length < 2) e.name = 'Enter your full name.'; if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Enter a valid email address.'; if (v.subject.trim().length < 3) e.subject = 'Enter a subject.'; if (v.message.trim().length < 10) e.message = 'Message must be at least 10 characters.'; return e }
  const submit = async ev => {
    ev.preventDefault(); if (state.s === 'sending') return
    const e = validate(); setErr(e); setAttempt(a => a + 1)
    const first = Object.keys(e)[0]; if (first) { document.getElementById(first)?.focus(); return }
    if (!site.formEndpoint) return setState({ s: 'error', m: 'Message not sent: no form service is configured yet. Email me directly instead.' })
    if (!isSafeEndpoint(site.formEndpoint)) return setState({ s: 'error', m: 'Message not sent: the form service URL must start with https://. Email me directly instead.' })
    setState({ s: 'sending' })
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000)   // never get stuck on "Sending"
    // Ask the server first whether it can send email. If it can't (no password set yet, or it isn't running),
    // open the visitor's email app with the message pre-filled instead of sending a request that is bound to fail.
    let ready = false
    try {
      const h = await fetch(site.formEndpoint.replace(/\/contact\/?$/, '/health'), { signal: ctrl.signal, credentials: 'omit', referrerPolicy: 'no-referrer' })
      if (h.ok) ready = (await h.json())?.emailConfigured === true
    } catch { /* server unreachable: use the email fallback below */ }
    if (!ready) {
      clearTimeout(timer)
      const q = `subject=${encodeURIComponent(v.subject.trim())}&body=${encodeURIComponent(`${v.message.trim()}\n\n${v.name.trim()}\n${v.email.trim()}`)}`
      window.location.href = `mailto:${site.email}?${q}`
      return setState({ s: 'mail' })
    }
    try {
      const r = await fetch(site.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(v), signal: ctrl.signal, credentials: 'omit', referrerPolicy: 'no-referrer' })
      if (!r.ok) {   // show the server's own short message (e.g. "Too many messages...") when it sends one
        let m; try { const j = await r.json(); if (typeof j?.error === 'string' && j.error.length < 200) m = j.error } catch { /* not JSON */ }
        throw Object.assign(new Error('send failed'), { m })
      }
      setState({ s: 'ok' }); setV(empty)
    } catch (err) { setState({ s: 'error', m: err?.m || 'Message could not be sent. Please try again or email me directly.' }) }
    finally { clearTimeout(timer) }
  }
  const copy = async () => { try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { window.prompt('Copy this email:', site.email) } }
  // ---------------------------------------------------------------
  const edit = k => e => {
    setV(p => ({ ...p, [k]: e.target.value })); if (err[k]) setErr(p => ({ ...p, [k]: undefined }))
    if (state.s === 'ok' || state.s === 'error' || state.s === 'mail') setState({ s: 'idle' })
  }
  const toForm = () => setTimeout(() => document.getElementById('name')?.focus({ preventScroll: true }), 600)

  return (
    <section id="contact" ref={sectionRef} className="relative isolate overflow-x-clip">
      {/* cinematic lighting */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0f] to-transparent" />
      <motion.div aria-hidden="true" style={reduce ? undefined : { y: blobY }} className="absolute -right-32 top-10 -z-10 size-[36rem]"><div className="drift size-full rounded-full bg-[radial-gradient(closest-side,#FF45282b,transparent)]" /></motion.div>
      <motion.div aria-hidden="true" style={reduce ? undefined : { y: blobY }} className="absolute -left-40 bottom-0 -z-10 size-[30rem] rounded-full bg-[radial-gradient(closest-side,#FF6a4a14,transparent)]" />
      <div aria-hidden="true" className="skills-grid absolute inset-0 -z-10 opacity-70" />
      <ParticleField count={16} reduce={reduce} className="absolute inset-0 -z-10 h-full w-full opacity-50" />

      <div className="section grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* ---------- left: introduction ---------- */}
        <div ref={leftRef}>
          <LightStreakHeading reduce={reduce} />
          <motion.div variants={stagger(0.6, 0.12)} initial={reduce ? false : 'hidden'} animate={leftIn || reduce ? 'show' : 'hidden'}>
            <motion.p variants={up} className="mt-6 max-w-lg text-white/70">Whether you&apos;re a client, recruiter or collaborator, I&apos;d like to hear from you. Send a message or email me directly.</motion.p>
            <motion.div variants={up} className="mt-8"><EmailPanel email={site.email} copied={copied} onCopy={copy} reduce={reduce} /></motion.div>
            <motion.div variants={up} className="mt-5 flex flex-wrap gap-3">
              <Magnetic as="a" href="#contact-form" onClick={toForm} reduce={reduce} className="btn-primary">GET IN TOUCH</Magnetic>
              <Magnetic as="button" type="button" onClick={copy} reduce={reduce} className="btn-ghost transition-colors hover:bg-accent/10">
                {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'COPIED' : 'COPY EMAIL'}
              </Magnetic>
            </motion.div>
            <motion.div variants={up} className="mt-10">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">Find me online</p>
              <motion.div variants={stagger(0, 0.08)}><SocialCards reduce={reduce} /></motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* ---------- right: form ---------- */}
        <div ref={formRef} className="relative isolate">
          <div aria-hidden="true" className="absolute inset-x-5 -bottom-3 top-6 -z-10 rounded-[2rem] border border-white/5 bg-white/[0.02]" />
          <div aria-hidden="true" className="absolute inset-x-10 -bottom-6 top-12 -z-20 rounded-[2rem] border border-white/5 bg-white/[0.015]" />
          <div className="glass-panel relative rounded-[2rem]">
            <span aria-hidden="true" className="edge-light" />
            <motion.form id="contact-form" onSubmit={submit} noValidate variants={stagger(0.1, 0.1)} initial={reduce ? false : 'hidden'} animate={formIn || reduce ? 'show' : 'hidden'} className="relative space-y-4 p-5 sm:p-8">
              <motion.div variants={up}>
                <h3 className="font-display text-3xl font-bold uppercase tracking-wide">Send a message</h3>
                <p className="mt-1 text-sm text-white/60">All fields are required.</p>
              </motion.div>
              {fields.map(([k, l, t, ac]) => (
                <motion.div key={k} variants={up}><FloatField id={k} label={l} type={t} autoComplete={ac} value={v[k]} onChange={edit(k)} error={err[k]} nonce={attempt} reduce={reduce} /></motion.div>
              ))}
              <motion.div variants={up}><FloatField id="message" label="Message" multiline value={v.message} onChange={edit('message')} error={err.message} nonce={attempt} reduce={reduce} /></motion.div>
              <motion.div variants={up} className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center">
                <SendButton status={state.s} reduce={reduce} />
                <div role="status" aria-live="polite" className="min-h-[1.5rem] flex-1 text-sm">
                  <AnimatePresence mode="wait" initial={false}>
                    {state.s === 'ok' && <motion.p key="ok" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-emerald-300"><CheckCircle2 size={18} aria-hidden="true" className="shrink-0" />Message sent. Thank you!</motion.p>}
                    {state.s === 'mail' && <motion.p key="ml" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-white/80"><AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" /><span>Your email app should open with the message ready. Press send there to deliver it.</span></motion.p>}
                    {state.s === 'error' && <motion.p key="er" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 text-red-300"><AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" /><span>{state.m}{' '}<a href={`mailto:${site.email}`} className="underline underline-offset-2 hover:text-white">Email me</a></span></motion.p>}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </div>
    </section>
  )
}
