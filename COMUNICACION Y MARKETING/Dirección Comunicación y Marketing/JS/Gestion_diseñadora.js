document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    const completionCtx = document.getElementById('completionChart').getContext('2d');

    const timeChart = new Chart(timeCtx, {
        type: 'bar',
        data: {
            labels: ['Solicitudes Internas', 'Apoyo Pautas', 'Contenido Audiovisual'],
            datasets: [{
                label: 'Tiempo Promedio (días)',
                data: [1.5, 2.3, 3.8],
                backgroundColor: '#818cf8',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    const completionChart = new Chart(completionCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Entregas',
                data: [42, 45, 48, 46, 52, 50],
                borderColor: '#6366f1',
                tension: 0.4
            }, {
                label: 'Meta',
                data: [45, 45, 45, 45, 45, 45],
                borderColor: '#10b981',
                borderDash: [5, 5],
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Sample Tickets Data
    let ticketsData = [
        {
            date: '2024-01-15T10:00',
            requester: 'Comercial',
            type: 'Apoyo Pauta',
            status: 'Entregado',
            estimatedTime: 2,
            description: 'Diseño de banner promocional'
        },
        {
            date: '2024-01-16T14:30',
            requester: 'Administrativa',
            type: 'Solicitud Interna',
            status: 'En Proceso',
            estimatedTime: 1.5,
            description: 'Actualización de presentación corporativa'
        }
    ];

    // Render Tickets Table
    function renderTicketsTable(data) {
        const tableBody = document.getElementById('ticketsTableBody');
        tableBody.innerHTML = data.map(ticket => `
            <tr>
                <td>${formatDate(ticket.date)}</td>
                <td>${ticket.requester}</td>
                <td>${ticket.type}</td>
                <td>
                    <span class="status-badge ${ticket.status.toLowerCase().replace(' ', '-')}">
                        ${ticket.status}
                    </span>
                </td>
                <td>${ticket.estimatedTime} días</td>
                <td>
                    <button onclick="showTicketDetails('${ticket.date}')" class="action-btn">
                        Ver detalles
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Filter Functionality
    function filterTickets() {
        const typeFilter = document.getElementById('typeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filteredData = ticketsData.filter(ticket => {
            const matchType = typeFilter === 'all' || ticket.type.toLowerCase().includes(typeFilter);
            const matchStatus = statusFilter === 'all' || ticket.status.toLowerCase().replace(' ', '') === statusFilter;
            return matchType && matchStatus;
        });

        renderTicketsTable(filteredData);
    }

    document.getElementById('typeFilter').addEventListener('change', filterTickets);
    document.getElementById('statusFilter').addEventListener('change', filterTickets);

    // Create Ticket Modal Functionality
    const createTicketBtn = document.getElementById('createTicketBtn');
    const createTicketModal = document.getElementById('createTicketModal');
    const createTicketForm = document.getElementById('createTicketForm');

    createTicketBtn.addEventListener('click', () => {
        createTicketModal.style.display = 'block';
    });

    // Close modals when clicking X
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form submission
    createTicketForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTicket = {
            date: document.getElementById('requestDate').value,
            requester: document.getElementById('requester').value,
            type: document.getElementById('pieceType').value,
            status: 'Pendiente',
            estimatedTime: document.getElementById('estimatedTime').value,
            description: document.getElementById('description').value
        };

        ticketsData.push(newTicket);
        filterTickets();
        
        createTicketModal.style.display = 'none';
        createTicketForm.reset();

        showNotification('Ticket creado exitosamente');
    });

    // Ticket Details Modal
    window.showTicketDetails = function(date) {
        const ticket = ticketsData.find(t => t.date === date);
        const modal = document.getElementById('detailModal');
        modal.style.display = 'block';
        
        document.getElementById('modalContent').innerHTML = `
            <div class="ticket-details">
                <p><strong>Fecha:</strong> ${formatDate(ticket.date)}</p>
                <p><strong>Solicitante:</strong> ${ticket.requester}</p>
                <p><strong>Tipo:</strong> ${ticket.type}</p>
                <p><strong>Estado:</strong> ${ticket.status}</p>
                <p><strong>Tiempo Estimado:</strong> ${ticket.estimatedTime} días</p>
                <p><strong>Descripción:</strong> ${ticket.description}</p>
            </div>
        `;
    };

    // Notification System
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initial render
    renderTicketsTable(ticketsData);
});
