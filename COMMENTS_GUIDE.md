# 💬 Comments Feature Guide

## Overview
Visitors can now leave comments on memorial pages! All comments must be approved by an admin before they appear publicly.

---

## 📸 Photo Limit
- **Updated to 5 photos per memorial** (previously 6)
- Admins can upload up to 5 photos when creating/editing memorials

---

## For Visitors (Public Users)

### How to Leave a Comment

1. Visit any memorial page
2. Scroll down to the **Comments** section
3. Fill out the comment form:
   - **Your Name** (required)
   - **Email** (optional, will NOT be displayed publicly)
   - **Comment** (required, max 1000 characters)
4. Click **Submit Comment**
5. You'll see a confirmation: "Thank you! Your comment will appear after approval."

**Note:** Comments are NOT visible immediately. An admin must approve them first.

---

## For Admins

### How to Approve/Reject Comments

1. Go to the **Admin Panel** (`admin-auto.html`)
2. Log in with your admin password
3. Scroll to the **💬 Pending Comments** section
4. For each comment, you can:
   - ✅ **Approve** - Comment will appear publicly on the memorial page
   - ⚠️ **Reject** - Comment will be marked as rejected (not deleted, but hidden)
   - 🗑️ **Delete** - Permanently remove the comment

### Comment Information Shown
- Commenter's name
- Which memorial the comment is for
- Date and time submitted
- Email address (if provided)
- The full comment text

---

## Technical Details

### Files Created/Modified

**New API Endpoints:**
- `/api/submit-comment.js` - Handles visitor comment submissions
- `/api/manage-comments.js` - Handles admin approval/rejection/deletion

**New Data File:**
- `data/comments.json` - Stores all comments (pending, approved, rejected)

**Updated Files:**
- `script.js` - Added comment display and submission functionality
- `styles.css` - Added comment styling
- `admin-auto.html` - Added comment management section

### Comment Data Structure
```json
{
  "id": "comment-1234567890",
  "memorialId": "john-smith",
  "name": "Jane Doe",
  "email": "optional@email.com",
  "comment": "Comment text here...",
  "status": "pending",
  "timestamp": "2024-01-21T12:00:00.000Z",
  "approvedAt": null
}
```

**Comment Statuses:**
- `pending` - Waiting for admin approval
- `approved` - Visible on memorial page
- `rejected` - Hidden, but not deleted

---

## Automatic GitHub Commits

When you approve, reject, or delete a comment:
- Changes are **automatically saved** to `data/comments.json`
- Changes are **automatically committed** to GitHub
- Live site updates in 1-2 minutes (via Vercel)

No manual file downloads or uploads needed! ✨

---

## Security

- Comment submission is public (no password needed)
- Comment approval requires admin password
- Email addresses are NEVER displayed publicly
- All user input is sanitized to prevent XSS attacks
- Comments are stored in GitHub, not a database

---

## Need Help?

If you need to manually edit comments:
1. Download `data/comments.json` from GitHub
2. Edit the file
3. Upload it back to GitHub
4. Site will update automatically
