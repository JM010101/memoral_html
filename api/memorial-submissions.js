// Consolidated API for public memorial submissions and management
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action } = req.body;

    // PUBLIC SUBMISSION
    if (action === 'submit') {
        return await handlePublicSubmission(req, res);
    }

    // ADMIN MANAGEMENT (approve/reject/bypass)
    if (action === 'approve' || action === 'reject' || action === 'bypass') {
        return await handleManageSubmission(req, res);
    }

    return res.status(400).json({ error: 'Invalid action' });
}

// Handle public memorial submission
async function handlePublicSubmission(req, res) {
    try {
        const { submitterName, submitterEmail, name, lastName, birthYear, deathYear, grade12Year, isFaculty, tribute, photos, recaptchaToken } = req.body;

        if (!submitterName || !submitterEmail || !name || !lastName || !birthYear || !deathYear || !tribute) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Verify reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ error: 'reCAPTCHA verification required' });
        }

        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
        
        const recaptchaResponse = await fetch(recaptchaVerifyUrl, { method: 'POST' });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        const memorialId = `${lastName.toLowerCase().replace(/[^a-z]/g, '')}-${name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10)}-${Date.now()}`;

        // Upload photos (if any)
        const uploadedPhotos = [];
        if (photos && photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
                const base64Data = photos[i].split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const contentType = photos[i].split(';')[0].split(':')[1];
                const extension = contentType.split('/')[1];
                const filename = `${memorialId}-${i}.${extension}`;

                const { error: uploadError } = await supabase.storage
                    .from('memorial-images')
                    .upload(filename, buffer, {
                        contentType: contentType,
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Photo upload error:', uploadError);
                    throw new Error('Failed to upload photo');
                }

                uploadedPhotos.push({
                    url: `/api/get-image?filename=${filename}`,
                    alt: `Photo of ${name}`
                });
            }
        }

        // Insert memorial with pending status
        const { data, error } = await supabase
            .from('memorials')
            .insert({
                id: memorialId,
                name: name,
                last_name: lastName,
                birth_year: birthYear,
                death_year: deathYear,
                grade_12_year: grade12Year,
                is_faculty: isFaculty || false,
                tribute: tribute,
                photos: uploadedPhotos,
                status: 'pending',
                payment_status: 'unpaid',
                submitter_name: submitterName,
                submitter_email: submitterEmail,
                submission_date: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save memorial');
        }

        return res.status(200).json({
            success: true,
            message: 'Memorial submitted successfully! Please complete payment.',
            memorialId: data.id
        });

    } catch (error) {
        console.error('Submission error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Handle admin approval/rejection/bypass
async function handleManageSubmission(req, res) {
    try {
        const { memorialId, action } = req.body;

        if (!memorialId || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        let updateData = {};

        switch (action) {
            case 'approve':
                updateData = { status: 'approved' };
                break;
            case 'bypass':
                updateData = { 
                    status: 'approved',
                    payment_status: 'bypassed'
                };
                break;
            case 'reject':
                updateData = { status: 'rejected' };
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        const { data, error } = await supabase
            .from('memorials')
            .update(updateData)
            .eq('id', memorialId)
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update memorial status');
        }

        return res.status(200).json({
            success: true,
            message: `Memorial ${action}ed successfully`,
            memorial: data
        });

    } catch (error) {
        console.error('Manage submission error:', error);
        return res.status(500).json({ error: error.message });
    }
}
