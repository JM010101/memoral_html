import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ message: 'Failed to fetch partners', error: error.message });
    }
}
