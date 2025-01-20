document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const userInfo = document.getElementById('userInfo');
    const userMenu = document.getElementById('userMenu');
    const mainContent = document.getElementById('mainContent');

    // Sidebar Toggle Functionality
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        localStorage.setItem('sidebarState', sidebar.classList.contains('collapsed'));
    });

    // Restore Sidebar State
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'true') {
        sidebar.classList.add('collapsed');
    }

    // User Menu Toggle
    userInfo.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('active');
    });

    // Close User Menu on Outside Click
    document.addEventListener('click', (e) => {
        if (!userInfo.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Teams Data
    const teamDianaMembers = [
        { name: "Alison Gutierrez", suscripciones: 32, seguimientos: 45, noResponde: 20, noInteresado: 12, equivocado: 3 },
        { name: "Estefania Rodriguez", suscripciones: 28, seguimientos: 50, noResponde: 18, noInteresado: 10, equivocado: 2 },
        { name: "Ana Venegas", suscripciones: 35, seguimientos: 48, noResponde: 22, noInteresado: 15, equivocado: 4 },
        { name: "Daniela Muñoz", suscripciones: 30, seguimientos: 52, noResponde: 19, noInteresado: 11, equivocado: 2 },
        { name: "Naomi Mateus", suscripciones: 29, seguimientos: 47, noResponde: 21, noInteresado: 13, equivocado: 3 },
        { name: "Francy Cortes", suscripciones: 31, seguimientos: 49, noResponde: 23, noInteresado: 14, equivocado: 2 },
        { name: "Diego Ruiz", suscripciones: 33, seguimientos: 46, noResponde: 17, noInteresado: 9, equivocado: 2 },
        { name: "Brayan Montenegro", suscripciones: 27, seguimientos: 43, noResponde: 16, noInteresado: 8, equivocado: 2 }
    ];

    const teamNicolMembers = [
        { name: "Andrea Meneses", suscripciones: 30, seguimientos: 48, noResponde: 19, noInteresado: 11, equivocado: 2 },
        { name: "Johana Niño", suscripciones: 34, seguimientos: 46, noResponde: 21, noInteresado: 13, equivocado: 3 },
        { name: "Yuli Hernandez", suscripciones: 29, seguimientos: 50, noResponde: 18, noInteresado: 10, equivocado: 2 },
        { name: "Ada Rangel", suscripciones: 31, seguimientos: 47, noResponde: 20, noInteresado: 12, equivocado: 3 },
        { name: "Paula Pedraza", suscripciones: 28, seguimientos: 49, noResponde: 22, noInteresado: 14, equivocado: 2 },
        { name: "Jose Sierra", suscripciones: 32, seguimientos: 45, noResponde: 17, noInteresado: 9, equivocado: 2 },
        { name: "Angie Villamor", suscripciones: 33, seguimientos: 44, noResponde: 16, noInteresado: 8, equivocado: 2 },
        { name: "Andrea Gonzalez", suscripciones: 27, seguimientos: 43, noResponde: 15, noInteresado: 7, equivocado: 2 }
    ];

    // Populate Tables Function
    function populateTable(tableId, teamData) {
        const tbody = document.getElementById(tableId);
        tbody.innerHTML = '';
        
        teamData.forEach(member => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="dashboard_${member.name.toLowerCase().replace(' ', '_')}.html">${member.name}</a></td>
                <td>${member.suscripciones}</td>
                <td>${member.seguimientos}</td>
                <td>${member.noResponde}</td>
                <td>${member.noInteresado}</td>
                <td>${member.equivocado}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Initialize Tables
    populateTable('teamDianaTable', teamDianaMembers);
    populateTable('teamNicolTable', teamNicolMembers);

    // Period Selector Functionality
    const periodSelector = document.getElementById('periodSelector');
    periodSelector.addEventListener('change', (e) => {
        updateDataForPeriod(e.target.value);
    });

    function updateDataForPeriod(period) {
        // Implement period-based data update logic here
        console.log(`Updating data for period: ${period}`);
        // You can add API calls or data processing here
    }

    // Mobile Responsiveness
    function handleResize() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
});
