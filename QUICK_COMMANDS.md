# ⚡ Quick Commands Reference

## For Windows PowerShell

### Install TinaCMS
```powershell
npm install
```

### Run Development Server (Test Locally)
```powershell
npm run dev
```

Then open:
- Website: http://localhost:8080
- Admin: http://localhost:8080/admin

Press `Ctrl+C` to stop.

---

### Push to GitHub
```powershell
git add .
git commit -m "Add TinaCMS for content management"
git push
```

---

### Build for Production
```powershell
npm run build
```

---

## What Each Command Does

| Command | What It Does |
|---------|--------------|
| `npm install` | Installs TinaCMS and dependencies |
| `npm run dev` | Starts local server for testing |
| `npm run build` | Builds TinaCMS admin panel |
| `npm start` | Starts simple web server |

---

## Next Steps

1. Run `npm install`
2. Follow instructions in `TINACMS_SETUP.md`
3. Get credentials from https://app.tina.io
4. Update `.tina/config.js`
5. Push to GitHub
6. Access admin at `yourdomain.com/admin`

---

**Full instructions**: See `TINACMS_SETUP.md`
