document.addEventListener('DOMContentLoaded', function() {
    let adsData = [
        {
            name: 'Campaña Verano 2024',
            date: '2024-01-15',
            platform: 'facebook',
            reach: 50000,
            engagement: 4.5,
            leads: 250,
            subscriptions: 75,
            investment: 500,
            roi: 280
        },
        {
            name: 'Promoción Especial',
            date: '2024-01-20',
            platform: 'instagram',
            reach: 35000,
            engagement: 5.2,
            leads: 180,
            subscriptions: 45,
            investment: 300,
            roi: 320
        }
    ];

    // Initialize Charts
    const effectivenessCtx = document.getElementById('effectivenessChart').getContext('2d');
    const roiCtx = document.getElementById('roiChart').getContext('2d');

    const effectivenessChart = new Chart(effectivenessCtx, {
        type: 'bar',
        data: {
            labels: adsData.map(ad => ad.name),
            datasets: [
                {
                    label: 'Leads',
                    data: adsData.map(ad => ad.leads),
                    backgroundColor: '#8505A0'
                },
                {
                    label: 'Suscripciones',
                    data: adsData.map(ad => ad.subscriptions),
                    backgroundColor: '#10b981'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });

    const roiChart = new Chart(roiCtx, {
        type: 'bar',
        data: {
            labels: ['Facebook', 'Instagram', 'LinkedIn'],
            datasets: [{
                label: 'ROI %',
                data: [280, 320, 250],
                backgroundColor: '#8505A0'
            }]
        },
        options: {
            responsive: true
        }
    });

    // Render Ads Table
    function renderAdsTable(data) {
        const tableBody = document.getElementById('adsTableBody');
        tableBody.innerHTML = data.map(ad => `
            <tr>
                <td>${ad.name}</td>
                <td>${formatDate(ad.date)}</td>
                <td>${formatPlatform(ad.platform)}</td>
                <td>${formatNumber(ad.reach)}</td>
                <td>${ad.engagement}%</td>
                <td>${formatNumber(ad.leads)}</td>
                <td>${formatNumber(ad.subscriptions)}</td>
                <td>${ad.roi}%</td>
                <td>
                    <button onclick="showAdDetails('${ad.name}')" class="action-btn">
                        Ver detalles
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Format helpers
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES');
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('es-ES').format(num);
    }

    function formatPlatform(platform) {
        const platforms = {
            facebook: 'Facebook',
            instagram: 'Instagram',
            linkedin: 'LinkedIn'
        };
        return platforms[platform] || platform;
    }

    // Filter functionality
    function filterAds() {
        const platform = document.getElementById('platformFilter').value;
        const period = document.getElementById('periodFilter').value;
        const content = document.getElementById('contentFilter').value;

        let filteredData = [...adsData];

        if (platform !== 'all') {
            filteredData = filteredData.filter(ad => ad.platform === platform);
        }

        // Add period and content filtering logic here

        renderAdsTable(filteredData);
        updateCharts(filteredData);
    }

    // Update charts with filtered data
    function updateCharts(data) {
        effectivenessChart.data.labels = data.map(ad => ad.name);
        effectivenessChart.data.datasets[0].data = data.map(ad => ad.leads);
        effectivenessChart.data.datasets[1].data = data.map(ad => ad.subscriptions);
        effectivenessChart.update();

        // Update ROI chart
        const roiByPlatform = calculateRoiByPlatform(data);
        roiChart.data.datasets[0].data = Object.values(roiByPlatform);
        roiChart.update();
    }

    function calculateRoiByPlatform(data) {
        const roiByPlatform = {};
        data.forEach(ad => {
            if (!roiByPlatform[ad.platform]) {
                roiByPlatform[ad.platform] = [];
            }
            roiByPlatform[ad.platform].push(ad.roi);
        });

        return Object.keys(roiByPlatform).reduce((acc, platform) => {
            const rois = roiByPlatform[platform];
            acc[platform] = rois.reduce((sum, roi) => sum + roi, 0) / rois.length;
            return acc;
        }, {});
    }

    // Modal functionality
    const addAdBtn = document.getElementById('addAdBtn');
    const adModal = document.getElementById('adModal');
    const adForm = document.getElementById('adForm');

    addAdBtn.addEventListener('click', () => {
        adModal.style.display = 'block';
    });

    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    adForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newAd = {
            name: document.getElementById('adName').value,
            date: document.getElementById('adDate').value,
            platform: document.getElementById('adPlatform').value,
            reach: parseInt(document.getElementById('adReach').value),
            engagement: parseFloat(document.getElementById('adEngagement').value),
            leads: parseInt(document.getElementById('adLeads').value),
            subscriptions: parseInt(document.getElementById('adSubscriptions').value),
            investment: parseFloat(document.getElementById('adInvestment').value),
            roi: calculateRoi(
                parseFloat(document.getElementById('adInvestment').value),
                parseInt(document.getElementById('adSubscriptions').value)
            )
        };

        adsData.push(newAd);
        filterAds();
        adModal.style.display = 'none';
        adForm.reset();
        updateMetricsSummary();
    });

    function calculateRoi(investment, subscriptions) {
        const averageSubscriptionValue = 100; // Example value
        const revenue = subscriptions * averageSubscriptionValue;
        return Math.round(((revenue - investment) / investment) * 100);
    }

    function updateMetricsSummary() {
        const totalROI = adsData.reduce((sum, ad) => sum + ad.roi, 0) / adsData.length;
        const totalLeads = adsData.reduce((sum, ad) => sum + ad.leads, 0);
        const totalSubs = adsData.reduce((sum, ad) => sum + ad.subscriptions, 0);
        const totalInvestment = adsData.reduce((sum, ad) => sum + ad.investment, 0);

        document.getElementById('totalROI').textContent = `${Math.round(totalROI)}%`;
        document.getElementById('totalLeads').textContent = formatNumber(totalLeads);
        document.getElementById('totalSubs').textContent = formatNumber(totalSubs);
        document.getElementById('costPerLead').textContent = 
            `$${((totalInvestment / totalLeads) || 0).toFixed(2)}`;
    }

    // Initialize
    document.getElementById('platformFilter').addEventListener('change', filterAds);
    document.getElementById('periodFilter').addEventListener('change', filterAds);
    document.getElementById('contentFilter').addEventListener('change', filterAds);

    // Initial render
    renderAdsTable(adsData);
    updateMetricsSummary();
});
