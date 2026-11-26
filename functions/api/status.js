// GET /api/status  ->  { configured, online, lastSeen, servers }
// Der Bot meldet sich alle paar Minuten über /api/heartbeat. Hier wird nur gelesen.
const OFFLINE_AFTER_MS = 8 * 60 * 1000;

export async function onRequestGet({ env }) {
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
  if (!env.STATUS) return new Response(JSON.stringify({ configured: false }), { headers });
  let data = null;
  try { data = JSON.parse(await env.STATUS.get('bot')); } catch (e) {}
  const online = !!data && Date.now() - data.t < OFFLINE_AFTER_MS;
  return new Response(JSON.stringify({
    configured: true, online, lastSeen: data ? data.t : null, servers: online ? data.servers : null,
  }), { headers });
}
