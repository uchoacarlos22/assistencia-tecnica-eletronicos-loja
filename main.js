/**
 * TechFix — main.js
 * Scripts consolidados: navbar, carousel, FAQ, scroll, form, animations
 */

/* ======================================================
   SCROLL PROGRESS BAR
   ====================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
  }, { passive: true });
}

/* ======================================================
   SCROLL-TO-TOP BUTTON
   ====================================================== */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ======================================================
   NAVBAR — mobile hamburger + highlight active link
   ====================================================== */
function initNavbar() {
  const toggle  = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });
    // close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
    // close on link click (mobile)
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // Active link detection
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ======================================================
   HERO CAROUSEL (index page)
   ====================================================== */
function initCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const track    = carousel.querySelector('.carousel-track');
  const slides   = carousel.querySelectorAll('.carousel-slide');
  const prevBtn  = carousel.querySelector('.carousel-prev');
  const nextBtn  = carousel.querySelector('.carousel-next');
  const dotsWrap = carousel.querySelector('.carousel-dots');
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let current  = 0;
  let autoPlay = null;
  let touchStartX = 0;

  // Create dots
  if (dotsWrap) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function updateDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

  // Touch / swipe
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetAutoPlay(); }
  });

  function startAutoPlay() {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlay);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ======================================================
   FOCUS RAIL — 3D Perspective Carousel (vanilla port)
   ====================================================== */
function initFocusRail() {
  const stage    = document.getElementById('fr-stage');
  if (!stage) return;

  // ── Data ──────────────────────────────────────────────
  const ITEMS = [
    {
      id: 1,
      title: 'TVs e Monitores',
      meta: 'Eletrônicos',
      description: 'Reparo de TVs LED, OLED, QLED e monitores de alta resolução das melhores marcas.',
      imageSrc: 'images/svc_tv.png',
      href: 'contato.html',
    },
    {
      id: 2,
      title: 'Celulares',
      meta: 'Smartphones',
      description: 'Troca de tela, bateria, conector e placa em smartphones Android e iPhone.',
      imageSrc: 'images/svc_phone.png',
      href: 'contato.html',
    },
    {
      id: 3,
      title: 'Notebooks',
      meta: 'Computadores',
      description: 'Manutenção, upgrade de memória, troca de SSD, formatação e limpeza preventiva.',
      imageSrc: 'images/svc_notebook.png',
      href: 'contato.html',
    },
    {
      id: 4,
      title: 'Micro-ondas',
      meta: 'Eletrodomésticos',
      description: 'Diagnóstico e conserto de micro-ondas de todas as marcas e modelos.',
      imageSrc: 'images/svc_microwave.png',
      href: 'contato.html',
    },
    {
      id: 5,
      title: 'Máquinas de Lavar',
      meta: 'Eletrodomésticos',
      description: 'Reparo elétrico e mecânico em lavarroupas e lava-e-seca de qualquer marca.',
      imageSrc: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop',
      href: 'contato.html',
    },
    {
      id: 6,
      title: 'Videogames & Tablets',
      meta: 'Gaming',
      description: 'Conserto de PS4, PS5, Xbox, Nintendo Switch, tablets Android e iPad.',
      imageSrc: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&auto=format&fit=crop',
      href: 'contato.html',
    },
  ];

  const COUNT   = ITEMS.length;
  let active    = 0;
  let autoTimer = null;
  let isHover   = false;
  let lastWheel = 0;

  // ── DOM refs ───────────────────────────────────────────
  const ambiImg  = document.getElementById('fr-ambience-img');
  const infoEl   = document.getElementById('fr-info');
  const metaEl   = document.getElementById('fr-meta');
  const titleEl  = document.getElementById('fr-item-title');
  const descEl   = document.getElementById('fr-desc');
  const ctaEl    = document.getElementById('fr-cta');
  const counterEl= document.getElementById('fr-counter');
  const prevBtn  = document.getElementById('fr-prev');
  const nextBtn  = document.getElementById('fr-next');

  // ── Helper: wrap index ─────────────────────────────────
  function wrap(v) { return ((v % COUNT) + COUNT) % COUNT; }

  // ── Card pool (reuse DOM elements) ────────────────────
  const OFFSETS  = [-2, -1, 0, 1, 2];
  const cardEls  = {};

  OFFSETS.forEach(offset => {
    const card = document.createElement('div');
    card.className = 'fr-card';
    const img = document.createElement('img');
    img.alt = '';
    img.draggable = false;
    const overlay = document.createElement('div');
    overlay.className = 'fr-card-overlay';
    card.appendChild(img);
    card.appendChild(overlay);
    stage.appendChild(card);
    cardEls[offset] = { card, img };

    // click non-center card = navigate
    card.addEventListener('click', () => {
      if (offset !== 0) navigate(offset);
    });
  });

  // ── Position & style each card ────────────────────────
  function positionCards() {
    OFFSETS.forEach(offset => {
      const { card, img } = cardEls[offset];
      const itemIndex = wrap(active + offset);
      const item      = ITEMS[itemIndex];
      const isCenter  = offset === 0;
      const dist      = Math.abs(offset);

      // 3D transforms — mirrors FocusRail React geometry
      const xPct    = offset * 52;           // % of card width spacing
      const zPx     = -dist * 180;
      const rotateY = offset * -20;
      const scale   = isCenter ? 1 : Math.max(0.6, 0.85 - (dist - 1) * 0.1);
      const opacity = isCenter ? 1 : Math.max(0.1, 1 - dist * 0.45);
      const blur    = isCenter ? 0 : dist * 5;
      const bright  = isCenter ? 1 : Math.max(0.3, 0.55 - (dist - 1) * 0.1);

      card.style.transform =
        `translateX(${xPct}%) translateZ(${zPx}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.filter  = `blur(${blur}px) brightness(${bright})`;
      card.style.zIndex  = isCenter ? 20 : 10 - dist;
      card.classList.toggle('is-center', isCenter);

      img.src = item.imageSrc;
      img.alt = item.title;
    });
  }

  // ── Update info panel with entry animation ─────────────
  function updateInfo(item, index) {
    // Restart animation
    infoEl.classList.remove('animating');
    void infoEl.offsetWidth;              // reflow trick
    infoEl.classList.add('animating');

    metaEl.textContent  = item.meta;
    titleEl.textContent = item.title;
    descEl.textContent  = item.description;
    if (ctaEl) ctaEl.href = item.href;
    if (counterEl) counterEl.textContent = `${index + 1} / ${COUNT}`;
  }

  // ── Update background ambience ─────────────────────────
  function updateAmbience(item) {
    if (!ambiImg) return;
    ambiImg.classList.remove('loaded');
    // small delay so opacity transition fires after bg-image swap
    setTimeout(() => {
      ambiImg.style.backgroundImage = `url('${item.imageSrc}')`;
      ambiImg.classList.add('loaded');
    }, 30);
  }

  // ── Navigate ──────────────────────────────────────────
  function navigate(delta) {
    active = wrap(active + delta);
    positionCards();
    const item = ITEMS[active];
    updateInfo(item, active);
    updateAmbience(item);
  }

  // ── Controls ──────────────────────────────────────────
  if (prevBtn) prevBtn.addEventListener('click', () => { navigate(-1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { navigate(+1); resetAutoplay(); });

  // Keyboard
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { navigate(-1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { navigate(+1); resetAutoplay(); }
  });

  // Mouse wheel (debounced)
  const section = stage.closest('.focus-rail-section');
  if (section) {
    section.addEventListener('wheel', e => {
      const now = Date.now();
      if (now - lastWheel < 400) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 20) {
        navigate(delta > 0 ? 1 : -1);
        resetAutoplay();
        lastWheel = now;
      }
    }, { passive: true });

    section.addEventListener('mouseenter', () => { isHover = true; });
    section.addEventListener('mouseleave', () => { isHover = false; });
  }

  // Touch / swipe
  let touchX0 = 0;
  stage.addEventListener('touchstart', e => { touchX0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', e => {
    const diff = touchX0 - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 45) { navigate(diff > 0 ? 1 : -1); resetAutoplay(); }
  });

  // ── Autoplay ──────────────────────────────────────────
  function startAutoplay() {
    autoTimer = setInterval(() => { if (!isHover) navigate(1); }, 5000);
  }
  function resetAutoplay() {
    clearInterval(autoTimer);
    startAutoplay();
  }

  // ── Init ──────────────────────────────────────────────
  positionCards();
  updateInfo(ITEMS[active], active);
  updateAmbience(ITEMS[active]);
  startAutoplay();
}


/* ======================================================
   FAQ ACCORDION
   ====================================================== */
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-answer').style.maxHeight = '0';
        el.querySelector('.faq-icon').textContent = '+';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        item.querySelector('.faq-icon').textContent = '−';
      }
    });
  });
}

/* ======================================================
   CONTACT FORM — validation + toast
   ====================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const wrapper = field.closest('.form-group');
      if (!field.value.trim()) {
        wrapper?.classList.add('error');
        valid = false;
      } else {
        wrapper?.classList.remove('error');
      }
    });

    if (!valid) return;

    // Simulate send
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
      showToast('✓ Mensagem enviada! Entraremos em contato em breve.');
    }, 1200);
  });

  // Remove error on input
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      field.closest('.form-group')?.classList.remove('error');
    });
  });
}

/* ======================================================
   TOAST
   ====================================================== */
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon"><i class="fas fa-check-circle"></i></span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ======================================================
   INTERSECTION OBSERVER — scroll animations
   ====================================================== */
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  const animTargets = document.querySelectorAll('.fade-up, .fade-down, .fade-left, .fade-right, .zoom-in');
  animTargets.forEach(el => observer.observe(el));
}

/* ======================================================
   INIT
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initScrollTop();
  initNavbar();
  initCarousel();
  initFocusRail();
  initFaq();
  initContactForm();
  initAnimations();
});
