document.addEventListener("DOMContentLoaded", function () {
  // Ruft die Daten sofort beim Laden der Seite ab
  fetchData();

  // Setzt ein Intervall, um die Daten alle 15 Sekunden zu aktualisieren
  setInterval(fetchData, 15000);
});

 // Liest die Daten aus
function fetchData() {
  fetch("php/get_data.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        displayPatients(data.data);
      } else {
        console.error("Fehler beim Laden der Daten:", data.message);
      }
    })
    .catch((error) => {
      console.error("Netzwerkfehler:", error);
    });
}

function displayPatients(patients) {
  const container = document.getElementById("patientContainer");
  container.innerHTML = ""; // Bereinigt frühere Inhalte, falls vorhanden

  patients.forEach((patient) => {
    // Erstellt ein neues div-Element für jeden Patienten
    const patientDiv = document.createElement("div");
    patientDiv.id = "patient-" + patient.id;
    patientDiv.classList.add("relative", "rounded-lg", "shadow", "p-3", "text-center", "cursor-pointer", "flex", "flex-col", "justify-center", "content-center", "items-center", "w-full", "h-40", "bg-opacity-100", "hover:bg-opacity-70");

    // Setzt die Hintergrundfarbe basierend auf dem Ersteller
    switch (patient.erstellt_von) {
      case "PT Müller":
        patientDiv.classList.add("bg-blue-300");
        break;
      case "Dr. med. Oehme":
        patientDiv.classList.add("bg-green-200");
        break;
      case "Dr. med. Baßeler":
        patientDiv.classList.add("bg-yellow-300");
        break;
      case "Dr. med. Gottberg":
        patientDiv.classList.add("bg-purple-400");
        break;
      case "PT Goldammer":
        patientDiv.classList.add("bg-purple-600");
        break;
      case "PT Birkholz":
        patientDiv.classList.add("bg-orange-300");
        break;
      case "PT Gerlach":
        patientDiv.classList.add("bg-orange-600");
        break;
      case "PT Richel":
        patientDiv.classList.add("bg-red-700");
        break;
      case "PT Siering":
        patientDiv.classList.add("bg-green-700");
        break;
      case "PiA":
        patientDiv.classList.add("bg-gray-500");
        break;
      default:
        patientDiv.classList.add("bg-white");
        break;
    }
    // Setzt den inneren HTML-Inhalt des Patienten-Divs
    patientDiv.innerHTML = `
            <h3 class="text-lg font-semibold">${patient.patientenname}</h3>
            <p>Erstellt von: ${patient.erstellt_von}</p>
            <button onclick="confirmDelete(event, ${patient.id})" class="absolute top-2 right-2 rounded-full px-2 py-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
    container.appendChild(patientDiv);

    // Fügt einen Event-Listener hinzu, um Details anzuzeigen, wenn auf das Patienten-Div geklickt wird
    patientDiv.addEventListener("click", (event) => toggleDetails(event, patient));
  });
}

function toggleDetails(event, patient) {
  // Verhindert das Öffnen des Detail-Popups beim Klicken auf den Löschen-Button
  if (event.target.closest("button")) return;

  const detailsContent = document.getElementById("detailsContent");
  detailsContent.innerHTML = buildDetailsHTML(patient);

  // Overlay und Popup anzeigen
  document.getElementById("popupOverlay").classList.remove("hidden");
  document.getElementById("detailsPopup").classList.remove("hidden");
}

function buildDetailsHTML(patient) {
  // Erstellt HTML für die Termine
  const termineHTML = patient.termine
    .map(
      (termin) => `
        <div class="text-center border mt-2 p-4 bg-gray-100 border-gray-300 rounded shadow">
            <p>${termin.datum_fuer_termin || "-"}</p>
            <p>${termin.behandlerin || "-"}</p>
            ${
              termin.art_des_termins !== "Diagnostik"
                ? `<p>${termin.art_des_termins || "-"}</p>`
                : ""
            }
            ${
              termin.diagnostik !== "Bitte wählen..."
                ? `<p><strong>${termin.diagnostik}</strong>`
                : ""
            }
            <p>${termin.termindauer}</p>
            ${
              termin.extra_arzt !== "Nicht benötigt"
                ? `<p><strong>Arzt dazu:</strong> ${termin.extra_arzt}</p>`
                : ""
            }
            ${
              termin.dauer_extra_arzt !== "Nicht benötigt"
                ? `<p><strong>für:</strong>  ${termin.dauer_extra_arzt}</p>`
                : ""
            }
        </div>
    `
    )
    .join("");
  // Erstellt das vollständige HTML für das Detail-Popup
  return `
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l .041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mt-2">${
          patient.patientenname
        }</h3>
        <p class="text-sm text-gray-500"><strong>Erstellt von: </strong>${
          patient.erstellt_von
        }</p>	
        <div class="mt-1 px-7 py-3 text-sm text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            <div class="w-full bg-gray-200 h-0.5 col-span-full"></div>
            <div>
                <p><strong>Rezept:</strong> ${
                  patient.rezept_auswahl
                } <strong>:</strong> ${patient.rezept_zusatz}</p>
                <p><strong>Überweisung:</strong> ${
                  patient.ueberweisungsauswahl
                } <strong>:</strong> ${patient.ueberweisung_zusatz}</p>
                <p><strong>${
                  patient.fragebogenauswahl
                }</strong> <strong>:</strong> ${patient.fragebogen_zusatz}</p>
            </div>
            <div>
                ${
                  patient.blutabnahmeauswahl !== "Nicht benötigt"
                    ? `<p><strong>BE:</strong> ${patient.blutabnahmeauswahl} <strong>:</strong> ${patient.blutabnahme_zusatz}</p>`
                    : ""
                }
                ${
                  patient.statusauswahl !== "Nicht benötigt"
                    ? `<p><strong>Status:</strong> ${patient.statusauswahl} <strong>:</strong> ${patient.status_zusatz}</p>`
                    : ""
                }
                ${
                  patient.heilmittelverordnungsauswahl !== "Nicht benötigt"
                    ? `<p><strong>${patient.heilmittelverordnungsauswahl}</strong></p>`
                    : ""
                }
            </div>
            ${
              patient.zusatzliche_infos !== "Nicht benötigt"
                ? `<p>${patient.zusatzliche_infos}</p>`
                : ""
            }
            <div class="w-full bg-gray-200 h-0.5 col-span-full"></div>
            <h4 class="text-center text-xl font-bold text-gray-900 mt-2 col-span-full">Termine:</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-full">
                ${termineHTML}
            </div>
        </div>
        <div class="absolute top-2 right-2 bg-red-500 hover:bg-red-900 text-white rounded-full px-2 py-1">
            <button onclick="closeDetails()" class="text-white text-base font-medium rounded-md px-4 py-2 w-full">Schließen</button>
        </div>
    `;
}

function confirmDelete(event, patientId) {
  event.stopPropagation(); // Verhindert das Öffnen des Detail-Popups
  // Overlay und Popup für Lösch-Bestätigung anzeigen
  document.getElementById("deletePopup").classList.remove("hidden");
  document.getElementById("popupOverlay").classList.remove("hidden");

  // Event-Listener für den Bestätigungsbutton
  document.getElementById("confirmDeleteButton").onclick = function () {
    movePatientToTrash(patientId);
  };
}

// Verschiebt einen Patienten in den Papierkorb wenn er gelöschjt wird
function movePatientToTrash(patientId) {
  fetch("php/move_patient.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: patientId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Patient erfolgreich in den Papierkorb verschoben
        closeDeletePopup();
        document.getElementById("patient-" + patientId).remove();
      } else {
        console.error("Fehler beim Verschieben des Patienten:", data.message);
      }
    })
    .catch((error) => {
      console.error("Netzwerkfehler:", error);
    });
}

function closeDeletePopup() {
  document.getElementById("deletePopup").classList.add("hidden");
  document.getElementById("popupOverlay").classList.add("hidden");
}

function closeDetails() {
  document.getElementById("detailsPopup").classList.add("hidden");
  document.getElementById("popupOverlay").classList.add("hidden");
}
