import { config as loadDotenv } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const DEFAULT_TO = 'ghazanfaralikhan62@gmail.com'

const num = (v, d) => (v !== undefined && v !== '' && Number.isFinite(Number(v)) ? Number(v) : d)
const list = v => String(v || '').split(',').map(s => s.trim()).filter(Boolean)

// All settings come from environment variables (see .env.example). Pass a custom `env` object in tests.
export function loadConfig(env = process.env) {
  const host = env.SMTP_HOST || 'smtp.gmail.com'
  const user = (env.SMTP_USER || '').trim()
  // Gmail shows app passwords as "abcd efgh ijkl mnop"; the spaces are not part of the password.
  const pass = /gmail\.com$/i.test(host) ? (env.SMTP_PASS || '').replace(/\s+/g, '') : env.SMTP_PASS || ''
  const tp = env.TRUST_PROXY
  return {
    port: num(env.PORT, 8787),
    to: (env.CONTACT_TO || DEFAULT_TO).trim(),
    from: (env.MAIL_FROM || user).trim(),
    smtp: { host, port: num(env.SMTP_PORT, 465), secure: String(env.SMTP_SECURE ?? 'true').toLowerCase() !== 'false', user, pass },
    allowedOrigins: list(env.ALLOWED_ORIGIN),
    trustProxy: tp === undefined || tp === '' || tp === 'false' ? false : tp === 'true' ? 1 : Number.isFinite(Number(tp)) ? Number(tp) : tp,
    rate: { windowMs: num(env.RATE_WINDOW_MINUTES, 15) * 60_000, max: num(env.RATE_MAX, 5) },
    distDir: env.DIST_DIR ? path.resolve(env.DIST_DIR) : path.join(root, 'dist'),
  }
}
export const emailConfigured = c => Boolean(c.smtp.user && c.smtp.pass && c.from)
export { loadDotenv }
