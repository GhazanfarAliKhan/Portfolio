// End-to-end tests for the backend. A local fake SMTP server receives the real emails nodemailer sends,
// so these tests prove delivery, recipients, headers and failure behaviour without touching Gmail.
import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { SMTPServer } from 'smtp-server'
import { simpleParser } from 'mailparser'
import { createApp } from '../server/app.js'
import { DEFAULT_TO, loadConfig } from '../server/config.js'
import { createMailer } from '../server/mailer.js'

const good = { name: 'Ada Lovelace', email: 'ada@example.com', subject: 'Project enquiry', message: 'Hello! I would like to talk about a project.' }
const inbox = []
let smtp, smtpPort

const listen = app => new Promise(r => { const s = app.listen(0, '127.0.0.1', () => r(s)) })
const base = s => `http://127.0.0.1:${s.address().port}`
const post = (s, body, headers = { 'Content-Type': 'application/json' }, raw = false) =>
  fetch(`${base(s)}/api/contact`, { method: 'POST', headers, body: raw ? body : JSON.stringify(body) })
const env = (over = {}) => ({ SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtpPort), SMTP_SECURE: 'false', SMTP_USER: 'sender@test.local', SMTP_PASS: 'secret', RATE_MAX: '1000', ...over })
async function start(over = {}, opts = {}) {
  const config = loadConfig(env(over))
  const server = await listen(createApp(config, { mailer: createMailer(config), ...opts }))
  return { server, config }
}

before(async () => {
  smtp = new SMTPServer({
    authOptional: false, allowInsecureAuth: true, disabledCommands: ['STARTTLS'],
    onAuth: (a, _s, cb) => (a.username === 'sender@test.local' && a.password === 'secret' ? cb(null, { user: 1 }) : cb(new Error('Invalid login'))),
    onData: (stream, _s, cb) => { simpleParser(stream).then(m => { inbox.push(m); cb() }, cb) },
  })
  await new Promise(r => smtp.listen(0, '127.0.0.1', r)); smtpPort = smtp.server.address().port
})
after(() => smtp.close())

describe('delivery', () => {
  let app; before(async () => { app = await start() }); after(() => app.server.close())

  it('delivers a valid message to ghazanfaralikhan62@gmail.com and only then reports success', async () => {
    inbox.length = 0
    const r = await post(app.server, good)
    assert.equal(r.status, 200); assert.deepEqual(await r.json(), { ok: true })
    assert.equal(inbox.length, 1)
    const m = inbox[0]
    assert.equal(DEFAULT_TO, 'ghazanfaralikhan62@gmail.com')
    assert.equal(m.to.value[0].address, 'ghazanfaralikhan62@gmail.com')
    assert.equal(m.replyTo.value[0].address, 'ada@example.com')           // "Reply" answers the visitor
    assert.equal(m.replyTo.value[0].name, 'Ada Lovelace')
    assert.equal(m.from.value[0].address, 'sender@test.local')            // never spoofs the visitor's address
    assert.equal(m.subject, '[Portfolio] Project enquiry')
    for (const s of ['Ada Lovelace', 'ada@example.com', 'Project enquiry', good.message]) assert.ok(m.text.includes(s), `text has ${s}`)
  })

  it('escapes HTML in the email body (no script injection into your inbox)', async () => {
    inbox.length = 0
    const evil = '<script>alert(1)</script> <img src=x onerror=alert(2)> & "quotes"'
    assert.equal((await post(app.server, { ...good, name: 'Eve <b>X</b>', message: evil })).status, 200)
    assert.ok(!/<script>|<img |<b>X/.test(inbox[0].html))
    assert.ok(inbox[0].html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  })

  it('blocks email header injection (CRLF in subject/name cannot add Bcc/Cc)', async () => {
    inbox.length = 0
    const r = await post(app.server, { ...good, subject: 'Hi\r\nBcc: attacker@evil.com\r\nX-Evil: 1', name: 'Eve\r\nCc: attacker@evil.com' })
    assert.equal(r.status, 200)
    const m = inbox[0]
    assert.ok(!m.headers.has('bcc') && !m.headers.has('cc') && !m.headers.has('x-evil'))
    assert.ok(!m.to.value.some(a => /evil/.test(a.address)))
    assert.ok(!/[\r\n]/.test(m.subject))
  })

  it('rejects an email address that smuggles headers or extra recipients', async () => {
    inbox.length = 0
    for (const email of ['a@b.co\r\nBcc: x@evil.com', 'a@b.co, c@evil.com', '"x"@evil.com', 'a@b.co;c@d.co', '<a@b.co>']) {
      const r = await post(app.server, { ...good, email }); assert.equal(r.status, 400, email)
    }
    assert.equal(inbox.length, 0)
  })

  it('keeps unicode, emoji and line breaks in the message', async () => {
    inbox.length = 0
    const msg = 'سلام! Hello 👋\nSecond line\n\nThird line (کیسے ہو?)'
    assert.equal((await post(app.server, { ...good, name: 'غزنفر', message: msg })).status, 200)
    assert.equal(inbox[0].text.includes('Second line\n\nThird line'), true); assert.ok(inbox[0].text.includes('👋')); assert.ok(inbox[0].text.includes('غزنفر'))
  })
})

describe('validation and request hygiene', () => {
  let app; before(async () => { app = await start() }); after(() => app.server.close())
  const sent = () => inbox.length
  it('returns 400 with the first field error, and sends nothing', async () => {
    const n = sent()
    for (const [field, val, msg] of [['name', 'A', 'full name'], ['email', 'nope', 'valid email'], ['subject', 'Hi', 'subject'], ['message', 'short', 'at least 10'], ['message', 'x'.repeat(5001), '5000']]) {
      const r = await post(app.server, { ...good, [field]: val }); const j = await r.json()
      assert.equal(r.status, 400, field); assert.equal(j.ok, false); assert.ok(j.error.toLowerCase().includes(msg), `${field}: ${j.error}`); assert.ok(j.fields[field])
    }
    assert.equal(sent(), n)
  })
  it('rejects non-string / structured values and arrays', async () => {
    for (const body of [{ ...good, name: { $ne: 1 } }, { ...good, email: ['a@b.co'] }, { ...good, message: 12345678901 }, [good], 'text', null]) assert.equal((await post(app.server, body)).status, 400)
  })
  it('rejects invalid JSON (400), oversized bodies (413) and wrong content type (415)', async () => {
    assert.equal((await post(app.server, '{bad json', undefined, true)).status, 400)
    assert.equal((await post(app.server, JSON.stringify({ ...good, message: 'x'.repeat(30000) }), undefined, true)).status, 413)
    assert.equal((await post(app.server, 'name=a&email=b', { 'Content-Type': 'application/x-www-form-urlencoded' }, true)).status, 415)
  })
  it('405 for GET /api/contact, JSON 404 for unknown /api routes, health ok', async () => {
    const g = await fetch(`${base(app.server)}/api/contact`); assert.equal(g.status, 405); assert.equal(g.headers.get('allow'), 'POST')
    assert.equal((await fetch(`${base(app.server)}/api/nope`)).status, 404)
    assert.deepEqual(await (await fetch(`${base(app.server)}/api/health`)).json(), { ok: true, emailConfigured: true })
  })
  it('sends security headers and hides the framework', async () => {
    const h = (await fetch(`${base(app.server)}/api/health`)).headers
    assert.equal(h.get('x-powered-by'), null); assert.equal(h.get('x-content-type-options'), 'nosniff')
    assert.match(h.get('content-security-policy'), /default-src 'self'/); assert.match(h.get('content-security-policy'), /frame-ancestors 'none'/)
  })
  it('trims whitespace, collapses control characters in single-line fields', async () => {
    inbox.length = 0
    assert.equal((await post(app.server, { ...good, name: '  Ada\t\u0000  Lovelace  ', subject: '  Hi\u0007 there  ' })).status, 200)
    assert.equal(inbox[0].replyTo.value[0].name, 'Ada Lovelace'); assert.equal(inbox[0].subject, '[Portfolio] Hi there')
  })
})

describe('honest failures (never reports success when nothing was sent)', () => {
  it('503 when SMTP credentials are not configured', async () => {
    const config = loadConfig({}); const server = await listen(createApp(config, { mailer: createMailer(config) }))
    const r = await post(server, good); assert.equal(r.status, 503); const j = await r.json(); assert.equal(j.ok, false); assert.match(j.error, /not configured/)
    assert.deepEqual(await (await fetch(`${base(server)}/api/health`)).json(), { ok: true, emailConfigured: false }); server.close()
  })
  it('502 when the mail server is unreachable', async () => {
    const { server } = await start({ SMTP_PORT: '1' }); const r = await post(server, good)
    assert.equal(r.status, 502); const j = await r.json(); assert.equal(j.ok, false); assert.ok(!('stack' in j)); server.close()
  })
  it('502 when the SMTP password is wrong', async () => {
    inbox.length = 0; const { server } = await start({ SMTP_PASS: 'wrong' }); const r = await post(server, good)
    assert.equal(r.status, 502); assert.equal((await r.json()).ok, false); assert.equal(inbox.length, 0); server.close()
  })
})

describe('abuse protection', () => {
  it('rate limits repeated submissions per IP and sends no extra email', async () => {
    const { server } = await start({ RATE_MAX: '3' }); inbox.length = 0
    const codes = []; for (let i = 0; i < 5; i++) codes.push((await post(server, good)).status)
    assert.deepEqual(codes, [200, 200, 200, 429, 429]); assert.equal(inbox.length, 3)
    const j = await (await post(server, good)).json(); assert.equal(j.ok, false); assert.match(j.error, /Too many/); server.close()
  })
  it('CORS: only the configured origin may call the API from a browser', async () => {
    const { server } = await start({ ALLOWED_ORIGIN: 'https://my-site.example' })
    const ok = await fetch(`${base(server)}/api/health`, { headers: { Origin: 'https://my-site.example' } })
    const bad = await fetch(`${base(server)}/api/health`, { headers: { Origin: 'https://evil.example' } })
    assert.equal(ok.headers.get('access-control-allow-origin'), 'https://my-site.example'); assert.equal(bad.headers.get('access-control-allow-origin'), null); server.close()
    const { server: s2 } = await start(); const none = await fetch(`${base(s2)}/api/health`, { headers: { Origin: 'https://evil.example' } })
    assert.equal(none.headers.get('access-control-allow-origin'), null); s2.close()
  })
  it('honours TRUST_PROXY so the real visitor IP (not the proxy) is rate limited', async () => {
    const { server } = await start({ RATE_MAX: '1', TRUST_PROXY: '1' })
    const hit = ip => post(server, good, { 'Content-Type': 'application/json', 'X-Forwarded-For': ip })
    assert.equal((await hit('203.0.113.1')).status, 200); assert.equal((await hit('203.0.113.1')).status, 429); assert.equal((await hit('203.0.113.2')).status, 200); server.close()
  })
})

describe('config', () => {
  it('defaults the destination to ghazanfaralikhan62@gmail.com and lets CONTACT_TO override it', () => {
    assert.equal(loadConfig({}).to, 'ghazanfaralikhan62@gmail.com'); assert.equal(loadConfig({ CONTACT_TO: 'x@y.z' }).to, 'x@y.z')
  })
  it('strips the spaces Google puts in app passwords (Gmail only)', () => {
    assert.equal(loadConfig({ SMTP_PASS: 'abcd efgh ijkl mnop' }).smtp.pass, 'abcdefghijklmnop')
    assert.equal(loadConfig({ SMTP_HOST: 'smtp.other.com', SMTP_PASS: 'a b' }).smtp.pass, 'a b')
  })
})

describe('serving the built website', () => {
  let dir, server
  before(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-')); fs.mkdirSync(path.join(dir, 'assets'))
    fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html><title>t</title><div id="root"></div>'); fs.writeFileSync(path.join(dir, 'assets', 'app-abc.js'), 'console.log(1)')
    fs.writeFileSync(path.join(dir, 'my pic 6.jpg'), 'jpg'); fs.writeFileSync(path.join(os.tmpdir(), 'secret-outside.txt'), 'TOP SECRET')
    server = (await start({}, { staticDir: dir })).server
  })
  after(() => server.close())
  it('serves index.html with CSP, hashed assets as immutable, and files with spaces in the name', async () => {
    const i = await fetch(base(server)); assert.equal(i.status, 200); assert.match(await i.text(), /id="root"/); assert.match(i.headers.get('content-security-policy'), /script-src 'self'/); assert.equal(i.headers.get('cache-control'), 'no-cache')
    assert.match((await fetch(`${base(server)}/assets/app-abc.js`)).headers.get('cache-control'), /immutable/)
    assert.equal((await fetch(`${base(server)}/my%20pic%206.jpg`)).status, 200)
  })
  it('does not expose files outside dist (path traversal) or dotfiles', async () => {
    const raw = p => new Promise(r => http.get({ host: '127.0.0.1', port: server.address().port, path: p }, res => { let b = ''; res.on('data', d => (b += d)); res.on('end', () => r({ status: res.statusCode, body: b })) }))
    for (const p of ['/../secret-outside.txt', '/..%2fsecret-outside.txt', '/%2e%2e/secret-outside.txt', '/assets/../../secret-outside.txt', '/.env', '/server/index.js']) { const r = await raw(p); assert.ok(!r.body.includes('TOP SECRET') && !/loadConfig|SMTP_PASS/.test(r.body), `${p} leaked`) }
  })
  it('falls back to index.html for page navigations but not for API or non-HTML requests', async () => {
    assert.match(await (await fetch(`${base(server)}/some/page`, { headers: { Accept: 'text/html' } })).text(), /id="root"/)
    assert.equal((await fetch(base(server), { method: 'HEAD' })).status, 200)          // health probes
    assert.equal((await fetch(`${base(server)}/api/missing`)).status, 404)
    assert.equal((await fetch(`${base(server)}/missing.png`, { headers: { Accept: 'image/png' } })).status, 404)
  })
})
