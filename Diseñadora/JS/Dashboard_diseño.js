// Datos de ejemplo más completos
const dashboardData = {
    solicitudes: {
        pendientes: 25,
        enProceso: 12,
        entregadas: 45
    },
    tiemposPromedio: {
        redesSociales: 3.5,
        publicidad: 12,
        contenidoInterno: 8
    },
    cumplimiento: 87,
    prioridades: [
        {
            id: 1,
            titulo: "Diseño post Instagram - Campaña Verano",
            fecha: "2024-01-20",
            cliente: "Marca Deportiva XYZ",
            estado: "pendiente",
            prioridad: "alta"
        },
        {
            id: 2,
            titulo: "Banner publicitario - Promoción Especial",
            fecha: "2024-01-20",
            cliente: "Tienda Online ABC",
            estado: "proceso",
            prioridad: "media"
        },
        {
            id: 3,
            titulo: "Infografía - Reporte Anual",
            fecha: "2024-01-21",
            cliente: "Departamento de Marketing",
            estado: "pendiente",
            prioridad: "alta"
        },
        {
            id: 4,
            titulo: "Diseño de Newsletter - Febrero",
            fecha: "2024-01-22",
            cliente: "Comunicación Interna",
            estado: "pendiente",
            prioridad: "baja"
        },
        {
            id: 5,
            titulo: "Posts Facebook - Lanzamiento Producto",
            fecha: "2024-01-20",
            cliente: "Startup Tech",
            estado: "proceso",
            prioridad: "alta"
        }
    ]
};

// Actualizar fecha de última actualización
function actualizarFechaActualizacion() {
    const ahora = new Date();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    document.getElementById('lastUpdate').textContent = 
        ahora.toLocaleDateString('es-ES', opciones);
}

// Actualizar KPIs
function actualizarKPIs() {
    document.getElementById('pendientes').textContent = dashboardData.solicitudes.pendientes;
    document.getElementById('enProceso').textContent = dashboardData.solicitudes.enProceso;
    document.getElementById('entregadas').textContent = dashboardData.solicitudes.entregadas;
    
    document.getElementById('tiempoRedes').textContent = 
        `${dashboardData.tiemposPromedio.redesSociales}h`;
    document.getElementById('tiempoPublicidad').textContent = 
        `${dashboardData.tiemposPromedio.publicidad}h`;
    document.getElementById('tiempoInterno').textContent = 
        `${dashboardData.tiemposPromedio.contenidoInterno}h`;
    
    document.getElementById('cumplimiento').textContent = 
        `${dashboardData.cumplimiento}%`;
    
    // Actualizar barra de progreso
    document.getElementById('progressBar').style.width = 
        `${dashboardData.cumplimiento}%`;
}

// Crear gráfico circular
function crearGrafico() {
    const ctx = document.getElementById('solicitudesChart').getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Pendientes', 'En Proceso', 'Entregadas'],
            datasets: [{
                data: [
                    dashboardData.solicitudes.pendientes,
                    dashboardData.solicitudes.enProceso,
                    dashboardData.solicitudes.entregadas
                ],
                backgroundColor: [
                    '#ff6b6b',  // Rojo
                    '#ffd93d',  // Amarillo
                    '#6bff84'   // Verde
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}

// Actualizar lista de prioridades
function actualizarPrioridades() {
    const priorityList = document.getElementById('priorityList');
    priorityList.innerHTML = '';

    dashboardData.prioridades.forEach(tarea => {
        const tareaElement = document.createElement('div');
        tareaElement.className = 'priority-item';
        
        const prioridadColor = {
            alta: '#ff6b6b',
            media: '#ffd93d',
            baja: '#6bff84'
        };

        tareaElement.innerHTML = `
            <div class="priority-info">
                <h4>${tarea.titulo}</h4>
                <p>Cliente: ${tarea.cliente}</p>
                <p>Fecha: ${tarea.fecha}</p>
                <p>Prioridad: <span style="color: ${prioridadColor[tarea.prioridad]}">${tarea.prioridad.toUpperCase()}</span></p>
            </div>
            <div class="priority-actions">
                <button onclick="actualizarEstado(${tarea.id})" 
                        style="background-color: ${tarea.estado === 'pendiente' ? '#ffd93d' : '#6bff84'}">
                    ${tarea.estado === 'pendiente' ? 'Iniciar' : 'Completar'}
                </button>
            </div>
        `;
        priorityList.appendChild(tareaElement);
    });
}

// Función para actualizar el estado de una tarea
function actualizarEstado(id) {
    const tarea = dashboardData.prioridades.find(t => t.id === id);
    if (tarea.estado === 'pendiente') {
        tarea.estado = 'proceso';
        dashboardData.solicitudes.pendientes--;
        dashboardData.solicitudes.enProceso++;
    } else if (tarea.estado === 'proceso') {
        tarea.estado = 'entregado';
        dashboardData.solicitudes.enProceso--;
        dashboardData.solicitudes.entregadas++;
    }
    
    actualizarKPIs();
    crearGrafico();
    actualizarPrioridades();
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    actualizarFechaActualizacion();
    actualizarKPIs();
    crearGrafico();
    actualizarPrioridades();
});
