// GET /api/now-playing  ->  { playing, title, artist, art, url }
// Quelle 1: Spotify (SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN)
// Quelle 2, falls Spotify nicht eingerichtet ist: Last.fm (LASTFM_API_KEY, LASTFM_USER)
const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };
const out = (o) => new Response(JSON.stringify(o), { headers });
let cache = { token: '', exp: 0 };

async function spotifyToken(env) {
  if (cache.token && Date.now() < cache.exp) return cache.token;
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: env.SPOTIFY_REFRESH_TOKEN }),
  });
  if (!r.ok) throw new Error('token ' + r.status);
  const d = await r.json();
  cache = { token: d.access_token, exp: Date.now() + (d.expires_in - 120) * 1000 };
  return cache.token;
}

async function fromSpotify(env) {
  const r = await fetch('https://api.spotify.com/v1/me/player/currently-playing?additional_types=track', {
    headers: { Authorization: 'Bearer ' + await spotifyToken(env) },
  });
  if (r.status === 204 || !r.ok) return { playing: false };
  const d = await r.json();
  const it = d.item;
  if (!d.is_playing || !it || d.currently_playing_type !== 'track') return { playing: false };
  const imgs = (it.album && it.album.images || []).slice().sort((a, b) => a.width - b.width);
  const img = imgs.find(i => i.width >= 64) || imgs[0];
  return { playing: true, title: it.name, artist: it.artists.map(a => a.name).join(', '), art: img ? img.url : null, url: it.external_urls && it.external_urls.spotify };
}

async function fromLastfm(env) {
  const q = new URLSearchParams({ method: 'user.getrecenttracks', user: env.LASTFM_USER, api_key: env.LASTFM_API_KEY, format: 'json', limit: '1' });
  const r = await fetch('https://ws.audioscrobbler.com/2.0/?' + q);
  if (!r.ok) return { playing: false };
  const d = await r.json();
  let t = d.recenttracks && d.recenttracks.track;
  if (Array.isArray(t)) t = t[0];
  if (!t || !t['@attr'] || t['@attr'].nowplaying !== 'true') return { playing: false };
  const img = (t.image || []).find(i => i.size === 'large') || (t.image || [])[0];
  return { playing: true, title: t.name, artist: t.artist && t.artist['#text'], art: img && img['#text'] || null, url: t.url };
}

export async function onRequestGet({ env }) {
  const spotify = env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET && env.SPOTIFY_REFRESH_TOKEN;
  const lastfm = env.LASTFM_API_KEY && env.LASTFM_USER;
  if (!spotify && !lastfm) return out({ configured: false, playing: false });
  try { return out({ configured: true, ...(spotify ? await fromSpotify(env) : await fromLastfm(env)) }); }
  catch (e) { return out({ configured: true, playing: false, error: true }); }
}
