document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    loadActivityLog();
    setupEventListeners();
});

function initializeCharts() {
    // Activity by Area Chart
    const areaCtx = document.getElementById('activityByArea').getContext('2d');
    new Chart(areaCtx, {
        type: 'pie',
        data: {
            labels: ['Administrativa', 'Comercial', 'Marketing', 'Tecnologica'],
            datasets: [{
                data: [30, 25, 20, 25],
                backgroundColor: ['#0D0A89', '#FF6600', '#8505A0', '#DD1A00']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Actividad por Área'
                }
            }
        }
    });

    // Activity by Action Chart
    const actionCtx = document.getElementById('activityByAction').getContext('2d');
    new Chart(actionCtx, {
        type: 'bar',
        data: {
            labels: ['Login', 'Permisos', 'Creación', 'Edición', 'Eliminación'],
            datasets: [{
                label: 'Número de Acciones',
                data: [150, 45, 30, 80, 20],
                backgroundColor: '#DD1A00'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Actividad por Tipo de Acción'
                }
            }
        }
    });

    // Activity by User Chart
    const userCtx = document.getElementById('activityByUser').getContext('2d');
    new Chart(userCtx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            datasets: [{
                label: 'Actividades',
                data: [65, 59, 80, 81, 56, 40, 30],
                borderColor: '#DD1A00',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Actividad Diaria'
                }
            }
        }
    });
}

function loadActivityLog() {
    const mockData = [
        {
            user: 'Juan Pérez',
            email: 'juan@ejemplo.com',
            datetime: '2024-01-20 10:30:15',
            action: 'Inicio de sesión',
            area: 'Administrativa',
            ip: '192.168.1.100',
            details: 'Login exitoso'
        },
        // Add more mock data as needed
    ];

    const tbody = document.getElementById('activityLogBody');
    tbody.innerHTML = mockData.map(log => `
        <tr>
            <td>${log.user}</td>
            <td>${log.email}</td>
            <td>${log.datetime}</td>
            <td>${log.action}</td>
            <td>${log.area}</td>
            <td>${log.ip}</td>
            <td>
                <button class="details-btn" onclick="showDetails('${log.user}')">
                    Ver detalles
                </button>
            </td>
        </tr>
    `).join('');
}

function setupEventListeners() {
    // Export buttons
    document.querySelector('.export-btn.csv').addEventListener('click', exportToCSV);
    document.querySelector('.export-btn.pdf').addEventListener('click', exportToPDF);

    // Filter application
    document.querySelector('.apply-filter').addEventListener('click', applyFilters);

    // Modal close
    document.querySelector('.close-modal').addEventListener('click', closeModal);
}

function exportToCSV() {
    console.log('Exporting to CSV...');
    // Implement CSV export logic
}

function exportToPDF() {
    console.log('Exporting to PDF...');
    // Implement PDF export logic
}

function applyFilters() {
    const filters = {
        user: document.getElementById('userFilter').value,
        action: document.getElementById('actionFilter').value,
        area: document.getElementById('areaFilter').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };
    console.log('Applying filters:', filters);
    // Implement filter logic
}

function showDetails(user) {
    const modal = document.getElementById('detailsModal');
    const details = document.getElementById('activityDetails');
    details.innerHTML = `<p>Detalles de actividad para: ${user}</p>`;
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('detailsModal').style.display = 'none';
}
