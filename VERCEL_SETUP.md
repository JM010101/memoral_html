# Setup Guide for GitHub → Vercel

You deployed via GitHub to Vercel. Here are your best options for enabling add/edit/upload:

---

## ✅ Option 1: TinaCMS (RECOMMENDED - Free & Perfect for Your Setup)

### Why TinaCMS?
- ✅ Built specifically for GitHub + Vercel
- ✅ Free forever
- ✅ No external database needed
- ✅ Commits directly to your GitHub repo
- ✅ Real-time editing
- ✅ Professional admin UI

### Setup (15 minutes):

#### Step 1: Install TinaCMS

```bash
cd your-project-folder
npm install tinacms @tinacms/cli
```

#### Step 2: Create `.tina/config.js`

```javascript
import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: null, // Get this from tina.io
  token: null, // Get this from tina.io
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  
  schema: {
    collections: [
      {
        name: "memorial",
        label: "Memorials",
        path: "data",
        format: "json",
        fields: [
          {
            type: "string",
            name: "id",
            label: "Memorial ID",
            required: true,
          },
          {
            type: "string",
            name: "name",
            label: "Full Name",
            required: true,
          },
          {
            type: "datetime",
            name: "birthDate",
            label: "Birth Date",
            required: true,
          },
          {
            type: "datetime",
            name: "deathDate",
            label: "Death Date",
            required: true,
          },
          {
            type: "rich-text",
            name: "tribute",
            label: "Memorial Tribute",
            required: true,
          },
          {
            type: "object",
            name: "photos",
            label: "Photos",
            list: true,
            fields: [
              {
                type: "image",
                name: "url",
                label: "Photo",
              },
              {
                type: "string",
                name: "alt",
                label: "Photo Description",
              },
            ],
          },
        ],
      },
    ],
  },
});
```

#### Step 3: Get TinaCMS Credentials

1. Go to [tina.io](https://tina.io)
2. Sign up (free)
3. Create new project
4. Connect to your GitHub repo
5. Copy `clientId` and `token`
6. Add to `.tina/config.js`

#### Step 4: Add to package.json

```json
{
  "scripts": {
    "dev": "tinacms dev -c \"npx http-server\"",
    "build": "tinacms build"
  }
}
```

#### Step 5: Deploy

```bash
git add .
git commit -m "Add TinaCMS"
git push
```

Vercel will automatically redeploy.

#### Step 6: Access Admin

Go to: `https://yourdomain.com/admin/`

---

## ✅ Option 2: Sanity.io (If You Want a Dataset)

### Why Sanity?
- ✅ Free tier (generous)
- ✅ Professional CMS
- ✅ Real-time database
- ✅ Built-in image optimization
- ✅ Multi-user support

### Setup (20 minutes):

#### Step 1: Create Sanity Project

```bash
npm install -g @sanity/cli
sanity init
# Choose: Create new project
# Choose: Memorial Website
# Choose: Blog schema (we'll customize)
```

#### Step 2: Customize Schema

Create `schemas/memorial.js`:

```javascript
export default {
  name: 'memorial',
  title: 'Memorial',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'birthDate',
      title: 'Birth Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'deathDate',
      title: 'Death Date',
      type: 'date',
      validation: Rule => Rule.required()
    },
    {
      name: 'tribute',
      title: 'Memorial Tribute',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }
          ]
        }
      ],
      options: {
        hotspot: true
      }
    }
  ]
}
```

#### Step 3: Deploy Sanity Studio

```bash
sanity deploy
# Choose a subdomain: yourmemorial-cms
```

#### Step 4: Fetch Data in Your Site

Install Sanity client:

```bash
npm install @sanity/client
```

Update `script.js` to fetch from Sanity instead of JSON:

```javascript
import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 'your-project-id',
  dataset: 'production',
  useCdn: true
})

async function loadMemorialsData() {
    try {
        const query = '*[_type == "memorial"]'
        memorialsData = await client.fetch(query)
        return memorialsData
    } catch (error) {
        console.error('Error loading memorials:', error)
        return []
    }
}
```

#### Step 5: Access Admin

Go to: `https://yourmemorial-cms.sanity.studio`

**Cost:** FREE for up to 3 users, unlimited documents

---

## ✅ Option 3: Vercel Serverless Functions (Custom Backend)

### Why This?
- ✅ No external services
- ✅ Free (within Vercel limits)
- ✅ Full control
- ✅ Works with your current setup

### Setup:

Create `api/save-memorial.js`:

```javascript
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Password protection
  const AUTH_PASSWORD = process.env.ADMIN_PASSWORD;
  
  if (req.headers.authorization !== `Bearer ${AUTH_PASSWORD}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form' });
    }

    try {
      // Save photos
      const photos = [];
      if (files.photos) {
        const photoFiles = Array.isArray(files.photos) ? files.photos : [files.photos];
        
        for (const file of photoFiles) {
          const newPath = path.join(process.cwd(), 'images', file.originalFilename);
          fs.copyFileSync(file.filepath, newPath);
          photos.push({
            url: `images/${file.originalFilename}`,
            alt: fields.photoAlts?.[photos.length] || ''
          });
        }
      }

      // Update memorials.json
      const jsonPath = path.join(process.cwd(), 'data', 'memorials.json');
      const memorials = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      const newMemorial = {
        id: fields.id,
        name: fields.name,
        birthDate: fields.birthDate,
        deathDate: fields.deathDate,
        tribute: fields.tribute,
        photos: photos
      };

      memorials.push(newMemorial);
      fs.writeFileSync(jsonPath, JSON.stringify(memorials, null, 2));

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
```

Add to `.env`:
```
ADMIN_PASSWORD=your-secure-password
```

Update `admin.html` to POST to `/api/save-memorial`

---

## 🎯 My Recommendation for You:

### **Use TinaCMS** (Option 1)

**Why?**
1. ✅ **No dataset needed** - uses your GitHub repo
2. ✅ **Perfect for Vercel** - built for this exact setup
3. ✅ **Free forever**
4. ✅ **Automatic Git commits** - every change is versioned
5. ✅ **No external database** - everything in your repo
6. ✅ **Works immediately** with your current structure

**Setup time:** 15 minutes  
**Cost:** $0  
**Maintenance:** Zero

---

## Quick Comparison:

| Feature | TinaCMS | Sanity | Vercel API |
|---------|---------|--------|------------|
| **Cost** | Free | Free (3 users) | Free |
| **Setup Time** | 15 min | 20 min | 30 min |
| **Database** | GitHub | Cloud | GitHub |
| **Admin UI** | ✅ | ✅ | DIY |
| **Image Upload** | ✅ | ✅ | Custom |
| **Git Integration** | ✅ | ❌ | ✅ |
| **Learning Curve** | Easy | Medium | Hard |

---

## Step-by-Step for TinaCMS (Recommended):

### 1. Install
```bash
npm install tinacms @tinacms/cli
```

### 2. Initialize
```bash
npx @tinacms/cli init
```

### 3. Configure (guided setup)
- Connect GitHub
- Set up schema
- Deploy to Vercel

### 4. Access
```
https://yourdomain.com/admin/
```

### 5. Edit & Save
- Changes commit to GitHub
- Vercel auto-deploys
- Site updates automatically

---

## Answer to Your Question:

**Do you need dataset integration?**

❌ **NO** - You don't need Sanity or external database  
✅ **YES** - Use TinaCMS (but it's Git-based, not a dataset)

**Best for GitHub → Vercel:**
Use **TinaCMS** - it commits to GitHub, no external database needed!

---

## Want Me to Set It Up?

I can create all the TinaCMS config files for you. Just say:
- "Set up TinaCMS"

And I'll create all necessary files!

---

**Bottom Line:** TinaCMS is perfect for your GitHub → Vercel setup. No dataset needed! 🎉
