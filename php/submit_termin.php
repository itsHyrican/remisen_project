<?php
error_reporting(E_ALL);
ini_set('display_errors', 0); // Fehler nicht anzeigen

// Einbindung der Datenbank-Konfigurationsdatei
include 'db_cfg.php'; 

// JSON-Daten von der POST-Anfrage abrufen
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data)) {
    $patientenname = isset($data['patientenname']) ? $data['patientenname'] : '';
    $erstellt_von = isset($data['erstellt_von']) ? $data['erstellt_von'] : '';
    $rezept_auswahl = isset($data['rezept_auswahl']) ? $data['rezept_auswahl'] : '';
    $rezept_zusatz = isset($data['rezept_zusatz']) ? $data['rezept_zusatz'] : '';
    $ueberweisungsauswahl = isset($data['ueberweisungsauswahl']) ? $data['ueberweisungsauswahl'] : '';
    $ueberweisung_zusatz = isset($data['ueberweisung_zusatz']) ? $data['ueberweisung_zusatz'] : '';
    $fragebogenauswahl = isset($data['fragebogenauswahl']) ? $data['fragebogenauswahl'] : '';
    $fragebogen_zusatz = isset($data['fragebogen_zusatz']) ? $data['fragebogen_zusatz'] : '';
    $blutabnahmeauswahl = isset($data['blutabnahmeauswahl']) ? $data['blutabnahmeauswahl'] : '';
    $blutabnahme_zusatz = isset($data['blutabnahme_zusatz']) ? $data['blutabnahme_zusatz'] : '';
    $statusauswahl = isset($data['statusauswahl']) ? $data['statusauswahl'] : '';
    $status_zusatz = isset($data['status_zusatz']) ? $data['status_zusatz'] : '';
    $heilmittelverordnungsauswahl = isset($data['heilmittelverordnungsauswahl']) ? $data['heilmittelverordnungsauswahl'] : '';
    $zusatzliche_infos = isset($data['zusatzliche_infos']) ? $data['zusatzliche_infos'] : '';

    // SQL-Abfrage zum Einfügen der Patientendaten mit prepared statements
    $sql_patient = "INSERT INTO patienten (patientenname, erstellt_von, rezept_auswahl, rezept_zusatz, ueberweisungsauswahl, ueberweisung_zusatz, fragebogenauswahl, fragebogen_zusatz, blutabnahmeauswahl, blutabnahme_zusatz, statusauswahl, status_zusatz, heilmittelverordnungsauswahl, zusatzliche_infos) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_patient = $conn->prepare($sql_patient);
    $stmt_patient->bind_param("ssssssssssssss", $patientenname, $erstellt_von, $rezept_auswahl, $rezept_zusatz, $ueberweisungsauswahl, $ueberweisung_zusatz, $fragebogenauswahl, $fragebogen_zusatz, $blutabnahmeauswahl, $blutabnahme_zusatz, $statusauswahl, $status_zusatz, $heilmittelverordnungsauswahl, $zusatzliche_infos);

    if ($stmt_patient->execute()) {
        $patient_id = $conn->insert_id;

        $termin_errors = [];

        foreach ($data['termine'] as $termin) {
            $datum_fuer_termin = isset($termin['datum_fuer_termin']) ? $termin['datum_fuer_termin'] : '';
            $behandlerin = isset($termin['behandlerin']) ? $termin['behandlerin'] : '';
            $art_des_termins = isset($termin['art_des_termins']) ? $termin['art_des_termins'] : '';
            $termindauer = isset($termin['termindauer']) ? $termin['termindauer'] : '';
            $extra_arzt = isset($termin['extra_arzt']) ? $termin['extra_arzt'] : '';
            $dauer_extra_arzt = isset($termin['dauer_extra_arzt']) ? $termin['dauer_extra_arzt'] : '';
            $diagnostik = isset($termin['diagnostik']) ? $termin['diagnostik'] : '';

            // SQL-Abfrage zum Einfügen der Termindaten mit prepared statements
            $sql_termin = "INSERT INTO termine (patient_id, datum_fuer_termin, behandlerin, art_des_termins, termindauer, extra_arzt, dauer_extra_arzt, diagnostik) 
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt_termin = $conn->prepare($sql_termin);
            $stmt_termin->bind_param("isssssss", $patient_id, $datum_fuer_termin, $behandlerin, $art_des_termins, $termindauer, $extra_arzt, $dauer_extra_arzt, $diagnostik);

            if (!$stmt_termin->execute()) {
                $termin_errors[] = $stmt_termin->error;
            }

            $stmt_termin->close();
        }

        if (empty($termin_errors)) {
            echo json_encode(['success' => true, 'message' => 'Daten erfolgreich gespeichert.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ein(ige) Termine konnte nicht gespeichert werden.', 'errors' => $termin_errors]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Patienten Daten konnte nicht gespeichert werden.', 'error' => $stmt_patient->error]);
    }

    $stmt_patient->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Keine Daten erhalten.']);
}

$conn->close();
?>
