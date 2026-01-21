// API endpoint for public memorial submissions
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

    try {
        const { submitterName, submitterEmail, name, lastName, birthYear, deathYear, grade12Year, tribute, photos, recaptchaToken } = req.body;

        // Validate required fields
        if (!submitterName || !submitterEmail || !name || !lastName || !birthYear || !deathYear || !tribute || !photos || photos.length === 0) {
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

        // Initialize Supabase with service role key
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Generate memorial ID
        const memorialId = `${lastName.toLowerCase().replace(/[^a-z]/g, '')}-${name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10)}-${Date.now()}`;

        // Upload photos
        const uploadedPhotos = [];
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
