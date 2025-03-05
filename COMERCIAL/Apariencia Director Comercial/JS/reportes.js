document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadReportData();
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

    // Forms vs Leads Chart
    new Chart(document.getElementById('formsLeadsChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Formularios',
                    data: [120, 150, 180, 190, 210, 250],
                    borderColor: '#4CAF50',
                    tension: 0.4
                },
                {
                    label: 'Leads',
                    data: [100, 130, 150, 170, 190, 220],
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

    // Lost Leads Chart
    new Chart(document.getElementById('lostLeadsChart'), {
        type: 'doughnut',
        data: {
            labels: ['No Responde', 'No Interesa', 'Equivocado'],
            datasets: [{
                data: [45, 30, 25],
                backgroundColor: ['#FFC107', '#FF5722', '#9C27B0']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Sales Trend Chart
    new Chart(document.getElementById('salesTrendChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ventas',
                data: [65, 70, 80, 85, 90, 95],
                borderColor: '#2196F3',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(33, 150, 243, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function loadReportData() {
    // Simulated data
    const data = {
        totalSubscriptions: 450,
        totalLeads: 850,
        totalCollections: 87750000,
        salesAverage: 75,
        teamsData: [
            {
                team: 'Equipo Diana',
                subscriptions: 250,
                leads: 450,
                forms: 500,
                noResponse: 25,
                notInterested: 15,
                wrong: 10,
                collection: 48750000
            },
            {
                team: 'Equipo Nicol',
                subscriptions: 200,
                leads: 400,
                forms: 450,
                noResponse: 20,
                notInterested: 15,
                wrong: 15,
                collection: 39000000
            }
        ]
    };

    updateDashboard(data);
}

function updateDashboard(data) {
    // Update metrics
    document.getElementById('totalSubscriptions').textContent = data.totalSubscriptions;
    document.getElementById('totalLeads').textContent = data.totalLeads;
    document.getElementById('totalCollections').textContent = formatCurrency(data.totalCollections);
    document.getElementById('salesAverage').textContent = `${data.salesAverage}%`;

    // Update table
    updateReportTable(data.teamsData);
}

function updateReportTable(teamsData) {
    const tbody = document.getElementById('reportTableBody');
    tbody.innerHTML = '';

    teamsData.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.team}</td>
            <td>${team.subscriptions}</td>
            <td>${team.leads}</td>
            <td>${team.forms}</td>
            <td>${team.noResponse}</td>
            <td>${team.notInterested}</td>
            <td>${team.wrong}</td>
            <td>${formatCurrency(team.collection)}</td>
        `;
        tbody.appendChild(row);
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function setupEventListeners() {
    document.getElementById('periodFilter').addEventListener('change', (e) => {
        loadReportData(e.target.value);
    });

    document.getElementById('downloadPDF').addEventListener('click', generatePDF);
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const content = document.querySelector('.main-content');
    
    try {
        const canvas = await html2canvas(content, {
            scale: 1,
            useCORS: true,
            logging: false
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('reporte_comercial.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}