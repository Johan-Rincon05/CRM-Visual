// Lista de empleados
const empleados = [
    "Diana Rodriguez", "Naomi Mateus", "Alison Gutierrez", "Francy Cortes",
    "Daniela Muñoz", "Estefania Rodriguez", "Liz Bernal", "Nicol Castiblanco",
    "Johana Niño", "Andrea Meneses", "Andrea Gonzalez", "Yuli Hernandez",
    "Ada Rangel", "Angie Villamor", "Yohandra Labrador", "Paul Campos",
    "Maria Vega", "Andrés Morales", "Johan Rincon", "Juan Pablo Rodríguez",
    "Alejandra Moreno", "Jhonatan Franco", "Johan Franco", "Fernando Suarez",
    "Alejandra Uhia", "Sara Peña"
];

let registros = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();
    actualizarMetricas();
    inicializarGrafico();
});

function cargarDatos() {
    // Simular carga de datos
    registros = JSON.parse(localStorage.getItem('ausentismos')) || [];
    actualizarTabla();
}

function actualizarTabla() {
    const tbody = document.getElementById('tablaBody');
    tbody.innerHTML = '';

    registros.forEach((registro, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${registro.nombre}</td>
            <td>${registro.cargo}</td>
            <td>${registro.fecha}</td>
            <td class="${registro.tipo.toLowerCase()}">${registro.tipo}</td>
            <td>${registro.duracion}</td>
            <td>${registro.observaciones}</td>
            <td>
                <button onclick="editarRegistro(${index})">Editar</button>
                <button onclick="eliminarRegistro(${index})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function agregarRegistro() {
    const registro = {
        nombre: prompt('Nombre del empleado:'),
        cargo: prompt('Cargo:'),
        fecha: prompt('Fecha (YYYY-MM-DD):'),
        tipo: prompt('Tipo de ausentismo (Incapacidad/Licencia/Falta/Permiso):'),
        duracion: prompt('Duración (en días):'),
        observaciones: prompt('Observaciones:')
    };

    registros.push(registro);
    guardarDatos();
    actualizarTabla();
    actualizarMetricas();
    actualizarGrafico();
}

function guardarDatos() {
    localStorage.setItem('ausentismos', JSON.stringify(registros));
}

function actualizarMetricas() {
    const totalAusentismos = registros.length;
    const diasPerdidos = registros.reduce((total, reg) => total + parseInt(reg.duracion), 0);
    const porcentaje = (totalAusentismos / empleados.length * 100).toFixed(1);

    document.getElementById('totalAusentismos').textContent = totalAusentismos;
    document.getElementById('diasPerdidos').textContent = diasPerdidos;
    document.getElementById('porcentajeAusentismo').textContent = `${porcentaje}%`;
}

function inicializarGrafico() {
    const ctx = document.getElementById('graficoAusentismos').getContext('2d');
    const datos = {
        labels: ['Incapacidad', 'Licencia', 'Falta', 'Permiso'],
        datasets: [{
            label: 'Ausentismos por tipo',
            data: calcularDatosPorTipo(),
            backgroundColor: [
                '#2196f3',
                '#4caf50',
                '#f44336',
                '#ff9800'
            ]
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: datos,
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function calcularDatosPorTipo() {
    const tipos = ['Incapacidad', 'Licencia', 'Falta', 'Permiso'];
    return tipos.map(tipo => 
        registros.filter(reg => reg.tipo.toLowerCase() === tipo.toLowerCase()).length
    );
}

function ordenarTabla(columna) {
    registros.sort((a, b) => a[columna].localeCompare(b[columna]));
    actualizarTabla();
}

// Implementar navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'TD') {
        const currentCell = e.target;
        const currentRow = currentCell.parentElement;
        const currentIndex = Array.from(currentRow.children).indexOf(currentCell);
        
        switch(e.key) {
            case 'ArrowUp':
                if (currentRow.previousElementSibling) {
                    currentRow.previousElementSibling.children[currentIndex].focus();
                }
                break;
            case 'ArrowDown':
                if (currentRow.nextElementSibling) {
                    currentRow.nextElementSibling.children[currentIndex].focus();
                }
                break;
        }
    }
});
