# Memorial Website

A simple, respectful memorial website built with HTML, CSS, and JavaScript. This static website requires no database or server-side processing, making it easy to host on any basic, low-cost hosting service.

## Why This Approach?

This website is built for **longevity and simplicity**:
- ✅ No WordPress, Wix, or Squarespace
- ✅ Runs on basic, low-cost hosting (or free)
- ✅ Easy to maintain by non-developers
- ✅ No dependencies that will break over time
- ✅ Built to last for years

## Features

- Clean, respectful design suitable for memorial pages
- Mobile-responsive and accessible
- Photo gallery with lightbox
- Search functionality
- Easy content management through JSON file
- No frameworks or dependencies
- Works offline once loaded
- Print-friendly

## Project Structure

```
memoral_html/
├── index.html          # Home page
├── memorials.html      # List all memorials
├── memorial.html       # Individual memorial page template
├── styles.css          # All styles
├── script.js           # JavaScript functionality
├── data/
│   └── memorials.json  # Memorial data (EDIT THIS FILE)
├── images/             # Place memorial photos here
│   ├── hero-background.jpg
│   ├── memorials-background.jpg
│   └── memorial-hero-background.jpg
└── README.md           # This file
```

---

## Quick Start (5 Minutes)

### 1. Add Photos

Place photos in the `images/` folder with descriptive names:
- Example: `john-smith-garden.jpg`
- Example: `mary-johnson-reading.jpg`

### 2. Edit the JSON File

Open `data/memorials.json` in any text editor (Notepad, TextEdit, etc.)

Copy this template:

```json
{
  "id": "memorial-4",
  "name": "Person's Full Name",
  "birthDate": "1950-01-15",
  "deathDate": "2024-01-15",
  "tribute": "Write your tribute here.\n\nUse \\n for new paragraphs.",
  "photos": [
    {
      "url": "images/person-name-1.jpg",
      "alt": "Describe what's in the photo for screen readers"
    },
    {
      "url": "images/person-name-2.jpg",
      "alt": "Another descriptive alt text"
    }
  ]
}
```

### 3. Add to the Array

- Find the closing bracket `]` at the end of the file
- Add a comma after the last `}` before the `]`
- Paste your new entry
- Save the file

### 4. Test

Open `index.html` in a web browser. Your memorial should appear!

---

## Detailed Instructions

### Adding a Memorial (Step-by-Step)

#### Step 1: Prepare Your Photos

**Photo Guidelines:**
- Format: JPG or PNG
- Size: 800x600px recommended (or similar 4:3 ratio)
- File size: Under 200KB each (use TinyPNG.com to compress)
- Maximum: 6 photos per memorial
- Naming: Use lowercase, hyphens, descriptive names

**Good names:**
- `john-smith-garden.jpg`
- `mary-johnson-nursing-uniform.jpg`

**Bad names:**
- `IMG_1234.jpg`
- `Photo 1.JPG`

#### Step 2: Write Descriptive Alt Text

Alt text helps screen readers describe images to visually impaired visitors.

**Good alt text:**
- "John Smith smiling in his garden, surrounded by blooming roses"
- "Mary Johnson in her nurse's uniform at the hospital where she worked"

**Bad alt text:**
- "Photo 1"
- "John Smith"

#### Step 3: Edit memorials.json

**Important JSON Rules:**
1. All text must be in "quotes"
2. Use commas between entries
3. NO comma after the last entry
4. Use `\n` for line breaks in tribute text
5. Dates format: `YYYY-MM-DD` (e.g., "1950-01-15")

**Example Entry:**

```json
{
  "id": "memorial-4",
  "name": "Jane Doe",
  "birthDate": "1975-06-10",
  "deathDate": "2024-02-15",
  "tribute": "Jane Doe was a wonderful person who brought joy to everyone she met.\n\nShe was passionate about teaching and loved spending time with her family.",
  "photos": [
    {
      "url": "images/jane-doe-1.jpg",
      "alt": "Jane Doe smiling at her retirement party"
    },
    {
      "url": "images/jane-doe-2.jpg",
      "alt": "Jane Doe reading to her grandchildren"
    }
  ]
}
```

#### Step 4: Validate Your Changes

Before uploading:
1. Check for typos in image filenames
2. Make sure all quotes match
3. Verify commas are correct
4. Test locally by opening `index.html`

---

## Common Tasks

### Edit an Existing Memorial

1. Open `data/memorials.json`
2. Find the memorial by searching for the name
3. Make your changes
4. Save the file
5. Test locally, then upload

### Remove a Memorial

1. Open `data/memorials.json`
2. Delete the entire entry (from `{` to `}`)
3. Remove the comma before or after if needed
4. Save and upload

### Change Colors

1. Open `styles.css`
2. Find the `:root` section at the top
3. Change color values:

```css
:root {
    --primary-color: #2c3e50;      /* Dark blue-gray */
    --secondary-color: #34495e;    /* Slightly lighter */
    --accent-color: #7f8c8d;       /* Gray for accents */
}
```

### Change Site Title

Edit all three HTML files (`index.html`, `memorials.html`, `memorial.html`):

Find: `<a href="index.html" class="logo">In Memory</a>`

Change "In Memory" to your preferred title.

---

## Deployment

### Option 1: GitHub Pages (Free, Recommended)

1. Create a GitHub account (free)
2. Create a new repository
3. Upload all files
4. Go to Settings → Pages
5. Select main branch
6. Your site will be at: `username.github.io/repository-name`

**Detailed guide:** See `DEPLOYMENT.md`

### Option 2: Netlify (Free, Drag-and-Drop)

1. Go to netlify.com
2. Drag your project folder onto the page
3. Done! Your site is live

### Option 3: Traditional Web Hosting

Upload all files via FTP to your hosting provider's public directory:
- Usually named: `public_html`, `www`, or `htdocs`
- Use FileZilla (free FTP client)

**Cost:** $3-10/month for basic hosting

---

## Troubleshooting

### Photos Not Showing

**Check:**
- ✓ Image filename matches exactly (case-sensitive)
- ✓ Image is in the `images/` folder
- ✓ Path in JSON uses forward slashes: `images/photo.jpg`
- ✓ File uploaded to server

### JSON Errors

**Common mistakes:**
- Missing comma between entries
- Extra comma after last entry
- Unmatched quotes
- Wrong date format

**Solution:** Use JSONLint.com to validate your JSON

### Website Not Working

1. Open browser console (F12 → Console tab)
2. Look for error messages
3. Check that all files are uploaded
4. Verify you're using a web server (not just opening files)

---

## Browser Compatibility

Works in all modern browsers:
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Internet Explorer 11+ (with limitations)

---

## Accessibility

This website follows WCAG 2.1 AA standards:
- ✓ Keyboard navigation
- ✓ Screen reader compatible
- ✓ Proper color contrast
- ✓ Descriptive alt text
- ✓ Skip navigation links
- ✓ ARIA labels

---

## Maintenance

### Regular Tasks

**Monthly:**
- Check that all images load
- Test on mobile device
- Verify search works

**As Needed:**
- Add new memorials
- Update existing tributes
- Add new photos

### Backup

**Important:** Keep backups of:
1. `data/memorials.json` file
2. All photos in `images/` folder
3. Any customizations to CSS

---

## Support

### Getting Help

1. Check this README
2. See `MAINTAINER_GUIDE.md` for visual guides
3. See `DEPLOYMENT.md` for hosting help
4. Check browser console for errors

### Common Questions

**Q: Can I add videos?**
A: Not built-in, but you can link to YouTube/Vimeo

**Q: How many memorials can I add?**
A: Unlimited, but performance may slow after 100+

**Q: Can I password protect the site?**
A: Yes, through your hosting provider's settings

**Q: Do I need to know coding?**
A: No! Just edit the JSON file following the examples

---

## Technical Details

### For Developers

- Pure HTML5, CSS3, ES6 JavaScript
- No build process required
- No dependencies
- Lazy loading images
- Semantic HTML
- CSS Grid and Flexbox
- LocalStorage for future enhancements

### File Sizes

- Total: ~50KB (excluding images)
- HTML: ~10KB
- CSS: ~20KB
- JS: ~10KB

---

## License

This code is provided as-is for use in memorial websites. Feel free to customize and use for your memorial site.

---

## Credits

Built with care, restraint, and respect for honoring real lives.

**Design Principles:**
- Simplicity over complexity
- Longevity over trends
- Accessibility over aesthetics
- Maintainability over features

---

*Last updated: January 2026*
