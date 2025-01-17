// Datos de ejemplo para inicializar
let registrosTiempo = JSON.parse(localStorage.getItem('registrosTiempo')) || [];

// Referencias DOM
const tiempoForm = document.getElementById('tiempoForm');
const historialTabla = document.getElementById('historialTabla');
const notificacion = document.getElementById('notificacion');

// Inicialización del gráfico
let tiemposChart;

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
    notificacion.textContent = mensaje;
    notificacion.className = `notificacion ${tipo}`;
    notificacion.classList.add('show');
    
    setTimeout(() => {
        notificacion.classList.remove('show');
    }, 3000);
}

// Función para guardar en localStorage
function guardarDatos() {
    localStorage.setItem('registrosTiempo', JSON.stringify(registrosTiempo));
}

// Función para agregar nuevo registro
function agregarRegistro(e) {
    e.preventDefault();
    
    const tarea = document.getElementById('tarea').value;
    const horas = parseFloat(document.getElementById('horas').value);
    const observaciones = document.getElementById('observaciones').value;
    
    const nuevoRegistro = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        tarea,
        horas,
        observaciones
    };
    
    registrosTiempo.push(nuevoRegistro);
    guardarDatos();
    actualizarHistorial();
    actualizarGrafico();
    mostrarNotificacion('Tiempo registrado correctamente', 'success');
    tiempoForm.reset();
}

// Función para actualizar la tabla de historial
function actualizarHistorial() {
    const tbody = historialTabla.querySelector('tbody');
    tbody.innerHTML = '';
    
    registrosTiempo.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .forEach(registro => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${new Date(registro.fecha).toLocaleDateString()}</td>
                <td>${registro.tarea}</td>
                <td>${registro.horas}h</td>
                <td>
                    <button onclick="editarRegistro(${registro.id})" class="btn-action btn-edit">✏️</button>
                    <button onclick="eliminarRegistro(${registro.id})" class="btn-action btn-delete">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
}

// Función para actualizar el gráfico
function actualizarGrafico() {
    const ctx = document.getElementById('tiemposChart').getContext('2d');
    
    // Calcular totales por tipo de tarea
    const totales = {
        pautas: 0,
        publicaciones: 0,
        contenido: 0
    };
    
    registrosTiempo.forEach(registro => {
        totales[registro.tarea] += registro.horas;
    });
    
    if (tiemposChart) {
        tiemposChart.destroy();
    }
    
    tiemposChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pautas', 'Publicaciones', 'Contenido Interno'],
            datasets: [{
                label: 'Horas Trabajadas',
                data: [totales.pautas, totales.publicaciones, totales.contenido],
                backgroundColor: [
                    'var(--color-pautas)',
                    'var(--color-publicaciones)',
                    'var(--color-contenido)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para editar registro
function editarRegistro(id) {
    const registro = registrosTiempo.find(r => r.id === id);
    if (!registro) return;
    
    document.getElementById('tarea').value = registro.tarea;
    document.getElementById('horas').value = registro.horas;
    document.getElementById('observaciones').value = registro.observaciones;
    
    // Eliminar el registro actual
    registrosTiempo = registrosTiempo.filter(r => r.id !== id);
    guardarDatos();
    actualizarHistorial();
    actualizarGrafico();
}

// Función para eliminar registro
function eliminarRegistro(id) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;
    
    registrosTiempo = registrosTiempo.filter(r => r.id !== id);
    guardarDatos();
    actualizarHistorial();
    actualizarGrafico();
    mostrarNotificacion('Registro eliminado', 'success');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    actualizarHistorial();
    actualizarGrafico();
});

tiempoForm.addEventListener('submit', agregarRegistro);
