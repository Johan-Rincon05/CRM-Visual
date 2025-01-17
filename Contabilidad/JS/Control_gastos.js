// Configuración de Google Sheets API
const SPREADSHEET_ID = 'TU_ID_DE_SPREADSHEET';
const API_KEY = 'TU_API_KEY';

// Variables globales
let gastos = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarGoogleSheetsAPI();
    actualizarMetricas();
});

// Función para inicializar Google Sheets API
function inicializarGoogleSheetsAPI() {
    gapi.load('client', () => {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
        }).then(() => {
            cargarDatos();
        });
    });
}

// Función para cargar datos desde Google Sheets
function cargarDatos() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Gastos!A2:G'
    }).then(response => {
        procesarDatos(response.result.values);
    });
}

// Función para procesar los datos
function procesarDatos(datos) {
    gastos = datos.map(fila => ({
        tipo: fila[0],
        descripcion: fila[1],
        estado: fila[2],
        monto: parseFloat(fila[3]),
        fechaMaxima: fila[4],
        fechaReal: fila[5],
        observaciones: fila[6]
    }));
    
    actualizarTabla();
    actualizarMetricas();
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tbody = document.getElementById('gastosCuerpo');
    tbody.innerHTML = '';

    gastos.forEach(gasto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${gasto.tipo}</td>
            <td>${gasto.descripcion}</td>
            <td class="estado-${gasto.estado.toLowerCase()}">${gasto.estado}</td>
            <td>${formatearMoneda(gasto.monto)}</td>
            <td>${formatearFecha(gasto.fechaMaxima)}</td>
            <td>${formatearFecha(gasto.fechaReal)}</td>
            <td contenteditable="true">${gasto.observaciones}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Función para actualizar métricas
function actualizarMetricas() {
    const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
    const gastosPendientes = gastos.filter(g => g.estado === 'Pendiente').length;
    const gastosVencidos = gastos.filter(g => g.estado === 'Vencido').length;

    document.getElementById('totalGastos').textContent = formatearMoneda(totalGastos);
    document.getElementById('porcentajePendientes').textContent = 
        `${((gastosPendientes / gastos.length) * 100).toFixed(1)}%`;
    document.getElementById('totalVencidos').textContent = gastosVencidos;
}

// Funciones de utilidad
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(valor);
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CO');
}

// Función para sincronizar datos
function sincronizarDatos() {
    cargarDatos();
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
