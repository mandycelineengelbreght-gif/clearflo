// =============================================
// ClearFlo Plumbing — script.js
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Year ──
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Header scroll ──
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Mobile nav ──
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const spans      = burger ? burger.querySelectorAll('span') : [];

  if (burger) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity   = open ? '0' : '';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
  }

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (document.getElementById('header')?.offsetHeight || 68) + 8;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Scroll reveal ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), i * 90);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Counter animation ──
  function animCount(el, target, suffix, dur = 1600) {
    const decimal = target % 1 !== 0;
    let start = 0;
    const step = target / (dur / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = (decimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
        clearInterval(t);
      } else {
        el.textContent = (decimal ? start.toFixed(1) : Math.floor(start).toLocaleString()) + suffix;
      }
    }, 16);
  }

  let counted = false;
  const countObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat-n[data-target]').forEach(el => {
        animCount(el, parseFloat(el.dataset.target), el.dataset.suffix || '');
      });
      countObs.disconnect();
    }
  }, { threshold: 0.5 });
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) countObs.observe(statsEl);

  // ── Review Slider ──
  const slides        = document.querySelectorAll('.review-slide');
  const dotsContainer = document.getElementById('slDots');
  let current = 0;

  if (slides.length && dotsContainer) {
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'sl-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(d);
    });

    function goTo(n) {
      slides[current].classList.remove('active');
      dotsContainer.children[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dotsContainer.children[current].classList.add('active');
    }

    document.getElementById('slPrev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('slNext')?.addEventListener('click', () => goTo(current + 1));
    setInterval(() => goTo(current + 1), 5000);
  }

  // ── Price Calculator ──
  const PRICES = {
    geyser_repair:  { normal:[800,1800],   emergency:[1500,2500]  },
    geyser_replace: { normal:[3500,6500],  emergency:[5000,8500]  },
    burst_pipe:     { normal:[600,1400],   emergency:[1200,2500]  },
    blocked_drain:  { normal:[350,900],    emergency:[700,1500]   },
    blocked_toilet: { normal:[300,700],    emergency:[600,1200]   },
    leak_detect:    { normal:[800,1600],   emergency:[1500,2800]  },
    tap_repair:     { normal:[200,600],    emergency:[400,1000]   },
    toilet_repair:  { normal:[300,800],    emergency:[600,1400]   },
    installation:   { normal:[1500,5000],  emergency:[3000,8000]  },
    commercial:     { normal:[2000,8000],  emergency:[4000,12000] },
  };

  const COMM_MULT = 1.4;
  let urgency = 'normal', propType = 'residential';

  document.querySelectorAll('.tog').forEach(btn => {
    btn.addEventListener('click', () => {
      const grp = btn.dataset.group;
      document.querySelectorAll(`.tog[data-group="${grp}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (grp === 'urg')  urgency  = btn.dataset.val;
      if (grp === 'prop') propType = btn.dataset.val;
    });
  });

  const calcBtn    = document.getElementById('calcBtn');
  const quoteBtn   = document.getElementById('quoteBtn');
  const resetBtn   = document.getElementById('resetBtn');
  const calcResult = document.getElementById('calcResult');

  function resetCalc() {
    calcResult.classList.remove('show');
    if (calcBtn)  calcBtn.style.display  = 'flex';
    if (quoteBtn) quoteBtn.style.display = 'none';
    document.getElementById('jobType').value = '';
    urgency = 'normal'; propType = 'residential';
    document.querySelectorAll('.tog').forEach(b => b.classList.remove('active'));
    document.querySelector('.tog[data-val="normal"]')?.classList.add('active');
    document.querySelector('.tog[data-val="residential"]')?.classList.add('active');
  }

  calcBtn?.addEventListener('click', () => {
    const job = document.getElementById('jobType').value;
    if (!job) {
      const sel = document.getElementById('jobType');
      sel.style.borderColor = '#e53e3e';
      setTimeout(() => sel.style.borderColor = '', 1500);
      return;
    }
    let [lo, hi] = PRICES[job][urgency] || PRICES[job]['normal'];
    if (propType === 'commercial') {
      lo = Math.round(lo * COMM_MULT);
      hi = Math.round(hi * COMM_MULT);
    }
    const fmt = n => 'R\u202f' + n.toLocaleString('en-ZA');
    document.getElementById('resultVal').textContent = `${fmt(lo)} — ${fmt(hi)}`;
    calcResult.classList.add('show');
    calcBtn.style.display  = 'none';
    if (quoteBtn) quoteBtn.style.display = 'flex';
  });

  resetBtn?.addEventListener('click', resetCalc);

  // ── Quote Form → Make.com Webhook ──
  const WEBHOOK     = 'https://hook.eu1.make.com/8pdpfxku9x74mcltbv0worxfhjb2lm1a';
  const quoteForm   = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const formMsg     = document.getElementById('formMsg');
  const submitBtn   = document.getElementById('waSubmitBtn');

  submitBtn?.addEventListener('click', async () => {
    const name    = document.getElementById('qname').value.trim();
    const phone   = document.getElementById('qphone').value.trim();
    const area    = document.getElementById('qarea').value.trim();
    const service = document.getElementById('qservice').value.trim();
    const message = document.getElementById('qmsg').value.trim();

    // Validation
    if (!name || !phone) {
      if (formMsg) {
        formMsg.textContent = 'Please enter your name and WhatsApp number.';
        formMsg.style.color = '#e53e3e';
      }
      if (quoteForm) {
        quoteForm.style.animation = 'shake 0.4s ease';
        quoteForm.addEventListener('animationend', () => quoteForm.style.animation = '', { once: true });
      }
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    if (formMsg) formMsg.textContent = '';

    try {
      await fetch(WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          area:         area    || 'Not specified',
          service:      service || 'Not specified',
          message:      message || 'Not specified',
          submitted_at: new Date().toISOString(),
          source:       'ClearFlo Website Form'
        })
      });

      // Success
      if (quoteForm)   quoteForm.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');

    } catch (err) {
      // Error — reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Send WhatsApp';
      if (formMsg) {
        formMsg.textContent = 'Something went wrong. Please try again or WhatsApp us directly.';
        formMsg.style.color = '#e53e3e';
      }
    }
  });

  // ── Active nav highlight ──
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a:not(.btn-quote)');
  const navObs   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAs.forEach(a => {
          a.classList.toggle('nav-active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => navObs.observe(s));

  const navStyle = document.createElement('style');
  navStyle.textContent = '.nav-links a.nav-active { color: #fff !important; }';
  document.head.appendChild(navStyle);

});
