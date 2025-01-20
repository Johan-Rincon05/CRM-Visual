// Configuración y constantes
const REQUIRED_DOCUMENTS = ['Cédula', 'EPS', 'ICFES', 'Bachiller', 'Título', 'Sabana de Notas'];
const ITEMS_PER_PAGE = 10;
const TIPIFICATION_TYPES = {
    SEGUIMIENTO: 'Seguimiento',
    NO_INTERESA: 'No le interesa',
    EQUIVOCADO: 'Equivocado',
    SIN_CONTACTO: 'Sin Contacto',
    SUSCRITO: 'Suscrito'
};

let currentPage = 1;
let filteredData = [];
let editingRow = null;
let hasUpdatedChat = false;
let tempRowData = null;
let tempRow = null;
let selectedRows = new Set();
let lastTipifications = new Map();

// Datos de ejemplo para pruebas
const sampleData = [
    {
        id: 1,
        orientador: 'Andrea González',
        nombre: 'Juan Pérez',
        telefono: '3001234567',
        carrera_interes: 'Ingeniería Industrial', 
        ultimo_titulo: 'Bachiller',
        fecha_formulario: '2024-01-15',
        carga_sinu: '123456',
        documents: ['Cédula', 'EPS', 'ICFES'],
        ultima_tipificacion: {
            status: 'Seguimiento',
            fecha: '2024-01-15T10:30:00',
            mensaje: 'Primer contacto realizado'
        }
    },
    {
        id: 2,
        orientador: 'Angie Villamor',
        nombre: 'María López',
        telefono: '3109876543',
        carrera_interes: 'Administración',
        ultimo_titulo: 'Técnico',
        fecha_formulario: '2024-01-16',
        carga_sinu: '789012',
        documents: ['Cédula', 'EPS', 'ICFES', 'Bachiller', 'Título', 'Sabana de Notas'],
        ultima_tipificacion: {
            status: 'Sin Contacto',
            fecha: '2024-01-16T14:20:00',
            mensaje: 'No responde llamadas'
        }
    }
];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setupEventListeners();
    loadFilters();
    setupModalListeners();
    setupMassTipificationListeners();
});

// Configuración de listeners del modal
function setupModalListeners() {
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const sectionId = header.getAttribute('data-section');
            toggleSection(sectionId);
        });
    });

    const closeButton = document.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateLead();
        });
    }

    const sendMessageButton = document.getElementById('sendMessage');
    if (sendMessageButton) {
        sendMessageButton.addEventListener('click', addChatMessage);
    }
}

function setupMassTipificationListeners() {
    document.getElementById('selectAll').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.row-selector');
        checkboxes.forEach(cb => {
            cb.checked = e.target.checked;
            handleRowSelection(cb);
        });
    });

    document.getElementById('massTipificationBtn').addEventListener('click', openMassTipificationModal);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.querySelector(`.modal-tab[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}Tab`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.style.display = 'block';
    }
}

function initializeData() {
    filteredData = [...sampleData];
    updateTable();
    updatePagination();
}

function setupEventListeners() {
    document.getElementById('searchDocuments').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredData = sampleData.filter(student => 
            student.nombre.toLowerCase().includes(searchTerm) ||
            student.telefono.includes(searchTerm) ||
            student.carrera_interes.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        updateTable();
        updatePagination();
    });

    ['orientadorFilter', 'carreraFilter', 'documentFilter', 'tipificacionFilter'].forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });

    ['dateStart', 'dateEnd'].forEach(dateId => {
        document.getElementById(dateId).addEventListener('change', applyFilters);
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            updatePagination();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const maxPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
        if (currentPage < maxPages) {
            currentPage++;
            updateTable();
            updatePagination();
        }
    });
}

function loadFilters() {
    const orientadores = [...new Set(sampleData.map(item => item.orientador))];
    const orientadorSelect = document.getElementById('orientadorFilter');
    orientadores.forEach(orientador => {
        const option = document.createElement('option');
        option.value = orientador;
        option.textContent = orientador;
        orientadorSelect.appendChild(option);
    });

    const carreras = [...new Set(sampleData.map(item => item.carrera_interes))];
    const carreraSelect = document.getElementById('carreraFilter');
    carreras.forEach(carrera => {
        const option = document.createElement('option');
        option.value = carrera;
        option.textContent = carrera;
        carreraSelect.appendChild(option);
    });
}

function applyFilters() {
    const orientador = document.getElementById('orientadorFilter').value;
    const carrera = document.getElementById('carreraFilter').value;
    const docStatus = document.getElementById('documentFilter').value;
    const tipificacion = document.getElementById('tipificacionFilter').value;
    const dateStart = document.getElementById('dateStart').value;
    const dateEnd = document.getElementById('dateEnd').value;

    filteredData = sampleData.filter(student => {
        const matchOrientador = !orientador || student.orientador === orientador;
        const matchCarrera = !carrera || student.carrera_interes === carrera;
        const matchDocStatus = getDocumentStatusMatch(student.documents, docStatus);
        const matchTipificacion = !tipificacion || 
            (student.ultima_tipificacion?.status === tipificacion);
        const matchDateRange = checkDateRange(student.ultima_tipificacion?.fecha, dateStart, dateEnd);

        return matchOrientador && matchCarrera && matchDocStatus && 
               matchTipificacion && matchDateRange;
    });

    currentPage = 1;
    updateTable();
    updatePagination();
}

function checkDateRange(date, start, end) {
    if (!start || !end || !date) return true;
    const tipDate = new Date(date);
    const startDate = new Date(start);
    const endDate = new Date(end);
    return tipDate >= startDate && tipDate <= endDate;
}

function getDocumentStatusMatch(documents, status) {
    if (!status) return true;
    const count = documents.length;
    switch (status) {
        case 'complete': return count === 6;
        case 'incomplete': return count > 0 && count < 6;
        case 'pending': return count === 0;
        default: return true;
    }
}

function updateTable() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const tbody = document.getElementById('documentTableBody');
    tbody.innerHTML = '';

    paginatedData.forEach(student => {
        const row = document.createElement('tr');
        row.dataset.id = student.id;
        const docStatus = getDocumentStatus(student.documents);
        
        row.innerHTML = `
            <td><input type="checkbox" class="row-selector"></td>
            <td>${student.orientador || 'Sin asignar'}</td>
            <td>${student.nombre}</td>
            <td>${student.telefono}</td>
            <td>${student.carrera_interes}</td>
            <td>${student.ultimo_titulo}</td>
            <td>${student.fecha_formulario}</td>
            <td>${student.carga_sinu}</td>
            <td>
                <div class="doc-status ${docStatus.color}">
                    <div class="doc-tooltip">
                        <div class="doc-count">${student.documents.length}/6 Documentos</div>
                        <ul class="doc-list">
                            ${generateDocumentList(student.documents)}
                        </ul>
                    </div>
                </div>
            </td>
            <td class="tipification-cell">${student.ultima_tipificacion?.status || 'Sin tipificar'}</td>
            <td class="tipification-date-cell">${student.ultima_tipificacion?.fecha ? new Date(student.ultima_tipificacion.fecha).toLocaleString() : '-'}</td>
        `;
        
        row.querySelector('.row-selector').addEventListener('change', (e) => {
            handleRowSelection(e.target);
        });
        
        row.addEventListener('click', (e) => {
            if (!e.target.classList.contains('row-selector')) {
                openModal(student, row);
            }
        });
        
        tbody.appendChild(row);
    });
}

function openMassTipificationModal() {
    const modal = document.createElement('div');
    modal.className = 'mass-tipification-modal';
    modal.innerHTML = `
        <h3>Tipificación Masiva</h3>
        <select id="massTipificationStatus">
            ${Object.values(TIPIFICATION_TYPES).map(type => 
                `<option value="${type}">${type}</option>`
            ).join('')}
        </select>
        <textarea id="massMessage" placeholder="Mensaje de seguimiento..."></textarea>
        <div class="modal-actions">
            <button onclick="applyMassTipification()">Aplicar</button>
            <button onclick="closeMassTipificationModal()">Cancelar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function applyMassTipification() {
    const status = document.getElementById('massTipificationStatus').value;
    const message = document.getElementById('massMessage').value;
    const timestamp = new Date().toISOString();

    selectedRows.forEach(rowId => {
        const student = sampleData.find(s => s.id.toString() === rowId);
        if (student) {
            student.ultima_tipificacion = {
                status,
                fecha: timestamp,
                mensaje: message
            };
            updateRowTipification(rowId, status, timestamp);
            addChatMessageToStudent(student, status, message);
        }
    });

    selectedRows.clear();
    updateMassTipificationButton();
    closeMassTipificationModal();
    updateTable();
}

function updateMassTipificationButton() {
    const btn = document.getElementById('massTipificationBtn');
    btn.disabled = selectedRows.size === 0;
}

function closeMassTipificationModal() {
    const modal = document.querySelector('.mass-tipification-modal');
    if (modal) {
        modal.remove();
    }
}

function getDocumentStatus(documents) {
    const count = documents.length;
    if (count <= 2) return { color: 'red' };
    if (count <= 5) return { color: 'yellow' };
    return { color: 'green' };
}

function generateDocumentList(uploadedDocs) {
    return REQUIRED_DOCUMENTS.map(doc => {
        const isUploaded = uploadedDocs.includes(doc);
        return `
            <li class="${isUploaded ? 'uploaded' : 'missing'}">
                <i class="fas ${isUploaded ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                ${doc}
            </li>
        `;
    }).join('');
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    document.getElementById('currentPage').textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function openModal(data, row) {
    const modalOverlay = document.getElementById('modal-overlay');
    editingRow = row;
    
    const form = document.getElementById('leadForm');
    Object.keys(data).forEach(key => {
        if (form[key]) {
            form[key].value = data[key];
        }
    });

    modalOverlay.style.display = 'flex';
    switchTab('form');
    hasUpdatedChat = false;
}

function closeModal() {
    if (!hasUpdatedChat) {
        alert('Debes dejar un mensaje en el chat de seguimiento antes de cerrar.');
        return;
    }
    document.getElementById('modal-overlay').style.display = 'none';
    editingRow = null;
    hasUpdatedChat = false;
}

function toggleSection(sectionId) {
    const section = document.getElementById(`${sectionId}-section`);
    if (!section) return;

    const icon = section.previousElementSibling.querySelector('i');
    const isExpanded = section.classList.contains('expanded');

    document.querySelectorAll('.section-content').forEach(content => {
        if (content !== section) {
            content.classList.remove('expanded');
            content.style.display = 'none';
            const otherIcon = content.previousElementSibling.querySelector('i');
            if (otherIcon) {
                otherIcon.className = 'fas fa-chevron-down';
            }
        }
    });

    section.classList.toggle('expanded');
    section.style.display = isExpanded ? 'none' : 'block';
    if (icon) {
        icon.className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
    }
}

function addChatMessage() {
    const messageInput = document.getElementById('chatMessage');
    const statusSelect = document.getElementById('chatStatus');
    const message = messageInput.value.trim();
    
    if (!message) return;

    const chatContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    const timestamp = new Date().toISOString();

    messageElement.innerHTML = `
        <div class="timestamp">${new Date().toLocaleString()}</div>
        <strong>Estado: ${statusSelect.options[statusSelect.selectedIndex].text}</strong>
        <p>${message}</p>
    `;

    // Update last tipification
    if (editingRow) {
        const rowId = editingRow.dataset.id;
        const student = sampleData.find(s => s.id.toString() === rowId);
        if (student) {
            student.ultima_tipificacion = {
                status: statusSelect.value,
                fecha: timestamp,
                mensaje: message
            };
            updateRowTipification(rowId, statusSelect.value, timestamp);
        }
    }

    chatContainer.appendChild(messageElement);
    messageInput.value = '';
    hasUpdatedChat = true;
}

function addChatMessageToStudent(student, status, message) {
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <div class="timestamp">${new Date().toLocaleString()}</div>
            <strong>Estado: ${status}</strong>
            <p>${message}</p>
        `;
        chatContainer.appendChild(messageElement);
    }
}

function handleFileUpload(input, documentType) {
    const file = input.files[0];
    const statusElement = document.getElementById(`${documentType}-status`);
    
    if (file) {
        if (file.type === 'application/pdf') {
            statusElement.textContent = 'Documento cargado exitosamente';
            statusElement.className = 'upload-status success';
        } else {
            statusElement.textContent = 'Por favor, seleccione un archivo PDF';
            statusElement.className = 'upload-status error';
            input.value = '';
        }
    }
}

function updateRowTipification(rowId, status, timestamp) {
    const row = document.querySelector(`tr[data-id="${rowId}"]`);
    if (row) {
        const tipCell = row.querySelector('.tipification-cell');
        const dateCell = row.querySelector('.tipification-date-cell');
        
        tipCell.textContent = status;
        dateCell.textContent = new Date(timestamp).toLocaleString();
    }
}

