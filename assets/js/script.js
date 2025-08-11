// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    const target = href && document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu after navigation on small screens
      const header = document.querySelector('header');
      if (header && header.classList.contains('open')) {
        header.classList.remove('open');
        const btn = document.querySelector('.nav-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) en.target.classList.add('show'); });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Simple responsive carousel
function initCarousel() {
  const viewport = document.querySelector('.carousel-viewport');
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  if (!viewport || !track || slides.length === 0) return;

  let idx = 0;
  let autoTimer = null;
  let isAnimating = false;

  function update(immediate = false) {
    const w = viewport.clientWidth;
    if (immediate) {
      track.style.transition = 'none';
      track.style.transform = `translate3d(${-idx * w}px, 0, 0)`;
      // force reflow then restore transition
      track.getBoundingClientRect();
      track.style.transition = '';
    } else {
      track.style.transform = `translate3d(${-idx * w}px, 0, 0)`;
    }
  }

  function goto(i) {
    if (isAnimating) return;
    isAnimating = true;
    idx = (i + slides.length) % slides.length;
    update();
    // animation guard
    setTimeout(() => { isAnimating = false; }, 520);
  }
  function next() { goto(idx + 1); }
  function prev() { goto(idx - 1); }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 2000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  window.addEventListener('resize', () => update(true));
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });

  // Pause on hover for desktop
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Touch swipe (basic)
  let startX = 0; let currentX = 0; let dragging = false;
  viewport.addEventListener('touchstart', (e) => {
    dragging = true; startX = e.touches[0].clientX; currentX = startX; stopAuto();
  }, { passive: true });
  viewport.addEventListener('touchmove', (e) => { if (!dragging) return; currentX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', () => {
    if (!dragging) return; dragging = false;
    const dx = currentX - startX;
    if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
    startAuto();
  });

  update(true);
  startAuto();
}
document.addEventListener('DOMContentLoaded', initCarousel);


// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const header = document.querySelector('header');
    header.classList.toggle('open');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
}