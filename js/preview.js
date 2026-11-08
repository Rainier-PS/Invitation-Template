(function () {
  'use strict';

  var SAMPLE = {
    title: 'Alex & Sam',
    subtitle: 'Are getting married',
    description: 'Join us for dinner, dancing, and a night to remember. Cocktail attire, please.',
    dateLabel: 'Friday, December 25, 2026',
    time: '6:00 PM - 9:00 PM',
    venueName: 'The Grand Ballroom',
    venueAddress: '123 Party Lane, Celebration City',
    quoteTitle: 'Words of Inspiration',
    author: 'Alex & Sam',
    quotes: [
      { text: 'Whatever souls are made of, his and mine are the same.', author: 'Emily Bronte' },
      { text: 'Love is friendship that has caught fire.', author: 'Ann Landers' }
    ],
    schedule: [
      { time: '4:00 PM', label: 'Guests arrive' },
      { time: '5:00 PM', label: 'Ceremony' },
      { time: '7:00 PM', label: 'Dinner & dancing' }
    ]
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function filled(value, fallback) {
    if (value === undefined || value === null) return fallback;
    return String(value).trim() ? value : fallback;
  }

  function setText(id, value) {
    var el = byId(id);
    if (el) el.textContent = value;
  }

  function longDate(iso) {
    if (!iso) return SAMPLE.dateLabel;
    var parsed = new Date(iso + 'T12:00:00');
    if (isNaN(parsed.getTime())) return iso;
    try {
      return parsed.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  function renderSchedule(items) {
    var section = byId('schedule-section');
    var list = byId('schedule-list');
    if (!section || !list) return;
    var rows = items.length ? items : SAMPLE.schedule;
    while (list.firstChild) list.removeChild(list.firstChild);
    rows.forEach(function (item) {
      var row = document.createElement('li');
      var time = document.createElement('span');
      var label = document.createElement('span');
      time.textContent = item.time || '';
      label.textContent = item.label || '';
      row.appendChild(time);
      row.appendChild(label);
      list.appendChild(row);
    });
    section.hidden = false;
  }

  function renderQuotes(items, heading) {
    var section = byId('quotes-section');
    var container = byId('quotes-container');
    if (!section || !container) return;
    var title = section.querySelector('h2');
    if (title) title.textContent = heading;
    var rows = items.length ? items : SAMPLE.quotes;
    while (container.firstChild) container.removeChild(container.firstChild);
    rows.forEach(function (item) {
      var block = document.createElement('div');
      block.className = 'quote-item';
      var quote = document.createElement('p');
      quote.className = 'quote-text';
      quote.textContent = item.text;
      block.appendChild(quote);
      if (item.author) {
        var author = document.createElement('p');
        author.className = 'quote-author';
        author.textContent = item.author;
        block.appendChild(author);
      }
      container.appendChild(block);
    });
    section.hidden = false;
  }

  function renderRsvp(rsvp, sections) {
    var section = byId('rsvp');
    if (!section) return;
    if (sections.rsvp === false || rsvp.enabled === false) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    var embed = section.querySelector('.form-embed');
    if (!embed) return;
    if (rsvp.url) {
      var frame = embed.querySelector('iframe');
      if (!frame) {
        frame = document.createElement('iframe');
        while (embed.firstChild) embed.removeChild(embed.firstChild);
        embed.appendChild(frame);
      }
      if (frame.getAttribute('src') !== rsvp.url) frame.src = rsvp.url;
      return;
    }
    var note = embed.querySelector('.rsvp-placeholder');
    if (!note) {
      while (embed.firstChild) embed.removeChild(embed.firstChild);
      note = document.createElement('p');
      note.className = 'rsvp-placeholder';
      note.textContent = 'Your RSVP form appears here';
      embed.appendChild(note);
    }
  }

  function resolveImageSource(value, assets) {
    if (!value) return '';
    var raw = String(value).trim();
    if (!raw) return '';
    if (assets && Object.prototype.hasOwnProperty.call(assets, raw) && assets[raw]) return assets[raw];
    if (/^images\//i.test(raw)) return '';
    if (/^(https?:|data:|blob:|\/)/i.test(raw)) return raw;
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return '';
    return raw;
  }

  function cssUrl(value) {
    var text = String(value).replace(/[\r\n]+/g, '');
    text = text.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return 'url("' + text + '")';
  }

  var slideshowKey = null;
  var slideshowTimer = null;

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function renderHeroImages(images, assets) {
    var resolved = [];
    (Array.isArray(images) ? images : []).forEach(function (value) {
      var url = resolveImageSource(value, assets);
      if (url) resolved.push(url);
    });

    var key = resolved.join('\n');
    if (key === slideshowKey) return;
    slideshowKey = key;

    if (slideshowTimer) {
      window.clearInterval(slideshowTimer);
      slideshowTimer = null;
    }

    var hero = document.querySelector('.hero');
    if (!hero) return;
    var existing = hero.querySelector('.hero-slideshow');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    if (!resolved.length) return;

    var wrap = document.createElement('div');
    wrap.className = 'hero-slideshow';
    resolved.forEach(function (url, index) {
      var slide = document.createElement('div');
      slide.className = 'hero-slide' + (index === 0 ? ' active' : '');
      slide.setAttribute('aria-hidden', 'true');
      slide.style.backgroundImage = cssUrl(url);
      wrap.appendChild(slide);
    });
    hero.insertBefore(wrap, hero.firstChild);

    if (resolved.length > 1) {
      if (prefersReducedMotion()) wrap.classList.add('reduce-motion');
      var current = 0;
      var slides = wrap.querySelectorAll('.hero-slide');
      slideshowTimer = window.setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 5000);
    }
  }

  var backgroundTargets = [];

  function renderSectionBackgrounds(backgrounds, assets) {
    backgroundTargets.forEach(function (el) { el.style.backgroundImage = ''; });
    backgroundTargets = [];

    var sections = document.querySelectorAll('#app > section, #app > footer');
    if (!sections.length) sections = document.querySelectorAll('section, footer');

    (Array.isArray(backgrounds) ? backgrounds : []).forEach(function (value, index) {
      var url = resolveImageSource(value, assets);
      var target = sections[index + 1];
      if (!url || !target) return;
      target.style.backgroundImage = cssUrl(url);
      backgroundTargets.push(target);
    });
  }

  function renderFooter(footer, credits, assets) {
    var author = filled(credits.authorName, SAMPLE.author);
    setText('footer-text', filled(footer.text, 'Made with love'));
    setText('footer-credits-label', author);
    setText('footer-copyright', '\u00a9 ' + filled(credits.copyrightYear, '2026') + ' ' + author);
    setText('footer-template-label', filled(credits.templateLabel, 'Template'));
    var templateLink = byId('footer-template-link');
    if (templateLink) {
      templateLink.textContent = filled(credits.templateAuthor, 'Celebration');
      templateLink.href = filled(credits.templateLink, '#');
    }
    var branding = footer.branding || {};
    var logo = byId('footer-logo');
    if (logo) {
      var logoSrc = resolveImageSource(branding.logoUrl, assets);
      if (logoSrc) {
        logo.src = logoSrc;
        logo.alt = branding.logoAlt || 'Logo';
        logo.hidden = false;
      } else {
        logo.hidden = true;
        logo.removeAttribute('src');
      }
    }
  }

  function renderSocial(social) {
    var wrap = byId('social-links');
    var link = byId('instagram-link');
    if (!wrap || !link) return;
    if (!social.instagram) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    link.href = social.instagram;
    var handle = social.instagram.replace(/https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '');
    setText('instagram-label', handle ? '@' + handle : 'Follow on Instagram');
  }

  function render(config, assets) {
    if (!config) return;
    var ev = config.event || {};
    var dt = config.datetime || {};
    var loc = config.location || {};
    var rsvp = config.rsvp || {};
    var footer = config.footer || {};
    var meta = config.meta || {};
    var sections = config.sections || {};
    var social = config.social || {};
    var schedule = Array.isArray(config.schedule) ? config.schedule.filter(function (item) { return item && item.label; }) : [];
    var quotes = Array.isArray(config.quotes) ? config.quotes.filter(function (item) { return item && item.text; }) : [];

    setText('event-title', filled(ev.title, SAMPLE.title));
    setText('event-subtitle', filled(ev.subtitle, SAMPLE.subtitle));
    setText('event-description', filled(ev.description, SAMPLE.description));

    var dateEl = byId('event-date');
    if (dateEl) {
      dateEl.textContent = longDate(dt.date);
      if (dt.date) dateEl.setAttribute('datetime', dt.date);
      else dateEl.removeAttribute('datetime');
    }
    var time = [dt.startTime, dt.endTime].filter(Boolean).join(' - ');
    setText('event-time', filled(time, SAMPLE.time));

    setText('venue-name', filled(loc.name, SAMPLE.venueName));
    setText('venue-address', filled(loc.address, SAMPLE.venueAddress));
    var maps = byId('maps-link');
    if (maps) maps.href = filled(loc.mapsLink, 'https://maps.google.com');

    renderSchedule(schedule);
    if (sections['quotes-section'] !== false) {
      renderQuotes(quotes, filled(config.quoteTitle, SAMPLE.quoteTitle));
    }
    renderRsvp(rsvp, sections);
    renderFooter(footer, footer.credits || {}, assets);
    renderSocial(social);
    renderHeroImages((config.design || {}).heroImages, assets);
    renderSectionBackgrounds((config.design || {}).sectionBackgrounds, assets);

    document.body.classList.toggle('simple', !!meta.simpleMode);

    var quoteSection = byId('quotes-section');
    if (quoteSection && sections['quotes-section'] === false) quoteSection.hidden = true;
    var locationBlock = document.querySelector('.location');
    if (locationBlock) locationBlock.hidden = sections['location-section'] === false;
    var detailsBlock = document.querySelector('.event-details');
    if (detailsBlock) detailsBlock.hidden = sections.eventDetails === false;
    var footerBlock = document.querySelector('footer');
    if (footerBlock) footerBlock.hidden = sections.footer === false;
  }

  window.addEventListener('message', function (event) {
    if (event.source !== window.parent) return;
    var data = event.data;
    if (!data || data.type !== 'invitation-preview' || !data.config) return;
    render(data.config, data.assets);
  });
})();
