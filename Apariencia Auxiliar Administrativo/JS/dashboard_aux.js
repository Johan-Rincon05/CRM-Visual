// Global state control
let chartsInitialized = false;
let globalCharts = {};
const CHART_LOAD_TIMEOUT = 3000;

document.addEventListener('DOMContentLoaded', () => {
    const dashboardState = {
        charts: {},
        updateCount: 0,
        lastUpdate: new Date()
    };
    initializeDashboard(dashboardState);
});

function initializeDashboard(state) {
    initializeMetrics();
    if (!chartsInitialized) {
        showChartLoaders();
        setTimeout(() => {
            state.charts = initializeCharts();
            chartsInitialized = true;
            hideChartLoaders();
        }, 1000);
    }
    setupRealTimeUpdates();
    setupReportGenerator();
    setupDateFilters();
    setupInstitutionFilter();
    setupChartRefreshButtons();
}

function initializeMetrics() {
    const metrics = {
        totalApplicants: { start: 0, end: 1234, duration: 2000 },
        completeDocuments: { start: 0, end: 85, duration: 2000 },
        conversionRate: { start: 0, end: 68, duration: 2000 },
        pendingReview: { start: 0, end: 45, duration: 2000 }
    };

    Object.entries(metrics).forEach(([id, config]) => {
        updateMetricWithAnimation(id, config.start, config.end, config.duration);
    });
}

function updateMetricWithAnimation(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const startTime = performance.now();
    const updateFrame = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const value = Math.round(start + (end - start) * easeOutQuart(progress));
        element.textContent = value.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateFrame);
        }
    };
    
    requestAnimationFrame(updateFrame);
}


function createApplicantStatusChart() {
    const ctx = document.getElementById('applicantStatus')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [{
                label: 'Aspirantes Activos',
                data: [65, 75, 82, 78, 90],
                backgroundColor: 'rgba(57, 73, 171, 0.8)',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Change to true
            aspectRatio: 2, // Add this line
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}


function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

function showChartLoaders() {
    document.querySelectorAll('.loading-overlay').forEach(loader => {
        loader.classList.add('active');
    });
}

function hideChartLoaders() {
    document.querySelectorAll('.loading-overlay').forEach(loader => {
        loader.classList.remove('active');
    });
}

function initializeCharts() {
    Object.values(globalCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });

    globalCharts = {
        documentProgress: createDocumentProgressChart(),
        applicantStatus: createApplicantStatusChart(),
        admissionTrend: createAdmissionTrendChart()
    };

    setTimeout(() => {
        hideChartLoaders();
    }, CHART_LOAD_TIMEOUT);

    return globalCharts;
}

function createDocumentProgressChart() {
    const ctx = document.getElementById('documentProgress')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completo', 'Sin Completar', 'Sin Documentos'],
            datasets: [{
                data: [65, 20, 15],
                backgroundColor: [
                    'rgba(67, 160, 71, 0.8)',
                    'rgba(253, 216, 53, 0.8)',
                    'rgba(229, 57, 53, 0.8)'
                ],
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeOutQuart'
            }
        }
    });
}

function createApplicantStatusChart() {
    const ctx = document.getElementById('applicantStatus')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [{
                label: 'Aspirantes Activos',
                data: [65, 75, 82, 78, 90],
                backgroundColor: 'rgba(57, 73, 171, 0.8)',
                borderRadius: 6
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
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createAdmissionTrendChart() {
    const ctx = document.getElementById('admissionTrend')?.getContext('2d');
    if (!ctx) return null;

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Admisiones',
                data: [30, 45, 55, 60, 75, 85],
                borderColor: 'rgba(67, 160, 71, 0.8)',
                backgroundColor: 'rgba(67, 160, 71, 0.1)',
                tension: 0.4,
                fill: true
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
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateChartData(chartId, newData) {
    const chart = globalCharts[chartId];
    if (chart && chart.data && chart.data.datasets) {
        chart.data.datasets[0].data = newData;
        chart.update();
    }
}

function setupRealTimeUpdates() {
    const updatesFeed = document.getElementById('updatesFeed');
    const updateCount = document.getElementById('updateCount');
    if (!updatesFeed || !updateCount) return;

    let count = 0;
    const updates = [
        'Nuevo aspirante registrado: Juan Pérez',
        'Documentación completada: María García',
        'Entrevista programada: Carlos López',
        'Pago procesado: Ana Martínez',
        'Documentos verificados: Luis Rodriguez'
    ];

    setInterval(() => {
        const update = createUpdateElement(updates[Math.floor(Math.random() * updates.length)]);
        updatesFeed.insertBefore(update, updatesFeed.firstChild);
        count++;
        updateCount.textContent = count;

        if (updatesFeed.children.length > 50) {
            updatesFeed.removeChild(updatesFeed.lastChild);
        }
    }, 5000);
}

function createUpdateElement(message) {
    const updateElement = document.createElement('div');
    updateElement.className = 'update-item';
    updateElement.innerHTML = `
        <span class="update-time">${new Date().toLocaleTimeString()}</span>
        <p class="update-message">${message}</p>
    `;
    return updateElement;
}

function setupReportGenerator() {
    const generateReportBtn = document.getElementById('generateReport');
    if (!generateReportBtn) return;

    generateReportBtn.addEventListener('click', () => {
        const reportType = document.getElementById('reportType')?.value || 'default';
        generateReport(reportType);
    });
}

function generateReport(type) {
    showLoading('Generando informe...');
    
    setTimeout(() => {
        const recentReports = document.getElementById('recentReports');
        if (!recentReports) {
            hideLoading();
            return;
        }

        const reportElement = document.createElement('div');
        reportElement.className = 'report-item';
        reportElement.innerHTML = `
            <div class="report-info">
                <span class="report-name">Informe ${type}</span>
                <span class="report-date">${new Date().toLocaleDateString()}</span>
            </div>
            <a href="#" class="report-download">
                <i class="fas fa-download"></i>
            </a>
        `;
        
        recentReports.insertBefore(reportElement, recentReports.firstChild);
        hideLoading();
    }, 1500);
}

function setupDateFilters() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate && endDate) {
        startDate.valueAsDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        endDate.valueAsDate = new Date();

        [startDate, endDate].forEach(input => {
            input.addEventListener('change', () => refreshDashboardData());
        });
    }
}

function setupInstitutionFilter() {
    const institutionSelect = document.getElementById('institutionSelect');
    if (institutionSelect) {
        institutionSelect.addEventListener('change', () => refreshDashboardData());
    }
}

function setupChartRefreshButtons() {
    document.querySelectorAll('.refresh-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const chartContainer = e.target.closest('.chart-container');
            if (chartContainer) {
                refreshChart(chartContainer);
            }
        });
    });
}

function refreshChart(container) {
    const loaderId = container.querySelector('.loading-overlay')?.id;
    if (!loaderId) return;

    const loader = document.getElementById(loaderId);
    if (loader) {
        loader.classList.add('active');
        
        setTimeout(() => {
            loader.classList.remove('active');
            const chartId = container.querySelector('canvas')?.id;
            if (chartId && globalCharts[chartId]) {
                const newData = generateRandomData(chartId);
                updateChartData(chartId, newData);
            }
        }, 1500);
    }
}

function showLoading(message = 'Cargando...') {
    document.querySelectorAll('.loading-overlay').forEach(loader => {
        loader.classList.add('active');
    });
}

function hideLoading() {
    document.querySelectorAll('.loading-overlay').forEach(loader => {
        loader.classList.remove('active');
    });
}

function refreshDashboardData() {
    showLoading();
    
    setTimeout(() => {
        initializeMetrics();
        Object.keys(globalCharts).forEach(chartId => {
            const newData = generateRandomData(chartId);
            updateChartData(chartId, newData);
        });
        hideLoading();
    }, 1500);
}

function generateRandomData(chartId) {
    return Array.from({length: 6}, () => Math.floor(Math.random() * 100));
}
