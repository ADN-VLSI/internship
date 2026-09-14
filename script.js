(function () {
  const countdown = document.querySelector('#countdown');
  if (countdown) {
    const start = new Date(countdown.dataset.start).getTime();
    const deadline = new Date(countdown.dataset.deadline).getTime();
    const examLink = document.querySelector('#exam-link');
    const deadlineTitle = document.querySelector('#deadline-title');
    const units = ['days', 'hours', 'minutes', 'seconds'];

    function updateCountdown() {
      const now = Date.now();
      if (now >= deadline) {
        countdown.innerHTML = '<p class="closed-state">Exam window closed</p>';
        countdown.classList.add('closed');
        if (examLink) examLink.hidden = true;
        if (deadlineTitle) deadlineTitle.textContent = 'Online MCQ exam ended at 11:59 AM';
        return;
      }
      const examOpen = countdown.dataset.examOpen === 'true' || now >= start;
      const remaining = (examOpen ? deadline : start) - now;
      if (examLink) examLink.hidden = !examOpen;
      if (deadlineTitle) {
        deadlineTitle.textContent = examOpen
          ? 'Online MCQ exam is open until 11:59 AM'
          : 'Online MCQ exam starts at 11:00 AM';
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