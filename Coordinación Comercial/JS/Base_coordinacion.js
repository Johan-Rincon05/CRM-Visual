// Constants and Configuration
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    setupEventListeners();
    loadFilters();
});

// Sample data for testing
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

function initializeData() {
    filteredData = [...sampleData];
    updateTable();
    updatePagination();
}

function setupEventListeners() {
    // Search functionality
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

    // Filter handlers
    ['orientadorFilter', 'carreraFilter', 'documentFilter'].forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });

    // Pagination handlers
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
    // Load Orientadores
    const orientadores = [...new Set(sampleData.map(item => item.orientador))];
    const orientadorSelect = document.getElementById('orientadorFilter');
    orientadores.forEach(orientador => {
        const option = document.createElement('option');
        option.value = orientador;
        option.textContent = orientador;
        orientadorSelect.appendChild(option);
    });

    // Load Carreras
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
        
        tbody.appendChild(row);
    });
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
