<?php
// Authentication API Endpoints

require_once __DIR__ . '/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getDBConnection();
session_start();

switch ($method) {
    case 'POST':
        $action = $_GET['action'] ?? '';
        
        if ($action === 'register') {
            // Register new user
            $data = getRequestBody();
            
            if (empty($data['email']) || empty($data['password']) || empty($data['name']) || 
                empty($data['department']) || empty($data['year'])) {
                sendError('All fields are required', 400);
            }
            
            if (!validateEmail($data['email'])) {
                sendError('Invalid email format', 400);
            }
            
            if (strlen($data['password']) < 6) {
                sendError('Password must be at least 6 characters', 400);
            }
            
            // Check if email already exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->bind_param("s", $data['email']);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                sendError('Email already registered', 409);
            }
            
            // Create new user
            $hashedPassword = hashPassword($data['password']);
            $stmt = $conn->prepare("INSERT INTO users (email, password, name, department, year) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $data['email'], $hashedPassword, $data['name'], $data['department'], $data['year']);
            
            if ($stmt->execute()) {
                $userId = $conn->insert_id;
                $_SESSION['user_id'] = $userId;
                
                $user = [
                    'id' => $userId,
                    'email' => $data['email'],
                    'name' => $data['name'],
                    'department' => $data['department'],
                    'year' => $data['year'],
                    'is_admin' => false
                ];
                
                sendSuccess($user, 'Registration successful');
            } else {
                sendError('Registration failed', 500);
            }
        }
        
        elseif ($action === 'login') {
            // Login user
            $data = getRequestBody();
            
            if (empty($data['email']) || empty($data['password'])) {
                sendError('Email and password are required', 400);
            }
            
            $stmt = $conn->prepare("SELECT id, email, password, name, department, year, is_admin FROM users WHERE email = ?");
            $stmt->bind_param("s", $data['email']);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($user = $result->fetch_assoc()) {
                if (verifyPassword($data['password'], $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    unset($user['password']);
                    sendSuccess($user, 'Login successful');
                } else {
                    sendError('Invalid email or password', 401);
                }
            } else {
                sendError('Invalid email or password', 401);
            }
        }
        
        else {
            sendError('Invalid action', 400);
        }
        break;
        
    case 'GET':
        // Get current user
        $user = getCurrentUser($conn);
        if ($user) {
            sendSuccess($user);
        } else {
            sendError('Not authenticated', 401);
        }
        break;
        
    case 'DELETE':
        // Logout
        session_destroy();
        sendSuccess(null, 'Logged out successfully');
        break;
        
    default:
        sendError('Method not allowed', 405);
}

closeDBConnection($conn);
?>

