<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Einbindung der Datenbank-Konfigurationsdatei
include 'db_cfg.php';

// JSON-Daten von der POST-Anfrage abrufen
$data = json_decode(file_get_contents('php://input'), true);

// Überprüfen, ob die ID gesetzt ist und ein gültiger Integerwert ist
if (isset($data['id']) && filter_var($data['id'], FILTER_VALIDATE_INT)) {
    $patientId = $data['id'];

    // Update-Abfrage zum Setzen von is_deleted auf 1
    $sql = "UPDATE patienten SET is_deleted = 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $patientId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Patient erfolgreich in den Papierkorb verschoben.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler beim Verschieben des Patienten.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Ungültige oder fehlende ID.']);
}

$conn->close();
?>
