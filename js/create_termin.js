document.addEventListener("DOMContentLoaded", (event) => {
  const newTerminButton = document.getElementById("new_termin_button");
  const terminPopup = document.getElementById("termin_popup");
  const closePopupButton = document.getElementById("close_popup");
  const savePopupButton = document.getElementById("save_popup");

  const closePopUpSuccess = document.getElementById("close_popup_save");
  const closePopupError = document.getElementById("close_popup_error");
  const popupSuccess = document.getElementById("popup_save");
  const popupError = document.getElementById("popup_error");

  const terminContainer = document.getElementById("termin_container");
  const diagnostikOptions = document.getElementById("diagnostik-options");
  const arztPlusSelect = document.getElementById("arzt+-select");
  const arztPlusOptionsDiv = document.getElementById("arzt+-options");
  const ptOptions = document.getElementById("pt-options");
  const piaOptions = document.getElementById("pia-options");
  const arztOptions = document.getElementById("arzt-options");
  const artSelect = document.getElementById("art-select");

  let currentEditingDiv = null; // Aktuell bearbeitetes Termin-Div

  // Öffnet das Popup
  function openPopup() {
    terminPopup.classList.remove("hidden");
  }

  // Schließt das Popup
  function closePopup() {
    terminPopup.classList.add("hidden");
    resetPopup();
  }
  // Setzt die Felder im Popup zurück
  function resetPopup() {
    terminPopup
      .querySelectorAll("select")
      .forEach((select) => (select.selectedIndex = 0));
    diagnostikOptions.classList.add("hidden");
    ptOptions.style.display = "none";
    piaOptions.style.display = "none";
    arztOptions.style.display = "none";
    currentEditingDiv = null;
  }
  // Setzt alle Felder im Popup vollständig zurück
  function completeReset() {
    document.getElementById("pt-option").selectedIndex = 0;
    document.getElementById("pia-option").selectedIndex = 0;
    document.getElementById("arzt-option").selectedIndex = 0;
    document.getElementById("diagnostik-option").selectedIndex = 0;

    ptOptions.style.display = "none";
    piaOptions.style.display = "none";
    arztOptions.style.display = "none";
    diagnostikOptionsDiv.classList.add("hidden");
  }

  // Event-Listener für Änderungen am artSelect-Dropdown
  artSelect.addEventListener("change", function () {
    completeReset();

    switch (this.options[this.selectedIndex].text) {
      case "Dr. med. Baßeler":
      case "Dr. med. Gottberg":
      case "Dr. med. Oehme":
        arztOptions.style.display = "block";
        break;
      case "PT Müller":
      case "PT Siering":
      case "PT Birkholz":
      case "PT Gerlach":
      case "PT Goldammer":
      case "PT Richel":
        ptOptions.style.display = "block";
        break;
      case "PiA":
        piaOptions.style.display = "block";
        break;
      default:
        break;
    }
  });

  // Erstellt einen neuen Termin oder aktualisiert einen bestehenden
  function createTermin() {
    const dateSelect = document.getElementById("date-select");
    const artSelect = document.getElementById("art-select");
    const timeSelect = document.getElementById("time-select");
    const artTerminSelect = getArtTerminSelectValueElement();
    const arztPlusSelect = document.getElementById("arzt+-select");
    const arztPlusOptionsSelect = document.getElementById("arzt+-option");
    const diagnostikSelect = document.getElementById("diagnostik-option");

    // Überprüft, ob alle erforderlichen Felder ausgefüllt sind
    if (
      !dateSelect.value ||
      !artSelect.value ||
      !timeSelect.value ||
      !artTerminSelect.value ||
      !arztPlusSelect.value ||
      !arztPlusOptionsSelect.value
    ) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    // Holt die ausgewählten Texte der Dropdowns
    const dateText = dateSelect.options[dateSelect.selectedIndex].text;
    const artText = artSelect.options[artSelect.selectedIndex].text;
    const timeText = timeSelect.options[timeSelect.selectedIndex].text;
    const artTerminText =
      artTerminSelect.options[artTerminSelect.selectedIndex].text;
    const diagnostikText =
      diagnostikSelect.options[diagnostikSelect.selectedIndex].text;
    const arztPlusText =
      arztPlusSelect.options[arztPlusSelect.selectedIndex].text;
    const arztPlusOptionsText =
      arztPlusOptionsSelect.options[arztPlusOptionsSelect.selectedIndex].text;

    let terminDiv;

    // Wenn ein Termin bearbeitet wird, aktualisiert das bestehende Div
    if (currentEditingDiv) {
      terminDiv = currentEditingDiv;
      updateTerminDiv(
        terminDiv,
        dateText,
        artText,
        timeText,
        artTerminText,
        arztPlusText,
        arztPlusOptionsText,
        diagnostikText
      );
    }
    // Andernfalls erstellt ein neues Div für den neuen Termin
    else {
      terminDiv = document.createElement("div");
      terminDiv.classList.add("bg-white", "rounded-lg", "shadow", "p-3", "text-center", "cursor-pointer", "mx-1", "my-1", "flex", "flex-col", "justify-around", "items-start", "w-full", "md:w-1/4", "h-auto"
      );

      updateTerminDiv(
        terminDiv,
        dateText,
        artText,
        timeText,
        artTerminText,
        arztPlusText,
        arztPlusOptionsText,
        diagnostikText
      );

      terminDiv.addEventListener("click", function () {
        editTermin(terminDiv);
      });

      terminContainer.insertBefore(terminDiv, newTerminButton);
    }

    closePopup();
  }

  // Aktualisiert das Termin-Div mit den übergebenen Werten
  function updateTerminDiv(
    div,
    date,
    art,
    time,
    artTermin,
    arztPlus,
    arztPlusOption,
    diagnostik
  ) {
    div.innerHTML = `
        <p class="w-full truncate"><strong>Datum:</strong> ${date}</p>
        <p class="w-full truncate"><strong>Behandler:</strong> ${art}</p>
        <p class="w-full truncate"><strong>Art des Termins:</strong> ${artTermin}</p>
        <p class="w-full truncate"><strong>Termindauer:</strong> ${time}</p>
        <p class="w-full truncate"><strong>Arztkontakt:</strong> ${arztPlus}</p>`;

    div.setAttribute("data-date", date);
    div.setAttribute("data-art", art);
    div.setAttribute("data-time", time);
    div.setAttribute("data-art-termin", artTermin);
    div.setAttribute("data-art-diagnostik", diagnostik);
    div.setAttribute("data-arzt-plus", arztPlus);
    div.setAttribute("data-arzt-plus-option", arztPlusOption);
  }

  // Bearbeitet einen bestehenden Termin
  function editTermin(div) {
    currentEditingDiv = div;
    const date = div.getAttribute("data-date");
    const art = div.getAttribute("data-art");
    const time = div.getAttribute("data-time");
    const artTermin = div.getAttribute("data-art-termin");
    const diagnostikOption = div.getAttribute("data-art-diagnostik");
    const arztPlus = div.getAttribute("data-arzt-plus");
    const arztPlusOption = div.getAttribute("data-arzt-plus-option");

    setSelectOptionByText(document.getElementById("date-select"), date);
    setSelectOptionByText(document.getElementById("art-select"), art);
    setSelectOptionByText(
      document.getElementById("diagnostik-option"),
      diagnostikOption
    );
    setSelectOptionByText(document.getElementById("time-select"), time);
    setSelectOptionByText(document.getElementById("arzt+-select"), arztPlus);
    setSelectOptionByText(
      document.getElementById("arzt+-option"),
      arztPlusOption
    );

    ptOptions.style.display = "none";
    piaOptions.style.display = "none";
    arztOptions.style.display = "none";

    // Zeigt die entsprechenden Optionen basierend auf dem ausgewählten Behandler an
    switch (art) {
      case "Dr. med. Baßeler":
      case "Dr. med. Gottberg":
      case "Dr. med. Oehme":
        arztOptions.style.display = "block";
        setSelectOptionByText(
          document.getElementById("arzt-option"),
          artTermin
        );
        break;
      case "PT Müller":
      case "PT Siering":
      case "PT Birkholz":
      case "PT Gerlach":
      case "PT Goldammer":
      case "PT Richel":
        ptOptions.style.display = "block";
        setSelectOptionByText(document.getElementById("pt-option"), artTermin);
        if (artTermin === "Diagnostik") {
          diagnostikOptions.classList.remove("hidden");
        }
        break;
      case "PiA":
        piaOptions.style.display = "block";
        setSelectOptionByText(document.getElementById("pia-option"), artTermin);
        if (artTermin === "Diagnostik") {
          diagnostikOptions.classList.remove("hidden");
        }
        break;
      default:
        ptOptions.style.display = "block";
        break;
    }

    if (arztPlus !== "Nicht benötigt") {
      arztPlusOptionsDiv.classList.remove("hidden");
    }

    openPopup();
  }
  // Holt das entsprechende Dropdown-Element basierend auf der aktuellen Auswahl
  function getArtTerminSelectValueElement() {
    const ptOption = document.getElementById("pt-option");
    const piaOption = document.getElementById("pia-option");
    const arztOption = document.getElementById("arzt-option");

    if (ptOptions.style.display === "block") {
      return ptOption;
    } else if (piaOptions.style.display === "block") {
      return piaOption;
    } else if (arztOptions.style.display === "block") {
      return arztOption;
    } else {
      return null;
    }
  }

  // Setzt das ausgewählte Dropdown-Element basierend auf dem Text
  function setSelectOptionByText(selectElement, text) {
    for (let i = 0; i < selectElement.options.length; i++) {
      if (selectElement.options[i].text === text) {
        selectElement.selectedIndex = i;
        break;
      }
    }
  }

  // Handlet die Diagnostik Optionen, fürs ein und Ausblenden
  const ptOptionSelect = document.getElementById("pt-option");
  const piaOptionSelect = document.getElementById("pia-option");
  const diagnostikOptionsDiv = document.getElementById("diagnostik-options");

  function handleDiagnostikOptionChange(value) {
    if (value === "pt_diagnostik" || value === "pia_diagnostik") {
      diagnostikOptionsDiv.classList.remove("hidden");
    } else {
      diagnostikOptionsDiv.classList.add("hidden");
      document.getElementById("diagnostik-option").selectedIndex = 0;
    }
  }

  ptOptionSelect.addEventListener("change", function () {
    handleDiagnostikOptionChange(this.value);
  });

  piaOptionSelect.addEventListener("change", function () {
    handleDiagnostikOptionChange(this.value);
  });

  // Event Listener
  newTerminButton.addEventListener("click", function () {
    openPopup();
    if (arztPlusSelect.value !== "arzt+-nothing") {
      arztPlusOptionsDiv.classList.remove("hidden");
    }
  });

  closePopupButton.addEventListener("click", closePopup);

  savePopupButton.addEventListener("click", createTermin);
  window.addEventListener("click", (event) => {
    if (event.target == terminPopup) {
      closePopup();
    }
  });

  closePopUpSuccess.addEventListener("click", function () {
    popupSuccess.classList.add("hidden");
    window.location.href = "note_create.html";
  });

  closePopupError.addEventListener("click", function () {
    popupError.classList.add("hidden");
  });

  //Datenbankenübertragung
  document
    .getElementById("save_button")
    .addEventListener("click", sendToDatabase);

  function sendToDatabase() {
    const patientenName = document.getElementById("patienten_name").value;
    const erstelltVon = getSelectedOptionText("sendby-select");
    const rezeptAuswahl = getSelectedOptionText("recipe-select");
    const rezeptZusatz = document.getElementById("recipe-input").value;
    const ueberweisungsauswahl = getSelectedOptionText("transfer-select");
    const ueberweisungZusatz = document.getElementById("transfer-input").value;
    const fragebogenauswahl = getSelectedOptionText("question-select");
    const fragebogenZusatz = document.getElementById("question-input").value;
    const blutabnahmeauswahl = getSelectedOptionText("blood-select");
    const blutabnahmeZusatz = document.getElementById("blood-input").value;
    const statusauswahl = getSelectedOptionText("status-select");
    const statusZusatz = document.getElementById("status-input").value;
    const heilmittelverordnungsauswahl = getSelectedOptionText("therapy-select");
    const zusatzlicheInfos = document.getElementById("additional-info").value;

    // Überprüfung auf leere Felder für Patientennamen und Ersteller
    if (!patientenName || !erstelltVon || erstelltVon === "Bitte wählen...") {
      alert(
        "Bitte füllen Sie den Patientennamen aus und wählen Sie einen gültigen Ersteller!"
      );
      return;
    }

    const termine = [];
    terminContainer
      .querySelectorAll(".bg-white.rounded-lg.shadow")
      .forEach((terminDiv) => {
        const datum_fuer_termin = terminDiv.getAttribute("data-date");
        const behandlerin = terminDiv.getAttribute("data-art");
        const art_des_termins = terminDiv.getAttribute("data-art-termin");
        const termindauer = terminDiv.getAttribute("data-time");
        const extra_arzt = terminDiv.getAttribute("data-arzt-plus");
        const dauer_extra_arzt = terminDiv.getAttribute("data-arzt-plus-option");
        const diagnostik = terminDiv.getAttribute("data-art-diagnostik");

        if (
          datum_fuer_termin &&
          behandlerin &&
          art_des_termins &&
          termindauer &&
          extra_arzt &&
          dauer_extra_arzt
        ) {
          const termin = {
            datum_fuer_termin,
            behandlerin,
            art_des_termins,
            termindauer,
            extra_arzt,
            dauer_extra_arzt,
            diagnostik,
          };
          termine.push(termin);
        }
      });

    // Überprüfung, ob mindestens ein Termin erstellt wurde
    if (termine.length === 0) {
      alert("Bitte mindestens einen gültigen Termin erstellen");
      return;
    }

    const data = {
      patientenname: patientenName || null,
      erstellt_von: erstelltVon || null,
      rezept_auswahl: rezeptAuswahl || null,
      rezept_zusatz: rezeptZusatz || null,
      ueberweisungsauswahl: ueberweisungsauswahl || null,
      ueberweisung_zusatz: ueberweisungZusatz || null,
      fragebogenauswahl: fragebogenauswahl || null,
      fragebogen_zusatz: fragebogenZusatz || null,
      blutabnahmeauswahl: blutabnahmeauswahl || null,
      blutabnahme_zusatz: blutabnahmeZusatz || null,
      statusauswahl: statusauswahl || null,
      status_zusatz: statusZusatz || null,
      heilmittelverordnungsauswahl: heilmittelverordnungsauswahl || null,
      zusatzliche_infos: zusatzlicheInfos || null,
      termine: termine,
    };

    // Sendet die Daten an die PHP-Datei zum Speichern in der Datenbank
    fetch("php/submit_termin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        if (result.success) {
          console.log("Success:", result);
          document.getElementById("popup_save").classList.remove("hidden");
        } else {
          console.error("Error:", result.message);
          document.getElementById("popup_error").classList.remove("hidden");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("popup_error").classList.remove("hidden");
      });
  }

  // Holt den Text der ausgewählten Option eines Dropdowns
  function getSelectedOptionText(selectId) {
    const selectElement = document.getElementById(selectId);
    return selectElement.options[selectElement.selectedIndex].text;
  }
});
