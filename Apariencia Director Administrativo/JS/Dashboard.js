// Aseguramos que Chart.js esté cargado antes de iniciar
if (typeof Chart !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
}

function initializeDashboard() {
    const carteraChart = initCarteraChart();
    const pagosChart = initPagosChart();
    const nicolChart = initTeamChart('Nicol');
    const dianaChart = initTeamChart('Diana');
}

function initCarteraChart() {
    const ctx = document.getElementById('carteraUniversidades');
    if (!ctx) return;
    
    const config = {
        type: 'bar',
        data: {
            labels: ['INCCA', 'San Camilo', 'CENDA', 'FIT', 'Americana'],
            datasets: [{
                label: 'Cartera Actual',
                data: [850000, 650000, 450000, 350000, 200000],
                backgroundColor: ['#3498DB', '#2ECC71', '#F1C40F', '#E74C3C', '#9B59B6'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            height: 300,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    return new Chart(ctx, config);
}

function initPagosChart() {
    const ctx = document.getElementById('pagosCuotas');
    if (!ctx) return;

    const config = {
        type: 'bar',
        data: {
            labels: ['INCCA', 'San Camilo', 'CENDA', 'FIT', 'Americana'],
            datasets: [
                {
                    label: 'Cuota 1',
                    data: [100, 90, 85, 75, 70],
                    backgroundColor: '#3498DB'
                },
                {
                    label: 'Cuota 2',
                    data: [90, 85, 80, 70, 65],
                    backgroundColor: '#2ECC71'
                },
                {
                    label: 'Cuota 3',
                    data: [80, 75, 70, 65, 60],
                    backgroundColor: '#F1C40F'
                },
                {
                    label: 'Cuota 4',
                    data: [70, 65, 60, 55, 50],
                    backgroundColor: '#E74C3C'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            height: 300,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    };

    return new Chart(ctx, config);
}

function initTeamChart(team) {
    const ctx = document.getElementById(`equipo${team}`);
    if (!ctx) return;

    const data = team === 'Nicol' ? [75, 15, 10] : [82, 10, 8];
    
    const config = {
        type: 'doughnut',
        data: {
            labels: ['Completos', 'En Proceso', 'Pendientes'],
            datasets: [{
                data: data,
                backgroundColor: ['#2ECC71', '#F1C40F', '#E74C3C']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            height: 300,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    };

    return new Chart(ctx, config);
}

// Manejador de redimensionamiento
window.addEventListener('resize', () => {
    Chart.instances.forEach(chart => {
        chart.resize();
    });
});
