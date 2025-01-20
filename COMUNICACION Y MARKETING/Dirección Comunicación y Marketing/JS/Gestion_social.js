document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    const engagementCtx = document.getElementById('engagementChart').getContext('2d');
    const conversionCtx = document.getElementById('conversionChart').getContext('2d');

    const engagementChart = new Chart(engagementCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Instagram',
                data: [4.2, 4.5, 4.8, 4.6, 5.0, 4.8],
                borderColor: '#2563eb',
                tension: 0.4
            }, {
                label: 'Facebook',
                data: [3.8, 4.0, 3.9, 4.2, 4.1, 4.3],
                borderColor: '#3b82f6',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    const conversionChart = new Chart(conversionCtx, {
        type: 'bar',
        data: {
            labels: ['Pauta 1', 'Pauta 2', 'Pauta 3', 'Pauta 4'],
            datasets: [{
                label: 'Leads Generados',
                data: [45, 38, 52, 31],
                backgroundColor: '#3b82f6'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Sample Posts Data
    let postsData = [
        {
            date: '2024-01-15',
            platform: 'Instagram',
            type: 'Imagen',
            status: 'Publicada',
            engagement: '4.8%',
            content: 'Contenido de ejemplo'
        },
        {
            date: '2024-01-16',
            platform: 'Facebook',
            type: 'Video',
            status: 'Programada',
            engagement: '3.9%',
            content: 'Contenido de ejemplo'
        }
    ];

    // Render Posts Table
    function renderPostsTable(data) {
        const tableBody = document.getElementById('postsTableBody');
        tableBody.innerHTML = data.map(post => `
            <tr>
                <td>${formatDate(post.date)}</td>
                <td>${post.platform}</td>
                <td>${post.type}</td>
                <td>${post.status}</td>
                <td>${post.engagement}</td>
                <td>
                    <button onclick="showDetails('${post.date}')" class="action-btn">
                        Ver detalles
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Format date helper function
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Filter Functionality
    function filterPosts() {
        const platformFilter = document.getElementById('platformFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        const filteredData = postsData.filter(post => {
            const matchPlatform = platformFilter === 'all' || post.platform.toLowerCase() === platformFilter;
            const matchStatus = statusFilter === 'all' || post.status.toLowerCase() === statusFilter;
            return matchPlatform && matchStatus;
        });

        renderPostsTable(filteredData);
    }

    document.getElementById('platformFilter').addEventListener('change', filterPosts);
    document.getElementById('statusFilter').addEventListener('change', filterPosts);

    // Create Post Modal Functionality
    const createPostBtn = document.getElementById('createPostBtn');
    const createPostModal = document.getElementById('createPostModal');
    const createPostForm = document.getElementById('createPostForm');

    createPostBtn.addEventListener('click', () => {
        createPostModal.style.display = 'block';
    });

    // Close modals when clicking on X
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form submission
    createPostForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newPost = {
            date: document.getElementById('postDate').value,
            platform: document.getElementById('postPlatform').value,
            type: document.getElementById('postType').value,
            content: document.getElementById('postContent').value,
            status: document.getElementById('postStatus').value,
            engagement: '0%'
        };

        // Add to posts data
        postsData.push(newPost);
        
        // Update table
        filterPosts();
        
        // Close modal and reset form
        createPostModal.style.display = 'none';
        createPostForm.reset();

        // Show success notification
        showNotification('Publicación creada exitosamente');
    });

    // Cancel button functionality
    document.querySelector('.cancel-btn').addEventListener('click', () => {
        createPostModal.style.display = 'none';
        createPostForm.reset();
    });

    // Details Modal Functionality
    window.showDetails = function(date) {
        const post = postsData.find(p => p.date === date);
        const modal = document.getElementById('detailModal');
        modal.style.display = 'block';
        
        document.getElementById('modalContent').innerHTML = `
            <h3>Detalles para ${formatDate(date)}</h3>
            <p>Plataforma: ${post.platform}</p>
            <p>Tipo: ${post.type}</p>
            <p>Estado: ${post.status}</p>
            <p>Engagement: ${post.engagement}</p>
            <p>Contenido: ${post.content}</p>
            <div class="metrics">
                <p>Likes: 245</p>
                <p>Comentarios: 23</p>
                <p>Compartidos: 12</p>
            </div>
        `;
    };

    // Notification System
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initial render
    renderPostsTable(postsData);
});
