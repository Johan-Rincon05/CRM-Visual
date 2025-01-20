document.addEventListener('DOMContentLoaded', function() {
    const eventosEjemplo = [
        {
            title: 'Publicación Instagram Stories',
            start: '2024-01-15T10:00:00',
            end: '2024-01-15T11:00:00',
            className: 'event-publication',
            description: 'Serie de stories sobre nuevo producto',
            participants: ['social', 'designer'],
            comments: [
                {
                    user: 'Designer',
                    text: 'Gráficos listos para revisión',
                    timestamp: '2024-01-14T15:30:00'
                }
            ]
        },
        {
            title: 'Reunión Estrategia Mensual',
            start: '2024-01-16T14:00:00',
            end: '2024-01-16T15:30:00',
            className: 'event-meeting',
            description: 'Revisión de KPIs y planificación',
            participants: ['social', 'director', 'designer'],
            comments: [
                {
                    user: 'Director',
                    text: 'Traer reporte de engagement del mes anterior',
                    timestamp: '2024-01-15T09:00:00'
                }
            ]
        },
        {
            title: 'Grabación Video TikTok',
            start: '2024-01-17T11:00:00',
            end: '2024-01-17T12:00:00',
            className: 'event-recording',
            description: 'Tendencia #MarketingTips',
            participants: ['social'],
            comments: []
        },
        {
            title: 'Entrega Diseños Campaña',
            start: '2024-01-18T16:00:00',
            end: '2024-01-18T16:30:00',
            className: 'event-design',
            description: 'Piezas gráficas para campaña de febrero',
            participants: ['designer', 'social'],
            comments: [
                {
                    user: 'Social',
                    text: 'Necesito formato vertical y horizontal',
                    timestamp: '2024-01-17T10:15:00'
                }
            ]
        },
        {
            title: 'Post LinkedIn',
            start: '2024-01-19T09:00:00',
            end: '2024-01-19T10:00:00',
            className: 'event-publication',
            description: 'Artículo sobre tendencias 2024',
            participants: ['social', 'director'],
            comments: []
        }
    ];

    const usuariosActivos = [
        {
            id: 1,
            name: 'Social Manager',
            color: '#3b82f6',
            initial: 'SM'
        },
        {
            id: 2,
            name: 'Director Marketing',
            color: '#22c55e',
            initial: 'DM'
        },
        {
            id: 3,
            name: 'Diseñadora',
            color: '#a855f7',
            initial: 'DS'
        }
    ];

    const comentariosRecientes = [
        {
            eventId: 1,
            userId: 2,
            text: 'Aprobado el contenido para stories',
            timestamp: new Date('2024-01-14T16:45:00')
        },
        {
            eventId: 2,
            userId: 1,
            text: 'Agregué los últimos KPIs al reporte',
            timestamp: new Date('2024-01-15T11:30:00')
        }
    ];

    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        locale: 'es',
        events: eventosEjemplo,
        select: function(info) {
            showEventModal('create', info);
        },
        eventClick: function(info) {
            showEventModal('edit', info);
        },
        eventDrop: function(info) {
            updateEvent(info.event);
        }
    });

    calendar.render();

    // Modal functionality
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.close');
    const addEventBtn = document.getElementById('addEventBtn');

    function showEventModal(type, info) {
        modal.style.display = 'block';
        if (type === 'edit' && info.event) {
            document.getElementById('eventTitle').value = info.event.title;
            document.getElementById('eventType').value = info.event.classNames[0].replace('event-', '');
            document.getElementById('eventDate').value = moment(info.event.start).format('YYYY-MM-DDTHH:mm');
            document.getElementById('eventDescription').value = info.event.extendedProps.description || '';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        document.getElementById('eventForm').reset();
    }

    closeBtn.onclick = closeModal;
    addEventBtn.onclick = () => showEventModal('create');

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    // Form handling
    document.getElementById('eventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eventData = {
            title: document.getElementById('eventTitle').value,
            type: document.getElementById('eventType').value,
            start: document.getElementById('eventDate').value,
            description: document.getElementById('eventDescription').value
        };

        calendar.addEvent({
            title: eventData.title,
            start: eventData.start,
            className: `event-${eventData.type}`,
            extendedProps: {
                description: eventData.description
            }
        });

        closeModal();
        updateTimeline();
    });

    // Event filtering
    document.getElementById('eventFilter').addEventListener('change', function(e) {
        const filterValue = e.target.value;
        calendar.getEvents().forEach(event => {
            if (filterValue === 'all' || event.classNames[0].includes(filterValue)) {
                event.setProp('display', 'auto');
            } else {
                event.setProp('display', 'none');
            }
        });
    });

    // Event search
    document.getElementById('searchEvent').addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        calendar.getEvents().forEach(event => {
            const eventTitle = event.title.toLowerCase();
            const eventDescription = (event.extendedProps.description || '').toLowerCase();
            if (eventTitle.includes(searchTerm) || eventDescription.includes(searchTerm)) {
                event.setProp('display', 'auto');
            } else {
                event.setProp('display', 'none');
            }
        });
    });

    // View controls
    document.getElementById('monthView').addEventListener('click', function() {
        calendar.changeView('dayGridMonth');
        updateViewButtons('monthView');
    });

    document.getElementById('weekView').addEventListener('click', function() {
        calendar.changeView('timeGridWeek');
        updateViewButtons('weekView');
    });

    function updateViewButtons(activeView) {
        document.querySelectorAll('.view-controls button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(activeView).classList.add('active');
    }

    function updateEvent(event) {
        console.log('Evento actualizado:', event.toPlainObject());
    }

    function updateTimeline() {
        const timeline = document.querySelector('.timeline');
        const events = calendar.getEvents();
        const today = moment();
        const weekFromNow = moment().add(7, 'days');
        
        const weekEvents = events.filter(event => {
            const eventDate = moment(event.start);
            return eventDate.isBetween(today, weekFromNow, 'day', '[]');
        });

        timeline.innerHTML = '<h3>Actividades de la semana</h3>';
        weekEvents.forEach(event => {
            timeline.innerHTML += `
                <div class="timeline-event ${event.classNames}">
                    <span class="event-time">${moment(event.start).format('HH:mm')}</span>
                    <span class="event-title">${event.title}</span>
                </div>
            `;
        });
    }

    // Initialize all systems
    setupNotifications();
    setupRealTimeCollaboration();
    setupCommentSystem();
    updateTimeline();

    // System setup functions
    function setupNotifications() {
        if ("Notification" in window) {
            Notification.requestPermission();
        }
    }

    function setupRealTimeCollaboration() {
        usuariosActivos.forEach(user => {
            const userBadge = document.createElement('span');
            userBadge.className = 'user-badge';
            userBadge.style.backgroundColor = user.color;
            userBadge.textContent = user.initial;
            document.querySelector('.user-info').appendChild(userBadge);
        });
    }

    function setupCommentSystem() {
        comentariosRecientes.forEach(comment => {
            const user = usuariosActivos.find(u => u.id === comment.userId);
            if (user) {
                console.log(`${user.name}: ${comment.text}`);
            }
        });
    }
});
