document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. Mobile Hamburger Menu Toggle
       ========================================= */
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        document.querySelectorAll(".nav-links li a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }

    /* =========================================
       2. Scroll Reveal Intersection Observer
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-scale');

    const revealOptions = {
        threshold: 0.10, // Activates earlier for long structural panels
        rootMargin: "0px 0px -20px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
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

    /* =========================================
       4. Email Modal Popup Engine (Fixed & Unified)
       ========================================= */
    const emailTrigger = document.getElementById('emailTrigger');
    const chatModal = document.getElementById('chatModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Safe Check: Ensures errors don't throw if elements are missing on different pages
    if (emailTrigger && chatModal && closeModalBtn) {

        // Display form window when clicking "Email Me"
        emailTrigger.addEventListener('click', function (event) {
            event.preventDefault(); // Blocks the browser page jump behavior
            chatModal.classList.add('is-active');
        });

        // Close window when clicking the 'X' button
        closeModalBtn.addEventListener('click', function () {
            chatModal.classList.remove('is-active');
        });

        // Close window if user clicks outside of the active form box background wrapper
        window.addEventListener('click', function (event) {
            if (event.target === chatModal) {
                chatModal.classList.remove('is-active');
            }
        });
    }
});