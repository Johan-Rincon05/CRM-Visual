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
                data: [],
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
            labels: [],
            datasets: [
                {
                    label: 'Formularios',
                    data: [],
                    borderColor: '#4CAF50'
                },
                {
                    label: 'Leads',
                    data: [],
                    borderColor: '#2196F3'
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
                data: [],
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
            labels: [],
            datasets: [{
                label: 'Ventas',
                data: [],
                borderColor: '#2196F3',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

async function loadReportData() {
    try {
        const response = await fetch('../api/report-data.php');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error loading report data:', error);
    }
}

function updateDashboard(data) {
    // Update metrics
    document.getElementById('totalSubscriptions').textContent = data.totalSubscriptions;
    document.getElementById('totalLeads').textContent = data.totalLeads;
    document.getElementById('totalCollections').textContent = `$${data.totalCollections.toLocaleString()}`;
    document.getElementById('salesAverage').textContent = data.salesAverage;

    // Update charts with new data
    updateCharts(data);
    
    // Update table
    updateReportTable(data.teamsData);
}

function setupEventListeners() {
    document.getElementById('periodFilter').addEventListener('change', (e) => {
        loadReportData(e.target.value);
    });

    document.getElementById('downloadPDF').addEventListener('click', generatePDF);
}

async function generatePDF() {
    const doc = new jsPDF();
    const content = document.querySelector('.main-content');
    
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');
    
    doc.addImage(imgData, 'PNG', 10, 10, 190, 280);
    doc.save('reporte_comercial.pdf');
}
