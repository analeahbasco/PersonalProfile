const API_URL = '/api/gallery';

const galleryContainer = document.getElementById('galleryContainer');
const galleryModal = document.getElementById('galleryModal');
const addGalleryBtn = document.getElementById('addGalleryBtn');
const closeModal = document.getElementById('closeModal');
const galleryForm = document.getElementById('galleryForm');

let isEditing = false;
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchGallery();
    setupEventListeners();
});

function setupEventListeners() {
    if (addGalleryBtn) {
        addGalleryBtn.addEventListener('click', () => {
            isEditing = false;
            editId = null;
            if (galleryForm) galleryForm.reset();
            document.querySelector('.modal-content h2').innerText = 'Add Gallery Item';
            galleryModal.classList.add('open');
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => galleryModal.classList.remove('open'));
    }

    window.addEventListener('click', (e) => {
        if (e.target === galleryModal) galleryModal.classList.remove('open');
    });

    if (galleryForm) {
        galleryForm.addEventListener('submit', handleFormSubmit);
    }
}

async function fetchGallery() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
            renderGallery(result.data);
        }
    } catch (error) {
        console.error('Error fetching gallery data:', error);
    }
}

function renderGallery(items) {
    if (!galleryContainer) return;
    document.getElementById('totalCount').innerText = `Total: ${items.length} items`;
    galleryContainer.innerHTML = '';

    if (items.length === 0) {
        galleryContainer.innerHTML = `<div class="empty-state"><h3>No projects mapped yet</h3></div>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        const readableDate = item.date_completed ? new Date(item.date_completed).toLocaleDateString() : 'N/A';

        card.innerHTML = `
            <img src="${item.image_url || 'https://via.placeholder.com/400x200'}" alt="${item.title}">
            <div class="card-content">
                <h2>${item.title}</h2>
                <p class="category-text">${item.category}</p>
                <p class="description-text">${item.description}</p>
                <div class="card-buttons">
                    <button class="edit-btn" onclick="openEditModal('${item.id}', '${escapeHtml(item.title)}', '${escapeHtml(item.category)}', '${item.date_completed}', '${escapeHtml(item.description)}')">Edit</button>
                    <button class="delete-btn" onclick="deleteItem('${item.id}')">Delete</button>
                </div>
            </div>`;
        galleryContainer.appendChild(card);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('description', document.getElementById('description').value);

    const fileInput = document.getElementById('image');
    if (fileInput.files[0]) formData.append('image', fileInput.files[0]);

    const url = isEditing ? `${API_URL}/${editId}` : `${API_URL}/`;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, { method, body: formData });
    if (response.ok) {
        galleryModal.classList.remove('open');
        galleryForm.reset();
        fetchGallery();
    }
}

async function deleteItem(id) {
    if (confirm('Permanently remove this item?')) {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) fetchGallery();
    }
}

window.openEditModal = function (id, title, category, date, desc) {
    isEditing = true;
    editId = id;
    document.querySelector('.modal-content h2').innerText = 'Edit Gallery Item';
    document.getElementById('title').value = title;
    document.getElementById('category').value = category;
    document.getElementById('description').value = desc;
    galleryModal.classList.add('open');
};

function escapeHtml(str) {
    return str ? str.replace(/'/g, "&#39;").replace(/"/g, "&quot;") : '';
}