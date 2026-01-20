# Production Setup Guide - Enable Add/Edit/Upload on Live Site

## Your Current Situation

You've deployed to a domain and need users to add/edit memorials. Here are your options:

---

## Option 1: Netlify CMS (Best for GitHub/Netlify)

### ✅ Best If:
- Deployed via GitHub Pages, Netlify, or Vercel
- Want a free, professional solution
- Don't want to write backend code

### Setup Steps:

#### 1. Enable Git Gateway (Netlify)

If on Netlify:
1. Go to your Netlify dashboard
2. Click your site → Settings → Identity
3. Click "Enable Identity"
4. Under "Registration preferences" → Select "Invite only"
5. Services → Enable "Git Gateway"

#### 2. Add Admin Files

Already created in your project:
- `admin/config.yml` ✅
- `admin/index.html` ✅

#### 3. Access Your Admin

Go to: `https://yourdomain.com/admin/`

#### 4. Invite Users

1. In Netlify Dashboard → Identity → Invite users
2. Send invitation email
3. They click link, set password
4. They can now access `/admin/` and add/edit memorials

### Features:
- ✅ Professional admin interface
- ✅ Photo uploads (drag & drop)
- ✅ Git-based (automatic backups)
- ✅ No server costs
- ✅ Automatic deployment after changes

---

## Option 2: PHP Backend (Traditional Hosting)

### ✅ Best If:
- Using traditional web hosting (Bluehost, HostGator, etc.)
- Have PHP support
- Want simple file-based system

### Setup:

Create `api/save-memorial.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Password protection
$password = 'your-secure-password-here'; // CHANGE THIS!

if (!isset($_POST['password']) || $_POST['password'] !== $password) {
    die(json_encode(['error' => 'Unauthorized']));
}

// Handle photo upload
if (isset($_FILES['photos'])) {
    $uploadDir = '../images/';
    $photos = [];
    
    foreach ($_FILES['photos']['tmp_name'] as $key => $tmpName) {
        $fileName = basename($_FILES['photos']['name'][$key]);
        $targetPath = $uploadDir . time() . '_' . $fileName;
        
        if (move_uploaded_file($tmpName, $targetPath)) {
            $photos[] = [
                'url' => 'images/' . basename($targetPath),
                'alt' => $_POST['photo_alts'][$key] ?? ''
            ];
        }
    }
}

// Load existing memorials
$jsonFile = '../data/memorials.json';
$memorials = json_decode(file_get_contents($jsonFile), true);

// Add new memorial
$newMemorial = [
    'id' => $_POST['id'],
    'name' => $_POST['name'],
    'birthDate' => $_POST['birthDate'],
    'deathDate' => $_POST['deathDate'],
    'tribute' => $_POST['tribute'],
    'photos' => $photos
];

$memorials[] = $newMemorial;

// Save
file_put_contents($jsonFile, json_encode($memorials, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
?>
```

Then update `admin.html` to submit to this PHP file instead of downloading JSON.

---

## Option 3: Use Hosting File Manager (Simplest)

### ✅ Best If:
- Want the simplest approach
- Comfortable with file manager
- Only 1-2 people updating site

### Steps:

#### 1. Use Local Admin Panel

1. Open `admin.html` on your computer (offline)
2. Add/edit memorials
3. Download the updated `memorials.json`

#### 2. Upload via Hosting

**Method A: File Manager (Most hosts have this)**
1. Log into your hosting control panel (cPanel, Plesk, etc.)
2. Open File Manager
3. Navigate to your site's `data/` folder
4. Upload the new `memorials.json` (replace old one)
5. For photos: Upload to `images/` folder
6. Done! Refresh site to see changes

**Method B: FTP (FileZilla)**
1. Open FileZilla
2. Connect to your site (host/username/password from hosting)
3. Navigate to `data/` folder
4. Drag new `memorials.json` from computer to server
5. Navigate to `images/` folder
6. Drag new photos from computer to server

### Documentation for Users:

I'll create a simple guide: `UPLOADING_TO_LIVE_SITE.md`

---

## Option 4: Headless CMS Services

### ✅ Best If:
- Want professional CMS features
- Multiple content editors
- Need version control

### Services to Consider:

**Sanity.io** (Free tier)
- Best: Full-featured CMS
- Setup: 30 minutes
- Cost: Free for small sites

**Contentful** (Free tier)
- Best: Easy to use
- Setup: 20 minutes
- Cost: Free for 1-2 users

**Forestry.io** (Free tier)
- Best: Git-based, simple
- Setup: 15 minutes
- Cost: Free for small sites

---

## Option 5: Google Sheets + API

### ✅ Best If:
- Want to use Google Sheets
- Non-technical users
- Free solution

### How it works:
1. Create Google Sheet with columns: Name, Birth, Death, Tribute, Photo URLs
2. Use Google Apps Script to serve as JSON
3. Site reads from this JSON
4. Users edit the Google Sheet

---

## Recommended Setup Based on Hosting:

### If you're on:

**GitHub Pages**
→ Use **Option 1: Netlify CMS** (switch to Netlify for CMS features)

**Netlify**
→ Use **Option 1: Netlify CMS** (easiest!)

**Traditional Hosting (cPanel/PHP)**
→ Use **Option 2: PHP Backend** or **Option 3: File Manager**

**Vercel**
→ Use **Option 1: Netlify CMS** (similar setup)

**Don't know / Basic hosting**
→ Use **Option 3: File Manager** (works everywhere)

---

## Quick Decision Tree:

```
Do you have PHP support?
├─ YES → Option 2 (PHP Backend)
└─ NO
    ├─ Using GitHub/Netlify/Vercel?
    │   └─ YES → Option 1 (Netlify CMS) ⭐ BEST
    └─ NO → Option 3 (File Manager) ⭐ SIMPLEST
```

---

## Security Notes

### Important for Live Sites:

1. **Password Protect Admin Page**
   - Add `.htaccess` file:
   ```apache
   AuthType Basic
   AuthName "Restricted Area"
   AuthUserFile /path/to/.htpasswd
   Require valid-user
   ```

2. **Use HTTPS**
   - Most hosts offer free SSL (Let's Encrypt)
   - Enable in your hosting control panel

3. **Backup Regularly**
   - Keep copies of `memorials.json`
   - Download photos folder monthly

4. **Limit File Uploads**
   - Max size: 5MB per photo
   - Allowed types: JPG, PNG, AVIF only

---

## Need Help?

### Tell me:
1. **What hosting are you using?** (Netlify, GitHub Pages, Bluehost, etc.)
2. **Do you have PHP support?** (check your hosting control panel)
3. **How many people will edit the site?** (just you, or multiple users?)

I'll provide specific setup instructions for your situation!

---

## Testing Before Going Live

1. Test admin on localhost first
2. Try adding a test memorial
3. Verify it appears on the site
4. Test on mobile devices
5. Check photo uploads work
6. Test edit and delete functions

---

*Choose the option that matches your hosting setup and technical comfort level!*
