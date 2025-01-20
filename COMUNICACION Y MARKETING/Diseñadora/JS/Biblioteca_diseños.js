// Datos de ejemplo
const designsData = [
    {
        id: 1,
        name: "Campaña Verano 2024",
        category: "redes",
        date: "2024-01-15",
        description: "Serie de posts para Instagram sobre la nueva colección de verano",
        thumbnail: "https://picsum.photos/300/200?random=1",
        files: ["imagen1.png", "imagen2.jpg", "documento.pdf"],
        notes: "Paleta de colores: azul marino, coral y blanco"
    },
    {
        id: 2,
        name: "Banner Promocional",
        category: "publicidad",
        date: "2024-01-10",
        description: "Banner para sitio web principal",
        thumbnail: "https://picsum.photos/300/200?random=2",
        files: ["banner.png", "banner.pdf"],
        notes: "Versión final aprobada por marketing"
    },
    {
        id: 3,
        name: "Newsletter Mensual",
        category: "interno",
        date: "2024-01-20",
        description: "Newsletter interno para empleados",
        thumbnail: "https://picsum.photos/300/200?random=3",
        files: ["newsletter.pdf"],
        notes: "Distribuir el primer lunes de cada mes"
    },
    {
        id: 4,
        name: "Post Instagram Stories",
        category: "redes",
        date: "2024-01-25",
        description: "Serie de stories para promocionar nuevo producto",
        thumbnail: "https://picsum.photos/300/200?random=4",
        files: ["story1.png", "story2.png"],
        notes: "Programar publicación para las 18:00h"
    }
];

// Elementos DOM
const designsGrid = document.querySelector('.designs-grid');
const searchInput = document.querySelector('#searchInput');
const categoryFilter = document.querySelector('#categoryFilter');
const dateFilter = document.querySelector('#dateFilter');
const newDesignModal = document.querySelector('#newDesignModal');
const viewDesignModal = document.querySelector('#viewDesignModal');
const addNewBtn = document.querySelector('#addNewBtn');
const dropZone = document.querySelector('#dropZone');

// Funciones principales
function displayDesigns(designs) {
    console.log('Displaying designs:', designs);
    designsGrid.innerHTML = '';
    designs.forEach(design => {
        const card = createDesignCard(design);
        designsGrid.appendChild(card);
    });
}

function createDesignCard(design) {
    const card = document.createElement('div');
    card.className = 'design-card';
    card.innerHTML = `
        <img src="${design.thumbnail}" alt="${design.name}" class="design-image">
        <div class="design-info">
            <h3 class="design-title">${design.name}</h3>
            <span class="design-category category-${design.category}">
                ${getCategoryName(design.category)}
            </span>
            <p class="design-date">${formatDate(design.date)}</p>
        </div>
    `;
    
    card.addEventListener('click', () => showDesignDetails(design));
    return card;
}

function showDesignDetails(design) {
    const designDetails = document.querySelector('#designDetails');
    designDetails.innerHTML = `
        <h2>${design.name}</h2>
        <span class="design-category category-${design.category}">
            ${getCategoryName(design.category)}
        </span>
        <p class="design-date">Creado: ${formatDate(design.date)}</p>
        <p class="design-description">${design.description}</p>
        <div class="design-files">
            <h3>Archivos disponibles:</h3>
            <ul>
                ${design.files.map(file => `
                    <li>
                        <a href="#" onclick="downloadFile('${file}')">
                            ${file}
                        </a>
                    </li>
                `).join('')}
            </ul>
        </div>
        <div class="design-notes">
            <h3>Notas:</h3>
            <p>${design.notes}</p>
        </div>
    `;
    
    viewDesignModal.style.display = 'block';
}

function getCategoryName(category) {
    const categories = {
        redes: 'Redes Sociales',
        publicidad: 'Publicidad',
        interno: 'Contenido Interno'
    };
    return categories[category] || category;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function filterDesigns() {
    let filteredDesigns = [...designsData];
    
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        filteredDesigns = filteredDesigns.filter(design =>
            design.name.toLowerCase().includes(searchTerm) ||
            design.description.toLowerCase().includes(searchTerm)
        );
    }
    
    const categoryValue = categoryFilter.value;
    if (categoryValue) {
        filteredDesigns = filteredDesigns.filter(design =>
            design.category === categoryValue
        );
    }
    
    const dateValue = dateFilter.value;
    if (dateValue) {
        const filterMonth = dateValue.substring(0, 7);
        filteredDesigns = filteredDesigns.filter(design =>
            design.date.startsWith(filterMonth)
        );
    }
    
    displayDesigns(filteredDesigns);
}

function setupDropZone() {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        dropZone.classList.add('drop-zone-active');
    }

    function unhighlight(e) {
        dropZone.classList.remove('drop-zone-active');
    }

    dropZone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    const fileList = document.createElement('div');
    fileList.className = 'file-list';
    
    [...files].forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <span>${formatFileSize(file.size)}</span>
        `;
        fileList.appendChild(fileItem);
    });
    
    dropZone.innerHTML = '';
    dropZone.appendChild(fileList);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function setupModals() {
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            newDesignModal.style.display = 'none';
            viewDesignModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === newDesignModal) newDesignModal.style.display = 'none';
        if (e.target === viewDesignModal) viewDesignModal.style.display = 'none';
    });

    addNewBtn.addEventListener('click', () => {
        newDesignModal.style.display = 'block';
    });
}

function setupNewDesignForm() {
    const form = document.querySelector('#newDesignForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newDesign = {
            id: designsData.length + 1,
            name: document.querySelector('#designName').value,
            category: document.querySelector('#designCategory').value,
            date: new Date().toISOString().split('T')[0],
            description: document.querySelector('#designDescription').value,
            thumbnail: 'https://picsum.photos/300/200?random=' + (designsData.length + 1),
            files: [],
            notes: ''
        };
        
        designsData.push(newDesign);
        displayDesigns(designsData);
        newDesignModal.style.display = 'none';
        form.reset();
    });
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    displayDesigns(designsData);
    setupDropZone();
    setupModals();
    setupNewDesignForm();
    
    searchInput.addEventListener('input', filterDesigns);
    categoryFilter.addEventListener('change', filterDesigns);
    dateFilter.addEventListener('change', filterDesigns);
});
