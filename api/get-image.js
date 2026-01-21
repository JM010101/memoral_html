// API endpoint to proxy images from Supabase Storage
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    try {
        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Download the file from Supabase Storage
        const { data, error } = await supabase.storage
            .from('memorial-images')
            .download(filename);

        if (error) {
            console.error('Supabase storage error:', error);
            throw new Error(error.message);
        }

        if (!data) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Convert blob to buffer
        const buffer = Buffer.from(await data.arrayBuffer());

        // Determine content type from filename extension
        const ext = filename.split('.').pop().toLowerCase();
        const contentTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'avif': 'image/avif'
        };
        const contentType = contentTypes[ext] || 'image/jpeg';

        // Set cache headers for better performance
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        
        return res.status(200).send(buffer);

    } catch (error) {
        console.error('Error fetching image:', error);
        return res.status(500).json({ error: error.message });
    }
}
