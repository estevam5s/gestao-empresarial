// Registra visita (analytics global). País/cidade vêm dos headers de geo da Vercel.
import { admin, cors, readJson } from './_lib.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  const body = await readJson(req)
  const h = req.headers
  const ua = h['user-agent'] || ''
  const device = /mobile/i.test(ua) ? 'mobile' : /tablet|ipad/i.test(ua) ? 'tablet' : 'desktop'
  try {
    await admin.from('visitors').insert({
      country: h['x-vercel-ip-country'] ? decodeURIComponent(h['x-vercel-ip-country']) : null,
      country_code: h['x-vercel-ip-country'] || null,
      city: h['x-vercel-ip-city'] ? decodeURIComponent(h['x-vercel-ip-city']) : null,
      region: h['x-vercel-ip-country-region'] || null,
      path: (body.path || '').slice(0, 200),
      referrer: (body.referrer || '').slice(0, 300),
      device,
      ip: (h['x-forwarded-for'] || '').split(',')[0] || null,
      user_agent: ua.slice(0, 300),
    })
  } catch { /* silencioso */ }
  return res.status(200).json({ ok: true })
}
