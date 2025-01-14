document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeDropZones();
});

function initializeEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    // Process button
    document.getElementById('processBtn').addEventListener('click', processFiles);

    // Modal handling
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Form submission
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmission);

    // Observation inputs
    document.querySelectorAll('.observation-input').forEach(input => {
        input.addEventListener('change', saveObservation);
    });
}

function initializeDropZones() {
    const dropZones = ['sanCamiloZone', 'cohorteZone'];
    
    dropZones.forEach(zoneId => {
        const zone = document.getElementById(zoneId);
        const input = zone.querySelector('input[type="file"]');
        const filename = zone.querySelector('.filename');

        zone.addEventListener('click', () => input.click());
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);

        input.addEventListener('change', (e) => {
            handleFileSelect(e, filename);
            checkFilesLoaded();
        });
    });
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const input = this.querySelector('input[type="file"]');
    const filename = this.querySelector('.filename');
    const file = e.dataTransfer.files[0];
    
    if (validateFile(file)) {
        input.files = e.dataTransfer.files;
        filename.textContent = file.name;
        checkFilesLoaded();
    }
}

function handleFileSelect(e, filenameElement) {
    const file = e.target.files[0];
    if (validateFile(file)) {
        filenameElement.textContent = file.name;
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

function checkFilesLoaded() {
    const sanCamiloFile = document.querySelector('#sanCamiloZone input').files[0];
    const cohorteFile = document.querySelector('#cohorteZone input').files[0];
    
    document.getElementById('processBtn').disabled = !(sanCamiloFile && cohorteFile);
}

function processFiles() {
    const progressBar = document.querySelector('.progress-bar');
    const progress = progressBar.querySelector('.progress');
    
    progressBar.style.display = 'block';
    document.getElementById('processBtn').disabled = true;

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            showResults();
        } else {
            width++;
            progress.style.width = width + '%';
        }
    }, 50);
}

function showResults() {
    showNotification('Procesamiento completado exitosamente', 'success');
    document.querySelector('.results-section').style.display = 'block';
    updateStatistics();
}

function updateStatistics() {
    const stats = {
        matches: 1245,
        discrepancies: 180,
        missing: 118
    };

    document.querySelectorAll('.tab-btn').forEach(btn => {
        const tab = btn.dataset.tab;
        const count = stats[tab] || 0;
        btn.textContent = `${capitalizeFirst(tab)} (${count})`;
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
}

function openPaymentModal(documentId) {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'block';
    
    // Load student data
    const studentData = getStudentData(documentId);
    populateModalData(studentData);
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function handlePaymentSubmission(e) {
    e.preventDefault();
    
    showNotification('Procesando pago...', 'info');
    
    setTimeout(() => {
        showNotification('Pago registrado exitosamente', 'success');
        closeModal();
        updateStudentStatus(e.target.querySelector('[readonly]').value);
    }, 1500);
}

function saveObservation(e) {
    const observation = e.target.value;
    const row = e.target.closest('tr');
    const studentId = row.querySelector('td:nth-child(2)').textContent;
    
    showNotification('Observación guardada', 'success');
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

function getStudentData(documentId) {
    return {
        name: 'Carlos Andrés Pérez',
        document: documentId,
        amount: '$850,000',
        status: 'pending'
    };
}

function populateModalData(data) {
    document.querySelector('#paymentForm input[readonly]').value = data.name;
    document.querySelector('#paymentForm input[type="text"]:nth-child(2)').value = data.document;
}

function updateStudentStatus(studentName) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === studentName) {
            row.cells[2].innerHTML = '<span class="status verified">Verificado</span>';
        }
    });
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
