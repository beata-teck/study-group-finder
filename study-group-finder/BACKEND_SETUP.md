# Backend Setup Guide for XAMPP

## Quick Start

### 1. Install and Start XAMPP
1. Download XAMPP from https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Start **Apache** and **MySQL** services

### 2. Setup Database
1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Click "New" to create a database
3. Or import the SQL file:
   - Go to "Import" tab
   - Choose file: `backend/database/schema.sql`
   - Click "Go"

### 3. Copy Backend Files
Copy the `backend` folder to XAMPP's htdocs directory:

**Windows:**
```
C:\xampp\htdocs\study-group-finder-backend
```

**Or create a symlink:**
```bash
# From project root
mklink /D C:\xampp\htdocs\study-group-finder-backend backend
```

### 4. Configure Database (if needed)
Edit `backend/config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Empty for default XAMPP
define('DB_NAME', 'study_group_finder');
```

### 5. Configure CORS
Edit `backend/config/cors.php` to match your frontend URL:
```php
header('Access-Control-Allow-Origin: http://localhost:5173'); // Vite default
```

### 6. Update Frontend API URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost/study-group-finder-backend/api';
```

### 7. Switch to API Version
Replace `src/App.jsx` with `src/App.api.jsx`:
```bash
# Windows PowerShell
Move-Item src/App.jsx src/App.local.jsx
Move-Item src/App.api.jsx src/App.jsx
```

## Testing the Backend

### Test Database Connection
Visit: http://localhost/study-group-finder-backend/api/auth.php

### Test Registration
```bash
curl -X POST http://localhost/study-group-finder-backend/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\",\"name\":\"Test User\",\"department\":\"CS\",\"year\":\"2\"}"
```

### Test Login
```bash
curl -X POST http://localhost/study-group-finder-backend/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"
```

## Default Admin Account
- **Email:** admin@studyfinder.com
- **Password:** admin123
- **⚠️ Change this password after first login!**

## Troubleshooting

### CORS Errors
- Make sure CORS headers are set in `config/cors.php`
- Check that frontend URL matches in CORS config
- Enable CORS in `.htaccess` if needed

### Database Connection Errors
- Check MySQL is running in XAMPP
- Verify database name in `config/database.php`
- Check username/password (default: root/empty)

### Session Issues
- Make sure `session_start()` is called
- Check PHP session directory permissions
- Verify cookies are enabled in browser

### 404 Errors
- Verify backend folder is in correct location
- Check Apache is running
- Verify file paths in API calls

## API Endpoints Reference

All endpoints are in `backend/api/`:
- `auth.php` - Authentication
- `users.php` - User profiles
- `events.php` - Events CRUD
- `joined_events.php` - Join/leave events
- `comments.php` - Event comments
- `notifications.php` - Notifications

See `backend/README.md` for full API documentation.

