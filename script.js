let data = [];

// ✅ Al caricamento della pagina, prova a ricaricare il file salvato
window.addEventListener("load", () => {
    const savedFile = localStorage.getItem("savedExcel");
    const savedName = localStorage.getItem("savedExcelName");

    if (savedFile) {
        loadSavedFile(savedFile);

        if (savedName) {
            document.getElementById("fileStatus").textContent =
                savedName + " (caricato automaticamente)";
        } else {
            document.getElementById("fileStatus").textContent =
                "File caricato automaticamente";
        }
    }
});

// ✅ Carica un nuovo file Excel scelto dall’utente
document.getElementById("fileInput").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const binary = event.target.result;
        const workbook = XLSX.read(binary, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        data = XLSX.utils.sheet_to_json(sheet);

        console.log("Dati caricati:", data);

        // ✅ Salva il file in localStorage in base64
        const base64 = btoa(binary);
        localStorage.setItem("savedExcel", base64);

        // ✅ Salva anche il nome del file
        localStorage.setItem("savedExcelName", file.name);
        document.getElementById("fileStatus").textContent = file.name;
    };

    reader.readAsBinaryString(file);
});

// ✅ Ricarica il file salvato in localStorage
function loadSavedFile(base64) {
    const workbook = XLSX.read(base64, { type: "base64" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = XLSX.utils.sheet_to_json(sheet);

    console.log("Dati ricaricati automaticamente:", data);
}

// ✅ Ricerca parziale sulla colonna "Cosa"
function searchItems() {
    const input = document.getElementById("searchInput").value.toLowerCase();

    if (!data || data.length === 0) {
        return;
    }

    const results = data.filter(item =>
        item.Cosa &&
        item.Cosa.toLowerCase().includes(input)
    );

    displayResults(results);
}

// ✅ Mostra i risultati cliccabili
function displayResults(results) {
    const container = document.getElementById("results");
    container.innerHTML = "";

    const details = document.getElementById("details");
    details.innerHTML = ""; // pulisce i dettagli quando fai una nuova ricerca

    results.forEach(item => {
        const div = document.createElement("div");
        div.className = "result-item";
        div.textContent = item.Cosa;

        // ✅ Quando clicchi un risultato, mostra i dettagli completi
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