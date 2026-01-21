// Supabase API endpoint to submit comment
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Enable CORS
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
        const { memorialId, name, email, comment, recaptchaToken } = req.body;

        if (!memorialId || !name || !comment) {
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
            return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
        }

        // Initialize Supabase client (using anon key for public access)
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Insert comment (status defaults to 'pending' in database)
        const { data, error } = await supabase
            .from('comments')
            .insert({
                id: `comment-${Date.now()}`,
                memorial_id: memorialId,
                name: name,
                email: email || null,
                comment: comment,
                status: 'pending'
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Comment submitted! It will appear after approval.',
            commentId: data.id
        });

    } catch (error) {
        console.error('Error submitting comment:', error);
        return res.status(500).json({ error: error.message });
    }
}
