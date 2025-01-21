document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    initializeCharts();
    
    // Load Initial Data
    loadPersonnelData();
    loadTasksData();
    
    // Event Listeners
    document.getElementById('newTaskBtn').addEventListener('click', openTaskModal);
    document.querySelector('.close-modal').addEventListener('click', closeTaskModal);
    document.getElementById('newTaskForm').addEventListener('submit', handleNewTask);
});

function initializeCharts() {
    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Rendimiento',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#DD1A00',
                tension: 0.1
            }]
        }
    });

    // Tasks Chart
    const tasksCtx = document.getElementById('tasksChart').getContext('2d');
    new Chart(tasksCtx, {
        type: 'doughnut',
        data: {
            labels: ['Completadas', 'En Progreso', 'Pendientes'],
            datasets: [{
                data: [300, 50, 100],
                backgroundColor: ['#4CAF50', '#FFC107', '#DD1A00']
            }]
        }
    });
}

function loadPersonnelData() {
    // Simulated personnel data
    const personnel = [
        { name: 'Juan Pérez', role: 'Gerente', status: 'Activo', lastAccess: '2024-01-20 10:30' },
        { name: 'María García', role: 'Administrativo', status: 'Activo', lastAccess: '2024-01-20 09:15' }
    ];

    const tbody = document.getElementById('personnelTableBody');
    tbody.innerHTML = personnel.map(person => `
        <tr>
            <td>${person.name}</td>
            <td>${person.role}</td>
            <td><span class="status-badge ${person.status.toLowerCase()}">${person.status}</span></td>
            <td>${person.lastAccess}</td>
            <td>
                <button class="action-btn" onclick="notifyUser('${person.name}')">Notificar</button>
            </td>
        </tr>
    `).join('');
}

function loadTasksData() {
    // Simulated tasks data
    const tasks = [
        {
            title: 'Revisión de documentos',
            area: 'Administrativa',
            dueDate: '2024-01-25',
            priority: 'Alta',
            status: 'En Progreso'
        }
    ];

    const container = document.getElementById('activeTasksContainer');
    container.innerHTML = tasks.map(task => `
        <div class="task-card">
            <h4>${task.title}</h4>
            <p>Área: ${task.area}</p>
            <p>Vencimiento: ${task.dueDate}</p>
            <p>Prioridad: ${task.priority}</p>
            <p>Estado: ${task.status}</p>
        </div>
    `).join('');
}

function openTaskModal() {
    document.getElementById('taskModal').style.display = 'block';
}

function closeTaskModal() {
    document.getElementById('taskModal').style.display = 'none';
}

function handleNewTask(e) {
    e.preventDefault();
    // Handle task creation logic here
    closeTaskModal();
}

function notifyUser(userName) {
    alert(`Notificación enviada a ${userName}`);
}
