// API endpoint to verify comment email
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: 'Verification token is required' });
        }

        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY // Use service key to update comment
        );

        // Find comment by verification token
        const { data: comment, error: findError } = await supabase
            .from('comments')
            .select('*')
            .eq('verification_token', token)
            .single();

        if (findError || !comment) {
            return res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invalid Verification Link</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                        .error { color: #dc2626; }
                    </style>
                </head>
                <body>
                    <h1 class="error">Invalid Verification Link</h1>
                    <p>The verification link is invalid or has expired. Please try submitting your comment again.</p>
                </body>
                </html>
            `);
        }

        // Check if already verified
        if (comment.email_verified) {
            return res.status(200).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Already Verified</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                        .success { color: #10b981; }
                        .info { color: #666; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1 class="success">✓ Email Already Verified</h1>
                    <p class="info">Your email has already been verified. Your comment is pending admin approval.</p>
                </body>
                </html>
            `);
        }

        // Update comment to verified and change status to pending (for admin approval)
        const { error: updateError } = await supabase
            .from('comments')
            .update({
                email_verified: true,
                status: 'pending' // Now ready for admin approval
            })
            .eq('id', comment.id);

        if (updateError) {
            console.error('Error updating comment:', updateError);
            throw new Error(updateError.message);
        }

        // Get memorial info for redirect
        const { data: memorial } = await supabase
            .from('memorials')
            .select('id, name')
            .eq('id', comment.memorial_id)
            .single();

        const memorialUrl = memorial ? `/memorial.html?id=${memorial.id}` : '/memorials.html';

        return res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Email Verified</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                    .success { color: #10b981; font-size: 2rem; margin-bottom: 20px; }
                    .message { color: #333; margin: 20px 0; line-height: 1.6; }
                    .button { display: inline-block; background-color: #0313fc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
                    .button:hover { background-color: #0210d0; }
                </style>
            </head>
            <body>
                <div class="success">✓ Email Verified Successfully!</div>
                <p class="message">Thank you for verifying your email address. Your comment has been submitted and is now pending admin approval.</p>
                <p class="message">You will receive a notification once your comment is approved and appears on the memorial page.</p>
                <a href="${memorialUrl}" class="button">Return to Memorial Page</a>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Error verifying comment email:', error);
        return res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Verification Error</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; }
                    .error { color: #dc2626; }
                </style>
            </head>
            <body>
                <h1 class="error">Verification Failed</h1>
                <p>An error occurred while verifying your email. Please try again or contact support.</p>
            </body>
            </html>
        `);
    }
}
