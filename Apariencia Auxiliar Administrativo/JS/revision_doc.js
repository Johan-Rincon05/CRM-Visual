document.addEventListener('DOMContentLoaded', () => {
    const documentalChecks = document.querySelectorAll('[data-action="documental"]');
    const observationBtns = document.querySelectorAll('[data-action="observations"]');
    const documentModal = document.getElementById('documentModal');
    const observationsModal = document.getElementById('observationsModal');
    const closeButtons = document.querySelectorAll('.close');
    const statusSelects = document.querySelectorAll('.status-select');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');

    documentalChecks.forEach(check => {
        check.addEventListener('click', () => {
            documentModal.style.display = 'block';
        });
    });

    observationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            observationsModal.style.display = 'block';
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    statusSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const dateContainer = e.target.nextElementSibling;
            const status = e.target.value;

            if (status === 'compromiso') {
                dateContainer.style.display = 'block';
            } else {
                dateContainer.style.display = 'none';
            }

            if (status === 'rechazado') {
                observationsModal.style.display = 'block';
                const docName = e.target.closest('.document-item').querySelector('.doc-name').textContent;
                messageInput.value = `[Documento ${docName} - Estado: Rechazado] `;
                messageInput.focus();
            }
            
            updateDocumentStatus(e.target);
        });
    });

    const downloadButtons = document.querySelectorAll('.download-btn');
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const documentName = button.closest('.document-item').querySelector('.doc-name').textContent;
            downloadDocument(documentName);
        });
    });

    sendMessageBtn.addEventListener('click', () => {
        if (messageInput.value.trim()) {
            addMessage(messageInput.value, 'Usuario Actual', getStatusFromMessage(messageInput.value));
            messageInput.value = '';
        }
    });
});

function downloadDocument(documentName) {
    fetch(`/api/documents/${documentName}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${documentName}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error al descargar el documento:', error));
}

function updateDocumentStatus(select) {
    const documentItem = select.closest('.document-item');
    const docName = documentItem.querySelector('.doc-name').textContent;
    const status = select.value;
    
    documentItem.classList.remove('status-green', 'status-yellow', 'status-red');
    
    switch(status) {
        case 'listo':
            documentItem.classList.add('status-green');
            break;
        case 'compromiso':
            documentItem.classList.add('status-yellow');
            break;
        case 'rechazado':
            documentItem.classList.add('status-red');
            break;
    }

    updateGeneralDocumentStatus();
}

function updateGeneralDocumentStatus() {
    const allDocuments = document.querySelectorAll('.document-item');
    const readyDocs = document.querySelectorAll('.status-green').length;
    const rejectedDocs = document.querySelectorAll('.status-red').length;
    const documentalIndicator = document.querySelector('[data-action="documental"]');

    if (rejectedDocs > 0) {
        documentalIndicator.className = 'status-indicator status-red';
    } else if (readyDocs === allDocuments.length) {
        documentalIndicator.className = 'status-indicator status-green';
    } else if (readyDocs >= 4) {
        documentalIndicator.className = 'status-indicator status-yellow';
    } else {
        documentalIndicator.className = 'status-indicator status-red';
    }
}

function addMessage(message, user, status = '') {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const statusClass = status.toLowerCase();
    const statusHtml = status ? 
        `<span class="status ${statusClass}">${status}</span>` : '';

    messageDiv.innerHTML = `
        <div class="message-info">
            <span class="user">${user}</span>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
            ${statusHtml}
        </div>
        <div class="message-content">${message}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getStatusFromMessage(message) {
    if (message.includes('Estado: Rechazado')) return 'Rechazado';
    if (message.includes('Estado: Listo')) return 'Listo';
    if (message.includes('Estado: Compromiso')) return 'Compromiso';
    return '';
}

const orientadorFilter = document.getElementById('orientadorFilter');
if (orientadorFilter) {
    orientadorFilter.addEventListener('change', function() {
        const selectedOrientador = this.value;
        const rows = document.querySelectorAll('#tableBody tr');
        
        rows.forEach(row => {
            const orientadorCell = row.querySelector('td:nth-child(3)');
            if (!selectedOrientador || orientadorCell.textContent === selectedOrientador) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}
