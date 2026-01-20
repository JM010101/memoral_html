# Memorial Website

A simple, beautiful memorial website where anyone can add and manage memorials.

---

## 🚀 For Users (Add Memorial):

### Go to Admin:
**URL**: `https://your-site/admin-auto.html`  
**Password**: `memorial2024`

### Add Memorial:
1. Enter name, dates, and tribute
2. Upload photos (drag & drop)
3. Click **"Save Memorial"**
4. **Done!** Site updates in 2 minutes automatically

**No technical knowledge needed!**

---

## ⚙️ Setup (One Time - 5 Minutes):

### Step 1: Create GitHub Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Check: ✅ **repo** (full control)
4. Generate and **copy the token**

### Step 2: Add to Vercel
1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Add two variables:
   - `GITHUB_TOKEN` = [your token]
   - `ADMIN_PASSWORD` = `memorial2024`
4. Save and redeploy

### Done!
Now anyone with the password can add memorials automatically!

---

## 📁 Files:

### Website:
- `index.html` - Home page
- `memorials.html` - All memorials page  
- `memorial.html` - Individual memorial page
- `styles.css` - Styling
- `script.js` - Functionality

### Admin:
- `admin-auto.html` - Automatic admin panel
- `api/save-memorial.js` - Saves to GitHub
- `api/upload-image.js` - Uploads images

### Data:
- `data/memorials.json` - Memorial data
- `images/` - Memorial photos

---

## 🔒 Security:

- Password-protected admin
- GitHub token stored securely in Vercel
- All changes tracked in Git

---

## ✅ Features:

- ✅ Add/edit/delete memorials
- ✅ Upload multiple photos per memorial
- ✅ Fully automatic (commits to GitHub)
- ✅ Auto-deploys to Vercel
- ✅ Mobile-friendly
- ✅ Accessible
- ✅ No technical knowledge needed

---

## 📝 Change Password:

Edit `ADMIN_PASSWORD` in Vercel environment variables and redeploy.

---

**That's it! Simple and it works!** 🎉
