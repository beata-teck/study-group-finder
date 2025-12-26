<?php
// Events API Endpoints

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();

switch ($method) {
    case 'GET':
        $eventId = $_GET['id'] ?? null;
        $category = $_GET['category'] ?? null;
        $search = $_GET['search'] ?? null;
        $status = $_GET['status'] ?? 'approved'; // For admin: can filter by status
        
        if ($eventId) {
            // Get single event
            $stmt = $conn->prepare("SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($event = $result->fetch_assoc()) {
                // Get join count
                $joinStmt = $conn->prepare("SELECT COUNT(*) as count FROM joined_events WHERE event_id = ?");
                $joinStmt->bind_param("i", $eventId);
                $joinStmt->execute();
                $joinResult = $joinStmt->get_result();
                $event['join_count'] = $joinResult->fetch_assoc()['count'];
                
                sendSuccess($event);
            } else {
                sendError('Event not found', 404);
            }
        } else {
            // Get all events with filters
            $query = "SELECT e.*, u.name as creator_name, 
                     (SELECT COUNT(*) FROM joined_events je WHERE je.event_id = e.id) as join_count
                     FROM events e 
                     LEFT JOIN users u ON e.created_by = u.id 
                     WHERE 1=1";
            $params = [];
            $types = "";
            
            if ($status) {
                $query .= " AND e.status = ?";
                $params[] = $status;
                $types .= "s";
            }
            
            if ($category) {
                $query .= " AND e.category = ?";
                $params[] = $category;
                $types .= "s";
            }
            
            if ($search) {
                $query .= " AND (e.title LIKE ? OR e.subject LIKE ? OR e.description LIKE ? OR e.location LIKE ?)";
                $searchTerm = "%$search%";
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $types .= "ssss";
            }
            
            $query .= " ORDER BY e.date ASC, e.time ASC";
            
            $stmt = $conn->prepare($query);
            if (!empty($params)) {
                $stmt->bind_param($types, ...$params);
            }
            $stmt->execute();
            $result = $stmt->get_result();
            
            $events = [];
            while ($event = $result->fetch_assoc()) {
                $events[] = $event;
            }
            
            sendSuccess($events);
        }
        break;
        
    case 'POST':
        // Create new event
        $userId = verifySession();
        $data = getRequestBody();
        
        if (empty($data['title']) || empty($data['date'])) {
            sendError('Title and date are required', 400);
        }
        
        $stmt = $conn->prepare("INSERT INTO events (title, subject, description, category, date, time, location, organizer, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')");
        $stmt->bind_param("ssssssssi", 
            $data['title'],
            $data['subject'] ?? null,
            $data['description'] ?? null,
            $data['category'] ?? 'General',
            $data['date'],
            $data['time'] ?? null,
            $data['location'] ?? null,
            $data['organizer'] ?? null,
            $userId
        );
        
        if ($stmt->execute()) {
            $eventId = $conn->insert_id;
            $stmt = $conn->prepare("SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $result = $stmt->get_result();
            $event = $result->fetch_assoc();
            sendSuccess($event, 'Event created successfully');
        } else {
            sendError('Failed to create event', 500);
        }
        break;
        
    case 'PUT':
        // Update event
        $userId = verifySession();
        $eventId = $_GET['id'] ?? null;
        
        if (!$eventId) {
            sendError('Event ID is required', 400);
        }
        
        // Check if user owns the event or is admin
        $stmt = $conn->prepare("SELECT created_by FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        $event = $result->fetch_assoc();
        
        if (!$event) {
            sendError('Event not found', 404);
        }
        
        // Check if user is admin
        $userStmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
        $userStmt->bind_param("i", $userId);
        $userStmt->execute();
        $userResult = $userStmt->get_result();
        $user = $userResult->fetch_assoc();
        
        if ($event['created_by'] != $userId && !$user['is_admin']) {
            sendError('Unauthorized', 403);
        }
        
        $data = getRequestBody();
        
        $stmt = $conn->prepare("UPDATE events SET title = ?, subject = ?, description = ?, category = ?, date = ?, time = ?, location = ?, organizer = ? WHERE id = ?");
        $stmt->bind_param("ssssssssi",
            $data['title'],
            $data['subject'] ?? null,
            $data['description'] ?? null,
            $data['category'] ?? 'General',
            $data['date'],
            $data['time'] ?? null,
            $data['location'] ?? null,
            $data['organizer'] ?? null,
            $eventId
        );
        
        if ($stmt->execute()) {
            $stmt = $conn->prepare("SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $result = $stmt->get_result();
            $event = $result->fetch_assoc();
            sendSuccess($event, 'Event updated successfully');
        } else {
            sendError('Failed to update event', 500);
        }
        break;
        
    case 'DELETE':
        // Delete event
        $userId = verifySession();
        $eventId = $_GET['id'] ?? null;
        
        if (!$eventId) {
            sendError('Event ID is required', 400);
        }
        
        // Check if user owns the event or is admin
        $stmt = $conn->prepare("SELECT created_by FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        $event = $result->fetch_assoc();
        
        if (!$event) {
            sendError('Event not found', 404);
        }
        
        // Check if user is admin
        $userStmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
        $userStmt->bind_param("i", $userId);
        $userStmt->execute();
        $userResult = $userStmt->get_result();
        $user = $userResult->fetch_assoc();
        
        if ($event['created_by'] != $userId && !$user['is_admin']) {
            sendError('Unauthorized', 403);
        }
        
        $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Event deleted successfully');
        } else {
            sendError('Failed to delete event', 500);
        }
        break;
        
    default:
        sendError('Method not allowed', 405);
}

closeDBConnection($conn);
?>

