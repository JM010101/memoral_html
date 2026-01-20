# Images Directory

This folder contains all images for the memorial website.

## Required Images

### Background Images
- `hero-background.jpg` - Home page hero background (recommended size: 1920x1080px)
- `memorials-background.jpg` - Memorials page header background (recommended size: 1920x600px)
- `memorial-hero-background.jpg` - Individual memorial page hero background (recommended size: 1920x400px)

### Memorial Photos
Place individual memorial photos here with descriptive filenames:
- Example: `john-smith-1.jpg`, `john-smith-2.jpg`
- Example: `mary-johnson-1.jpg`

## Image Guidelines

### File Formats
- Use JPG for photographs
- Use PNG for images with transparency
- Avoid GIF unless necessary

### File Sizes
- Keep photos under 200KB each
- Optimize images before uploading
- Use tools like TinyPNG or ImageOptim

### Image Dimensions
- Memorial photos: 800x600px (or similar 4:3 ratio)
- Background images: See sizes above
- Maintain aspect ratios to avoid distortion

### File Naming
- Use lowercase letters
- Use hyphens instead of spaces
- Be descriptive: `john-smith-garden.jpg` not `img1.jpg`
- Include person's name in memorial photos

## Creating Placeholder Images

If you need placeholder images for testing:

1. Use a solid color background (soft gray: #e0e0e0)
2. Add text indicating it's a placeholder
3. Match the recommended dimensions
4. Name them clearly: `placeholder-male.jpg`, `placeholder-female.jpg`

## Alt Text

Remember to add descriptive alt text in the `memorials.json` file for each image. Good alt text describes:
- Who is in the photo
- What they're doing
- Where they are
- Important visual details

Example:
```json
{
  "url": "images/john-smith-1.jpg",
  "alt": "John Smith smiling warmly in his garden, surrounded by blooming roses"
}
```
