// Strict validation + sanitising for the contact form. Returns clean values or per-field messages
// (same wording as the frontend so the visitor sees consistent feedback).
// eslint-disable-next-line no-control-regex -- intentionally matching control characters in order to strip them
const CTRL = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g          // all control characters (incl. CR/LF)
// eslint-disable-next-line no-control-regex -- same: keeps \n, strips every other control character
const CTRL_KEEP_NL = /[\u0000-\u0009\u000b\u000c\u000e-\u001f\u007f-\u009f\u2028\u2029]/g
const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/

const oneLine = s => s.replace(CTRL, ' ').replace(/\s+/g, ' ').trim()

export function validateContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, errors: { form: 'Invalid request.' } }
  const errors = {}
  for (const k of ['name', 'email', 'subject', 'message']) if (typeof body[k] !== 'string') errors[k] = `Missing or invalid ${k}.`
  if (Object.keys(errors).length) return { ok: false, errors }

  const name = oneLine(body.name), subject = oneLine(body.subject)
  const email = body.email.trim()
  const message = body.message.replace(/\r\n?/g, '\n').replace(CTRL_KEEP_NL, '').trim()

  if (name.length < 2 || name.length > 100) errors.name = 'Enter your full name.'
  if (email.length > 254 || email.split('@')[0].length > 64 || !EMAIL.test(email)) errors.email = 'Enter a valid email address.'
  if (subject.length < 3 || subject.length > 150) errors.subject = 'Enter a subject.'
  if (message.length < 10) errors.message = 'Message must be at least 10 characters.'
  else if (message.length > 5000) errors.message = 'Message must be 5000 characters or fewer.'

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: { name, email, subject, message } }
}
