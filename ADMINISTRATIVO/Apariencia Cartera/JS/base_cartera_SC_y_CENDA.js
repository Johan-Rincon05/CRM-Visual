document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeFileUpload();
});

function initializeEventListeners() {
    // Search functionality
    document.querySelector('.search-input').addEventListener('input', filterRecords);
    
    // Refresh button
    document.querySelector('.refresh').addEventListener('click', refreshData);
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Form submission
    document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);
}

function initializeFileUpload() {
    const uploadContainer = document.getElementById('filterUpload');
    const fileInput = uploadContainer.querySelector('input[type="file"]');
    const uploadBtn = uploadContainer.querySelector('.upload-btn');
    const filename = uploadContainer.querySelector('.filename');

    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('drag-active');
    });

    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('drag-active');
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('drag-active');
        handleFileUpload(e.dataTransfer.files[0], filename);
    });

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFileUpload(e.target.files[0], filename);
    });
}

function handleFileUpload(file, filenameElement) {
    if (validateFile(file)) {
        filenameElement.textContent = file.name;
        processExcelFile(file);
    }
}

function validateFile(file) {
    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
        showNotification('Por favor seleccione un archivo Excel válido', 'error');
        return false;
    }
    return true;
}

function processExcelFile(file) {
    showNotification('Procesando archivo...', 'info');
    
    // Simulated file processing
    setTimeout(() => {
        updateTable();
        showNotification('Archivo procesado exitosamente', 'success');
    }, 1500);
}

function updateTable() {
    const sampleData = [
        { name: 'Ana María González', document: '1234567890', status: 'pending' },
        { name: 'Juan Carlos Martínez', document: '2345678901', status: 'verified' },
        { name: 'María José López', document: '3456789012', status: 'pending' }
    ];

    const tbody = document.querySelector('tbody');
    tbody.innerHTML = sampleData.map(record => `
        <tr>
            <td>${record.name}</td>
            <td>${record.document}</td>
            <td><span class="status ${record.status}">${capitalizeFirst(record.status)}</span></td>
            <td>
                <button class="upload-support-btn" onclick="openUploadModal('${record.document}')">
                    <i class="fas fa-upload"></i> Subir Soporte
                </button>
            </td>
        </tr>
    `).join('');

    updateStats(sampleData.length);
}

function filterRecords(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function refreshData() {
    showNotification('Actualizando datos...', 'info');
    setTimeout(() => {
        updateTable();
        showNotification('Datos actualizados', 'success');
    }, 1000);
}

function openUploadModal(document) {
    const modal = document.getElementById('uploadModal');
    const studentData = getStudentData(document);
    
    document.getElementById('studentName').value = studentData.name;
    document.getElementById('studentDocument').value = document;
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    showNotification('Subiendo soporte...', 'info');
    
    // Simulated upload to Google Drive
    setTimeout(() => {
        showNotification('Soporte subido exitosamente', 'success');
        updateStudentStatus(e.target.querySelector('#studentDocument').value);
        closeModal();
    }, 2000);
}

function updateStudentStatus(document) {
    const row = document.querySelector(`td:contains('${document}')`).parentElement;
    row.querySelector('.status').className = 'status verified';
    row.querySelector('.status').textContent = 'Verificado';
}

function updateStats(totalRecords) {
    const processedRecords = document.querySelectorAll('.status.verified').length;
    document.querySelector('.upload-stats .stat:first-child strong').textContent = totalRecords;
    document.querySelector('.upload-stats .stat:last-child strong').textContent = processedRecords;
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function getStudentData(document) {
    // Simulated database query
    return {
        name: 'Ana María González',
        document: document,
        status: 'pending'
    };
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function for jQuery-like contains selector
Element.prototype.contains = function(text) {
    return this.textContent.includes(text);
};
