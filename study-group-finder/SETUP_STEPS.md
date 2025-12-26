# Step-by-Step Setup Guide

## Step 1: Start XAMPP
1. Open **XAMPP Control Panel**
2. Click **Start** for **Apache**
3. Click **Start** for **MySQL**
4. Both should show green "Running" status

## Step 2: Copy Backend Files to XAMPP

### Option A: Manual Copy (Easiest)
1. Navigate to: `C:\xampp\htdocs\`
2. Create a new folder: `study-group-finder-backend`
3. Copy ALL files from `backend/` folder to `C:\xampp\htdocs\study-group-finder-backend\`

Your structure should be:
```
C:\xampp\htdocs\study-group-finder-backend\
  ├── api\
  │   ├── auth.php
  │   ├── users.php
  │   ├── events.php
  │   ├── joined_events.php
  │   ├── comments.php
  │   ├── notifications.php
  │   └── helpers.php
  ├── config\
  │   ├── database.php
  │   └── cors.php
  ├── database\
  │   └── schema.sql
  ├── .htaccess
  └── README.md
```

### Option B: Using Command Line
Open PowerShell in your project root and run:
```powershell
xcopy /E /I backend C:\xampp\htdocs\study-group-finder-backend
```

## Step 3: Create Database

1. Open your browser
2. Go to: **http://localhost/phpmyadmin**
3. Click on **"New"** in the left sidebar
4. Database name: `study_group_finder`
5. Collation: `utf8mb4_general_ci`
6. Click **"Create"**

## Step 4: Import Database Schema

1. In phpMyAdmin, select the `study_group_finder` database (click it in left sidebar)
2. Click the **"Import"** tab at the top
3. Click **"Choose File"**
4. Navigate to: `C:\xampp\htdocs\study-group-finder-backend\database\schema.sql`
5. Click **"Go"** at the bottom
6. You should see: "Import has been successfully finished"

## Step 5: Verify Database Setup

1. In phpMyAdmin, click on `study_group_finder` database
2. You should see these tables:
   - ✅ users
   - ✅ events
   - ✅ joined_events
   - ✅ comments
   - ✅ notifications

## Step 6: Test Backend API

Open your browser and test these URLs:

### Test 1: Check if backend is accessible
Visit: **http://localhost/study-group-finder-backend/api/auth.php**

You should see a JSON response (might be an error, but that's OK - it means the file is accessible)

### Test 2: Test Registration (using browser console or Postman)
Open browser console (F12) and run:
```javascript
fetch('http://localhost/study-group-finder-backend/api/auth.php?action=register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'test123',
    name: 'Test User',
    department: 'Computer Science',
    year: '2'
  })
})
.then(r => r.json())
.then(console.log);
```

You should see a success response with user data.

## Step 7: Update Frontend API URL

1. Open: `src/services/api.js`
2. Make sure line 4 says:
```javascript
const API_BASE_URL = 'http://localhost/study-group-finder-backend/api';
```

If your backend is in a different location, update this URL.

## Step 8: Switch Frontend to Use API

1. **Backup current App.jsx:**
   ```powershell
   # In project root
   Rename-Item src/App.jsx src/App.local.jsx
   ```

2. **Use API version:**
   ```powershell
   Rename-Item src/App.api.jsx src/App.jsx
   ```

## Step 9: Start Frontend

1. Open terminal in project root
2. Run: `npm run dev`
3. Open: http://localhost:5173

## Step 10: Test Everything

1. **Register a new account:**
   - Click "Login / Register"
   - Click "Don't have an account? Register"
   - Fill in the form and register

2. **Create an event:**
   - Click "+ Create Event"
   - Fill in event details
   - Save

3. **Join an event:**
   - Browse events
   - Click "Join" on an event

4. **Add a comment:**
   - Click "View Details" on an event
   - Scroll to discussion section
   - Add a comment

## Troubleshooting

### ❌ "Database connection failed"
- Check MySQL is running in XAMPP
- Verify database name in `config/database.php`
- Check username/password (default: root / empty)

### ❌ "CORS error" in browser console
- Open `C:\xampp\htdocs\study-group-finder-backend\config\cors.php`
- Make sure it has: `header('Access-Control-Allow-Origin: http://localhost:5173');`

### ❌ "404 Not Found" for API
- Check backend folder is in `C:\xampp\htdocs\study-group-finder-backend\`
- Verify Apache is running
- Check file paths are correct

### ❌ "Unauthorized" errors
- Make sure you're logged in
- Check browser cookies are enabled
- Verify session is working (check phpMyAdmin sessions table)

## Quick Verification Checklist

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] Backend files copied to `C:\xampp\htdocs\study-group-finder-backend\`
- [ ] Database `study_group_finder` created
- [ ] Database schema imported (5 tables visible)
- [ ] API URL updated in `src/services/api.js`
- [ ] Frontend using `App.jsx` (API version)
- [ ] Frontend dev server running
- [ ] Can register new user
- [ ] Can create event
- [ ] Can join event

## Default Admin Login

After setup, you can login as admin:
- **Email:** admin@studyfinder.com
- **Password:** admin123

⚠️ **Change this password immediately after first login!**

