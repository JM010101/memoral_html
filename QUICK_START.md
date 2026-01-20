# Quick Start Guide

## Adding Your First Memorial (5 Minutes)

### 1. Add Photos
- Place photos in the `images/` folder
- Name them clearly (e.g., `person-name-1.jpg`)

### 2. Edit JSON File
Open `data/memorials.json` and copy this template:

```json
{
  "id": "memorial-4",
  "name": "Person's Full Name",
  "birthDate": "1950-01-15",
  "deathDate": "2024-01-15",
  "tribute": "Write your tribute here. Use \\n for new paragraphs.",
  "photos": [
    "images/person-name-1.jpg",
    "images/person-name-2.jpg"
  ]
}
```

### 3. Add to Array
- Find the closing bracket `]` at the end of the file
- Add a comma after the last entry
- Paste your new entry before the closing bracket
- Save the file

### 4. Test
- Open `index.html` in a web browser
- Your new memorial should appear!

## Common Tasks

### Edit a Memorial
1. Open `data/memorials.json`
2. Find the entry by ID or name
3. Make changes
4. Save

### Remove a Memorial
1. Open `data/memorials.json`
2. Delete the entire entry `{ ... }`
3. Remove extra commas if needed
4. Save

### Change Colors
Edit `styles.css`, find `:root` at the top, change the color values.

## Need Help?

See the full `README.md` for detailed instructions and troubleshooting.
