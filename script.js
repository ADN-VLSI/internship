(function () {
  const countdown = document.querySelector('#countdown');
  if (countdown) {
    const deadline = new Date(countdown.dataset.deadline).getTime();
    const units = ['days', 'hours', 'minutes', 'seconds'];

    function updateCountdown() {
      const remaining = deadline - Date.now();
      if (remaining <= 0) {
        countdown.innerHTML = '<p class="closed-state">Exam window open</p>';
        countdown.classList.add('closed');
        return;
      }
      const values = [
        Math.floor(remaining / 86400000),
        Math.floor((remaining / 3600000) % 24),
        Math.floor((remaining / 60000) % 60),
        Math.floor((remaining / 1000) % 60)
      ];
      units.forEach((unit, index) => {
        const element = countdown.querySelector(`[data-unit="${unit}"]`);
        element.textContent = String(values[index]).padStart(2, '0');
        element.setAttribute('aria-label', `${values[index]} ${unit}`);
      });
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (event) => {
    if (event.target.matches('a') && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });

  const progress = document.querySelector('.scroll-progress span');
  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.height = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealVisibleElements = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) {
          element.classList.add('visible');
        }
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(element);
    });
    revealVisibleElements();
    window.addEventListener('scroll', revealVisibleElements, { passive: true });
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
  }
}());