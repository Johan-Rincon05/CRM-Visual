// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupEventListeners();
    loadUserData();
    renderUserTable(mockData.users);
    updateStatistics();
});

// Datos simulados para el sistema
const mockData = {
    users: [
        {
            id: "001",
            nombre: "Juan Pérez",
            cedula: "12345678", 
            area: "Recursos Humanos",
            cargo: "Analista Senior",
            estado: "Activo",
            ultimaActividad: "2024-01-15T10:30:00",
            correo: "juan.perez@empresa.com",
            telefono: "3001234567",
            direccion: "Calle 123 #45-67",
            eps: "Sura",
            arl: "Positiva",
            pension: "Porvenir",
            fechaIngreso: "2023-01-15",
            salario: "4500000",
            tipoContrato: "Indefinido",
            cuentaBancaria: "1234567890",
            banco: "Bancolombia"
        },
        {
            id: "002", 
            nombre: "María González",
            cedula: "87654321",
            area: "Tecnología",
            cargo: "Desarrollador Full Stack",
            estado: "Activo",
            ultimaActividad: "2024-01-15T11:45:00",
            correo: "maria.gonzalez@empresa.com",
            telefono: "3109876543",
            direccion: "Avenida 456 #78-90",
            eps: "Nueva EPS",
            arl: "Colmena",
            pension: "Protección",
            fechaIngreso: "2023-03-20",
            salario: "5500000",
            tipoContrato: "Indefinido", 
            cuentaBancaria: "0987654321",
            banco: "Davivienda"
        },
        {
            id: "003",
            nombre: "Carlos Rodríguez",
            cedula: "23456789",
            area: "Ventas",
            cargo: "Gerente Comercial",
            estado: "Inactivo",
            ultimaActividad: "2024-01-14T09:15:00",
            correo: "carlos.rodriguez@empresa.com",
            telefono: "3205555555",
            direccion: "Carrera 789 #12-34",
            eps: "Sanitas",
            arl: "SURA",
            pension: "Colfondos",
            fechaIngreso: "2022-06-10",
            salario: "8500000",
            tipoContrato: "Indefinido",
            cuentaBancaria: "5678901234",
            banco: "BBVA"
        }
    ],

    medicalRecords: [
        {
            userId: "001",
            tipoSangre: "O+",
            alergias: ["Penicilina"],
            contactoEmergencia: {
                nombre: "Ana Pérez",
                parentesco: "Esposa",
                telefono: "3157894561"
            },
            examenes: [
                {
                    fecha: "2023-12-10",
                    tipo: "Examen Periódico",
                    resultado: "Normal",
                    recomendaciones: "Ninguna"
                }
            ]
        },
        {
            userId: "002",
            tipoSangre: "A-",
            alergias: ["Ninguna"],
            contactoEmergencia: {
                nombre: "Pedro González",
                parentesco: "Hermano",
                telefono: "3101234567"
            },
            examenes: [
                {
                    fecha: "2023-11-15",
                    tipo: "Examen de Ingreso",
                    resultado: "Normal",
                    recomendaciones: "Uso de gafas para computador"
                }
            ]
        }
    ],

    attendance: [
        {
            userId: "001",
            registros: [
                {
                    fecha: "2024-01-15",
                    entrada: "08:00",
                    salida: "17:00",
                    estado: "Completo"
                },
                {
                    fecha: "2024-01-14",
                    entrada: "08:15",
                    salida: "17:30",
                    estado: "Completo"
                }
            ]
        },
        {
            userId: "002",
            registros: [
                {
                    fecha: "2024-01-15",
                    entrada: "09:00",
                    salida: "18:00",
                    estado: "Completo"
                },
                {
                    fecha: "2024-01-14",
                    entrada: "08:30",
                    salida: "17:45",
                    estado: "Completo"
                }
            ]
        }
    ],

    departments: [
        {
            id: "RH",
            nombre: "Recursos Humanos",
            empleados: 30,
            supervisor: "Ana Martínez"
        },
        {
            id: "TI",
            nombre: "Tecnología",
            empleados: 25,
            supervisor: "Pedro Sánchez"
        },
        {
            id: "VT",
            nombre: "Ventas",
            empleados: 40,
            supervisor: "Laura Torres"
        }
    ],

    notifications: [
        {
            id: "1",
            tipo: "warning",
            mensaje: "Examen médico próximo a vencer",
            usuario: "001",
            fecha: "2024-01-15T08:00:00"
        },
        {
            id: "2",
            tipo: "info",
            mensaje: "Actualización de datos requerida",
            usuario: "002",
            fecha: "2024-01-14T15:30:00"
        }
    ]
};

// Charts Initialization with real data
function initializeCharts() {
    // Destroy existing charts if they exist
    const existingCharts = Chart.getChart('userStatusChart');
    if (existingCharts) existingCharts.destroy();
    
    const existingDeptChart = Chart.getChart('departmentChart');
    if (existingDeptChart) existingDeptChart.destroy();

    // Calculate data
    const activeUsers = mockData.users.filter(user => user.estado === 'Activo').length;
    const inactiveUsers = mockData.users.filter(user => user.estado === 'Inactivo').length;

    // User Status Chart
    const statusChart = new Chart(document.getElementById('userStatusChart'), {
        type: 'doughnut',
        data: {
            labels: ['Activos', 'Inactivos'],
            datasets: [{
                data: [activeUsers, inactiveUsers],
                backgroundColor: ['#198754', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Department Chart
    const deptData = mockData.departments.map(dept => ({
        label: dept.nombre,
        value: dept.empleados
    }));

    const deptChart = new Chart(document.getElementById('departmentChart'), {
        type: 'bar',
        data: {
            labels: deptData.map(d => d.label),
            datasets: [{
                label: 'Empleados por Área',
                data: deptData.map(d => d.value),
                backgroundColor: '#DD1A00'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Event Listeners Setup
function setupEventListeners() {
    const searchInput = document.querySelector('input[placeholder="Buscar usuario..."]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const filters = document.querySelectorAll('.form-select');
    filters.forEach(filter => {
        filter.addEventListener('change', handleFilters);
    });

    setupModalFormListeners();
}

// Render User Table
function renderUserTable(users) {
    const tbody = document.querySelector('tbody');
    console.log('Usuarios a renderizar:', users);
    
    if (!tbody) {
        console.log('No se encontró el tbody');
        return;
    }
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nombre}</td>
            <td>${user.area}</td>
            <td>${user.cargo}</td>
            <td><span class="badge bg-${user.estado === 'Activo' ? 'success' : 'danger'}">${user.estado}</span></td>
            <td>${formatDate(user.ultimaActividad)}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="showUserDetails('${user.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="showMedicalHistory('${user.id}')">
                    <i class="fas fa-notes-medical"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="showAttendance('${user.id}')">
                    <i class="fas fa-calendar-check"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function updateStatistics() {
    const totalUsers = mockData.users.length;
    const activeUsers = mockData.users.filter(user => user.estado === 'Activo').length;
    const inactiveUsers = mockData.users.filter(user => user.estado === 'Inactivo').length;
    
    document.querySelector('.stat-card:nth-child(1) h3').textContent = totalUsers;
    document.querySelector('.stat-card:nth-child(2) h3').textContent = activeUsers;
}

// Handle Search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Handle Filters
function handleFilters() {
    const area = document.querySelector('select[value=""]').value;
    const status = document.querySelector('select[value=""]').value;
    filterUsers(area, status);
}

function filterUsers(area, status) {
    const tableRows = document.querySelectorAll('tbody tr');
    
    tableRows.forEach(row => {
        const rowArea = row.querySelector('td:nth-child(3)').textContent;
        const rowStatus = row.querySelector('.badge').textContent;
        
        const areaMatch = !area || rowArea === area;
        const statusMatch = !status || rowStatus.toLowerCase() === status.toLowerCase();
        
        row.style.display = areaMatch && statusMatch ? '' : 'none';
    });
}

// Modal Functions
function showUserDetails(userId) {
    const user = getUserById(userId);
    const medicalRecord = getMedicalRecordByUserId(userId);
    const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
    
    // General Info Tab
    const generalInfo = document.getElementById('generalInfo');
    if (generalInfo) {
        generalInfo.innerHTML = `
            <form id="userDetailsForm">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Nombre Completo</label>
                        <input type="text" class="form-control" value="${user.nombre}" name="nombre">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Cédula</label>
                        <input type="text" class="form-control" value="${user.cedula}" name="cedula">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Correo</label>
                        <input type="email" class="form-control" value="${user.correo}" name="correo">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Teléfono</label>
                        <input type="tel" class="form-control" value="${user.telefono}" name="telefono">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <label class="form-label">Dirección</label>
                        <input type="text" class="form-control" value="${user.direccion}" name="direccion">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Cargo</label>
                        <input type="text" class="form-control" value="${user.cargo}" name="cargo">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Área</label>
                        <input type="text" class="form-control" value="${user.area}" name="area">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Salario</label>
                        <input type="text" class="form-control" value="${user.salario}" name="salario">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Tipo de Contrato</label>
                        <input type="text" class="form-control" value="${user.tipoContrato}" name="tipoContrato">
                    </div>
                </div>
            </form>
        `;
    }
    
    // Medical Info Tab
    const medicalInfo = document.getElementById('medicalInfo');
    if (medicalInfo && medicalRecord) {
        medicalInfo.innerHTML = `
            <form id="medicalInfoForm">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Tipo de Sangre</label>
                        <input type="text" class="form-control" value="${medicalRecord.tipoSangre}" name="tipoSangre">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Alergias</label>
                        <input type="text" class="form-control" value="${medicalRecord.alergias.join(', ')}" name="alergias">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-12">
                        <h6>Contacto de Emergencia</h6>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-control" value="${medicalRecord.contactoEmergencia.nombre}" name="emergencyName">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Parentesco</label>
                        <input type="text" class="form-control" value="${medicalRecord.contactoEmergencia.parentesco}" name="emergencyRelation">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Teléfono</label>
                        <input type="text" class="form-control" value="${medicalRecord.contactoEmergencia.telefono}" name="emergencyPhone">
                    </div>
                </div>
            </form>
        `;
    }
    
    // Labor Info Tab
    const laboralInfo = document.getElementById('laboralInfo');
    if (laboralInfo && user) {
        laboralInfo.innerHTML = `
            <form id="laboralInfoForm">
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">EPS</label>
                        <input type="text" class="form-control" value="${user.eps}" name="eps">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">ARL</label>
                        <input type="text" class="form-control" value="${user.arl}" name="arl">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Fondo de Pensiones</label>
                        <input type="text" class="form-control" value="${user.pension}" name="pension">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Fecha de Ingreso</label>
                        <input type="date" class="form-control" value="${user.fechaIngreso}" name="fechaIngreso">
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Cuenta Bancaria</label>
                        <input type="text" class="form-control" value="${user.cuentaBancaria}" name="cuentaBancaria">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Banco</label>
                        <input type="text" class="form-control" value="${user.banco}" name="banco">
                    </div>
                </div>
            </form>
        `;
    }
    
    modal.show();
}


function showMedicalHistory(userId) {
    const medicalRecord = getMedicalRecordByUserId(userId);
    const modal = new bootstrap.Modal(document.getElementById('medicalHistoryModal'));
    
    const modalBody = document.querySelector('#medicalHistoryModal .modal-body');
    if (modalBody && medicalRecord) {
        modalBody.innerHTML = `
            <div class="mb-3">
                <h6>Tipo de Sangre: ${medicalRecord.tipoSangre}</h6>
                <h6>Alergias: ${medicalRecord.alergias.join(', ') || 'Ninguna'}</h6>
            </div>
            <div class="mb-3">
                <h6>Contacto de Emergencia</h6>
                <p>Nombre: ${medicalRecord.contactoEmergencia.nombre}</p>
                <p>Parentesco: ${medicalRecord.contactoEmergencia.parentesco}</p>
                <p>Teléfono: ${medicalRecord.contactoEmergencia.telefono}</p>
            </div>
            <h6>Exámenes Médicos</h6>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Resultado</th>
                            <th>Recomendaciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${medicalRecord.examenes.map(examen => `
                            <tr>
                                <td>${formatDate(examen.fecha)}</td>
                                <td>${examen.tipo}</td>
                                <td>${examen.resultado}</td>
                                <td>${examen.recomendaciones}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    modal.show();
}


function showAttendance(userId) {
    const attendance = getAttendanceByUserId(userId);
    const modal = new bootstrap.Modal(document.getElementById('attendanceModal'));
    
    const modalBody = document.querySelector('#attendanceModal .modal-body');
    if (modalBody && attendance) {
        modalBody.innerHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${attendance.registros.map(registro => `
                            <tr>
                                <td>${registro.fecha}</td>
                                <td>${registro.entrada}</td>
                                <td>${registro.salida}</td>
                                <td><span class="badge bg-success">${registro.estado}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
    
    modal.show();
}

// Modal Form Handlers
function setupModalFormListeners() {
    const newUserForm = document.querySelector('#newUserModal form');
    if (newUserForm) {
        newUserForm.addEventListener('submit', handleNewUserSubmit);
    }

    const userDetailsForm = document.querySelector('#userDetailsModal form');
    if (userDetailsForm) {
        userDetailsForm.addEventListener('submit', handleUserDetailsSubmit);
    }
}

function handleNewUserSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData);
    
    // Add new user to mockData
    const newUser = {
        id: (mockData.users.length + 1).toString().padStart(3, '0'),
        ...userData,
        estado: 'Activo',
        ultimaActividad: new Date().toISOString()
    };
    
    mockData.users.push(newUser);
    renderUserTable(mockData.users);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('newUserModal'));
    modal.hide();
    
    showNotification('Usuario creado exitosamente', 'success');
}

function handleUserDetailsSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData);
    
    // Update user in mockData
    const userIndex = mockData.users.findIndex(user => user.id === userData.id);
    if (userIndex !== -1) {
        mockData.users[userIndex] = { ...mockData.users[userIndex], ...userData };
        renderUserTable(mockData.users);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
        modal.hide();
        
        showNotification('Usuario actualizado exitosamente', 'success');
    }
}

// Utility Functions
function formatDate(dateString) {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(dateString));
}

function showNotification(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '11';
    
    toastContainer.innerHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    toast._element.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}

// Data Management Functions
function loadUserData() {
    renderUserTable(mockData.users);
}

// Helper Functions
function getUserById(id) {
    return mockData.users.find(user => user.id === id);
}

function getMedicalRecordByUserId(userId) {
    return mockData.medicalRecords.find(record => record.userId === userId);
}

function getAttendanceByUserId(userId) {
    return mockData.attendance.find(record => record.userId === userId);
}

function getDepartmentById(id) {
    return mockData.departments.find(dept => dept.id === id);
}

function getNotificationsByUserId(userId) {
    return mockData.notifications.filter(notif => notif.usuario === userId);
}

// Export Functions
function exportUserData(format) {
    const data = mockData.users.map(user => ({
        ID: user.id,
        Nombre: user.nombre,
        Área: user.area,
        Cargo: user.cargo,
        Estado: user.estado,
        'Última Actividad': formatDate(user.ultimaActividad)
    }));

    if (format === 'csv') {
        const csv = convertToCSV(data);
        downloadFile(csv, 'usuarios.csv', 'text/csv');
    } else if (format === 'excel') {
        // Implement Excel export
        console.log('Exportando a Excel:', data);
    }
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => headers.map(header => obj[header]));
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadFile(content, fileName, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
}
