let editingRow = null;
let hasUpdatedChat = false;
let tempRowData = null;
let tempRow = null;

document.addEventListener('DOMContentLoaded', function() {
    const tableRows = document.querySelectorAll('#leadsTableBody tr');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const userInfo = document.getElementById('userInfo');
    const userMenu = document.getElementById('userMenu');

    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const data = {
                nombre: this.cells[0].textContent,
                pauta: this.cells[1].textContent,
                telefono: this.cells[2].textContent,
                correo: this.cells[3].textContent,
                ciudad: this.cells[4].textContent,
                estado: this.cells[5].textContent
            };
            
            // Mostrar el modal
            const modalOverlay = document.getElementById('modal-overlay');
            modalOverlay.style.display = 'flex';
            
            // Llenar los campos del formulario con los datos
            document.getElementById('nombres').value = data.nombre;
            document.getElementById('email').value = data.correo;
            document.getElementById('celular').value = data.telefono;
            
            // Activar el primer tab por defecto
            switchTab('form');
        });
    });
    
    // Toggle sidebar
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // Toggle user menu
    userInfo.addEventListener('click', () => {
        userMenu.classList.toggle('active');
        userInfo.querySelector('.dropdown-icon').style.transform = 
            userMenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    });

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
            userInfo.querySelector('.dropdown-icon').style.transform = 'rotate(0)';
        }
    });

    // Set active menu item based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
});

function handleFileUpload(input, documentType) {
    const file = input.files[0];
    const statusElement = document.getElementById(`${documentType}-status`);
    
    if (file) {
        if (file.type === 'application/pdf') {
            statusElement.textContent = 'Documento cargado exitosamente';
            statusElement.className = 'upload-status success';
        } else {
            statusElement.textContent = 'Por favor, seleccione un archivo PDF';
            statusElement.className = 'upload-status error';
            input.value = '';
        }
    }
}

function validatePaymentForSubscription() {
    const status = document.getElementById('status').value;
    if (status === 'suscrito') {
        const paymentMethod = document.getElementById('payment_method').value;
        const paymentProof = document.getElementById('payment_proof').files[0];
        
        if (!paymentMethod || !paymentProof) {
            let message = 'Para cambiar el estado a Suscrito, necesitas:';
            if (!paymentMethod) message += '\n- Seleccionar un método de pago';
            if (!paymentProof) message += '\n- Cargar el comprobante de pago';
            
            alert(message);
            document.getElementById('status').value = 'active';
            return false;
        }
    }
    return true;
}

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.modal-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    if (tabName === 'form') {
        document.querySelector('.modal-tab:nth-child(1)').classList.add('active');
        document.getElementById('formTab').classList.add('active');
    } else if (tabName === 'chat') {
        document.querySelector('.modal-tab:nth-child(2)').classList.add('active');
        document.getElementById('chatTab').classList.add('active');
    } else if (tabName === 'documents') {
        document.querySelector('.modal-tab:nth-child(3)').classList.add('active');
        document.getElementById('documentsTab').classList.add('active');
    }
}

function toggleSection(sectionId) {
    // Obtener todas las secciones
    const allSections = document.querySelectorAll('.section-content');
    const selectedSection = document.getElementById(`${sectionId}-section`);
    const icon = selectedSection.previousElementSibling.querySelector('i');
    
    // Manejar el ícono
    const allIcons = document.querySelectorAll('.section-header i');
    allIcons.forEach(i => {
        if(i !== icon) {
            i.classList.remove('fa-chevron-up');
            i.classList.add('fa-chevron-down');
        }
    });
    
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
    
    // Toggle de la sección seleccionada
    selectedSection.classList.toggle('active');
}



document.getElementById('searchInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#leadsTable tbody tr');
    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');
        const name = cells[0].textContent.toLowerCase();
        row.style.display = name.includes(filter) ? '' : 'none';
    });
});

function showWarningModal(data, row) {
    tempRowData = data;
    tempRow = row;
    document.getElementById('warning-modal').style.display = 'flex';
}

function acceptWarning() {
    document.getElementById('warning-modal').style.display = 'none';
    openModalAfterWarning(tempRowData, tempRow);
}

function cancelWarning() {
    document.getElementById('warning-modal').style.display = 'none';
    tempRowData = null;
    tempRow = null;
}

function openModal(data, row) {
    if (!hasUpdatedChat) {
        showWarningModal(data, row);
        return;
    }
    openModalAfterWarning(data, row);
}

function openModalAfterWarning(data, row) {
    const modalOverlay = document.getElementById('modal-overlay');
    const form = document.getElementById('leadForm');
    editingRow = row;
    
    form.full_name.value = data.full_name || '';
    form.pauta.value = data.pauta || '';
    form.phone.value = data.phone || '';
    form.email.value = data.email || '';
    form.city.value = data.city || '';
    form.status.value = data.status || 'active';
    
    modalOverlay.style.display = 'flex';
}

function addChatMessage() {
    const message = document.getElementById('chatMessage').value;
    const status = document.getElementById('chatStatus').value;
    const timestamp = new Date().toLocaleString();
    
    if (!message.trim()) return;
    
    const chatContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.innerHTML = `
        <div class="timestamp">${timestamp}</div>
        <strong>Estado: ${document.getElementById('chatStatus').options[document.getElementById('chatStatus').selectedIndex].text}</strong>
        <p>${message}</p>
    `;
    
    chatContainer.appendChild(messageElement);
    document.getElementById('chatMessage').value = '';
    document.getElementById('status').value = status;
    hasUpdatedChat = true;
}

function closeModal() {
    if (!hasUpdatedChat) {
        alert('Debes dejar un mensaje en el chat de seguimiento antes de cerrar.');
        return;
    }
    document.getElementById('modal-overlay').style.display = 'none';
    editingRow = null;
    hasUpdatedChat = false;
}

function createNewLead() {
    const modalOverlay = document.getElementById('modal-overlay');
    const form = document.getElementById('leadForm');
    
    form.reset();
    editingRow = null;
    hasUpdatedChat = true;
    document.querySelector('.modal-tab.active').textContent = "Crear Nuevo Lead";
    modalOverlay.style.display = 'flex';
}

function updateLead() {
    if (!validatePaymentForSubscription()) {
        return;
    }

    const form = document.getElementById('leadForm');
    const formData = new FormData(form);
    
    if (editingRow) {
        editingRow.cells[0].textContent = formData.get('full_name');
        editingRow.cells[1].textContent = formData.get('pauta');
        editingRow.cells[2].textContent = formData.get('phone');
        editingRow.cells[3].textContent = formData.get('email');
        editingRow.cells[4].textContent = formData.get('city');
        editingRow.cells[5].textContent = formData.get('status') === 'active' ? 'Seguimiento' : 'No le interesa';
        editingRow.cells[5].className = formData.get('status');
    } else {
        const table = document.getElementById('leadsTableBody');
        const newRow = table.insertRow(0);
        
        newRow.insertCell(0).textContent = formData.get('full_name');
        newRow.insertCell(1).textContent = formData.get('pauta');
        newRow.insertCell(2).textContent = formData.get('phone');
        newRow.insertCell(3).textContent = formData.get('email');
        newRow.insertCell(4).textContent = formData.get('city');
        
        const statusCell = newRow.insertCell(5);
        statusCell.textContent = formData.get('status') === 'active' ? 'Seguimiento' : 'No le interesa';
        statusCell.className = formData.get('status');
        
        newRow.addEventListener('click', function() {
            const rowData = {
                full_name: this.cells[0].textContent,
                pauta: this.cells[1].textContent,
                phone: this.cells[2].textContent,
                email: this.cells[3].textContent,
                city: this.cells[4].textContent,
                status: this.cells[5].classList.contains('active') ? 'active' : 'inactive'
            };
            openModal(rowData, this);
        });
    }
    
    updateStats();
    closeModal();
}

function updateStats() {
    const totalLeads = document.querySelectorAll('#leadsTableBody tr').length;
    const activeLeads = document.querySelectorAll('#leadsTableBody .active').length;
    
    document.querySelector('.stats .value').textContent = totalLeads;
    document.querySelectorAll('.stats .value')[1].textContent = activeLeads;
}


document.getElementById('createLeadBtn').addEventListener('click', () => {
    openSearchModal();
});


function openSearchModal() {
    document.getElementById('search-lead-modal').style.display = 'flex';
}

function closeSearchModal() {
    document.getElementById('search-lead-modal').style.display = 'none';
}


document.getElementById('validate-lead').addEventListener('click', async () => {
    const phone = document.getElementById('search-phone').value;
    const email = document.getElementById('search-email').value;
    
    try {
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        const exists = Math.random() > 0.5; 
        
        if (exists) {
            alert('Este lead ya existe y está asignado a: Juan Pérez');
        } else {
            closeSearchModal();
            createNewLead();
        }
    } catch (error) {
        console.error('Error validating lead:', error);
        alert('Error al validar el lead');
    }
});

document.getElementById('status').addEventListener('change', function() {
    if (this.value === 'suscrito') {
        validatePaymentForSubscription();
    }
});

document.getElementById('payment_proof').addEventListener('change', function() {
    const file = this.files[0];
    const statusElement = document.getElementById('payment-proof-status');
    
    if (file) {
        statusElement.textContent = 'Comprobante cargado exitosamente';
        statusElement.className = 'upload-status success';
    } else {
        statusElement.textContent = '';
        statusElement.className = 'upload-status';
    }
});

document.querySelectorAll('#leadsTable tbody tr').forEach(row => {
    row.addEventListener('click', function() {
        const rowData = {
            full_name: this.cells[0].textContent,
            pauta: this.cells[1].textContent,
            phone: this.cells[2].textContent,
            email: this.cells[3].textContent,
            city: this.cells[4].textContent,
            status: this.cells[5].classList.contains('active') ? 'active' : 'inactive'
        };
        openModal(rowData, this);
    });
});
