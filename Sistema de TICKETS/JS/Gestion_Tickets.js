document.addEventListener('DOMContentLoaded', () => {
    // Modal Management
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    const transferButtons = document.querySelectorAll('.transfer-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    // Open Transfer Modal
    transferButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('transferModal').style.display = 'block';
        });
    });

    // Open Detail Modal
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('ticketDetailModal').style.display = 'block';
        });
    });

    // Close Modals
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });

    // Close Modal on Outside Click
    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Filter Functionality
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', filterTickets);

    // Search Functionality
    const searchInput = document.querySelector('.search-box input');
    searchInput.addEventListener('input', searchTickets);
});

function filterTickets() {
    // Implement ticket filtering logic
}

function searchTickets() {
    // Implement ticket search logic
}

function transferTicket(ticketId, department) {
    // Implement ticket transfer logic
}

function updateTicketStatus(ticketId, status) {
    // Implement status update logic
}
