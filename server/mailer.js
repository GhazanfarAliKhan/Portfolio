import nodemailer from 'nodemailer'
import { emailConfigured } from './config.js'

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function html({ name, email, subject, message }) {
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#111">
  <h2 style="margin:0 0 4px;color:#FF4528">New message from your portfolio</h2>
  <p style="margin:0 0 16px;color:#666">Reply to this email to answer ${esc(name)} directly.</p>
  <table style="border-collapse:collapse;width:100%;margin-bottom:16px">
    <tr><td style="padding:6px 12px 6px 0;color:#666;width:80px">Name</td><td style="padding:6px 0"><b>${esc(name)}</b></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#666">Subject</td><td style="padding:6px 0">${esc(subject)}</td></tr>
  </table>
  <div style="white-space:pre-wrap;border-left:3px solid #FF4528;background:#faf7f6;padding:12px 16px;line-height:1.5">${esc(message)}</div>
</div>`
}

// Returns null when SMTP credentials are missing, so the API can say so honestly instead of pretending to send.
export function createMailer(config) {
  if (!emailConfigured(config)) return null
  const { host, port, secure, user, pass } = config.smtp
  const transport = nodemailer.createTransport({ host, port, secure, auth: { user, pass }, connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000 })
  return {
    verify: () => transport.verify(),
    async send(msg) {
      const info = await transport.sendMail({
        from: { name: 'Portfolio Contact Form', address: config.from },   // our own authenticated address, never the visitor's
        to: config.to,
        replyTo: { name: msg.name, address: msg.email },                  // so "Reply" goes to the visitor
        subject: `[Portfolio] ${msg.subject}`,
        text: `New message from your portfolio website\n\nName:    ${msg.name}\nEmail:   ${msg.email}\nSubject: ${msg.subject}\n\n${msg.message}\n`,
        html: html(msg),
      })
      // Only a delivery the mail server actually accepted counts as success.
      if (!info.accepted?.length) throw Object.assign(new Error('Recipient not accepted'), { code: 'EREJECTED' })
      return info
    },
  }
}
