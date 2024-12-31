// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeUserMenu();
    initializeTable();
    loadOrientadores();
    setupEventListeners();
    initializePagination();
});

// Sidebar Functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '70px' : '260px';
    });

    // Handle responsive sidebar
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            mainContent.style.marginLeft = '0';
        } else {
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '70px' : '260px';
        }
    });
}

// User Menu Functionality
function initializeUserMenu() {
    const userInfo = document.getElementById('userInfo');
    const userMenu = document.getElementById('userMenu');
    const dropdownIcon = userInfo.querySelector('.dropdown-icon');

    userInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
        dropdownIcon.style.transform = userMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    });

    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
            dropdownIcon.style.transform = 'rotate(0)';
        }
    });
}

// Table Management
let currentLeads = [];
let selectedLeads = new Set();
let currentPage = 1;
const leadsPerPage = 10;

async function initializeTable() {
    try {
        const response = await fetch('../api/get-leads.php');
        const data = await response.json();
        currentLeads = data;
        updateTable();
        updateFilters(data);
        updatePagination();
    } catch (error) {
        console.error('Error loading leads:', error);
        showNotification('Error al cargar los leads', 'error');
    }
}

function updateTable(filteredData = currentLeads) {
    const startIndex = (currentPage - 1) * leadsPerPage;
    const endIndex = startIndex + leadsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '';

    paginatedData.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="lead-checkbox" value="${lead.id}">
            </td>
            <td>${lead.pauta}</td>
            <td>${lead.nombre}</td>
            <td>${lead.telefono}</td>
            <td>${lead.correo}</td>
            <td>${lead.carrera_interes}</td>
            <td>${lead.ultimo_titulo}</td>
            <td>${lead.nombre_titulo}</td>
            <td>${lead.orientador || 'Sin asignar'}</td>
            <td>
                <button class="edit-btn" onclick="editLead(${lead.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Pagination Functions
function initializePagination() {
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateTable();
            updatePagination();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const maxPages = Math.ceil(currentLeads.length / leadsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            updateTable();
            updatePagination();
        }
    });
}

function updatePagination() {
    const totalPages = Math.ceil(currentLeads.length / leadsPerPage);
    document.getElementById('currentPage').textContent = `Página ${currentPage} de ${totalPages}`;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Filter Functions
function updateFilters(data) {
    const uniqueCarreras = [...new Set(data.map(lead => lead.carrera_interes))];
    const carreraSelect = document.getElementById('carreraFilter');
    
    carreraSelect.innerHTML = '<option value="">Filtrar por Carrera</option>';
    uniqueCarreras.forEach(carrera => {
        const option = document.createElement('option');
        option.value = carrera;
        option.textContent = carrera;
        carreraSelect.appendChild(option);
    });
}

function applyFilters() {
    const pauta = document.getElementById('pautaFilter').value;
    const orientador = document.getElementById('orientadorFilter').value;
    const carrera = document.getElementById('carreraFilter').value;

    let filteredLeads = currentLeads;

    if (pauta) {
        filteredLeads = filteredLeads.filter(lead => lead.pauta === pauta);
    }
    if (orientador) {
        filteredLeads = filteredLeads.filter(lead => lead.orientador_id === orientador);
    }
    if (carrera) {
        filteredLeads = filteredLeads.filter(lead => lead.carrera_interes === carrera);
    }

    currentPage = 1;
    updateTable(filteredLeads);
    updatePagination();
}

// Lead Assignment Functions
async function handleAssignment(e) {
    e.preventDefault();
    
    const orientadorId = document.getElementById('orientadorSelect').value;
    const leadsArray = Array.from(selectedLeads);

    try {
        const response = await fetch('../api/assign-leads.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orientadorId,
                leads: leadsArray
            })
        });

        if (response.ok) {
            showNotification('Leads asignados correctamente', 'success');
            closeModal();
            selectedLeads.clear();
            await initializeTable();
        } else {
            throw new Error('Error en la asignación');
        }
    } catch (error) {
        console.error('Error assigning leads:', error);
        showNotification('Error al asignar leads', 'error');
    }
}

// Utility Functions
function showNotification(message, type) {
    // Implement your notification system here
    console.log(`${type}: ${message}`);
}

function closeModal() {
    document.getElementById('assignModal').style.display = 'none';
}

function editLead(leadId) {
    // Implement lead editing functionality
    console.log('Editing lead:', leadId);
}

// Event Listeners Setup
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchLeads').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredLeads = currentLeads.filter(lead => 
            lead.nombre.toLowerCase().includes(searchTerm) ||
            lead.correo.toLowerCase().includes(searchTerm) ||
            lead.telefono.includes(searchTerm)
        );
        currentPage = 1;
        updateTable(filteredLeads);
        updatePagination();
    });

    // Filter handlers
    ['pautaFilter', 'orientadorFilter', 'carreraFilter'].forEach(filterId => {
        document.getElementById(filterId).addEventListener('change', applyFilters);
    });

    // Select all checkbox
    document.getElementById('selectAll').addEventListener('change', (e) => {
        const checkboxes = document.querySelectorAll('.lead-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
            if (e.target.checked) {
                selectedLeads.add(checkbox.value);
            } else {
                selectedLeads.delete(checkbox.value);
            }
        });
        updateAssignButton();
    });

    // Individual checkboxes
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('lead-checkbox')) {
            if (e.target.checked) {
                selectedLeads.add(e.target.value);
            } else {
                selectedLeads.delete(e.target.value);
            }
            updateAssignButton();
        }
    });

    // Assignment form
    document.getElementById('assignForm').addEventListener('submit', handleAssignment);
}
