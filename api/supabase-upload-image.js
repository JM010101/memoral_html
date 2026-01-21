// Supabase API endpoint to upload image
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
        const { password, filename, content } = req.body;

        // Verify admin password
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'memorial2024';
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Initialize Supabase client with service role key
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Convert base64 to buffer
        const base64Data = content.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('memorial-images')
            .upload(filename, buffer, {
                contentType: 'image/' + filename.split('.').pop(),
                upsert: true
            });

        if (error) {
            console.error('Supabase storage error:', error);
            throw new Error(error.message);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('memorial-images')
            .getPublicUrl(filename);

        return res.status(200).json({ 
            success: true,
            url: publicUrl
        });

    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ error: error.message });
    }
}
