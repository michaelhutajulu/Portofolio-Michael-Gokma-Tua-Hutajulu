/* ═══════════════════════════════════════════════════
   MAIN.JS — All Site Interactions & Animations
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CURSOR (desktop only) ── */
  const cur = document.getElementById('cur');
  const curdot = document.getElementById('curdot');
  let mx = 0, my = 0, cx = 0, cy = 0;

  if (window.matchMedia('(hover: hover)').matches) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      if (curdot) { curdot.style.left = mx + 'px'; curdot.style.top = my + 'px'; }
    });

    function lerp(a, b, t) { return a + (b - a) * t; }
    (function animCursor() {
      cx = lerp(cx, mx, 0.13);
      cy = lerp(cy, my, 0.13);
      if (cur) { cur.style.left = cx + 'px'; cur.style.top = cy + 'px'; }
      requestAnimationFrame(animCursor);
    })();

    document.querySelectorAll('a,button,.proj-card,.blog-card,.soc-card,.badge,.filter-btn,.tool-card,.stack-badge').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });
  }

  /* ── NAVBAR SCROLL ──
     PERBAIKAN: hanya toggle class 'scrolled', TIDAK menyentuh display/visibility navbar
     sehingga burger tidak hilang saat scroll
  ── */
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    if (nav) {
      // Hanya tambah/hapus class scrolled — tidak mengubah apapun lain
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }
    updateActiveNav();
  }, { passive: true });

  function updateActiveNav() {
    const sections = ['hero','tentang','tools','proyek','pengalaman','blog','kontak'];
    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 120) current = id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ── BURGER MENU ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      // Prevent body scroll saat menu terbuka
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Tutup menu saat klik di luar
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) &&
          !burger.contains(e.target)) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── CANVAS PARTICLE HERO ── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initPts(); }, { passive: true });

    function initPts() {
      pts = Array.from({ length: 90 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.4,
        a: Math.random() * 0.45 + 0.08,
      }));
    }
    initPts();

    let mouseXc = -9999, mouseYc = -9999;
    document.addEventListener('mousemove', e => { mouseXc = e.clientX; mouseYc = e.clientY; }, { passive: true });

    function drawLoop() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const dx = mouseXc - p.x, dy = mouseYc - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          p.vx += dx / dist * 0.012;
          p.vy += dy / dist * 0.012;
        }
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) { p.vx /= speed; p.vy /= speed; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110,86,255,${p.a})`;
        ctx.fill();
      });

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(110,86,255,${(1 - d / 130) * 0.09})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawLoop);
    }
    drawLoop();
  }

  /* ── TYPEWRITER ── */
  const typerEl = document.getElementById('typer');
  if (typerEl) {
    const roles = [
      'Full Stack Developer',
      'Backend Engineer',
      'API Architect',
      'Problem Solver',
      'Open Source Enthusiast'
    ];
    let ri = 0, ci = 0, del = false;
    const SPEED = 85, DEL_SPEED = 40, PAUSE = 2200;

    function type() {
      const cur = roles[ri];
      if (del) {
        typerEl.textContent = cur.substring(0, ci--);
        if (ci < 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 350); return; }
        setTimeout(type, DEL_SPEED);
      } else {
        typerEl.textContent = cur.substring(0, ci++);
        if (ci > cur.length) { del = true; setTimeout(type, PAUSE); return; }
        setTimeout(type, SPEED);
      }
    }
    setTimeout(type, 900);
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('[data-count]');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target._counted) {
        e.target._counted = true;
        const target = +e.target.dataset.count;
        let cur = 0;
        const inc = target / 55;
        const t = setInterval(() => {
          cur += inc;
          if (cur >= target) { cur = target; clearInterval(t); }
          e.target.textContent = Math.round(cur);
        }, 28);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => cObs.observe(c));

  /* ── SCROLL REVEAL ── */
  const revEls = document.querySelectorAll('.reveal');
  const rObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revEls.forEach(el => rObs.observe(el));

  /* ── TOOLS FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const toolCards = document.querySelectorAll('.tool-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      toolCards.forEach(card => {
        if (cat === 'semua' || card.dataset.cat === cat) {
          card.style.display = 'flex';
          card.style.animation = 'fadeUp .35s forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── COPY EMAIL ── */
  window.copyEmail = function () {
    const email = document.getElementById('emailText')
      ? document.getElementById('emailText').textContent.trim()
      : 'mchlhutajulu@gmail.com';
    const toast = document.getElementById('copyToast');
    const btn = document.getElementById('emailBtn');

    const copy = () => {
      if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); }
      if (btn) { btn.style.borderColor = 'var(--violet)'; setTimeout(() => btn.style.borderColor = '', 2500); }
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(copy).catch(() => fallback(email, copy));
    } else {
      fallback(email, copy);
    }
  };

  function fallback(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta); cb();
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── TILT CARDS (subtle, desktop only) ── */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.proj-card, .blog-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ── ACTIVE NAV ON LOAD ── */
  updateActiveNav();

})();