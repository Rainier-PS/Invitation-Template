const EVENT_JSON_URL = "https://raw.githubusercontent.com/Rainier-PS/Invitation-Template/main/event.json";

function formatGoogleCalendarDate(dateStr, timeStr) {
    try {
        const fullDateStr = `${dateStr} ${timeStr}`;
        const date = new Date(fullDateStr);

        if (isNaN(date.getTime())) return null;

        const endDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);

        const format = (d) => {
            return d.toISOString().replace(/-|:|\.\d+/g, "");
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

fetch(EVENT_JSON_URL)
    .then(res => {
        if (!res.ok) throw new Error("Failed to load event JSON");
        return res.json();
    })
    .then(data => {
        document.title = data.event.title || "You're Invited";

        const metaTitle = document.querySelector('meta[property="og:title"]');
        if (metaTitle) metaTitle.content = data.event.title;

        const metaDesc = document.querySelector('meta[property="og:description"]');
        if (metaDesc) metaDesc.content = data.event.description;

        // textContent Injection
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text || "";
        }

        setText("event-title", data.event.title);
        setText("event-subtitle", data.event.subtitle);
        setText("event-description", data.event.description);

        setText("event-date", data.datetime.date);
        setText("event-time", data.datetime.startTime);

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

        // Footer Injection
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
            const rsvpFrame = document.querySelector('iframe[data-tally-src], iframe[title="RSVP"]');
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
        } else {

        }

        if (data.schedule?.length) {
            const section = document.getElementById("schedule-section");
            const list = document.getElementById("schedule-list");
            list.innerHTML = "";

            data.schedule.forEach(item => {
                const li = document.createElement("li");
                if (typeof item === 'string') {
                    li.textContent = item;
                } else {
                    li.innerHTML = `<strong>${item.time}</strong> ${item.label}`;
                }
                list.appendChild(li);
            });

            if (section) section.hidden = false;
        }

        if (data.design?.accentColor) {
            document.documentElement.style.setProperty('--primary', data.design.accentColor);
        }

        const sections = document.querySelectorAll('section, footer');

        if (data.design?.heroImages?.length && sections[0]) {
            const heroSection = sections[0];
            const slideContainer = document.createElement('div');
            slideContainer.className = 'hero-slideshow';

            data.design.heroImages.forEach((url, i) => {
                const slide = document.createElement('div');
                slide.className = `hero-slide ${i === 0 ? 'active' : ''}`;
                slide.style.backgroundImage = `url('${url}')`;
                slideContainer.appendChild(slide);
            });

            heroSection.insertBefore(slideContainer, heroSection.firstChild);

            // Auto-rotate
            if (data.design.heroImages.length > 1) {
                let currentSlide = 0;
                const slides = slideContainer.querySelectorAll('.hero-slide');

                setInterval(() => {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide + 1) % slides.length;
                    slides[currentSlide].classList.add('active');
                }, 5000); // 5 seconds per slide
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

            const updateIcons = (isSimple) => {
                if (standardIcon) standardIcon.style.display = isSimple ? 'none' : 'block';
                if (simpleIcon) simpleIcon.style.display = isSimple ? 'block' : 'none';
                simpleToggleBtn.setAttribute('aria-label', isSimple ? 'Switch to Standard View' : 'Switch to Simple View');
            };

            // Initial icon state based on body class
            updateIcons(document.body.classList.contains('simple'));

            simpleToggleBtn.addEventListener('click', () => {
                const isSimple = document.body.classList.toggle('simple');
                updateIcons(isSimple);

                // Scroll to top when switching for better orientation
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // IntersectionObserver to hide button when scrolling out of Hero
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            simpleToggleBtn.classList.remove('scrolled-out');
                        } else {
                            simpleToggleBtn.classList.add('scrolled-out');
                        }
                    });
                }, { threshold: 0.1 }); // 10% visibility to trigger

                observer.observe(heroSection);
            }
        }
    })
    .catch(err => {
        console.error(err);
        document.getElementById("event-title").textContent = "Unable to load event details";
        document.getElementById("event-subtitle").textContent = "Please check back later.";
    });

// Audio Player
document.addEventListener('DOMContentLoaded', () => {
    const AUDIO_URL = "https://raw.githubusercontent.com/Rainier-PS/Invitation-Template/main/media/alarm-clock-90867.mp3";
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.3;

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
});