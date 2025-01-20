document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const exportBtn = document.getElementById('exportBtn');
    let selectedCell = null;
    let currentRow = 0;
    let currentCol = 0;

    // Undo functionality
    const undoStack = [];
    const maxUndoSteps = 50;

    function saveState(cell, oldValue, newValue) {
        undoStack.push({
            cell: cell,
            oldValue: oldValue,
            newValue: newValue
        });
        
        if (undoStack.length > maxUndoSteps) {
            undoStack.shift();
        }
    }

    function handleUndo(e) {
        if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            if (undoStack.length > 0) {
                const lastAction = undoStack.pop();
                lastAction.cell.textContent = lastAction.oldValue;
                lastAction.cell.classList.add('undo-highlight');
                
                setTimeout(() => {
                    lastAction.cell.classList.remove('undo-highlight');
                }, 500);
            }
        }
    }

    function centerSelectedCell() {
        if (selectedCell) {
            const cellRect = selectedCell.getBoundingClientRect();
            const containerRect = document.querySelector('.table-wrapper').getBoundingClientRect();
            const scrollContainer = document.querySelector('.table-wrapper');
            
            const scrollX = cellRect.left + (cellRect.width / 2) - (containerRect.width / 2);
            const scrollY = cellRect.top + (cellRect.height / 2) - (containerRect.height / 2);
            
            scrollContainer.style.scrollBehavior = 'auto';
            scrollContainer.scrollTo({
                left: scrollX + scrollContainer.scrollLeft,
                top: scrollY + scrollContainer.scrollTop,
                behavior: 'auto'
            });
            
            setTimeout(() => {
                scrollContainer.style.scrollBehavior = 'smooth';
            }, 50);
        }
    }

    function handleCellSelection(e) {
        const cell = e.target.closest('td');
        if (!cell) return;

        if (selectedCell) {
            selectedCell.classList.remove('selected');
        }

        selectedCell = cell;
        cell.classList.add('selected');
        
        const row = cell.parentElement;
        currentRow = Array.from(tableBody.children).indexOf(row);
        currentCol = Array.from(row.children).indexOf(cell);

        centerSelectedCell();
    }

    function makeEditable(cell) {
        if (cell.classList.contains('fixed-column')) return;
        
        const oldValue = cell.textContent;
        cell.classList.add('editable');
        cell.innerHTML = `<input type="text" value="${oldValue}" />`;
        const input = cell.querySelector('input');
        input.focus();
        input.select();

        input.addEventListener('blur', () => {
            const newValue = input.value;
            finishEditing(cell, newValue);
            if (oldValue !== newValue) {
                saveState(cell, oldValue, newValue);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }

    function finishEditing(cell, value) {
        cell.classList.remove('editable');
        cell.textContent = value;
    }

    function handleKeyboardShortcuts(e) {
        if (!selectedCell) return;

        if (e.ctrlKey && e.key === 'c') {
            navigator.clipboard.writeText(selectedCell.textContent);
            return;
        }

        switch(e.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                handleArrowNavigation(e);
                e.preventDefault();
                break;
            case 'Enter':
                if (!selectedCell.classList.contains('fixed-column')) {
                    makeEditable(selectedCell);
                }
                e.preventDefault();
                break;
        }
    }

    function handleArrowNavigation(e) {
        const directions = {
            'ArrowUp': [-1, 0],
            'ArrowDown': [1, 0],
            'ArrowLeft': [0, -1],
            'ArrowRight': [0, 1]
        };
        
        const [rowDelta, colDelta] = directions[e.key];
        const newRow = currentRow + rowDelta;
        const newCol = currentCol + colDelta;
        
        const targetRow = tableBody.children[newRow];
        if (targetRow) {
            const targetCell = targetRow.children[newCol];
            if (targetCell) {
                targetCell.click();
                centerSelectedCell();
            }
        }
    }

    // Event Listeners
    tableBody.addEventListener('click', handleCellSelection);
    document.addEventListener('keydown', handleKeyboardShortcuts);
    document.addEventListener('keydown', handleUndo);
    
    // Initialize
    renderTable();
});
