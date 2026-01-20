# Memorial Website

A simple, respectful memorial website built with HTML, CSS, and JavaScript. This is a static website that requires no database or server-side processing, making it easy to host on any basic web hosting service.

## Features

- Clean, respectful design suitable for memorial pages
- Mobile-responsive layout
- Photo gallery with lightbox functionality
- Search functionality to find memorials
- Easy content management through JSON file
- No dependencies or frameworks required
- Accessible design with proper ARIA labels
- Print-friendly styles

## Project Structure

```
memoral_html/
├── index.html          # Home page
├── memorials.html      # List all memorials
├── memorial.html       # Individual memorial page template
├── styles.css          # All styles
├── script.js           # JavaScript functionality
├── data/
│   └── memorials.json  # Memorial data (edit this to add/update memorials)
├── images/             # Place photos here
└── README.md           # This file
```

## Getting Started

### Local Development

1. **Download or clone** this project to your computer
2. **Open the website** by:
   - Double-clicking `index.html`, or
   - Using a local web server (recommended for testing)

#### Using a Local Web Server

**Python (if installed):**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Node.js (if installed):**
```bash
npx http-server
```

Then open `http://localhost:8000` in your browser.

### Deployment

This website can be deployed to any static web hosting service:

- **GitHub Pages** (free)
- **Netlify** (free tier)
- **Vercel** (free tier)
- **Any traditional web hosting** (shared hosting, VPS, etc.)

Simply upload all files to your web server's public directory (usually `public_html`, `www`, or `htdocs`).

## Adding a New Memorial

To add a new memorial, edit the `data/memorials.json` file. Here's how:

### Step 1: Add Photos

1. Place photos in the `images/` folder
2. Name them descriptively (e.g., `john-smith-1.jpg`, `john-smith-2.jpg`)

**Photo Guidelines:**
- Use JPG or PNG format
- Recommended size: 800-1200px width
- Keep file sizes reasonable (under 2MB per photo)
- Maximum 6 photos per memorial

### Step 2: Edit the JSON File

Open `data/memorials.json` in a text editor and add a new memorial entry. Here's the format:

```json
{
  "id": "unique-id-here",
  "name": "Full Name",
  "birthDate": "YYYY-MM-DD",
  "deathDate": "YYYY-MM-DD",
  "tribute": "Text tribute here. Use \\n for line breaks.",
  "photos": [
    "images/photo1.jpg",
    "images/photo2.jpg"
  ]
}
```

### Example Entry

```json
{
  "id": "memorial-4",
  "name": "Jane Doe",
  "birthDate": "1975-06-10",
  "deathDate": "2024-02-15",
  "tribute": "Jane Doe was a wonderful person who brought joy to everyone she met.\\n\\nShe was passionate about her work as a teacher and loved spending time with her family. Her kindness and generosity will always be remembered.",
  "photos": [
    "images/jane-doe-1.jpg",
    "images/jane-doe-2.jpg"
  ]
}
```

### Important Notes:

1. **ID Field**: Must be unique. Use a simple format like `memorial-4`, `memorial-5`, etc.
2. **Dates**: Use format `YYYY-MM-DD` (year-month-day). You can omit dates if not available.
3. **Tribute**: 
   - Use `\n` for line breaks
   - Keep it respectful and meaningful
   - No HTML tags needed
4. **Photos**: 
   - List the file paths relative to the root directory
   - Use forward slashes `/` even on Windows
   - Photo is optional - you can use an empty array `[]` if no photos
5. **JSON Format**: 
   - Make sure all entries are separated by commas
   - The last entry should NOT have a trailing comma
   - All text must be in quotes

### Step 3: Test Locally

After editing, test the website locally to make sure:
- The new memorial appears on the memorials page
- The memorial page displays correctly
- Photos load properly
- Text formatting looks good

### Step 4: Upload to Server

Upload the updated `data/memorials.json` file and any new images to your web server.

## Editing an Existing Memorial

1. Open `data/memorials.json`
2. Find the memorial entry by ID or name
3. Make your changes:
   - Edit the name, dates, or tribute text
   - Add/remove photos from the photos array
   - Update photo filenames if you've renamed images
4. Save the file
5. Test locally, then upload to server

## Removing a Memorial

1. Open `data/memorials.json`
2. Find and delete the entire memorial entry (including the curly braces)
3. Remove the comma before or after the deleted entry if needed
4. Save and upload

## Customization

### Changing Colors

Edit `styles.css` and look for the CSS variables at the top:

```css
:root {
    --primary-color: #2c3e50;      /* Main color for headers, buttons */
    --secondary-color: #34495e;    /* Hover states */
    --accent-color: #7f8c8d;       /* Secondary buttons */
    /* ... */
}
```

Change these values to customize the color scheme.

### Changing Site Title

1. Edit `index.html`, `memorials.html`, and `memorial.html`
2. Find the `<a href="index.html" class="logo">In Memory</a>` line
3. Change "In Memory" to your preferred title

### Editing Home Page Text

Edit the text in `index.html` within the `<section class="intro">` section.

### Changing Footer

Edit the footer text in all HTML files (search for `<footer>`).

## Browser Compatibility

This website works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Photos Not Showing

- Check that image filenames match exactly (case-sensitive on some servers)
- Verify the path in JSON uses forward slashes: `images/photo.jpg`
- Make sure images are in the `images/` folder
- Check file permissions on your web server

### JSON Errors

- Use a JSON validator online to check for syntax errors
- Make sure all quotes are straight quotes (") not curly quotes ("")
- Check for trailing commas before closing brackets/braces
- Ensure all text is properly escaped

### Website Not Working

- Make sure you're using a web server (not just opening files directly)
- Check browser console for errors (F12 → Console tab)
- Verify all files are uploaded to the server
- Check that file paths are correct

## Support

For questions or issues:
1. Check the troubleshooting section above
2. Verify your JSON syntax with an online validator
3. Test in a different browser
4. Check browser console for error messages

## License

This project is provided as-is for use in memorial websites.

## Credits

Built with care and respect for honoring memories. Simple, stable, and built to last.
