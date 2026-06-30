const API_URL = '/api/activities';

const activityContainer = document.getElementById('activityContainer');
const activityModal = document.getElementById('activityModal');
const addActivityBtn = document.getElementById('addActivityBtn');
const closeModal = document.getElementById('closeModal');
const activityForm = document.getElementById('activityForm');

let isEditing = false;
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchActivities();
    setupEventListeners();
});

function setupEventListeners() {
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', () => {
            isEditing = false;
            editId = null;
            if (activityForm) activityForm.reset();
            document.getElementById('modalTitle').innerText = 'Add Activity';
            activityModal.classList.add('open');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => activityModal.classList.remove('open'));
    }

    window.addEventListener('click', (e) => {
        if (e.target === activityModal) activityModal.classList.remove('open');
    });

    if (activityForm) {
        activityForm.addEventListener('submit', handleFormSubmit);
    }
}

async function fetchActivities() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            renderActivities(result.data);
        }
    } catch (error) {
        console.error('Error fetching activities:', error);
    }
}

function renderActivities(items) {
    if (!activityContainer) return;
    document.getElementById('totalCount').innerText = `Total: ${items.length} activities`;
    activityContainer.innerHTML = '';

    if (items.length === 0) {
        activityContainer.innerHTML = `<div class="empty-state"><h3>No activities added yet.</h3></div>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'certificate-card';

        card.innerHTML = `
            <div class="card-content">
                <h2>${escapeHtml(item.title)}</h2>
                <p class="issuer-text">${escapeHtml(item.label || '')} &middot; ${item.status === 'active' ? 'Active' : 'Upcoming'}</p>
                <p class="description-text">${escapeHtml(item.description || '')}</p>
                <div class="card-buttons">
                    <button class="edit-btn" onclick='openEditModal(${safeJsonAttr(item)})'>Edit</button>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            </div>`;
        activityContainer.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const payload = {
        label: document.getElementById('label').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        status: document.getElementById('status').value,
        link_url: document.getElementById('link_url').value,
        display_order: Number(document.getElementById('display_order').value) || 0,
    };

    const url = isEditing ? `${API_URL}/${editId}` : `${API_URL}/`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (response.ok) {
        activityModal.classList.remove('open');
        activityForm.reset();
        fetchActivities();
    }
}

async function deleteItem(id) {
    if (confirm('Delete this activity?')) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) fetchActivities();
    }
}

window.openEditModal = function (item) {
    isEditing = true;
    editId = item.id;
    document.getElementById('modalTitle').innerText = 'Edit Activity';
    document.getElementById('label').value = item.label || '';
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description || '';
    document.getElementById('status').value = item.status || 'pending';
    document.getElementById('link_url').value = item.link_url || '';
    document.getElementById('display_order').value = item.display_order || 0;
    activityModal.classList.add('open');
};

function escapeHtml(str) {
    return str ? str.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
}

function safeJsonAttr(obj) {
    return JSON.stringify(obj).replace(/'/g, "&#39;").replace(/</g, "&lt;");
}
