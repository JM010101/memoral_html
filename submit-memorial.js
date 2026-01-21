// Public Memorial Submission Form JavaScript

let selectedPhotos = [];

// Compress image before adding to array
function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Max dimensions (reduce file size significantly)
            let maxWidth = 1200;
            let maxHeight = 1200;
            let width = img.width;
            let height = img.height;
            
            // Calculate new dimensions maintaining aspect ratio
            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height;
                    height = maxHeight;
                }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to JPEG with 0.8 quality (good balance of quality/size)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            callback(compressedDataUrl);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

document.getElementById('photoInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    if (selectedPhotos.length + files.length > 5) {
        alert('Maximum 5 photos allowed');
        return;
    }
    
    let processedCount = 0;
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum 5MB per photo.`);
            return;
        }
        
        compressImage(file, (compressedDataUrl) => {
            selectedPhotos.push({
                file: file,
                dataUrl: compressedDataUrl
            });
            processedCount++;
            if (processedCount === files.length) {
                displayPhotos();
            }
        });
    });
    
    e.target.value = ''; // Reset input
});

function displayPhotos() {
    const container = document.getElementById('photoPreview');
    container.innerHTML = selectedPhotos.map((photo, index) => `
        <div class="photo-preview-item">
            <img src="${photo.dataUrl}" alt="Photo ${index + 1}">
            ${index === 0 ? '<span class="primary-badge">PRIMARY</span>' : '<button type="button" class="set-primary-btn" onclick="setPrimary(' + index + ')">Set as Primary</button>'}
            <button type="button" class="remove-photo-btn" onclick="removePhoto(${index})">×</button>
        </div>
    `).join('');
}

function setPrimary(index) {
    // Move selected photo to the front of the array
    const photo = selectedPhotos.splice(index, 1)[0];
    selectedPhotos.unshift(photo);
    displayPhotos();
}

function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    displayPhotos();
}

document.getElementById('submissionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Verify reCAPTCHA
    const recaptchaResponse = grecaptcha.getResponse();
    if (!recaptchaResponse) {
        messageDiv.innerHTML = '<p class="error-message">❌ Please complete the reCAPTCHA verification</p>';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    try {
        // Collect form data
        const submissionData = {
            submitterName: document.getElementById('yourName').value.trim(),
            submitterEmail: document.getElementById('yourEmail').value.trim(),
            name: document.getElementById('fallenGatorName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            birthYear: parseInt(document.getElementById('birthYear').value),
            deathYear: parseInt(document.getElementById('deathYear').value),
            grade12Year: document.getElementById('grade12Year').value ? parseInt(document.getElementById('grade12Year').value) : null,
            isFaculty: document.getElementById('isFaculty').checked,
            tribute: document.getElementById('tribute').value.trim(),
            photos: selectedPhotos.map(p => p.dataUrl),
            recaptchaToken: recaptchaResponse
        };
        
        submitBtn.textContent = 'Uploading photos...';
        
        // Submit to API
        const response = await fetch('/api/memorial-submissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'submit',
                ...submissionData
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Show success message
            submitBtn.textContent = '✅ Submitted';
            submitBtn.disabled = true;
            messageDiv.innerHTML = `
                <div class="success-message" style="padding: 1.5rem; text-align: center; background: #d1fae5; border-radius: 8px;">
                    <h3 style="color: #10b981; margin-bottom: 0.5rem;">✅ Memorial Submitted Successfully!</h3>
                    <p style="margin-bottom: 0.5rem;"><strong>Submission ID:</strong> ${result.memorialId}</p>
                    <p style="font-size: 0.95rem;">Your memorial will be reviewed and published within 24-48 hours.</p>
                    <p style="font-size: 0.95rem; margin-top: 0.5rem;">You'll receive an email confirmation at <strong>${submissionData.submitterEmail}</strong></p>
                </div>
            `;
            
            // Disable form inputs
            document.querySelectorAll('#submissionForm input, #submissionForm textarea, #submissionForm button[type="submit"]').forEach(el => {
                el.disabled = true;
            });
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } else {
            throw new Error(result.error || 'Failed to submit memorial');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        messageDiv.innerHTML = `<p class="error-message">❌ Error: ${error.message}</p>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Memorial';
        grecaptcha.reset();
    }
});
