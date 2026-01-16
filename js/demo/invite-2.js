const EVENT_JSON_URL = '../data/event-2.json';

function parseEventDate(dateStr, timeStr, timezone = 'local') {
    if (!dateStr) return null;

    const time = timeStr ? timeStr.replace(' ', '') : '00:00';

    let date;
    if (timezone === 'UTC') {
        date = new Date(`${dateStr}T${time}:00Z`);
    } else {
        date = new Date(`${dateStr}T${time}:00`);
        if (isNaN(date.getTime())) {
            date = new Date(`${dateStr} ${timeStr || ''}`);
        }
    }

    return isNaN(date.getTime()) ? null : date;
}

function normalizeEventDatetime(data) {
    data.datetime ??= {};

    const dt = data.datetime;
    dt.allDay = dt.allDay === true;

    if (typeof dt.date !== 'string' || !dt.date.trim()) {
        dt.date = null;
        return;
    }

    const start = parseEventDate(dt.date, dt.allDay ? null : dt.startTime, dt.timezone);
    if (!start) {
        dt.date = null;
        return;
    }

    let end = null;
    if (dt.allDay) {
        end = new Date(start);
        end.setDate(end.getDate() + 1);
    } else if (dt.endTime) {
        end = parseEventDate(dt.date, dt.endTime, dt.timezone);
        if (end && end <= start) {
            console.warn("Invalid endTime; ignoring and using start time only");
            end = null;
        }
    }

    if (!end) end = new Date(start);

    dt.__start = start;
    dt.__end = end;
}

function formatGoogleCalendarDate(data) {
    try {
        const dt = data.datetime || {};

        const start = dt.__start;
        const end = dt.__end;

        if (!start || !end) return null;

        const format = (d) => {
            const pad = n => String(n).padStart(2, '0');
            return (
                d.getUTCFullYear() +
                pad(d.getUTCMonth() + 1) +
                pad(d.getUTCDate()) + 'T' +
                pad(d.getUTCHours()) +
                pad(d.getUTCMinutes()) +
                pad(d.getUTCSeconds()) + 'Z'
            );
        };

        return {
            start: format(start),
            end: format(end)
        };
    } catch (e) {
        console.error("Calendar date error", e);
        return null;
    }
}

function formatDisplayDate(isoDate, locale = undefined) {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate;

    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function startCountdown(data) {
    const container = document.getElementById('countdown');
    if (!container) return;

    const dt = data.datetime || {};
    const target = dt.__start; // use only normalized start

    if (!target || target <= new Date()) {
        container.hidden = true;
        return;
    }

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');

    const update = () => {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            clearInterval(timer);
            container.hidden = true;
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (dEl) dEl.textContent = days;
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    };

    update();
    container.hidden = false;
    const timer = setInterval(update, 1000);
}

function detectFormProvider(url) {
    if (!url) return 'iframe';
    if (url.includes('tally.so')) return 'tally';
    if (url.includes('docs.google.com/forms')) return 'google';
    if (url.includes('forms.office.com')) return 'microsoft';
    if (url.includes('typeform.com')) return 'typeform';
    if (url.includes('jotform.com')) return 'jotform';
    return 'iframe';
}

function renderRSVPForm(container, rsvp) {
    if (!container || !rsvp?.url) return;

    const provider = rsvp.provider === 'auto' || !rsvp.provider
        ? detectFormProvider(rsvp.url)
        : rsvp.provider;

    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.loading = 'lazy';
    iframe.frameBorder = '0';
    iframe.title = 'RSVP';

    const defaultHeights = {
        tally: 580,
        google: 800,
        microsoft: 800,
        typeform: 650,
        jotform: 650,
        iframe: 600
    };

    iframe.height = rsvp.height || defaultHeights[provider] || 600;

        if (provider === 'tally') {
        let src = rsvp.url;

        iframe.setAttribute('data-tally-src', src);
        container.appendChild(iframe);

        const loadTally = () => {
            if (window.Tally?.loadEmbeds) {
                window.Tally.loadEmbeds();
            }
        };

        if (!window.Tally) {
            const script = document.createElement('script');
            script.src = 'https://tally.so/widgets/embed.js';
            script.async = true;
            script.onload = loadTally;
            document.body.appendChild(script);
        } else {
            loadTally();
        }

        return;
    }

    if (provider === 'google') {
        let src = rsvp.url;

        if (!src.includes('embedded=true')) {
            src += (src.includes('?') ? '&' : '?') + 'embedded=true';
        }

        iframe.src = src;
        container.appendChild(iframe);
        return;
    }

    iframe.src = rsvp.url;
    container.appendChild(iframe);
}

function removeRSVPSection() {
    const rsvpSection = document.getElementById('rsvp');
    if (rsvpSection) {
        rsvpSection.remove();
    }
}

fetch(EVENT_JSON_URL)
    .then(res => {
        if (!res.ok) throw new Error("Failed to load event JSON");
        return res.json();
    })
    .then(data => {
        data.datetime ??= {};
        data.meta ??= {};
        data.calendar ??= {};
        data.location ??= {};
        data.event ??= {};

        normalizeEventDatetime(data);

        window.__EVENT_DATA__ = data;
        document.title = data.event.title || "You're Invited";

        const metaTitle = document.querySelector('meta[property="og:title"]');
        if (metaTitle) metaTitle.content = data.event.title;

        const metaDesc = document.querySelector('meta[property="og:description"]');
        if (metaDesc) metaDesc.content = data.event.description;

        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text || "";
        }

        setText("event-title", data.event.title);
        setText("event-subtitle", data.event.subtitle);
        setText("event-description", data.event.description);

        setText("event-date", formatDisplayDate(data.datetime.date));

        if (data.datetime.allDay) {
            setText("event-time", "All Day");
        } else {
            setText("event-time", data.datetime.startTime);
        }
        
        if (data.meta?.countdown !== false) {
            startCountdown(data);
        }

        setText("venue-name", data.location.name);
        setText("venue-address", data.location.address);

        const mapsLink = document.getElementById("maps-link");
        if (mapsLink && data.location.mapsLink) {
            mapsLink.href = data.location.mapsLink;
        }

        if (data.calendar?.enabled && data.calendar?.providers?.google) {
            const dates = formatGoogleCalendarDate(data);
            if (dates) {
                const calBase = "https://calendar.google.com/calendar/render?action=TEMPLATE";
                const params = new URLSearchParams();
                params.append("text", data.event.title);
                params.append("dates", `${dates.start}/${dates.end}`);
                params.append("details", data.event.description);
                params.append("location", `${data.location.name}, ${data.location.address}`);

                const calUrl = `${calBase}&${params.toString()}`;

                const calLink = document.getElementById("google-calendar-link");
                const calContainer = document.getElementById("calendar-actions");

                if (calLink && calContainer) {
                    calLink.href = calUrl;
                    calContainer.hidden = false;
                }
            }
        }

        setText("footer-text", data.footer?.text);

        if (data.footer?.branding) {
            const brandingLink = document.getElementById("footer-branding-link");
            const footerLogo = document.getElementById("footer-logo");
            if (brandingLink) brandingLink.href = data.footer.branding.link || "#";
            if (footerLogo) {
                if (data.footer.branding.logoUrl) {
                    footerLogo.src = data.footer.branding.logoUrl;
                    footerLogo.alt = data.footer.branding.logoAlt || "Logo";
                    footerLogo.onerror = () => { footerLogo.style.display = 'none'; };
                    footerLogo.style.display = 'block';
                } else {
                    footerLogo.style.display = 'none';
                }
            }
        }

        if (data.footer?.credits) {
            const credits = data.footer.credits;
            setText("footer-credits-label", credits.designByLabel);
            setText("footer-copyright", `© ${credits.copyrightYear} ${credits.authorName}`);
            setText("footer-template-label", credits.templateLabel);

            const templateLink = document.getElementById("footer-template-link");
            if (templateLink) {
                templateLink.href = credits.templateLink || "#";
                templateLink.textContent = credits.templateAuthor || "";
            }

            const repoContainer = document.getElementById("footer-repo-container");
            const repoLink = document.getElementById("footer-repo-link");
            if (repoContainer && repoLink && credits.repoLink) {
                repoLink.href = credits.repoLink;
                repoLink.textContent = credits.repoLabel || "Repository";
                repoContainer.hidden = false;
            }
        }

        const rsvp = data.rsvp;

        const rsvpEnabled = rsvp?.enabled !== false;

        if (!rsvp || !rsvpEnabled) {
            removeRSVPSection();
        } else if (!rsvp.url) {
            console.warn('[RSVP] enabled=true but no url provided. Removing RSVP section.');
            removeRSVPSection();
        } else {
            const formContainer = document.querySelector('#rsvp .form-embed');
            renderRSVPForm(formContainer, rsvp);
        }

        if (data.schedule?.length) {
            const section = document.getElementById("schedule-section");
            const list = document.getElementById("schedule-list");
            if (!list) return;
            list.innerHTML = "";

            data.schedule.forEach(item => {
                const li = document.createElement("li");
                if (typeof item === 'string') {
                    li.textContent = item;
                } else {
                    const strong = document.createElement("strong");
                    strong.textContent = item.time || '';

                    li.appendChild(strong);
                    li.appendChild(document.createTextNode(` ${item.label}`));

                }
                list.appendChild(li);
            });

            if (section) section.hidden = false;
        }

        if (data.design?.accentColor) {
            document.documentElement.style.setProperty('--primary', data.design.accentColor);
        }

        const sections = document.querySelectorAll('section, footer');
        const heroSection = document.querySelector('.hero');

        if (data.design?.heroImages?.length && heroSection) {
            const slideContainer = document.createElement('div');
            slideContainer.className = 'hero-slideshow';

            data.design.heroImages.forEach((url, i) => {
                const slide = document.createElement('div');
                slide.className = `hero-slide ${i === 0 ? 'active' : ''}`;
                slide.setAttribute('aria-hidden', 'true');
                slide.style.backgroundImage = `url('${url}')`;
                slideContainer.appendChild(slide);
            });

            heroSection.insertBefore(slideContainer, heroSection.firstChild);

            if (data.design.heroImages.length > 1) {
                let currentSlide = 0;
                const slides = slideContainer.querySelectorAll('.hero-slide');

                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                if (!prefersReducedMotion) {
                    const slideshowInterval = setInterval(() => {
                        slides[currentSlide].classList.remove('active');
                        currentSlide = (currentSlide + 1) % slides.length;
                        slides[currentSlide].classList.add('active');
                    }, 5000); // 5 seconds per slide
                }
            }
        } else if (data.design?.backgrounds?.length && sections[0]) {
            sections[0].style.backgroundImage = `url('${data.design.backgrounds[0]}')`;
        }

        if (data.design?.sectionBackgrounds?.length) {
            data.design.sectionBackgrounds.forEach((url, i) => {
                const targetIndex = i + 1;
                if (sections[targetIndex]) {
                    sections[targetIndex].style.backgroundImage = `url('${url}')`;
                }
            });
        } else if (data.design?.backgrounds?.length) {
            data.design.backgrounds.forEach((url, index) => {
                if (sections[index]) {
                    if (index === 0 && data.design.heroImages?.length) return;
                    sections[index].style.backgroundImage = `url('${url}')`;
                }
            });
        }

        if (data.meta?.simpleMode) {
            document.body.classList.add("simple");
        }

        const simpleToggleBtn = document.getElementById('simple-mode-toggle');
        const standardIcon = document.getElementById('standard-view-icon');
        const simpleIcon = document.getElementById('simple-view-icon');

        if (simpleToggleBtn) {
            // Only show toggle if enabled in JSON (defaults to false)
            const showToggle = data.meta?.showSimpleModeToggle === true;
            simpleToggleBtn.style.display = showToggle ? 'flex' : 'none';
            simpleToggleBtn.classList.add('scrolled-out');

            const updateIcons = (isSimple) => {
                if (standardIcon) standardIcon.style.display = isSimple ? 'none' : 'block';
                if (simpleIcon) simpleIcon.style.display = isSimple ? 'block' : 'none';
                simpleToggleBtn.setAttribute('aria-label', isSimple ? 'Switch to Standard View' : 'Switch to Simple View');
            };

            updateIcons(document.body.classList.contains('simple'));

            simpleToggleBtn.addEventListener('click', () => {
                const isSimple = document.body.classList.toggle('simple');
                updateIcons(isSimple);

                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            const heroForObserver = document.querySelector('.hero');

            if (heroForObserver && showToggle) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            simpleToggleBtn.classList.remove('scrolled-out');
                        } else {
                            simpleToggleBtn.classList.add('scrolled-out');
                        }
                    },
                    {
                        threshold: 0.15
                    }
                );

                observer.observe(heroForObserver);

                window.addEventListener('beforeunload', () => observer.disconnect());
            }
        }
    })
    .catch(err => {
        console.error(err);
        const title = document.getElementById("event-title");
        const subtitle = document.getElementById("event-subtitle");

        if (title) title.textContent = "Unable to load event details";
        if (subtitle) subtitle.textContent = "Please check back later.";
    });

// Audio Player
document.addEventListener('DOMContentLoaded', () => {
    const waitForData = () => {
        if (!window.__EVENT_DATA__?.music?.enabled) {
            setTimeout(waitForData, 50);
            return;
        }
        const data = window.__EVENT_DATA__;

        const audio = new Audio();
        audio.src = data.music.audioUrl;
        audio.load();
        audio.loop = data.music.loop ?? true;
        audio.volume = data.music.volume ?? 0.3;

        const btn = document.getElementById('audio-control');
        const playIcon = document.getElementById('play-icon');
        const pauseIcon = document.getElementById('pause-icon');
        let isPlaying = false;

        if (btn) {
            btn.hidden = false;

            btn.addEventListener('click', () => {
                if (isPlaying) {
                    audio.pause();
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                    btn.classList.remove('playing');
                } else {
                    audio.play().catch(e => console.log("Audio play blocked", e));
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    btn.classList.add('playing');
                }
                isPlaying = !isPlaying;
            });
        }
    };

    waitForData();
});
