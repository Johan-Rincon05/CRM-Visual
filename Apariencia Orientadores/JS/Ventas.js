document.addEventListener('DOMContentLoaded', () => {
    let selectedCell = null;
    let currentRow = 0;
    let currentCol = 0;

    const checkboxes = document.querySelectorAll('.approval-checkbox');
    const auditBtns = document.querySelectorAll('[data-action="audit"]');
    const auditModal = document.getElementById('auditModal');
    const closeButtons = document.querySelectorAll('.close');
    const obsButtons = document.querySelectorAll('[data-action="observations"]');
    const obsModal = document.getElementById('observationsModal');

    // Handle checkboxes and row coloring
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const row = checkbox.closest('tr');
            const checkedBoxes = row.querySelectorAll('.approval-checkbox:checked').length;
            
            row.classList.remove('status-one', 'status-two', 'status-three');
            
            if (checkedBoxes === 1) {
                row.classList.add('status-one');
            } else if (checkedBoxes === 2) {
                row.classList.add('status-two');
            } else if (checkedBoxes === 3) {
                row.classList.add('status-three');
            }
        });
    });

    // Handle audit observations modal
    auditBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showModal('auditModal');
        });
    });

    // Handle observations button and modal
    obsButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showModal('observationsModal');
        });
    });

    // Close modal functionality
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.closest('.modal').id);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            const modalId = document.querySelector('.modal.active').id;
            closeModal(modalId);
        }
    });

    // Handle chat messages
    document.querySelectorAll('.chat-input button').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const messagesContainer = button.closest('.audit-section').querySelector('.chat-messages');
            
            if (input.value.trim()) {
                const message = createMessage(input.value);
                messagesContainer.appendChild(message);
                input.value = '';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });
    });

    // Keyboard navigation functions
    function handleKeyboardNavigation(e) {
        if (!selectedCell) return;

        const table = document.getElementById('paymentsTable');
        const rows = table.querySelectorAll('tbody tr');
        const currentRowElement = selectedCell.closest('tr');
        const cells = Array.from(currentRowElement.cells);
        currentRow = Array.from(rows).indexOf(currentRowElement);
        currentCol = cells.indexOf(selectedCell);

        switch(e.key) {
            case 'ArrowUp':
                if (currentRow > 0) selectCell(rows[currentRow - 1].cells[currentCol]);
                break;
            case 'ArrowDown':
                if (currentRow < rows.length - 1) selectCell(rows[currentRow + 1].cells[currentCol]);
                break;
            case 'ArrowLeft':
                if (currentCol > 0) selectCell(cells[currentCol - 1]);
                break;
            case 'ArrowRight':
                if (currentCol < cells.length - 1) selectCell(cells[currentCol + 1]);
                break;
        }
    }

    function selectCell(cell) {
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        selectedCell.classList.add('selected');
        centerSelectedCell();
    }

    function centerSelectedCell() {
        if (selectedCell) {
            selectedCell.scrollIntoView({
                behavior: 'auto',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }

    // Event Listeners for keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    document.querySelectorAll('#paymentsTable td').forEach(cell => {
        cell.addEventListener('click', () => selectCell(cell));
    });
});

// Modal functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.classList.add('active');
        modal.classList.add('active');
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.querySelector('.modal-overlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
    setTimeout(() => {
        overlay.remove();
    }, 300);
}

function createMessage(content) {
    const message = document.createElement('div');
    message.className = 'message';
    message.innerHTML = `
        <div class="message-info">
            <span class="user">Usuario</span>
            <span class="timestamp">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${content}</div>
    `;
    return message;
}
