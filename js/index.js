// Main site logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('Main site loaded');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    const contactContainer = document.getElementById('contact-container');
    if (contactContainer) {
        const u = "rainierps8";
        const d = "gmail.com";
        const email = `${u}@${d}`;

        const link = document.createElement('a');
        link.href = "javascript:void(0)";
        link.className = "secondary-btn";
        link.style.display = "inline-flex";
        link.style.alignItems = "center";
        link.style.gap = "0.5rem";
        link.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Email Developer
        `;

        link.addEventListener('click', () => {
            window.location.href = `mailto:${email}?subject=Bug Report/Contribution - Invitation Template`;
        });

        contactContainer.appendChild(link);
    }

    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    const minScrollableHeight = 600;
    if (document.body.scrollHeight - window.innerHeight < minScrollableHeight) {
        backToTopBtn.style.display = 'none';
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lastScrollY = window.scrollY;
    let lastTimestamp = performance.now();

    window.addEventListener('scroll', () => {
        const now = performance.now();
        const deltaY = Math.abs(window.scrollY - lastScrollY);
        const deltaTime = now - lastTimestamp;

        const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

        if (window.scrollY > 700) {
            backToTopBtn.classList.add('visible');

            if (!prefersReducedMotion) {
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
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
    });

    fetch('https://raw.githubusercontent.com/Rainier-PS/Invitation-Template/refs/heads/main/data/demos.json')
        .then(res => {
            if (!res.ok) throw new Error("Failed to load demos JSON");
            return res.json();
        })
        .then(eventDemos => {
            const track = document.querySelector(".demo-track");

            eventDemos.forEach(ev => {
                const slide = document.createElement("a");
                slide.className = "demo-slide";
                slide.href = ev.url;
                slide.target = "_blank";
                slide.rel = "noopener";
                slide.innerHTML = `
            <img src="${ev.thumbnail}" alt="${ev.title} thumbnail">
            <h3>${ev.title}</h3>
            <a href="${ev.url}" class="primary-btn demo-btn" target="_blank" rel="noopener">View Demo</a>
        `;
                track.appendChild(slide);
            });

            const slides = document.querySelectorAll(".demo-slide");
            slides.forEach(slide => {
                const clone = slide.cloneNode(true);
                track.appendChild(clone);
            });

            let maxHeight = 0;
            slides.forEach(slide => {
                const height = slide.offsetHeight;
                if (height > maxHeight) maxHeight = height;
            });
            slides.forEach(slide => slide.style.height = `${maxHeight}px`);
            document.querySelectorAll(".demo-slide").forEach(slide => slide.style.height = `${maxHeight}px`);

            let scrollSpeed = prefersReducedMotion
                ? 0
                : (window.innerWidth <= 768 ? 0.4 : 0.25);

            let position = 0;

            function animateLoop() {
                position += scrollSpeed;

                if (position >= track.scrollWidth / 2) {
                    position = 0;
                }

                track.style.transform = `translateX(-${position}px)`;
                requestAnimationFrame(animateLoop);
            }

            window.addEventListener('resize', () => {
                scrollSpeed = prefersReducedMotion
                    ? 0
                    : (window.innerWidth <= 768 ? 0.4 : 0.25);
            });

            animateLoop();
        })
        .catch(err => {
            console.error("Error loading demos:", err);
        });

});
