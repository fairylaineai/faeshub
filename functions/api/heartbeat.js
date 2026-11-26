// POST /api/heartbeat   Header: Authorization: Bearer <STATUS_SECRET>   Body: {"servers": 3}
// Wird vom Bot aufgerufen. Dieser Weg ist bewusst vom Seiten-Passwort ausgenommen (siehe _middleware.js),
// schützt sich aber selbst mit dem geheimen Schlüssel STATUS_SECRET.
const enc = new TextEncoder();
async function sha(t) {
  const b = await crypto.subtle.digest('SHA-256', enc.encode(t));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function onRequestPost({ request, env }) {
  if (!env.STATUS || !env.STATUS_SECRET) return json({ error: 'not configured' }, 503);
  const given = request.headers.get('Authorization') || '';
  if (!same(await sha(given), await sha('Bearer ' + env.STATUS_SECRET))) return json({ error: 'unauthorized' }, 401);
  let body = {};
  try { body = await request.json(); } catch (e) {}
  const servers = Number.isFinite(body.servers) ? Math.max(0, Math.floor(body.servers)) : null;
  await env.STATUS.put('bot', JSON.stringify({ t: Date.now(), servers }), { expirationTtl: 3600 });
  return json({ ok: true });
}
