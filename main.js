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
   SERVICES HORIZONTAL SCROLL (index page)
   ====================================================== */
function initServicesScroll() {
  const container = document.querySelector('.services-scroll');
  const prevBtn   = document.querySelector('.services-prev');
  const nextBtn   = document.querySelector('.services-next');
  if (!container) return;

  const scrollAmount = 280;
  if (prevBtn) prevBtn.addEventListener('click', () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => container.scrollBy({ left:  scrollAmount, behavior: 'smooth' }));
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
   INTERSECTION OBSERVER — fade-up animations
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

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

/* ======================================================
   INIT
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initScrollTop();
  initNavbar();
  initCarousel();
  initServicesScroll();
  initFaq();
  initContactForm();
  initAnimations();
});
