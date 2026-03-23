/* ===================================================
   George Nădejde Portfolio — main.js
   =================================================== */

// ---- Particles Canvas ----
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.color = Math.random() > 0.6 ? '#00ff88' : '#00d4ff';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();

// ---- Typewriter Effect ----
function typewrite(el, text, speed = 65, delay = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      let i = 0;
      el.textContent = '';
      el.style.borderRight = '2px solid var(--green)';
      const interval = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setTimeout(() => { el.style.borderRight = 'none'; resolve(); }, 400);
        }
      }, speed);
    }, delay);
  });
}

// ---- Hero Terminal Sequence ----
(function heroSequence() {
  const lines = document.querySelectorAll('#hero .terminal-line, #hero .terminal-output, #hero .blink-line');
  const cmds = document.querySelectorAll('#hero .typewriter');

  const delays = [0, 400, 800, 1600, 2100, 2900, 3400, 3900];
  const cmdTexts = ['whoami', 'cat mission.txt', 'locate --me'];
  let cmdIdx = 0;

  lines.forEach((el, i) => {
    const d = delays[i] || 0;
    el.style.animationDelay = d + 'ms';
  });

  cmds.forEach(el => {
    const text = el.dataset.text || '';
    const delay = parseInt(el.closest('.terminal-line')?.style.animationDelay) || 0;
    typewrite(el, text, 70, delay + 100);
    cmdIdx++;
  });
})();

// ---- Scroll Reveal ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.section-header, .timeline-card, .skill-category, .edu-card, .cert-card, .contact-link, .contact-terminal, .stat-card').forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ---- Skill bar animation ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.classList.add('animated');
      });
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ---- Counter animation ----
function animateCounter(el, target, duration = 1500, isFloat = false) {
  let start = null;
  const step = (ts) => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const val = isFloat ? (ease * target).toFixed(2) : Math.floor(ease * target);
    el.textContent = val;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = !el.classList.contains('count-int');
      animateCounter(el, target, 1500, isFloat);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

// ---- Navbar active link highlight ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-30% 0px -70% 0px' });

sections.forEach(s => navObserver.observe(s));

// Add active style dynamically
const style = document.createElement('style');
style.textContent = '.nav-link.active { color: var(--green) !important; }';
document.head.appendChild(style);

// ---- Mobile nav toggle ----
const toggle = document.getElementById('navToggle');
const navLinksEl = document.getElementById('navLinks');
toggle?.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});
navLinksEl?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// ---- Contact form handling ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    const btn = form.querySelector('.form-submit');
    btn.textContent = '$ sending...';
    btn.disabled = true;
    // Formspree handles the submission — just show feedback
    await new Promise(r => setTimeout(r, 1500));
    btn.textContent = '✓ Message sent!';
    btn.style.background = 'var(--cyan)';
  });
}

// ---- Navbar scroll shrink ----
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  nb?.classList.toggle('scrolled', window.scrollY > 80);
});

const scrolledStyle = document.createElement('style');
scrolledStyle.textContent = '#navbar.scrolled { padding-top: 0; padding-bottom: 0; } #navbar.scrolled .nav-inner { height: 52px; }';
document.head.appendChild(scrolledStyle);
