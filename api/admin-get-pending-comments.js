// Admin API endpoint to get pending comments
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

    const { password } = req.query;

    // Verify admin password
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'memorial2024';
    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Initialize Supabase client with service role key
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Fetch pending comments
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

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
