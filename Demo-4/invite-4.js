const EVENT_JSON_URL = './event-4.json';

function formatGoogleCalendarDate(dateStr, timeStr) {
    try {
        const isoAttempt = `${dateStr}T${timeStr.replace(' ', '')}:00`;
        let date = new Date(isoAttempt);

        if (isNaN(date.getTime())) {
            date = new Date(`${dateStr} ${timeStr}`);
        }

        const durationHours = 2;
        const endDate = new Date(date.getTime() + durationHours * 60 * 60 * 1000);

        const format = (d) => {
            const pad = n => String(n).padStart(2, '0');
            return (
                d.getFullYear() +
                pad(d.getMonth() + 1) +
                pad(d.getDate()) + 'T' +
                pad(d.getHours()) +
                pad(d.getMinutes()) +
                pad(d.getSeconds())
            );
        };


        return {
            start: format(date),
            end: format(endDate)
        };
    } catch (e) {
        console.error("Date parse error", e);
        return null;
    }
}

function startCountdown(dateStr, timeStr) {
    const container = document.getElementById('countdown');
    if (!container || !dateStr || !timeStr) return;

    let target = new Date(`${dateStr}T${timeStr.replace(' ', '')}:00`);
    if (isNaN(target.getTime())) {
        target = new Date(`${dateStr} ${timeStr}`);
    }
    if (isNaN(target.getTime())) return;

    const dEl = document.getElementById('cd-days');
    const hEl = document.getElementById('cd-hours');
    const mEl = document.getElementById('cd-minutes');
    const sEl = document.getElementById('cd-seconds');

    const update = () => {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            clearInterval(timer);
            container.textContent = 'Event has started';
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

fetch(EVENT_JSON_URL)
    .then(res => {
        if (!res.ok) throw new Error("Failed to load event JSON");
        return res.json();
    })
    .then(data => {
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

        setText("event-date", data.datetime.date);
        setText("event-time", data.datetime.startTime);
        
        if (data.meta?.countdown !== false) {
            startCountdown(data.datetime.date, data.datetime.startTime);
        }

        setText("venue-name", data.location.name);
        setText("venue-address", data.location.address);

        const mapsLink = document.getElementById("maps-link");
        if (mapsLink && data.location.mapsLink) {
            mapsLink.href = data.location.mapsLink;
        }

        if (data.calendar?.enabled && data.calendar?.providers?.google) {
            const dates = formatGoogleCalendarDate(data.datetime.date, data.datetime.startTime);
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

        if (data.rsvp?.enabled && data.rsvp?.url) {
            const rsvpFrame = document.querySelector('#rsvp iframe');
            if (rsvpFrame) {
                if (data.rsvp.provider === 'tally') {
                    rsvpFrame.setAttribute('data-tally-src', data.rsvp.url);
                    if (window.Tally) {
                        try {
                            window.Tally.loadEmbeds();
                        } catch (e) { console.log("Tally reload skipped"); }
                    }
                } else {
                    rsvpFrame.src = data.rsvp.url;
                }
            }
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

        // Simple Mode Toggle & Visibility Logic
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
