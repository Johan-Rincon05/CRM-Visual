document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const modal = document.getElementById('permissionsModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');

    function openPermissionsModal(userId) {
        modal.style.display = 'block';
        loadUserPermissions(userId);
    }

    function closePermissionsModal() {
        modal.style.display = 'none';
    }

    closeModal.onclick = closePermissionsModal;
    cancelBtn.onclick = closePermissionsModal;

    window.onclick = function(event) {
        if (event.target === modal) {
            closePermissionsModal();
        }
    }

    // Search functionality
    const searchInput = document.getElementById('searchUser');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const tableRows = document.querySelectorAll('#usersTableBody tr');
        
        tableRows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Checkbox hierarchy management
    const areaCheckboxes = document.querySelectorAll('.area-checkbox');
    areaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const areaSection = this.closest('.area-section');
            const roleCheckboxes = areaSection.querySelectorAll('.role-checkbox');
            const permissionCheckboxes = areaSection.querySelectorAll('.permissions-list input[type="checkbox"]');
            
            roleCheckboxes.forEach(roleBox => roleBox.checked = this.checked);
            permissionCheckboxes.forEach(permBox => permBox.checked = this.checked);
        });
    });

    const roleCheckboxes = document.querySelectorAll('.role-checkbox');
    roleCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const roleDiv = this.closest('.role');
            const permissionCheckboxes = roleDiv.querySelectorAll('.permissions-list input[type="checkbox"]');
            permissionCheckboxes.forEach(permBox => permBox.checked = this.checked);
            
            updateAreaCheckbox(this.closest('.area-section'));
        });
    });

    // Form submission
    const permissionsForm = document.getElementById('permissionsForm');
    permissionsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const permissions = collectPermissions();
        savePermissions(permissions);
    });

    // Helper functions
    function loadUserPermissions(userId) {
        // Simulated API call to get user permissions
        const mockUserData = {
            name: 'Juan Pérez',
            position: 'Auxiliar Administrativo',
            permissions: {
                documentos: true,
                dashboard_aux: true,
                revision_doc: false
                // Add more permissions as needed
            }
        };

        document.getElementById('modalUserName').textContent = mockUserData.name;
        document.getElementById('modalUserPosition').textContent = mockUserData.position;

        // Set checkboxes based on permissions
        Object.entries(mockUserData.permissions).forEach(([key, value]) => {
            const checkbox = document.querySelector(`input[name="${key}"]`);
            if (checkbox) checkbox.checked = value;
        });
    }

    function collectPermissions() {
        const permissions = {};
        const checkboxes = document.querySelectorAll('.permissions-list input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            permissions[checkbox.name] = checkbox.checked;
        });

        return permissions;
    }

    function savePermissions(permissions) {
        // Simulated API call to save permissions
        console.log('Saving permissions:', permissions);
        
        // Show success message
        alert('Permisos actualizados exitosamente');
        closePermissionsModal();
    }

    function updateAreaCheckbox(areaSection) {
        const areaCheckbox = areaSection.querySelector('.area-checkbox');
        const roleCheckboxes = areaSection.querySelectorAll('.role-checkbox');
        const allChecked = Array.from(roleCheckboxes).every(checkbox => checkbox.checked);
        const someChecked = Array.from(roleCheckboxes).some(checkbox => checkbox.checked);
        
        areaCheckbox.checked = allChecked;
        areaCheckbox.indeterminate = someChecked && !allChecked;
    }

    // Sample data population
    function populateUsersTable() {
        const mockUsers = [
            {
                id: 1,
                name: 'Juan Pérez',
                email: 'juan@ejemplo.com',
                position: 'Auxiliar Administrativo',
                area: 'Administrativo',
                status: 'Activo'
            },
            // Add more mock users as needed
        ];

        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = mockUsers.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.position}</td>
                <td>${user.area}</td>
                <td><span class="status active">${user.status}</span></td>
                <td>
                    <button class="edit-permissions-btn" onclick="openPermissionsModal(${user.id})">
                        Editar Permisos
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Initialize table
    populateUsersTable();
});

// Make openPermissionsModal globally available
window.openPermissionsModal = function(userId) {
    const modal = document.getElementById('permissionsModal');
    modal.style.display = 'block';
    loadUserPermissions(userId);
};
