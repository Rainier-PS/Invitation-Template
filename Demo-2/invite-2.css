/* CORE STYLES - Reusable Base Styles */

:root {
    --bg-base: #000000;
    --text: #f8f9fa;
    --muted: #e5e7eb;
    --primary: #ffffff;
    /* Overridden by JS */

    --font-heading: 'Cormorant Garamond', serif;
    --font-body: 'Outfit', sans-serif;

    --radius: 20px;
    --glass-bg: rgba(0, 0, 0, 0.4);
    --glass-border: rgba(255, 255, 255, 0.1);
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    height: 100%;
    overflow-x: hidden;
    background: var(--bg-base);
    color: var(--text);
    font-family: var(--font-body);
}

h1,
h2,
h3 {
    font-family: var(--font-heading);
    font-weight: 600;
    margin-top: 0;
}

h1 {
    font-size: clamp(3rem, 8vw, 5rem);
    line-height: 1;
    margin-bottom: 0.5rem;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

h2 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: 1.5rem;
}

p {
    line-height: 1.8;
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
}

a {
    color: inherit;
    transition: opacity 0.2s;
}

a:hover {
    opacity: 0.8;
}

.low-profile-link {
    text-decoration: none;
    color: inherit;
}

.low-profile-link:hover {
    opacity: 0.9;
}

.hidden-icon {
    display: none;
}

.glass-panel,
.section-card {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 2rem;
}

@supports not (backdrop-filter: blur(12px)) {
    .glass-panel,
    .section-card {
        background: rgba(0, 0, 0, 0.85);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}


/* TEMPLATE-SPECIFIC STYLES */

#app {
    height: 100%;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
    max-width: none;
    padding: 0;
    margin: 0;
}

section,
footer {
    height: 100vh;
    min-height: 600px;
    scroll-snap-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    text-align: center;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

section::before,
footer::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
    z-index: 1;
}

section>*,
footer>* {
    position: relative;
    z-index: 2;
    max-width: 600px;
    width: 100%;
}

.hero-slideshow {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
}

.hero-slide {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: opacity 1.5s ease-in-out;
}

@media (min-width: 1024px) {
    .hero-slide {
        background-position: center center;
    }
}

@media (min-width: 1440px) {
    .hero-slideshow {
        max-width: 1400px;
        margin: 0 auto;
    }
}

.hero-slide.active {
    opacity: 1;
}

.subtitle {
    font-size: 1.25rem;
    color: var(--muted);
    font-weight: 300;
    margin-bottom: 2rem;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.hero-meta {
    font-size: 1.3rem;
    font-weight: 400;
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

#calendar-actions {
    margin-top: 1rem;
    font-size: 1rem;
}

#google-calendar-link {
    color: inherit;
    opacity: 0.8;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    cursor: pointer;
}

#google-calendar-link:hover {
    opacity: 1;
}

.primary-btn {
    display: inline-block;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: all 0.3s ease;
}

.primary-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.location address {
    font-style: normal;
    margin-top: 1rem;
}

#maps-link {
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
}

#schedule-list {
    list-style: none;
    padding: 0;
    text-align: left;
}

#schedule-list li {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
}

#schedule-list li:last-child {
    border-bottom: none;
}

@media (max-width: 640px) {
    #schedule-list li {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        justify-content: flex-start;
    }

    #schedule-list li time,
    #schedule-list li span:first-child {
        flex: 0 0 72px;
        min-width: 72px;
        font-weight: 600;
        white-space: nowrap;
    }

    #schedule-list li span:last-child {
        flex: 1;
        text-align: left;
        word-break: break-word;
    }
}

#rsvp {
    justify-content: flex-start;
    padding-top: clamp(2rem, 8vh, 5rem);
}

#rsvp>* {
    max-width: 800px;
}

#rsvp h2 {
    margin-bottom: 0.25rem;
}

#rsvp p {
    margin-top: 0;
    margin-bottom: 1.5rem;
}

.form-embed {
    background: #fff;
    border-radius: 12px;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    height: auto;
    max-height: 75vh;
    width: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.form-embed::-webkit-scrollbar {
    width: 8px;
}

.form-embed::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 0 12px 12px 0;
}

.form-embed::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
}

.form-embed::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}

.form-embed iframe {
    display: block;
    width: 100%;
    border: none;
}

.footer-branding {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.footer-logo {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    padding: 5px;
    transition: transform 0.3s ease;
}

.footer-logo:hover {
    transform: scale(1.05);
}

.footer-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.hosted-by {
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    margin: 0;
    opacity: 0.8;
}

.copyright,
.repo-info {
    font-size: 0.95rem;
    margin: 0;
    color: var(--text);
    font-weight: 300;
}

.repo-info {
    margin-top: 0.5rem;
    opacity: 0.8;
}

#footer-text {
    font-size: 0.85rem;
    opacity: 0.5;
    margin-top: 1rem;
}

.audio-fab,
.accessibility-fab {
    position: fixed;
    bottom: 2rem;
   
    width: 52px;
    height: 52px;

    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px) brightness(0.8);
    -webkit-backdrop-filter: blur(12px) brightness(0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    cursor: pointer;
    z-index: 1000;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.audio-fab svg,
.accessibility-fab svg {
    width: 22px;
    height: 22px;
}

@media (max-width: 768px) {
    .audio-fab,
    .accessibility-fab {
        width: 44px;
        height: 44px;
        bottom: max(1.25rem, env(safe-area-inset-bottom));
    }

    .audio-fab {
        right: 1.25rem;
    }

    .accessibility-fab {
        left: 1.25rem;
    }

    .audio-fab svg,
    .accessibility-fab svg {
        width: 18px;
        height: 18px;
    }
}

@media (max-width: 380px) {
    .audio-fab,
    .accessibility-fab {
        width: 40px;
        height: 40px;
    }
}

.audio-fab {
    right: 2rem;
}

.accessibility-fab {
    left: 2rem;
}

.accessibility-fab.scrolled-out,
#simple-mode-toggle.scrolled-out {
    opacity: 0;
    pointer-events: none;
    transform: scale(0.8) translateY(20px);
}

@media (hover: hover) and (pointer: fine) {
    .audio-fab:hover,
    .accessibility-fab:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: scale(1.1) translateY(-4px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    }
}

@media (max-width: 480px) {
    body.simple .audio-fab,
    body.simple .accessibility-fab {
        bottom: max(1rem, env(safe-area-inset-bottom));
    }
}

[data-tooltip] {
    position: relative;
}

.audio-fab[data-tooltip],
.accessibility-fab[data-tooltip] {
    position: fixed;
}

[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 110%;
    background: rgba(0, 0, 0, 0.9);
    color: #fff;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s ease;
    z-index: 1001;
    font-family: var(--font-body);
    font-weight: 400;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.audio-fab[data-tooltip]::after {
    display: none;
    right: 0;
}

.accessibility-fab[data-tooltip]::after {
    left: 0;
}

[data-tooltip]:hover::after {
    opacity: 1;
    transform: translateY(-8px);
}

section>* {
    animation: fadeIn 1s ease-out forwards;
}

section h1 {
    animation-delay: 0.1s;
}

section .subtitle {
    animation-delay: 0.3s;
}

section .hero-meta {
    animation-delay: 0.5s;
}

section .primary-btn {
    animation-delay: 0.7s;
}

footer .footer-logo {
    animation-delay: 0.2s;
}

footer .footer-info {
    animation-delay: 0.4s;
}

/* SIMPLE MODE STYLES */

body.simple {
    overflow-y: auto !important;
    background: #fbfbfb !important;
    color: #1a1a1a !important;
    scroll-behavior: smooth;
}

body.simple #app {
    scroll-snap-type: none !important;
    height: auto !important;
    overflow-y: visible !important;
    max-width: 800px;
    margin: 0 auto !important;
    padding: 2rem 1rem !important;
}

body.simple section,
body.simple footer {
    height: auto !important;
    min-height: auto !important;
    padding: 3rem 2rem !important;
    margin-bottom: 2rem !important;
    background: #ffffff !important;
    color: #1a1a1a !important;
    border-radius: 24px !important;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(0, 0, 0, 0.05) !important;
    text-align: left !important;
    align-items: flex-start !important;
}

body.simple section::before,
body.simple footer::before {
    display: none !important;
}

body.simple h1 {
    font-size: clamp(3rem, 10vw, 4rem) !important;
    color: #000000 !important;
    text-shadow: none !important;
    margin-bottom: 1.5rem !important;
    line-height: 1.1 !important;
}

body.simple h2 {
    font-size: 2.2rem !important;
    color: var(--primary) !important;
    margin-bottom: 2rem !important;
    position: relative;
    padding-bottom: 0.75rem;
}

body.simple h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: var(--primary);
    border-radius: 2px;
}

body.simple p,
body.simple li,
body.simple time,
body.simple span,
body.simple address {
    font-size: 1.3rem !important;
    line-height: 1.7 !important;
    color: #2c2c2c !important;
    font-weight: 400 !important;
    font-family: var(--font-body) !important;
}

body.simple strong {
    font-weight: 600 !important;
    color: #000 !important;
}

body.simple .subtitle {
    font-size: 1.1rem !important;
    letter-spacing: 2px !important;
    margin-bottom: 2rem !important;
    color: #555 !important;
}

body.simple .primary-btn {
    background: var(--primary) !important;
    color: #ffffff !important;
    padding: 1.5rem 3rem !important;
    font-size: 1.4rem !important;
    border: none !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
    width: 100% !important;
    max-width: none !important;
    text-align: center !important;
}

body.simple .hero-slideshow {
    display: none !important;
}

body.simple .accessibility-fab,
body.simple .audio-fab {
    background: rgba(0, 0, 0, 0.8) !important;
    color: #ffffff !important;
    border: none !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
}

body.simple .audio-fab[data-tooltip]::after {
    display: block;
}

body.simple .form-embed {
    border: 2px solid rgba(0, 0, 0, 0.1) !important;
    border-radius: 20px !important;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
}

body.simple footer {
    text-align: center !important;
    align-items: center !important;
}

/* HERO COUNTDOWN */

.countdown {
    margin-top: 0.6rem;
    padding: 1rem 1.25rem;

    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);

    border-radius: 24px;
    border: 1px solid rgba(255, 255, 255, 0.15);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.countdown-label {
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.75;
}

.countdown-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(60px, 1fr));
    gap: 1rem;
    text-align: center;
}

.countdown-unit strong {
    display: block;
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--text);
    line-height: 1;
}

.countdown-unit span {
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-top: 0.25rem;
}

@media (max-width: 768px) {
    body.simple .countdown {
        display: none !important;
    }

    body.simple .event-datetime {
        margin: 0.25rem 0 1rem !important;
    }
}

@media (max-width: 480px) {
    .countdown-grid {
        gap: 0.75rem;
    }

    .countdown-unit strong {
        font-size: 1.4rem;
    }

    .event-datetime p {
        margin: 0.1rem 0;
    }
}

@media (max-width: 360px) {
    .countdown-grid {
        grid-template-columns: repeat(4, minmax(48px, 1fr));
        gap: 0.5rem;
    }

    .countdown-unit span {
        font-size: 0.6rem;
        line-height: 1.1;
        white-space: normal;
        word-break: break-word;
    }
}

.event-datetime {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    margin-bottom: 1rem;
}

.event-datetime > div {
    line-height: 1.25;
}

body.simple .event-datetime > div {
    line-height: 1.3 !important;
}

.section h2 + .event-datetime {
    margin-top: -0.75rem;
}

.event-datetime {
    margin-bottom: 0.75rem;
}

.event-datetime > div {
    margin: 0;
}

body.simple .section h2 + .event-datetime {
    margin-top: -0.5rem !important;
}

body.simple .event-datetime {
    margin-bottom: 1rem !important;
}
