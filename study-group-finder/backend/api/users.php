<?php
// User Profile API Endpoints

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
$userId = verifySession();

switch ($method) {
    case 'GET':
        // Get user profile
        $stmt = $conn->prepare("SELECT id, email, name, department, year, is_admin FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($user = $result->fetch_assoc()) {
            sendSuccess($user);
        } else {
            sendError('User not found', 404);
        }
        break;
        
    case 'PUT':
        // Update user profile
        $data = getRequestBody();
        
        if (empty($data['name']) || empty($data['email']) || empty($data['department']) || empty($data['year'])) {
            sendError('All fields are required', 400);
        }
        
        if (!validateEmail($data['email'])) {
            sendError('Invalid email format', 400);
        }
        
        // Check if email is already taken by another user
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $data['email'], $userId);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            sendError('Email already taken', 409);
        }
        
        $stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, department = ?, year = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $data['name'], $data['email'], $data['department'], $data['year'], $userId);
        
        if ($stmt->execute()) {
            $stmt = $conn->prepare("SELECT id, email, name, department, year, is_admin FROM users WHERE id = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            $user = $result->fetch_assoc();
            sendSuccess($user, 'Profile updated successfully');
        } else {
            sendError('Update failed', 500);
        }
        break;
        
    case 'DELETE':
        // Delete user account
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        
        if ($stmt->execute()) {
            session_destroy();
            sendSuccess(null, 'Account deleted successfully');
        } else {
            sendError('Delete failed', 500);
        }
        break;
        
    default:
        sendError('Method not allowed', 405);
}

closeDBConnection($conn);
?>

