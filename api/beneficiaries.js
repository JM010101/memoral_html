import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Consolidated Beneficiaries API - handles GET, POST (save), DELETE
export default async function handler(req, res) {
    const { method } = req;
    const { action, id } = req.query;

    // GET - Fetch all beneficiaries (public access)
    if (method === 'GET') {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        try {
            const { data, error } = await supabase
                .from('beneficiaries')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching beneficiaries:', error);
            return res.status(500).json({ message: 'Failed to fetch beneficiaries', error: error.message });
        }
    }

    // POST - Save or Delete beneficiary (admin access with service role)
    if (method === 'POST') {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // DELETE action
        if (action === 'delete') {
            try {
                const { error } = await supabase
                    .from('beneficiaries')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                return res.status(200).json({ message: 'Beneficiary deleted successfully' });
            } catch (error) {
                console.error('Error deleting beneficiary:', error);
                return res.status(500).json({ message: 'Failed to delete beneficiary', error: error.message });
            }
        }

        // SAVE action (default)
        const { beneficiary } = req.body;
        try {
            const { data, error } = await supabase
                .from('beneficiaries')
                .upsert(beneficiary, { onConflict: 'id' })
                .select();

            if (error) throw error;
            return res.status(200).json({ message: 'Beneficiary saved successfully', data });
        } catch (error) {
            console.error('Error saving beneficiary:', error);
            return res.status(500).json({ message: 'Failed to save beneficiary', error: error.message });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
}
