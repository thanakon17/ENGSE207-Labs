<?php
header("Content-Type: application/json; charset=UTF-8");

// Database Connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "stardew_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}
$conn->set_charset("utf8mb4");

// Determine action from URL parameter
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_farmer':
        getFarmerDetails($conn);
        break;
    case 'get_all_farmers':
        getAllFarmers($conn);
        break;
    case 'get_all_items':
        getAllItems($conn);
        break;
    case 'add_item':
        addItemToInventory($conn);
        break;
    case 'get_all_farmers_sorted_by_money':
        getAllFarmersSortedByMoney($conn);
        break;
    default:
        echo json_encode(["error" => "Invalid action specified"]);
}

$conn->close();

// --- Functions for each action ---

function getFarmerDetails($conn) {
    if (!isset($_GET['farmer_id']) || !is_numeric($_GET['farmer_id'])) {
        echo json_encode(["error" => "Invalid or missing farmer_id"]);
        exit();
    }
    $farmer_id = intval($_GET['farmer_id']);
    $response = [];
    
    // Get Farmer Info
    $sql_farmer = "SELECT f.farm_name, f.money, p.username FROM Farmers f JOIN Players p ON f.player_id = p.player_id WHERE f.farmer_id = ?";
    $stmt = $conn->prepare($sql_farmer);
    $stmt->bind_param("i", $farmer_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $response = $result->fetch_assoc();
        
        // Get Skills
        $sql_skills = "SELECT s.name, fs.level FROM Farmer_Skills fs JOIN Skills s ON fs.skill_id = s.skill_id WHERE fs.farmer_id = ?";
        $stmt_skills = $conn->prepare($sql_skills);
        $stmt_skills->bind_param("i", $farmer_id);
        $stmt_skills->execute();
        $skills_result = $stmt_skills->get_result();
        $response['skills'] = $skills_result->fetch_all(MYSQLI_ASSOC);

        // Get Buffs from equipped items
        $sql_buffs = "SELECT IFNULL(SUM(i.buff_combat), 0) AS total_combat_buff, IFNULL(SUM(i.buff_defense), 0) AS total_defense_buff, IFNULL(SUM(i.buff_luck), 0) AS total_luck_buff FROM Farmers f LEFT JOIN Equipped_Items ei ON f.farmer_id = ei.farmer_id LEFT JOIN Farmer_Inventory fi ON ei.inventory_id = fi.inventory_id LEFT JOIN Items i ON fi.item_id = i.item_id WHERE f.farmer_id = ? GROUP BY f.farmer_id";
        $stmt_buffs = $conn->prepare($sql_buffs);
        $stmt_buffs->bind_param("i", $farmer_id);
        $stmt_buffs->execute();
        $buffs_result = $stmt_buffs->get_result();
        $response['buffs'] = $buffs_result->fetch_assoc();

    } else {
        $response = ["error" => "Farmer not found"];
    }
    echo json_encode($response);
    $stmt->close();
}

function getAllFarmers($conn) {
    $sql = "SELECT farmer_id, farm_name FROM Farmers ORDER BY farm_name";
    $result = $conn->query($sql);
    $farmers = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($farmers);
}

function getAllItems($conn) {
    $sql = "SELECT item_id, name FROM Items ORDER BY name";
    $result = $conn->query($sql);
    $items = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($items);
}

function addItemToInventory($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["error" => "Invalid request method"]);
        exit();
    }

    $farmer_id = $_POST['farmer_id'] ?? 0;
    $item_id = $_POST['item_id'] ?? 0;
    $quantity = $_POST['quantity'] ?? 1;

    if (empty($farmer_id) || empty($item_id) || empty($quantity)) {
        echo json_encode(["error" => "Missing required fields"]);
        exit();
    }

    $sql = "INSERT INTO Farmer_Inventory (farmer_id, item_id, quantity) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iii", $farmer_id, $item_id, $quantity);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Item added successfully!"]);
    } else {
        echo json_encode(["error" => "Failed to add item: " . $stmt->error]);
    }
    $stmt->close();
}

function getAllFarmersSortedByMoney($conn) {
    $sql = "SELECT p.username, f.farm_name, f.money 
            FROM Farmers f 
            JOIN Players p ON f.player_id = p.player_id 
            ORDER BY f.money DESC";
    $result = $conn->query($sql);
    if ($result) {
        $farmers = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($farmers);
    } else {
        echo json_encode(["error" => "Could not fetch leaderboard data"]);
    }
}
?>