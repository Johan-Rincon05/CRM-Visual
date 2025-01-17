document.addEventListener('DOMContentLoaded', function() {
    // Enhanced data structure
    let campaigns = [];
    let currentCampaignId = null;

    // DOM Elements
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

    // Validation function
    function validateDOMElements() {
        return Object.values(elements).every(element => 
            element !== null && element !== undefined
        );
    }

    function openCampaignDetails(campaignId) {
        currentCampaignId = campaignId;
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
            populateDetailsModal(campaign);
            openModal('details');
        }
    }
    
    function validateFormField(event) {
        const input = event.target;
        const isValid = input.value.trim() !== '';
        input.classList.toggle('is-invalid', !isValid);
        return isValid;
    }
    
    function generateMetricsHTML(campaign) {
        return `
            <div class="metrics-grid">
                <div class="metric-item">
                    <h4>Impresiones</h4>
                    <p>${formatNumber(campaign.metrics.impressions)}</p>
                </div>
                <div class="metric-item">
                    <h4>Clicks</h4>
                    <p>${formatNumber(campaign.metrics.clicks)}</p>
                </div>
                <div class="metric-item">
                    <h4>CTR</h4>
                    <p>${campaign.metrics.ctr}%</p>
                </div>
                <div class="metric-item">
                    <h4>CPC</h4>
                    <p>$${campaign.metrics.cpc}</p>
                </div>
                <div class="metric-item">
                    <h4>Conversiones</h4>
                    <p>${formatNumber(campaign.metrics.conversions)}</p>
                </div>
                <div class="metric-item">
                    <h4>Tasa de Conversión</h4>
                    <p>${campaign.metrics.conversionRate}%</p>
                </div>
            </div>
        `;
    }
    
    function generateChartsHTML(campaign) {
        return `
            <div class="charts-container">
                <canvas id="campaignMetricsChart"></canvas>
                <canvas id="campaignProgressChart"></canvas>
            </div>
        `;
    }
    
    function generateDailyDataHTML(campaign) {
        return `
            <table class="daily-data-table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Impresiones</th>
                        <th>Clicks</th>
                        <th>Conversiones</th>
                    </tr>
                </thead>
                <tbody>
                    ${campaign.dailyData.map(day => `
                        <tr>
                            <td>${formatDate(day.date)}</td>
                            <td>${formatNumber(day.impressions)}</td>
                            <td>${formatNumber(day.clicks)}</td>
                            <td>${formatNumber(day.conversions)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    function populateDetailsModal(campaign) {
        const modal = elements.modals.details;
        modal.querySelector('.modal-title').textContent = campaign.name;
        modal.querySelector('.modal-body').innerHTML = `
            <div class="campaign-details">
                ${generateMetricsHTML(campaign)}
                ${generateChartsHTML(campaign)}
                ${generateDailyDataHTML(campaign)}
            </div>
        `;
    }
    


    // Initialize application
    function initializeApp() {
        if (!validateDOMElements()) {
            showErrorMessage('Error: Elementos necesarios no encontrados');
            return;
        }
        
        loadInitialData();
        initializeEventListeners();
        renderCampaigns();
        initializeCharts();
    }

    // Load initial data
    function loadInitialData() {
        campaigns = [
            {
                id: 1,
                name: 'Campaña de Verano 2024',
                objective: 'reach',
                platform: 'facebook',
                startDate: '2024-01-01',
                endDate: '2024-01-31',
                budget: 5000,
                status: 'active',
                spent: 2450,
                leads: 327,
                metrics: {
                    impressions: 150000,
                    clicks: 7500,
                    ctr: 5,
                    cpc: 0.18,
                    conversions: 327,
                    conversionRate: 4.36
                }
            },
            {
                id: 2,
                name: 'Google Ads Q1',
                objective: 'traffic',
                platform: 'google',
                startDate: '2024-01-15',
                endDate: '2024-03-15',
                budget: 8000,
                status: 'active',
                spent: 3200,
                leads: 425,
                metrics: {
                    impressions: 200000,
                    clicks: 9800,
                    ctr: 4.9,
                    cpc: 0.33,
                    conversions: 425,
                    conversionRate: 4.34
                }
            },
            {
                id: 3,
                name: 'Promoción Instagram',
                objective: 'conversions',
                platform: 'instagram',
                startDate: '2024-02-01',
                endDate: '2024-02-28',
                budget: 3000,
                status: 'paused',
                spent: 1800,
                leads: 156,
                metrics: {
                    impressions: 85000,
                    clicks: 4200,
                    ctr: 4.94,
                    cpc: 0.43,
                    conversions: 156,
                    conversionRate: 3.71
                }
            },
            {
                id: 4,
                name: 'LinkedIn B2B',
                objective: 'conversions',
                platform: 'linkedin',
                startDate: '2024-01-10',
                endDate: '2024-04-10',
                budget: 12000,
                status: 'active',
                spent: 4500,
                leads: 89,
                metrics: {
                    impressions: 45000,
                    clicks: 2800,
                    ctr: 6.22,
                    cpc: 1.61,
                    conversions: 89,
                    conversionRate: 3.18
                }
            }
        ];
    }
    
    

    // Event Listeners
    function initializeEventListeners() {
        elements.newCampaignBtn.addEventListener('click', () => openModal('campaign'));
        elements.campaignForm.addEventListener('submit', handleNewCampaign);
        elements.downloadReportBtn.addEventListener('click', generateReport);

        // Close modal buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => closeAllModals());
        });

        // Form validation
        elements.campaignForm.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('input', validateFormField);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
    }

    function handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            openModal('campaign');
        }
        if (e.key === 'Escape') {
            closeAllModals();
        }
    }

    // Render campaigns
    function renderCampaigns() {
        const campaignsHTML = campaigns.length ? 
            campaigns.map(campaign => createCampaignCard(campaign)).join('') :
            '<div class="empty-state">No hay campañas activas</div>';
        
        elements.campaignsList.innerHTML = campaignsHTML;
    }

    // Create campaign card
    function createCampaignCard(campaign) {
        return `
            <div class="campaign-card" data-id="${campaign.id}">
                <div class="campaign-header">
                    <h3>${campaign.name}</h3>
                    <span class="campaign-status status-${campaign.status}">
                        ${campaign.status.toUpperCase()}
                    </span>
                </div>
                <div class="campaign-metrics">
                    <div class="metric">
                        <span class="label">Presupuesto</span>
                        <span class="value">$${formatNumber(campaign.budget)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Gastado</span>
                        <span class="value">$${formatNumber(campaign.spent)}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Leads</span>
                        <span class="value">${formatNumber(campaign.leads)}</span>
                    </div>
                </div>
                <div class="campaign-actions">
                    <button onclick="openCampaignDetails(${campaign.id})" class="action-btn">
                        <i class="fas fa-chart-line"></i> Detalles
                    </button>
                    ${createStatusButton(campaign)}
                </div>
            </div>
        `;
    }

    // Initialize charts
    function initializeCharts() {
        try {
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

            elements.charts.budgetInstance = budgetChart;
            elements.charts.leadsInstance = leadsChart;
        } catch (error) {
            showErrorMessage('Error al inicializar los gráficos');
            console.error(error);
        }
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

    // Handle new campaign
    function handleNewCampaign(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if (!validateCampaignData(formData)) {
            showErrorMessage('Por favor complete todos los campos correctamente');
            return;
        }

        const newCampaign = createCampaignObject(formData);
        campaigns.push(newCampaign);
        
        renderCampaigns();
        updateCharts();
        closeModal('campaign');
        showSuccessMessage('Campaña creada exitosamente');
        e.target.reset();
    }

    function validateCampaignData(formData) {
        const requiredFields = ['name', 'objective', 'platform', 'startDate', 'endDate', 'budget'];
        return requiredFields.every(field => {
            const value = formData.get(field);
            return value && value.trim() !== '';
        });
    }

    function createCampaignObject(formData) {
        return {
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
            metrics: initializeMetrics(),
            dailyData: generateDailyData(formData.get('startDate'), formData.get('endDate'))
        };
    }

    function initializeMetrics() {
        return {
            impressions: 0,
            clicks: 0,
            ctr: 0,
            cpc: 0,
            conversions: 0,
            conversionRate: 0
        };
    }

    function generateDailyData(startDate, endDate) {
        const dailyData = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
            dailyData.push({
                date: new Date(date).toISOString().split('T')[0],
                impressions: Math.floor(Math.random() * 1000),
                clicks: Math.floor(Math.random() * 100),
                conversions: Math.floor(Math.random() * 10)
            });
        }
        return dailyData;
    }

    // Chart functions
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

    function updateCharts() {
        if (elements.charts.budgetInstance && elements.charts.leadsInstance) {
            elements.charts.budgetInstance.data = generateBudgetChartData();
            elements.charts.leadsInstance.data = generateLeadsChartData();
            
            elements.charts.budgetInstance.update();
            elements.charts.leadsInstance.update();
        }
    }

    // Campaign management functions
    function pauseCampaign(campaignId) {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
            campaign.status = 'paused';
            renderCampaigns();
            showSuccessMessage('Campaña pausada exitosamente');
        }
    }

    function resumeCampaign(campaignId) {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
            campaign.status = 'active';
            renderCampaigns();
            showSuccessMessage('Campaña reactivada exitosamente');
        }
    }

    function editCampaign(campaignId) {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (campaign) {
            populateEditForm(campaign);
            openModal('campaign');
        }
    }

    function populateEditForm(campaign) {
        const form = elements.campaignForm;
        Object.keys(campaign).forEach(key => {
            const input = form.elements[key];
            if (input) {
                input.value = campaign[key];
            }
        });
    }

    // Modal management
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

    // Report generation
    function generateReport() {
        const campaign = campaigns.find(c => c.id === currentCampaignId);
        if (!campaign) return;

        const reportContent = generateReportContent(campaign);
        
        const options = {
            margin: 1,
            filename: `${campaign.name}-report.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(options).from(reportContent).save()
            .then(() => showSuccessMessage('Reporte generado exitosamente'))
            .catch(error => showErrorMessage('Error al generar el reporte'));
    }

    function generateReportContent(campaign) {
        return `
            <div class="report-container">
                <h1>${campaign.name} - Reporte de Campaña</h1>
                <div class="report-metrics">
                    ${generateMetricsHTML(campaign)}
                </div>
                <div class="report-charts">
                    ${generateChartsHTML(campaign)}
                </div>
                <div class="report-daily-data">
                    ${generateDailyDataHTML(campaign)}
                </div>
            </div>
        `;
    }

    // Utility functions
    function formatNumber(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }

    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function showErrorMessage(message) {
        showNotification(message, 'error');
    }

    function showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    function createStatusButton(campaign) {
        return campaign.status === 'active' ?
            `<button onclick="pauseCampaign(${campaign.id})" class="action-btn warning">
                <i class="fas fa-pause"></i> Pausar
            </button>` :
            `<button onclick="resumeCampaign(${campaign.id})" class="action-btn success">
                <i class="fas fa-play"></i> Reactivar
            </button>`;
    }

    // Initialize the application
    initializeApp();

    // Export necessary functions to global scope
    window.openCampaignDetails = openCampaignDetails;
    window.pauseCampaign = pauseCampaign;
    window.resumeCampaign = resumeCampaign;
    window.editCampaign = editCampaign;
});
