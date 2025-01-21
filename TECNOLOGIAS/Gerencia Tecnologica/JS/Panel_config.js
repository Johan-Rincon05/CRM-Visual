document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    setupEventListeners();
    loadRecentActivity();
    initializeNotifications();
});

function initializeCharts() {
    // Users by Area Chart
    const usersByAreaCtx = document.getElementById('usersByAreaChart').getContext('2d');
    new Chart(usersByAreaCtx, {
        type: 'doughnut',
        data: {
            labels: ['Marketing', 'Ventas', 'Desarrollo', 'RRHH', 'Administración'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    '#2563eb',
                    '#16a34a',
                    '#ca8a04',
                    '#dc2626',
                    '#64748b'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // System Activity Chart
    const systemActivityCtx = document.getElementById('systemActivityChart').getContext('2d');
    new Chart(systemActivityCtx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
            datasets: [{
                label: 'Actividad del Sistema',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: true,
                borderColor: '#2563eb',
                tension: 0.4,
                backgroundColor: 'rgba(37, 99, 235, 0.1)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Roles Distribution Chart
    const rolesDistributionCtx = document.getElementById('rolesDistributionChart').getContext('2d');
    new Chart(rolesDistributionCtx, {
        type: 'bar',
        data: {
            labels: ['Admin', 'Editor', 'Viewer', 'Manager', 'Analyst'],
            datasets: [{
                label: 'Usuarios por Rol',
                data: [4, 12, 25, 8, 15],
                backgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function setupEventListeners() {
    // Notification Button
    const notificationBtn = document.querySelector('.notification-btn');
    notificationBtn.addEventListener('click', toggleNotificationModal);

    // Quick Action Buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', handleQuickAction);
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', handleSearch);

    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('notificationModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function toggleNotificationModal() {
    const modal = document.getElementById('notificationModal');
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
}

function handleQuickAction(e) {
    const action = e.currentTarget.textContent.trim();
    switch(action) {
        case 'Nuevo Usuario':
            window.location.href = 'users.html?action=new';
            break;
        case 'Nuevo Rol':
            window.location.href = 'roles.html?action=new';
            break;
        case 'Exportar Logs':
            exportLogs();
            break;
        case 'Configuración':
            window.location.href = 'settings.html';
            break;
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
}

function loadRecentActivity() {
    // Simulated activity data
    const activities = [
        {
            type: 'user',
            message: 'Nuevo usuario creado: María González',
            time: '5 minutos'
        },
        {
            type: 'role',
            message: 'Rol modificado: Gerente de Marketing',
            time: '15 minutos'
        },
        {
            type: 'login',
            message: 'Inicio de sesión: Carlos Pérez',
            time: '30 minutos'
        }
    ];

    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.message}</p>
                <span class="activity-time">Hace ${activity.time}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        user: 'user-plus',
        role: 'user-tag',
        login: 'sign-in-alt'
    };
    return icons[type] || 'info-circle';
}

function exportLogs() {
    // Implement log export functionality
    console.log('Exporting logs...');
    // Add export logic here
}

function initializeNotifications() {
    // Simulated notifications
    const notifications = [
        {
            type: 'warning',
            message: 'Nueva solicitud de acceso pendiente',
            time: '10 minutos'
        },
        {
            type: 'info',
            message: 'Actualización de seguridad disponible',
            time: '1 hora'
        }
    ];

    updateNotificationBadge(notifications.length);
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

// Utility function for date formatting
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
