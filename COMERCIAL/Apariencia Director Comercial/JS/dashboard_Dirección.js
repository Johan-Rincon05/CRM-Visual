// Main Dashboard Initialization
document.addEventListener('DOMContentLoaded', () => {
    initializeSidebar();
    initializeUserMenu();
    initializeCharts();
});

// Sidebar Functionality
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '70px' : '260px';
    });

    // Set active menu item
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
}

// User Menu Functionality
function initializeUserMenu() {
    const userInfo = document.getElementById('userInfo');
    const userMenu = document.getElementById('userMenu');
    const dropdownIcon = userInfo.querySelector('.dropdown-icon');

    userInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
        dropdownIcon.style.transform = userMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    });

    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
            dropdownIcon.style.transform = 'rotate(0)';
        }
    });
}

// Charts Initialization
function initializeCharts() {
    initializeTeamSalesChart();
    initializeTopProgramsChart();
    initializeSalesTrendChart();
    initializeConversionRateChart();
}

function initializeTeamSalesChart() {
    const ctx = document.getElementById('teamSalesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4'],
            datasets: [{
                label: 'Ventas por Equipo',
                data: [450, 380, 320, 290],
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}M`
                    }
                }
            }
        }
    });
}

function initializeTopProgramsChart() {
    const ctx = document.getElementById('topProgramsChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ing. Sistemas', 'Psicología', 'Ing. Industrial', 'Educación', 'Otros'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#FF5722'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '70%'
        }
    });
}

function initializeSalesTrendChart() {
    const ctx = document.getElementById('salesTrendChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Ventas Totales',
                data: [320, 420, 380, 450, 480, 520],
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
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value}M`
                    }
                }
            }
        }
    });
}

function initializeConversionRateChart() {
    const ctx = document.getElementById('conversionRateChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo 4'],
            datasets: [{
                label: 'Tasa de Conversión',
                data: [65, 59, 80, 70],
                backgroundColor: '#2196F3',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `${value}%`
                    }
                }
            }
        }
    });
}

// Window Resize Handler
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.style.marginLeft = '0';
    } else {
        mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '70px' : '260px';
    }
});
