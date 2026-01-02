<?php
// Comments API Endpoints

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();

switch ($method) {
    case 'GET':
        // Get comments for an event
        $eventId = $_GET['event_id'] ?? null;
        
        if (!$eventId) {
            sendError('Event ID is required', 400);
        }
        
        $stmt = $conn->prepare("SELECT c.*, u.name as user_name, u.email as user_email, u.department as user_department, u.year as user_year 
                               FROM comments c 
                               INNER JOIN users u ON c.user_id = u.id 
                               WHERE c.event_id = ? 
                               ORDER BY c.created_at DESC");
        $stmt->bind_param("i", $eventId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $comments = [];
        while ($comment = $result->fetch_assoc()) {
            $comments[] = $comment;
        }
        
        sendSuccess($comments);
        break;
        
    case 'POST':
        // Create a comment
        $userId = verifySession();
        $data = getRequestBody();
        
        if (empty($data['event_id']) || empty($data['text'])) {
            sendError('Event ID and text are required', 400);
        }
        
        $stmt = $conn->prepare("INSERT INTO comments (event_id, user_id, text) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $data['event_id'], $userId, $data['text']);
        
        if ($stmt->execute()) {
            $commentId = $conn->insert_id;
            $stmt = $conn->prepare("SELECT c.*, u.name as user_name, u.email as user_email, u.department as user_department, u.year as user_year 
                                   FROM comments c 
                                   INNER JOIN users u ON c.user_id = u.id 
                                   WHERE c.id = ?");
            $stmt->bind_param("i", $commentId);
            $stmt->execute();
            $result = $stmt->get_result();
            $comment = $result->fetch_assoc();
            sendSuccess($comment, 'Comment added successfully');
        } else {
            sendError('Failed to add comment', 500);
        }
        break;
        
    case 'DELETE':
        // Delete a comment
        $userId = verifySession();
        $commentId = $_GET['id'] ?? null;
        
        if (!$commentId) {
            sendError('Comment ID is required', 400);
        }
        
        // Check if user owns the comment or is admin
        $stmt = $conn->prepare("SELECT user_id FROM comments WHERE id = ?");
        $stmt->bind_param("i", $commentId);
        $stmt->execute();
        $result = $stmt->get_result();
        $comment = $result->fetch_assoc();
        
        if (!$comment) {
            sendError('Comment not found', 404);
        }
        
        // Check if user is admin
        $userStmt = $conn->prepare("SELECT is_admin FROM users WHERE id = ?");
        $userStmt->bind_param("i", $userId);
        $userStmt->execute();
        $userResult = $userStmt->get_result();
        $user = $userResult->fetch_assoc();
        
        if ($comment['user_id'] != $userId && !$user['is_admin']) {
            sendError('Unauthorized', 403);
        }
        
        $stmt = $conn->prepare("DELETE FROM comments WHERE id = ?");
        $stmt->bind_param("i", $commentId);
        
        if ($stmt->execute()) {
            sendSuccess(null, 'Comment deleted successfully');
        } else {
            sendError('Failed to delete comment', 500);
        }
        break;
        
    default:
        sendError('Method not allowed', 405);
}

closeDBConnection($conn);
?>

