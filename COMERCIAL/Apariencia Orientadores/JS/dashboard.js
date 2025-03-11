document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
});

function initializeCharts() {
    initializeSalesChart();
    initializeConversionChart();
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Cantidad de Ventas 2024',
                data: [45, 52, 38, 65, 48, 63, 72, 58, 80, 85, 92, 98],
                borderColor: '#4CAF50',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(76, 175, 80, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${value} ventas`
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            }
        }
    });
}

function initializeConversionChart() {
    const ctx = document.getElementById('conversionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Suscripciones', 'Seguimiento', 'No Interesados'],
            datasets: [{
                data: [65, 25, 10],
                backgroundColor: [
                    '#4CAF50',
                    '#FFC107',
                    '#FF5252'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

window.addEventListener('resize', () => {
    const mainContent = document.querySelector('.main-content');
    mainContent.style.width = '100%';
});