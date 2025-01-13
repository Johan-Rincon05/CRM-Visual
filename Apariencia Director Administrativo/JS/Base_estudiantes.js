document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        searchInput: document.getElementById('searchInput'),
        statusFilter: document.getElementById('statusFilter'),
        universityFilter: document.getElementById('universityFilter'),
        studentsTable: document.getElementById('studentsTable'),
        modal: document.getElementById('detailsModal'),
        closeBtn: document.querySelector('.close'),
        universitySelect: document.getElementById('universitySelect'),
        processStatus: document.getElementById('processStatus'),
        documentSelects: document.querySelectorAll('.status-select'),
        paymentItems: document.querySelectorAll('.payment-item'),
        saveChangesBtn: document.getElementById('saveChanges')
    };

    const universityStatuses = {
        americana: [
            { value: 'no-process', label: 'Sin Proceso' },
            { value: 'sinu-inscribed', label: 'Inscrito SINU' },
            { value: 'receipt-created', label: 'Recibo creado' },
            { value: 'receipt-sent', label: 'Recibo enviado' },
            { value: 'partial-payment', label: 'Pago parcial/total' },
            { value: 'pending-change', label: 'Cambio pendiente' },
            { value: 'desisted', label: 'Desiste del Proceso' }
        ],
        incca: [
            { value: 'no-process', label: 'Sin Proceso' },
            { value: 'commitment-loaded', label: 'Cargado con Compromiso' },
            { value: 'process-ok', label: 'Proceso OK' },
            { value: 'desisted', label: 'Desiste del Proceso' }
        ],
        cenda: [
            { value: 'no-process', label: 'Sin Proceso' },
            { value: 'commitment-loaded', label: 'Cargado con Compromiso' },
            { value: 'process-ok', label: 'Proceso OK' },
            { value: 'desisted', label: 'Desiste del Proceso' }
        ],
        sancamilo: [
            { value: 'no-process', label: 'Sin Proceso' },
            { value: 'loaded', label: 'Cargado' },
            { value: 'partial-payment', label: 'Pago parcial/total' },
            { value: 'desisted', label: 'Desiste del Proceso' }
        ]
    };

    function initializeDocumentSelects() {
        elements.documentSelects.forEach(select => {
            select.addEventListener('change', handleDocumentStatusChange);
            updateDocumentStatusIndicator(select);
        });
    }

    function handleDocumentStatusChange(e) {
        const select = e.target;
        updateDocumentStatusIndicator(select);
        updateOverallStatus();
    }

    function updateDocumentStatusIndicator(select) {
        const documentItem = select.closest('.document-item');
        const status = select.value;
        
        documentItem.classList.remove('status-pending', 'status-complete', 'status-rejected');
        
        switch(status) {
            case 'listo':
                documentItem.classList.add('status-complete');
                break;
            case 'compromiso':
                documentItem.classList.add('status-pending');
                break;
            case 'rechazado':
                documentItem.classList.add('status-rejected');
                break;
        }
    }

    function updateOverallStatus() {
        const currentUniversity = elements.universitySelect.value;
        const documentsComplete = Array.from(elements.documentSelects)
            .every(select => select.value === 'listo' || select.value === 'compromiso');

        if (documentsComplete) {
            elements.processStatus.value = 'process-ok';
        }
    }

    function handleUniversityChange(e) {
        const university = e.target.value;
        updateStatusOptions(university);
    }

    function updateStatusOptions(university) {
        const statusSelect = elements.processStatus;
        statusSelect.innerHTML = '';
        
        universityStatuses[university].forEach(status => {
            const option = document.createElement('option');
            option.value = status.value;
            option.textContent = status.label;
            statusSelect.appendChild(option);
        });
    }

    function handleStatusChange(e) {
        const newStatus = e.target.value;
        const studentId = elements.modal.dataset.currentStudentId;
        updateTableStatus(studentId, newStatus);
    }

    function updateTableStatus(studentId, newStatus) {
        const row = elements.studentsTable.querySelector(`tr[data-student-id="${studentId}"]`);
        if (row) {
            const statusBadge = row.querySelector('.status-badge');
            statusBadge.className = `status-badge ${newStatus}`;
            statusBadge.textContent = elements.processStatus.options[elements.processStatus.selectedIndex].text;
        }
    }

    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = elements.studentsTable?.querySelectorAll('tbody tr') || [];
        
        rows.forEach(row => {
            const searchableContent = Array.from(row.children)
                .map(cell => cell.textContent.toLowerCase())
                .join(' ');
            row.style.display = searchableContent.includes(searchTerm) ? '' : 'none';
        });
    }

    function handleFilter() {
        const selectedStatus = elements.statusFilter?.value.toLowerCase() || '';
        const selectedUniversity = elements.universityFilter?.value.toLowerCase() || '';
        const rows = elements.studentsTable?.querySelectorAll('tbody tr') || [];

        rows.forEach(row => {
            const rowUniversity = row.querySelector('td:nth-child(7)')?.textContent.toLowerCase() || '';
            const statusBadge = row.querySelector('.status-badge');
            const rowStatus = statusBadge?.classList[1] || '';

            const universityMatch = !selectedUniversity || rowUniversity === selectedUniversity;
            const statusMatch = !selectedStatus || rowStatus === selectedStatus;

            row.style.display = universityMatch && statusMatch ? '' : 'none';
        });
    }

    function handleRowClick(e) {
        const row = e.target.closest('tr');
        if (row) {
            const studentId = row.dataset.studentId;
            openStudentDetails(studentId);
        }
    }

    function openStudentDetails(studentId) {
        const row = elements.studentsTable.querySelector(`tr[data-student-id="${studentId}"]`);
        const studentData = extractStudentData(row);
        
        populateModalData(studentData);
        elements.modal.dataset.currentStudentId = studentId;
        elements.modal.style.display = 'block';
        elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function populateModalData(data) {
        document.getElementById('orientadorValue').textContent = data.orientador;
        document.getElementById('nombresValue').textContent = data.nombres;
        document.getElementById('apellidosValue').textContent = data.apellidos;
        document.getElementById('tipoDocValue').textContent = data.tipoDoc;
        document.getElementById('documentoValue').textContent = data.cedula;
        document.getElementById('carreraValue').textContent = data.carrera;
        
        elements.universitySelect.value = data.universidad;
        updateStatusOptions(data.universidad);
        elements.processStatus.value = data.estado;
    }

    function extractStudentData(row) {
        return {
            orientador: row.cells[0].textContent,
            nombres: row.cells[1].textContent,
            apellidos: row.cells[2].textContent,
            tipoDoc: row.cells[3].textContent,
            cedula: row.cells[4].textContent,
            carrera: row.cells[5].textContent,
            universidad: row.cells[6].textContent.toLowerCase(),
            estado: row.cells[7].querySelector('.status-badge').classList[1]
        };
    }

    function closeModal() {
        elements.modal.classList.remove('active');
        elements.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function saveChanges() {
        const studentId = elements.modal.dataset.currentStudentId;
        const newStatus = elements.processStatus.value;
        const documentStatuses = Array.from(elements.documentSelects).map(select => ({
            id: select.dataset.docId,
            status: select.value
        }));

        updateTableStatus(studentId, newStatus);
        closeModal();
    }

    function setupEventListeners() {
        elements.searchInput?.addEventListener('input', handleSearch);
        elements.statusFilter?.addEventListener('change', handleFilter);
        elements.universityFilter?.addEventListener('change', handleFilter);
        elements.studentsTable?.querySelector('tbody')?.addEventListener('click', handleRowClick);
        elements.closeBtn?.addEventListener('click', closeModal);
        elements.universitySelect?.addEventListener('change', handleUniversityChange);
        elements.processStatus?.addEventListener('change', handleStatusChange);
        elements.saveChangesBtn?.addEventListener('click', saveChanges);
        
        window.addEventListener('click', (e) => {
            if (e.target === elements.modal) {
                closeModal();
            }
        });
    }

    setupEventListeners();
    initializeDocumentSelects();
});
