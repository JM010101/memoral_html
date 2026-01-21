import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Consolidated Partners API - handles GET, POST (save), DELETE
export default async function handler(req, res) {
    const { method } = req;
    const { action, id } = req.query;

    // GET - Fetch all partners (public access)
    if (method === 'GET') {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        try {
            const { data, error } = await supabase
                .from('partners')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching partners:', error);
            return res.status(500).json({ message: 'Failed to fetch partners', error: error.message });
        }
    }

    // POST - Save or Delete partner (admin access with service role)
    if (method === 'POST') {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // DELETE action
        if (action === 'delete') {
            try {
                const { data: partnerData } = await supabase
                    .from('partners')
                    .select('logo_url')
                    .eq('id', id)
                    .single();

                if (partnerData && partnerData.logo_url) {
                    const filename = partnerData.logo_url.split('/').pop().split('?')[0];
                    if (filename && !filename.includes('http')) {
                        await supabase.storage
                            .from('memorial-images')
                            .remove([filename]);
                    }
                }

                const { error } = await supabase
                    .from('partners')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return res.status(200).json({ message: 'Partner deleted successfully' });
            } catch (error) {
                console.error('Error deleting partner:', error);
                return res.status(500).json({ message: 'Failed to delete partner', error: error.message });
            }
        }

        // SAVE action (default)
        const { partner } = req.body;
        try {
            const { data, error } = await supabase
                .from('partners')
                .upsert(partner, { onConflict: 'id' })
                .select();

            if (error) throw error;
            return res.status(200).json({ message: 'Partner saved successfully', data });
        } catch (error) {
            console.error('Error saving partner:', error);
            return res.status(500).json({ message: 'Failed to save partner', error: error.message });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
