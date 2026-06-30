const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ username, password }),
        });
        const result = await res.json();

        if (result.success) {
            window.location.href = '/admin/dashboard';
        } else {
            loginError.textContent = result.message || 'Invalid credentials';
        }
    } catch (err) {
        loginError.textContent = 'Could not reach the server. Try again.';
    }
});
