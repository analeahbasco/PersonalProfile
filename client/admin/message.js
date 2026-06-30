const API_URL = '/api/contact';
const messageContainer = document.getElementById('messageContainer');

document.addEventListener('DOMContentLoaded', fetchMessages);

async function fetchMessages() {
    try {
        const res = await fetch(API_URL, { credentials: 'same-origin' });
        const result = await res.json();
        if (result.success) {
            renderMessages(result.data);
        }
    } catch (err) {
        messageContainer.innerHTML = '<p>Error loading messages.</p>';
    }
}

function renderMessages(items) {
    document.getElementById('totalCount').innerText = `Total: ${items.length} messages`;

    if (items.length === 0) {
        messageContainer.innerHTML = `<div class="empty-state"><h3>No messages yet.</h3></div>`;
        return;
    }

    messageContainer.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'message-card';
        const readableDate = new Date(item.created_at).toLocaleString();

        card.innerHTML = `
            <div class="message-meta">
                <strong>${escapeHtml(item.name)}</strong>
                <span class="message-date">${readableDate}</span>
            </div>
            <p class="message-email">${escapeHtml(item.email)}${item.subject ? ' &middot; ' + escapeHtml(item.subject) : ''}</p>
            <p class="message-body">${escapeHtml(item.message)}</p>
            <div class="card-buttons">
                <a class="edit-btn" href="mailto:${encodeURIComponent(item.email)}">Reply</a>
                <button class="delete-btn" onclick="deleteMessage('${item.id}')">Delete</button>
            </div>`;
        messageContainer.appendChild(card);
    });
}

async function deleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'same-origin' });
    if (res.ok) fetchMessages();
}
window.deleteMessage = deleteMessage;

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
}
