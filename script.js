const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const body=document.body, music=$('#bgMusic'), musicBtn=$('#musicBtn'), invocation=$('#invocation'), cinematic=$('#cinematic'), envelopeScene=$('#envelopeScene'), site=$('#site');
let petalsTimer=null,sparkleTimer=null,siteOpened=false;

function playMusic(){
  music.volume=.62;
  music.play().then(()=>musicBtn.classList.add('playing')).catch(()=>{});
}

function createSpark(x=null,y=null){
  const wrap=$('#sparkles'); if(!wrap)return;
  const s=document.createElement('i'); s.className='spark';
  s.style.left=(x??Math.random()*100)+'vw';
  s.style.top=(y??(45+Math.random()*45))+'vh';
  s.style.setProperty('--sx',(Math.random()*60-30)+'px');
  s.style.animationDuration=(1.5+Math.random()*1.7)+'s';
  wrap.appendChild(s); setTimeout(()=>s.remove(),3400);
}

function startAmbientSparkles(){
  if(sparkleTimer)return;
  sparkleTimer=setInterval(()=>{if(!document.hidden)createSpark()},380);
}

function showEnvelope(){
  cinematic.style.transition='opacity 1.15s ease,filter 1.15s ease';
  cinematic.style.opacity='0'; cinematic.style.filter='blur(5px)';
  setTimeout(()=>{
    cinematic.classList.add('hidden');
    envelopeScene.classList.remove('hidden');
    envelopeScene.setAttribute('aria-hidden','false');
    envelopeScene.animate([{opacity:0,transform:'scale(1.03)'},{opacity:1,transform:'scale(1)'}],{duration:1100,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'});
  },1080);
}

const blessingBtn=$('#blessingBtn');
let blessingStarted=false;
function enterInvitation(){
  if(blessingStarted)return;
  blessingStarted=true;
  playMusic(); startAmbientSparkles();
  for(let i=0;i<24;i++)setTimeout(()=>createSpark(50+(Math.random()*20-10),42+(Math.random()*18-9)),i*28);
  invocation.classList.add('leave');
  setTimeout(()=>{
    invocation.classList.add('hidden');
    invocation.setAttribute('aria-hidden','true');
    cinematic.classList.remove('hidden');
    cinematic.setAttribute('aria-hidden','false');
    cinematic.style.opacity='1'; cinematic.style.filter='none';
    if(cinematic.animate){
      cinematic.animate([{opacity:0,transform:'scale(1.015)'},{opacity:1,transform:'scale(1)'}],{duration:800,easing:'ease-out',fill:'both'});
    }
    setTimeout(showEnvelope,7800);
  },620);
}
if(blessingBtn){
  blessingBtn.addEventListener('click',enterInvitation);
  blessingBtn.addEventListener('touchend',(e)=>{e.preventDefault();enterInvitation();},{passive:false});
}


$('#sealBtn').addEventListener('click',()=>{
  playMusic();
  $('#envelope').classList.add('open');
  const seal=$('#sealBtn').getBoundingClientRect();
  for(let i=0;i<28;i++)setTimeout(()=>createSpark((seal.left+seal.width/2)/innerWidth*100,(seal.top+seal.height/2)/innerHeight*100),i*24);
  setTimeout(()=>{envelopeScene.style.transition='opacity 1s ease,transform 1s ease';envelopeScene.style.opacity='0';envelopeScene.style.transform='scale(1.025)'},1550);
  setTimeout(()=>{
    envelopeScene.classList.add('hidden');
    site.classList.remove('hidden'); site.setAttribute('aria-hidden','false'); body.classList.remove('locked');
    musicBtn.classList.add('show'); $('.scroll-progress').classList.add('show');
    siteOpened=true; startPetals(); observe(); updateProgress();
    window.scrollTo({top:0,behavior:'auto'});
  },2500);
});

musicBtn.addEventListener('click',()=>{
  if(music.paused)playMusic(); else{music.pause();musicBtn.classList.remove('playing')}
});

function startPetals(){
  if(petalsTimer)return;
  const wrap=$('#petals');
  petalsTimer=setInterval(()=>{
    if(document.hidden)return;
    const p=document.createElement('i'); p.className='petal';
    p.style.left=Math.random()*100+'vw'; p.style.animationDuration=(6+Math.random()*6)+'s';
    p.style.setProperty('--drift',(Math.random()*180-90)+'px'); p.style.transform=`scale(${.5+Math.random()*.8})`;
    wrap.appendChild(p); setTimeout(()=>p.remove(),12500);
  },760);
}

function observe(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('inview');io.unobserve(e.target)}
  }),{threshold:.15});
  $$('.reveal-up,.reveal-left,.reveal-right,.route-art,.event-card,.hero-copy').forEach(el=>io.observe(el));
}

function updateProgress(){
  if(!siteOpened)return;
  const max=document.documentElement.scrollHeight-innerHeight;
  const pct=max>0?Math.min(100,Math.max(0,scrollY/max*100)):0;
  $('#scrollProgress').style.height=pct+'%';
}

let lastY=0;
window.addEventListener('scroll',()=>{
  updateProgress();
  $$('.parallax').forEach(el=>{
    const r=el.parentElement.getBoundingClientRect();
    const y=(r.top-innerHeight/2)*-.06;
    el.style.transform=`translateY(${y}px) scale(1.04)`;
  });
  if(siteOpened && Math.abs(scrollY-lastY)>120){createSpark(10+Math.random()*80,75+Math.random()*15);lastY=scrollY}
},{passive:true});

function updateCountdown(){
  const target=new Date('2026-11-25T00:00:00+05:30').getTime(), now=Date.now(), d=Math.max(0,target-now);
  $('#days').textContent=String(Math.floor(d/86400000)).padStart(3,'0');
  $('#hours').textContent=String(Math.floor(d/3600000)%24).padStart(2,'0');
  $('#mins').textContent=String(Math.floor(d/60000)%60).padStart(2,'0');
  $('#secs').textContent=String(Math.floor(d/1000)%60).padStart(2,'0');
}
updateCountdown(); setInterval(updateCountdown,1000);

const slides=$$('#galleryTrack figure'), dots=$('#galleryDots'); let gi=0;
slides.forEach((_,i)=>{const b=document.createElement('button');if(i===0)b.classList.add('active');b.setAttribute('aria-label',`Show photo ${i+1}`);b.addEventListener('click',()=>show(i));dots.appendChild(b)});
function show(i){
  slides[gi].classList.remove('active'); dots.children[gi].classList.remove('active');
  gi=(i+slides.length)%slides.length; slides[gi].classList.add('active'); dots.children[gi].classList.add('active');
}
$('#prevPhoto').onclick=()=>show(gi-1); $('#nextPhoto').onclick=()=>show(gi+1);
setInterval(()=>{if(siteOpened)show(gi+1)},6500);

$('#calendarBtn').addEventListener('click',()=>{
  const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Satyam Shivani Wedding//EN\nBEGIN:VEVENT\nUID:satyam-shivani-20261125\nDTSTAMP:20260820T000000Z\nDTSTART;VALUE=DATE:20261125\nDTEND;VALUE=DATE:20261126\nSUMMARY:Satyam & Shivani Wedding\nLOCATION:Majhaura, Darbhanga, Bihar, India\nDESCRIPTION:Wedding celebration of Satyam & Shivani\nEND:VEVENT\nEND:VCALENDAR`;
  const blob=new Blob([ics],{type:'text/calendar'}),a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='satyam-shivani-wedding.ics'; a.click(); URL.revokeObjectURL(a.href);
});

$('#shareBtn').addEventListener('click',async()=>{
  const data={title:'Satyam & Shivani — Wedding Invitation',text:'Join us as we celebrate Satyam & Shivani on 25 November 2026.',url:location.href};
  if(navigator.share){try{await navigator.share(data)}catch(e){}}
  else{try{await navigator.clipboard.writeText(location.href);$('#shareBtn').textContent='Link copied ✓';setTimeout(()=>$('#shareBtn').textContent='Share Invitation',1800)}catch(e){}}
});
