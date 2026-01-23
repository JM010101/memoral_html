// Consolidated API for public memorial submissions and management
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle GET requests for email verification
    if (req.method === 'GET') {
        return await handleEmailVerification(req, res);
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { action } = req.body;

    // PUBLIC SUBMISSION
    if (action === 'submit') {
        return await handlePublicSubmission(req, res);
    }

    // ADMIN MANAGEMENT (approve/reject/bypass)
    if (action === 'approve' || action === 'reject' || action === 'bypass') {
        return await handleManageSubmission(req, res);
    }

    return res.status(400).json({ error: 'Invalid action' });
}

// Handle public memorial submission
async function handlePublicSubmission(req, res) {
    try {
        const { submitterName, submitterEmail, name, lastName, birthYear, deathYear, grade12Year, isFaculty, tribute, photos, recaptchaToken } = req.body;

        if (!submitterName || !submitterEmail || !name || !lastName || !birthYear || !deathYear || !tribute) {
            return res.status(400).json({ error: 'Missing required fields' });
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
            return res.status(400).json({ error: 'reCAPTCHA verification failed' });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        const memorialId = `${lastName.toLowerCase().replace(/[^a-z]/g, '')}-${name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10)}-${Date.now()}`;

        // Generate unique verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Upload photos (if any)
        const uploadedPhotos = [];
        if (photos && photos.length > 0) {
            for (let i = 0; i < photos.length; i++) {
                const base64Data = photos[i].split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                const contentType = photos[i].split(';')[0].split(':')[1];
                const extension = contentType.split('/')[1];
                const filename = `${memorialId}-${i}.${extension}`;

                const { error: uploadError } = await supabase.storage
                    .from('memorial-images')
                    .upload(filename, buffer, {
                        contentType: contentType,
                        upsert: true
                    });

                if (uploadError) {
                    console.error('Photo upload error:', uploadError);
                    throw new Error('Failed to upload photo');
                }

                uploadedPhotos.push({
                    url: `/api/get-image?filename=${filename}`,
                    alt: `Photo of ${name}`
                });
            }
        }

        // Insert memorial with pending_verification status
        const { data, error } = await supabase
            .from('memorials')
            .insert({
                id: memorialId,
                name: name,
                last_name: lastName,
                birth_year: birthYear,
                death_year: deathYear,
                grade_12_year: grade12Year,
                is_faculty: isFaculty || false,
                tribute: tribute,
                photos: uploadedPhotos,
                status: 'pending_verification',
                payment_status: 'unpaid',
                submitter_name: submitterName,
                submitter_email: submitterEmail,
                submission_date: new Date().toISOString(),
                verification_token: verificationToken,
                email_verified: false,
                verification_sent_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            throw new Error('Failed to save memorial');
        }

        // Send verification email using Gmail SMTP
        try {
            const siteUrl = process.env.SITE_URL || req.headers.origin || 'https://philip-memoral-html.a-little-better.com';
            const verificationUrl = `${siteUrl}/api/memorial-submissions?token=${verificationToken}`;

            // Create Gmail transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            });

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: submitterEmail,
                subject: 'Please verify your memorial submission on Fallen Gators Registry',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #0313fc;">Verify Your Memorial Submission</h2>
                        <p>Hello ${submitterName},</p>
                        <p>Thank you for submitting a memorial for <strong>${name} ${lastName}</strong>.</p>
                        <p>To ensure your submission goes live, please verify your email address by clicking the button below:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" style="background-color: #0313fc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">After verification, your submission will be reviewed by our team. Once approved, the memorial will appear on the site.</p>
                        <p style="color: #666; font-size: 14px;">If you didn't submit this memorial, please ignore this email.</p>
                    </div>
                `,
                text: `Hello ${submitterName},\n\nThank you for submitting a memorial for ${name} ${lastName}.\n\nTo verify your email address, please visit:\n${verificationUrl}\n\nAfter verification, your submission will be reviewed by our team.\n\nIf you didn't submit this memorial, please ignore this email.`
            };

            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // Don't fail the request if email fails, but log it
        }

        return res.status(200).json({
            success: true,
            message: 'Memorial submitted! Please check your email to verify your submission. After verification, it will be reviewed by our team.',
            memorialId: data.id,
            emailSent: true
        });

    } catch (error) {
        console.error('Submission error:', error);
        return res.status(500).json({ error: error.message });
    }
}

// Handle admin approval/rejection/bypass
async function handleManageSubmission(req, res) {
    try {
        const { memorialId, action } = req.body;

        if (!memorialId || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        let updateData = {};

        switch (action) {
            case 'approve':
                updateData = { status: 'approved' };
                break;
            case 'bypass':
                updateData = { 
                    status: 'approved',
                    payment_status: 'bypassed'
                };
                break;
            case 'reject':
                updateData = { status: 'rejected' };
                break;
            default:
                return res.status(400).json({ error: 'Invalid action' });
        }

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

// Handle email verification (GET request)
async function handleEmailVerification(req, res) {
    try {
        const { token } = req.query;

        if (!token) {
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
                    <p>The verification link is invalid or has expired. Please try submitting your memorial again.</p>
                </body>
                </html>
            `);
        }

        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_KEY
        );

        // Find memorial by verification token
        const { data: memorial, error: findError } = await supabase
            .from('memorials')
            .select('*')
            .eq('verification_token', token)
            .single();

        if (findError || !memorial) {
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
                    <p>The verification link is invalid or has expired. Please try submitting your memorial again.</p>
                </body>
                </html>
            `);
        }

        // Check if already verified
        if (memorial.email_verified) {
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
                    <p class="info">Your email has already been verified. Your memorial submission is pending admin approval.</p>
                </body>
                </html>
            `);
        }

        // Update memorial to verified and change status to pending (for admin approval)
        const { error: updateError } = await supabase
            .from('memorials')
            .update({
                email_verified: true,
                status: 'pending' // Now ready for admin approval
            })
            .eq('id', memorial.id);

        if (updateError) {
            console.error('Error updating memorial:', updateError);
            throw new Error(updateError.message);
        }

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
                <p class="message">Thank you for verifying your email address. Your memorial submission for <strong>${memorial.name} ${memorial.last_name}</strong> has been submitted and is now pending admin approval.</p>
                <p class="message">You will receive a notification once your memorial is approved and appears on the site.</p>
                <a href="/memorials.html" class="button">View All Memorials</a>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Error verifying memorial email:', error);
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
