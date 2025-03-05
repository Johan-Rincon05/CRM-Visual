document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadSalesData();
    setupEventListeners();
});

function initializeCharts() {
    // Team Sales Chart
    new Chart(document.getElementById('teamSalesChart'), {
        type: 'bar',
        data: {
            labels: ['Equipo Diana', 'Equipo Nicol'],
            datasets: [{
                label: 'Ventas',
                data: [65, 75],
                backgroundColor: ['#4CAF50', '#2196F3']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Conversion Chart
    new Chart(document.getElementById('conversionChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Conversión',
                data: [15, 18, 20, 22, 25, 28],
                borderColor: '#FF6600',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(255, 102, 0, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Followup vs Subscriptions Chart
    new Chart(document.getElementById('followupChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Seguimientos',
                    data: [120, 150, 180, 190, 210, 250],
                    borderColor: '#4CAF50',
                    tension: 0.4
                },
                {
                    label: 'Suscripciones',
                    data: [60, 75, 90, 95, 105, 125],
                    borderColor: '#2196F3',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Forms vs Subscriptions Chart
    new Chart(document.getElementById('formsChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Formularios',
                    data: [200, 250, 300, 320, 350, 400],
                    borderColor: '#9C27B0',
                    tension: 0.4
                },
                {
                    label: 'Suscripciones',
                    data: [60, 75, 90, 95, 105, 125],
                    borderColor: '#2196F3',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadSalesData() {
    // Simulated data
    const data = {
        totalSales: 87750000,
        conversionRate: 25,
        totalLeads: 850,
        teamsData: [
            {
                name: 'Equipo Diana',
                leads: 450,
                forms: 500,
                followups: 400,
                subscriptions: 250,
                conversionRate: 27
            },
            {
                name: 'Equipo Nicol',
                leads: 400,
                forms: 450,
                followups: 350,
                subscriptions: 200,
                conversionRate: 23
            }
        ]
    };

    updateDashboard(data);
}

function updateDashboard(data) {
    // Update metrics
    document.getElementById('totalSales').textContent = formatCurrency(data.totalSales);
    document.getElementById('conversionRate').textContent = `${data.conversionRate}%`;
    document.getElementById('totalLeads').textContent = data.totalLeads.toLocaleString();

    // Update table
    updateTeamsTable(data.teamsData);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function updateTeamsTable(teamsData) {
    const tbody = document.getElementById('teamsTableBody');
    tbody.innerHTML = '';

    teamsData.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.leads}</td>
            <td>${team.forms}</td>
            <td>${team.followups}</td>
            <td>${team.subscriptions}</td>
            <td>${team.conversionRate}%</td>
        `;
        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    document.getElementById('periodFilter').addEventListener('change', (e) => {
        loadSalesData(e.target.value);
    });
}