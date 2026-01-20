# Quick Setup Guide

## For Users:

1. User goes to `/admin-auto.html`
2. Enters password: `memorial2024`
3. Adds memorial + uploads photos
4. Clicks **"Save Memorial"**
5. **DONE!** Automatically commits to GitHub!
6. Vercel auto-deploys (2 minutes)
7. Memorial appears on website!

**Users don't need to know ANYTHING about GitHub or JSON!**

---

## ⚡ Setup (One Time - 5 Minutes):

### Step 1: Create GitHub Personal Access Token

1. Go to: **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Name: `Memorial Website`
4. Check: ✅ **repo** (full control)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (starts with `ghp_...`)

### Step 2: Add to Vercel

1. Go to: **https://vercel.com/dashboard**
2. Click your memorial project
3. **Settings** → **Environment Variables**
4. Add **TWO variables**:

**Variable 1:**
- Name: `GITHUB_TOKEN`
- Value: [Your GitHub token from Step 1]
- Environments: ✅ All

**Variable 2:**
- Name: `ADMIN_PASSWORD`
- Value: `memorial2024` (or any password you want)
- Environments: ✅ All

5. Click **"Save"**
6. **Redeploy** your site

---

## ✅ DONE! Now Users Can:

### For ANYONE (family, friends, funeral staff):

1. **Go to**: `https://your-site/admin-auto.html`
2. **Password**: `memorial2024`
3. **Fill form**: Name, dates, tribute
4. **Upload photos**: Drag & drop
5. **Click "Save Memorial"**
6. **DONE!** Site updates in 2 minutes!

**They don't need to:**
- ❌ Know what JSON is
- ❌ Know what GitHub is
- ❌ Download any files
- ❌ Commit anything
- ❌ Have technical knowledge

---

## 🎉 Benefits:

- ✅ **Fully automatic** (commits to GitHub via API)
- ✅ **Zero technical knowledge** needed
- ✅ **Password protected**
- ✅ **Works on any device**
- ✅ **Images auto-uploaded**
- ✅ **Changes auto-deployed**
- ✅ **100% user-friendly**

---

## 🔒 Security:

- Password protected admin
- GitHub token stored securely in Vercel
- Only people with password can add memorials
- All changes tracked in Git history

---

## 📝 Change Password:

In Vercel:
1. Go to **Environment Variables**
2. Edit `ADMIN_PASSWORD`
3. Change to new password
4. Redeploy

---

## 🚀 This is THE Solution!

**Users just click "Save" and it's done automatically!**

No JSON, no GitHub, no technical knowledge needed!

Perfect for:
- ✅ Family members
- ✅ Funeral homes
- ✅ Community memorials
- ✅ Non-technical users

---

**Setup takes 5 minutes, then it works forever!** 🎯
