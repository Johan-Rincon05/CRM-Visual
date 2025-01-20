document.addEventListener('DOMContentLoaded', () => {
    loadSalesData();
    initializeCharts();
});

async function loadSalesData() {
    try {
        const response = await fetch('../api/sales-data.php');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error loading sales data:', error);
    }
}

function updateDashboard(data) {
    // Update metrics
    document.getElementById('totalSales').textContent = `$${data.totalSales.toLocaleString()}`;
    document.getElementById('conversionRate').textContent = `${data.conversionRate}%`;
    document.getElementById('totalLeads').textContent = data.totalLeads.toLocaleString();
    
    // Update table
    updateTeamsTable(data.teamsData);
    
    // Update charts
    updateCharts(data);
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

function initializeCharts() {
    // Team Sales Chart
    new Chart(document.getElementById('teamSalesChart'), {
        type: 'bar',
        data: {
            labels: ['Equipo Diana', 'Equipo Nicol'],
            datasets: [{
                label: 'Ventas',
                data: [],
                backgroundColor: ['#4CAF50', '#2196F3']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Other charts initialization...
}
