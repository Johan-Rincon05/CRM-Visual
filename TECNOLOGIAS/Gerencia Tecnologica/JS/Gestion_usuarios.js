document.addEventListener('DOMContentLoaded', function() {
    // Mock data for users
    let users = [
        { id: 1, name: 'Juan Pérez', email: 'juan@empresa.com', role: 'admin', area: 'IT', status: 'active' },
        { id: 2, name: 'María García', email: 'maria@empresa.com', role: 'supervisor', area: 'RRHH', status: 'active' },
        { id: 3, name: 'Carlos López', email: 'carlos@empresa.com', role: 'user', area: 'Ventas', status: 'inactive' }
    ];

    const modal = document.getElementById('userModal');
    const newUserBtn = document.getElementById('newUserBtn');
    const closeModal = document.getElementById('closeModal');
    const userForm = document.getElementById('userForm');
    const searchInput = document.getElementById('searchInput');
    const areaFilter = document.getElementById('areaFilter');
    const roleFilter = document.getElementById('roleFilter');
    const statusFilter = document.getElementById('statusFilter');

    function renderUsers(filteredUsers = users) {
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        filteredUsers.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.area}</td>
                <td><span class="status-badge status-${user.status}">${user.status === 'active' ? 'Activo' : 'Inactivo'}</span></td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editUser(${user.id})">✏️</button>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">🗑️</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase();
        const areaValue = areaFilter.value;
        const roleValue = roleFilter.value;
        const statusValue = statusFilter.value;

        const filtered = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm) || 
                                user.email.toLowerCase().includes(searchTerm);
            const matchesArea = !areaValue || user.area === areaValue;
            const matchesRole = !roleValue || user.role === roleValue;
            const matchesStatus = !statusValue || user.status === statusValue;

            return matchesSearch && matchesArea && matchesRole && matchesStatus;
        });

        renderUsers(filtered);
    }

    // Event Listeners
    newUserBtn.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
        userForm.reset();
        modal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form submission logic here
        modal.style.display = 'none';
    });

    searchInput.addEventListener('input', filterUsers);
    areaFilter.addEventListener('change', filterUsers);
    roleFilter.addEventListener('change', filterUsers);
    statusFilter.addEventListener('change', filterUsers);

    // Initialize table
    renderUsers();

    // Global functions for edit and delete
    window.editUser = function(userId) {
        const user = users.find(u => u.id === userId);
        if (user) {
            document.getElementById('modalTitle').textContent = 'Editar Usuario';
            document.getElementById('userName').value = user.name;
            document.getElementById('userEmail').value = user.email;
            document.getElementById('userRole').value = user.role;
            document.getElementById('userArea').value = user.area;
            document.getElementById('userStatus').value = user.status;
            modal.style.display = 'block';
        }
    };

    window.deleteUser = function(userId) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            users = users.filter(u => u.id !== userId);
            renderUsers();
        }
    };
});
