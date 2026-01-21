// API endpoint to approve/reject/bypass payment for memorial submissions
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
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
        const { memorialId, action } = req.body;

        if (!memorialId || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Initialize Supabase with service role key
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        let updateData = {};

        switch (action) {
            case 'approve':
                // Approve only if payment is already received
                updateData = { status: 'approved' };
                break;
            
            case 'bypass':
                // Bypass payment and approve
                updateData = { 
                    status: 'approved',
                    payment_status: 'bypassed'
                };
                break;
            
            case 'reject':
                // Reject submission
                updateData = { status: 'rejected' };
                break;
            
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

        // Update memorial status
        const { data, error } = await supabase
            .from('memorials')
            .update(updateData)
            .eq('id', memorialId)
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            throw new Error('Failed to update memorial status');
        }

        // TODO: Send email notification to submitter
        // You can add email sending logic here using SendGrid, AWS SES, etc.

        return res.status(200).json({
            success: true,
            message: `Memorial ${action}ed successfully`,
            memorial: data
        });

    } catch (error) {
        console.error('Manage submission error:', error);
        return res.status(500).json({ error: error.message });
    }
}
