// Supabase API endpoint to submit comment
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

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
        const { memorialId, name, email, comment, recaptchaToken } = req.body;

        if (!memorialId || !name || !comment || !email) {
            return res.status(400).json({ error: 'Missing required fields (name, email, and comment are required)' });
        }

        // Verify reCAPTCHA
        if (!recaptchaToken) {
            return res.status(400).json({ error: 'reCAPTCHA verification required' });
        }

        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
        
        const recaptchaResponse = await fetch(recaptchaVerifyUrl, { method: 'POST' });
        const recaptchaData = await recaptchaResponse.json();

        if (!recaptchaData.success) {
            return res.status(400).json({ error: 'reCAPTCHA verification failed. Please try again.' });
        }

        // Initialize Supabase client (using anon key for public access)
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Generate unique verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const commentId = `comment-${Date.now()}`;

        // Get memorial name for email
        const { data: memorial } = await supabase
            .from('memorials')
            .select('name')
            .eq('id', memorialId)
            .single();

        const memorialName = memorial?.name || 'the memorial';

        // Insert comment with pending_verification status
        const { data, error } = await supabase
            .from('comments')
            .insert({
                id: commentId,
                memorial_id: memorialId,
                name: name,
                email: email,
                comment: comment,
                status: 'pending_verification',
                verification_token: verificationToken,
                email_verified: false,
                verification_sent_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error:', error);
            throw new Error(error.message);
        }

        // Send verification email using Gmail SMTP
        try {
            const siteUrl = process.env.SITE_URL || req.headers.origin || 'https://philip-memoral-html.a-little-better.com';
            const verificationUrl = `${siteUrl}/api/verify-comment-email?token=${verificationToken}`;

            // Create Gmail transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
                }
            });

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: 'Please verify your comment on Fallen Gators Registry',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #0313fc;">Verify Your Comment</h2>
                        <p>Hello ${name},</p>
                        <p>Thank you for leaving a comment on ${memorialName}'s memorial page.</p>
                        <p>To ensure your comment goes live, please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #0313fc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">If you didn't submit this comment, please ignore this email.</p>
                    </div>
                `,
                text: `Hello ${name},\n\nThank you for leaving a comment on ${memorialName}'s memorial page.\n\nTo verify your email address, please visit:\n${verificationUrl}\n\nIf you didn't submit this comment, please ignore this email.`
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // Don't fail the request if email fails, but log it
            // The comment is still saved and can be manually verified
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Comment submitted! Please check your email to verify your comment. It will appear after email verification and admin approval.',
            commentId: data.id,
            emailSent: true
        });

    } catch (error) {
        console.error('Error submitting comment:', error);
        return res.status(500).json({ error: error.message });
    }
}
