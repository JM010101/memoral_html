// Memorial Website JavaScript - Supabase Version (Instant Updates!)

const SUPABASE_URL = 'https://sexokiygxgvodfhjncbt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_xhMPLBaoblIflXwm4Atltw_WPMD30H9';

let supabase;
let memorialsData = [];

// Initialize Supabase client
function initSupabase() {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Load memorials data from Supabase
async function loadMemorialsData() {
    try {
        const { data, error } = await supabase
            .from('memorials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match existing format
        memorialsData = data.map(memorial => ({
            id: memorial.id,
            name: memorial.name,
            birthDate: memorial.birth_date,
            deathDate: memorial.death_date,
            tribute: memorial.tribute,
            photos: memorial.photos || []
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
        initSupabase();
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

    // Comments section
    html += '<div class="comments-section">';
    html += '<h2>💬 Comments</h2>';
    html += '<div id="commentsContainer">Loading comments...</div>';
    html += '<div class="comment-form-container">';
    html += '<h3>Leave a Comment</h3>';
    html += '<form id="commentForm" class="comment-form">';
    html += '<div class="form-group">';
    html += '<label for="commenterName">Your Name *</label>';
    html += '<input type="text" id="commenterName" required maxlength="100">';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label for="commenterEmail">Email (optional, will not be displayed)</label>';
    html += '<input type="email" id="commenterEmail" maxlength="100">';
    html += '</div>';
    html += '<div class="form-group">';
    html += '<label for="commentText">Comment *</label>';
    html += '<textarea id="commentText" required maxlength="1000" rows="4"></textarea>';
    html += '</div>';
    html += '<button type="submit" class="btn btn-primary">Submit Comment</button>';
    html += '<div id="commentFormMessage"></div>';
    html += '</form>';
    html += '</div>';
    html += '</div>';

    html += '<div class="back-button-container">';
    html += '<a href="memorials.html" class="btn">← Back to All Memorials</a>';
    html += '</div>';
    html += '</div>';

    container.innerHTML = html;

    // Setup photo gallery lightbox
    if (memorial.photos && memorial.photos.length > 0) {
        setupPhotoGallery(memorial.photos);
    }

    // Load and display comments
    loadComments(memorialId);

    // Setup comment form submission
    setupCommentForm(memorialId);
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

    function showImage(index) {
        currentIndex = index;
        const photo = photos[index];
        const photoUrl = typeof photo === 'string' ? photo : photo.url;
        const photoAlt = typeof photo === 'string' ? `Photo ${index + 1}` : photo.alt;
        
        lightboxImage.src = photoUrl;
        lightboxImage.alt = photoAlt;
        lightboxCaption.textContent = `${index + 1} / ${photos.length} - ${photoAlt}`;
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function hideImage() {
        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % photos.length;
        showImage(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        showImage(currentIndex);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => showImage(index));
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showImage(index);
            }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
    });

    lightboxClose.addEventListener('click', hideImage);
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            hideImage();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') hideImage();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        }
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearButton');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput) return;

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === '') {
            loadAllMemorials();
            if (searchResults) searchResults.textContent = '';
            return;
        }

        const filtered = memorialsData.filter(memorial => {
            const nameMatch = memorial.name.toLowerCase().includes(query);
            const tributeMatch = memorial.tribute && memorial.tribute.toLowerCase().includes(query);
            return nameMatch || tributeMatch;
        });

        loadAllMemorials(filtered);
        
        if (searchResults) {
            if (filtered.length === 0) {
                searchResults.textContent = 'No memorials found';
            } else {
                searchResults.textContent = `Found ${filtered.length} memorial${filtered.length === 1 ? '' : 's'}`;
            }
        }
    }

    searchInput.addEventListener('input', performSearch);

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            performSearch();
            searchInput.focus();
        });
    }
}

// Load and display comments for a memorial
async function loadComments(memorialId) {
    const container = document.getElementById('commentsContainer');
    if (!container) return;

    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('memorial_id', memorialId)
            .eq('status', 'approved')
            .order('approved_at', { ascending: false });

        if (error) throw error;

        const approvedComments = data || [];

        if (approvedComments.length === 0) {
            container.innerHTML = '<p class="no-comments">No comments yet. Be the first to share your memories!</p>';
            return;
        }

        let html = '<div class="comments-list">';
        approvedComments.forEach(comment => {
            const date = new Date(comment.approved_at || comment.created_at);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            html += '<div class="comment-item">';
            html += `<div class="comment-header">`;
            html += `<strong class="comment-author">${escapeHtml(comment.name)}</strong>`;
            html += `<span class="comment-date">${formattedDate}</span>`;
            html += '</div>';
            html += `<div class="comment-text">${escapeHtml(comment.comment)}</div>`;
            html += '</div>';
        });
        html += '</div>';

        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading comments:', error);
        container.innerHTML = '<p class="error-message">Unable to load comments.</p>';
    }
}

// Setup comment form submission
function setupCommentForm(memorialId) {
    const form = document.getElementById('commentForm');
    const messageDiv = document.getElementById('commentFormMessage');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('commenterName').value.trim();
        const email = document.getElementById('commenterEmail').value.trim();
        const comment = document.getElementById('commentText').value.trim();

        if (!name || !comment) {
            messageDiv.innerHTML = '<p class="error-message">Please fill in all required fields.</p>';
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/supabase-submit-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memorialId,
                    name,
                    email,
                    comment
                })
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.innerHTML = '<p class="success-message">✅ Thank you! Your comment has been submitted and will appear after approval.</p>';
                form.reset();
            } else {
                throw new Error(result.error || 'Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
            messageDiv.innerHTML = '<p class="error-message">❌ Failed to submit comment. Please try again.</p>';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Comment';
        }
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
