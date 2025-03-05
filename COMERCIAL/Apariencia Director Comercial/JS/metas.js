document.addEventListener('DOMContentLoaded', () => {
    const SUBSCRIPTION_PRICE = 195000;
    initializeCharts();
    loadGoalsData();
    setupEventListeners();
});

function initializeCharts() {
    new Chart(document.getElementById('teamProgressChart'), {
        type: 'bar',
        data: {
            labels: ['Equipo Diana', 'Equipo Nicol'],
            datasets: [{
                label: 'Progreso',
                data: [75, 82],
                backgroundColor: ['#2563eb', '#10b981']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    new Chart(document.getElementById('completionTrendChart'), {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Tendencia de Cumplimiento',
                data: [65, 70, 75, 80, 85, 82],
                borderColor: '#2563eb',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function loadGoalsData() {
    const mockData = {
        totalSalesGoal: 150,
        currentSales: 120,
        totalCollectionGoal: SUBSCRIPTION_PRICE * 150,
        currentCollections: SUBSCRIPTION_PRICE * 120,
        lastProjection: 85,
        teamsData: [
            {
                name: 'Equipo Diana',
                salesGoal: 80,
                currentSales: 65,
                collectionGoal: SUBSCRIPTION_PRICE * 80,
                currentCollections: SUBSCRIPTION_PRICE * 65
            },
            {
                name: 'Equipo Nicol',
                salesGoal: 70,
                currentSales: 55,
                collectionGoal: SUBSCRIPTION_PRICE * 70,
                currentCollections: SUBSCRIPTION_PRICE * 55
            }
        ]
    };

    updateDashboard(mockData);
}

function updateDashboard(data) {
    updateMetrics(data);
    updateGoalsTable(data.teamsData);
}

function updateMetrics(data) {
    document.getElementById('salesGoal').textContent = data.totalSalesGoal;
    document.getElementById('collectionGoal').textContent = 
        `$${(data.totalSalesGoal * SUBSCRIPTION_PRICE).toLocaleString()}`;

    const salesProgress = (data.currentSales / data.totalSalesGoal) * 100;
    const collectionProgress = (data.currentCollections / data.totalCollectionGoal) * 100;

    updateProgress('salesProgress', 'salesProgressLabel', salesProgress);
    updateProgress('collectionProgress', 'collectionProgressLabel', collectionProgress);

    const projection = calculateProjection(data);
    document.getElementById('projectedCompletion').textContent = `${projection}%`;
    document.getElementById('projectionTrend').textContent = 
        projection >= data.lastProjection ? '↑' : '↓';
}

function updateProgress(progressBarId, labelId, percentage) {
    document.getElementById(progressBarId).style.width = `${percentage}%`;
    document.getElementById(labelId).textContent = `${Math.round(percentage)}%`;
}

function calculateProjection(data) {
    const daysInMonth = 30;
    const currentDay = new Date().getDate();
    const dailyRate = data.currentSales / currentDay;
    const projectedTotal = dailyRate * daysInMonth;
    
    return Math.round((projectedTotal / data.totalSalesGoal) * 100);
}

function updateGoalsTable(teamsData) {
    const tbody = document.getElementById('goalsTableBody');
    tbody.innerHTML = '';

    teamsData.forEach(team => {
        const progress = (team.currentSales / team.salesGoal) * 100;
        const projection = calculateTeamProjection(team);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.salesGoal}</td>
            <td>${team.currentSales}</td>
            <td>$${(team.salesGoal * SUBSCRIPTION_PRICE).toLocaleString()}</td>
            <td>$${(team.currentSales * SUBSCRIPTION_PRICE).toLocaleString()}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                ${Math.round(progress)}%
            </td>
            <td>${projection}%</td>
        `;
        tbody.appendChild(row);
    });
}

function setupEventListeners() {
    document.getElementById('periodFilter').addEventListener('change', (e) => {
        loadGoalsData(e.target.value);
    });

    document.getElementById('adjustGoalBtn').addEventListener('click', openGoalModal);
    document.getElementById('goalForm').addEventListener('submit', handleGoalSubmit);
}

function openGoalModal() {
    document.getElementById('goalModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('goalModal').style.display = 'none';
}

function handleGoalSubmit(e) {
    e.preventDefault();
    
    const formData = {
        globalGoal: document.getElementById('newSalesGoal').value,
        teamDiana: document.getElementById('teamDianaGoal').value,
        teamNicol: document.getElementById('teamNicolGoal').value
    };

    console.log('Updating goals:', formData);
    closeModal();
    loadGoalsData();
}

function calculateTeamProjection(team) {
    const daysInMonth = 30;
    const currentDay = new Date().getDate();
    const dailyRate = team.currentSales / currentDay;
    const projectedTotal = dailyRate * daysInMonth;
    
    return Math.round((projectedTotal / team.salesGoal) * 100);
}