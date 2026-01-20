# ✅ Switched to Netlify CMS (Simpler Solution!)

TinaCMS was having issues with branch indexing. We've switched to **Netlify CMS** which is simpler and works perfectly with GitHub + Vercel!

---

## 🚀 Setup Steps

### Step 1: Enable GitHub OAuth

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/developers
   - Click **"OAuth Apps"**
   - Click **"New OAuth App"**

2. **Fill in the details:**
   - **Application name**: `Memorial Website Admin`
   - **Homepage URL**: `https://philip-memorial-html-a-little-better.com`
   - **Authorization callback URL**: `https://api.netlify.com/auth/done`
   - Click **"Register application"**

3. **Get credentials:**
   - You'll see **Client ID** (copy it)
   - Click **"Generate a new client secret"**
   - Copy the **Client Secret**

### Step 2: Add to Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Click your memorial project
3. **Settings** → **Environment Variables**
4. **Remove** the old TinaCMS variables (TINA_CLIENT_ID and TINA_TOKEN)
5. **Add new ones:**

**Variable 1:**
- Name: `OAUTH_GITHUB_CLIENT_ID`
- Value: [Your GitHub OAuth Client ID]
- Environments: All

**Variable 2:**
- Name: `OAUTH_GITHUB_CLIENT_SECRET`
- Value: [Your GitHub OAuth Client Secret]
- Environments: All

### Step 3: Deploy

```bash
git add .
git commit -m "Switch to Netlify CMS"
git push
```

### Step 4: Access Admin

Go to: `https://philip-memorial-html-a-little-better.com/admin`

Click **"Login with GitHub"**

---

## ✅ What You Can Do:

- ✅ Add new memorials
- ✅ Edit existing memorials
- ✅ Upload photos
- ✅ Delete memorials
- ✅ All changes saved to GitHub automatically!

---

## 📝 Notes:

- **Much simpler** than TinaCMS
- **No branch indexing** required
- **Works immediately** with Vercel
- **Free forever**
- **Saves to GitHub** (version controlled)

---

**Follow the steps above and your admin will work!** 🎉
