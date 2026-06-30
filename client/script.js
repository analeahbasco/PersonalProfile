/* ===================================================
   PUBLIC PORTFOLIO PAGE CONTROLLER
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    setupScrollReveal();
    setupMobileNav();
    loadGallery();
    loadCertificates();
});

/* --- Scroll-triggered fade/slide-in animations --- */
function setupScrollReveal() {
    const targets = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-scale');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(el => observer.observe(el));
}

/* --- Hamburger menu for mobile --- */
function setupMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/* --- Project Gallery, pulled from Neon + Cloudinary via /api/gallery --- */
async function loadGallery() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    try {
        const res = await fetch('/api/gallery');
        const result = await res.json();

        if (!result.success || !result.data.length) {
            container.innerHTML = `<p class="empty-note">No gallery items yet — check back soon.</p>`;
            return;
        }

        container.innerHTML = result.data.map(item => `
            <div class="gallery-item reveal-up">
                <div class="image-frame">
                    <img src="${item.image_url}" alt="${escapeHtml(item.title)}" loading="lazy">
                </div>
                <div class="gallery-info">
                    <h4>${escapeHtml(item.title)}</h4>
                    <p>${escapeHtml(item.description || '')}</p>
                </div>
            </div>
        `).join('');

        // Newly injected elements need their own reveal observer
        setupScrollReveal();
    } catch (err) {
        container.innerHTML = `<p class="empty-note">Could not load the gallery right now.</p>`;
    }
}

/* --- Certificates, pulled from Neon + Cloudinary via /api/certificates --- */
async function loadCertificates() {
    const container = document.getElementById('certificates-container');
    if (!container) return;

    try {
        const res = await fetch('/api/certificates');
        const result = await res.json();

        if (!result.success || !result.data.length) {
            container.innerHTML = `<p class="empty-note">No certificates added yet.</p>`;
            return;
        }

        container.innerHTML = result.data.map(item => {
            const readableDate = item.date_earned ? new Date(item.date_earned).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : '';
            return `
                <div class="certificate-row reveal-up">
                    <div class="cert-header">
                        <span class="cert-tag">${escapeHtml(item.issuer || '')}</span>
                        <h4>${escapeHtml(item.title)}</h4>
                        ${readableDate ? `<span class="cert-tag">${readableDate}</span>` : ''}
                    </div>
                    <p class="cert-desc">${escapeHtml(item.description || '')}</p>
                </div>`;
        }).join('');

        setupScrollReveal();
    } catch (err) {
        container.innerHTML = `<p class="empty-note">Could not load certificates right now.</p>`;
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
}
