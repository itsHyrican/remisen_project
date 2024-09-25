<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Einbindung der Datenbank-Konfigurationsdatei
include 'db_cfg.php'; 

$patients = [];

// Erste Abfrage: Nur Patientendaten, die gelöscht sind
$sqlPatients = "SELECT * FROM patienten WHERE is_deleted = ?";
$stmtPatients = $conn->prepare($sqlPatients);
$isDeleted = TRUE;
$stmtPatients->bind_param("i", $isDeleted);
$stmtPatients->execute();
$resultPatients = $stmtPatients->get_result();

if ($resultPatients->num_rows > 0) {
    while ($row = $resultPatients->fetch_assoc()) {
        $patients[$row['id']] = $row;
        $patients[$row['id']]['termine'] = [];  // Bereitet ein Array für Termine vor
    }
}

// Zweite Abfrage: Nur Termindaten für Patienten, die gelöscht sind
if (!empty($patients)) {
    $patientIds = array_keys($patients);
    $placeholders = implode(',', array_fill(0, count($patientIds), '?'));

    $sqlTermine = "SELECT * FROM termine WHERE patient_id IN ($placeholders)";
    $stmtTermine = $conn->prepare($sqlTermine);

    // Dynamisches Binden der Parameter
    $types = str_repeat('i', count($patientIds));
    $stmtTermine->bind_param($types, ...$patientIds);
    $stmtTermine->execute();
    $resultTermine = $stmtTermine->get_result();

    if ($resultTermine->num_rows > 0) {
        while ($row = $resultTermine->fetch_assoc()) {
            $patients[$row['patient_id']]['termine'][] = $row;  // Fügt Termine zum richtigen Patienten hinzu
        }
    }
}

header('Content-Type: application/json');
echo json_encode(['success' => true, 'data' => array_values($patients)]);

$stmtPatients->close();
$stmtTermine->close();
$conn->close();
?>
