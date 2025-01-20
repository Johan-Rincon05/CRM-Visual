document.addEventListener('DOMContentLoaded', () => {
    setupFileUpload();
    setupEventListeners();
});

let csvData = [];

function setupFileUpload() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('csvFile');

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });
}

function handleFile(file) {
    if (!file || file.type !== 'text/csv') {
        showError('Por favor, selecciona un archivo CSV válido');
        return;
    }

    document.getElementById('fileInfo').textContent = file.name;
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const csv = e.target.result;
            parseCSV(csv);
        } catch (error) {
            showError('Error al leer el archivo CSV');
        }
    };

    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    csvData = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        return row;
    }).filter(row => Object.values(row).some(value => value));

    updatePreviewTable();
    document.getElementById('uploadBtn').disabled = false;
}

function updatePreviewTable() {
    const tbody = document.getElementById('previewTableBody');
    tbody.innerHTML = '';

    const previewData = csvData.slice(0, 5); // Show first 5 rows
    
    previewData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.nombre || ''}</td>
            <td>${row.telefono || ''}</td>
            <td>${row.correo || ''}</td>
            <td>${row.carrera_interes || ''}</td>
            <td>${row.ultimo_titulo || ''}</td>
            <td>${row.nombre_titulo || ''}</td>
        `;
        tbody.appendChild(tr);
    });
}

function setupEventListeners() {
    document.getElementById('uploadBtn').addEventListener('click', () => {
        const pautaSource = document.getElementById('pautaSource').value;
        if (!pautaSource) {
            showError('Por favor, selecciona una fuente de pauta');
            return;
        }
        showConfirmModal();
    });

    document.getElementById('confirmUpload').addEventListener('click', () => {
        uploadLeads();
    });
}

function showConfirmModal() {
    document.getElementById('leadCount').textContent = csvData.length;
    document.getElementById('confirmModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

async function uploadLeads() {
    const uploadStatus = document.getElementById('uploadStatus');
    const progressBar = document.getElementById('uploadProgress');
    const statusMessage = document.getElementById('statusMessage');
    
    uploadStatus.style.display = 'block';
    closeModal();

    const pautaSource = document.getElementById('pautaSource').value;
    const batchSize = 100;
    let processed = 0;

    try {
        for (let i = 0; i < csvData.length; i += batchSize) {
            const batch = csvData.slice(i, i + batchSize);
            
            const response = await fetch('../api/upload-leads.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    leads: batch,
                    pauta: pautaSource
                })
            });

            if (!response.ok) throw new Error('Error en la carga');

            processed += batch.length;
            const progress = (processed / csvData.length) * 100;
            progressBar.style.width = `${progress}%`;
            statusMessage.textContent = `Procesando... ${processed}/${csvData.length} leads`;
        }

        statusMessage.textContent = 'Carga completada exitosamente';
        setTimeout(() => {
            window.location.href = 'base_master.html';
        }, 2000);

    } catch (error) {
        statusMessage.textContent = 'Error en la carga de leads';
        console.error('Error:', error);
    }
}

function showError(message) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.style.color = '#f44336';
    document.getElementById('uploadStatus').style.display = 'block';
}
