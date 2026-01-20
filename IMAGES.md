# Images Reference

This document lists all images used in the memorial website and their sources.

## Image Sources

All images are sourced from **Unsplash** (https://unsplash.com), a free stock photography platform that provides high-quality images for commercial and personal use.

## Hero Section Background (Home Page)

- **Image**: Peaceful memorial scene with candles
- **URL**: `https://images.unsplash.com/photo-1518709268805-4e9042af2176`
- **Usage**: Background for the hero section on the home page
- **License**: Free to use (Unsplash License)

## Memorials Page Header Background

- **Image**: Serene nature scene
- **URL**: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4`
- **Usage**: Background for the "All Memorials" page header
- **License**: Free to use (Unsplash License)

## Memorial Photos

All memorial photos are professional portraits from Unsplash:

### John Smith
- Photo 1: Professional male portrait
- Photo 2: Professional male portrait

### Mary Johnson
- Photo 1: Professional female portrait
- Photo 2: Professional female portrait

### Robert Williams
- Photo 1: Professional male portrait
- Photo 2: Professional male portrait
- Photo 3: Professional male portrait

## Replacing Images

### To Use Your Own Images:

1. **For Memorial Photos:**
   - Place images in the `images/` folder
   - Update `data/memorials.json` with local paths:
     ```json
     "photos": [
       "images/person-name-1.jpg",
       "images/person-name-2.jpg"
     ]
     ```

2. **For Background Images:**
   - Option 1: Use Unsplash URLs (current approach)
   - Option 2: Download images and use local paths:
     - Save image to `images/` folder
     - Update HTML: `background-image: url('images/hero-bg.jpg')`

### Finding Replacement Images:

If you need to replace any images, search Unsplash for:
- "memorial" - for background images
- "portrait" or "professional portrait" - for memorial photos
- "elderly portrait" - for age-appropriate memorial photos

**Unsplash Search**: https://unsplash.com/s/photos/memorial

## Image Optimization

All Unsplash images are loaded with optimized parameters:
- Width: 800-1920px (depending on use)
- Quality: 80% (good balance of quality and file size)
- Fit: crop (ensures consistent sizing)

## License Information

All images from Unsplash are:
- ✅ Free to use
- ✅ Free for commercial use
- ✅ No attribution required (though appreciated)
- ✅ No permission needed

For more information: https://unsplash.com/license

## Note for Production

For a production memorial website with real memorials:
1. **Always use actual photos** of the memorialized individuals when available
2. Use placeholder images only when personal photos are not available
3. Ensure you have permission to use any photos you upload
4. Consider using a local image hosting solution for better performance and privacy
