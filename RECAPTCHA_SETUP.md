# reCAPTCHA Setup Instructions

## 1. Get reCAPTCHA Keys

1. Go to: https://www.google.com/recaptcha/admin/create
2. **Register a new site**:
   - **Label**: Fallen Gators Registry
   - **reCAPTCHA type**: reCAPTCHA v2 → "I'm not a robot" Checkbox
   - **Domains**: 
     - `philip-memoral-html.a-little-better.com`
     - `localhost` (for testing)
   - Accept the terms
   - Click **Submit**

3. **Copy your keys**:
   - **Site Key** (public)
   - **Secret Key** (private)

## 2. Add Site Key to Frontend

Open `script-supabase.js` and find line ~299:

```javascript
html += '<div class="g-recaptcha" data-sitekey="6LfYour_Site_Key_Here"></div>';
```

**Replace** `6LfYour_Site_Key_Here` with your actual **Site Key**.

## 3. Add Secret Key to Vercel

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add new environment variable:
   - **Name**: `RECAPTCHA_SECRET_KEY`
   - **Value**: Your **Secret Key** from Google
   - **Environment**: Production, Preview, Development
3. Click **Save**
4. **Redeploy** your site

## 4. Test

1. Go to any memorial page
2. Try to submit a comment
3. You should see the reCAPTCHA checkbox
4. Complete it and submit
5. Comment should be submitted successfully!

## How It Works

- **Frontend**: Shows reCAPTCHA checkbox, sends token to backend
- **Backend**: Verifies token with Google's API before allowing comment
- **Security**: Blocks bots and automated spam

## If You Get Errors

- Make sure you added your domain to reCAPTCHA admin
- Make sure the Secret Key is set in Vercel environment variables
- Check browser console for errors
- Check Vercel function logs for backend errors
