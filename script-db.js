// Memorial Website JavaScript - Database Version
// Uses Supabase for real-time data

// Supabase configuration
const SUPABASE_URL = 'https://sexoklyqxgvodfhjncbt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_xhMPLBaobllfIXwm4Altw_WPMD30H9';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let memorialsData = [];

// Load memorials data from Supabase
async function loadMemorialsData() {
    try {
        const { data, error } = await supabase
            .from('memorials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Convert database format to match existing code
        memorialsData = data.map(memorial => ({
            id: memorial.id,
            name: memorial.name,
            birthDate: memorial.birth_date,
            deathDate: memorial.death_date,
            tribute: memorial.tribute,
            photos: memorial.photos
        }));
        
        return memorialsData;
    } catch (error) {
        console.error('Error loading memorials data:', error);
        showErrorMessage('Unable to load memorial data. Please try refreshing the page.');
        return [];
    }
}

// Show error message to user
function showErrorMessage(message) {
    const containers = [
        document.getElementById('featuredMemorials'),
        document.getElementById('memorialsContainer'),
        document.getElementById('memorialContent')
    ];
    
    containers.forEach(container => {
        if (container) {
            container.innerHTML = `<div class="error-message" role="alert"><p>${message}</p></div>`;
        }
    });
}

// Initialize page based on current location
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadMemorialsData();

        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPage === 'index.html' || currentPage === '') {
            loadFeaturedMemorials();
        } else if (currentPage === 'memorials.html') {
            loadAllMemorials();
            setupSearch();
        } else if (currentPage === 'memorial.html') {
            loadMemorialPage();
        }
    } catch (error) {
        console.error('Error initializing page:', error);
        showErrorMessage('Error loading page. Please refresh.');
    }
});

// Load featured memorials for homepage (first 3)
function loadFeaturedMemorials() {
    const container = document.getElementById('featuredMemorials');
    if (!container) return;

    const featured = memorialsData.slice(0, 3);
    
    if (featured.length === 0) {
        container.innerHTML = '<p>No memorials to display yet.</p>';
        return;
    }

    container.innerHTML = featured.map(memorial => createMemorialCard(memorial)).join('');
}

// Load all memorials for memorials page
function loadAllMemorials() {
    const container = document.getElementById('memorialsContainer');
    if (!container) return;

    if (memorialsData.length === 0) {
        container.innerHTML = '<p>No memorials to display yet.</p>';
        return;
    }

    container.innerHTML = memorialsData.map(memorial => createMemorialCard(memorial)).join('');
}

// Create memorial card HTML
function createMemorialCard(memorial) {
    const photo = memorial.photos && memorial.photos[0] ? memorial.photos[0] : null;
    const photoUrl = photo ? (photo.url || photo) : 'images/placeholder.jpg';
    const photoAlt = photo && photo.alt ? photo.alt : `Memorial photo of ${memorial.name}`;
    
    return `
        <article class="memorial-card">
            <a href="memorial.html?id=${memorial.id}" class="memorial-link">
                <div class="memorial-image-container">
                    <img src="${escapeHtml(photoUrl)}" 
                         alt="${escapeHtml(photoAlt)}" 
                         class="memorial-image"
                         onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="memorial-info">
                    <h3 class="memorial-name">${escapeHtml(memorial.name)}</h3>
                    <p class="memorial-dates">
                        <time datetime="${memorial.birthDate}">${formatDate(memorial.birthDate)}</time>
                        -
                        <time datetime="${memorial.deathDate}">${formatDate(memorial.deathDate)}</time>
                    </p>
                    <p class="memorial-preview">${truncateText(memorial.tribute, 100)}</p>
                    <span class="memorial-cta" role="button">View Memorial</span>
                </div>
            </a>
        </article>
    `;
}

// Load individual memorial page
function loadMemorialPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const memorialId = urlParams.get('id');
    
    const container = document.getElementById('memorialContent');
    if (!container) return;

    if (!memorialId) {
        container.innerHTML = '<div class="error-message"><p>Memorial ID not found.</p></div>';
        return;
    }

    const memorial = memorialsData.find(m => m.id === memorialId);
    
    if (!memorial) {
        container.innerHTML = `
            <div class="error-message">
                <p>Memorial not found.</p>
                <a href="memorials.html" class="button">Back to All Memorials</a>
            </div>
        `;
        return;
    }

    // Update page title
    document.title = `${memorial.name} - In Loving Memory`;

    // Build photo gallery
    let galleryHtml = '';
    if (memorial.photos && memorial.photos.length > 0) {
        galleryHtml = `
            <section class="photo-gallery" role="region" aria-label="Memorial photos">
                <h2>Photos</h2>
                <div class="gallery-grid">
                    ${memorial.photos.map((photo, index) => {
                        const photoUrl = photo.url || photo;
                        const photoAlt = photo.alt || `Photo ${index + 1} of ${memorial.name}`;
                        return `
                            <button class="gallery-item" onclick="openLightbox(${index})" aria-label="View larger photo ${index + 1}">
                                <img src="${escapeHtml(photoUrl)}" 
                                     alt="${escapeHtml(photoAlt)}"
                                     onerror="this.src='images/placeholder.jpg'">
                            </button>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }

    // Build memorial page HTML
    const html = `
        <article class="memorial-detail">
            <header class="memorial-header">
                <h1>${escapeHtml(memorial.name)}</h1>
                <p class="memorial-dates-large">
                    <time datetime="${memorial.birthDate}">${formatDate(memorial.birthDate)}</time>
                    —
                    <time datetime="${memorial.deathDate}">${formatDate(memorial.deathDate)}</time>
                </p>
            </header>
            
            <section class="memorial-tribute">
                <h2 class="visually-hidden">Tribute</h2>
                ${memorial.tribute.split('\n\n').map(paragraph => 
                    `<p>${escapeHtml(paragraph)}</p>`
                ).join('')}
            </section>
            
            ${galleryHtml}
            
            <nav class="memorial-navigation" aria-label="Memorial navigation">
                <a href="memorials.html" class="button button-secondary">← Back to All Memorials</a>
            </nav>
        </article>
        
        <div id="lightbox" class="lightbox" onclick="closeLightbox()" role="dialog" aria-modal="true" aria-hidden="true">
            <button class="lightbox-close" onclick="closeLightbox()" aria-label="Close lightbox">×</button>
            <button class="lightbox-prev" onclick="event.stopPropagation(); prevPhoto()" aria-label="Previous photo">‹</button>
            <div class="lightbox-content">
                <img id="lightboxImage" src="" alt="">
                <p id="lightboxCaption"></p>
            </div>
            <button class="lightbox-next" onclick="event.stopPropagation(); nextPhoto()" aria-label="Next photo">›</button>
        </div>
    `;

    container.innerHTML = html;

    // Store photos for lightbox
    window.currentMemorialPhotos = memorial.photos || [];
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterMemorials(searchTerm);
    });
}

function filterMemorials(searchTerm) {
    const filtered = memorialsData.filter(memorial => 
        memorial.name.toLowerCase().includes(searchTerm) ||
        memorial.tribute.toLowerCase().includes(searchTerm)
    );

    const container = document.getElementById('memorialsContainer');
    if (!container) return;

    if (filtered.length === 0) {
        container.innerHTML = '<p>No memorials found matching your search.</p>';
        return;
    }

    container.innerHTML = filtered.map(memorial => createMemorialCard(memorial)).join('');
}

// Lightbox functionality
let currentPhotoIndex = 0;

function openLightbox(index) {
    currentPhotoIndex = index;
    const lightbox = document.getElementById('lightbox');
    const photo = window.currentMemorialPhotos[index];
    const photoUrl = photo.url || photo;
    const photoAlt = photo.alt || `Photo ${index + 1}`;
    
    document.getElementById('lightboxImage').src = photoUrl;
    document.getElementById('lightboxImage').alt = photoAlt;
    document.getElementById('lightboxCaption').textContent = photoAlt;
    
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    lightbox.focus();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % window.currentMemorialPhotos.length;
    openLightbox(currentPhotoIndex);
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + window.currentMemorialPhotos.length) % window.currentMemorialPhotos.length;
    openLightbox(currentPhotoIndex);
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.style.display !== 'flex') return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
});

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return escapeHtml(text);
    return escapeHtml(text.substring(0, maxLength)) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
