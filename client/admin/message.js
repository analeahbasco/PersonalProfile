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
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    document.getElementById('totalCount').innerText = `Total: ${items.length}`;
    
    if (items.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>No messages in your inbox.</p></div>`;
        return;
    }
    
    container.innerHTML = items.map((msg, index) => `
        <div class="inbox-card" onclick="viewMessageDetail(${index}, ${JSON.stringify(msg).replace(/"/g, '&quot;')})">
            <div class="avatar-circle">${msg.name ? msg.name.charAt(0).toUpperCase() : 'U'}</div>
            <div class="inbox-card-meta">
                <h4>${escapeHtml(msg.name)}</h4>
                <p class="subject-line">${escapeHtml(msg.subject || 'No Subject')}</p>
                <span class="time-stamp">${new Date(msg.created_at || Date.now()).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');
}

// Global active view injector
window.viewMessageDetail = function(index, msg) {
    const activeView = document.getElementById('activeMessageView');
    if(!activeView) return;
    
    activeView.innerHTML = `
        <div class="message-view-header">
            <h2>${escapeHtml(msg.subject || 'No Subject')}</h2>
            <div class="sender-info">
                <strong>From:</strong> ${escapeHtml(msg.name)} <span>&lt;${escapeHtml(msg._replyto || msg.email)}&gt;</span>
            </div>
        </div>
        <div class="message-view-body">
            <p>${escapeHtml(msg.message)}</p>
        </div>
    `;
};

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
