document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    setupEventListeners();
});

const orientadores = [
    'Angie Villamor', 'Andrea Gonzalez', 'Andrea Meneses',
    'Alison Gutierrez', 'Johana Niño', 'Estefania Rodriguez',
    'Yuli Hernandez', 'Daniela Muñoz', 'Ada Rangel',
    'Naomi Mateus', 'Francy Cortes'
];

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000
    },
    plugins: {
        legend: {
            position: 'bottom'
        }
    }
};

function initializeCharts() {
    const salesChart = initializeSalesChart();
    const complianceChart = initializeComplianceChart();
    const leadsChart = initializeLeadsChart();
    const conversionChart = initializeConversionChart();

    return {
        salesChart,
        complianceChart,
        leadsChart,
        conversionChart
    };
}

function initializeSalesChart() {
    const ctx = document.getElementById('salesByAdvisorChart');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: orientadores,
            datasets: [{
                label: 'Ventas (Millones)',
                data: generateRandomData(orientadores.length, 20, 50),
                backgroundColor: '#E74C3C',
                borderRadius: 6
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Millones de Pesos'
                    }
                }
            }
        }
    });
}

function initializeComplianceChart() {
    const ctx = document.getElementById('documentComplianceChart');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completo', 'Pendiente', 'En Proceso'],
            datasets: [{
                data: [75, 15, 10],
                backgroundColor: ['#27AE60', '#E74C3C', '#F1C40F'],
                borderWidth: 0
            }]
        },
        options: {
            ...chartOptions,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function initializeLeadsChart() {
    const ctx = document.getElementById('leadsDistributionChart');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: orientadores,
            datasets: [{
                label: 'Leads Asignados',
                data: generateRandomData(orientadores.length, 50, 150),
                backgroundColor: '#3498DB',
                borderRadius: 6
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Leads'
                    }
                }
            }
        }
    });
}

function initializeConversionChart() {
    const ctx = document.getElementById('conversionRateChart');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: orientadores,
            datasets: [{
                label: 'Tasa de Conversión (%)',
                data: generateRandomData(orientadores.length, 10, 30),
                borderColor: '#27AE60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            ...chartOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Porcentaje de Conversión'
                    }
                }
            }
        }
    });
}

function generateRandomData(length, min, max) {
    return Array.from({length}, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

function setupEventListeners() {
    const filters = ['salesPeriodFilter', 'docComplianceFilter', 'leadsFilter', 'conversionFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', updateCharts);
        }
    });

    document.getElementById('periodSelector')?.addEventListener('change', updateAllData);
}

function updateCharts(event) {
    const filterId = event.target.id;
    const value = event.target.value;
    
    switch(filterId) {
        case 'salesPeriodFilter':
            updateSalesData(value);
            break;
        case 'docComplianceFilter':
            updateComplianceData(value);
            break;
        case 'leadsFilter':
            updateLeadsData(value);
            break;
        case 'conversionFilter':
            updateConversionData(value);
            break;
    }
}

function updateSalesData(period) {
    const newData = generateRandomData(orientadores.length, 20, 50);
    const charts = initializeCharts();
    if (charts.salesChart) {
        charts.salesChart.data.datasets[0].data = newData;
        charts.salesChart.update();
    }
}

function updateComplianceData(filter) {
    const newData = filter === 'all' ? [75, 15, 10] : generateRandomData(3, 0, 100);
    const charts = initializeCharts();
    if (charts.complianceChart) {
        charts.complianceChart.data.datasets[0].data = newData;
        charts.complianceChart.update();
    }
}

function updateLeadsData(filter) {
    const newData = generateRandomData(orientadores.length, 50, 150);
    const charts = initializeCharts();
    if (charts.leadsChart) {
        charts.leadsChart.data.datasets[0].data = newData;
        charts.leadsChart.update();
    }
}

function updateConversionData(filter) {
    const newData = generateRandomData(orientadores.length, 10, 30);
    const charts = initializeCharts();
    if (charts.conversionChart) {
        charts.conversionChart.data.datasets[0].data = newData;
        charts.conversionChart.update();
    }
}

function updateAllData() {
    const charts = initializeCharts();
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.data.datasets[0].data = generateRandomData(chart.data.labels.length, 10, 100);
            chart.update();
        }
    });
}
