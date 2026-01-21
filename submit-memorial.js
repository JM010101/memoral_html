// Public Memorial Submission Form JavaScript

let selectedPhotos = [];

document.getElementById('photoInput').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    
    if (selectedPhotos.length + files.length > 5) {
        alert('Maximum 5 photos allowed');
        return;
    }
    
    files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum 5MB per photo.`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedPhotos.push({
                file: file,
                dataUrl: e.target.result
            });
            displayPhotos();
        };
        reader.readAsDataURL(file);
    });
    
    e.target.value = ''; // Reset input
});

function displayPhotos() {
    const container = document.getElementById('photoPreview');
    container.innerHTML = selectedPhotos.map((photo, index) => `
        <div class="photo-preview-item">
            <img src="${photo.dataUrl}" alt="Photo ${index + 1}">
            <button type="button" class="remove-photo-btn" onclick="removePhoto(${index})">×</button>
        </div>
    `).join('');
}

function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    displayPhotos();
}

document.getElementById('submissionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageDiv = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    // Validate photos
    if (selectedPhotos.length === 0) {
        messageDiv.innerHTML = '<p class="error-message">❌ Please add at least 1 photo</p>';
        return;
    }
    
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
            // Redirect to Stripe payment
            submitBtn.textContent = 'Redirecting to payment...';
            messageDiv.innerHTML = '<p class="success-message">✅ Submission received! Redirecting to payment...</p>';
            
            // Create Stripe payment link with memorial ID
            const paymentUrl = `https://buy.stripe.com/test_payment_link?client_reference_id=${result.memorialId}`;
            
            // Show success message with payment instructions
            messageDiv.innerHTML = `
                <div class="success-message" style="padding: 2rem; text-align: center;">
                    <h3 style="color: #10b981; margin-bottom: 1rem;">✅ Memorial Submitted Successfully!</h3>
                    <p style="margin-bottom: 1rem;">Your memorial submission has been received.</p>
                    <p style="margin-bottom: 1.5rem;"><strong>Submission ID:</strong> ${result.memorialId}</p>
                    <p style="margin-bottom: 1.5rem;">Please complete payment to finalize your submission.<br>
                    <strong>Select quantity of $2 donations to reach $50 total</strong></p>
                    <a href="https://buy.stripe.com/4gM3cvcGo9Dn1hYbEieIw0c" 
                       target="_blank"
                       class="btn-primary" 
                       style="display: inline-block; padding: 1rem 2rem; text-decoration: none; font-size: 1.1rem;">
                        💳 Complete Payment (Select qty: 25 for $50)
                    </a>
                    <p style="margin-top: 1.5rem; font-size: 0.9rem; color: var(--text-light);">
                        After payment, your memorial will be reviewed and published within 24-48 hours.<br>
                        You'll receive an email confirmation at <strong>${submissionData.submitterEmail}</strong>
                    </p>
                </div>
            `;
            
            // Hide form
            document.getElementById('submissionForm').style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } else {
            throw new Error(result.error || 'Failed to submit memorial');
        }
        
    } catch (error) {
        console.error('Submission error:', error);
        messageDiv.innerHTML = `<p class="error-message">❌ Error: ${error.message}</p>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Continue to Payment ($50)';
        grecaptcha.reset();
    }
});
