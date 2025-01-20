document.addEventListener('DOMContentLoaded', function() {
    // Initialize Social Manager Chart
    const socialManagerCtx = document.getElementById('socialManagerChart').getContext('2d');
    new Chart(socialManagerCtx, {
        type: 'doughnut',
        data: {
            labels: ['Engagement', 'Alcance', 'Efectividad'],
            datasets: [{
                data: [85, 75, 90],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107'
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: '70%'
        }
    });

    // Initialize Designer Chart
    const designerCtx = document.getElementById('designerChart').getContext('2d');
    new Chart(designerCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tickets Completados', 'En Proceso', 'Pendientes'],
            datasets: [{
                data: [90, 7, 3],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            cutout: '70%'
        }
    });

    // Sample Tasks Data
    const tasks = {
        pending: [
            'Diseño campaña navideña',
            'Reporte mensual redes sociales'
        ],
        inProgress: [
            'Contenido blog semanal',
            'Diseño posts Instagram'
        ],
        completed: [
            'Newsletter semanal',
            'Diseño banner principal'
        ]
    };

    // Render Tasks
    function renderTasks() {
        document.getElementById('pendingTasks').innerHTML = tasks.pending.map(task => 
            `<div class="task-item">${task}</div>`
        ).join('');
        
        document.getElementById('inProgressTasks').innerHTML = tasks.inProgress.map(task => 
            `<div class="task-item">${task}</div>`
        ).join('');
        
        document.getElementById('completedTasks').innerHTML = tasks.completed.map(task => 
            `<div class="task-item">${task}</div>`
        ).join('');
    }

    // Sample Alerts
    const alerts = [
        {
            message: 'KPI de engagement por debajo del objetivo',
            type: 'warning'
        },
        {
            message: 'Retraso en entrega de diseños campaña',
            type: 'danger'
        }
    ];

    // Render Alerts
    function renderAlerts() {
        document.getElementById('alertsList').innerHTML = alerts.map(alert => 
            `<div class="alert-item alert-${alert.type}">
                ${alert.message}
            </div>`
        ).join('');
    }

    // Initial render
    renderTasks();
    renderAlerts();
});
