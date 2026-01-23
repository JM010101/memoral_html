# Gmail SMTP Setup Guide

This guide explains how to set up Gmail SMTP for email verification of comments.

## Prerequisites

1. A Gmail account
2. 2-Step Verification enabled on your Gmail account

## Step 1: Enable 2-Step Verification

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

## Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like "Memorial Website Comments"
5. Click **Generate**
6. Copy the 16-character password (you'll need this for the environment variable)

## Step 3: Run Database Migration

Run the SQL migration to add verification fields:

```sql
-- Run this in your Supabase SQL Editor
-- File: add-comment-email-verification.sql
```

## Step 4: Set Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

```
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
SITE_URL=https://your-domain.com
```

**Important Notes:**
- Use your full Gmail address for `GMAIL_USER`
- Use the App Password (not your regular Gmail password) for `GMAIL_APP_PASSWORD`
- The App Password is 16 characters with spaces - you can include or remove spaces, both work
- Set `SITE_URL` to your production domain (without trailing slash)

## Step 5: Install Dependencies

The `nodemailer` package is already added to `package.json`. After deploying to Vercel, it will be installed automatically.

## How It Works

1. User submits a comment with their email
2. System generates a unique verification token
3. Email is sent via Gmail SMTP with verification link
4. User clicks link to verify email
5. Comment status changes from `pending_verification` to `pending`
6. Admin can then approve the comment

## Email Flow

- **pending_verification**: Comment submitted, awaiting email verification
- **pending**: Email verified, awaiting admin approval
- **approved**: Comment is live on the site
- **rejected**: Comment was rejected by admin

## Troubleshooting

### Emails not sending?

1. Check that `GMAIL_USER` and `GMAIL_APP_PASSWORD` are set correctly
2. Verify 2-Step Verification is enabled
3. Check Vercel function logs for email errors
4. Make sure you're using App Password, not regular password

### "Invalid login" error?

- Make sure you're using the App Password, not your regular Gmail password
- Verify the App Password was copied correctly (no extra spaces)

### Daily limit reached?

- Gmail free accounts have a limit of 500 emails per day
- Consider upgrading to Google Workspace for higher limits
- Or use a different email service (Resend, SendGrid, etc.)

## Testing

After setup, test by:
1. Submitting a comment on a memorial page
2. Check your email inbox for verification email
3. Click the verification link
4. Verify the comment appears in admin panel with "Email Verified" status
