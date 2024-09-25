<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Einbindung der Datenbank-Konfigurationsdatei
include 'db_cfg.php';

// Beginnen eine Transaktion
$conn->begin_transaction();

// SQL-Abfrage zum Löschen aller Termine von Patienten, die als gelöscht markiert sind
$sql_delete_termine = "DELETE FROM termine WHERE patient_id IN (SELECT id FROM patienten WHERE is_deleted = TRUE)";
$stmt_termine = $conn->prepare($sql_delete_termine);

if ($stmt_termine->execute()) {
    // SQL-Abfrage zum Löschen aller Patienten, die als gelöscht markiert sind
    $sql_delete_patients = "DELETE FROM patienten WHERE is_deleted = TRUE";
    $stmt_patients = $conn->prepare($sql_delete_patients);

    if ($stmt_patients->execute()) {
        // Commit der Transaktion
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Alle Patienten und Termine erfolgreich gelöscht.']);
    } else {
        // Rollback der Transaktion bei Fehler
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen der Patienten.', 'error' => $stmt_patients->error]);
    }

    $stmt_patients->close();
} else {
    // Rollback der Transaktion bei Fehler
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen der Termine.', 'error' => $stmt_termine->error]);
}

$stmt_termine->close();
$conn->close();
?>
