document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeTableFilters();
});

function initializeEventListeners() {
    // Global search
    document.getElementById('globalSearch').addEventListener('input', handleGlobalSearch);
    
    // University filter
    document.getElementById('globalFilter').addEventListener('change', handleUniversityFilter);
    
    // Column configuration buttons
    document.querySelectorAll('.column-config-btn').forEach(btn => {
        btn.addEventListener('click', openColumnModal);
    });
    
    // Export buttons
    document.querySelectorAll('.export-btn').forEach(btn => {
        btn.addEventListener('click', handleExport);
    });
    
    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    document.querySelector('.cancel-btn').addEventListener('click', closeModal);
    
    // Save column configuration
    document.querySelector('.save-btn').addEventListener('click', saveColumnConfiguration);
}

function initializeTableFilters() {
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach(header => {
            header.addEventListener('click', () => sortTable(table, Array.from(headers).indexOf(header)));
        });
    });
}

function handleGlobalSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const selectedUniversity = document.getElementById('globalFilter').value;
    
    document.querySelectorAll('.university-section').forEach(section => {
        if (selectedUniversity === 'all' || section.id.includes(selectedUniversity)) {
            const rows = section.querySelectorAll('tbody tr');
            filterRows(rows, searchTerm);
        }
    });
}

function filterRows(rows, searchTerm) {
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

function handleUniversityFilter(e) {
    const selectedUniversity = e.target.value;
    
    document.querySelectorAll('.university-section').forEach(section => {
        section.style.display = 
            selectedUniversity === 'all' || section.id.includes(selectedUniversity) 
            ? 'block' 
            : 'none';
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isNumeric = rows.every(row => 
        !isNaN(row.cells[columnIndex].textContent.replace(/[^0-9.-]+/g, ''))
    );
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;
        
        return isNumeric 
            ? parseFloat(aValue.replace(/[^0-9.-]+/g, '')) - parseFloat(bValue.replace(/[^0-9.-]+/g, ''))
            : aValue.localeCompare(bValue);
    });
    
    tbody.append(...rows);
}

function openColumnModal(e) {
    const modal = document.getElementById('columnModal');
    const table = e.target.closest('.university-section').querySelector('table');
    const columns = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    
    populateColumnModal(columns);
    modal.style.display = 'block';
}

function populateColumnModal(columns) {
    const columnList = document.querySelector('.column-list');
    columnList.innerHTML = columns.map((column, index) => `
        <div class="column-item">
            <input type="checkbox" id="col-${index}" checked>
            <label for="col-${index}">${column}</label>
        </div>
    `).join('');
}

function saveColumnConfiguration() {
    const checkboxes = document.querySelectorAll('.column-item input');
    const activeColumns = Array.from(checkboxes).map(cb => cb.checked);
    
    document.querySelectorAll('.data-table').forEach(table => {
        const columns = table.querySelectorAll('th, td');
        columns.forEach((col, index) => {
            if (index % activeColumns.length < activeColumns.length) {
                col.style.display = activeColumns[index % activeColumns.length] ? '' : 'none';
            }
        });
    });
    
    closeModal();
    showNotification('Configuración de columnas guardada');
}

function handleExport(e) {
    const type = e.target.closest('.export-btn').dataset.type;
    const section = e.target.closest('.university-section');
    const universityName = section.querySelector('h2').textContent;
    
    showNotification(`Exportando datos de ${universityName} en formato ${type.toUpperCase()}`);
    
    // Simulate export delay
    setTimeout(() => {
        showNotification(`Datos de ${universityName} exportados exitosamente`);
    }, 1500);
}

function closeModal() {
    document.getElementById('columnModal').style.display = 'none';
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

