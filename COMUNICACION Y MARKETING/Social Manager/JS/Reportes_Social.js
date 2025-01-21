// Datos de ejemplo
const datosEngagement = {
    labels: ['Facebook', 'Instagram', 'Twitter'],
    alcance: [5000, 8000, 3000],
    interacciones: [500, 1200, 300]
};

const datosLeads = [
    {
        campana: 'Campaña Verano 2023',
        leads: 150,
        conversiones: 45,
        tasa: '30%'
    },
    {
        campana: 'Promoción Especial',
        leads: 200,
        conversiones: 80,
        tasa: '40%'
    },
    {
        campana: 'Lanzamiento Producto',
        leads: 300,
        conversiones: 120,
        tasa: '40%'
    }
];


// Establecer fechas iniciales
window.addEventListener('load', () => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1); // Un mes atrás por defecto
    
    document.getElementById('fecha-inicio').valueAsDate = fechaInicio;
    document.getElementById('fecha-fin').valueAsDate = fechaFin;
    
    inicializarGraficoEngagement();
    llenarTablaLeads();
});

// Eventos para los inputs de fecha
document.getElementById('fecha-inicio').addEventListener('change', function() {
    actualizarDatos();
});

document.getElementById('fecha-fin').addEventListener('change', function() {
    actualizarDatos();
});

function actualizarDatos() {
    const fechaInicio = document.getElementById('fecha-inicio').valueAsDate;
    const fechaFin = document.getElementById('fecha-fin').valueAsDate;
    
    // Validar que la fecha de inicio no sea posterior a la fecha fin
    if (fechaInicio > fechaFin) {
        alert('La fecha de inicio no puede ser posterior a la fecha fin');
        return;
    }
    
    // Aquí puedes agregar la lógica para actualizar los datos según el rango de fechas
    inicializarGraficoEngagement();
    llenarTablaLeads();
}




// Inicializar gráfico de engagement
function inicializarGraficoEngagement() {
    const ctx = document.getElementById('engagementChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datosEngagement.labels,
            datasets: [
                {
                    label: 'Alcance',
                    data: datosEngagement.alcance,
                    backgroundColor: '#CF85D1',
                },
                {
                    label: 'Interacciones',
                    data: datosEngagement.interacciones,
                    backgroundColor: '#C158D8',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Llenar tabla de leads
function llenarTablaLeads() {
    const tbody = document.getElementById('leadsTableBody');
    tbody.innerHTML = '';
    
    datosLeads.forEach(dato => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${dato.campana}</td>
            <td>${dato.leads}</td>
            <td>${dato.conversiones}</td>
            <td>${dato.tasa}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Exportar a PDF
document.getElementById('exportPDF').addEventListener('click', () => {
    alert('Exportando a PDF...');
    // Aquí iría la lógica de exportación a PDF
});

// Exportar a Excel
document.getElementById('exportExcel').addEventListener('click', () => {
    alert('Exportando a Excel...');
    // Aquí iría la lógica de exportación a Excel
});

// Eventos de filtros
document.getElementById('periodo').addEventListener('change', function() {
    // Actualizar datos según el período seleccionado
});

document.getElementById('plataforma').addEventListener('change', function() {
    // Actualizar datos según la plataforma seleccionada
});

// Inicializar la página
window.addEventListener('load', () => {
    inicializarGraficoEngagement();
    llenarTablaLeads();
});
