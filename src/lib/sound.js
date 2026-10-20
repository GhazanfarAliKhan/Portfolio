// Typing-sound engine, synthesized with the Web Audio API (no audio files to load or fail).
// Browsers block audio until a user gesture. To keep the console clean we do NOT create an
// AudioContext early unless the browser explicitly reports autoplay as allowed
// (navigator.getAutoplayPolicy). Otherwise the first click, tap or keypress unlocks audio and
// the intro replays once so the sound is heard.
let ctx = null, master = null, noise = null, unlocked = false, startedSilent = true

function init() {
  if (ctx) return true
  const AC = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
  if (!AC) return false                       // no audio support: visuals still work
  try {
    ctx = new AC()
    master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination)
    const len = Math.floor(ctx.sampleRate * 0.06)   // short noise burst, built once
    noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
    return true
  } catch { ctx = null; return false }
}

const EVENTS = ['pointerdown', 'click', 'keydown', 'touchstart']
function stopListening() { EVENTS.forEach(e => window.removeEventListener(e, unlock)) }

function unlock() {
  if (unlocked) return stopListening()
  if (!init()) return
  const done = () => {
    if (ctx.state !== 'running' || unlocked) return
    unlocked = true; stopListening()
    // Intro already played silently: replay it once (if the visitor is still at the top).
    if (startedSilent && window.scrollY < 200) window.dispatchEvent(new Event('gk:replay-intro'))
  }
  if (ctx.state === 'running') done()
  else ctx.resume().then(done).catch(() => {})
}

export function playTick(i = 0) {
  if (!unlocked || !ctx || ctx.state !== 'running') return
  const t = ctx.currentTime, v = 1 + (Math.random() - 0.5) * 0.12
  const src = ctx.createBufferSource(); src.buffer = noise
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = (3200 + (i % 4) * 140) * v; bp.Q.value = 1.1
  const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
  src.connect(bp).connect(g).connect(master); src.start(t)
  const o = ctx.createOscillator(); o.type = 'sine'
  o.frequency.setValueAtTime(900 * v, t); o.frequency.exponentialRampToValueAtTime(380, t + 0.04)
  const og = ctx.createGain(); og.gain.setValueAtTime(0.0001, t)
  og.gain.exponentialRampToValueAtTime(0.06, t + 0.004); og.gain.exponentialRampToValueAtTime(0.0001, t + 0.06)
  o.connect(og).connect(master); o.start(t); o.stop(t + 0.07)
}

if (typeof window !== 'undefined') {
  // Only start immediately when the browser says audio is already allowed for this site.
  let allowed = false
  try { allowed = navigator.getAutoplayPolicy?.('audiocontext') === 'allowed' } catch { /* unsupported: wait for a gesture */ }
  if (allowed && init() && ctx.state === 'running') { unlocked = true; startedSilent = false }
  else EVENTS.forEach(e => window.addEventListener(e, unlock, { passive: true }))
}
