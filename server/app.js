import fs from 'node:fs'
import path from 'node:path'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { validateContact } from './validate.js'

const json = (res, status, body) => res.status(status).json(body)

// createApp is separate from the listener so the whole server can be tested without opening a port.
export function createApp(config, { mailer = null, staticDir = null } = {}) {
  const app = express()
  app.disable('x-powered-by')
  if (config.trustProxy !== false) app.set('trust proxy', config.trustProxy)

  const crossOrigin = config.allowedOrigins.length > 0
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ['https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginResourcePolicy: { policy: crossOrigin ? 'cross-origin' : 'same-origin' },
  }))

  // Only needed when the frontend is hosted on a different origin than this API.
  if (crossOrigin) app.use('/api', cors({ origin: config.allowedOrigins, methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'], maxAge: 600 }))

  app.get('/api/health', (_req, res) => json(res, 200, { ok: true, emailConfigured: Boolean(mailer) }))

  const limiter = rateLimit({
    windowMs: config.rate.windowMs, limit: config.rate.max, standardHeaders: 'draft-7', legacyHeaders: false,
    handler: (_req, res) => json(res, 429, { ok: false, error: 'Too many messages from this connection. Please try again later or email me directly.' }),
  })

  app.post('/api/contact', limiter,
    (req, res, next) => (req.is('application/json') ? next() : json(res, 415, { ok: false, error: 'Content-Type must be application/json.' })),
    express.json({ limit: '20kb' }),
    async (req, res) => {
      const v = validateContact(req.body)
      if (!v.ok) return json(res, 400, { ok: false, error: Object.values(v.errors)[0], fields: v.errors })
      if (!mailer) return json(res, 503, { ok: false, error: 'The email service is not configured yet. Please email me directly.' })
      try {
        await mailer.send(v.value)
        return json(res, 200, { ok: true })                                   // only after the mail server accepted it
      } catch (err) {
        console.error(`[contact] send failed: ${err.code || err.name}${err.responseCode ? ' ' + err.responseCode : ''}`)   // never log visitor data
        return json(res, 502, { ok: false, error: 'Your message could not be sent. Please try again or email me directly.' })
      }
    })
  app.all('/api/contact', (_req, res) => { res.set('Allow', 'POST'); json(res, 405, { ok: false, error: 'Method not allowed.' }) })
  app.use('/api', (_req, res) => json(res, 404, { ok: false, error: 'Not found.' }))

  // Optional: serve the built frontend (dist/) from the same server, so no CORS or extra hosting is needed.
  const indexFile = staticDir && path.join(staticDir, 'index.html')
  if (indexFile && fs.existsSync(indexFile)) {
    app.use(express.static(staticDir, {
      index: false, dotfiles: 'ignore', maxAge: '1h',
      setHeaders: (res, file) => { if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable') },
    }))
    app.use((req, res, next) => {
      if ((req.method !== 'GET' && req.method !== 'HEAD') || !req.accepts('html')) return next()   // HEAD too: uptime monitors and hosts probe with it
      res.setHeader('Cache-Control', 'no-cache')
      res.sendFile(indexFile)
    })
  }

  // Error handler: never leak stack traces or internals.
  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.too.large') return json(res, 413, { ok: false, error: 'Message is too large.' })
    if (err?.type === 'entity.parse.failed' || err instanceof SyntaxError) return json(res, 400, { ok: false, error: 'Invalid JSON.' })
    console.error('[server] unexpected error:', err?.name || 'Error')
    return json(res, 500, { ok: false, error: 'Something went wrong.' })
  })
  return app
}
