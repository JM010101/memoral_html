// API endpoint to get approved comments for a memorial
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

    const { memorialId } = req.query;

    if (!memorialId) {
        return res.status(400).json({ error: 'Memorial ID is required' });
    }

    try {
        // Initialize Supabase client with anon key (public access)
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Fetch approved comments for this memorial
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('memorial_id', memorialId)
            .eq('status', 'approved')
            .order('approved_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        return res.status(200).json({ 
            success: true,
            comments: data || []
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json({ error: error.message });
    }
}
