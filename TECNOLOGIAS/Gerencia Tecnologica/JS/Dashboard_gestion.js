document.addEventListener('DOMContentLoaded', function() {
    // Configuración de colores principales
    const primaryColor = '#DD1A00';
    const primaryLight = '#ff3d26';
    const primaryDark = '#b31500';
    
    const actionButtons = document.querySelectorAll('.action-btn');
    const gridContainer = document.querySelector('.grid-container');
    
    // Guardar contenido original del dashboard
    const originalContent = `
    <div class="card">
        <h3>Usuarios por Área</h3>
        <canvas id="usersChart"></canvas>
    </div>
    <div class="card">
        <h3>Resumen de Roles</h3>
        <canvas id="rolesChart"></canvas>
    </div>
    <div class="card logs">
        <h3>Actividad Reciente</h3>
        <div class="logs-container" id="logsContainer"></div>
    </div>
`;

    
    
    // Función para inicializar gráficos
    function initializeCharts() {
        // Usuarios por Área Chart
        const usersCtx = document.getElementById('usersChart').getContext('2d');
        window.usersChart = new Chart(usersCtx, {
            type: 'bar',
            data: {
                labels: ['IT', 'RRHH', 'Ventas', 'Marketing', 'Finanzas'],
                datasets: [{
                    label: 'Usuarios Activos',
                    data: [12, 8, 15, 6, 10],
                    backgroundColor: primaryColor,
                    borderRadius: 6
                }, {
                    label: 'Usuarios Inactivos',
                    data: [2, 1, 3, 1, 2],
                    backgroundColor: primaryLight,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false
                        }
                    }
                }
            }
        });

        // Roles Chart
        const rolesCtx = document.getElementById('rolesChart').getContext('2d');
        window.rolesChart = new Chart(rolesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Administradores', 'Supervisores', 'Usuarios'],
                datasets: [{
                    data: [5, 15, 80],
                    backgroundColor: [primaryColor, primaryLight, primaryDark],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }

    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            
            actionButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (buttonText === 'Vista General') {
                gridContainer.innerHTML = originalContent;
                initializeCharts();
                renderLogs();
            } else {
                switch(buttonText) {
                    case 'Gestión Usuarios':
                        gridContainer.innerHTML = `
                            <div class="card">
                                <h3>Gestión de Usuarios</h3>
                                <div class="user-stats">
                                    <div class="stat-item">
                                        <h4>Usuarios Totales</h4>
                                        <span>150</span>
                                    </div>
                                    <div class="stat-item">
                                        <h4>Usuarios Activos</h4>
                                        <span>120</span>
                                    </div>
                                    <div class="stat-item">
                                        <h4>Nuevos Usuarios</h4>
                                        <span>10</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    
                    case 'Roles':
                        gridContainer.innerHTML = `
                            <div class="card">
                                <h3>Gestión de Roles</h3>
                                <div class="roles-list">
                                    <div class="role-item">
                                        <h4>Administradores</h4>
                                        <span>5 usuarios</span>
                                    </div>
                                    <div class="role-item">
                                        <h4>Supervisores</h4>
                                        <span>15 usuarios</span>
                                    </div>
                                    <div class="role-item">
                                        <h4>Usuarios</h4>
                                        <span>130 usuarios</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    
                    case 'Áreas':
                        gridContainer.innerHTML = `
                            <div class="card">
                                <h3>Gestión de Áreas</h3>
                                <div class="areas-list">
                                    <div class="area-item">
                                        <h4>IT</h4>
                                        <span>25 usuarios</span>
                                    </div>
                                    <div class="area-item">
                                        <h4>RRHH</h4>
                                        <span>15 usuarios</span>
                                    </div>
                                    <div class="area-item">
                                        <h4>Marketing</h4>
                                        <span>30 usuarios</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                    
                    case 'Auditoría':
                        gridContainer.innerHTML = `
                            <div class="card">
                                <h3>Registro de Auditoría</h3>
                                <div class="audit-list">
                                    <div class="audit-item">
                                        <span class="timestamp">2024-01-20 10:30</span>
                                        <span class="action">Usuario creado</span>
                                        <span class="user">Admin1</span>
                                    </div>
                                    <div class="audit-item">
                                        <span class="timestamp">2024-01-20 10:15</span>
                                        <span class="action">Rol modificado</span>
                                        <span class="user">Admin2</span>
                                    </div>
                                    <div class="audit-item">
                                        <span class="timestamp">2024-01-20 10:00</span>
                                        <span class="action">Área actualizada</span>
                                        <span class="user">Admin1</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        break;
                }
            }
        });
    });

    // Simulación de logs de actividad
    const logsContainer = document.getElementById('logsContainer');
    const mockLogs = [
        { user: 'admin1', action: 'Creación de usuario nuevo', timestamp: '2024-01-20 10:30', type: 'create' },
        { user: 'supervisor2', action: 'Modificación de rol usuario', timestamp: '2024-01-20 10:15', type: 'update' },
        { user: 'user3', action: 'Inicio de sesión exitoso', timestamp: '2024-01-20 10:00', type: 'login' },
        { user: 'admin2', action: 'Actualización de permisos', timestamp: '2024-01-20 09:45', type: 'update' },
        { user: 'user5', action: 'Cambio de área asignada', timestamp: '2024-01-20 09:30', type: 'update' },
        { user: 'supervisor1', action: 'Revisión de auditoría', timestamp: '2024-01-20 09:15', type: 'audit' },
        { user: 'admin3', action: 'Eliminación de usuario', timestamp: '2024-01-20 09:00', type: 'delete' }
    ];

    // Función para renderizar logs
    function renderLogs() {
        if (logsContainer) {
            logsContainer.innerHTML = '';
            mockLogs.forEach(log => {
                const logEntry = document.createElement('div');
                logEntry.className = 'log-entry';
                
                const iconMap = {
                    create: '➕',
                    update: '🔄',
                    delete: '❌',
                    login: '🔑',
                    audit: '📋'
                };

                logEntry.innerHTML = `
                    <span>${iconMap[log.type] || '•'} ${log.user}: ${log.action}</span>
                    <span class="timestamp">${log.timestamp}</span>
                `;
                logsContainer.appendChild(logEntry);
            });
        }
    }

    // Inicializar charts y logs
    initializeCharts();
    renderLogs();

    // Actualización automática
    setInterval(() => {
        if (window.usersChart) {
            window.usersChart.data.datasets[0].data = window.usersChart.data.datasets[0].data.map(
                value => Math.floor(value + Math.random() * 5 - 2)
            );
            window.usersChart.update();
        }

        const newLog = {
            user: 'system',
            action: 'Actualización automática',
            timestamp: new Date().toLocaleString(),
            type: 'update'
        };
        
        mockLogs.unshift(newLog);
        renderLogs();
    }, 30000);
});
