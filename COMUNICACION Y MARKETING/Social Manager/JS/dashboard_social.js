// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
    // Publications Chart
    const publicationsCtx = document.getElementById('publications-chart').getContext('2d');
    new Chart(publicationsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Pendiente', 'Programado'],
            datasets: [{
                data: [30, 50, 20],
                backgroundColor: ['#2ecc71', '#e74c3c', '#f1c40f']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Estado de Publicaciones'
                }
            }
        }
    });

    // Platforms Chart
    const platformsCtx = document.getElementById('platforms-chart').getContext('2d');
    new Chart(platformsCtx, {
        type: 'bar',
        data: {
            labels: ['Facebook', 'Instagram', 'TikTok'],
            datasets: [{
                label: 'Alcance',
                data: [1200, 1900, 800],
                backgroundColor: '#3498db'
            }, {
                label: 'Engagement',
                data: [500, 1200, 600],
                backgroundColor: '#e74c3c'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Métricas por Plataforma'
                }
            }
        }
    });

    // Update KPIs
    document.getElementById('posts-completed').textContent = '15';
    document.getElementById('posts-scheduled').textContent = '25';
    document.getElementById('avg-engagement').textContent = '4.2%';
    document.getElementById('leads').textContent = '127';

    // Add sample tasks
    const tasks = [
        { title: 'Publicación Instagram', date: '2024-01-20', platform: 'Instagram' },
        { title: 'Campaña Facebook Ads', date: '2024-01-22', platform: 'Facebook' },
        { title: 'Video TikTok', date: '2024-01-25', platform: 'TikTok' }
    ];

    const taskList = document.getElementById('taskList');
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div>
                <strong>${task.title}</strong>
                <span>(${task.platform})</span>
            </div>
            <div>${task.date}</div>
        `;
        taskList.appendChild(taskElement);
    });
});

document.getElementById('filterButton').addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        alert('Por favor selecciona ambas fechas');
        return;
    }

    updateDashboardData(startDate, endDate);
});

function updateDashboardData(startDate, endDate) {
    // Simulate loading state
    document.querySelectorAll('.kpi-value').forEach(el => {
        el.style.opacity = '0.5';
    });

    // Simulate API call with setTimeout
    setTimeout(() => {
        // Update KPIs with filtered data
        updateKPIs(startDate, endDate);
        // Update charts with filtered data
        updateCharts(startDate, endDate);
        
        // Remove loading state
        document.querySelectorAll('.kpi-value').forEach(el => {
            el.style.opacity = '1';
        });
    }, 1000);
}

function updateKPIs(startDate, endDate) {
    // Simulate different data for different date ranges
    const randomMultiplier = Math.random() * (1.5 - 0.5) + 0.5;
    
    document.getElementById('posts-completed').textContent = 
        Math.round(15 * randomMultiplier);
    document.getElementById('posts-scheduled').textContent = 
        Math.round(25 * randomMultiplier);
    document.getElementById('avg-engagement').textContent = 
        (4.2 * randomMultiplier).toFixed(1) + '%';
    document.getElementById('leads').textContent = 
        Math.round(127 * randomMultiplier);
}

function updateCharts(startDate, endDate) {
    // Update Publications Chart
    const publicationsChart = Chart.instances[0];
    const randomData = [
        Math.round(Math.random() * 50),
        Math.round(Math.random() * 50),
        Math.round(Math.random() * 50)
    ];
    
    publicationsChart.data.datasets[0].data = randomData;
    publicationsChart.update();

    // Update Platforms Chart
    const platformsChart = Chart.instances[1];
    const randomReach = [
        Math.round(Math.random() * 2000),
        Math.round(Math.random() * 2000),
        Math.round(Math.random() * 2000)
    ];
    const randomEngagement = [
        Math.round(Math.random() * 1000),
        Math.round(Math.random() * 1000),
        Math.round(Math.random() * 1000)
    ];
    
    platformsChart.data.datasets[0].data = randomReach;
    platformsChart.data.datasets[1].data = randomEngagement;
    platformsChart.update();
}
