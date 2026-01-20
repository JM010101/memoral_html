# Memorial Website - Maintainer Guide

This guide is for non-technical users who need to maintain the memorial website. No coding knowledge required!

---

## Table of Contents

1. [Adding a Memorial](#adding-a-memorial)
2. [Editing a Memorial](#editing-a-memorial)
3. [Removing a Memorial](#removing-a-memorial)
4. [Managing Photos](#managing-photos)
5. [Common Mistakes](#common-mistakes)
6. [Uploading Changes](#uploading-changes)

---

## Adding a Memorial

### What You Need

- Photos of the person (1-6 images)
- Their full name
- Birth and death dates
- A written tribute

### Step-by-Step Instructions

#### 1. Prepare Photos

**Before uploading:**

1. **Resize photos** to 800x600 pixels
   - Use a free tool like:
     - Windows: Paint, Photos app
     - Mac: Preview
     - Online: Pixlr.com, Canva.com

2. **Compress photos** to reduce file size
   - Go to TinyPNG.com
   - Upload your photos
   - Download compressed versions

3. **Rename photos** descriptively
   - Good: `john-smith-garden.jpg`
   - Bad: `IMG_1234.jpg`

4. **Save photos** to the `images/` folder

#### 2. Open the Data File

1. Navigate to the `data/` folder
2. Open `memorials.json` with a text editor:
   - Windows: Notepad
   - Mac: TextEdit
   - Or use: Notepad++, VS Code

#### 3. Add Your Entry

**Copy this template:**

```json
{
  "id": "memorial-4",
  "name": "Full Name Here",
  "birthDate": "1950-01-15",
  "deathDate": "2024-01-15",
  "tribute": "Write the tribute here.\n\nUse \\n for new paragraphs.",
  "photos": [
    {
      "url": "images/photo-name-1.jpg",
      "alt": "Describe what's in the photo"
    }
  ]
}
```

**Fill in the details:**

- `id`: Use `memorial-` followed by a number (must be unique)
- `name`: Person's full name
- `birthDate`: Format as YYYY-MM-DD (e.g., "1950-01-15")
- `deathDate`: Format as YYYY-MM-DD
- `tribute`: The memorial text
- `photos`: List of photos with descriptions

**Important:** 
- All text must be in "quotes"
- Use `\n` for line breaks in tribute
- Dates must use the YYYY-MM-DD format

#### 4. Add to the File

**Find the right spot:**

1. Scroll to the bottom of `memorials.json`
2. Find the last `}` before the final `]`
3. Add a comma after that `}`
4. Paste your new entry
5. Make sure there's NO comma after your entry if it's the last one

**Example:**

```json
[
  {
    "id": "memorial-1",
    "name": "Existing Person"
    ...
  },
  {
    "id": "memorial-2",
    "name": "Another Person"
    ...
  },  ← Add comma here
  {
    "id": "memorial-3",
    "name": "New Person"
    ...
  }  ← NO comma here (last entry)
]
```

#### 5. Save and Test

1. Save the file
2. Open `index.html` in a web browser
3. Check that the new memorial appears
4. Click on it to verify everything looks correct

---

## Editing a Memorial

### Changing Text

1. Open `data/memorials.json`
2. Find the memorial (search for the person's name)
3. Edit the text you want to change
4. Save the file

**You can change:**
- Name
- Dates
- Tribute text

**Don't change:**
- The `id` field (this will break links)

### Adding Photos

1. Add new photos to the `images/` folder
2. Find the memorial in `memorials.json`
3. Add to the `photos` array:

```json
"photos": [
  {
    "url": "images/existing-photo.jpg",
    "alt": "Description"
  },
  {
    "url": "images/new-photo.jpg",
    "alt": "New photo description"
  }
]
```

### Removing Photos

1. Find the photo entry in the `photos` array
2. Delete the entire entry (including the `{ }`)
3. Remove the comma if it's now the last photo

---

## Removing a Memorial

### Permanent Deletion

**Warning:** This cannot be undone. Make a backup first!

1. Open `data/memorials.json`
2. Find the memorial to remove
3. Delete the entire entry from `{` to `}`
4. Fix the commas:
   - If it was in the middle: Make sure there's a comma after the previous entry
   - If it was the last entry: Remove the comma from the new last entry
5. Save the file

### Example:

**Before:**
```json
[
  {"id": "memorial-1", ...},
  {"id": "memorial-2", ...},  ← Delete this one
  {"id": "memorial-3", ...}
]
```

**After:**
```json
[
  {"id": "memorial-1", ...},
  {"id": "memorial-3", ...}
]
```

---

## Managing Photos

### Photo Requirements

**Format:**
- JPG for photos
- PNG for images with transparency

**Size:**
- Recommended: 800x600 pixels
- Maximum: 1920x1080 pixels
- File size: Under 200KB each

### Organizing Photos

**Naming Convention:**
```
person-name-description.jpg
```

**Examples:**
- `john-smith-garden.jpg`
- `mary-johnson-nursing.jpg`
- `robert-williams-family.jpg`

### Writing Alt Text

Alt text describes images for visually impaired visitors.

**Good alt text:**
- "John Smith smiling in his garden with roses"
- "Mary Johnson in her nurse's uniform at the hospital"
- "Robert Williams hiking with his family in the mountains"

**Bad alt text:**
- "Photo 1"
- "John Smith"
- "Image"

**Tips:**
- Describe what's in the photo
- Include relevant details
- Keep it under 125 characters
- Don't start with "Photo of..." or "Image of..."

---

## Common Mistakes

### 1. JSON Syntax Errors

**Problem:** Website doesn't load or shows errors

**Common causes:**
- Missing comma between entries
- Extra comma after last entry
- Missing quotes around text
- Unmatched quotes or brackets

**Solution:**
1. Copy your JSON
2. Go to JSONLint.com
3. Paste and click "Validate"
4. Fix any errors shown

### 2. Photos Not Showing

**Problem:** Broken image icons appear

**Checklist:**
- ✓ Photo is in the `images/` folder
- ✓ Filename matches exactly (including capitalization)
- ✓ Path uses forward slashes: `images/photo.jpg`
- ✓ File extension is correct (.jpg not .jpeg)

### 3. Wrong Date Format

**Problem:** Dates don't display correctly

**Wrong:**
- `01/15/1950`
- `January 15, 1950`
- `1950-1-15`

**Right:**
- `1950-01-15`

Always use: `YYYY-MM-DD` with leading zeros

### 4. Line Breaks Not Working

**Problem:** Tribute text runs together

**Solution:** Use `\n` for line breaks

**Example:**
```json
"tribute": "First paragraph.\n\nSecond paragraph.\n\nThird paragraph."
```

---

## Uploading Changes

### Using FTP (FileZilla)

1. **Download FileZilla** (free FTP client)
2. **Get FTP credentials** from your hosting provider
3. **Connect to your server:**
   - Host: ftp.yoursite.com
   - Username: your username
   - Password: your password
4. **Navigate** to your website folder (usually `public_html`)
5. **Upload changed files:**
   - Drag `data/memorials.json` to the server
   - Drag any new images to the `images/` folder

### Using Web Host File Manager

Most hosting providers have a file manager:

1. Log into your hosting control panel
2. Find "File Manager"
3. Navigate to your website folder
4. Click "Upload"
5. Select your files
6. Click "Upload" or "OK"

### Using GitHub (if applicable)

1. Go to your repository on GitHub
2. Click on the file you want to update
3. Click the pencil icon (Edit)
4. Make your changes
5. Scroll down and click "Commit changes"
6. Wait 1-2 minutes for site to update

---

## Testing Checklist

Before uploading to the live site, test locally:

- [ ] Open `index.html` in a web browser
- [ ] New memorial appears on home page
- [ ] Click on memorial to view full page
- [ ] All photos load correctly
- [ ] Text displays properly
- [ ] Dates show correctly
- [ ] Search finds the memorial
- [ ] Test on mobile device (if possible)

---

## Getting Help

### If Something Goes Wrong

1. **Don't panic!** You can always restore from backup
2. **Check the browser console:**
   - Press F12
   - Click "Console" tab
   - Look for error messages
3. **Validate your JSON** at JSONLint.com
4. **Restore from backup** if needed

### Backup Strategy

**Before making changes:**

1. Copy `data/memorials.json` to a safe place
2. Name it with a date: `memorials-2024-01-15.json`
3. Keep the last 3 backups

**Backup locations:**
- External hard drive
- Cloud storage (Dropbox, Google Drive)
- Email to yourself

---

## Quick Reference

### JSON Template

```json
{
  "id": "memorial-X",
  "name": "Full Name",
  "birthDate": "YYYY-MM-DD",
  "deathDate": "YYYY-MM-DD",
  "tribute": "Tribute text here.\n\nNew paragraph.",
  "photos": [
    {
      "url": "images/photo.jpg",
      "alt": "Photo description"
    }
  ]
}
```

### File Locations

- **Memorial data:** `data/memorials.json`
- **Photos:** `images/` folder
- **Styles:** `styles.css`
- **Main pages:** `index.html`, `memorials.html`, `memorial.html`

### Important Rules

1. All text in "quotes"
2. Commas between entries (not after last one)
3. Dates as YYYY-MM-DD
4. Use `\n` for line breaks
5. Forward slashes in paths: `images/photo.jpg`

---

## Tips for Success

1. **Make small changes** and test frequently
2. **Keep backups** before making changes
3. **Use descriptive names** for photos
4. **Write meaningful alt text** for accessibility
5. **Test on mobile** devices
6. **Keep photos under 200KB** for fast loading
7. **Validate JSON** before uploading

---

*Need more help? See the main README.md file or DEPLOYMENT.md for hosting instructions.*
