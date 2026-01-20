# Testing the Memorial Website

## Quick Test (1 Minute)

1. **Open the website:**
   - Double-click `index.html` to open in your browser
   - OR start a local server (see below)

2. **What you should see:**
   - ✅ Home page with hero section
   - ✅ "About This Memorial" explanation
   - ✅ 3 memorial cards with placeholder images
   - ✅ "View All Memorials" button

3. **Test navigation:**
   - Click "Memorials" in the top navigation
   - You should see all 3 memorials with search bar

4. **Test individual memorial:**
   - Click on any memorial card
   - You should see:
     - ✅ Person's name
     - ✅ Birth and death dates
     - ✅ Full tribute text
     - ✅ Photo gallery (1-3 images)
     - ✅ Click photos to open lightbox

5. **Test search:**
   - Go to "Memorials" page
   - Type "John" in search box
   - Should show only John Smith

6. **Test lightbox:**
   - Click on any memorial
   - Click on a photo in the gallery
   - Should open full-screen lightbox
   - Use arrows or keyboard to navigate
   - Press ESC or click X to close

## Starting a Local Server

### Why Use a Server?
The website uses `fetch()` to load JSON data, which requires a web server (not just opening files).

### Option 1: Python (if installed)
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

### Option 2: Node.js (if installed)
```bash
npx http-server
```
Then open: http://localhost:8080

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## Core Functionality Checklist

### ✅ Home Page
- [ ] Hero section displays
- [ ] "About This Memorial" section visible
- [ ] 3 memorial cards appear
- [ ] Cards show names and dates
- [ ] Cards show excerpt of tribute
- [ ] Placeholder images display
- [ ] "View All Memorials" button works

### ✅ Navigation
- [ ] "Home" link works
- [ ] "Memorials" link works
- [ ] Logo link returns to home
- [ ] Navigation is sticky/visible

### ✅ Memorials Page
- [ ] All memorials display in grid
- [ ] Search box is visible
- [ ] Search filters results
- [ ] Clear button resets search
- [ ] Shows count of results

### ✅ Individual Memorial Pages
- [ ] Name displays prominently
- [ ] Birth and death dates show (formatted)
- [ ] Full tribute text displays
- [ ] Paragraphs are separated
- [ ] Photo gallery displays
- [ ] All photos load
- [ ] "Back to All Memorials" button works

### ✅ Photo Gallery
- [ ] Gallery grid displays
- [ ] Photos are clickable
- [ ] Lightbox opens on click
- [ ] Full-size photo displays
- [ ] Caption shows (photo X of Y)
- [ ] Previous/Next arrows work
- [ ] Keyboard arrows work (← →)
- [ ] ESC key closes lightbox
- [ ] Close button (X) works

### ✅ Mobile Responsive
- [ ] Open on phone or resize browser
- [ ] Layout adapts to smaller screens
- [ ] Navigation still works
- [ ] Cards stack vertically
- [ ] Text remains readable
- [ ] Photos scale properly

### ✅ Accessibility
- [ ] Tab key navigates through links
- [ ] Skip link appears on Tab
- [ ] Enter key activates links/buttons
- [ ] Lightbox can be navigated with keyboard
- [ ] Screen reader announces content

## Common Issues

### "No memorials available"
- **Cause:** JSON file not loading
- **Fix:** Use a local web server (see above)

### Images not showing
- **Cause:** Internet connection required for placeholder images
- **Fix:** Check internet connection or replace with local images

### Search not working
- **Cause:** JavaScript error
- **Fix:** Check browser console (F12 → Console tab)

### Page looks broken
- **Cause:** CSS not loading
- **Fix:** Use a web server, check file paths

## Browser Console

To check for errors:
1. Press F12 (or right-click → Inspect)
2. Click "Console" tab
3. Look for red error messages
4. Report any errors you see

## Next Steps

Once everything works:

1. **Replace placeholder images:**
   - Add real photos to `images/` folder
   - Update `data/memorials.json` with local paths

2. **Update content:**
   - Edit memorial tributes
   - Update names and dates
   - Add more memorials

3. **Deploy:**
   - See `DEPLOYMENT.md` for hosting instructions

## Need Help?

- Check `README.md` for overview
- See `MAINTAINER_GUIDE.md` for editing instructions
- Review `DEPLOYMENT.md` for hosting help
- Check browser console for errors

---

**Important:** This is a working demo with placeholder images. Replace them with real memorial photos before deploying to production.
