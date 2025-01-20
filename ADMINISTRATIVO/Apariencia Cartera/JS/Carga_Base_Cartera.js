document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const universitySelect = document.getElementById('university');
    const periodSelect = document.getElementById('period');
    
    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    // Click to select file
    dropZone.querySelector('.select-file-btn').addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const file = files[0];
        if (validateFile(file)) {
            uploadBtn.disabled = false;
            showNotification('Archivo seleccionado correctamente', 'success');
        }
    }

    function validateFile(file) {
        const validTypes = ['.xlsx', '.xls'];
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!validTypes.includes(fileExtension)) {
            showNotification('Formato de archivo no válido', 'error');
            return false;
        }
        return true;
    }

    uploadBtn.addEventListener('click', () => {
        if (!universitySelect.value || !periodSelect.value) {
            showNotification('Por favor complete todos los campos', 'error');
            return;
        }
        
        // Simulate file upload
        uploadBtn.disabled = true;
        simulateFileUpload();
    });

    function simulateFileUpload() {
        const progress = 0;
        showNotification('Subiendo archivo...', 'success');
        
        setTimeout(() => {
            addFileToHistory({
                name: fileInput.files[0].name,
                university: universitySelect.options[universitySelect.selectedIndex].text,
                period: periodSelect.value,
                status: 'Recibido',
                date: new Date().toLocaleDateString()
            });
            
            showNotification('Archivo cargado exitosamente', 'success');
            resetForm();
        }, 2000);
    }

    function addFileToHistory(file) {
        const tbody = document.querySelector('#fileHistory tbody');
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${file.name}</td>
            <td>${file.university}</td>
            <td>${file.period}</td>
            <td>${file.status}</td>
            <td>${file.date}</td>
            <td>
                <button onclick="viewFile('${file.name}')" class="action-btn">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="deleteFile('${file.name}')" class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    }

    function resetForm() {
        fileInput.value = '';
        universitySelect.value = '';
        periodSelect.value = '';
        uploadBtn.disabled = true;
    }
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// File actions
function viewFile(fileName) {
    showNotification(`Visualizando ${fileName}`, 'success');
}

function deleteFile(fileName) {
    if (confirm(`¿Está seguro de eliminar ${fileName}?`)) {
        const row = event.target.closest('tr');
        row.remove();
        showNotification(`Archivo ${fileName} eliminado`, 'success');
    }
}
