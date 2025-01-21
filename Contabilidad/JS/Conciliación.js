// Datos de ejemplo
let suscripciones = [];

// Función para inicializar la tabla
function inicializarTabla() {
    // Simular algunos datos
    suscripciones = [
        {
            fecha: '2024-01-15',
            nombre: 'Juan Pérez',
            documento: '1234567890',
            celular: '3001234567',
            valor: 100000,
            abono: true,
            valorAbono: 50000,
            metodoPago: 'Nequi',
            documentoConsignante: '9876543210',
            observacionesOrientador: 'Pago inicial realizado',
            aprobado: true,
            observacionesContabilidad: 'Verificado'
        }
        // Agregar más datos de ejemplo aquí
    ];
    
    actualizarTabla();
}

// Función para actualizar la tabla
function actualizarTabla() {
    const tbody = document.getElementById('tablaCuerpo');
    tbody.innerHTML = '';

    suscripciones.forEach((sus, index) => {
        const tr = document.createElement('tr');
        tr.className = sus.aprobado ? 'fila-aprobada' : 'fila-normal';
        
        tr.innerHTML = `
            <td>${sus.fecha}</td>
            <td>${sus.nombre}</td>
            <td>${sus.documento}</td>
            <td>${sus.celular}</td>
            <td>${formatearMoneda(sus.valor)}</td>
            <td>
                <input type="checkbox" ${sus.abono ? 'checked' : ''} onchange="actualizarAbono(this)">
                <input type="number" value="${sus.valorAbono || ''}" onchange="actualizarValorAbono(this)">
            </td>
            <td>
                <select onchange="actualizarMetodoPago(this)">
                    <option value="Efectivo" ${sus.metodoPago === 'Efectivo' ? 'selected' : ''}>Efectivo</option>
                    <option value="QR" ${sus.metodoPago === 'QR' ? 'selected' : ''}>QR</option>
                </select>
            </td>
            <td>${sus.documentoConsignante}</td>
            <td>${sus.observacionesOrientador}</td>
            <td>
                <input type="checkbox" ${sus.aprobado ? 'checked' : ''} onchange="actualizarAprobacion(this)">
            </td>
            <td contenteditable="true" onblur="actualizarObservacionesContabilidad(this, ${index})">${sus.observacionesContabilidad || ''}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

/*actualizar las observaciones*/
function actualizarObservacionesContabilidad(celda, index) {
    suscripciones[index].observacionesContabilidad = celda.textContent;
}

// Función para formatear moneda
function formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP'
    }).format(valor);
}

// Funciones de exportación
function exportarExcel() {
    // Implementar exportación a Excel
    console.log('Exportando a Excel...');
}

function exportarPDF() {
    // Implementar exportación a PDF
    console.log('Exportando a PDF...');
}

// Funciones de actualización
function actualizarAbono(checkbox) {
    // Implementar actualización de abono
}

function actualizarValorAbono(input) {
    // Implementar actualización de valor de abono
}

function actualizarMetodoPago(select) {
    // Implementar actualización de método de pago
}

function actualizarAprobacion(checkbox) {
    const fila = checkbox.closest('tr');
    if (checkbox.checked) {
        fila.className = 'fila-aprobada';
    } else {
        fila.className = 'fila-normal';
    }
}

// Inicializar la tabla cuando se carga la página
document.addEventListener('DOMContentLoaded', inicializarTabla);

// Implementar navegación con teclado
document.addEventListener('keydown', (e) => {
    // Implementar navegación con flechas
});
