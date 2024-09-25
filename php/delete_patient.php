<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Einbindung der Datenbank-Konfigurationsdatei
include 'db_cfg.php';

// JSON-Daten von der POST-Anfrage abrufen
$data = json_decode(file_get_contents('php://input'), true);

// Debug-Ausgabe der empfangenen Daten
file_put_contents('php://stderr', print_r($data, TRUE));

if (isset($data['id']) && filter_var($data['id'], FILTER_VALIDATE_INT)) {
    $patientId = $data['id'];

    // Prüfen, ob der Patient existiert und is_deleted auf TRUE gesetzt ist
    $sql_check = "SELECT id FROM patienten WHERE id = ? AND is_deleted = TRUE";
    $stmt_check = $conn->prepare($sql_check);
    $stmt_check->bind_param("i", $patientId);
    $stmt_check->execute();
    $stmt_check->store_result();

    if ($stmt_check->num_rows > 0) {
        // Beginnen eine Transaktion
        $conn->begin_transaction();

        // SQL-Abfrage zum endgültigen Löschen der Termine des Patienten
        $sql_delete_termine = "DELETE FROM termine WHERE patient_id = ?";
        $stmt_termine = $conn->prepare($sql_delete_termine);
        $stmt_termine->bind_param("i", $patientId);

        if ($stmt_termine->execute()) {
            // SQL-Abfrage zum endgültigen Löschen des Patienten
            $sql_delete_patient = "DELETE FROM patienten WHERE id = ?";
            $stmt_patient = $conn->prepare($sql_delete_patient);
            $stmt_patient->bind_param("i", $patientId);

            if ($stmt_patient->execute()) {
                // Commit der Transaktion
                $conn->commit();
                echo json_encode(['success' => true, 'message' => 'Patient und Termine erfolgreich gelöscht.']);
            } else {
                // Rollback der Transaktion bei Fehler
                $conn->rollback();
                echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen des Patienten.', 'error' => $stmt_patient->error]);
            }

            $stmt_patient->close();
        } else {
            // Rollback der Transaktion bei Fehler
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen der Termine.', 'error' => $stmt_termine->error]);
        }

        $stmt_termine->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Patient nicht gefunden oder nicht zum Löschen markiert.']);
    }

    $stmt_check->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Keine gültige ID erhalten.']);
}

$conn->close();
?>
