document.addEventListener('DOMContentLoaded', () => {
    // Global Chart Configuration
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.plugins.legend.position = 'bottom';
    
    // Color Palette
    const colors = {
        primary: '#3498db',
        success: '#2ecc71',
        warning: '#f1c40f',
        danger: '#AE2809',
        red: '#AE2809',
        orange: '#e67e22'
    };

    // Integrated Mock Data
    const data = {
        revenue: {
            labels: ['INCCA', 'Americana', 'San Camilo'],
            data: [450, 380, 290]
        },
        payments: {
            labels: ['Pagado', 'Pendiente', 'Atrasado'],
            data: [65, 25, 10]
        },
        leads: {
            labels: ['Email', 'Social Media', 'Referidos', 'Orgánico', 'Google Ads'],
            data: [120, 200, 150, 80, 175]
        },
        conversion: {
            labels: ['Angie Villamor', 'Diego Ruiz', 'Francy Cortes', 'Alison Gutierrez', 'Andrea Gonzalez'],
            data: [75, 68, 82, 65, 70]
        },
        enrollment: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
            data: [65, 78, 90, 85, 95, 110, 125, 130, 142]
        },
        nomina: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            salarios: [250, 255, 260, 265, 270, 275],
            prestaciones: [100, 102, 104, 106, 108, 110]
        },
        roi: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            data: [150, 180, 165, 195, 210, 225]
        },
        paymentStatus: {
            labels: ['INCCA', 'Americana', 'San Camilo'],
            alDia: [80, 75, 85],
            enMora: [20, 25, 15]
        }
    };

    // Initialize Charts
    new Chart(document.getElementById('revenueChart'), {
        type: 'bar',
        data: {
            labels: data.revenue.labels,
            datasets: [{
                label: 'Ingresos (Millones COP)',
                data: data.revenue.data,
                backgroundColor: [colors.primary, colors.success, colors.warning],
                borderRadius: 6
            }]
        }
    });

    new Chart(document.getElementById('paymentsChart'), {
        type: 'doughnut',
        data: {
            labels: data.payments.labels,
            datasets: [{
                data: data.payments.data,
                backgroundColor: [colors.success, colors.warning, colors.danger],
                borderWidth: 0
            }]
        },
        options: {
            cutout: '60%'
        }
    });

    new Chart(document.getElementById('leadsChart'), {
        type: 'bar',
        data: {
            labels: data.leads.labels,
            datasets: [{
                label: 'Leads por Canal',
                data: data.leads.data,
                backgroundColor: colors.red,
                borderRadius: 6
            }]
        }
    });

    new Chart(document.getElementById('conversionChart'), {
        type: 'bar',
        data: {
            labels: data.conversion.labels,
            datasets: [{
                label: 'Tasa de Conversión (%)',
                data: data.conversion.data,
                backgroundColor: colors.red,
                borderRadius: 6
            }]
        },
        options: {
            indexAxis: 'y'
        }
    });

    new Chart(document.getElementById('enrollmentChart'), {
        type: 'line',
        data: {
            labels: data.enrollment.labels,
            datasets: [{
                label: 'Inscripciones 2024',
                data: data.enrollment.data,
                borderColor: colors.red,
                tension: 0.4,
                fill: true,
                backgroundColor: `${colors.red}20`
            }]
        }
    });

    new Chart(document.getElementById('nominaChart'), {
        type: 'bar',
        data: {
            labels: data.nomina.labels,
            datasets: [{
                label: 'Salarios',
                data: data.nomina.salarios,
                backgroundColor: colors.red
            }, {
                label: 'Prestaciones',
                data: data.nomina.prestaciones,
                backgroundColor: colors.primary
            }]
        },
        options: {
            stacked: true
        }
    });

    new Chart(document.getElementById('roiChart'), {
        type: 'line',
        data: {
            labels: data.roi.labels,
            datasets: [{
                label: 'ROI Marketing (%)',
                data: data.roi.data,
                borderColor: colors.red,
                tension: 0.4
            }]
        }
    });

    new Chart(document.getElementById('paymentStatusChart'), {
        type: 'bar',
        data: {
            labels: data.paymentStatus.labels,
            datasets: [{
                label: 'Al día',
                data: data.paymentStatus.alDia,
                backgroundColor: colors.success
            }, {
                label: 'En mora',
                data: data.paymentStatus.enMora,
                backgroundColor: colors.danger
            }]
        },
        options: {
            stacked: true
        }
    });

    // Event Listeners for Filters
    const areaFilter = document.getElementById('areaFilter');
    const filterBtn = document.querySelector('.filter-btn');
    
    areaFilter.addEventListener('change', updateDashboard);
    filterBtn.addEventListener('click', applyFilters);

    function updateDashboard() {
        const selectedArea = areaFilter.value;
        updateChartsVisibility(selectedArea);
    }

    function applyFilters() {
        const startDate = document.querySelector('.styled-date').value;
        const endDate = document.querySelectorAll('.styled-date')[1].value;
        console.log('Applying filters:', { startDate, endDate });
    }

    function updateChartsVisibility(area) {
        const chartCards = document.querySelectorAll('.chart-card');
        chartCards.forEach(card => {
            if (area === 'all' || card.dataset.area === area) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});
