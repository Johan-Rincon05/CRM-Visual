document.addEventListener('DOMContentLoaded', () => {
    // Selectors para los elementos
    const documentalChecks = document.querySelectorAll('[data-action="documental"]');
    const observationBtns = document.querySelectorAll('[data-action="observations"]');
    const documentModal = document.getElementById('documentModal');
    const observationsModal = document.getElementById('observationsModal');
    const closeButtons = document.querySelectorAll('.close');
    const statusSelects = document.querySelectorAll('.status-select');

    // Event listeners para los checks documentales
    documentalChecks.forEach(check => {
        check.addEventListener('click', () => {
            documentModal.style.display = 'block';
        });
    });

    // Event listeners para los botones de observaciones
    observationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            observationsModal.style.display = 'block';
        });
    });

    // Cerrar modales con el botón X
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Cerrar modales haciendo click fuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Manejo de los selectores de estado
    statusSelects.forEach(select => {
        select.addEventListener('change', (e) => {
            const dateContainer = e.target.nextElementSibling;
            if (e.target.value === 'compromiso') {
                dateContainer.style.display = 'block';
            } else {
                dateContainer.style.display = 'none';
            }
            
            updateDocumentStatus(e.target);
        });
    });

    
    // Manejador para los botones de descarga
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const documentName = button.closest('.document-item').querySelector('.doc-name').textContent;
            downloadDocument(documentName);
        });
    });

});

function downloadDocument(documentName) {
    // Implementar la lógica de descarga
    // Por ejemplo, hacer una petición al servidor:
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
    const dateInput = documentItem.querySelector('.compromise-date');
    
    if (status === 'listo') {
        documentItem.classList.add('status-green');
        documentItem.classList.remove('status-yellow');
    } else if (status === 'compromiso') {
        documentItem.classList.add('status-yellow');
        documentItem.classList.remove('status-green');
    }

    // Actualizar el estado general del indicador documental
    updateGeneralDocumentStatus();
}

function updateGeneralDocumentStatus() {
    const allDocuments = document.querySelectorAll('.document-item');
    const readyDocs = document.querySelectorAll('.status-green').length;
    const documentalIndicator = document.querySelector('[data-action="documental"]');

    if (readyDocs === allDocuments.length) {
        documentalIndicator.className = 'status-indicator status-green';
    } else if (readyDocs >= 4) {
        documentalIndicator.className = 'status-indicator status-yellow';
    } else {
        documentalIndicator.className = 'status-indicator status-red';
    }
}

/* Filtro Orientadores */

document.addEventListener('DOMContentLoaded', () => {
    const orientadorFilter = document.getElementById('orientadorFilter');
    
    orientadorFilter.addEventListener('change', function() {
        const selectedOrientador = this.value;
        const rows = document.querySelectorAll('#tableBody tr');
        
        rows.forEach(row => {
            const orientadorCell = row.querySelector('td:nth-child(3)'); // Adjust index based on orientador column
            if (!selectedOrientador || orientadorCell.textContent === selectedOrientador) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
});