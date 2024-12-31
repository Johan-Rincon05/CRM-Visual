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

// Window Resize Handler
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('collapsed');
        mainContent.style.marginLeft = '70px';
    }
});
