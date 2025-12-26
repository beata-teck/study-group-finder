<?php
// Notifications API Endpoints

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
$userId = verifySession();

switch ($method) {
    case 'GET':
        // Get user notifications
        $unreadOnly = $_GET['unread'] ?? false;
        
        $query = "SELECT n.*, e.title as event_title 
                  FROM notifications n 
                  LEFT JOIN events e ON n.event_id = e.id 
                  WHERE n.user_id = ?";
        
        if ($unreadOnly) {
            $query .= " AND n.is_read = FALSE";
        }
        
        $query .= " ORDER BY n.created_at DESC LIMIT 50";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $notifications = [];
        while ($notification = $result->fetch_assoc()) {
            $notifications[] = $notification;
        }
        
        sendSuccess($notifications);
        break;
        
    case 'POST':
        // Create notification (usually done by system, but can be manual)
        $data = getRequestBody();
        
        if (empty($data['title']) || empty($data['message'])) {
            sendError('Title and message are required', 400);
        }
        
        $targetUserId = $data['user_id'] ?? $userId;
        $eventId = $data['event_id'] ?? null;
        $type = $data['type'] ?? 'info';
        
        $stmt = $conn->prepare("INSERT INTO notifications (user_id, title, message, type, event_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("isssi", $targetUserId, $data['title'], $data['message'], $type, $eventId);
        
        if ($stmt->execute()) {
            sendSuccess(['id' => $conn->insert_id], 'Notification created');
        } else {
            sendError('Failed to create notification', 500);
        }
        break;
        
    case 'PUT':
        // Mark notification as read
        $notificationId = $_GET['id'] ?? null;
        
        if (!$notificationId) {
            sendError('Notification ID is required', 400);
        }
        
        $stmt = $conn->prepare("UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $notificationId, $userId);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Notification marked as read');
        } else {
            sendError('Failed to update notification', 500);
        }
        break;
        
    case 'DELETE':
        // Delete notification
        $notificationId = $_GET['id'] ?? null;
        
        if (!$notificationId) {
            sendError('Notification ID is required', 400);
        }
        
        $stmt = $conn->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $notificationId, $userId);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Notification deleted');
        } else {
            sendError('Failed to delete notification', 500);
        }
        break;
        
    default:
        sendError('Method not allowed', 405);
}

closeDBConnection($conn);
?>

