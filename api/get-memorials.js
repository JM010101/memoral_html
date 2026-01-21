// API endpoint to get all memorials
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

    try {
        // Initialize Supabase client with anon key (public access)
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Fetch only approved memorials for public view
        const { data, error } = await supabase
            .from('memorials')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        return res.status(200).json({ 
            success: true,
            memorials: data || []
        });

    } catch (error) {
        console.error('Error fetching memorials:', error);
        return res.status(500).json({ error: error.message });
    }
}
