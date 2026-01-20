# Deployment Guide - Memorial Website

This guide explains how to deploy your memorial website to the internet. Written for non-technical users.

---

## Choosing a Hosting Option

### Comparison Table

| Option | Cost | Difficulty | Best For |
|--------|------|------------|----------|
| **GitHub Pages** | Free | Easy | Most users |
| **Netlify** | Free | Very Easy | Drag-and-drop simplicity |
| **Traditional Hosting** | $3-10/month | Medium | Those with existing hosting |

---

## Option 1: GitHub Pages (Recommended)

**Cost:** Free forever  
**Custom domain:** Yes (optional)  
**Difficulty:** Easy

### Step-by-Step

#### 1. Create a GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Choose a username (this will be in your URL)
4. Verify your email

#### 2. Create a New Repository

1. Click the "+" icon (top right)
2. Select "New repository"
3. Name it: `memorial-website` (or any name you like)
4. Make it **Public**
5. Click "Create repository"

#### 3. Upload Your Files

**Method A: Web Interface (Easiest)**

1. Click "uploading an existing file"
2. Drag all your website files into the box
3. Click "Commit changes"

**Method B: GitHub Desktop (Better for updates)**

1. Download [GitHub Desktop](https://desktop.github.com)
2. Install and sign in
3. Clone your repository
4. Copy your website files into the folder
5. Commit and push changes

#### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Click "Pages" in the left sidebar
4. Under "Source", select "main" branch
5. Click "Save"
6. Wait 1-2 minutes

#### 5. View Your Site

Your site will be at:
```
https://your-username.github.io/memorial-website/
```

### Adding a Custom Domain

If you own a domain (like `memorial.com`):

1. Go to your repository Settings → Pages
2. Enter your custom domain
3. Follow the DNS instructions provided
4. Wait 24-48 hours for DNS to propagate

---

## Option 2: Netlify (Easiest)

**Cost:** Free forever  
**Custom domain:** Yes (optional)  
**Difficulty:** Very Easy

### Step-by-Step

#### 1. Create Account

1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up"
3. Sign up with email or GitHub

#### 2. Deploy Your Site

**Method A: Drag and Drop**

1. Click "Add new site" → "Deploy manually"
2. Drag your entire project folder onto the page
3. Wait 30 seconds
4. Done! Your site is live

**Method B: Connect to GitHub**

1. Click "Add new site" → "Import an existing project"
2. Choose GitHub
3. Select your repository
4. Click "Deploy site"
5. Automatic updates when you push to GitHub

#### 3. View Your Site

Netlify gives you a random URL like:
```
https://random-name-12345.netlify.app
```

#### 4. Custom Domain (Optional)

1. Click "Domain settings"
2. Click "Add custom domain"
3. Follow the instructions
4. Update your domain's DNS settings

---

## Option 3: Traditional Web Hosting

**Cost:** $3-10/month  
**Custom domain:** Usually included  
**Difficulty:** Medium

### Recommended Hosts

- **Bluehost** - $3.95/month
- **HostGator** - $2.75/month
- **SiteGround** - $3.99/month
- **DreamHost** - $2.59/month

### Step-by-Step

#### 1. Purchase Hosting

1. Choose a hosting provider
2. Select "Shared Hosting" plan
3. Choose a domain name (or use existing)
4. Complete purchase

#### 2. Get FTP Credentials

Your host will email you:
- FTP hostname (e.g., `ftp.yoursite.com`)
- Username
- Password

#### 3. Download FTP Client

**FileZilla (Free, Recommended)**

1. Go to [filezilla-project.org](https://filezilla-project.org)
2. Download FileZilla Client
3. Install

**Alternatives:**
- Cyberduck (Mac)
- WinSCP (Windows)

#### 4. Connect to Your Server

1. Open FileZilla
2. Enter your FTP credentials:
   - Host: `ftp.yoursite.com`
   - Username: from email
   - Password: from email
   - Port: 21
3. Click "Quickconnect"

#### 5. Upload Files

1. On the left: Navigate to your website folder on your computer
2. On the right: Navigate to `public_html` or `www` folder
3. Select all your website files
4. Right-click → Upload
5. Wait for upload to complete

#### 6. View Your Site

Go to your domain in a web browser:
```
https://yourdomain.com
```

---

## Updating Your Site

### GitHub Pages

**Method 1: Web Interface**
1. Go to your repository
2. Click on the file to update
3. Click the pencil icon (Edit)
4. Make changes
5. Scroll down, click "Commit changes"
6. Wait 1-2 minutes for update

**Method 2: GitHub Desktop**
1. Make changes to local files
2. Open GitHub Desktop
3. Write commit message
4. Click "Commit to main"
5. Click "Push origin"

### Netlify

**If using drag-and-drop:**
1. Go to your site dashboard
2. Click "Deploys"
3. Drag updated folder onto the page

**If connected to GitHub:**
- Push changes to GitHub
- Netlify updates automatically

### Traditional Hosting

1. Open FileZilla
2. Connect to your server
3. Navigate to the file you changed
4. Drag the new version from left to right
5. Confirm overwrite

---

## Common Issues

### GitHub Pages Not Working

**Problem:** 404 error or site not found

**Solutions:**
- Wait 2-5 minutes after enabling Pages
- Check that you selected the correct branch
- Verify files are in the root of the repository
- Make sure repository is public

### Netlify Deploy Failed

**Problem:** Red "Deploy failed" message

**Solutions:**
- Check that you uploaded the entire folder
- Verify all files are included
- Try deploying again
- Check the deploy log for errors

### FTP Connection Failed

**Problem:** Can't connect to server

**Solutions:**
- Verify FTP credentials are correct
- Try port 22 instead of 21 (SFTP)
- Check if your host uses SFTP instead of FTP
- Disable firewall temporarily
- Contact your hosting support

### Images Not Loading

**Problem:** Broken image icons

**Solutions:**
- Verify images uploaded to `images/` folder
- Check filename capitalization matches JSON
- Ensure images are in the correct format (JPG/PNG)
- Clear browser cache (Ctrl+F5)

---

## SSL Certificate (HTTPS)

### Why You Need It

- Secure connection
- Better SEO
- Required for some features
- Professional appearance

### How to Get It

**GitHub Pages:**
- Automatic and free
- Enable in Settings → Pages → "Enforce HTTPS"

**Netlify:**
- Automatic and free
- Enabled by default

**Traditional Hosting:**
- Usually free with hosting
- Enable in control panel
- Look for "Let's Encrypt" or "SSL Certificate"
- May need to contact support

---

## Custom Domain Setup

### Purchasing a Domain

**Where to buy:**
- Namecheap - $8-12/year
- Google Domains - $12/year
- GoDaddy - $12-20/year

### Connecting Domain to GitHub Pages

1. In GitHub: Settings → Pages → Custom domain
2. Enter your domain: `yourdomain.com`
3. In your domain registrar:
   - Add A records pointing to:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Add CNAME record: `www` → `username.github.io`
4. Wait 24-48 hours

### Connecting Domain to Netlify

1. In Netlify: Domain settings → Add custom domain
2. Follow the instructions provided
3. Update DNS at your domain registrar
4. Wait 24-48 hours

---

## Backup Strategy

### What to Backup

1. `data/memorials.json` (most important!)
2. All photos in `images/` folder
3. Any customizations to CSS/HTML

### Where to Store Backups

**Option 1: Cloud Storage**
- Google Drive
- Dropbox
- OneDrive

**Option 2: External Drive**
- USB drive
- External hard drive

**Option 3: Email**
- Email files to yourself
- Create a "Website Backup" folder

### Backup Schedule

- **Before any changes:** Always backup first
- **Weekly:** If updating frequently
- **Monthly:** For stable sites
- **Keep 3 versions:** Last 3 backups

---

## Performance Tips

### Optimize Images

1. **Resize before uploading**
   - Use 800x600px for memorial photos
   - Use appropriate size for backgrounds

2. **Compress images**
   - Use TinyPNG.com
   - Or Squoosh.app
   - Target: Under 200KB per image

3. **Use correct format**
   - JPG for photos
   - PNG for transparency
   - Avoid BMP or TIFF

### Test Speed

1. Go to [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter your URL
3. Review recommendations
4. Aim for 90+ score

---

## Security

### Best Practices

1. **Use strong passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - Use a password manager

2. **Enable 2FA**
   - GitHub: Settings → Security
   - Netlify: Account settings → Security
   - Hosting: Control panel → Security

3. **Keep backups**
   - Regular backups prevent data loss
   - Store in multiple locations

4. **Update regularly**
   - Check for security updates
   - Keep hosting software updated

---

## Cost Breakdown

### Free Options

**GitHub Pages:**
- Hosting: Free
- Domain: $12/year (optional)
- SSL: Free
- **Total: $0-12/year**

**Netlify:**
- Hosting: Free
- Domain: $12/year (optional)
- SSL: Free
- **Total: $0-12/year**

### Paid Options

**Traditional Hosting:**
- Hosting: $36-120/year
- Domain: $12/year (often included)
- SSL: Free (usually included)
- **Total: $36-120/year**

---

## Getting Help

### GitHub Pages

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Community Forum](https://github.community)

### Netlify

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Support Forum](https://answers.netlify.com)

### Traditional Hosting

- Contact your hosting provider's support
- Most offer 24/7 chat or phone support
- Check their knowledge base

---

## Checklist Before Going Live

- [ ] All memorial data is correct
- [ ] All photos load properly
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] Search functionality works
- [ ] All links work
- [ ] Backup created
- [ ] SSL certificate enabled
- [ ] Custom domain configured (if applicable)
- [ ] Site loads in under 3 seconds

---

## Next Steps

After deployment:

1. **Test thoroughly** on multiple devices
2. **Share the URL** with family/friends
3. **Set up regular backups**
4. **Plan update schedule**
5. **Monitor site performance**

---

*Need help? See README.md or MAINTAINER_GUIDE.md for more information.*
