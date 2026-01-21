# 🐊 Fallen Gators Registry - Memorial Website

A memorial website with instant database updates powered by Supabase.

---

## ✨ Features

- 📝 **Memorial Management** - Add, edit, and delete memorials
- 🖼️ **Photo Galleries** - Up to 5 photos per memorial with lightbox viewer
- 💬 **Comment System** - Visitor comments with admin approval
- 🔍 **Search** - Search memorials by name or tribute
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Instant Updates** - Changes appear immediately (no waiting for deployments)
- 🎨 **Professional Design** - Soft colors, clean layout

---

## 🚀 Live Site

**Main Site:** Your Vercel URL  
**Admin Panel:** `https://your-site.com/admin-supabase.html`

**Admin Password:** `memorial2024` (change in Vercel environment variables)

---

## 📁 Project Structure

```
memoral_html/
├── index.html              # Home page
├── memorials.html          # All memorials listing
├── memorial.html           # Individual memorial page
├── admin-supabase.html     # Admin panel
├── script-supabase.js      # Frontend JavaScript
├── styles.css              # All styling
├── api/                    # Serverless functions (11 total)
│   ├── get-memorials.js           # Public: Load memorials
│   ├── get-comments.js            # Public: Load approved comments  
│   ├── get-image.js               # Public: Proxy images
│   ├── supabase-submit-comment.js # Public: Submit comments
│   ├── admin-get-memorials.js     # Admin: Load memorials
│   ├── admin-get-memorial.js      # Admin: Load single memorial
│   ├── admin-get-pending-comments.js # Admin: Load pending comments
│   ├── supabase-save-memorial.js  # Admin: Save memorial
│   ├── supabase-upload-image.js   # Admin: Upload images
│   ├── supabase-delete-memorial.js # Admin: Delete memorial
│   └── supabase-manage-comments.js # Admin: Approve/reject comments
├── images/                 # Uploaded memorial images
├── package.json           # Dependencies
└── supabase-setup.sql    # Database setup SQL
```

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Hosting:** Vercel

---

## 📦 Setup (For New Deployment)

### 1. Supabase Setup

1. Create account at https://supabase.com
2. Create new project
3. Go to **SQL Editor** → Run `supabase-setup.sql`
4. Go to **Storage** → Create bucket `memorial-images` (make public)
5. Copy your API keys from **Settings** → **API**

### 2. Vercel Setup

1. Deploy to Vercel (connect GitHub repo)
2. Add environment variables in **Settings** → **Environment Variables**:
   ```
   SUPABASE_URL = your_supabase_url
   SUPABASE_SERVICE_KEY = your_service_key
   SUPABASE_ANON_KEY = your_anon_key
   ADMIN_PASSWORD = memorial2024
   ```
3. Redeploy

### 3. Done!

Visit your site and go to `/admin-supabase.html` to start adding memorials!

---

## 👨‍💼 Admin Usage

### Add a Memorial

1. Go to `admin-supabase.html`
2. Login with password
3. Fill in memorial details
4. Upload 1-5 photos
5. Click **Save Memorial**
6. ✅ Appears instantly on homepage!

### Approve Comments

1. Go to admin panel
2. Scroll to **Pending Comments** section
3. Click ✅ **Approve** or ⚠️ **Reject**
4. Approved comments show on memorial pages

---

## 🔧 Customization

### Change Admin Password

Update `ADMIN_PASSWORD` in Vercel environment variables, then redeploy.

### Change Colors

Edit `styles.css`:
- `--primary-color: #0313fc` (blue top bar)
- `--bg-light: #ffffee` (soft yellow background)

### Change Site Name

Search and replace "Fallen Gators Registry" in:
- `index.html`
- `memorials.html`
- `memorial.html`
- `admin-supabase.html`

---

## 🐛 Troubleshooting

### Images Not Loading

Images are proxied through Vercel due to Supabase connectivity. This is normal and handled automatically.

### Comments Not Submitting

Check Supabase RLS policies are set correctly (see `supabase-setup.sql`).

### Admin Panel Not Loading

Verify environment variables are set in Vercel and site has been redeployed.

---

## 📄 License

All rights reserved.

---

## 🙏 Support

For issues or questions, contact the site administrator.

---

**Built with ❤️ for remembering those we've lost.**
