// Memorial Website JavaScript

let memorialsData = [];

// Load memorials data from JSON
async function loadMemorialsData() {
    try {
        const response = await fetch('data/memorials.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        memorialsData = data;
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
        showErrorMessage('An error occurred while loading the page.');
    }
});

// Load featured memorials on home page (shows first 6)
function loadFeaturedMemorials() {
    const container = document.getElementById('featuredMemorials');
    if (!container) return;

    const featured = memorialsData.slice(0, 6);
    container.innerHTML = '';

    if (featured.length === 0) {
        container.innerHTML = '<p class="no-memorials-message">No memorials available yet.</p>';
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

    const content = document.createElement('div');
    content.className = 'memorial-card-content';

    const title = document.createElement('h3');
    title.textContent = memorial.name;

    const dates = document.createElement('p');
    if (memorial.birthDate || memorial.deathDate) {
        dates.textContent = formatDates(memorial.birthDate, memorial.deathDate);
        dates.className = 'memorial-card-dates';
    }

    const excerpt = document.createElement('p');
    excerpt.textContent = memorial.tribute ? 
        memorial.tribute.substring(0, 150) + (memorial.tribute.length > 150 ? '...' : '') : 
        '';

    content.appendChild(title);
    if (dates.textContent) content.appendChild(dates);
    content.appendChild(excerpt);

    // Only add image if photos exist
    if (memorial.photos && memorial.photos.length > 0) {
        const image = document.createElement('img');
        const photo = memorial.photos[0];
        image.src = typeof photo === 'string' ? photo : photo.url;
        image.alt = typeof photo === 'string' ? `${memorial.name} memorial photo` : photo.alt;
        image.className = 'memorial-card-image';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.onerror = function() {
            this.style.display = 'none';
            console.warn(`Failed to load image: ${this.src}`);
        };
        card.appendChild(image);
    }

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
    let html = '<section class="memorial-hero-section" style="background-image: url(\'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=400&fit=crop&q=80\');">';
    html += '<div class="memorial-hero-overlay"></div>';
    html += '<div class="memorial-hero-content">';
    html += `<h1>${escapeHtml(memorial.name)}</h1>`;
    
    if (memorial.birthDate || memorial.deathDate) {
        html += `<div class="memorial-dates">${formatDates(memorial.birthDate, memorial.deathDate)}</div>`;
    }
    
    html += '</div>';
    html += '</section>';
    
    html += '<div class="memorial-page-content">';
    html += '<div class="memorial-header">';
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
            const photoUrl = typeof photo === 'string' ? photo : photo.url;
            const photoAlt = typeof photo === 'string' ? `Photo ${index + 1} of ${escapeHtml(memorial.name)}` : escapeHtml(photo.alt);
            html += `<div class="gallery-item" data-index="${index}">`;
            html += `<img src="${escapeHtml(photoUrl)}" alt="${photoAlt}" loading="lazy" decoding="async">`;
            html += '</div>';
        });
        
        html += '</div>';
        html += '</div>';
    }

    html += '<div class="back-button-container">';
    html += '<a href="memorials.html" class="btn">← Back to All Memorials</a>';
    html += '</div>';
    html += '</div>'; // Close memorial-page-content

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

    function openLightbox(photo, current, total) {
        const photoUrl = typeof photo === 'string' ? photo : photo.url;
        const photoAlt = typeof photo === 'string' ? `Photo ${current} of ${total}` : photo.alt;
        lightboxImage.src = photoUrl;
        lightboxImage.alt = photoAlt;
        lightboxCaption.textContent = photoAlt;
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden', 'true');
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