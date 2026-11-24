(()=>{
const W=400,H=250,S=15,Z=15,OX=200,OY=112,N=9,WH=7;
const cv=document.getElementById('room'),X=cv.getContext('2d');
X.imageSmoothingEnabled=false;
const mk=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const bg=mk(),fg=mk(),gl=mk();
let g;
const rnd=Math.random;
const R=(a,b,w,h,c)=>{g.fillStyle=c;g.fillRect(a,b,w,h)};
const P=(x,y,z)=>[OX+(x-y)*S,OY+(x+y)*S/2-z*Z];
const sc=(h,f)=>'#'+[1,3,5].map(i=>Math.min(255,Math.round(parseInt(h.substr(i,2),16)*f)).toString(16).padStart(2,'0')).join('');
const tone=b=>[sc(b,1.2),sc(b,.95),sc(b,.7)];
function poly(p,c){let y0=Math.floor(Math.min(...p.map(a=>a[1]))),y1=Math.ceil(Math.max(...p.map(a=>a[1])));
 for(let y=y0;y<=y1;y++){const yc=y+.5,xs=[];
  for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];
   if((a[1]<=yc&&b[1]>yc)||(b[1]<=yc&&a[1]>yc))xs.push(a[0]+(yc-a[1])*(b[0]-a[0])/(b[1]-a[1]))}
  xs.sort((m,n)=>m-n);
  for(let k=0;k+1<xs.length;k+=2){const xa=Math.round(xs[k]),xb=Math.round(xs[k+1]);if(xb>xa)R(xa,y,xb-xa,1,c)}}}
function L(a,b,c){let x0=Math.round(a[0]),y0=Math.round(a[1]),x1=Math.round(b[0]),y1=Math.round(b[1]);
 const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
 for(;;){R(x0,y0,1,1,c);if(x0==x1&&y0==y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
const Q=(a,b,c,d,col)=>poly([a,b,c,d].map(p=>P(...p)),col);
const QL=(u1,u2,z1,z2,c)=>poly([P(0,u1,z1),P(0,u2,z1),P(0,u2,z2),P(0,u1,z2)],c);
const QR=(u1,u2,z1,z2,c)=>poly([P(u1,0,z1),P(u2,0,z1),P(u2,0,z2),P(u1,0,z2)],c);
function box(x,y,z,w,d,h,c){
 Q([x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h],c[0]);
 Q([x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h],c[1]);
 Q([x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h],c[2]);
 const hl=sc(c[0],1.18);L(P(x,y+d,z+h),P(x+w,y+d,z+h),hl);L(P(x+w,y+d,z+h),P(x+w,y,z+h),hl)}
function E(cx,cy,rx,ry,c){const jr=Math.ceil(ry);for(let j=-jr;j<=jr;j++){const hw=Math.round(rx*Math.sqrt(Math.max(0,1-(j*j)/(ry*ry))));R(Math.round(cx)-hw,Math.round(cy)+j,hw*2+1,1,c)}}
function cyl(cx,cy,z,r,h,top,side){const[px,py]=P(cx,cy,z+h),rx=r*Math.SQRT2*S,ry=rx/2,sh=h*Z;
 E(px,py+sh,rx,ry,side);R(Math.round(px-rx),Math.round(py),Math.round(rx*2)+1,Math.round(sh),side);
 R(Math.round(px+rx*.35),Math.round(py),Math.round(rx*.65)+1,Math.round(sh),sc(side,.75));
 E(px,py+sh,rx*.65,ry*.65,sc(side,.75));
 E(px,py,rx,ry,top)}
function mush(x,y,s,cap){x=Math.round(x);y=Math.round(y);R(x-s,y-3*s,2*s,3*s,'#f1e3d0');E(x,y-4*s,3*s,2*s,cap);R(x-s,y-5*s,s,s,'#fff4e0');R(x+s,y-4*s,s,s,'#fff4e0')}
function lf(x,y,c){poly([[x,y],[x+3,y-2],[x+6,y],[x+3,y+2]],c);L([x,y],[x+6,y],sc(c,1.3))}
function leaf(bx,by,len,ang,wid,col,vein,sw){const tx=bx+Math.cos(ang)*len+sw,ty=by-Math.sin(ang)*len,mx=(bx+tx)/2,my=(by+ty)/2,dx=-(ty-by),dy=tx-bx,l=Math.hypot(dx,dy)||1,ox=dx/l*wid,oy=dy/l*wid;
 poly([[bx,by],[mx+ox,my+oy],[tx,ty],[mx-ox,my-oy]],col);L([bx,by],[tx,ty],vein)}

g=bg.getContext('2d');
R(0,0,W,H,'#1a1220');
QL(0,N,0,WH,'#4a3346');QR(0,N,0,WH,'#3b2a3c');
for(let k=1;k<N;k++){L(P(0,k,0),P(0,k,WH),'#523a50');L(P(k,0,0),P(k,0,WH),'#46334a')}
QL(0,N,0,2,'#3a2738');QR(0,N,0,2,'#2f202f');
QL(0,N,2,2.14,'#6a452c');QR(0,N,2,2.14,'#5a3a28');
QL(0,N,0,.3,'#2d1d26');QR(0,N,0,.3,'#251720');
Q([0,-.3,WH],[N,-.3,WH],[N,0,WH],[0,0,WH],'#7a5a68');
Q([N,-.3,0],[N,0,0],[N,0,WH],[N,-.3,WH],'#2a1c2a');
Q([-.3,0,WH],[0,0,WH],[0,N,WH],[-.3,N,WH],'#8a6a78');
Q([-.3,N,0],[0,N,0],[0,N,WH],[-.3,N,WH],'#33222f');
Q([-.3,-.3,WH],[0,-.3,WH],[0,0,WH],[-.3,0,WH],'#9a7a88');
for(let k=0;k<N;k++){
 Q([0,k,0],[N,k,0],[N,k+1,0],[0,k+1,0],k%2?'#7a4f32':'#72472d');
 L(P(0,k,0),P(N,k,0),'#5a3622');
 const j1=((k*53)%80)/10+.5,j2=(j1+4.3)%9;
 [j1,j2].forEach(j=>L(P(j,k,0),P(j,k+1,0),'#5a3622'))}
Q([0,N,-.5],[N,N,-.5],[N,N,0],[0,N,0],'#4a2f20');
Q([N,0,-.5],[N,N,-.5],[N,N,0],[N,0,0],'#3a2418');

QR(4.3,7.9,2.5,6.3,'#0e1626');QR(4.3,7.9,2.5,2.95,'#080d18');
[[4.7,1.4],[5.15,1],[5.6,1.7],[7.8,1.1]].forEach(([cx,h])=>poly([P(cx-.28,0,2.9),P(cx+.28,0,2.9),P(cx,0,2.9+h)],'#0a1120'));
QR(6.7,7.4,2.9,3.6,'#0a1120');poly([P(6.6,0,3.6),P(7.5,0,3.6),P(7.05,0,4.1)],'#0a1120');
QR(6.82,6.98,3.1,3.35,'#ffcf7a');QR(7.1,7.26,3.1,3.35,'#ffb55a');

QR(0.9,3.0,5.9,6.0,'#5a3a28');
['#b4532a','#d9772b','#e3a22f','#f0cf7a','#7a9a5a'].forEach((c,i)=>QR(1,2.9,5.9-(i+1)*.4,5.9-i*.4,c));
for(let u=1.05;u<2.9;u+=.15)L(P(u,0,3.9),P(u,0,3.65),'#e3a22f');
{const pts=[];for(let i=0;i<36;i++){const t=i/36*Math.PI*2;pts.push(P(.55+.3*Math.cos(t),0,4.9+.3*Math.sin(t)))}
 for(let i=0;i<36;i+=3)L(pts[i],pts[(i+13)%36],'#bfa88a');
 for(let i=0;i<36;i++)L(pts[i],pts[(i+1)%36],'#e8d9c0');
 [[.43,'#e9b8b0',.55],[.55,'#7ab0a8',.7],[.67,'#e3a22f',.5]].forEach(([u,c,l])=>{L(P(u,0,4.6),P(u,0,4.6-l*.5),'#bfa88a');poly([P(u-.05,0,4.6-l*.5),P(u+.05,0,4.6-l*.5),P(u,0,4.6-l*.5-.3)],c)})}
QL(1.2,3.3,3.9,5.7,'#5a3a28');QL(1.32,3.18,4.02,5.58,'#f2c88a');
poly([P(0,1.32,4.02),P(0,2.3,4.02),P(0,1.8,4.9)],'#5a7a5a');poly([P(0,1.9,4.02),P(0,3.18,4.02),P(0,2.6,4.7)],'#4a6a4a');QL(2.6,2.9,5.0,5.3,'#e87a4a');
QL(6.2,8.3,4.6,6.2,'#2a1a14');QL(6.32,8.18,4.72,6.08,'#1d3a4a');
[[6.7,.9],[7.2,1.1],[7.7,.8]].forEach(([u,h])=>poly([P(0,u-.25,4.72),P(0,u+.25,4.72),P(0,u,4.72+h)],'#2f6a4a'));QL(7.85,8.05,5.6,5.85,'#f3e7b0');

Q([0,0,.01],[4.2,0,.01],[4.2,5.9,.01],[0,5.9,.01],'rgba(0,0,0,.3)');
Q([0,5.9,.01],[3,5.9,.01],[3,9.4,.01],[0,9.4,.01],'rgba(0,0,0,.3)');
Q([3.3,3.3,.02],[8.3,3.3,.02],[8.3,8.3,.02],[3.3,8.3,.02],'#8a3b2f');
Q([3.65,3.65,.03],[7.95,3.65,.03],[7.95,7.95,.03],[3.65,7.95,.03],'#c26a45');
Q([4.05,4.05,.04],[7.55,4.05,.04],[7.55,7.55,.04],[4.05,7.55,.04],'#8a3b2f');
Q([4.45,4.45,.05],[7.15,4.45,.05],[7.15,7.15,.05],[4.45,7.15,.05],'#e0b070');
Q([4.6,4.6,.06],[7.0,4.6,.06],[7.0,7.0,.06],[4.6,7.0,.06],'#a64a35');
E(...P(5.5,5.5,.05),34,17,'rgba(0,0,0,.28)');

box(0,0,0,3,.35,3.3,tone('#5a3a28'));
box(0,.35,.25,3,4.9,.75,tone('#6a452c'));
[[.05,.4],[2.65,.4],[.05,4.95],[2.65,4.95]].forEach(([x,y])=>box(x,y,0,.3,.3,.25,tone('#3a2418')));
box(.12,.4,1,2.76,4.7,.65,tone('#e8d9c0'));
box(.35,.55,1.65,1.1,.95,.38,tone('#f1e3d0'));box(1.6,.55,1.65,1.1,.95,.38,tone('#e9b8b0'));
mush(...P(1.1,1.05,2.03),1,'#e8553a');lf(...P(.7,.95,2.03),'#6fb77a');lf(...P(1.75,1.05,2.03),'#8fd18a');mush(...P(2.2,1.0,2.03),1,'#f0a040');
box(.08,1.9,.7,2.9,3.2,1.05,tone('#2f5d4a'));
for(let i=0;i<5;i++)for(let j=0;j<6;j++){const x=.12+i*.57,y=1.95+j*.52;Q([x,y,1.755],[x+.54,y,1.755],[x+.54,y+.49,1.755],[x,y+.49,1.755],(i+j)%2?'#2f5d4a':'#356b55')}
Q([2.86,1.92,1.758],[2.98,1.92,1.758],[2.98,5.1,1.758],[2.86,5.1,1.758],'#e3a22f');
Q([.08,4.98,1.758],[2.98,4.98,1.758],[2.98,5.1,1.758],[.08,5.1,1.758],'#e3a22f');
for(let i=0;i<26;i++)R(...P(.15+((i*37)%27)/10,1.95+((i*53)%29)/10,1.76),1,1,'#e8d9c0');
for(let i=0;i<16;i++)R(...P(2.98,2+((i*41)%30)/10,.8+((i*17)%9)/10),2,2,'#e8d9c0');
const bl=[[1.0,2.1],[2.0,2.1],[1.5,2.9],[.3,2.9],[2.7,3.0],[1.2,3.6],[2.2,3.7],[.4,4.4],[1.7,4.5],[2.6,4.5],[1.0,4.95]];
bl.forEach(([x,y],i)=>lf(...P(x,y,1.76),i%2?'#8fd18a':'#6fb77a'));
const ml=[[.5,2.2,2,'#e8553a'],[1.5,2.5,1,'#f0a040'],[2.4,2.3,2,'#e8a0b8'],[.9,3.1,1,'#e8a0b8'],[1.9,3.3,2,'#e8553a'],[.5,3.9,2,'#f0a040'],[2.5,4.0,1,'#e8553a'],[1.3,4.3,1,'#f0a040'],[2.1,4.7,2,'#e8a0b8'],[.7,4.7,1,'#e8553a']];
ml.sort((a,b)=>a[0]+a[1]-b[0]-b[1]).forEach(([x,y,s,c])=>mush(...P(x,y,1.76),s,c));
box(0,5.1,.25,3,.2,1.5,tone('#5a3a28'));

box(3.25,.1,0,.8,.8,1.3,tone('#6a452c'));
Q([4.06,.2,.3],[4.06,.8,.3],[4.06,.8,1],[4.06,.2,1],'#7a5238');Q([4.07,.45,.6],[4.07,.55,.6],[4.07,.55,.7],[4.07,.45,.7],'#e8c070');

box(0,6,2.35,2.2,3,.2,tone('#7a4f32'));
[[.05,6.1],[1.95,6.1],[.05,8.7],[1.95,8.7]].forEach(([x,y])=>box(x,y,0,.2,.2,2.35,tone('#4a2f20')));
box(.05,7.5,.3,1.9,1.15,2.05,tone('#5a3a28'));
Q([1.96,7.62,.5],[1.96,8.53,.5],[1.96,8.53,1.25],[1.96,7.62,1.25],'#6a452c');
Q([1.96,7.62,1.4],[1.96,8.53,1.4],[1.96,8.53,2.2],[1.96,7.62,2.2],'#6a452c');
Q([1.97,8,.85],[1.97,8.15,.85],[1.97,8.15,.95],[1.97,8,.95],'#e8c070');Q([1.97,8,1.75],[1.97,8.15,1.75],[1.97,8.15,1.85],[1.97,8,1.85],'#e8c070');
box(.35,6.35,2.55,.45,.45,.1,tone('#2a2a30'));box(.53,6.53,2.65,.09,.09,1.5,tone('#2a2a30'));
box(.3,6.3,4,.55,.55,.45,tone('#e8a93a'));box(.45,6.45,3.9,.25,.25,.12,['#fff0b0','#fff0b0','#fff0b0']);
box(.3,6.9,2.75,.1,1.5,1,tone('#2b2b33'));
Q([.41,6.97,2.82],[.41,8.33,2.82],[.41,8.33,3.68],[.41,6.97,3.68],'#14202b');
box(.4,6.9,2.55,1,1.5,.08,tone('#7d7f8a'));
box(1.2,6.3,2.55,.8,.55,.18,tone('#b4532a'));box(1.25,6.33,2.73,.7,.5,.15,tone('#3f7a78'));
box(1.55,7.25,2.55,.45,.2,.1,tone('#4a2f20'));L(P(1.65,7.35,2.65),P(1.75,7.35,3.3),'#8a6a40');
box(.35,8.3,2.55,.55,.55,.45,tone('#b0503a'));
box(1.4,8.3,2.55,.38,.38,.5,tone('#efe3cf'));box(1.78,8.42,2.7,.1,.12,.28,tone('#efe3cf'));
Q([1.43,8.33,3.04],[1.65,8.33,3.04],[1.65,8.65,3.04],[1.43,8.65,3.04],'#5a3a28');

Q([8,0,.01],[9,0,.01],[9,.9,.01],[8,.9,.01],'rgba(0,0,0,.3)');
{const wd=tone('#6a452c'),dk=tone('#3a2418'),bc=['#b4532a','#e3a22f','#3f7a78','#8a3b2f','#5a7a5a','#e8a0b8','#2f5d4a','#6a4a8a','#d9772b'];
 box(8,0,0,1,.08,4.2,dk);box(8,0,0,.07,.55,4.2,wd);box(8.93,0,0,.07,.55,4.2,wd);
 [[0,[.55,.7,.6,.8,.65,.75]],[1.08,[.7,.6,.8,.55,.75]],[2.08,[.6,.75,.5,.7,.8]],[3.08,[.7,.55,.65]]].forEach(([z,hs],r)=>{
  box(8,0,z,1,.55,.1,wd);let x=8.09;
  hs.forEach((h,i)=>{const w=.09+((i*7+r*3)%4)*.015;box(x,.1,z+.1,w,.4,h,tone(bc[(i*2+r*3)%bc.length]));x+=w+.012})});
 box(8,0,4.12,1,.55,.1,wd);
 box(8.72,.15,1.18,.16,.16,.14,tone('#b0503a'));box(8.74,.17,1.32,.12,.12,.12,tone('#5fa06a'));
 box(8.7,.2,2.18,.18,.28,.08,tone('#e8d9c0'));
 mush(...P(8.68,.32,3.18),2,'#e8553a');mush(...P(8.45,.3,3.18),1,'#f0a040')}
cyl(5.9,.8,0,.4,.75,'#d9824f','#c0663d');
cyl(7.2,1.7,0,.36,.65,'#4f8f8c','#3f7a78');
cyl(2.9,8.7,0,.34,.6,'#f0b84a','#e3a22f');
mush(...P(6.5,1.3,0),1,'#e8553a');mush(...P(6.65,1.45,0),2,'#e8a0b8');mush(...P(8.5,1.3,0),1,'#f0a040');mush(...P(3.4,9.0,0),2,'#e8553a');mush(...P(3.55,9.1,0),1,'#f0a040');
cyl(5.2,5.2,0,.85,.9,'#c8654a','#b0503a');
cyl(5.2,5.2,.9,.8,.3,'#6f8294','#4a5762');
{const[cx,cy]=P(5.2,5.2,1.2);
 for(let a=0;a<6;a++){const th=a*Math.PI/3,[sx,sy]=P(5.2+.5*Math.cos(th),5.2+.5*Math.sin(th),1.2);E(sx,sy+1,3.6,1.8,'#4b5a68');E(sx,sy,3.6,1.8,'#9db0c2')}
 E(cx,cy,5.5,2.8,'#4b5a68');E(cx,cy-1,5.5,2.8,'#98aabb')}

g=fg.getContext('2d');
[[4.3,4.45,2.5,6.3],[7.75,7.9,2.5,6.3],[4.3,7.9,6.15,6.3],[4.3,7.9,2.5,2.65],[6,6.15,2.5,6.3],[4.3,7.9,4.35,4.5]].forEach(([a,b,c,d])=>QR(a,b,c,d,'#2a1a14'));
[[4.45,6,2.65,2.7],[4.45,6,4.5,4.55],[6.15,7.75,2.65,2.7],[6.15,7.75,4.5,4.55]].forEach(([a,b,c,d])=>QR(a,b,c,d,'#4a3224'));
box(4.2,0,2.4,3.8,.45,.12,tone('#6a452c'));
box(4.5,.1,2.52,.3,.3,.25,tone('#b0503a'));box(4.55,.15,2.77,.2,.2,.25,tone('#5fa06a'));box(4.9,.1,2.52,.3,.3,.2,tone('#e3a22f'));box(4.95,.15,2.72,.2,.2,.2,tone('#4f8f5a'));
box(7.3,.1,2.52,.28,.28,.4,tone('#f1e3d0'));
QR(3.1,9,6.45,6.58,'#2a1a14');
const bulbs=[],cols=['#ffd27a','#ff9f5a','#ff8fa3','#ffe9a0'];
[[0,[.3,3.2,6.1,8.8]],[1,[.3,3.4,6.4,8.8]]].forEach(([side,ns])=>{for(let i=0;i<ns.length-1;i++){const s0=ns[i],e0=ns[i+1];let prev=null;
 const pt=t=>{const u=s0+(e0-s0)*t,z=6.95-.3*Math.sin(Math.PI*t);return side==0?P(0,u,z):P(u,0,z)};
 for(let k=0;k<=40;k++){const p=pt(k/40);if(prev)L(prev,p,'#1f1420');prev=p}
 [.25,.5,.75].forEach((t,m)=>{const p=pt(t);bulbs.push({x:p[0],y:p[1]+2,c:cols[(i+m+side)%4]})})}});

g=gl.getContext('2d');
const lamp=P(.58,6.58,3.85);
[[170,.045],[135,.05],[105,.055],[75,.06],[50,.07],[28,.09],[12,.12]].forEach(([r,a])=>E(lamp[0],lamp[1],r,r*.9,'rgba(255,176,80,'+a+')'));
E(...P(2.4,6.5,0),95,48,'rgba(255,170,80,.07)');
poly([P(4.3,0,0),P(7.9,0,0),P(7,3.8,0),P(3.4,3.8,0)],'rgba(120,150,230,.07)');
R(0,0,W,3,'rgba(0,0,0,.3)');R(0,H-3,W,3,'rgba(0,0,0,.3)');R(0,0,3,H,'rgba(0,0,0,.25)');R(W-3,0,3,H,'rgba(0,0,0,.25)');

const drops=Array.from({length:80},()=>({x:262+rnd()*58,y:48+rnd()*88,v:2+rnd()*2,l:2+(rnd()*3|0),a:(.3+rnd()*.45).toFixed(2)}));
const beads=[270,282,296,304,312].map(a=>({x:a,y:60+rnd()*60,v:.15+rnd()*.15}));
const clouds=Array.from({length:5},(_,i)=>({x:250+i*24,dy:4+(i%3)*10,r:16+rnd()*10,v:.12+rnd()*.1}));
const win=[P(4.3,0,2.5),P(7.9,0,2.5),P(7.9,0,6.3),P(4.3,0,6.3)];
const mug=P(1.55,8.5,3.1),tip=P(1.75,7.35,3.3),mlamp=P(3.65,.5,1.35),candle=P(7.44,.24,2.92),hp=P(5.2,5.2,1.2);
const motes=Array.from({length:26},()=>({x:90+rnd()*250,y:30+rnd()*170,p:rnd()*6.3,s:.4+rnd()*.6}));
const hang=P(.35,4.6,5.5),hook=P(0,4.6,6.9);
const vineHooks=bulbs.filter((b,i)=>i%2==0).map((b,i)=>({x:b.x,y:b.y,len:5+(i%4)*2,p:i*1.3}));
const greens=['#3f8a52','#4f9f62','#2f7a48','#5fb070'];
let n=0,flash=[],nextFlash=90;
function plants(){
 let b=P(6,.8,.75);
 for(let i=0;i<11;i++)leaf(b[0],b[1],36+(i%3)*9,Math.PI/2+(i-5)*.11,7,greens[i%4],'#1f5a38',Math.sin(n*.07+i)*2.6);
 b=P(7.2,1.7,.65);
 for(let i=0;i<15;i++)leaf(b[0],b[1],28+(i%4)*5,Math.PI/2+(i-7)*.16,3,greens[(i+1)%4],'#1f5a38',Math.sin(n*.09+i*.8)*3);
 b=P(2.9,8.7,.6);
 for(let i=0;i<7;i++)leaf(b[0],b[1],22+(i%3)*5,Math.PI/2+(i-3)*.28,6,greens[i%4],'#1f5a38',Math.sin(n*.06+i)*2);
 b=P(.6,8.55,3);
 for(let i=0;i<6;i++)leaf(b[0],b[1],11+(i%3)*3,Math.PI/2+(i-2.5)*.35,3,greens[i%4],'#1f5a38',Math.sin(n*.08+i)*1.4);
 b=P(8.5,.28,4.22);
 for(let i=0;i<5;i++)leaf(b[0],b[1],10+(i%3)*3,Math.PI/2+(i-2)*.4,3,greens[i%4],'#1f5a38',Math.sin(n*.08+i)*1.5);
 {const v=P(8.15,.5,4.12);for(let m=0;m<9;m++){const sw=Math.sin(n*.07+m*.4)*m*.3,x=v[0]+sw,y=v[1]+m*4;R(Math.round(x),Math.round(y),1,4,'#2f7a48');lf(Math.round(x)+(m%2?1:-6),Math.round(y)+1,greens[m%4])}}
 R(Math.round(hook[0])-1,Math.round(hook[1])-1,3,3,'#c8a070');
 L(hook,[hang[0]-6,hang[1]],'#c8a070');L(hook,[hang[0]+6,hang[1]],'#c8a070');
 poly([[hang[0]-7,hang[1]],[hang[0]+7,hang[1]],[hang[0]+5,hang[1]+8],[hang[0]-5,hang[1]+8]],'#b0503a');R(Math.round(hang[0])-8,Math.round(hang[1])-1,16,2,'#d9824f');
 for(let k=0;k<7;k++){const len=8+(k%4)*3;
  for(let m=0;m<len;m++){const sw=Math.sin(n*.06+k+m*.35)*m*.35,x=hang[0]-9+k*3+sw,y=hang[1]+8+m*4;
   R(Math.round(x),Math.round(y),1,4,'#2f7a48');lf(Math.round(x)+(m%2?1:-6),Math.round(y)+1,greens[(k+m)%4])}}
 vineHooks.forEach(v=>{for(let m=0;m<v.len;m++){const sw=Math.sin(n*.08+v.p+m*.4)*m*.28,x=v.x+sw,y=v.y+m*3;
  R(Math.round(x),Math.round(y),1,3,'#2f7a48');lf(Math.round(x)+(m%2?1:-4),Math.round(y),greens[(m+1)%4]);if(m==v.len-1)R(Math.round(x),Math.round(y)+3,2,2,'#ff9ac0')}})}
function curtain(u1,u2,ph){const sw=Math.sin(n*.045+ph)*.07;
 poly([P(u1,0,6.5),P(u2,0,6.5),P(u2+sw,0,2.2),P(u1+sw,0,2.2)],'#a85a3a');
 [(u2-u1)*.25,(u2-u1)*.65].forEach(o=>{const a=u1+o;poly([P(a,0,6.5),P(a+.12,0,6.5),P(a+.12+sw,0,2.2),P(a+sw,0,2.2)],'#8f4a2e')})}
function frame(){
 g=X;X.globalAlpha=1;
 X.drawImage(bg,0,0);
 X.save();X.beginPath();win.forEach((p,i)=>i?X.lineTo(p[0],p[1]):X.moveTo(p[0],p[1]));X.closePath();X.clip();
 clouds.forEach(c=>{c.x+=c.v;if(c.x>350)c.x=235;const cy=54+(c.x-262)*.5+c.dy;E(c.x,cy,c.r,c.r*.4,'#18284a');E(c.x+c.r*.4,cy-3,c.r*.6,c.r*.3,'#1d2f55')});
 drops.forEach(d=>{d.y+=d.v;d.x+=.3;if(d.y>136){d.y=46;d.x=258+rnd()*60}R(Math.round(d.x),Math.round(d.y),1,d.l,'rgba(150,185,225,'+d.a+')')});
 beads.forEach(b=>{b.y+=b.v;if(b.y>130){b.y=55;b.v=.15+rnd()*.15}R(b.x,Math.round(b.y),1,2,'rgba(190,210,235,.85)');R(b.x,Math.round(b.y)-5,1,5,'rgba(190,210,235,.25)')});
 if(n>=nextFlash){flash=[.9,.2,.7,.25,.1,0];nextFlash=n+130+rnd()*220}
 const f=flash.length?flash.shift():0;
 if(f)R(240,40,100,110,'rgba(200,220,255,'+(f*.5).toFixed(2)+')');
 X.restore();
 curtain(3.35,4.3,0);
 X.drawImage(fg,0,0);
 for(let r=0;r<5;r++){const z=3.55-r*.17,len=.3+.9*Math.abs(Math.sin(n/14+r*1.7));Q([.42,7.1,z],[.42,7.1+len,z],[.42,7.1+len,z+.08],[.42,7.1,z+.08],r%2?'#4fb38a':'#6ee7a0')}
 if(n%10<6){const c=P(.42,7.2+.9*Math.abs(Math.sin(n/14+6.8)),2.9);R(Math.round(c[0])+2,Math.round(c[1]),2,3,'#e8c070')}
 plants();
 const pulse=.5+.5*Math.sin(n*.12);
 E(mlamp[0],mlamp[1]-6,30,24,'rgba(255,140,70,'+(.05+.04*pulse).toFixed(3)+')');E(mlamp[0],mlamp[1]-6,16,13,'rgba(255,150,80,'+(.08+.05*pulse).toFixed(3)+')');
 R(Math.round(mlamp[0])-2,Math.round(mlamp[1])-8,4,8,'#f1e3d0');E(mlamp[0],mlamp[1]-9,9,5,'#ff8a4a');R(Math.round(mlamp[0])-4,Math.round(mlamp[1])-11,2,2,'#fff4e0');R(Math.round(mlamp[0])+2,Math.round(mlamp[1])-10,2,2,'#fff4e0');
 const fl=(rnd()*2|0);
 E(candle[0],candle[1],11,11,'rgba(255,170,80,.12)');R(Math.round(candle[0]),Math.round(candle[1])-3-fl,2,3+fl,'#ffd27a');R(Math.round(candle[0]),Math.round(candle[1])-4-fl,1,1,'#fff0b0');
 R(Math.round(tip[0]),Math.round(tip[1]),1,1,n%8<5?'#ff6a3a':'#a03a20');
 for(let k=0;k<10;k++){const t=((n*.6+k*3)%30)/30;R(Math.round(tip[0]+Math.sin(t*9+k)*4*t),Math.round(tip[1]-2-t*42),1,1,'rgba(230,230,240,'+((1-t)*.45).toFixed(2)+')')}
 motes.forEach(m=>{m.x+=Math.sin(n*.03+m.p)*.3;m.y-=.12*m.s;if(m.y<20){m.y=205;m.x=90+rnd()*250}const a=(.25+.6*Math.abs(Math.sin(n*.05+m.p))).toFixed(2);R(Math.round(m.x),Math.round(m.y),m.s>.8?2:1,m.s>.8?2:1,'rgba(255,225,160,'+a+')')});
 for(let k=0;k<3;k++)if((n+k*13)%40<6){const a=k*2.1+Math.floor((n+k*13)/40),sx=hp[0]+Math.cos(a)*14,sy=hp[1]+Math.sin(a)*6-2;R(Math.round(sx)-2,Math.round(sy),5,1,'#e8f0ff');R(Math.round(sx),Math.round(sy)-2,1,5,'#e8f0ff')}
 bulbs.forEach((b,i)=>{X.globalAlpha=.6+.4*Math.sin(n*.18+i*1.7);E(b.x,b.y,6,6,'rgba(255,200,120,.16)');R(Math.round(b.x)-1,Math.round(b.y)-1,3,3,b.c);X.globalAlpha=1});
 for(let k=0;k<3;k++){const p=((n/2)+k*4)%14;R(Math.round(mug[0]+Math.sin((n+k*7)/5)*1.5),Math.round(mug[1]-p),1,1,'rgba(255,255,255,'+(0.55*(1-p/14)).toFixed(2)+')')}
 if(typeof SPOTS!=='undefined'&&window.hot){const sp=SPOTS.find(q=>q.title===window.hot);if(sp){const[cx,cy,rx,ry]=sp.obj,a=.55+.45*Math.sin(n*.3);for(let k=0;k<56;k++){const t=k/56*6.283;R(Math.round(cx+Math.cos(t)*rx),Math.round(cy+Math.sin(t)*ry),2,2,'rgba(255,214,120,'+a.toFixed(2)+')')}}}
 X.globalAlpha=.9+.1*Math.sin(n*.31)*Math.sin(n*.09+1);
 X.drawImage(gl,0,0);X.globalAlpha=1;
 n++}
frame();
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)setInterval(frame,90);
})();
