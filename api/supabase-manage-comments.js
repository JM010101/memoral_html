// Supabase API endpoint to manage comments (approve/reject/delete)
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
        const { commentId, action, password } = req.body;

        // Verify admin password
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'memorial2024';
        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!commentId || !action || !['approve', 'reject', 'delete'].includes(action)) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        // Initialize Supabase client with service role key
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        let result;

        if (action === 'delete') {
            // Delete the comment
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', commentId);

            if (error) throw new Error(error.message);
        } else {
            // Update comment status
            const updateData = {
                status: action === 'approve' ? 'approved' : 'rejected'
            };

            if (action === 'approve') {
                updateData.approved_at = new Date().toISOString();
            }

            const { data, error } = await supabase
                .from('comments')
                .update(updateData)
                .eq('id', commentId)
                .select()
                .single();

            if (error) throw new Error(error.message);
            result = data;
        }

        return res.status(200).json({ 
            success: true, 
            message: `Comment ${action}d successfully`
        });

    } catch (error) {
        console.error('Error managing comment:', error);
        return res.status(500).json({ error: error.message });
    }
}
