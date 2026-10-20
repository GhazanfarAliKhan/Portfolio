import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development the frontend (Vite) forwards /api requests to the backend server (see server/index.js).
// If the backend is not running, answer with a clear JSON message instead of a bare 500, so the form can show it.
const api = {
  '/api': {
    target: 'http://localhost:8787',
    changeOrigin: false,
    configure: proxy => {
      proxy.on('error', (_err, _req, res) => {
        if (res && typeof res.writeHead === 'function' && !res.headersSent) {
          // The health check answers 200 ("email not available") so the page can fall back quietly, with no console error.
          const health = _req.url?.startsWith('/api/health')
          res.writeHead(health ? 200 : 503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(health ? { ok: false, emailConfigured: false } : { ok: false, error: 'The mail server is not running. Start it with "npm run dev" (or "npm run dev:server").' }))
        }
      })
    },
  },
}
export default defineConfig({ plugins: [react()], server: { proxy: api }, preview: { proxy: api } })
