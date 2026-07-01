// Included first on every protected /admin/* page. Confirms the session
// cookie is still valid even if the static file was loaded directly,
// and bounces to the login screen if not.
(async function authGuard() {
    try {
        const res = await fetch('/api/admin/me', { credentials: 'same-origin' });
        if (!res.ok) throw new Error('unauthenticated');
    } catch (err) {
        window.location.href = '/admin/login';
    }
    document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.toggle('collapsed');
            } else {
                sidebar.classList.toggle('open');
            }
        });
    }
});
})();
