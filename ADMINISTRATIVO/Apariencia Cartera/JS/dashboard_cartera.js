// Chart initialization
const initializeCharts = () => {
    const ctx = document.getElementById('universityChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Universidad A', 'Universidad B', 'Universidad C'],
            datasets: [{
                data: [300, 200, 100],
                backgroundColor: ['#27ae60', '#2980b9', '#8e44ad']
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
};

// Table data handling
const populateTable = () => {
    const tableData = [
        {
            universidad: 'Universidad A',
            periodo: '2023-Q4',
            pagados: 300,
            pendientes: 100,
            total: '$150,000'
        },
        // Add more data as needed
    ];

    const tbody = document.querySelector('#summaryTable tbody');
    tbody.innerHTML = tableData.map(row => `
        <tr>
            <td>${row.universidad}</td>
            <td>${row.periodo}</td>
            <td>${row.pagados}</td>
            <td>${row.pendientes}</td>
            <td>${row.total}</td>
        </tr>
    `).join('');
};

// Progress bars animation
const animateProgressBars = () => {
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const percentage = bar.dataset.percentage;
        bar.style.width = `${percentage}%`;
    });
};

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    populateTable();
    animateProgressBars();
});

// Add sorting functionality to table
document.querySelectorAll('#summaryTable th').forEach(header => {
    header.addEventListener('click', () => {
        const column = header.cellIndex;
        sortTable(column);
    });
});

// Table sorting function
const sortTable = (column) => {
    const table = document.getElementById('summaryTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const aValue = a.cells[column].textContent;
        const bValue = b.cells[column].textContent;
        return aValue.localeCompare(bValue);
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
};
