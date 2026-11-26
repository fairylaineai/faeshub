const $=q=>document.querySelector(q);

// Glas-Button. l = {icon,title,note,url,cls,internal,id}
const btn=l=>{const off=!l.url||l.url.includes('YOUR_CLIENT_ID'),
  inner=`<span class="chip" aria-hidden="true">${l.icon}</span><span class="txt"><b>${l.title}</b><small>${off?'Invite link coming soon':l.note}</small></span>`;
  if(off)return `<a class="glass ${l.cls||''} soon" aria-disabled="true">${inner}</a>`;
  return `<a class="glass ${l.cls||''}"${l.id?` id="${l.id}"`:''} href="${l.url}"${l.internal?'':' target="_blank" rel="noopener"'}>${inner}</a>`};

// Bot-Status vom Cloudflare-Endpunkt; null, wenn nicht eingerichtet
async function botStatus(){
  try{const r=await fetch('/api/status',{cache:'no-store'});if(!r.ok)return null;const d=await r.json();return d.configured===false?null:d}
  catch(e){return null}}

// Funkeln im Hintergrund
(function(){const st=$('#stars');if(!st)return;
  for(let i=0;i<(innerWidth<700?8:18);i++){const s=document.createElement('i'),z=8+Math.random()*20;s.className='star';
    s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${z}px;height:${z}px;animation-delay:${-Math.random()*6}s;animation-duration:${3+Math.random()*4}s`;st.appendChild(s)}})();

// Lichtreflex folgt der Maus auf den Glas-Buttons (nur mit echter Maus)
if(matchMedia('(hover:hover)').matches)document.addEventListener('pointermove',e=>{const g=e.target.closest&&e.target.closest('.glass');
  if(g){const r=g.getBoundingClientRect();g.style.setProperty('--mx',(e.clientX-r.left)+'px');g.style.setProperty('--my',(e.clientY-r.top)+'px')}});

// nach der Eingangsanimation die Ebenen wieder freigeben (spart Speicher)
document.querySelectorAll('.go').forEach(el=>el.addEventListener('animationend',()=>el.classList.remove('go'),{once:true}));
