(() => {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const header = qs('#siteHeader');
  const navToggle = qs('#navToggle');
  const navMenu = qs('#navMenu');
  const navLinks = qsa('.nav-link');
  const scrollProgress = qs('#scrollProgress');
  const cursorLight = qs('#cursorLight');
  const year = qs('#year');

  if (year) year.textContent = new Date().getFullYear();

  function updateScrollUi() {
    header?.classList.toggle('scrolled', window.scrollY > 20);
    if (!scrollProgress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', updateScrollUi, { passive: true });
  updateScrollUi();

  navToggle?.addEventListener('click', () => {
    const open = navMenu?.classList.toggle('open');
    navToggle.classList.toggle('active', Boolean(open));
    navToggle.setAttribute('aria-expanded', String(Boolean(open)));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      navToggle?.classList.remove('active');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  const sectionIds = ['tentang', 'skills', 'proyek', 'pengalaman', 'sertifikat', 'kontak'];
  const sections = sectionIds.map((id) => qs(`#${id}`)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-38% 0px -52% 0px', threshold: 0.01 });
    sections.forEach((section) => navObserver.observe(section));
  }

  const revealItems = qsa('.reveal, .reveal-stagger');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealItems.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -70px 0px' });

    revealItems.forEach((el, index) => {
      if (el.classList.contains('reveal-stagger')) el.style.transitionDelay = `${Math.min(index * 80, 240)}ms`;
      revealObserver.observe(el);
    });
  }

  const words = ['Mobile Developer', 'Fullstack Developer', 'Backend API Builder', 'Software Engineering Student'];
  const typewriter = qs('#typewriter');
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let typeTimer = null;

  function typeLoop() {
    if (!typewriter || prefersReduced) return;
    const word = words[wordIndex];
    typewriter.textContent = deleting ? word.slice(0, charIndex - 1) : word.slice(0, charIndex + 1);
    charIndex = typewriter.textContent.length;

    if (!deleting && charIndex === word.length) {
      deleting = true;
      typeTimer = setTimeout(typeLoop, 1050);
      return;
    }
    if (deleting && charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
    typeTimer = setTimeout(typeLoop, deleting ? 42 : 68);
  }
  typeLoop();

  const counters = qsa('[data-count]');
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count || 0);
        const duration = prefersReduced ? 1 : 950;
        const start = performance.now();
        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.8 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => { counter.textContent = counter.dataset.count || '0'; });
  }

  function setCardPointerVars(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  }

  qsa('.depth-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => setCardPointerVars(card, event));
  });

  if (!prefersReduced && canHover) {
    document.addEventListener('pointermove', (event) => {
      if (cursorLight) {
        cursorLight.style.left = `${event.clientX}px`;
        cursorLight.style.top = `${event.clientY}px`;
      }
      const sceneX = ((event.clientX / window.innerWidth) - 0.5) * 8;
      const sceneY = ((event.clientY / window.innerHeight) - 0.5) * 8;
      document.documentElement.style.setProperty('--scene-x', sceneX.toFixed(2));
      document.documentElement.style.setProperty('--scene-y', sceneY.toFixed(2));
    }, { passive: true });

    qsa('[data-tilt]').forEach((el) => {
      const strong = el.dataset.tiltStrong === 'true';
      const maxTilt = strong ? 9 : 5.5;
      const lift = strong ? 12 : 7;
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * maxTilt * 2;
        const rotateX = (0.5 - py) * maxTilt * 2;
        el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-${lift}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    qsa('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px) translateY(-3px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  const filterButtons = qsa('.filter-btn');
  const projectCards = qsa('[data-project-card]');
  const projectCounter = qs('#projectCounter');
  const projectsGrid = qs('#projectsGrid');
  const filterLabels = {
    all: 'semua project',
    mobile: 'project mobile',
    web: 'project web',
    backend: 'project backend',
    team: 'team project'
  };

  function updateCenteredLast() {
    if (!projectsGrid) return;
    projectCards.forEach((card) => card.classList.remove('is-last-visible'));
    const visibleCards = projectCards.filter((card) => !card.hidden);
    const visibleCount = visibleCards.length;
    projectsGrid.classList.toggle('is-centered-last', visibleCount % 2 === 1 && visibleCount > 1);
    if (visibleCount % 2 === 1 && visibleCount > 1) visibleCards[visibleCards.length - 1].classList.add('is-last-visible');
  }

  function applyFilter(filter) {
    let visible = 0;
    projectCards.forEach((card) => {
      const categories = (card.dataset.projectCategories || '').split(/\s+/).filter(Boolean);
      const shouldShow = filter === 'all' || categories.includes(filter);
      card.hidden = !shouldShow;
      card.setAttribute('aria-hidden', String(!shouldShow));
      if (shouldShow) visible += 1;
    });
    filterButtons.forEach((button) => button.classList.toggle('active', button.dataset.filter === filter));
    if (projectCounter) projectCounter.textContent = `Menampilkan ${visible} ${filterLabels[filter] || 'project'}`;
    updateCenteredLast();
  }

  filterButtons.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all')));
  applyFilter('all');

  const copyEmail = qs('#copyEmail');
  copyEmail?.addEventListener('click', async () => {
    const email = copyEmail.dataset.email || 'mchlhutajulu@gmail.com';
    const label = qs('span', copyEmail);
    try {
      await navigator.clipboard.writeText(email);
      if (label) {
        const oldText = label.textContent;
        label.textContent = 'Email berhasil disalin';
        setTimeout(() => { label.textContent = oldText; }, 1500);
      }
    } catch {
      window.location.href = `mailto:${email}`;
    }
  });

  const modal = qs('#previewModal');
  const modalImage = qs('#previewImage');
  const modalTitle = qs('#previewTitle');
  const modalClose = qs('#previewClose');
  let lastFocused = null;

  function openPreview(src, title) {
    if (!modal || !modalImage) return;
    lastFocused = document.activeElement;
    modalImage.src = src;
    modalImage.alt = title ? `Preview ${title}` : 'Preview gambar';
    if (modalTitle) modalTitle.textContent = title || 'Preview gambar';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  }

  function closePreview() {
    if (!modal || !modalImage) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { modalImage.src = ''; }, 160);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  qsa('[data-preview]').forEach((preview) => {
    preview.setAttribute('tabindex', '0');
    preview.setAttribute('role', 'button');
    preview.setAttribute('aria-label', `Lihat preview ${preview.dataset.previewTitle || 'gambar'}`);
    preview.addEventListener('click', () => openPreview(preview.dataset.preview, preview.dataset.previewTitle));
    preview.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPreview(preview.dataset.preview, preview.dataset.previewTitle);
      }
    });
  });

  modalClose?.addEventListener('click', closePreview);
  modal?.addEventListener('click', (event) => { if (event.target === modal) closePreview(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal?.classList.contains('open')) closePreview(); });

  window.addEventListener('beforeunload', () => { if (typeTimer) clearTimeout(typeTimer); });
})();
