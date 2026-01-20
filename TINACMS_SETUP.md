# 🚀 TinaCMS Setup Instructions

Your memorial website is now configured with **TinaCMS** - a powerful content management system that saves directly to GitHub!

---

## ✅ What's Been Set Up

I've created the following files:
- ✅ `.tina/config.js` - TinaCMS configuration
- ✅ `package.json` - Dependencies
- ✅ `vercel.json` - Vercel deployment config
- ✅ `.gitignore` - Ignore node_modules and generated files
- ✅ Updated `data/memorials.json` - TinaCMS-compatible format
- ✅ Updated `script.js` - Works with TinaCMS data structure

---

## 📋 Setup Steps (10 minutes)

### Step 1: Install Dependencies

Open your terminal and run:

```bash
npm install
```

This installs TinaCMS and all required packages.

---

### Step 2: Create TinaCMS Account (Free)

1. Go to **https://app.tina.io**
2. Click **"Sign Up"** (free forever)
3. Sign in with **GitHub**
4. Click **"Create New Project"**
5. Name it: `Memorial Website`
6. Select your GitHub repository: `yourusername/your-repo-name`

---

### Step 3: Get Your Credentials

After creating the project, you'll see:
- **Client ID**: Something like `abc123def456...`
- **Token**: Something like `xyz789ghi012...`

**Copy both of these!**

---

### Step 4: Add Credentials to Config

Open `.tina/config.js` and update these lines:

```javascript
export default defineConfig({
  branch: "main", // Change to "master" if that's your branch
  clientId: "YOUR_CLIENT_ID_HERE", // Paste your Client ID
  token: "YOUR_TOKEN_HERE", // Paste your Token
  // ... rest of config
});
```

**Save the file!**

---

### Step 5: Test Locally (Optional but Recommended)

Run the development server:

```bash
npm run dev
```

Then open your browser to:
- **Website**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin

Try adding/editing a memorial to test it works!

Press `Ctrl+C` to stop the server.

---

### Step 6: Push to GitHub

```bash
git add .
git commit -m "Add TinaCMS for content management"
git push
```

---

### Step 7: Configure Vercel

1. Go to your **Vercel Dashboard**: https://vercel.com/dashboard
2. Find your memorial website project
3. Click **"Settings"**
4. Click **"Environment Variables"**
5. Add these variables:

| Name | Value |
|------|-------|
| `TINA_CLIENT_ID` | Your Client ID from Step 3 |
| `TINA_TOKEN` | Your Token from Step 3 |

6. Click **"Save"**
7. Go to **"Deployments"** tab
8. Click **"Redeploy"** on the latest deployment

---

### Step 8: Access Your Admin Panel! 🎉

After Vercel finishes deploying (1-2 minutes):

**Go to**: `https://yourdomain.com/admin`

You'll see the TinaCMS admin interface!

---

## 🎯 How to Use TinaCMS

### Adding a New Memorial

1. Go to `https://yourdomain.com/admin`
2. Click **"Memorials"** in the sidebar
3. Click **"Add Memorial"**
4. Fill in:
   - **Memorial ID**: `jane-doe` (lowercase, use hyphens)
   - **Full Name**: `Jane Doe`
   - **Birth Date**: Select from calendar
   - **Death Date**: Select from calendar
   - **Memorial Tribute**: Write the tribute text
5. Click **"Add Photos"**
   - Click **"Upload"** or drag & drop images
   - Add **Photo Description** for each (important for accessibility!)
6. Click **"Save"** at the top

**What happens:**
- TinaCMS commits changes to your GitHub repo
- Vercel detects the commit
- Vercel rebuilds your site (1-2 minutes)
- New memorial appears on your website!

---

### Editing an Existing Memorial

1. Go to `https://yourdomain.com/admin`
2. Click **"Memorials"**
3. Click on the memorial you want to edit
4. Make your changes
5. Click **"Save"**

Changes will be live in 1-2 minutes!

---

### Deleting a Memorial

1. Go to `https://yourdomain.com/admin`
2. Click **"Memorials"**
3. Click on the memorial
4. Click the **trash icon** or **"Delete"** button
5. Confirm deletion
6. Click **"Save"**

---

## 🔒 Security

### Who Can Access the Admin?

By default, only people with access to your TinaCMS account can edit.

**To add more editors:**
1. Go to https://app.tina.io
2. Click your project
3. Go to **"Team"** settings
4. Click **"Invite Member"**
5. Enter their email
6. They'll get an invite to edit your site!

---

## 💾 How Data is Saved

### Every time you save in TinaCMS:

1. ✅ Changes commit to GitHub (version controlled)
2. ✅ Vercel auto-deploys (1-2 minutes)
3. ✅ Website updates with new content
4. ✅ Changes persist forever (stored in Git)

### You can see all changes:
- Go to your GitHub repo
- Click **"Commits"**
- You'll see: `"Update from TinaCMS"` for each edit

---

## 🎨 What Non-Developers Can Do

With TinaCMS, non-developers can:
- ✅ Add new memorials
- ✅ Edit existing memorials
- ✅ Upload photos (drag & drop)
- ✅ Delete memorials
- ✅ Update all text content
- ✅ No coding knowledge required!

**All changes are permanent and saved to GitHub!**

---

## 🆘 Troubleshooting

### "Failed to load" error in admin panel

**Solution:**
1. Check `.tina/config.js` has correct `clientId` and `token`
2. Make sure you pushed changes to GitHub
3. Check Vercel environment variables are set
4. Redeploy in Vercel

---

### Changes not appearing on live site

**Solution:**
1. Wait 2-3 minutes (Vercel needs time to rebuild)
2. Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check Vercel deployment status

---

### Can't upload images

**Solution:**
1. Make sure images are under 5MB
2. Use supported formats: JPG, PNG, AVIF, WebP
3. Try a different browser

---

## 📚 Additional Resources

- **TinaCMS Docs**: https://tina.io/docs
- **TinaCMS Dashboard**: https://app.tina.io
- **Support**: https://discord.com/invite/zumN63Ybpf

---

## ✨ Next Steps

1. ✅ Run `npm install`
2. ✅ Get credentials from https://app.tina.io
3. ✅ Update `.tina/config.js` with credentials
4. ✅ Test locally with `npm run dev`
5. ✅ Push to GitHub
6. ✅ Add environment variables to Vercel
7. ✅ Access admin at `yourdomain.com/admin`

---

## 🎉 You're Done!

Your memorial website now has a professional content management system!

**Admin URL**: `https://yourdomain.com/admin`

Non-developers can now add, edit, and manage memorials without touching any code!

All changes are saved permanently to GitHub and automatically deployed to your live site.

---

**Questions?** Check the troubleshooting section above or visit https://tina.io/docs
