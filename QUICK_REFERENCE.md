# Quick Reference - For Non-Developers

## Adding a Memorial (Copy & Paste Template)

### Step 1: Copy This Template

```json
{
  "id": "memorial-4",
  "name": "Full Name Here",
  "birthDate": "1950-01-15",
  "deathDate": "2024-01-15",
  "tribute": "Write the memorial tribute here.\n\nStart a new paragraph with \\n\\n",
  "photos": [
    {
      "url": "images/photo-name.jpg",
      "alt": "Describe what's in the photo"
    }
  ]
}
```

### Step 2: Fill It In

Replace:
- `memorial-4` → Use next number (memorial-5, memorial-6, etc.)
- `Full Name Here` → Person's actual name
- `1950-01-15` → Birth date (YYYY-MM-DD format)
- `2024-01-15` → Death date (YYYY-MM-DD format)
- `Write the memorial...` → Your tribute text
- `photo-name.jpg` → Your photo filename
- `Describe what's in...` → Description of the photo

### Step 3: Add to File

1. Open `data/memorials.json`
2. Go to the bottom
3. Find the last `}` before the final `]`
4. Add a comma `,` after that `}`
5. Paste your new entry
6. Save

**Example:**
```json
[
  {
    "id": "memorial-1",
    ...
  },  ← ADD COMMA HERE
  {
    "id": "memorial-2",
    YOUR NEW ENTRY HERE
  }  ← NO COMMA (it's last)
]
```

---

## Uploading Photos

### Simple as 1-2-3:

1. **Save your photo** to the `images/` folder
2. **Name it** descriptively (e.g., `john-smith-garden.jpg`)
3. **Update** the JSON with the filename

**That's it!**

---

## Editing Text

### To Change a Tribute:

1. Open `data/memorials.json`
2. Find the person's name
3. Find the `"tribute":` line
4. Change the text between the quotes
5. Use `\n\n` for new paragraphs
6. Save

**Example:**
```json
"tribute": "First paragraph.\n\nSecond paragraph.\n\nThird paragraph."
```

---

## Common Mistakes (And How to Fix)

### ❌ Mistake: Missing Comma
```json
{
  "id": "memorial-1"
}   ← Missing comma!
{
  "id": "memorial-2"
}
```

### ✅ Fixed:
```json
{
  "id": "memorial-1"
},  ← Added comma
{
  "id": "memorial-2"
}
```

---

### ❌ Mistake: Extra Comma
```json
{
  "id": "memorial-2"
},  ← Extra comma!
]
```

### ✅ Fixed:
```json
{
  "id": "memorial-2"
}  ← No comma before ]
]
```

---

### ❌ Mistake: Wrong Date Format
```json
"birthDate": "January 15, 1950"  ← Wrong!
"birthDate": "1/15/1950"         ← Wrong!
```

### ✅ Fixed:
```json
"birthDate": "1950-01-15"  ← Correct!
```

---

## Testing Your Changes

Before uploading to the live site:

1. **Open** `index.html` in your browser
2. **Check** that the new memorial appears
3. **Click** on it to verify everything looks right
4. **Test** on your phone too

---

## Need Help?

### If something goes wrong:

1. **Check your commas** - Most common mistake
2. **Validate JSON** at jsonlint.com
3. **Check browser console** (Press F12 → Console tab)
4. **Restore from backup** if needed

---

## Photo Checklist

Before adding photos:

- [ ] Resize to 800x600 pixels or similar
- [ ] Compress at tinypng.com (under 200KB)
- [ ] Name descriptively (lowercase, hyphens)
- [ ] Save to `images/` folder
- [ ] Write meaningful alt text

---

## File Locations

- **Memorial data:** `data/memorials.json` ← Edit this file
- **Photos:** `images/` folder ← Put photos here
- **The website:** `index.html` ← Open this to view

---

## Full Example - Complete Memorial Entry

```json
{
  "id": "memorial-4",
  "name": "Jane Doe",
  "birthDate": "1975-06-10",
  "deathDate": "2024-02-15",
  "tribute": "Jane was a beloved teacher who inspired countless students over her 30-year career.\n\nShe had a passion for literature and loved sharing her enthusiasm with others. Her warm smile and patient nature made her a favorite among students and colleagues alike.\n\nJane will be deeply missed by all who knew her.",
  "photos": [
    {
      "url": "images/jane-doe-classroom.jpg",
      "alt": "Jane Doe standing in her classroom, surrounded by books"
    },
    {
      "url": "images/jane-doe-graduation.jpg",
      "alt": "Jane Doe at a graduation ceremony with students"
    },
    {
      "url": "images/jane-doe-reading.jpg",
      "alt": "Jane Doe reading her favorite book in the school library"
    }
  ]
}
```

---

**Remember:** Always backup `memorials.json` before making changes!

---

*For detailed instructions, see `MAINTAINER_GUIDE.md`*
