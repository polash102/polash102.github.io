// mobile nav toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger?.addEventListener('click', () => {
  const open = nav.style.display === 'flex';
  nav.style.display = open ? 'none' : 'flex';
  burger.setAttribute('aria-expanded', String(!open));
});

// smooth scroll + active link
const links = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('section.section')];
links.forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    const id = l.getAttribute('href');
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    links.forEach(x => x.classList.remove('active'));
    l.classList.add('active');
    if (window.innerWidth < 680) nav.style.display = 'none';
  });
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const id = '#' + entry.target.id;
      links.forEach(x => x.classList.toggle('active', x.getAttribute('href') === id));
    }
  });
},{ threshold: 0.5 });
sections.forEach(s => observer.observe(s));

// theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle?.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  themeToggle.textContent = document.documentElement.classList.contains('light') ? '☀' : '☾';
});

// contact “send” without backend (opens mail client)
function sendMail(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const body = encodeURIComponent(`Hi Polash,\n\n${message}\n\n— ${name}\n${email}`);
  window.location.href = `mailto:polash3063013@gmail.com?subject=Portfolio%20Contact&body=${body}`;
  document.getElementById('formStatus').textContent = "Opening your email app…";
  return false;
}
window.sendMail = sendMail;

// footer year
document.getElementById('year').textContent = new Date().getFullYear();
// 3D "press to front" micro-interaction for nav links, chips, cards
function pressEffect(el) {
  el.addEventListener('mousedown', () => el.classList.add('pressed'));
  ['mouseup','mouseleave','blur'].forEach(evt =>
    el.addEventListener(evt, () => el.classList.remove('pressed'))
  );
}
document.querySelectorAll('.nav-link, .chip, .card, .skill-card, .about-card').forEach(pressEffect);

// When a chip is clicked, give it an active glow for 1.5s
document.querySelectorAll('.chip').forEach(ch => {
  ch.addEventListener('click', () => {
    ch.classList.add('active');
    setTimeout(() => ch.classList.remove('active'), 1500);
  });
});













/* ===========================
   3D-ish particle background
   =========================== */
(function(){
  const c = document.getElementById('bgDots');
  if(!c) return;
  const ctx = c.getContext('2d', { alpha:true });
  let w, h, pr, dots, raf;

  function resize(){
    pr = window.devicePixelRatio || 1;
    w = c.width = innerWidth * pr;
    h = c.height = innerHeight * pr;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    spawn();
  }

  function spawn(){
    const count = Math.round((innerWidth * innerHeight)/18000); // density
    dots = new Array(count).fill(0).map(()=>({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()*2-1)*.12*pr, vy:(Math.random()*2-1)*.12*pr,
      r: (Math.random()*1.6+0.6)*pr,
    }));
  }

  function step(){
    ctx.clearRect(0,0,w,h);
    // glow
    ctx.shadowColor = 'rgba(120, 240, 255, 0.25)';
    ctx.shadowBlur = 6*pr;

    // draw & move
    for(const d of dots){
      d.x += d.vx; d.y += d.vy;
      if(d.x<0||d.x>w) d.vx*=-1;
      if(d.y<0||d.y>h) d.vy*=-1;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(137,247,254,0.9)'; // cyan
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.fill();
    }

    // soft connections
    ctx.shadowBlur = 0;
    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const a = dots[i], b = dots[j];
        const dx=a.x-b.x, dy=a.y-b.y, dist = Math.hypot(dx,dy);
        if(dist < 120*pr){
          ctx.strokeStyle = `rgba(155,142,255,${(1 - dist/(120*pr))*0.35})`;
          ctx.lineWidth = pr*0.6;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(step);
  }

  resize(); step();
  addEventListener('resize', ()=>{ cancelAnimationFrame(raf); resize(); step(); }, {passive:true});
})();

/* ======================================
   Reveal on scroll (sections/cards etc.)
   ====================================== */
const revealTargets = document.querySelectorAll(
  '.section, .card, .about-card, .skill-card, .tl-content'
);
revealTargets.forEach(el => el.classList.add('reveal-start'));
const revObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.remove('reveal-start');
      e.target.classList.add('reveal-in');
      revObs.unobserve(e.target);
    }
  });
},{threshold:.18});
revealTargets.forEach(el=>revObs.observe(el));

/* ======================================
   Magnetic buttons (subtle)
   ====================================== */
document.querySelectorAll('.btn, .btn-outline, .btn-ghost').forEach(btn=>{
  btn.classList.add('magnet');
  const rect = ()=>btn.getBoundingClientRect();
  btn.addEventListener('mousemove', (e)=>{
    const r = rect();
    const x = (e.clientX - (r.left + r.width/2)) / (r.width/2);
    const y = (e.clientY - (r.top + r.height/2)) / (r.height/2);
    btn.style.transform = `translate(${x*4}px, ${y*4}px) translateZ(12px)`;
  });
  btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
});

/* ======================================
   Active nav underline indicator
   ====================================== */
(function(){
  const nav = document.getElementById('nav'); if(!nav) return;
  let indicator = document.createElement('div');
  indicator.className = 'nav-indicator';
  nav.style.position = 'relative';
  nav.appendChild(indicator);

  const links = nav.querySelectorAll('.nav-link');
  function moveTo(el){
    const r = el.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    indicator.style.left = (r.left - nr.left) + 'px';
    indicator.style.width = r.width + 'px';
    indicator.style.opacity = 1;
  }
  links.forEach(l=>{
    l.addEventListener('mouseenter', ()=>moveTo(l));
    l.addEventListener('focus', ()=>moveTo(l));
  });
  // sync with active section
  const activeSync = () => {
    const a = nav.querySelector('.nav-link.active') || links[0];
    if(a) moveTo(a);
  };
  activeSync(); addEventListener('resize', activeSync, {passive:true});
})();



/* =========================
   1) Typing Tagline Rotator
   ========================= */
(function(){
  const el = document.getElementById('type'); if(!el) return;
  const lines = [
    "Machine Learning Engineer • CSE (B.Sc.)",
    "Teaching Assistant • Research & Publications",
    "Security • Medical Imaging • Health Informatics",
    "Building ML systems with clarity & impact"
  ];
  const speed = 28, hold = 1100;
  let i=0, p=0, dir=1; // dir: +1 typing, -1 deleting
  function tick(){
    el.textContent = lines[i].slice(0, p);
    if(dir>0 && p === lines[i].length){ dir = -1; setTimeout(tick, hold); return; }
    if(dir<0 && p === 0){ dir = 1; i = (i+1) % lines.length; }
    p += dir;
    setTimeout(tick, dir>0 ? speed : speed*0.6);
  }
  tick();
})();

/* =========================
   2) Scroll progress bar
   ========================= */
(function(){
  const bar = document.getElementById('progress'); if(!bar) return;
  const onScroll = () => {
    const s = document.documentElement.scrollTop || document.body.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    bar.style.width = (s / h) * 100 + '%';
  };
  addEventListener('scroll', onScroll, { passive:true }); onScroll();
})();

/* ===============================================
   3) Avatar tilt + lightbox (click to enlarge)
   =============================================== */
(function(){
  const wrap = document.getElementById('avatarWrap'); if(!wrap) return;
  const lightbox = document.getElementById('lightbox');
  const img = lightbox?.querySelector('.lightbox-img');
  const close = lightbox?.querySelector('.lightbox-close');
  // tilt
  wrap.addEventListener('mousemove', (e)=>{
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - (r.left+r.width/2)) / (r.width/2);
    const y = (e.clientY - (r.top+r.height/2)) / (r.height/2);
    wrap.style.transform = `rotateY(${x*6}deg) rotateX(${y*-4}deg) translateY(-6px)`;
  });
  wrap.addEventListener('mouseleave', ()=>{ wrap.style.transform = ''; });
  // lightbox
  wrap.addEventListener('click', ()=>{
    if(!lightbox) return;
    lightbox.setAttribute('aria-hidden','false');
  });
  close?.addEventListener('click', ()=> lightbox.setAttribute('aria-hidden','true'));
  lightbox?.addEventListener('click', (e)=>{ if(e.target===lightbox || e.target.classList.contains('lightbox-backdrop')) lightbox.setAttribute('aria-hidden','true'); });
})();

/* ==================================================
   4) Card tilt + shine (projects / skill cards)
   ================================================== */
(function(){
  const tilt = (el, ev) => {
    const r = el.getBoundingClientRect();
    const x = (ev.clientX - (r.left + r.width/2)) / (r.width/2);
    const y = (ev.clientY - (r.top + r.height/2)) / (r.height/2);
    el.style.transform = `rotateY(${x*6}deg) rotateX(${y*-6}deg) translateY(-6px)`;
  };
  const cards = document.querySelectorAll('.card, .skill-card');
  cards.forEach(c=>{
    c.addEventListener('mousemove', (e)=>tilt(c,e));
    c.addEventListener('mouseleave', ()=>{ c.style.transform=''; });
  });
})();

/* ==================================================
   5) Remember theme toggle across visits
   ================================================== */
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if(saved === 'light') root.classList.add('light');
  if(toggle){
    toggle.textContent = root.classList.contains('light') ? '☀' : '☾';
    toggle.addEventListener('click', ()=>{
      root.classList.toggle('light');
      localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
      toggle.textContent = root.classList.contains('light') ? '☀' : '☾';
    });
  }
})();
