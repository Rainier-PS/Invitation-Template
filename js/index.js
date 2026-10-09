document.addEventListener('DOMContentLoaded', () => {

  const root = document.documentElement;

  const getStored = (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  };

  const setStored = (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) {}
  };

  const themeToggle = document.getElementById('theme-toggle');
  const settingsOpenBtn = document.getElementById('settings-open');
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsCloseBtn = document.getElementById('settings-close');
  const motionToggle = document.getElementById('motion-toggle');
  const themeLightBtn = document.getElementById('theme-light');
  const themeDarkBtn = document.getElementById('theme-dark');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  let motionOn = getStored('motion') !== 'off';

  const applyTheme = (theme) => {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', normalized);
    setStored('theme', normalized);
    if (themeLightBtn) themeLightBtn.setAttribute('aria-pressed', String(normalized === 'light'));
    if (themeDarkBtn) themeDarkBtn.setAttribute('aria-pressed', String(normalized === 'dark'));
  };

  const applyMotion = (on) => {
    motionOn = !!on;
    root.setAttribute('data-motion', motionOn ? 'on' : 'off');
    setStored('motion', motionOn ? 'on' : 'off');
    if (motionToggle) motionToggle.checked = motionOn;
  };

  applyTheme(root.getAttribute('data-theme'));
  applyMotion(motionOn);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
      themeToggle.style.transition = 'transform 0.3s ease';
      themeToggle.style.transform = 'rotate(360deg)';
      setTimeout(() => { themeToggle.style.transform = ''; }, 300);
    });
  }

  if (themeLightBtn) themeLightBtn.addEventListener('click', () => applyTheme('light'));
  if (themeDarkBtn) themeDarkBtn.addEventListener('click', () => applyTheme('dark'));

  if (motionToggle) {
    motionToggle.addEventListener('change', () => applyMotion(motionToggle.checked));
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'theme' && e.newValue) applyTheme(e.newValue);
    if (e.key === 'motion' && e.newValue) applyMotion(e.newValue !== 'off');
  });

  let settingsReturnFocus = null;

  const getSettingsFocusables = () => {
    if (!settingsOverlay) return [];
    return Array.from(settingsOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter((el) => !el.disabled);
  };

  const openSettings = () => {
    if (!settingsOverlay || !settingsOverlay.hidden) return;
    settingsReturnFocus = document.activeElement;
    settingsOverlay.hidden = false;
    const focusables = getSettingsFocusables();
    if (focusables.length) focusables[0].focus();
  };

  const closeSettings = () => {
    if (!settingsOverlay || settingsOverlay.hidden) return;
    settingsOverlay.hidden = true;
    const target = settingsReturnFocus;
    settingsReturnFocus = null;
    if (target && target !== document.body && document.contains(target) && typeof target.focus === 'function') {
      target.focus();
    } else if (settingsOpenBtn) {
      settingsOpenBtn.focus();
    }
  };

  if (settingsOpenBtn) settingsOpenBtn.addEventListener('click', openSettings);
  if (settingsCloseBtn) settingsCloseBtn.addEventListener('click', closeSettings);
  if (settingsOverlay) {
    settingsOverlay.addEventListener('click', (e) => {
      if (e.target === settingsOverlay) closeSettings();
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === ',' || e.code === 'Comma')) {
      e.preventDefault();
      if (settingsOverlay && settingsOverlay.hidden) openSettings(); else closeSettings();
      return;
    }
    if (e.key !== 'Escape') return;
    if (settingsOverlay && !settingsOverlay.hidden) {
      closeSettings();
      return;
    }
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !settingsOverlay || settingsOverlay.hidden) return;
    const focusables = getSettingsFocusables();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
    hamburger.setAttribute('aria-expanded', 'false');
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href.length < 2) return;
      let target = null;
      try { target = document.querySelector(href); } catch (err) { return; }
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: motionOn ? 'smooth' : 'auto'
      });
    });
  });

  document.querySelectorAll('.email-link[data-email]').forEach((link) => {
    const codes = (link.getAttribute('data-email') || '').split(',');
    let address = '';
    codes.forEach((code) => {
      const n = parseInt(code, 10);
      if (!isNaN(n)) address += String.fromCharCode(n);
    });
    if (address) {
      link.textContent = address;
      link.href = 'mailto:' + address;
    }
  });

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    const minScrollableHeight = 600;
    if (document.body.scrollHeight - window.innerHeight < minScrollableHeight) {
      backToTopBtn.style.display = 'none';
    } else {
      let lastScrollY = window.scrollY;
      let lastTimestamp = performance.now();

      window.addEventListener('scroll', () => {
        const now = performance.now();
        const deltaY = Math.abs(window.scrollY - lastScrollY);
        const deltaTime = now - lastTimestamp;
        const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

        if (window.scrollY > 700) {
          backToTopBtn.classList.add('visible');
          if (motionOn) {
            const opacity = Math.min(1, 0.3 + velocity * 4);
            backToTopBtn.style.opacity = opacity.toFixed(2);
          } else {
            backToTopBtn.style.opacity = 1;
          }
        } else {
          backToTopBtn.classList.remove('visible');
          backToTopBtn.style.opacity = '';
        }

        lastScrollY = window.scrollY;
        lastTimestamp = now;
      });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: motionOn ? 'smooth' : 'auto' });
      });
    }
  }

  const initCarousel = () => {
    const track = document.querySelector('.demo-track');
    const carouselEl = document.querySelector('.demo-carousel');
    const showcaseSection = document.getElementById('showcase');
    if (!track || !carouselEl) return;

    fetch('data/demos.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load demos JSON');
        return res.json();
      })
      .then((eventDemos) => {
        const fragment = document.createDocumentFragment();

        eventDemos.forEach((ev) => {
          const slide = document.createElement('article');
          slide.className = 'demo-slide';

          const link = document.createElement('a');
          link.className = 'demo-slide-link';
          link.href = ev.url;
          link.target = '_blank';
          link.rel = 'noopener';

          const img = document.createElement('img');
          img.src = ev.thumbnail;
          img.alt = ev.title + ' preview';
          img.width = 340;
          img.height = 220;
          img.loading = 'lazy';
          img.decoding = 'async';

          const title = document.createElement('h3');
          title.textContent = ev.title;

          link.appendChild(img);
          link.appendChild(title);

          const btn = document.createElement('a');
          btn.className = 'primary-btn demo-btn';
          btn.href = ev.url;
          btn.target = '_blank';
          btn.rel = 'noopener';
          btn.textContent = 'View Demo';

          slide.appendChild(link);
          slide.appendChild(btn);
          fragment.appendChild(slide);
        });

        track.appendChild(fragment);

        const originals = Array.from(track.children);
        originals.forEach((slide) => {
          const clone = slide.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          clone.querySelectorAll('a').forEach((a) => a.setAttribute('tabindex', '-1'));
          track.appendChild(clone);
        });

        let loopWidth = 0;

        const measure = () => {
          const first = track.children[0];
          const second = track.children[originals.length];
          loopWidth = first && second ? second.offsetLeft - first.offsetLeft : 0;
        };

        measure();
        window.addEventListener('resize', measure);
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(measure);
        }
        if (window.ResizeObserver) {
          new ResizeObserver(measure).observe(track);
        }

        let position = 0;
        let lastTime = null;
        let rafId = null;
        let hovering = false;
        let touching = false;
        let focusing = false;

        carouselEl.addEventListener('mouseenter', () => { hovering = true; });
        carouselEl.addEventListener('mouseleave', () => { hovering = false; });
        carouselEl.addEventListener('touchstart', () => { touching = true; }, { passive: true });
        carouselEl.addEventListener('touchend', () => { touching = false; }, { passive: true });
        carouselEl.addEventListener('touchcancel', () => { touching = false; }, { passive: true });
        carouselEl.addEventListener('focusin', () => { focusing = true; });
        carouselEl.addEventListener('focusout', () => { focusing = false; });

        const step = (time) => {
          if (lastTime === null) lastTime = time;
          const dt = Math.min(time - lastTime, 100);
          lastTime = time;

          if (motionOn && !hovering && !touching && !focusing && !document.hidden && loopWidth > 0) {
            position += (window.innerWidth <= 768 ? 60 : 45) * (dt / 1000);
            while (position >= loopWidth) position -= loopWidth;
            track.style.transform = 'translateX(-' + position + 'px)';
          }
          rafId = requestAnimationFrame(step);
        };

        const startLoop = () => {
          if (rafId === null) {
            lastTime = null;
            rafId = requestAnimationFrame(step);
          }
        };

        const stopLoop = () => {
          if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        };

        if (window.IntersectionObserver) {
          new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) startLoop(); else stopLoop();
            });
          }).observe(carouselEl);
        } else {
          startLoop();
        }
      })
      .catch((err) => {
        console.error('Error loading demos:', err);
        if (showcaseSection) showcaseSection.remove();
      });
  };

  initCarousel();

});
