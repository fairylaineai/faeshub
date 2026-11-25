// Passwortschutz für die ganze Seite (läuft bei Cloudflare, bevor irgendeine Datei ausgeliefert wird).
// Passwörter stehen NICHT im Code, sondern als Secrets im Cloudflare-Dashboard:
//   PASSWORD_FAE   Passwort für dich
//   PASSWORD_KOMI  Passwort für komiumee
// Optional: SITE_PUBLIC = 1  schaltet den Schutz ab (Seite ist dann für alle sichtbar).

const COOKIE = 'faes_auth';
const DAYS = 30;
const enc = new TextEncoder();

async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
const token = async (role, pw) => role + '.' + await sha('faes-hub|' + role + '|' + pw);
function readCookie(req) {
  const m = (req.headers.get('Cookie') || '').match(new RegExp('(?:^|; )' + COOKIE + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}
const cookieHeader = (value, maxAge) =>
  `${COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;

function loginPage(message, status) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#1d2418"><title>Faes Hub</title>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
html{background:#1d2418;color:#f0e8d4}
body{min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:1.25rem;font-family:'Bricolage Grotesque',system-ui,sans-serif;
 background:radial-gradient(60% 45% at 20% 10%,rgba(196,245,60,.22),transparent 70%),radial-gradient(55% 45% at 90% 95%,rgba(243,183,156,.2),transparent 70%),#1d2418}
main{width:min(100%,24rem);padding:2.2rem 1.6rem 1.8rem;border-radius:2rem 1rem 2rem 1rem;
 background:linear-gradient(135deg,rgba(255,255,255,.16),rgba(255,255,255,.04));-webkit-backdrop-filter:blur(18px) saturate(1.8);backdrop-filter:blur(18px) saturate(1.8);
 box-shadow:inset 0 1px 1px rgba(255,255,255,.55),0 30px 70px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08)}
.spark{display:block;width:2rem;height:2rem;margin-bottom:1rem;background:#c4f53c;clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);animation:spin 9s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
h1{font-weight:800;font-variation-settings:"wdth" 75;font-size:3.6rem;line-height:.85;letter-spacing:-.03em}
p{font-family:'Instrument Serif',Georgia,serif;font-size:1.35rem;line-height:1.2;margin:1rem 0 1.4rem;color:#a9bb92}
p.err{color:#f3b79c;margin:-.4rem 0 1rem}
input,button{width:100%;font:inherit;font-size:1rem;border-radius:999px;border:0;padding:.95rem 1.3rem;color:#f0e8d4}
input{background:rgba(0,0,0,.28);box-shadow:inset 0 2px 6px rgba(0,0,0,.4),0 0 0 1px rgba(255,255,255,.16);margin-bottom:.8rem}
input:focus{outline:3px solid #c4f53c;outline-offset:2px}
button{cursor:pointer;font-weight:700;color:#1d2418;background:#c4f53c;box-shadow:inset 0 1px 1px rgba(255,255,255,.7),0 10px 26px rgba(196,245,60,.25);touch-action:manipulation}
button:active{transform:scale(.97)}
@media(prefers-reduced-motion:reduce){.spark{animation:none}}
</style></head><body><main>
<i class="spark" aria-hidden="true"></i>
<h1>Faes<br>Hub</h1>
<p>This place is private for now.</p>
${message ? `<p class="err" role="alert">${message}</p>` : ''}
<form method="POST" action="/__login">
<input type="password" name="password" placeholder="Password" autocomplete="current-password" required autofocus aria-label="Password">
<button type="submit">Let me in</button>
</form></main></body></html>`;
  return new Response(html, { status, headers: {
    'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' } });
}

export async function onRequest({ request, next, env }) {
  if (String(env.SITE_PUBLIC || '') === '1') return next();

  const users = [['fae', env.PASSWORD_FAE], ['komiumee', env.PASSWORD_KOMI]].filter(([, p]) => p && String(p).length);
  if (!users.length) return loginPage('Setup missing: no passwords are set yet.', 503);

  const url = new URL(request.url);

  if (url.pathname === '/__logout') {
    return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': cookieHeader('', 0) } });
  }

  const cookie = readCookie(request);
  if (cookie) {
    const user = users.find(([role]) => role === cookie.split('.')[0]);
    if (user && same(cookie, await token(user[0], String(user[1])))) {
      const res = await next();
      const out = new Response(res.body, res);
      out.headers.set('Cache-Control', 'private, max-age=300');
      out.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return out;
    }
  }

  if (url.pathname === '/__login' && request.method === 'POST') {
    let pw = '';
    try { pw = String((await request.formData()).get('password') || ''); } catch (e) {}
    const h = await sha(pw);
    let hit = null;
    for (const [role, p] of users) if (same(h, await sha(String(p)))) hit = [role, String(p)];
    if (hit) {
      return new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': cookieHeader(await token(...hit), DAYS * 86400) } });
    }
    await new Promise(r => setTimeout(r, 900));
    return loginPage('Wrong password. Try again.', 401);
  }

  return loginPage('', 401);
}
