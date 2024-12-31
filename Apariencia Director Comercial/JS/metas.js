document.addEventListener('DOMContentLoaded', () => {
    const SUBSCRIPTION_PRICE = 195000;
    initializeCharts();
    loadGoalsData();
    setupEventListeners();
});

function initializeCharts() {
    // Team Progress Chart
    new Chart(document.getElementById('teamProgressChart'), {
        type: 'bar',
        data: {
            labels: ['Equipo Diana', 'Equipo Nicol'],
            datasets: [{
                label: 'Progreso',
                data: [],
                backgroundColor: ['#4CAF50', '#2196F3']
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

    // Completion Trend Chart
    new Chart(document.getElementById('completionTrendChart'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Tendencia de Cumplimiento',
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

async function loadGoalsData() {
    try {
        const response = await fetch('../api/goals-data.php');
        const data = await response.json();
        updateDashboard(data);
    } catch (error) {
        console.error('Error loading goals data:', error);
    }
}

function updateDashboard(data) {
    // Update metrics
    updateMetrics(data);
    // Update charts
    updateCharts(data);
    // Update table
    updateGoalsTable(data.teamsData);
}

function updateMetrics(data) {
    const salesGoal = document.getElementById('salesGoal');
    const collectionGoal = document.getElementById('collectionGoal');
    const projectedCompletion = document.getElementById('projectedCompletion');
    
    salesGoal.textContent = data.totalSalesGoal;
    collectionGoal.textContent = `$${(data.totalSalesGoal * SUBSCRIPTION_PRICE).toLocaleString()}`;
    
    // Update progress bars
    updateProgress('salesProgress', 'salesProgressLabel', 
        (data.currentSales / data.totalSalesGoal) * 100);
    updateProgress('collectionProgress', 'collectionProgressLabel',
        (data.currentCollections / (data.totalSalesGoal * SUBSCRIPTION_PRICE)) * 100);
    
    // Update projection
    const projection = calculateProjection(data);
    projectedCompletion.textContent = `${projection}%`;
    document.getElementById('projectionTrend').textContent = 
        projection >= data.lastProjection ? '↑' : '↓';
}

function updateProgress(progressBarId, labelId, percentage) {
    const progressBar = document.getElementById(progressBarId);
    const label = document.getElementById(labelId);
    
    progressBar.style.width = `${percentage}%`;
    label.textContent = `${Math.round(percentage)}%`;
}

function calculateProjection(data) {
    const daysInPeriod = 30; // Adjust based on selected period
    const currentDay = new Date().getDate();
    const dailyRate = data.currentSales / currentDay;
    const projectedTotal = dailyRate * daysInPeriod;
    
    return Math.round((projectedTotal / data.totalSalesGoal) * 100);
}

function updateGoalsTable(teamsData) {
    const tbody = document.getElementById('goalsTableBody');
    tbody.innerHTML = '';
    
    teamsData.forEach(team => {
        const row = document.createElement('tr');
        const progress = (team.currentSales / team.salesGoal) * 100;
        const projection = calculateTeamProjection(team);
        
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

async function handleGoalSubmit(e) {
    e.preventDefault();
    
    const formData = {
        globalGoal: document.getElementById('newSalesGoal').value,
        teamDiana: document.getElementById('teamDianaGoal').value,
        teamNicol: document.getElementById('teamNicolGoal').value
    };

    try {
        const response = await fetch('../api/update-goals.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            closeModal();
            loadGoalsData();
        }
    } catch (error) {
        console.error('Error updating goals:', error);
    }
}

function calculateTeamProjection(team) {
    const daysInPeriod = 30;
    const currentDay = new Date().getDate();
    const dailyRate = team.currentSales / currentDay;
    const projectedTotal = dailyRate * daysInPeriod;
    
    return Math.round((projectedTotal / team.salesGoal) * 100);
}
