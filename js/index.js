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

    // Email Obfuscation for Bot Protection
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

    const eventDemos = [
        {
            title: "[Event Title]",
            subtitle: "Join us for a [Event Type] celebration",
            date: "January 1, 2000",
            author: "[Name]]",
            url: "https://rainier-ps.github.io/Invitation-Template/Demo-1/invite-1.html"
        },
        {
            title: "404: Sleep Not Found",
            subtitle: "An Extremely Serious Coding Party",
            date: "April 1, 2026",
            author: "Sleep-Deprived Developers",
            url: "https://rainier-ps.github.io/Invitation-Template/Demo-2/invite-2.html"
        },
        {
            title: "Emma & Liam's Wedding",
            subtitle: "A Celebration of Love & Laughter",
            date: "June 20, 2026",
            author: "Linus Kern",
            url: "https://rainier-ps.github.io/Invitation-Template/Demo-3/invite-3.html"
        },
        {
            title: "Alex's 18th Birthday Bash",
            subtitle: "Cake, Games & Epic Fun!",
            date: "July 10, 2026",
            author: "Max Heapford",
            url: "https://rainier-ps.github.io/Invitation-Template/Demo-4/invite-4.html"
        },
        {
            title: "Launch Day 2026",
            subtitle: "Innovation, Networking & Celebration",
            date: "October 5, 2026",
            author: "Elliot Stackman",
            url: "https://rainier-ps.github.io/Invitation-Template/Demo-5/invite-5.html"
        },
        {
            title: "Ultimate eSports Showdown 2026",
            subtitle: "Gaming, Tournaments & High Scores",
            date: "November 14, 2026",
            author: "Victor Node",
            url: "https://rainier-ps.github.io/Invitation-Template/Demo-6/invite-6.html"
        }
    ];

    const track = document.querySelector(".carousel-track");

    // Populate slides
    eventDemos.forEach(ev => {
        const slide = document.createElement("div");
        slide.className = "carousel-slide";
        slide.innerHTML = `
            <h3>${ev.title}</h3>
            <h4>${ev.subtitle}</h4>
            <p><strong>Date:</strong> ${ev.date}</p>
            <p><strong>Author:</strong> ${ev.author}</p>
            <a href="${ev.url}" class="primary-btn" target="_blank" rel="noopener">View Demo</a>
        `;
        track.appendChild(slide);
    });

    let currentIndex = 0;
    const slides = document.querySelectorAll(".carousel-slide");
    const totalSlides = slides.length;

    // Buttons
    document.querySelector(".carousel-btn.next").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    });
    document.querySelector(".carousel-btn.prev").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    // Auto-rotate every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }, 5000);
});
