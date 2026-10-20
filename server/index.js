import fs from 'node:fs'
import path from 'node:path'
import { createApp } from './app.js'
import { emailConfigured, loadConfig, loadDotenv } from './config.js'
import { createMailer } from './mailer.js'

loadDotenv({ quiet: true })                       // read .env if present (never committed)
const config = loadConfig()
const mailer = createMailer(config)
const serveDist = fs.existsSync(path.join(config.distDir, 'index.html'))
const app = createApp(config, { mailer, staticDir: serveDist ? config.distDir : null })

const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}  (POST /api/contact -> ${config.to})`)
  if (serveDist) console.log(`Serving the built website from ${config.distDir}`)
  if (!emailConfigured(config)) console.warn('WARNING: SMTP_USER / SMTP_PASS are not set, so messages cannot be sent yet. Copy .env.example to .env and fill them in.')
})
// Check the SMTP login once at startup so a wrong password shows up immediately, not on the first visitor.
mailer?.verify().then(() => console.log('SMTP login OK: ready to send email.')).catch(e => console.error(`SMTP check FAILED (${e.code || e.message}). Messages will not be delivered until this is fixed.`))

for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => server.close(() => process.exit(0)))
