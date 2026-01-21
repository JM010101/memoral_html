import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { partner } = req.body;

    try {
        const { data, error } = await supabase
            .from('partners')
            .upsert(partner, { onConflict: 'id' })
            .select();

        if (error) throw error;

        res.status(200).json({ message: 'Partner saved successfully', data });
    } catch (error) {
        console.error('Error saving partner:', error);
        res.status(500).json({ message: 'Failed to save partner', error: error.message });
    }
}
