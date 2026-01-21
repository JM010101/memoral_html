# 🚀 Supabase Setup Guide - Instant Updates!

## Overview
This guide will help you migrate from GitHub commits to Supabase for **instant updates** with no waiting!

---

## Step 1: Run SQL to Create Database Tables

1. Go to your Supabase project: https://app.supabase.com
2. Click on your project: `sexokiygxgvodfhjncbt`
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `supabase-setup.sql`
6. Click **Run** or press `Ctrl+Enter`

**What this creates:**
- `memorials` table (stores all memorial data)
- `comments` table (stores visitor comments)
- Row Level Security policies (for security)
- Indexes (for fast queries)
- Triggers (for auto-updating timestamps)

---

## Step 2: Create Storage Bucket for Images

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Bucket name: `memorial-images`
4. **Public bucket**: ✅ YES (check this)
5. Click **Create Bucket**

### Set Storage Policies:

1. Click on the `memorial-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** for INSERT:
   - Policy name: `Allow service role to upload`
   - Target roles: `service_role`
   - Policy definition: `true`
4. Click **New Policy** for SELECT:
   - Policy name: `Allow public read access`
   - Target roles: `anon`, `authenticated`
   - Policy definition: `true`

---

## Step 3: Update Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```
SUPABASE_URL = https://sexokiygxgvodfhjncbt.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNleG9raXlneGd2b2RmaGpuY2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk0NTUyOSwiZXhwIjoyMDg0NTIxNTI5fQ.ARWBaQ1rKRK_9SWd-wXf9uxuHijT1rr8rL5s8MeOFQU
SUPABASE_ANON_KEY = sb_publishable_xhMPLBaoblIflXwm4Atltw_WPMD30H9
ADMIN_PASSWORD = memorial2024
```

4. Make sure to set these for **Production**, **Preview**, and **Development**
5. Click **Save**

---

## Step 4: Update HTML Files

### Update Navigation Links

In `index.html`, `memorials.html`, `memorial.html`:

**Change the Admin link from:**
```html
<li><a href="admin-auto.html">Admin</a></li>
```

**To:**
```html
<li><a href="admin-supabase.html">Admin</a></li>
```

### Update Script Reference

In `index.html`, `memorials.html`, `memorial.html`:

**Change:**
```html
<script src="script.js"></script>
```

**To:**
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="script-supabase.js"></script>
```

---

## Step 5: Deploy to Vercel

1. Commit and push all changes:
```bash
git add .
git commit -m "Migrate to Supabase for instant updates"
git push
```

2. Vercel will automatically deploy
3. Wait 1-2 minutes for deployment

---

## Step 6: Test the System

1. Go to `https://yoursite.com/admin-supabase.html`
2. Log in with password: `memorial2024`
3. Add a test memorial
4. **Changes appear instantly!** No more waiting!

---

## 📋 Files Created/Updated

**New Files:**
- `supabase-setup.sql` - Database schema
- `admin-supabase.html` - New admin panel (Supabase-powered)
- `script-supabase.js` - Frontend script (Supabase-powered)
- `api/supabase-save-memorial.js` - Save memorial endpoint
- `api/supabase-upload-image.js` - Upload image endpoint
- `api/supabase-submit-comment.js` - Submit comment endpoint
- `api/supabase-manage-comments.js` - Manage comments endpoint
- `api/supabase-delete-memorial.js` - Delete memorial endpoint

**Files to Update:**
- `package.json` - Added Supabase client
- `index.html` - Update admin link and script
- `memorials.html` - Update admin link and script
- `memorial.html` - Update admin link and script

**Old Files (Can be deleted after testing):**
- `admin-auto.html` (old GitHub-based admin)
- `script.js` (old JSON-based script)
- `api/save-memorial.js` (old GitHub API)
- `api/upload-image.js` (old GitHub API)
- `api/submit-comment.js` (old GitHub API)
- `api/manage-comments.js` (old GitHub API)
- `data/memorials.json` (no longer needed)
- `data/comments.json` (no longer needed)

---

## 🔄 Migrating Existing Data

If you have existing memorials in `data/memorials.json`:

1. Go to **SQL Editor** in Supabase
2. For each memorial, run:

```sql
INSERT INTO memorials (id, name, birth_date, death_date, tribute, photos)
VALUES (
    'memorial-id',
    'Person Name',
    '1950-01-01',
    '2024-01-01',
    'Tribute text here...',
    '[{"url": "https://image-url.com", "alt": "Photo description"}]'::jsonb
);
```

3. Or use the admin panel to re-add them (easier!)

---

## ✅ Benefits of Supabase

- ⚡ **Instant updates** - No more 1-2 minute wait
- 🗄️ **Real database** - Better performance, scalability
- 🔒 **Built-in security** - Row Level Security policies
- 📊 **Better data management** - SQL queries, indexes
- 💾 **Automatic backups** - Supabase handles it
- 🆓 **Free tier** - More than enough for this site

---

## 🆘 Troubleshooting

### Error: "Failed to fetch"
- Check that environment variables are set in Vercel
- Verify Supabase project URL is correct
- Make sure storage bucket is created

### Images not uploading
- Verify `memorial-images` bucket exists
- Check bucket is marked as **public**
- Verify storage policies are set correctly

### Comments not showing
- Run the SQL to create tables
- Check RLS policies are enabled
- Verify comments are being approved in admin panel

---

## 🎉 You're Done!

Your memorial site now has **instant updates** powered by Supabase!

No more waiting for GitHub commits and Vercel deployments. Changes appear immediately! 🚀
