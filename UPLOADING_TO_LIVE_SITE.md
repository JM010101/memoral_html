# How to Update Your Live Memorial Site

## For Non-Technical Users

This guide explains how to add or edit memorials on your live website.

---

## Method 1: Using Hosting File Manager (Easiest)

### Step 1: Prepare Your Changes Locally

1. **Open your project folder** on your computer
2. **Open `admin.html`** in a web browser (double-click the file)
3. **Add or edit** your memorial:
   - Fill in the form
   - Upload photos
   - Click "Add Memorial"
4. **Download the `memorials.json` file** that's created
5. **Note the photo filenames** it creates

### Step 2: Upload to Your Live Site

#### Using File Manager:

1. **Log into your hosting** (the company where your website is hosted)
2. **Find "File Manager"** in your control panel
3. **Navigate to your website folder**
4. **Go to the `data` folder**
5. **Delete the old `memorials.json`** 
6. **Upload the new `memorials.json`** you downloaded
7. **Go to the `images` folder**
8. **Upload your new photos**
9. **Done!** Visit your website to see changes

#### Using FTP (FileZilla):

1. **Open FileZilla** (download free from filezilla-project.org)
2. **Connect to your site:**
   - Host: `ftp.yourdomain.com`
   - Username: (from your hosting)
   - Password: (from your hosting)
3. **Left side = Your computer**, **Right side = Your website**
4. **On the right, go to `data` folder**
5. **Drag new `memorials.json` from left to right**
6. **On the right, go to `images` folder**
7. **Drag new photos from left to right**
8. **Done!**

---

## Method 2: Email to Web Admin

If someone else manages your website:

### What to Send:

1. **Email subject:** "New Memorial to Add"
2. **Attach:**
   - All photos (properly named)
   - A document with:
     - Full name
     - Birth date (YYYY-MM-DD format)
     - Death date (YYYY-MM-DD format)
     - Complete tribute text
     - Photo descriptions for each image

### Example Email:

```
Subject: New Memorial to Add - Jane Doe

Please add this memorial:

Name: Jane Doe
Birth: 1975-06-10
Death: 2024-02-15

Tribute:
Jane was a beloved teacher who inspired countless 
students over her 30-year career. She had a passion 
for literature and loved sharing her enthusiasm with 
others.

Photos attached:
1. jane-doe-classroom.jpg - "Jane in her classroom"
2. jane-doe-graduation.jpg - "Jane at graduation"
```

---

## Method 3: Direct Database Access (Advanced)

If your hosting supports it:

1. Log into hosting control panel
2. Find JSON editor or text file editor
3. Edit `data/memorials.json` directly
4. Upload photos to `images/` folder

---

## Quick Reference: What Files to Update

### To Add a Memorial:

**Files to change:**
- `data/memorials.json` (add new entry)
- `images/` folder (add photos)

**Don't touch:**
- `index.html`
- `memorials.html`
- `memorial.html`
- `styles.css`
- `script.js`

---

## Troubleshooting

### Photos Not Showing
- ✓ Check filename matches JSON exactly
- ✓ Check photo is in `images/` folder
- ✓ Check file extension (.jpg, .png, .avif)
- ✓ Clear browser cache (Ctrl+F5)

### Memorial Not Appearing
- ✓ Check `memorials.json` was uploaded
- ✓ Check JSON syntax (use jsonlint.com)
- ✓ Check for commas between entries
- ✓ Refresh website (Ctrl+F5)

### Changes Not Visible
- ✓ Clear browser cache
- ✓ Wait 5 minutes (some hosts cache)
- ✓ Try in private/incognito window
- ✓ Check file actually uploaded

---

## Backup Before Changing

**Always backup before making changes:**

1. Download current `memorials.json`
2. Save with date: `memorials-2024-01-20.json`
3. Keep last 3 backups
4. Store in safe place (cloud drive, external drive)

---

## Getting FTP Credentials

**Don't have FTP info?**

1. Log into your hosting account
2. Look for:
   - "FTP Accounts"
   - "File Transfer"
   - "FTP Access"
3. You'll see:
   - FTP Host (e.g., `ftp.yourdomain.com`)
   - Username
   - Password (may need to reset)
   - Port (usually 21)

**Or contact your hosting support** and ask:
> "I need my FTP credentials to upload files to my website"

---

## Common Hosting Panels

### cPanel:
Files → File Manager → public_html

### Plesk:
Files → File Manager

### DirectAdmin:
File Manager

### Custom Panel:
Look for "Files", "File Manager", or "FTP"

---

## Video Tutorials

Search YouTube for:
- "How to use FileZilla"
- "How to upload files via cPanel"
- "[Your hosting name] file manager tutorial"

---

## Need More Help?

Contact your hosting support and say:

> "I need help uploading files to my website. 
> Specifically, I need to update a JSON file in 
> the 'data' folder and upload images to the 
> 'images' folder."

They can walk you through your specific control panel.

---

**Remember: Always test changes locally first before uploading to live site!**
