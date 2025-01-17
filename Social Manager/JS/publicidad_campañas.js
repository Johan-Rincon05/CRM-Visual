document.addEventListener('DOMContentLoaded', function() {
    // Enhanced data structure with detailed metrics
    let campaigns = [
        {
            id: 1,
            name: 'Campaña de Verano',
            objective: 'reach',
            platform: 'facebook',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            budget: 1000,
            status: 'active',
            spent: 450,
            leads: 127,
            metrics: {
                impressions: 50000,
                clicks: 2500,
                ctr: 5,
                cpc: 0.18,
                conversions: 127,
                conversionRate: 5.08
            },
            dailyData: generateDailyData('2024-01-01', '2024-01-31')
        }
    ];

    // Cache DOM elements
    const elements = {
        campaignsList: document.getElementById('activeCampaigns'),
        newCampaignBtn: document.getElementById('newCampaignBtn'),
        campaignForm: document.getElementById('campaignForm'),
        downloadReportBtn: document.getElementById('downloadReportBtn'),
        modals: {
            campaign: document.getElementById('campaignModal'),
            details: document.getElementById('detailsModal')
        },
        charts: {
            budget: document.getElementById('budgetChart'),
            leads: document.getElementById('leadsChart')
        }
    };

    // Initialize application
    initializeApp();

    function initializeApp() {
        initializeEventListeners();
        initializeCharts();
        renderCampaigns();
        initializeFilters();
        initializeTooltips();
    }

    function initializeEventListeners() {
        elements.newCampaignBtn.addEventListener('click', () => openModal('campaignModal'));
        elements.campaignForm.addEventListener('submit', handleNewCampaign);
        elements.downloadReportBtn.addEventListener('click', generateReport);
        
        elements.campaignForm.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', validateFormField);
        });

        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            openModal('campaignModal');
        }
        if (e.key === 'Escape') {
            closeAllModals();
        }
    }

    function initializeCharts() {
        const budgetChart = new Chart(elements.charts.budget.getContext('2d'), {
            type: 'bar',
            data: generateBudgetChartData(),
            options: getChartOptions('Presupuesto vs. Gasto')
        });

        const leadsChart = new Chart(elements.charts.leads.getContext('2d'), {
            type: 'line',
            data: generateLeadsChartData(),
            options: getChartOptions('Leads Generados')
        });

        // Store chart instances for later updates
        elements.charts.budgetInstance = budgetChart;
        elements.charts.leadsInstance = leadsChart;
    }

    function generateBudgetChartData() {
        return {
            labels: campaigns.map(c => c.name),
            datasets: [
                {
                    label: 'Presupuesto Total',
                    data: campaigns.map(c => c.budget),
                    backgroundColor: 'rgba(48, 79, 254, 0.2)',
                    borderColor: 'rgba(48, 79, 254, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Gasto Actual',
                    data: campaigns.map(c => c.spent),
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                }
            ]
        };
    }

    function generateLeadsChartData() {
        return {
            labels: campaigns.map(c => c.name),
            datasets: [{
                label: 'Leads Generados',
                data: campaigns.map(c => c.leads),
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                borderColor: 'rgba(33, 150, 243, 1)',
                borderWidth: 2,
                tension: 0.4
            }]
        };
    }

    function getChartOptions(title) {
        return {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${formatNumber(value)}`
                    }
                }
            }
        };
    }

    function handleNewCampaign(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newCampaign = {
            id: generateUniqueId(),
            name: formData.get('name'),
            objective: formData.get('objective'),
            platform: formData.get('platform'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            budget: parseFloat(formData.get('budget')),
            status: 'active',
            spent: 0,
            leads: 0,
            metrics: {
                impressions: 0,
                clicks: 0,
                ctr: 0,
                cpc: 0,
                conversions: 0,
                conversionRate: 0
            },
            dailyData: generateDailyData(formData.get('startDate'), formData.get('endDate'))
        };

        campaigns.push(newCampaign);
        renderCampaigns();
        updateCharts();
        closeModal('campaignModal');
        showNotification('Campaña creada exitosamente', 'success');
        e.target.reset();
    }

    function openCampaignDetails(campaignId) {
        const campaign = campaigns.find(c => c.id === campaignId);
        const detailsContainer = document.getElementById('campaignDetails');
        
        detailsContainer.innerHTML = generateCampaignDetailsHTML(campaign);
        
        initializeDetailCharts(campaign);
        openModal('detailsModal');
    }

    function generateCampaignDetailsHTML(campaign) {
        return `
            <div class="campaign-detail-header">
                <h3>${campaign.name}</h3>
                <span class="platform-badge platform-${campaign.platform}">
                    <i class="fab fa-${campaign.platform}"></i> ${getPlatformName(campaign.platform)}
                </span>
            </div>
            <div class="campaign-detail-metrics">
                <div class="metric-card">
                    <span class="metric-title">Presupuesto Total</span>
                    <span class="metric-value">$${formatNumber(campaign.budget)}</span>
                </div>
                <div class="metric-card">
                    <span class="metric-title">Gasto Actual</span>
                    <span class="metric-value">$${formatNumber(campaign.spent)}</span>
                </div>
                <div class="metric-card">
                    <span class="metric-title">Leads Generados</span>
                    <span class="metric-value">${formatNumber(campaign.leads)}</span>
                </div>
                <div class="metric-card">
                    <span class="metric-title">Costo por Lead</span>
                    <span class="metric-value">$${formatNumber(campaign.spent / campaign.leads || 0)}</span>
                </div>
            </div>
            <div class="campaign-detail-charts">
                <div class="chart-container">
                    <canvas id="dailyMetricsChart"></canvas>
                </div>
                <div class="chart-container">
                    <canvas id="conversionChart"></canvas>
                </div>
            </div>
            <div class="campaign-detail-table">
                <h4>Historial Diario</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Impresiones</th>
                            <th>Clicks</th>
                            <th>CTR</th>
                            <th>Conversiones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateDailyTableRows(campaign)}
                    </tbody>
                </table>
            </div>
        `;
    }

    function generateReport() {
        const campaign = campaigns.find(c => c.id === currentCampaignId);
        const reportContent = document.getElementById('campaignDetails');
        
        const options = {
            margin: 1,
            filename: `${campaign.name}-report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(reportContent).save();
        showNotification('Reporte generado exitosamente', 'success');
    }

    // Utility Functions
    function formatNumber(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    // Modal Management
    function openModal(modalId) {
        elements.modals[modalId].style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modalId) {
        elements.modals[modalId].style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function closeAllModals() {
        Object.keys(elements.modals).forEach(modalId => closeModal(modalId));
    }

    // Initialize tooltips
    function initializeTooltips() {
        tippy('[data-tippy-content]', {
            theme: 'custom',
            animation: 'scale',
            duration: 200
        });
    }

    // Export functionality for global access
    window.openCampaignDetails = openCampaignDetails;
    window.pauseCampaign = pauseCampaign;
    window.resumeCampaign = resumeCampaign;
    window.editCampaign = editCampaign;
});
