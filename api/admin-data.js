import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Consolidated Admin Data API - handles all admin GET operations
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { type, id } = req.query;

    try {
        // Get all memorials
        if (type === 'memorials') {
            const { data, error } = await supabase
                .from('memorials')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json({ success: true, memorials: data });
        }

        // Get single memorial by ID
        if (type === 'memorial' && id) {
            const { data, error } = await supabase
                .from('memorials')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return res.status(200).json(data);
        }

        // Get pending comments
        if (type === 'comments') {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return res.status(200).json({ success: true, comments: data });
        }

        return res.status(400).json({ success: false, message: 'Invalid type parameter' });
    } catch (error) {
        console.error(`Error fetching admin data (${type}):`, error);
        return res.status(500).json({ success: false, message: `Failed to fetch ${type}`, error: error.message });
    }
}
