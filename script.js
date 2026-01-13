let data = [];

// ✅ Al caricamento della pagina, prova a ricaricare il file salvato
window.addEventListener("load", () => {
    const savedFile = localStorage.getItem("savedExcel");
    const savedName = localStorage.getItem("savedExcelName");

    if (savedFile) {
        try {
            const workbook = XLSX.read(savedFile, { type: "base64" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            console.log("Dati ricaricati automaticamente:", data);

            document.getElementById("fileStatus").textContent =
                savedName ? `${savedName} (caricato automaticamente)` : "File caricato automaticamente";
        } catch (error) {
            console.error("Errore nel ricaricare il file:", error);
            document.getElementById("fileStatus").textContent = "Errore nel caricamento automatico";
        }
    }
});

// ✅ Carica un nuovo file Excel scelto dall’utente
document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const arrayBuffer = event.target.result;
            const uint8 = new Uint8Array(arrayBuffer);

            const workbook = XLSX.read(uint8, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            console.log("Dati caricati:", data);

            const base64 = XLSX.write(workbook, { type: "base64", bookType: "xlsx" });
            localStorage.setItem("savedExcel", base64);
            localStorage.setItem("savedExcelName", file.name);

            document.getElementById("fileStatus").textContent = file.name;
        } catch (error) {
            console.error("Errore nel caricamento del file:", error);
            document.getElementById("fileStatus").textContent = "Errore nel caricamento";
        }
    };

    reader.readAsArrayBuffer(file);
});

// ✅ Ricerca parziale sulla colonna "Cosa"
function searchItems() {
    const input = document.getElementById("searchInput").value.toLowerCase();

    if (!data || data.length === 0) return;

    const results = data.filter(item => {
        const value = item.Cosa ?? "";
        return String(value).toLowerCase().includes(input);
    });

    displayResults(results);
}

// ✅ Mostra i risultati cliccabili
function displayResults(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    const details = document.getElementById("details");
    details.innerHTML = "";

    results.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = String(item.Cosa);

        div.onclick = () => showDetails(item);
        container.appendChild(div);
    });
}

// ✅ Mostra i dettagli completi dell’oggetto selezionato
function showDetails(item) {
    const details = document.getElementById("details");
    details.innerHTML = "";

    const box = document.createElement("div");
    box.className = "details-box";

    let html = "<h3>Dettagli</h3>";
    for (let key in item) {
        html += `<p><strong>${key}:</strong> ${item[key]}</p>`;
    }

    box.innerHTML = html;
    details.appendChild(box);
}

// ✅ Reset del file salvato
function resetFile() {
    localStorage.removeItem("savedExcel");
    localStorage.removeItem("savedExcelName");
    document.getElementById("fileStatus").textContent = "Nessun file caricato";
    alert("File salvato cancellato. Ricarica la pagina.");
}
