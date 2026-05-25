/* =====================================================
   script.js — hi shreya 😭 (v2.1 Mobile Audio + Screen Fixed)
   ===================================================== */

'use strict';

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
const state = {
  step1Done:    false,
  step2Done:    false,
  suspiciousIdx: 0,
  musicStarted: false,
};

const suspiciousTexts = [
  'fair tbh',
  'but like… 10 seconds 😭',
  'i promise im normal',
  'okay maybe mildly awkward',
  'just peek pls',
  'no pressure promise',
  'nah this is suspicious',
];

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */
const $    = id => document.getElementById(id);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rand  = (a, b) => a + Math.random() * (b - a);

/* ─────────────────────────────────────────
   SCREEN TRANSITIONS
───────────────────────────────────────── */
function goTo(nextId) {
  const current = document.querySelector('.screen.active');
  const next    = $(nextId);
  if (!next || next === current) return;

  if (current) {
    current.classList.add('leaving');
    current.classList.remove('active');
    setTimeout(() => current.classList.remove('leaving'), 700);
  }

  const delay = current ? 420 : 0;
  setTimeout(() => {
    next.classList.add('active');
    screenInit[nextId] && screenInit[nextId]();
  }, delay);
}

/* ─────────────────────────────────────────
   CANVAS PARTICLES
───────────────────────────────────────── */
const canvas = $('bgCanvas');
const ctx    = canvas.getContext('2d');
let particles    = [];
let particleBoost = false;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

const PALETTES = {
  neutral: ['rgba(248,187,208,','rgba(255,216,194,','rgba(237,231,246,','rgba(212,235,208,'],
  pink:    ['rgba(252,228,236,','rgba(248,187,208,','rgba(255,204,179,','rgba(255,255,255,'],
  warm:    ['rgba(255,216,194,','rgba(248,187,208,','rgba(253,244,230,','rgba(237,231,246,'],
};
let currentPalette = PALETTES.neutral;

class Dot {
  constructor() { this.reset(true); }
  reset(init) {
    this.x        = rand(0, canvas.width);
    this.y        = init ? rand(0, canvas.height) : canvas.height + 20;
    this.r        = rand(particleBoost ? 8 : 5, particleBoost ? 26 : 20);
    this.vy       = rand(0.12, 0.50);
    this.vx       = rand(-0.2, 0.2);
    this.life     = 0;
    this.maxLife  = rand(200, 500);
    this.maxAlpha = rand(0.10, particleBoost ? 0.45 : 0.30);
    this.alpha    = 0;
    const pal  = particleBoost ? PALETTES.pink : currentPalette;
    this.color = pal[Math.floor(Math.random() * pal.length)];
  }
  update() {
    this.life++;
    this.x += this.vx + Math.sin(this.life * 0.025) * 0.3;
    this.y -= this.vy;
    const fade = 40;
    if (this.life < fade) {
      this.alpha = (this.life / fade) * this.maxAlpha;
    } else if (this.life > this.maxLife - fade) {
      this.alpha = ((this.maxLife - this.life) / fade) * this.maxAlpha;
    } else {
      this.alpha = this.maxAlpha;
    }
    if (this.life >= this.maxLife || this.y < -30) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `${this.color}${this.alpha.toFixed(2)})`;
    ctx.shadowBlur  = 14;
    ctx.shadowColor = `${this.color}0.15)`;
    ctx.fill();
    ctx.restore();
  }
}

function initParticles(count = 42) {
  particles = Array.from({ length: count }, () => new Dot());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

/* ─────────────────────────────────────────
   ROMANTIC ORBS — ambient background layer
───────────────────────────────────────── */
const ORB_CONFIGS = [
  { size: 320, lp: '8%',  tp: '4%',   color:'#fce4ec', dur:14, op:0.60, delay:0   },
  { size: 260, lp: '65%', tp: '55%',  color:'#f8bbd0', dur:18, op:0.52, delay:1.5 },
  { size: 200, lp: '75%', tp: '5%',   color:'#ffd8c2', dur:16, op:0.48, delay:3   },
  { size: 230, lp: '0%',  tp: '65%',  color:'#ede7f6', dur:20, op:0.50, delay:1   },
  { size: 170, lp: '42%', tp: '78%',  color:'#fce4ec', dur:12, op:0.42, delay:2   },
  { size: 130, lp: '50%', tp: '28%',  color:'#f8bbd0', dur:15, op:0.38, delay:4   },
  { size: 150, lp: '28%', tp: '10%',  color:'#ffd8c2', dur:22, op:0.35, delay:2.5 },
  { size: 110, lp: '88%', tp: '40%',  color:'#f9d5e5', dur:17, op:0.40, delay:0.5 },
];

function injectRomanticBg(screenEl) {
  if (screenEl.querySelector('.romantic-orbs')) return;

  const shimmer = document.createElement('div');
  shimmer.className = 'romantic-shimmer';
  screenEl.insertBefore(shimmer, screenEl.firstChild);

  const container = document.createElement('div');
  container.className = 'romantic-orbs';

  ORB_CONFIGS.forEach(o => {
    const div = document.createElement('div');
    div.className = 'r-orb';

    const kf = () => `${rand(-55, 55).toFixed(1)}px`;
    div.style.cssText = `
      width: ${o.size}px;
      height: ${o.size}px;
      left: ${o.lp};
      top: ${o.tp};
      background: radial-gradient(circle, ${o.color} 0%, transparent 70%);
      --dur: ${o.dur}s;
      --max-op: ${o.op};
      --x1:${kf()}; --y1:${kf()};
      --x2:${kf()}; --y2:${kf()};
      --x3:${kf()}; --y3:${kf()};
      --x4:${kf()}; --y4:${kf()};
      animation-delay: 0s, ${o.delay}s;
    `;
    container.appendChild(div);
  });

  const SPARKLE_COLORS = ['#f8bbd0','#ffd8c2','#ede7f6','#fce4ec','#ffd6e7'];
  for (let i = 0; i < 18; i++) {
    const sp = document.createElement('div');
    sp.className = 'sparkle';
    const sz = rand(4, 10);
    const col = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    sp.style.cssText = `
      width:${sz}px; height:${sz}px;
      left:${rand(5,95)}%; top:${rand(5,95)}%;
      background:${col};
      --sp-dur:${rand(2,5).toFixed(1)}s;
      --sp-delay:${rand(0,4).toFixed(1)}s;
      --sp-op:${rand(0.5,0.9).toFixed(2)};
    `;
    container.appendChild(sp);
  }

  screenEl.insertBefore(container, screenEl.firstChild);
}

/* ─────────────────────────────────────────
   TYPING ENGINE
───────────────────────────────────────── */
async function typeLines(lines, container) {
  container.innerHTML = '';
  for (const cfg of lines) {
    const el = document.createElement('p');
    el.className = 'type-line' + (cfg.cls ? ' ' + cfg.cls : '');
    container.appendChild(el);

    await sleep(80);
    el.classList.add('show');

    const text  = cfg.text;
    const delay = cfg.charDelay || 46;
    for (let c = 0; c <= text.length; c++) {
      el.textContent = text.slice(0, c);
      await sleep(c === 0 ? 0 : rand(delay * 0.6, delay * 1.5));
    }
    await sleep(cfg.pause !== undefined ? cfg.pause : 520);
  }
}

/* ─────────────────────────────────────────
   MUSIC
───────────────────────────────────────── */
const music = $('bgMusic');

async function startMusic() {
  if (state.musicStarted) return;
  state.musicStarted = true;
  music.volume = 0;
  try {
    await music.play();
    let v = 0;
    const fade = setInterval(() => {
      v = Math.min(v + 0.02, 0.55);
      music.volume = v;
      if (v >= 0.55) clearInterval(fade);
    }, 80);
  } catch (_) { /* blocked handler fallback */ }
}

/* ─────────────────────────────────────────
   ESCAPE BUTTON — RUNAWAY LOGIC
───────────────────────────────────────── */
let escapeFixed  = false;
let escapeActive = false;

// "too slow" toast element
const fleeToast = document.createElement('div');
fleeToast.className = 'flee-toast';
fleeToast.textContent = 'too slow 😭';
document.body.appendChild(fleeToast);

let toastTimer = null;

function showFleeToast(x, y) {
  fleeToast.style.left = `${x}px`;
  fleeToast.style.top  = `${Math.max(10, y - 44)}px`;
  fleeToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => fleeToast.classList.remove('show'), 1100);
}

function fixEscapeButton() {
  const btn = $('btnEscape');
  if (escapeFixed || !btn || btn.classList.contains('hidden')) return;

  const rect  = btn.getBoundingClientRect();
  btn.style.position = 'fixed';
  btn.style.left     = `${rect.left}px`;
  btn.style.top      = `${rect.top}px`;
  btn.style.margin   = '0';
  btn.classList.add('btn--escape');
  escapeFixed = true;
}

// NEW LOGIC: Jump nearby, never leave screen
function getFleePos(currentX, currentY, btnW, btnH) {
  const margin = 20; // safe padding from edges
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let newX, newY;
  let attempts = 0;

  do {
    // Pick a random direction
    const angle = Math.random() * Math.PI * 2;
    // Jump a short distance (between 100 and 220 pixels)
    const dist = rand(100, 220); 

    newX = currentX + Math.cos(angle) * dist;
    newY = currentY + Math.sin(angle) * dist;

    // STRICTLY clamp inside the visible screen bounds
    newX = Math.max(margin, Math.min(newX, vw - btnW - margin));
    newY = Math.max(margin, Math.min(newY, vh - btnH - margin));

    attempts++;
  } while (
    // Keep trying if it hits a wall and didn't move far enough away
    Math.hypot(newX - currentX, newY - currentY) < 60 && attempts < 10
  );

  return { x: newX, y: newY };
}

function fleeButton(mouseX, mouseY, fromToast) {
  const btn = $('btnEscape');
  if (!btn || btn.classList.contains('hidden')) return;

  fixEscapeButton();

  const bw  = btn.offsetWidth;
  const bh  = btn.offsetHeight;

  // Find exact current position
  const currentX = parseFloat(btn.style.left);
  const currentY = parseFloat(btn.style.top);

  const pos = getFleePos(currentX, currentY, bw, bh);

  btn.style.left = `${pos.x}px`;
  btn.style.top  = `${pos.y}px`;

  if (fromToast) {
    showFleeToast(mouseX, mouseY);
  }
}

// Desktop: flee on proximity
document.addEventListener('mousemove', e => {
  if (!escapeActive) return;
  const btn = $('btnEscape');
  if (!btn || btn.classList.contains('hidden')) return;

  const rect = btn.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

  if (dist < 110) fleeButton(e.clientX, e.clientY, true);
});

// Mobile: flee on touchstart
document.getElementById('btnEscape').addEventListener('touchstart', e => {
  e.preventDefault();
  const touch = e.touches[0];
  fleeButton(touch.clientX, touch.clientY, true);
}, { passive: false });

// Catch any stray click
document.getElementById('btnEscape').addEventListener('click', e => {
  e.preventDefault();
  fleeButton(
    parseFloat($('btnEscape').style.left) + $('btnEscape').offsetWidth / 2,
    parseFloat($('btnEscape').style.top)  + $('btnEscape').offsetHeight / 2,
    false
  );
});

/* ─────────────────────────────────────────
   SCREEN INIT HOOKS
───────────────────────────────────────── */
const screenInit = {};

screenInit['screenIntro'] = async () => {
  currentPalette = PALETTES.neutral;
  const container = $('introTyping');
  const buttons   = $('introButtons');

  await typeLines([
    { text:'hiii shreya 😭',                                   cls:'type-line--big',   pause:700 },
    { text:'okay this is slightly random',                     cls:'type-line--muted', pause:600 },
    { text:'but we were in the same cc trip thing',            cls:'',                 pause:600 },
    { text:'and idk… you genuinely seemed really nice',        cls:'',                 pause:600 },
    { text:'also okay i\'ll be honest',                       cls:'type-line--muted', pause:500 },
    { text:'i thought you were really pretty 😭',             cls:'',                 pause:600 },
    { text:'so before this becomes awkward…',                 cls:'type-line--muted', pause:400 },
  ], container);

  buttons.classList.remove('hidden');
};

screenInit['screenHub'] = async () => {
  currentPalette = PALETTES.neutral;
  escapeActive = false;
  escapeFixed  = false;
  const btn = $('btnEscape');
  if (btn) {
    btn.style.position = '';
    btn.style.left = '';
    btn.style.top  = '';
    btn.style.margin = '';
    btn.classList.remove('btn--escape');
  }

  const title = $('hubTitle');
  title.textContent = '';
  await sleep(300);
  const text = 'okay tiny context first 😭';
  for (let c = 0; c <= text.length; c++) {
    title.textContent = text.slice(0, c);
    await sleep(rand(35, 72));
  }
  refreshHub();
};

screenInit['screenStep1'] = async () => {
  currentPalette = PALETTES.neutral;
  const container = $('step1Typing');
  const btn       = $('btnStep1Done');

  await typeLines([
    { text:'okay so basically',               cls:'type-line--muted', pause:700 },
    { text:'randomly texting felt scary 😭',  cls:'',                 pause:620 },
    { text:'and somehow my brain decided',    cls:'type-line--muted', pause:580 },
    { text:'yes. build website.',             cls:'type-line--big',   pause:700, charDelay:68 },
    { text:'so… here we are',                cls:'type-line--muted', pause:400 },
  ], container);

  btn.classList.remove('hidden');
};

screenInit['screenStep2'] = async () => {
  currentPalette = PALETTES.pink;
  particleBoost  = false;
  startMusic();

  injectRomanticBg($('screenStep2'));

  const container = $('step2Typing');
  const btn       = $('btnStep2Done');

  await typeLines([
    { text:'i honestly don\'t know you much',  cls:'type-line--muted', pause:680 },
    { text:'but from what little i saw',       cls:'',                 pause:600 },
    { text:'you seemed really nice',           cls:'',                 pause:650 },
    { text:'and yeah okay 😭',                 cls:'type-line--muted', pause:550 },
    { text:'very pretty',                      cls:'type-line--big',   pause:720, charDelay:72 },
    { text:'so i just wanted to say hi',       cls:'',                 pause:600 },
    { text:'absolutely no pressure btw',       cls:'type-line--muted', pause:400 },
  ], container);

  btn.classList.remove('hidden');
};

screenInit['screenFinal'] = async () => {
  currentPalette = PALETTES.warm;
  particleBoost  = false;
  startMusic();

  injectRomanticBg($('screenFinal'));

  const container = $('finalTyping');
  const buttons   = $('finalButtons');

  await typeLines([
    { text:'soooo 😭',                                   cls:'type-line--muted', pause:700, charDelay:70 },
    { text:'if you\'d ever be down to talk sometime',   cls:'',                 pause:620 },
    { text:'or even just say hi',                       cls:'type-line--muted', pause:580 },
    { text:'i\'d genuinely like that',                  cls:'',                 pause:650 },
    { text:'but genuinely',                             cls:'type-line--muted', pause:500 },
    { text:'absolutely zero pressure',                  cls:'',                 pause:400 },
  ], container);

  buttons.classList.remove('hidden');

  await sleep(200);
  escapeActive = true;
};

screenInit['screenYes'] = async () => {
  currentPalette = PALETTES.pink;
  particleBoost  = true;
  particles.forEach(p => p.reset(false));
  startMusic();

  injectRomanticBg($('screenYes'));

  const container = $('yesTyping');
  await typeLines([
    { text:'yay 😭',                                  cls:'type-line--big',   pause:780, charDelay:90 },
    { text:'okay this worked better than expected',  cls:'type-line--muted', pause:640 },
    { text:'either way hi shreya hehe',              cls:'',                 pause:0   },
  ], container);
};

screenInit['screenEscape'] = async () => {
  currentPalette = PALETTES.neutral;
  particleBoost  = false;
  escapeActive   = false;

  const container = $('escapeTyping');
  await typeLines([
    { text:'fair enough 😭',                              cls:'type-line--big',   pause:720, charDelay:70 },
    { text:'thanks for surviving this tiny website',    cls:'type-line--muted', pause:620 },
    { text:'genuinely hope you have a lovely day',     cls:'',                 pause:0   },
  ], container);
};

/* ─────────────────────────────────────────
   HUB CARD LOGIC
───────────────────────────────────────── */
function refreshHub() {
  const c1 = $('card1');
  const c2 = $('card2');
  const cf = $('cardFinal');

  if (state.step1Done) {
    c1.classList.add('hub-card--complete');
    c1.querySelector('.hub-card__arrow').classList.add('hidden');
    c1.querySelector('.hub-card__done').classList.remove('hidden');
  }

  if (state.step2Done) {
    c2.classList.add('hub-card--complete');
    c2.querySelector('.hub-card__arrow').classList.add('hidden');
    c2.querySelector('.hub-card__done').classList.remove('hidden');
  }

  if (state.step1Done && state.step2Done) {
    cf.classList.remove('hub-card--locked');
    cf.classList.add('unlocked');
    cf.querySelector('.hub-card__lock').textContent = '→';
  }
}

document.querySelector('.hub-cards').addEventListener('click', e => {
  const card   = e.target.closest('.hub-card');
  if (!card) return;
  const target = card.dataset.target;

  if (card.id === 'cardFinal') {
    if (!state.step1Done || !state.step2Done) return;
    goTo('screenFinal');
    return;
  }
  if (card.classList.contains('hub-card--complete')) return;
  if (target) goTo(target);
});

/* ─────────────────────────────────────────
   BUTTON WIRING
───────────────────────────────────────── */
$('btnContinue').addEventListener('click', () => {
  // Mobile Audio explicit interaction proxy handler
  if (typeof music.play === 'function') {
    music.play().then(() => {
      if (!state.musicStarted) {
        state.musicStarted = true;
        music.volume = 0;
        let v = 0;
        const fade = setInterval(() => {
          v = Math.min(v + 0.02, 0.55);
          music.volume = v;
          if (v >= 0.55) clearInterval(fade);
        }, 80);
      }
    }).catch(() => {});
  }
  goTo('screenHub');
});

$('btnSuspicious').addEventListener('click', async e => {
  // Back up core initialization trigger for explicit mobile tap sequence
  if (typeof music.play === 'function') {
    music.play().then(() => { music.pause(); }).catch(() => {});
  }

  const btn = e.currentTarget;
  btn.disabled = true;
  btn.style.transform = 'scale(0.95)';
  await sleep(120);
  btn.style.transform = '';
  state.suspiciousIdx = (state.suspiciousIdx + 1) % suspiciousTexts.length;
  btn.textContent = suspiciousTexts[state.suspiciousIdx];
  btn.disabled = false;
});

$('btnStep1Done').addEventListener('click', () => {
  state.step1Done = true;
  goTo('screenHub');
});

$('btnStep2Done').addEventListener('click', () => {
  state.step2Done = true;
  goTo('screenHub');
});

$('btnYes').addEventListener('click', () => {
  if (typeof music.play === 'function') { music.play().catch(() => {}); }
  goTo('screenYes');
});

/* btnEscape events are handled separately above (flee logic) */

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
function init() {
  resizeCanvas();
  initParticles(42);
  animateParticles();
  screenInit['screenIntro'] && screenInit['screenIntro']();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  particles.forEach(p => { if (p.x > canvas.width) p.x = rand(0, canvas.width); });

  // Update position safely if it's currently escaping
  if (escapeActive && escapeFixed) {
    const btn = $('btnEscape');
    if (btn) {
      const bw = btn.offsetWidth;
      const bh = btn.offsetHeight;
      const currentX = parseFloat(btn.style.left);
      const currentY = parseFloat(btn.style.top);
      
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Ensure it snaps back inside if resizing made it fall off screen
      const safeX = Math.max(20, Math.min(currentX, vw - bw - 20));
      const safeY = Math.max(20, Math.min(currentY, vh - bh - 20));
      
      btn.style.left = `${safeX}px`;
      btn.style.top  = `${safeY}px`;
    }
  }
});

document.addEventListener('touchstart', () => { startMusic(); }, { once: true });

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
