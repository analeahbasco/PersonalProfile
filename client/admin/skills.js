const API_URL = '/api/skills';

const skillContainer = document.getElementById('skillContainer');
const skillModal = document.getElementById('skillModal');
const addSkillBtn = document.getElementById('addSkillBtn');
const closeModal = document.getElementById('closeModal');
const skillForm = document.getElementById('skillForm');

let isEditing = false;
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchSkills();
    setupEventListeners();
});

function setupEventListeners() {
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            isEditing = false;
            editId = null;
            if (skillForm) skillForm.reset();
            document.getElementById('modalTitle').innerText = 'Add Skill';
            skillModal.classList.add('open');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => skillModal.classList.remove('open'));
    }

    window.addEventListener('click', (e) => {
        if (e.target === skillModal) skillModal.classList.remove('open');
    });

    if (skillForm) {
        skillForm.addEventListener('submit', handleFormSubmit);
    }
}

async function fetchSkills() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            renderSkills(result.data);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}

function renderSkills(items) {
    if (!skillContainer) return;
    document.getElementById('totalCount').innerText = `Total: ${items.length} skills`;
    skillContainer.innerHTML = '';

    if (items.length === 0) {
        skillContainer.innerHTML = `<div class="empty-state"><h3>No skills added yet.</h3></div>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'certificate-card';

        card.innerHTML = `
            <div class="card-content">
                <h2>${escapeHtml(item.name)}</h2>
                <p class="issuer-text">${escapeHtml(item.level || '')}</p>
                <div class="card-buttons">
                    <button class="edit-btn" onclick="openEditModal('${item.id}', '${escapeHtml(item.name)}', '${escapeHtml(item.level)}', ${item.display_order || 0})">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            </div>`;
        skillContainer.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('name').value,
        level: document.getElementById('level').value,
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
        skillModal.classList.remove('open');
        skillForm.reset();
        fetchSkills();
    }
}

async function deleteItem(id) {
    if (confirm('Delete this skill?')) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) fetchSkills();
    }
}

window.openEditModal = function (id, name, level, displayOrder) {
    isEditing = true;
    editId = id;
    document.getElementById('modalTitle').innerText = 'Edit Skill';
    document.getElementById('name').value = name;
    document.getElementById('level').value = level;
    document.getElementById('display_order').value = displayOrder;
    skillModal.classList.add('open');
};

function escapeHtml(str) {
    return str ? str.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
}
