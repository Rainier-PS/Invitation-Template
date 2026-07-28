document.addEventListener('DOMContentLoaded', function() {

  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!navLinks.contains(e.target) && e.target !== hamburger) {
        navLinks.classList.remove('open');
      }
    });
  }

  var themeToggle = document.getElementById('theme-toggle');
  var html = document.documentElement;

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      var current = html.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      var icon = themeToggle.querySelector('svg:not([style*="display: none"])');
      if (icon) {
        icon.style.transition = 'transform 0.3s ease';
        icon.style.transform = 'rotate(360deg)';
        setTimeout(function() { icon.style.transform = ''; }, 300);
      }
    });
  }

  var sidebarBtns = document.querySelectorAll('.sidebar-btn');
  var panel = document.querySelector('.panel');
  var preview = document.getElementById('json-preview');
  var form = document.getElementById('event-form');
  var helpBtn = document.getElementById('help-btn');
  var infoModal = document.getElementById('info-modal');

  function sanitize(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>]/g, function(tag) {
      return tag === '<' ? '&lt;' : '&gt;';
    });
  }

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function closeNav() {
    if (navLinks) navLinks.classList.remove('open');
  }

  sidebarBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      sidebarBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var targetId = btn.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (target) {
        if (isMobile()) {
          closeNav();
          var nav = document.querySelector('nav');
          var headerOffset = nav ? nav.offsetHeight : 56;
          var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;
          window.scrollTo({ top: top, behavior: 'smooth' });
        } else if (panel) {
          var offset = target.offsetTop - 16;
          panel.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    });
  });

  function updateActiveBtn() {
    if (!panel) return;
    var activeId = null;
    var panelRect = panel.getBoundingClientRect();

    if (isMobile()) {
      sidebarBtns.forEach(function(btn) {
        var targetId = btn.getAttribute('data-target');
        var target = document.getElementById(targetId);
        if (target) {
          var rect = target.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.5 && rect.bottom > 60) {
            activeId = targetId;
          }
        }
      });
    } else {
      var scrollBottom = panel.scrollTop + panel.clientHeight;
      var scrollHeight = panel.scrollHeight;
      var isAtBottom = scrollBottom >= scrollHeight - 10;

      if (isAtBottom) {
        var lastBtn = sidebarBtns[sidebarBtns.length - 1];
        if (lastBtn) {
          activeId = lastBtn.getAttribute('data-target');
        }
      } else {
        sidebarBtns.forEach(function(btn) {
          var targetId = btn.getAttribute('data-target');
          var target = document.getElementById(targetId);
          if (target) {
            var rect = target.getBoundingClientRect();
            var offset = rect.top - panelRect.top;
            if (offset < 200 && offset > -80) {
              activeId = targetId;
            }
          }
        });

        if (!activeId) {
          var lastBtn = sidebarBtns[sidebarBtns.length - 1];
          if (lastBtn) {
            var target = document.getElementById(lastBtn.getAttribute('data-target'));
            if (target) {
              var rect = target.getBoundingClientRect();
              var offset = rect.top - panelRect.top;
              if (offset < panel.clientHeight + 100 && offset > -panel.clientHeight) {
                activeId = lastBtn.getAttribute('data-target');
              }
            }
          }
        }
      }
    }

    sidebarBtns.forEach(function(btn) {
      var match = btn.getAttribute('data-target') === activeId;
      btn.classList.toggle('active', match);
    });
  }

  if (panel) {
    panel.addEventListener('scroll', updateActiveBtn);
  }
  window.addEventListener('scroll', updateActiveBtn);
  window.addEventListener('resize', updateActiveBtn);

  function updateJson() {
    function getVal(id) {
      var el = document.getElementById(id);
      return sanitize(el ? el.value : '');
    }
    function getCheck(id) {
      var el = document.getElementById(id);
      return el ? el.checked : false;
    }
    function formatDateISO(dateStr) {
      if (!dateStr) return '';
      var d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      function pad(n) { return String(n).padStart(2, '0'); }
      return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
    }

    var schedule = [];
    document.querySelectorAll('#schedule-list-builder .dynamic-item').forEach(function(item) {
      var time = item.querySelector('.sched-time');
      var label = item.querySelector('.sched-label');
      if (time && label) {
        schedule.push({ time: sanitize(time.value), label: sanitize(label.value) });
      }
    });

    var heroImages = [];
    document.querySelectorAll('.hero-img-url').forEach(function(input) {
      heroImages.push(input.value);
    });

    var sectionBackgrounds = [];
    document.querySelectorAll('.section-bg-url').forEach(function(input) {
      sectionBackgrounds.push(input.value);
    });

    var quotes = [];
    document.querySelectorAll('#quotes-builder .quote-item').forEach(function(item) {
      var textEl = item.querySelector('.quote-text-input');
      var authorEl = item.querySelector('.quote-author-input');
      if (textEl && textEl.value.trim()) {
        quotes.push({
          text: sanitize(textEl.value.trim()),
          author: sanitize(authorEl ? authorEl.value.trim() : '')
        });
      }
    });

    var sections = {};
    sections.hero = true;
    sections.eventDetails = getCheck('input-section-eventDetails');
    sections['schedule-section'] = getCheck('input-section-schedule');
    sections['quotes-section'] = getCheck('input-section-quotes');
    sections['location-section'] = getCheck('input-section-location');
    sections['design-section'] = getCheck('input-section-design');
    sections['music-section'] = getCheck('input-section-music');
    sections.rsvp = getCheck('input-section-rsvp');
    sections.footer = getCheck('input-section-footer');

    var colorText = document.getElementById('input-accentColor-text');
    var colorEl = document.getElementById('input-accentColor');

    var json = {
      "meta": {
        "version": "1.1",
        "private": false,
        "simpleMode": getCheck('input-simpleMode'),
        "showSimpleModeToggle": getCheck('input-showSimpleModeToggle'),
        "countdown": true
      },
      "sections": sections,
      "quotes": quotes,
      "social": {
        "instagram": getVal('input-instagram')
      },
      "event": {
        "title": getVal('input-title'),
        "subtitle": getVal('input-subtitle'),
        "description": getVal('input-description')
      },
      "datetime": {
        "date": formatDateISO(getVal('input-date')),
        "startTime": getVal('input-startTime'),
        "endTime": getVal('input-endTime'),
        "timezone": "local",
        "allDay": false
      },
      "location": {
        "name": getVal('input-venue-name'),
        "address": getVal('input-venue-address'),
        "mapsLink": getVal('input-mapsLink')
      },
      "schedule": schedule,
      "rsvp": {
        "enabled": getCheck('input-rsvp-enabled'),
        "url": getVal('input-rsvp-url')
      },
      "calendar": { "enabled": true, "providers": { "google": true } },
      "design": {
        "theme": html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
        "accentColor": colorText ? colorText.value : (colorEl ? colorEl.value : '#6366f1'),
        "heroImages": heroImages,
        "sectionBackgrounds": sectionBackgrounds
      },
      "music": {
        "enabled": getCheck('input-music-enabled'),
        "loop": getCheck('input-music-loop'),
        "volume": parseFloat(getVal('input-music-volume')) || 0.3,
        "audioUrl": getVal('input-music-audioUrl') || ""
      },
      "footer": {
        "text": getVal('input-footerText'),
        "branding": {
          "link": "#",
          "logoUrl": getVal('input-logoUrl'),
          "logoAlt": "Logo"
        },
        "credits": {
          "designByLabel": "Created & Designed by",
          "copyrightYear": String(new Date().getFullYear()),
          "authorName": getVal('input-authorName'),
          "templateLabel": "Template by",
          "templateAuthor": "Rainier Pearson Saputra",
          "templateLink": "https://rainier-ps.github.io/",
          "repoLabel": "Open Repository",
          "repoLink": "https://github.com/Rainier-PS/Invitation-Template"
        }
      }
    };

    preview.textContent = JSON.stringify(json, null, 4);
  }

  form.addEventListener('input', updateJson);

  var colorPicker = document.getElementById('input-accentColor');
  var colorText = document.getElementById('input-accentColor-text');
  if (colorPicker && colorText) {
    colorPicker.addEventListener('input', function(e) {
      colorText.value = e.target.value;
      updateJson();
    });
    colorText.addEventListener('input', function(e) {
      colorPicker.value = e.target.value;
      updateJson();
    });
  }

  function observeListWithActive(id) {
    var el = document.getElementById(id);
    if (el) {
      var obs = new MutationObserver(function() {
        updateJson();
        updateActiveBtn();
      });
      obs.observe(el, { childList: true, subtree: true });
    }
  }
  observeListWithActive('schedule-list-builder');
  observeListWithActive('hero-images-builder');
  observeListWithActive('section-backgrounds-builder');
  observeListWithActive('quotes-builder');

  updateJson();

  var TOUR_KEY = 'invitation-tour-complete';

  var tourSteps = [
    {
      target: '#hamburger',
      title: 'Navigate Sections',
      desc: 'Tap the menu to jump between different sections of your invitation.'
    },
    {
      target: '[data-tour="event-name"]',
      title: 'Fill in Details',
      desc: 'Start by entering your event name, tagline, and description.'
    },
    {
      target: '[data-tour="json-output"]',
      title: 'Output',
      desc: 'Watch your event configuration update in real-time as you fill out the form.'
    },
    {
      target: '[data-tour="json-actions"]',
      mobileFallback: '.mobile-actions',
      title: 'Copy & Download Bundle',
      desc: 'Copy the JSON or download the entire invitation as a ready-to-deploy bundle.'
    }
  ];

  var tourStep = 0;
  var tourWatchInterval = null;

  function positionTourHighlight(targetEl, pad) {
    var highlight = document.getElementById('tour-highlight');
    if (!targetEl || !highlight) return;
    var rect = targetEl.getBoundingClientRect();
    var p = pad || 4;
    highlight.classList.add('visible');
    highlight.style.left = (rect.left - p) + 'px';
    highlight.style.top = (rect.top - p) + 'px';
    highlight.style.width = (rect.width + p * 2) + 'px';
    highlight.style.height = (rect.height + p * 2) + 'px';
  }

  function positionTourCard(targetEl, cardWidth) {
    var card = document.getElementById('tour-card');
    if (!targetEl || !card) return;
    var rect = targetEl.getBoundingClientRect();
    var cw = cardWidth || 340;
    var mobile = window.innerWidth <= 768;
    var cardLeft, cardTop;

    if (mobile) {
      cardLeft = Math.max(16, (window.innerWidth - cw) / 2);
      cardTop = rect.bottom + 12;
      if (cardTop + 260 > window.innerHeight - 16) {
        cardTop = Math.max(16, rect.top - 260);
      }
    } else {
      cardLeft = rect.right + 16;
      cardTop = Math.max(16, rect.top - 10);
      if (cardLeft + cw > window.innerWidth - 16) {
        cardLeft = Math.max(16, rect.left - cw - 16);
      }
      if (cardTop + 240 > window.innerHeight - 16) {
        cardTop = Math.max(16, window.innerHeight - 260);
      }
    }

    card.style.left = cardLeft + 'px';
    card.style.top = cardTop + 'px';
  }

  function updateTourPosition() {
    if (tourStep >= tourSteps.length) return;
    var step = tourSteps[tourStep];
    var targetEl = getTourTargetEl(step);
    if (!targetEl) return;
    positionTourHighlight(targetEl, 4);
    positionTourCard(targetEl, 340);
  }

  function startTourWatching() {
    stopTourWatching();
    tourWatchInterval = setInterval(updateTourPosition, 200);
    window.addEventListener('scroll', updateTourPosition, true);
    window.addEventListener('resize', updateTourPosition);
    var p = document.querySelector('.panel');
    if (p) p.addEventListener('scroll', updateTourPosition);
  }

  function stopTourWatching() {
    if (tourWatchInterval) {
      clearInterval(tourWatchInterval);
      tourWatchInterval = null;
    }
    window.removeEventListener('scroll', updateTourPosition, true);
    window.removeEventListener('resize', updateTourPosition);
    var p = document.querySelector('.panel');
    if (p) p.removeEventListener('scroll', updateTourPosition);
  }

  function lockTourScroll(lock) {
    document.body.classList.toggle('tour-active', lock);
  }

  function startTour() {
    tourStep = 0;
    lockTourScroll(true);
    showTourStep();
  }

  function getTourTargetEl(step) {
    var targetEl = document.querySelector(step.target);
    if (!targetEl) return null;
    var rect = targetEl.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0 || targetEl.offsetParent === null) {
      if (step.mobileFallback && isMobile()) {
        return document.querySelector(step.mobileFallback);
      }
    }
    return targetEl;
  }

  function showTourStep() {
    var overlay = document.getElementById('tour-overlay');
    var highlight = document.getElementById('tour-highlight');
    var card = document.getElementById('tour-card');

    if (tourStep >= tourSteps.length) {
      endTour();
      return;
    }

    var step = tourSteps[tourStep];
    var targetEl = getTourTargetEl(step);
    if (!targetEl) {
      tourStep++;
      showTourStep();
      return;
    }

    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(function() {
      positionTourHighlight(targetEl, 4);
      highlight.style.boxShadow = '0 0 0 9999px var(--tour-overlay-bg)';
      highlight.style.display = 'block';
      overlay.style.display = 'block';
      overlay.classList.remove('visible');
      highlight.classList.remove('visible');
      card.style.display = 'block';
      card.classList.remove('visible');
      positionTourCard(targetEl, 340);

      void overlay.offsetHeight;

      var dotsHtml = '';
      tourSteps.forEach(function(_, i) {
        dotsHtml += '<span class="tour-dot ' + (i === tourStep ? 'active' : '') + '"></span>';
      });

      var cardContent = card.querySelector('.tour-card-content') || card;
      cardContent.classList.remove('fade-out');
      cardContent.innerHTML = '<h3 class="tour-card-title">' + step.title + '</h3>' +
        '<p class="tour-card-desc">' + step.desc + '</p>' +
        '<div class="tour-card-nav">' +
        '<div class="tour-dots">' + dotsHtml + '</div>' +
        '<div class="tour-card-actions">' +
        '<button class="tour-skip" id="tour-skip">Skip</button>' +
        '<button class="tour-next" id="tour-next">' + (tourStep === tourSteps.length - 1 ? 'Finish' : 'Next') + '</button>' +
        '</div></div>';

      requestAnimationFrame(function() {
        card.classList.add('visible');
        overlay.classList.add('visible');
        highlight.classList.add('visible');
      });

      document.getElementById('tour-skip').addEventListener('click', endTour);
      document.getElementById('tour-next').addEventListener('click', function() {
        var content = card.querySelector('.tour-card-content') || card;
        content.classList.add('fade-out');
        setTimeout(function() {
          tourStep++;
          showTourStep();
        }, 250);
      });
      startTourWatching();
    }, 400);
  }

  function endTour() {
    stopTourWatching();
    var overlay = document.getElementById('tour-overlay');
    var highlight = document.getElementById('tour-highlight');
    var card = document.getElementById('tour-card');
    overlay.classList.remove('visible');
    highlight.classList.remove('visible');
    card.classList.remove('visible');
    setTimeout(function() {
      if (overlay && !overlay.classList.contains('visible')) {
        overlay.style.display = 'none';
        highlight.style.display = 'none';
        card.style.display = 'none';
      }
      lockTourScroll(false);
    }, 400);
    try { localStorage.setItem(TOUR_KEY, 'true'); } catch (e) {}
  }

  try {
    if (!localStorage.getItem(TOUR_KEY)) {
      setTimeout(startTour, 600);
    }
  } catch (e) {}

  if (helpBtn) {
    helpBtn.addEventListener('click', showInfoModal);
  }

  var mobileHelpBtn = document.getElementById('mobile-help-btn');
  if (mobileHelpBtn) {
    mobileHelpBtn.addEventListener('click', function() {
      closeNav();
      showInfoModal();
    });
  }

  function showInfoModal() {
    if (!infoModal) return;
    infoModal.style.display = 'flex';
    infoModal.innerHTML = '<div class="info-modal-card">' +
      '<h2>How to create your invitation</h2>' +
      '<p>Follow these steps to generate your custom invitation configuration.</p>' +
      '<div class="info-steps">' +
      '<div class="info-step"><div class="info-step-icon">1</div><div class="info-step-text">' +
      '<h4>Fill out each section</h4><p>Enter your event details.</p></div></div>' +
      '<div class="info-step"><div class="info-step-icon">2</div><div class="info-step-text">' +
      '<h4>Watch it update live</h4><p>The output updates as you type.</p></div></div>' +
      '<div class="info-step"><div class="info-step-icon">3</div><div class="info-step-text">' +
      '<h4>Copy or download bundle</h4><p>Download the entire invitation as a ready-to-deploy bundle.</p></div></div>' +
      '<div class="info-step"><div class="info-step-icon">4</div><div class="info-step-text">' +
      '<h4>Deploy anywhere</h4><p>Host on GitHub Pages, Vercel, Netlify, or any static host.</p></div></div>' +
      '</div><button class="info-close" id="info-close">Got it</button></div>';
    document.getElementById('info-close').addEventListener('click', function() {
      infoModal.style.display = 'none';
    });
    infoModal.addEventListener('click', function(e) {
      if (e.target === infoModal) infoModal.style.display = 'none';
    });
  }

  var masterToggle = document.getElementById('master-toggle-btn');
  var masterGrid = document.getElementById('master-check-grid');
  var masterChevron = document.getElementById('master-chevron');
  if (masterToggle && masterGrid) {
    masterToggle.setAttribute('aria-expanded', 'false');
    function toggleMasterGrid() {
      var isOpen = masterGrid.classList.toggle('open');
      if (masterChevron) masterChevron.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
      masterToggle.setAttribute('aria-expanded', isOpen);
    }
    masterToggle.addEventListener('click', toggleMasterGrid);
    masterToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMasterGrid();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (infoModal && infoModal.style.display === 'flex') {
        infoModal.style.display = 'none';
      }
      var settingsModal = document.getElementById('settings-modal');
      if (settingsModal && settingsModal.style.display === 'flex') {
        settingsModal.style.display = 'none';
      }
      endTour();
    }
  });

  function createSectionToggle(masterId, panelId) {
    var check = document.getElementById(masterId);
    if (!check) return;
    function toggle() {
      var enabled = check.checked;
      var container = document.getElementById(panelId);
      if (container) {
        container.querySelectorAll('input, textarea, select, button').forEach(function(el) {
          if (el.id === masterId) return;
          el.disabled = !enabled;
        });
      }
      updateJson();
    }
    check.addEventListener('change', toggle);
  }

  createSectionToggle('input-datetime-enabled', 'panel-datetime');
  createSectionToggle('input-location-enabled', 'panel-location');
  createSectionToggle('input-design-enabled', 'panel-design');
  createSectionToggle('input-footer-enabled', 'panel-footer');

  createSectionToggle('input-rsvp-enabled', 'panel-rsvp');

  var musicEnabledCheck = document.getElementById('input-music-enabled');
  function toggleMusicInputs() {
    var enabled = musicEnabledCheck && musicEnabledCheck.checked;
    var musicFields = document.getElementById('panel-music');
    if (musicFields) {
      musicFields.querySelectorAll('input[type="checkbox"], input[type="number"], input[type="url"]').forEach(function(el) {
        if (el.id !== 'input-music-enabled') {
          el.disabled = !enabled;
        }
      });
    }
    if (musicEnabledCheck) updateJson();
  }
  if (musicEnabledCheck) {
    musicEnabledCheck.addEventListener('change', toggleMusicInputs);
  }

  var settingsBtn = document.getElementById('settings-btn');
  var settingsModal = document.getElementById('settings-modal');

  function openSettingsModal() {
    if (settingsModal) settingsModal.style.display = 'flex';
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', openSettingsModal);
  }

  var mobileSettingsBtn = document.getElementById('mobile-settings-btn');
  if (mobileSettingsBtn) {
    mobileSettingsBtn.addEventListener('click', function() {
      closeNav();
      openSettingsModal();
    });
  }

  if (settingsModal) {
    document.getElementById('settings-close').addEventListener('click', function() {
      settingsModal.style.display = 'none';
    });

    settingsModal.addEventListener('click', function(e) {
      if (e.target === settingsModal) settingsModal.style.display = 'none';
    });

    var jsonEditableCheck = document.getElementById('input-json-editable');
    var jsonPreview = document.getElementById('json-preview');
    var jsonTextarea = document.getElementById('json-textarea');

    if (jsonEditableCheck && jsonPreview && jsonTextarea) {
      jsonEditableCheck.addEventListener('change', function() {
        if (this.checked) {
          jsonTextarea.value = jsonPreview.textContent;
          jsonPreview.style.display = 'none';
          jsonTextarea.style.display = 'block';
        } else {
          jsonPreview.textContent = jsonTextarea.value;
          jsonPreview.style.display = '';
          jsonTextarea.style.display = 'none';
        }
      });
    }

    var restartTourBtn = document.getElementById('restart-tour-btn');
    if (restartTourBtn) {
      restartTourBtn.addEventListener('click', function() {
        try {
          localStorage.removeItem(TOUR_KEY);
        } catch (e) {}
        settingsModal.style.display = 'none';
        setTimeout(function() {
          tourStep = 0;
          var overlay = document.getElementById('tour-overlay');
          var highlight = document.getElementById('tour-highlight');
          var card = document.getElementById('tour-card');
          if (overlay) overlay.style.display = 'none';
          if (highlight) { highlight.style.display = 'none'; highlight.style.boxShadow = ''; }
          if (card) card.style.display = 'none';
          lockTourScroll(false);
          stopTourWatching();
          startTour();
        }, 300);
      });
    }
  }
});

window.addScheduleItem = function(time, label) {
  time = time || '06:00 PM';
  label = label || 'Welcome';
  var container = document.getElementById('schedule-list-builder');
  var div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML =
    '<div><label>Activity</label><input type="text" class="sched-label" value="' + label + '"></div>' +
    '<button type="button" class="remove-btn" title="Remove" onclick="this.parentElement.remove()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></button>';
  container.appendChild(div);
};

window.addHeroImage = function(url) {
  url = url || '';
  var container = document.getElementById('hero-images-builder');
  var div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML =
    '<div><input type="url" class="hero-img-url" value="' + url + '" placeholder="https://example.com/photo.jpg"></div>' +
    '<button type="button" class="remove-btn" title="Remove" onclick="this.parentElement.remove()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></button>';
  container.appendChild(div);
};

window.addSectionBackground = function(url) {
  url = url || '';
  var container = document.getElementById('section-backgrounds-builder');
  var div = document.createElement('div');
  div.className = 'dynamic-item';
  div.innerHTML =
    '<div><input type="url" class="section-bg-url" value="' + url + '" placeholder="https://example.com/bg.jpg"></div>' +
    '<button type="button" class="remove-btn" title="Remove" onclick="this.parentElement.remove()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></button>';
  container.appendChild(div);
};

window.addQuoteItem = function(text, author) {
  text = text || '';
  author = author || '';
  var container = document.getElementById('quotes-builder');
  if (!container) return;
  var div = document.createElement('div');
  div.className = 'dynamic-item quote-item';
  div.innerHTML =
    '<div><label>Quote</label><input type="text" class="quote-text-input" value="' + text + '" placeholder="The quote or verse..."></div>' +
    '<div><label>Author</label><input type="text" class="quote-author-input" value="' + author + '" placeholder="Author name (optional)"></div>' +
    '<button type="button" class="remove-btn" title="Remove" onclick="this.parentElement.remove()">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg></button>';
  container.appendChild(div);
};

window.copyJson = function() {

  var ta = document.getElementById('json-textarea');
  var pre = document.getElementById('json-preview');
  if (ta && pre && ta.style.display !== 'none') {
    pre.textContent = ta.value;
  }
  var text = pre.textContent;
  navigator.clipboard.writeText(text).then(function() {
    var btns = document.querySelectorAll('.json-actions .primary-btn, .mobile-actions .primary-btn');
    btns.forEach(function(btn) {
      var orig = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.background = '#10b981';
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.background = '';
      }, 2000);
    });
  });
};

window.downloadBundle = function() {

  var ta = document.getElementById('json-textarea');
  var pre = document.getElementById('json-preview');
  if (ta && pre && ta.style.display !== 'none') {
    pre.textContent = ta.value;
  }
  var jsonText = pre.textContent;
  var eventData;
  try {
    eventData = JSON.parse(jsonText);
  } catch (e) {
    alert('Could not parse JSON. Please check your inputs.');
    return;
  }

  var eventTitle = (eventData.event && eventData.event.title || 'my-invitation')
    .replace(/[^a-zA-Z0-9-\s]/g, '');
  var folderName = eventTitle.toLowerCase().replace(/\s+/g, '-');

  var eventTitleClean = '';
  var eventDescClean = '';
  if (eventData.event) {
    eventTitleClean = eventData.event.title || '';
    eventDescClean = eventData.event.description || '';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;');
  }

  var inviteHtml = '<!DOCTYPE html>\n' +
    '<html lang="en">\n<head>\n' +
    '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
    '<title>' + escapeHtml(eventTitleClean || "You're Invited") + '</title>\n' +
    '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
    '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">\n' +
    '<link rel="stylesheet" href="css/invite.css">\n' +
    '<script async src="https://tally.so/widgets/embed.js"><' + '/script>\n' +
    '</head>\n<body>\n' +
    '<button id="simple-mode-toggle" class="accessibility-fab" hidden>\n' +
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">\n' +
    '<path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>\n' +
    '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>\n' +
    '</svg>\n</button>\n' +
    '<button id="audio-control" class="audio-fab" hidden>\n' +
    '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">\n' +
    '<path d="M8 5v14l11-7z"/>\n<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>\n' +
    '</svg>\n</button>\n' +
    '<main id="app" aria-live="polite">\n' +
    '<section class="hero"><h1 id="event-title">Loading\u2026</h1>\n' +
    '<p class="subtitle" id="event-subtitle"></p>\n' +
    '<div class="hero-meta">\n' +
    '<div id="countdown" class="countdown" hidden>\n' +
    '<span class="countdown-label">Event starts in</span>\n' +
    '<div class="countdown-grid">\n' +
    '<div class="countdown-unit"><strong id="cd-days">0</strong><span>Days</span></div>\n' +
    '<div class="countdown-unit"><strong id="cd-hours">00</strong><span>Hours</span></div>\n' +
    '<div class="countdown-unit"><strong id="cd-minutes">00</strong><span>Minutes</span></div>\n' +
    '<div class="countdown-unit"><strong id="cd-seconds">00</strong><span>Seconds</span></div>\n' +
    '</div></div>\n' +
    '<div id="calendar-actions" hidden>\n' +
    '<a id="google-calendar-link" target="_blank" rel="noopener">Add to Google Calendar</a>\n' +
    '</div></div>\n' +
    '<a href="#rsvp" class="primary-btn">RSVP</a>\n' +
    '</section>\n' +
    '<section class="section event-details">\n' +
    '<h2>Event Details</h2>\n' +
    '<div class="event-datetime">\n' +
    '<div><strong>Date:</strong> <time id="event-date"></time></div>\n' +
    '<div><strong>Time:</strong> <span id="event-time"></span></div>\n' +
    '</div>\n<p id="event-description"></p>\n' +
    '<address class="location">\n<p id="venue-name"></p>\n<p id="venue-address"></p>\n' +
    '<a id="maps-link" target="_blank" rel="noopener">Open in Google Maps</a>\n' +
    '</address>\n</section>\n' +
    '<section class="section" id="schedule-section" hidden>\n<h2>Schedule</h2><ul id="schedule-list"></ul>\n</section>\n' +
    '<section class="section" id="quotes-section" hidden>\n<h2>Words of Inspiration</h2>\n<div class="quotes-container" id="quotes-container"></div>\n</section>\n' +
    '<section class="section" id="rsvp">\n<h2>RSVP</h2>\n<p>Please confirm your attendance</p>\n' +
    '<div class="form-embed"></div>\n</section>\n' +
    '<footer>\n<div class="footer-branding">\n' +
    '<a id="footer-branding-link" href="#"><img id="footer-logo" src="" alt="" class="footer-logo"></a>\n' +
    '<div class="footer-info">\n<p class="hosted-by" id="footer-credits-label"></p>\n' +
    '<p class="copyright">\n<span id="footer-copyright"></span>\n' +
    '<span id="footer-template-container"> | <span id="footer-template-label"></span> ' +
    '<a id="footer-template-link" href="#"></a></span>\n</p>\n' +
    '<p id="footer-repo-container" class="repo-info" hidden>\n<a id="footer-repo-link" href="#"></a>\n</p>\n' +
    '<div class="social-links" id="social-links" hidden>\n' +
    '<a id="instagram-link" class="social-link" target="_blank" rel="noopener">\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n' +
    '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>\n' +
    '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>\n' +
    '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>\n' +
    '</svg>\n<span id="instagram-label">Follow on Instagram</span>\n</a>\n' +
    '</div>\n' +
    '</div></div>\n<p id="footer-text"></p>\n</footer>\n' +
    '</main>\n' +
    '<script src="js/invite.js"><' + '/script>\n' +
    '<' + '/body>\n<' + '/html>';

  var inviteJs = '(function() {\n' +
    '  "use strict";\n' +
    '  var CONFIG = ' + jsonText + ';\n' +
    '  var ev = CONFIG.event || {};\n' +
    '  var dt = CONFIG.datetime || {};\n' +
    '  var loc = CONFIG.location || {};\n' +
    '  var sched = CONFIG.schedule || [];\n' +
    '  var rsvp = CONFIG.rsvp || {};\n' +
    '  var design = CONFIG.design || {};\n' +
    '  var music = CONFIG.music || {};\n' +
    '  var footer = CONFIG.footer || {};\n' +
    '  var meta = CONFIG.meta || {};\n' +
    '  var sections = CONFIG.sections || {};\n' +
    '  var quotes = CONFIG.quotes || [];\n' +
    '  var social = CONFIG.social || {};\n' +
    '  function st(id, val) { var el = document.getElementById(id); if (el) el.textContent = val || ""; }\n' +
    '  function sh(id) { var el = document.getElementById(id); if (el) el.hidden = false; }\n' +
    '  function hi(id) { var el = document.getElementById(id); if (el) el.hidden = true; }\n' +
    '  function rm(id) { var el = document.getElementById(id); if (el) el.remove(); }\n' +
    '  function showSec(id, def) { if (sections[id] === false || (sections[id] === undefined && def === false)) rm(id); }\n' +
    '  st("event-title", ev.title);\n' +
    '  st("event-subtitle", ev.subtitle);\n' +
    '  st("event-description", ev.description);\n' +
    '  st("event-date", dt.date);\n' +
    '  st("event-time", [dt.startTime, dt.endTime].filter(Boolean).join(" - "));\n' +
    '  st("venue-name", loc.name);\n' +
    '  st("venue-address", loc.address);\n' +
    '  if (loc.mapsLink) { var ml = document.getElementById("maps-link"); if (ml) ml.href = loc.mapsLink; }\n' +
    '  showSec("schedule-section", sched.length > 0);\n' +
    '  showSec("quotes-section", false);\n' +
    '  if (sections.eventDetails === false) { var ed = document.querySelector(".event-details"); if (ed) ed.remove(); }\n' +
    '  if (sections["location-section"] === false) { var la = document.querySelector(".location"); if (la) la.remove(); }\n' +
    '  if (sections["design-section"] === false) { var si = document.getElementById("simple-mode-toggle"); if (si) si.remove(); }\n' +
    '  if (sections["music-section"] === false) { var ac = document.getElementById("audio-control"); if (ac) ac.remove(); }\n' +
    '  if (sections.footer === false) { var ft = document.querySelector("footer"); if (ft) ft.remove(); }\n' +
    '  if (sections.rsvp === false) { rm("rsvp"); }\n' +
    '  if (sched.length) { sh("schedule-section"); var sl = document.getElementById("schedule-list"); if (sl) { sched.forEach(function(it) { var li = document.createElement("li"); li.innerHTML = "<span>" + (it.time || "") + "</span><span>" + (it.label || "") + "</span>"; sl.appendChild(li); }); } }\n' +
    '  var qc = document.getElementById("quotes-container");\n' +
    '  if (quotes.length && qc) { sh("quotes-section"); quotes.forEach(function(q) { if (!q.text) return; var d = document.createElement("div"); d.className = "quote-item"; var pt = document.createElement("p"); pt.className = "quote-text"; pt.textContent = q.text; d.appendChild(pt); if (q.author) { var pa = document.createElement("p"); pa.className = "quote-author"; pa.textContent = q.author; d.appendChild(pa); } qc.appendChild(d); }); }\n' +
    '  if (rsvp.enabled && rsvp.url) { var emb = document.querySelector(".form-embed"); if (emb) { var ifr = document.createElement("iframe"); ifr.src = rsvp.url; ifr.style.width = "100%"; ifr.style.border = "none"; ifr.style.minHeight = "400px"; emb.appendChild(ifr); } } else { if (sections.rsvp !== false) rm("rsvp"); }\n' +
    '  if (meta.countdown && dt.date) { sh("countdown"); var ed = new Date(dt.date + "T" + (dt.startTime || "00:00:00")); if (!isNaN(ed.getTime())) { setInterval(function() { var now = new Date(); var diff = ed - now; if (diff <= 0) { hi("countdown"); return; } st("cd-days", Math.floor(diff / 86400000)); st("cd-hours", String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0")); st("cd-minutes", String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0")); st("cd-seconds", String(Math.floor((diff % 60000) / 1000)).padStart(2, "0")); }, 1000); } }\n' +
    '  if (dt.date) { sh("calendar-actions"); var cl = document.getElementById("google-calendar-link"); if (cl) { var sd = dt.date.replace(/-/g, ""); var ed2 = sd; var stt = (dt.startTime || "00:00").replace(/ /g, "").replace(":", ""); var ett = (dt.endTime || dt.startTime || "00:00").replace(/ /g, "").replace(":", ""); cl.href = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(ev.title || "") + "&dates=" + sd + "T" + stt + "00/" + ed2 + "T" + ett + "00&details=" + encodeURIComponent(ev.description || "") + "&location=" + encodeURIComponent((loc.name || "") + ", " + (loc.address || "")); } }\n' +
    '  if (music.enabled && music.audioUrl) { sh("audio-control"); var ae = new Audio(music.audioUrl); ae.loop = music.loop !== false; ae.volume = music.volume || 0.3; var playing = false; document.getElementById("audio-control").addEventListener("click", function() { if (playing) { ae.pause(); } else { ae.play(); } playing = !playing; }); }\n' +
    '  if (social.instagram) { sh("social-links"); var ig = document.getElementById("instagram-link"); if (ig) { ig.href = social.instagram; var lbl = document.getElementById("instagram-label"); if (lbl) { lbl.textContent = social.instagram.replace(/https?:\\/\\/(www\\.)?instagram\\.com\\//, "").replace(/\\/$/, "") || "Follow on Instagram"; } } }\n' +
    '  st("footer-text", footer.text);\n' +
    '  if (footer.branding) { var logo = document.getElementById("footer-logo"); if (logo && footer.branding.logoUrl) { logo.src = footer.branding.logoUrl; logo.alt = footer.branding.logoAlt || "Logo"; } var bl = document.getElementById("footer-branding-link"); if (bl && footer.branding.link) { bl.href = footer.branding.link; } }\n' +
    '  if (footer.credits) { st("footer-credits-label", footer.credits.designByLabel ? footer.credits.designByLabel + " " + footer.credits.authorName : ""); st("footer-copyright", "\u00a9 " + (footer.credits.copyrightYear || new Date().getFullYear())); st("footer-template-label", footer.credits.templateLabel); var tl = document.getElementById("footer-template-link"); if (tl) { tl.textContent = footer.credits.templateAuthor || ""; tl.href = footer.credits.templateLink || "#"; } var rl = document.getElementById("footer-repo-link"); if (rl) { rl.textContent = footer.credits.repoLabel || ""; rl.href = footer.credits.repoLink || "#"; } if (footer.credits.repoLink) sh("footer-repo-container"); }\n' +
    '  var simpleToggle = document.getElementById("simple-mode-toggle");\n' +
    '  if (simpleToggle && meta.showSimpleModeToggle !== false) { simpleToggle.hidden = false; simpleToggle.addEventListener("click", function() { document.body.classList.toggle("simple"); }); }\n' +
    '  var images = design.heroImages || [];\n' +
    '  if (images.length) { var hero = document.querySelector(".hero"); if (hero) { var sw = document.createElement("div"); sw.className = "hero-slideshow"; images.forEach(function(url, i) { var slide = document.createElement("div"); slide.className = "hero-slide" + (i === 0 ? " active" : ""); slide.style.backgroundImage = "url(" + url + ")"; sw.appendChild(slide); }); hero.insertBefore(sw, hero.firstChild); if (images.length > 1) { var idx = 0; setInterval(function() { var slides = sw.querySelectorAll(".hero-slide"); slides[idx].classList.remove("active"); idx = (idx + 1) % slides.length; slides[idx].classList.add("active"); }, 5000); } } }\n' +
    '})();\n';

  var inviteCss = ':root{--bg-base:#000;--text:#f8f9fa;--muted:#e5e7eb;--primary:#fff;--font-heading:"Cormorant Garamond",serif;--font-body:"Outfit",sans-serif;--radius:20px;--glass-bg:rgba(0,0,0,0.4);--glass-border:rgba(255,255,255,0.1)}*,*::before,*::after{box-sizing:border-box}html,body{margin:0;height:100%;overflow-x:hidden;background:var(--bg-base);color:var(--text);font-family:var(--font-body)}h1,h2,h3{font-family:var(--font-heading);font-weight:600;margin-top:0}h1{font-size:clamp(3rem,8vw,5rem);line-height:1;margin-bottom:.5rem;text-shadow:0 4px 12px rgba(0,0,0,0.3)}h2{font-size:clamp(2rem,5vw,3rem);margin-bottom:1.5rem}p{line-height:1.8;font-size:1.1rem;color:rgba(255,255,255,0.9)}a{color:inherit;transition:opacity .2s}a:hover{opacity:.8}.low-profile-link{text-decoration:none;color:inherit}.hidden-icon{display:none}#app{height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;scroll-behavior:smooth;max-width:none;padding:0;margin:0}section,footer{height:100vh;min-height:600px;scroll-snap-align:start;position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:2rem;text-align:center;background-size:cover;background-position:center;background-repeat:no-repeat}section::before,footer::before{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.6));z-index:1}section>*,footer>*{position:relative;z-index:2;max-width:600px;width:100%}.hero-slideshow{position:absolute;inset:0;z-index:0;overflow:hidden}.hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1.5s ease-in-out}.hero-slide.active{opacity:1}.subtitle{font-size:1.25rem;color:var(--muted);font-weight:300;margin-bottom:2rem;letter-spacing:1px;text-transform:uppercase}.primary-btn{display:inline-block;background:rgba(255,255,255,0.1);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.3);color:#fff;padding:1rem 2.5rem;border-radius:50px;text-decoration:none;font-weight:600;text-transform:uppercase;letter-spacing:1px;transition:all .3s ease}.primary-btn:hover{background:rgba(255,255,255,0.2);border-color:rgba(255,255,255,0.5);transform:translateY(-2px);box-shadow:0 10px 20px rgba(0,0,0,0.2)}.countdown{margin-top:.6rem;padding:1rem 1.25rem;background:rgba(255,255,255,0.08);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-radius:24px;border:1px solid rgba(255,255,255,0.15);display:flex;flex-direction:column;align-items:center;gap:1rem}.countdown-grid{display:grid;grid-template-columns:repeat(4,minmax(60px,1fr));gap:1rem;text-align:center}.countdown-unit strong{display:block;font-size:1.6rem;font-weight:600;color:var(--text);line-height:1}.countdown-unit span{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7}#schedule-list{list-style:none;padding:0;text-align:left}#schedule-list li{padding:1rem 0;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between}.form-embed{background:#fff;border-radius:12px;overflow-y:auto;max-height:75vh;width:100%}.form-embed iframe{display:block;width:100%;border:none}.footer-branding{display:flex;flex-direction:column;align-items:center;gap:1.5rem;margin-bottom:2rem}.footer-logo{width:80px;height:80px;border-radius:50%;object-fit:cover;background:rgba(255,255,255,0.1);border:2px solid rgba(255,255,255,0.2);padding:5px}.audio-fab,.accessibility-fab{position:fixed;bottom:2rem;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.15);backdrop-filter:blur(12px) brightness(0.8);-webkit-backdrop-filter:blur(12px) brightness(0.8);border:1px solid rgba(255,255,255,0.2);color:#fff;cursor:pointer;z-index:1000;display:flex;align-items:center;justify-content:center;transition:all .3s cubic-bezier(0.4,0,0.2,1);padding:0;box-shadow:0 8px 32px rgba(0,0,0,0.2)}.audio-fab{right:2rem}.accessibility-fab{left:2rem}@media(max-width:768px){.audio-fab,.accessibility-fab{width:44px;height:44px;bottom:max(1.25rem,env(safe-area-inset-bottom))}.audio-fab{right:1.25rem}.accessibility-fab{left:1.25rem}}.event-datetime{display:flex;flex-direction:column;gap:.2rem;margin-bottom:1rem}#maps-link{text-decoration:underline;text-underline-offset:4px}.location address{font-style:normal;margin-top:1rem}#venue-name::before{content:"";display:inline-block;width:18px;height:18px;margin-right:6px;vertical-align:middle;background:currentColor;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E") center/contain no-repeat}body.simple #venue-name::before{background:#555}#rsvp{justify-content:flex-start;padding-top:clamp(2rem,8vh,5rem)}#rsvp>*{max-width:800px}body.simple{overflow-y:auto!important;background:#fbfbfb!important;color:#1a1a1a!important}body.simple #app{scroll-snap-type:none!important;height:auto!important;overflow-y:visible!important;max-width:800px;margin:0 auto!important;padding:2rem 1rem!important}body.simple section,body.simple footer{height:auto!important;min-height:auto!important;padding:3rem 2rem!important;margin-bottom:2rem!important;background:#fff!important;color:#1a1a1a!important;border-radius:24px!important;box-shadow:0 4px 20px rgba(0,0,0,0.05)!important;border:1px solid rgba(0,0,0,0.05)!important;text-align:left!important;align-items:flex-start!important}body.simple section::before,body.simple footer::before{display:none!important}body.simple h1{font-size:clamp(3rem,10vw,4rem)!important;color:#000!important;text-shadow:none!important}body.simple .hero-slideshow{display:none!important}';

  if (typeof JSZip === 'undefined') {
    alert('JSZip library not loaded. Please check your internet connection and reload.');
    return;
  }

  var zip = new JSZip();
  zip.file('index.html', inviteHtml);
  zip.file('data/event.json', jsonText);
  zip.file('css/invite.css', inviteCss);
  zip.file('js/invite.js', inviteJs);
  zip.file('README.txt',
    'Invitation Bundle - ' + (eventData.event ? eventData.event.title || 'My Event' : 'My Event') + '\n\n' +
    'This folder contains everything needed to host your digital invitation.\n\n' +
    'How to deploy:\n' +
    '1. Upload this entire folder to any static web host.\n' +
    '2. Open index.html in your browser to preview.\n' +
    '3. To customize, edit data/event.json with your event details.\n\n' +
    'For more info: https://github.com/Rainier-PS/Invitation-Template\n'
  );

  zip.generateAsync({ type: 'blob' }).then(function(content) {
    var url = URL.createObjectURL(content);
    var a = document.createElement('a');
    a.href = url;
    a.download = folderName + '-invitation.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    var btns = document.querySelectorAll('.download-bundle-btn');
    btns.forEach(function(btn) {
      var orig = btn.textContent || btn.innerText;
      btn.textContent = 'Downloaded!';
      btn.style.background = '#10b981';
      setTimeout(function() {
        btn.textContent = orig;
        btn.style.background = '';
      }, 3000);
    });
  }).catch(function(err) {
    console.error('Bundle creation failed:', err);
    alert('Failed to create download bundle. Please try again.');
  });
};
