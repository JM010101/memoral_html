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
        const { error } = await supabase
            .from('beneficiaries')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ message: 'Beneficiary deleted successfully' });
    } catch (error) {
        console.error('Error deleting beneficiary:', error);
        res.status(500).json({ message: 'Failed to delete beneficiary', error: error.message });
    }
}
