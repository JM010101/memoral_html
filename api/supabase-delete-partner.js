import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.body;

    try {
        // Delete partner logo from storage if exists
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

        // Delete the partner record
        const { error } = await supabase
            .from('partners')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Partner deleted successfully' });
    } catch (error) {
        console.error('Error deleting partner:', error);
        res.status(500).json({ message: 'Failed to delete partner', error: error.message });
    }
}
