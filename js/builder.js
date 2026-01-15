document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-form');
    const preview = document.getElementById('json-preview');
    const navButtons = document.querySelectorAll('#section-nav .nav-btn');
    const sections = document.querySelectorAll('.form-section-stack');

    // XSS Protection / Sanitization
    const sanitize = (str) => {
        if (typeof str !== 'string') return str;
        return str.replace(/[<>]/g, (tag) => ({
            '<': '&lt;',
            '>': '&gt;'
        }[tag] || tag));
    };

    const scrollRoot = document.getElementById('builder-scroll-root');
    const scrollContent = document.querySelector('.form-scroll-content') || scrollRoot;

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            const targetEl = document.querySelector(targetId);
            if (targetEl && scrollContent) {
                const targetPos = targetEl.offsetTop - 80;
                scrollContent.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        root: scrollContent,
        rootMargin: '-10% 0px -80% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navButtons.forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => navObserver.observe(section));

    const colorPicker = document.getElementById('input-accentColor');
    const colorText = document.getElementById('input-accentColor-text');

    colorPicker.addEventListener('input', (e) => {
        colorText.value = e.target.value;
        updateJson();
    });
    colorText.addEventListener('input', (e) => {
        colorPicker.value = e.target.value;
        updateJson();
    });

    const updateJson = () => {
        const getValue = (id) => sanitize(document.getElementById(id).value);
        const getCheck = (id) => document.getElementById(id).checked;

        // Convert input date to ISO format YYYY-MM-DD
        const formatDateISO = (dateStr) => {
            if (!dateStr) return "";
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr; // fallback if invalid
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
        };

        const schedule = [];
        document.querySelectorAll('#schedule-list-builder .dynamic-list-item').forEach(item => {
            const time = item.querySelector('.sched-time');
            const label = item.querySelector('.sched-label');
            if (time && label) {
                schedule.push({
                    time: sanitize(time.value),
                    label: sanitize(label.value)
                });
            }
        });

        const heroImages = [];
        document.querySelectorAll('.hero-img-url').forEach(input => {
            heroImages.push(input.value);
        });

        const sectionBackgrounds = [];
        document.querySelectorAll('.section-bg-url').forEach(input => {
            sectionBackgrounds.push(input.value);
        });

        const json = {
            "_meta_comment": "TEMPLATE CONFIGURATION",
            "meta": {
                "version": "1.1",
                "private": false,
                "simpleMode": getCheck('input-simpleMode'),
                "showSimpleModeToggle": getCheck('input-showSimpleModeToggle'),
                "countdown": true
            },
            "event": {
                "title": getValue('input-title'),
                "subtitle": getValue('input-subtitle'),
                "description": getValue('input-description')
            },
            "datetime": {
                "date": formatDateISO(getValue('input-date')), // <- auto ISO format
                "startTime": getValue('input-startTime'),
                "endTime": getValue('input-endTime'),
                "timezone": "local",
                "allDay": false
            },
            "location": {
                "name": getValue('input-venue-name'),
                "address": getValue('input-venue-address'),
                "mapsLink": getValue('input-mapsLink')
            },
            "schedule": schedule,
            "rsvp": {
                "enabled": getCheck('input-rsvp-enabled'),
                "url": getValue('input-rsvp-url')
            },
            "calendar": {
                "enabled": true,
                "providers": {
                    "google": true
                }
            },
            "design": {
                "theme": "light",
                "accentColor": colorText.value,
                "heroImages": heroImages,
                "sectionBackgrounds": sectionBackgrounds
            },
            "music": {
                "enabled": getCheck('input-music-enabled'),
                "loop": getCheck('input-music-loop'),
                "volume": parseFloat(getValue('input-music-volume')) || 0.3,
                "audioUrl": getValue('input-music-audioUrl') || ""
            },
            "footer": {
                "text": getValue('input-footerText'),
                "branding": {
                    "link": "#",
                    "logoUrl": getValue('input-logoUrl'),
                    "logoAlt": "Logo"
                },
                "credits": {
                    "designByLabel": "Created & Designed by",
                    "copyrightYear": new Date().getFullYear().toString(),
                    "authorName": getValue('input-authorName'),
                    "templateLabel": "Template by",
                    "templateAuthor": "Rainier Pearson Saputra",
                    "templateLink": "https://rainier-ps.github.io/Personal-Website/",
                    "repoLabel": "Open Repository",
                    "repoLink": "https://github.com/Rainier-PS/Invitation-Template"
                }
            }
        };

        preview.textContent = JSON.stringify(json, null, 4);
    };

    form.addEventListener('input', updateJson);

    const listObserver = new MutationObserver(updateJson);
    listObserver.observe(document.getElementById('schedule-list-builder'), { childList: true, subtree: true });
    listObserver.observe(document.getElementById('hero-images-builder'), { childList: true, subtree: true });
    listObserver.observe(document.getElementById('section-backgrounds-builder'), { childList: true, subtree: true });

    updateJson();
});

window.copyJson = function () {
    const text = document.getElementById('json-preview').textContent;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.primary-btn[onclick="copyJson()"]');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#10b981';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
};

window.downloadJson = function () {
    const text = document.getElementById('json-preview').textContent;
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'event.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const btn = document.querySelector('.secondary-btn[onclick="downloadJson()"]');
    const originalText = btn.textContent;
    btn.textContent = 'Downloaded!';
    btn.style.background = '#10b981';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 2000);
};

