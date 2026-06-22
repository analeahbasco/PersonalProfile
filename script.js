document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================
       1. Mobile Hamburger Menu Toggle
       ========================================= */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Automatically collapse mobile tray on link interaction
    document.querySelectorAll(".nav-links li a").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });

    /* =========================================
       2. Scroll Reveal Intersection Observer
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale');

    const revealOptions = {
        threshold: 0.12, 
        rootMargin: "0px 0px -40px 0px" 
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    /* =========================================
       3. Magnetic Hover Effect (Hero Button)
       ========================================= */
    const magneticWrap = document.querySelector('.magnetic-wrap');
    const magneticBtn = document.querySelector('.magnetic-btn');

    if (magneticWrap && magneticBtn) {
        magneticWrap.addEventListener('mousemove', (e) => {
            const position = magneticWrap.getBoundingClientRect();
            const x = e.clientX - position.left - position.width / 2;
            const y = e.clientY - position.top - position.height / 2;
            
            magneticBtn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        magneticWrap.addEventListener('mouseleave', () => {
            magneticBtn.style.transform = 'translate(0px, 0px)';
            magneticBtn.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.3, 1)';
        });
        
        magneticWrap.addEventListener('mouseenter', () => {
            magneticBtn.style.transition = 'none';
        });
    }
});