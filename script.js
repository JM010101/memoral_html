// Memorial Website JavaScript

let memorialsData = [];

// Load memorials data from JSON
async function loadMemorialsData() {
    try {
        const response = await fetch('data/memorials.json');
        memorialsData = await response.json();
        return memorialsData;
    } catch (error) {
        console.error('Error loading memorials data:', error);
        return [];
    }
}

// Initialize page based on current location
document.addEventListener('DOMContentLoaded', async () => {
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
});

// Load featured memorials on home page (shows first 6)
function loadFeaturedMemorials() {
    const container = document.getElementById('featuredMemorials');
    if (!container) return;

    const featured = memorialsData.slice(0, 6);
    container.innerHTML = '';

    if (featured.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No memorials available yet.</p>';
        return;
    }

    featured.forEach(memorial => {
        container.appendChild(createMemorialCard(memorial));
    });
}

// Load all memorials on memorials page
function loadAllMemorials(filteredData = null) {
    const container = document.getElementById('memorialsContainer');
    const noResults = document.getElementById('noResults');
    if (!container) return;

    const dataToShow = filteredData || memorialsData;
    container.innerHTML = '';

    if (dataToShow.length === 0) {
        container.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    container.style.display = 'grid';

    dataToShow.forEach(memorial => {
        container.appendChild(createMemorialCard(memorial));
    });
}

// Create memorial card element
function createMemorialCard(memorial) {
    const card = document.createElement('a');
    card.href = `memorial.html?id=${memorial.id}`;
    card.className = 'memorial-card';
    card.setAttribute('aria-label', `View memorial for ${memorial.name}`);

    const image = document.createElement('img');
    image.src = memorial.photos && memorial.photos.length > 0 
        ? memorial.photos[0] 
        : 'images/placeholder.jpg';
    image.alt = `${memorial.name} memorial photo`;
    image.className = 'memorial-card-image';
    image.onerror = function() {
        this.style.display = 'none';
    };

    const content = document.createElement('div');
    content.className = 'memorial-card-content';

    const title = document.createElement('h3');
    title.textContent = memorial.name;

    const dates = document.createElement('p');
    if (memorial.birthDate || memorial.deathDate) {
        dates.textContent = formatDates(memorial.birthDate, memorial.deathDate);
        dates.style.color = '#7f8c8d';
        dates.style.fontSize = '0.9rem';
        dates.style.marginBottom = '0.5rem';
    }

    const excerpt = document.createElement('p');
    excerpt.textContent = memorial.tribute ? 
        memorial.tribute.substring(0, 150) + (memorial.tribute.length > 150 ? '...' : '') : 
        '';

    content.appendChild(title);
    if (dates.textContent) content.appendChild(dates);
    content.appendChild(excerpt);

    card.appendChild(image);
    card.appendChild(content);

    return card;
}

// Format dates for display
function formatDates(birthDate, deathDate) {
    if (!birthDate && !deathDate) return '';
    const birth = birthDate ? new Date(birthDate).getFullYear() : '?';
    const death = deathDate ? new Date(deathDate).getFullYear() : 'Present';
    return `${birth} - ${death}`;
}

// Load individual memorial page
function loadMemorialPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const memorialId = urlParams.get('id');
    const container = document.getElementById('memorialContent');

    if (!memorialId || !container) {
        container.innerHTML = '<div class="no-results"><p>Memorial not found.</p><a href="memorials.html">← Back to Memorials</a></div>';
        return;
    }

    const memorial = memorialsData.find(m => m.id === memorialId);

    if (!memorial) {
        container.innerHTML = '<div class="no-results"><p>Memorial not found.</p><a href="memorials.html">← Back to Memorials</a></div>';
        return;
    }

    // Update page title
    document.title = `${memorial.name} - Memorial Website`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = `Memorial page for ${memorial.name}`;
    }

    // Build memorial page HTML
    let html = '<div class="memorial-header">';
    html += `<h1>${escapeHtml(memorial.name)}</h1>`;
    
    if (memorial.birthDate || memorial.deathDate) {
        html += `<div class="memorial-dates">${formatDates(memorial.birthDate, memorial.deathDate)}</div>`;
    }
    
    html += '</div>';

    if (memorial.tribute) {
        html += '<div class="memorial-tribute">';
        // Preserve line breaks in tribute text
        const tributeHtml = escapeHtml(memorial.tribute).replace(/\n/g, '<br>');
        html += `<p>${tributeHtml}</p>`;
        html += '</div>';
    }

    if (memorial.photos && memorial.photos.length > 0) {
        html += '<div class="photo-gallery">';
        html += '<h2>Photo Gallery</h2>';
        html += '<div class="gallery-grid">';
        
        memorial.photos.forEach((photo, index) => {
            html += `<div class="gallery-item" data-index="${index}">`;
            html += `<img src="${escapeHtml(photo)}" alt="Photo ${index + 1} of ${escapeHtml(memorial.name)}">`;
            html += '</div>';
        });
        
        html += '</div>';
        html += '</div>';
    }

    html += '<div style="text-align: center; margin-top: 2rem;">';
    html += '<a href="memorials.html" class="btn">← Back to All Memorials</a>';
    html += '</div>';

    container.innerHTML = html;

    // Setup photo gallery lightbox
    if (memorial.photos && memorial.photos.length > 0) {
        setupPhotoGallery(memorial.photos);
    }
}

// Setup photo gallery with lightbox
function setupPhotoGallery(photos) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentIndex = 0;

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            openLightbox(photos[currentIndex], currentIndex + 1, photos.length);
        });
    });

    function openLightbox(photoSrc, current, total) {
        lightboxImage.src = photoSrc;
        lightboxImage.alt = `Photo ${current} of ${total}`;
        lightboxCaption.textContent = `Photo ${current} of ${total}`;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        openLightbox(photos[currentIndex], currentIndex + 1, photos.length);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % photos.length;
        openLightbox(photos[currentIndex], currentIndex + 1, photos.length);
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'none') return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const clearButton = document.getElementById('clearButton');
    const searchResults = document.getElementById('searchResults');

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            loadAllMemorials();
            searchResults.textContent = '';
            return;
        }

        const filtered = memorialsData.filter(memorial => {
            const nameMatch = memorial.name.toLowerCase().includes(query);
            const tributeMatch = memorial.tribute && memorial.tribute.toLowerCase().includes(query);
            return nameMatch || tributeMatch;
        });

        loadAllMemorials(filtered);
        
        const count = filtered.length;
        searchResults.textContent = count === 1 
            ? '1 memorial found' 
            : `${count} memorials found`;
    }

    searchButton.addEventListener('click', performSearch);
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.textContent = '';
        loadAllMemorials();
        searchInput.focus();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}