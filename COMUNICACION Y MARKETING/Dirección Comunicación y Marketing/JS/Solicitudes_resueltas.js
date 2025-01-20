document.addEventListener('DOMContentLoaded', function() {
    let requestsData = [
        {
            id: 1,
            requester: 'Marketing',
            type: 'design',
            requestDate: '2024-01-15',
            deliveryDate: '2024-01-18',
            status: 'delivered',
            notes: 'Entregado antes del plazo',
            dueDate: '2024-01-20'
        },
        {
            id: 2,
            requester: 'Ventas',
            type: 'social',
            requestDate: '2024-01-18',
            deliveryDate: null,
            status: 'inProgress',
            notes: 'En proceso de revisión',
            dueDate: '2024-01-25'
        }
    ];

    // Initialize Compliance Chart
    const complianceCtx = document.getElementById('complianceChart').getContext('2d');
    const complianceChart = new Chart(complianceCtx, {
        type: 'doughnut',
        data: {
            labels: ['A tiempo', 'Retrasado'],
            datasets: [{
                data: [85, 15],
                backgroundColor: [
                    '#10b981',
                    '#ef4444'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Cumplimiento de Plazos'
                }
            }
        }
    });

    // Render Requests Table
    function renderRequestsTable(data) {
        const tableBody = document.getElementById('requestsTableBody');
        tableBody.innerHTML = data.map(request => `
            <tr>
                <td>${request.requester}</td>
                <td>${formatRequestType(request.type)}</td>
                <td>${formatDate(request.requestDate)}</td>
                <td>${request.deliveryDate ? formatDate(request.deliveryDate) : '-'}</td>
                <td>
                    <span class="status-badge status-${request.status}">
                        ${formatStatus(request.status)}
                    </span>
                </td>
                <td>${request.notes}</td>
                <td>
                    <button onclick="updateStatus(${request.id})" class="action-btn update">
                        Actualizar Estado
                    </button>
                    <button onclick="showDetails(${request.id})" class="action-btn">
                        Ver Detalles
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Format helpers
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('es-ES');
    }

    function formatRequestType(type) {
        const types = {
            design: 'Diseño',
            social: 'Social Media',
            content: 'Contenido'
        };
        return types[type] || type;
    }

    function formatStatus(status) {
        const statuses = {
            delivered: 'Entregado',
            inProgress: 'En Proceso',
            delayed: 'Retrasado'
        };
        return statuses[status] || status;
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    function searchRequests() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredData = requestsData.filter(request => 
            request.requester.toLowerCase().includes(searchTerm) ||
            request.type.toLowerCase().includes(searchTerm)
        );
        renderRequestsTable(filteredData);
    }

    searchBtn.addEventListener('click', searchRequests);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchRequests();
    });

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');

    function filterRequests() {
        const status = statusFilter.value;
        const type = typeFilter.value;

        let filteredData = [...requestsData];

        if (status !== 'all') {
            filteredData = filteredData.filter(request => request.status === status);
        }
        if (type !== 'all') {
            filteredData = filteredData.filter(request => request.type === type);
        }

        renderRequestsTable(filteredData);
        updateMetrics(filteredData);
    }

    statusFilter.addEventListener('change', filterRequests);
    typeFilter.addEventListener('change', filterRequests);

    // Update Status Modal
    window.updateStatus = function(requestId) {
        const modal = document.getElementById('statusModal');
        const form = document.getElementById('statusForm');
        
        modal.style.display = 'block';
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const request = requestsData.find(r => r.id === requestId);
            request.status = document.getElementById('newStatus').value;
            request.notes = document.getElementById('statusNotes').value;
            
            if (request.status === 'delivered') {
                request.deliveryDate = new Date().toISOString().split('T')[0];
            }
            
            filterRequests();
            modal.style.display = 'none';
            updateMetrics(requestsData);
        };
    };

    // Show Details Modal
    window.showDetails = function(requestId) {
        const modal = document.getElementById('detailsModal');
        const request = requestsData.find(r => r.id === requestId);
        
        document.getElementById('requestDetails').innerHTML = `
            <h2>Detalles de la Solicitud</h2>
            <p><strong>Solicitante:</strong> ${request.requester}</p>
            <p><strong>Tipo:</strong> ${formatRequestType(request.type)}</p>
            <p><strong>Fecha Solicitud:</strong> ${formatDate(request.requestDate)}</p>
            <p><strong>Fecha Límite:</strong> ${formatDate(request.dueDate)}</p>
            <p><strong>Estado:</strong> ${formatStatus(request.status)}</p>
            <p><strong>Observaciones:</strong> ${request.notes}</p>
        `;
        
        modal.style.display = 'block';
    };

    // Update Metrics
    function updateMetrics(data) {
        const totalRequests = data.length;
        const deliveredOnTime = data.filter(request => 
            request.status === 'delivered' && 
            new Date(request.deliveryDate) <= new Date(request.dueDate)
        ).length;

        const compliance = (deliveredOnTime / totalRequests * 100).toFixed(1);
        
        document.getElementById('totalCompliance').textContent = `${compliance}%`;
        document.getElementById('totalRequests').textContent = totalRequests;
        
        // Update compliance chart
        complianceChart.data.datasets[0].data = [
            deliveredOnTime,
            totalRequests - deliveredOnTime
        ];
        complianceChart.update();
    }

    // Close modals
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Initial render
    renderRequestsTable(requestsData);
    updateMetrics(requestsData);
});
