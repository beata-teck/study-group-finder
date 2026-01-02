<?php
// Joined Events API Endpoints

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
$userId = verifySession();

switch ($method) {
    case 'GET':
        // Get user's joined events
        $past = $_GET['past'] ?? false;
        
        $query = "SELECT e.*, u.name as creator_name, je.joined_at
                  FROM joined_events je
                  INNER JOIN events e ON je.event_id = e.id
                  LEFT JOIN users u ON e.created_by = u.id
                  WHERE je.user_id = ?";
        
        if ($past) {
            $query .= " AND e.date < CURDATE()";
        } else {
            $query .= " AND e.date >= CURDATE()";
        }
        
        $query .= " ORDER BY e.date ASC, e.time ASC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $events = [];
        while ($event = $result->fetch_assoc()) {
            $events[] = $event;
        }
        
        sendSuccess($events);
        break;
        
    case 'POST':
        // Join an event
        $data = getRequestBody();
        $eventId = $data['event_id'] ?? null;
        
        if (!$eventId) {
            sendError('Event ID is required', 400);
        }
        
        // Check if event exists
        $stmt = $conn->prepare("SELECT id FROM events WHERE id = ?");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        if ($stmt->get_result()->num_rows === 0) {
            sendError('Event not found', 404);
        }
        
        // Check if already joined
        $stmt = $conn->prepare("SELECT id FROM joined_events WHERE user_id = ? AND event_id = ?");
        $stmt->bind_param("ii", $userId, $eventId);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            sendError('Already joined this event', 409);
        }
        
        // Join event
        $stmt = $conn->prepare("INSERT INTO joined_events (user_id, event_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $userId, $eventId);
        
        if ($stmt->execute()) {
            // Get event details
            $stmt = $conn->prepare("SELECT e.*, u.name as creator_name FROM events e LEFT JOIN users u ON e.created_by = u.id WHERE e.id = ?");
            $stmt->bind_param("i", $eventId);
            $stmt->execute();
            $result = $stmt->get_result();
            $event = $result->fetch_assoc();
            
            sendSuccess($event, 'Successfully joined event');
        } else {
            sendError('Failed to join event', 500);
        }
        break;
        
    case 'DELETE':
        // Leave an event
        $eventId = $_GET['event_id'] ?? null;
        
        if (!$eventId) {
            sendError('Event ID is required', 400);
        }
        
        $stmt = $conn->prepare("DELETE FROM joined_events WHERE user_id = ? AND event_id = ?");
        $stmt->bind_param("ii", $userId, $eventId);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Successfully left event');
        } else {
            sendError('Failed to leave event', 500);
        }
        break;
        
    default:
        sendError('Method not allowed', 405);
}

closeDBConnection($conn);
?>

