document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const addDiscountBtn = document.getElementById('addDiscountBtn');
    const careersModal = document.getElementById('careersModal');
    const careersBtns = document.querySelectorAll('.careers-btn');
    const closeButtons = document.querySelectorAll('.close');
    const basePrice = 193000;

    // Búsqueda en tiempo real
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#discountsTable tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Manejo del modal de carreras
    careersBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            showModal(careersModal);
        });
    });

    // Cerrar modales
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Calcular descuento
    function calculateDiscount(percentage) {
        return basePrice - (basePrice * (percentage / 100));
    }

    // Mostrar modal
    function showModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => modal.classList.add('active'), 10);
    }

    // Cerrar modal
    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    }

    // Manejador de botones de acción
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.classList.contains('edit') ? 'edit' : 'delete';
            const row = btn.closest('tr');

            if (action === 'edit') {
                // Lógica para editar
                console.log('Editando descuento');
            } else {
                // Lógica para eliminar
                if (confirm('¿Estás seguro de eliminar este descuento?')) {
                    row.remove();
                }
            }
        });
    });

    // Agregar nuevo descuento
    addDiscountBtn.addEventListener('click', () => {
        // Aquí iría la lógica para agregar nuevo descuento
        console.log('Agregando nuevo descuento');
    });
});
