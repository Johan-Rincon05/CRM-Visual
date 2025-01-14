document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeNotifications();
    updateStatistics();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Modal triggers
    document.getElementById('generateReceiptsBtn').addEventListener('click', handleReceiptGeneration);
    document.getElementById('sendMessagesBtn').addEventListener('click', showMessagesModal);
    
    // Close buttons for modals
    document.querySelectorAll('.close').forEach(button => {
        button.addEventListener('click', closeModal);
    });

    // Search and filter functionality
    document.getElementById('searchInput').addEventListener('input', filterStudents);
    document.getElementById('statusFilter').addEventListener('change', filterStudents);

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', toggleSelectAll);

    // Payment form submission
    document.getElementById('paymentForm').addEventListener('submit', handlePaymentSubmission);

    // File upload handling
    document.getElementById('paymentProof').addEventListener('change', handleFileUpload);
}

// Modal Functions
function showMessagesModal() {
    const modal = document.getElementById('messagesModal');
    modal.style.display = 'block';
    updateSelectedCount();
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function openPaymentModal(studentId) {
    const modal = document.getElementById('paymentModal');
    const student = getStudentData(studentId);
    
    document.getElementById('studentName').value = student.name;
    document.getElementById('paymentAmount').value = student.pendingAmount;
    document.getElementById('paymentDate').valueAsDate = new Date();
    
    modal.style.display = 'block';
}

// Student Data Management
function getStudentData(studentId) {
    // Simulated student data retrieval
    const studentData = {
        name: 'Ana María Rodríguez',
        pendingAmount: 500,
        status: 'pending'
    };
    return studentData;
}

function filterStudents() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const rows = document.querySelectorAll('#studentsTable tbody tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const document = row.cells[2].textContent.toLowerCase();
        const status = row.cells[3].textContent.toLowerCase();

        const matchesSearch = name.includes(searchTerm) || document.includes(searchTerm);
        const matchesStatus = !statusFilter || status === statusFilter;

        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

// Payment Processing
function handlePaymentSubmission(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const paymentData = {
        student: formData.get('studentName'),
        amount: formData.get('paymentAmount'),
        date: formData.get('paymentDate'),
        notes: formData.get('paymentNotes')
    };

    // Simulated payment processing
    setTimeout(() => {
        showNotification('Pago registrado exitosamente', 'success');
        updateStudentStatus(paymentData);
        closeModal();
    }, 1000);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        // Simulated file upload to Google Drive
        showNotification('Subiendo archivo...', 'info');
        setTimeout(() => {
            showNotification('Archivo subido exitosamente', 'success');
        }, 2000);
    }
}

// Message Management
function sendMessages() {
    const selectedCount = document.querySelectorAll('.student-select:checked').length;
    const template = document.getElementById('messageTemplate').value;
    const content = document.getElementById('messageContent').value;

    // Simulated message sending
    showNotification(`Enviando ${selectedCount} mensajes...`, 'info');
    setTimeout(() => {
        showNotification(`${selectedCount} mensajes enviados exitosamente`, 'success');
        closeModal();
        updateMessageStats(selectedCount);
    }, 2000);
}

function updateSelectedCount() {
    const count = document.querySelectorAll('.student-select:checked').length;
    document.getElementById('selectedCount').textContent = count;
}

// Receipt Generation
function handleReceiptGeneration() {
    const selectedStudents = document.querySelectorAll('.student-select:checked');
    
    if (selectedStudents.length === 0) {
        showNotification('Seleccione al menos un estudiante', 'warning');
        return;
    }

    showNotification(`Generando ${selectedStudents.length} recibos...`, 'info');
    setTimeout(() => {
        showNotification('Recibos generados exitosamente', 'success');
        // Simulated receipt download
        downloadReceipts(selectedStudents.length);
    }, 2000);
}

function downloadReceipts(count) {
    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent('Recibos generados')}`;
    link.download = `recibos_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
}

// Utility Functions
function toggleSelectAll(event) {
    const isChecked = event.target.checked;
    document.querySelectorAll('.student-select').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    updateSelectedCount();
}

function updateStatistics() {
    // Simulated statistics update
    const stats = {
        totalStudents: 1250,
        dailyPayments: 45,
        messagesSent: '180/250'
    };

    document.querySelector('.stat-value').textContent = stats.totalStudents;
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

function initializeNotifications() {
    const notification = document.getElementById('notification');
    notification.addEventListener('click', () => {
        notification.style.display = 'none';
    });
}

// Status Updates
function updateStudentStatus(paymentData) {
    const rows = document.querySelectorAll('#studentsTable tbody tr');
    rows.forEach(row => {
        if (row.cells[1].textContent === paymentData.student) {
            row.cells[3].innerHTML = '<span class="status-badge paid">Pagado</span>';
            row.cells[4].textContent = `$${paymentData.amount}`;
        }
    });
}

function updateMessageStats(sentCount) {
    const statsElement = document.querySelector('.stat-item:last-child .stat-value');
    const [sent, total] = statsElement.textContent.split('/');
    statsElement.textContent = `${parseInt(sent) + sentCount}/${total}`;
}
