// Datos de ejemplo
let documents = [];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadDocuments();
    setupEventListeners();
});

function loadDocuments() {
    // Simular carga de documentos
    documents = [
        {
            id: 1,
            name: 'Factura 2024-001',
            category: 'facturacion',
            createdAt: '2024-01-15',
            updatedAt: '2024-01-15',
            fileUrl: '#'
        }
        // Agregar más documentos de ejemplo
    ];
    
    updateDocumentsGrid();
    updateCategoryCounts();
}

function setupEventListeners() {
    // Búsqueda en tiempo real
    document.getElementById('searchInput').addEventListener('input', filterDocuments);
    document.getElementById('categoryFilter').addEventListener('change', filterDocuments);
    document.getElementById('dateFilter').addEventListener('change', filterDocuments);
    
    // Formulario de subida
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);
}

function updateDocumentsGrid() {
    const container = document.getElementById('documentsContainer');
    container.innerHTML = '';

    documents.forEach(doc => {
        const card = createDocumentCard(doc);
        container.appendChild(card);
    });
}

function createDocumentCard(doc) {
    const card = document.createElement('div');
    card.className = 'document-card';
    
    card.innerHTML = `
        <i class="fas fa-file-alt"></i>
        <h4>${doc.name}</h4>
        <p>Creado: ${formatDate(doc.createdAt)}</p>
        <p>Actualizado: ${formatDate(doc.updatedAt)}</p>
        <button onclick="previewDocument('${doc.id}')">
            <i class="fas fa-eye"></i> Ver
        </button>
        <button onclick="downloadDocument('${doc.id}')">
            <i class="fas fa-download"></i> Descargar
        </button>
    `;
    
    return card;
}

function updateCategoryCounts() {
    const categories = ['facturacion', 'contratos', 'informes'];
    categories.forEach(category => {
        const count = documents.filter(doc => doc.category === category).length;
        const element = document.querySelector(`[data-category="${category}"] .doc-count`);
        if (element) element.textContent = count;
    });
}

function filterDocuments() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const date = document.getElementById('dateFilter').value;

    const filtered = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || doc.category === category;
        const matchesDate = !date || doc.createdAt.includes(date);
        
        return matchesSearch && matchesCategory && matchesDate;
    });

    updateDocumentsGrid(filtered);
}

function showUploadModal() {
    document.getElementById('uploadModal').style.display = 'block';
}

function closeUploadModal() {
    document.getElementById('uploadModal').style.display = 'none';
}

function handleUpload(e) {
    e.preventDefault();
    // Implementar lógica de subida
    closeUploadModal();
}

function previewDocument(id) {
    // Implementar previsualización
    const modal = document.getElementById('previewModal');
    modal.style.display = 'block';
}

function closePreviewModal() {
    document.getElementById('previewModal').style.display = 'none';
}

function downloadDocument(id) {
    // Implementar descarga
    console.log(`Descargando documento ${id}`);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES');
}
