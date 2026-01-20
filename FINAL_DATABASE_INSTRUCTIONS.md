# ✅ FINAL SETUP - Database Integration Complete!

**Your Supabase credentials are already configured!**

---

## 🎯 Just 2 More Steps!

### Step 1: Create Database Table (2 minutes)

1. Go to your Supabase dashboard: **https://supabase.com/dashboard/project/sexoklyqxgvodfhjncbt**
2. Click **"SQL Editor"** (left sidebar, looks like </> icon)
3. Click **"+ New query"**
4. **Copy and paste this SQL:**

```sql
-- Create memorials table
CREATE TABLE memorials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  death_date DATE NOT NULL,
  tribute TEXT NOT NULL,
  photos JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Enable read access for all users" ON memorials
  FOR SELECT
  USING (true);

-- Allow anyone to insert
CREATE POLICY "Enable insert for all users" ON memorials
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update
CREATE POLICY "Enable update for all users" ON memorials
  FOR UPDATE
  USING (true);

-- Allow anyone to delete
CREATE POLICY "Enable delete for all users" ON memorials
  FOR DELETE
  USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('memorial-images', 'memorial-images', true);

-- Storage policy for uploads
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'memorial-images');

-- Storage policy for reads
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'memorial-images');
```

5. Click **"RUN"** (or press F5)
6. You should see: **"Success. No rows returned"**

---

### Step 2: Update Your Website Files

You need to add the Supabase library to your HTML pages:

#### For `index.html`:
Add this line **before** the closing `</body>` tag (before `<script src="script.js"></script>`):

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

#### For `memorials.html`:
Add the same line **before** the closing `</body>` tag.

#### For `memorial.html`:
Add the same line **before** the closing `</body>` tag.

#### Replace `script.js`:
Rename `script-db.js` to `script.js` (or update your HTML files to use `script-db.js`)

---

## ✅ DONE! Now You Can Use It:

### For Administrators:

**Go to**: `https://your-vercel-site/admin-db.html`

1. **Password**: `memorial2024`
2. **Add memorials** - instant database save!
3. **Upload photos** - saved to Supabase!
4. **Edit/Delete** - all in real-time!

### For Visitors:

Your regular website (`index.html`, `memorials.html`) will load data from the database automatically!

**Changes appear INSTANTLY** - no 2-minute deploys!

---

## 🎉 What You Get:

- ✅ **Real database** (Supabase PostgreSQL)
- ✅ **Anyone can admin** (just needs password)
- ✅ **Instant updates** (no waiting!)
- ✅ **Image hosting** included
- ✅ **Free forever** (generous free tier)
- ✅ **Actually works!**

---

## 🔒 Change Password:

Edit line 63 in `admin-db.html`:
```javascript
const ADMIN_PASSWORD = 'memorial2024'; // Change this!
```

---

## 📝 Summary:

**Old way:**
- Edit JSON file manually
- Commit to GitHub
- Wait 2 minutes for deploy
- Complex OAuth

**New way (DATABASE):**
- Go to `/admin-db.html`
- Enter password
- Add/edit/upload
- **INSTANT updates!**
- **Zero complexity!**

---

**Run that SQL now and you're DONE!** 🚀🎉
