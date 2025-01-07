// Configuración y constantes
const REQUIRED_DOCUMENTS = [
    'Cédula',
    'EPS', 
    'ICFES',
    'Bachiller',
    'Título',
    'Sabana de Notas'
];

const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let filteredData = [];
let editingRow = null;
let hasUpdatedChat = false;
let tempRowData = null;
let tempRow = null;

// Datos de ejemplo para pruebas
const sampleData = [
    {
        orientador: 'Andrea González',
        nombre: 'Juan Pérez',
        telefono: '3001234567',
        carrera_interes: 'Ingeniería Industrial', 
        ultimo_titulo: 'Bachiller',
        fecha_formulario: '2024-01-15',
        carga_sinu: '123456',
        documents: ['Cédula', 'EPS', 'ICFES']
    },
    {
        orientador: 'Angie Villamor',
        nombre: 'María López',
        telefono: '3109876543',
        carrera_interes: 'Administración',
        ultimo_titulo: 'Técnico',
        fecha_formulario: '2024-01-16',
        carga_sinu: '789012',
        documents: ['Cédula', 'EPS', 'ICFES', 'Bachiller', 'Título', 'Sabana de Notas']
    }
];

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setupEventListeners();
    loadFilters();
    setupModalListeners();
});

// Configuración de listeners del modal
function setupModalListeners() {
    // Configurar listeners para las pestañas
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Configurar listeners para las secciones
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const sectionId = header.getAttribute('data-section');
            toggleSection(sectionId);
        });
    });

    // Botón de cerrar modal
    const closeButton = document.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Formulario principal
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateLead();
        });
    }

    // Botón de enviar mensaje
    const sendMessageButton = document.getElementById('sendMessage');
    if (sendMessageButton) {
        sendMessageButton.addEventListener('click', addChatMessage);
    }
}

// Función para cambiar entre pestañas
function switchTab(tabName) {
    // Ocultar todos los contenidos y remover clases activas
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Activar la pestaña seleccionada
    const selectedTab = document.querySelector(`.modal-tab[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`${tabName}Tab`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.style.display = 'block';
    }
}

// Inicialización de datos
function initializeData() {
    filteredData = [...sampleData];
    updateTable();
    updatePagination();
}

// Configuración de event listeners principales
function setupEventListeners() {
    // Búsqueda
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

    // Filtros
    ['orientadorFilter', 'carreraFilter', 'documentFilter'].forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });

    // Paginación
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

// Carga de filtros dinámicos
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

// Aplicación de filtros
function applyFilters() {
    const orientador = document.getElementById('orientadorFilter').value;
    const carrera = document.getElementById('carreraFilter').value;
    const docStatus = document.getElementById('documentFilter').value;

    filteredData = sampleData.filter(student => {
        const matchOrientador = !orientador || student.orientador === orientador;
        const matchCarrera = !carrera || student.carrera_interes === carrera;
        const matchDocStatus = getDocumentStatusMatch(student.documents, docStatus);
        return matchOrientador && matchCarrera && matchDocStatus;
    });

    currentPage = 1;
    updateTable();
    updatePagination();
}

// Verificación del estado de documentos
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

// Actualización de la tabla
function updateTable() {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const tbody = document.getElementById('documentTableBody');
    tbody.innerHTML = '';

    paginatedData.forEach(student => {
        const row = document.createElement('tr');
        const docStatus = getDocumentStatus(student.documents);
        
        row.innerHTML = `
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
        `;
        
        row.addEventListener('click', () => {
            const data = {
                orientador: student.orientador,
                nombre: student.nombre,
                telefono: student.telefono,
                carrera_interes: student.carrera_interes,
                ultimo_titulo: student.ultimo_titulo,
                fecha_formulario: student.fecha_formulario,
                carga_sinu: student.carga_sinu,
                documents: student.documents
            };
            openModal(data, row);
        });
        
        tbody.appendChild(row);
    });
}

// Obtener estado de documentos
function getDocumentStatus(documents) {
    const count = documents.length;
    if (count <= 2) return { color: 'red' };
    if (count <= 5) return { color: 'yellow' };
    return { color: 'green' };
}

// Generar lista de documentos
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

// Actualización de paginación
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    document.getElementById('currentPage').textContent = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Funciones del modal
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

// Toggle de secciones en el formulario
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

// Funcionalidad del chat
function addChatMessage() {
    const messageInput = document.getElementById('chatMessage');
    const statusSelect = document.getElementById('chatStatus');
    const message = messageInput.value.trim();
    
    if (!message) return;

    const chatContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `
        <div class="timestamp">${new Date().toLocaleString()}</div>
        <strong>Estado: ${statusSelect.options[statusSelect.selectedIndex].text}</strong>
        <p>${message}</p>
    `;

    chatContainer.appendChild(messageElement);
    messageInput.value = '';
    hasUpdatedChat = true;
}

// Manejo de carga de archivos
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
