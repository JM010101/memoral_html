// Supabase API endpoint to save memorial
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { password, memorial } = req.body;

        // Verify admin password
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'memorial2024';
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Initialize Supabase client with service role key
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Upsert memorial (insert or update)
        const { data, error } = await supabase
            .from('memorials')
            .upsert({
                id: memorial.id,
                name: memorial.name,
                last_name: memorial.last_name || null,
                birth_year: memorial.birth_year || null,
                death_year: memorial.death_year || null,
                grade_12_year: memorial.grade_12_year || null,
                tribute: memorial.tribute || '',
                photos: memorial.photos || []
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            console.error('Memorial data:', memorial);
            throw new Error(`Database error: ${error.message}. Hint: Make sure all database columns exist (last_name, birth_year, death_year, grade_12_year).`);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Memorial saved successfully!',
            memorial: data
        });

    } catch (error) {
        console.error('Error saving memorial:', error);
        return res.status(500).json({ error: error.message });
    }
}
