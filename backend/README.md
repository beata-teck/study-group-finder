# Study Group Finder - Backend API

PHP/MySQL backend for the Study Group Finder application using XAMPP.

## Setup Instructions

### 1. Install XAMPP
- Download and install XAMPP from https://www.apachefriends.org/
- Start Apache and MySQL services from XAMPP Control Panel

### 2. Create Database
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Import the SQL file: `database/schema.sql`
   - Or manually run the SQL commands in phpMyAdmin

### 3. Configure Database Connection
Edit `config/database.php` if needed:
- Default XAMPP settings:
  - Host: `localhost`
  - User: `root`
  - Password: `` (empty)
  - Database: `study_group_finder`

### 4. Copy Backend Files
Copy the `backend` folder to your XAMPP `htdocs` directory:
- Windows: `C:\xampp\htdocs\study-group-finder-backend`
- Or create a symlink

### 5. Update CORS Settings
Edit `config/cors.php` to match your frontend URL:
- Default Vite dev server: `http://localhost:5173`
- Update if using different port or domain

## API Endpoints

### Authentication
- `POST /api/auth.php?action=register` - Register new user
- `POST /api/auth.php?action=login` - Login user
- `GET /api/auth.php` - Get current user
- `DELETE /api/auth.php` - Logout

### Users
- `GET /api/users.php` - Get user profile
- `PUT /api/users.php` - Update profile
- `DELETE /api/users.php` - Delete account

### Events
- `GET /api/events.php` - Get all events (with optional filters: `?category=X&search=Y`)
- `GET /api/events.php?id=X` - Get single event
- `POST /api/events.php` - Create event
- `PUT /api/events.php?id=X` - Update event
- `DELETE /api/events.php?id=X` - Delete event

### Joined Events
- `GET /api/joined_events.php` - Get user's joined events
- `GET /api/joined_events.php?past=true` - Get past joined events
- `POST /api/joined_events.php` - Join an event
- `DELETE /api/joined_events.php?event_id=X` - Leave an event

### Comments
- `GET /api/comments.php?event_id=X` - Get comments for event
- `POST /api/comments.php` - Create comment
- `DELETE /api/comments.php?id=X` - Delete comment

### Notifications
- `GET /api/notifications.php` - Get user notifications
- `GET /api/notifications.php?unread=true` - Get unread only
- `POST /api/notifications.php` - Create notification
- `PUT /api/notifications.php?id=X` - Mark as read
- `DELETE /api/notifications.php?id=X` - Delete notification

## Default Admin Account
- Email: `admin@studyfinder.com`
- Password: `admin123` (change this after first login!)

## Testing
Use tools like Postman or curl to test endpoints:
```bash
curl -X POST http://localhost/study-group-finder-backend/api/auth.php?action=register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User","department":"CS","year":"2"}'
```

## Security Notes
- Passwords are hashed using PHP's `password_hash()`
- Sessions are used for authentication
- CORS is configured for development (update for production)
- Input sanitization is implemented
- SQL injection protection via prepared statements

